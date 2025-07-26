<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Finance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Services\AIService;
use Inertia\Inertia;

class FinanceController extends Controller
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Display the financial analysis.
     */
    public function show(Plan $plan)
    {
        Gate::authorize('view', $plan);

        $finance = $plan->finance ?? new Finance(['plan_id' => $plan->id]);

        return Inertia::render('Plans/Finance/Show', [
            'plan' => $plan,
            'finance' => $finance,
            'summary' => $finance->getFinancialSummary(),
            'cashFlow' => $finance->getProjectedCashFlow(12),
            'recommendations' => $this->getFinancialRecommendations($finance),
        ]);
    }

    /**
     * Show the form for editing the financial data.
     */
    public function edit(Plan $plan)
    {
        Gate::authorize('update', $plan);

        $finance = $plan->finance ?? $plan->finance()->create();

        return Inertia::render('Plans/Finance/Edit', [
            'plan' => $plan,
            'finance' => $finance,
            'industryAverages' => $this->getIndustryAverages($plan->market->industry ?? null),
            'fundingSources' => $this->getFundingSourceOptions(),
        ]);
    }

    /**
     * Update the financial data.
     */
    public function update(Request $request, Plan $plan)
    {
        Gate::authorize('update', $plan);

        $validated = $request->validate([
            'initial_budget' => 'nullable|numeric|min:0',
            'expected_income' => 'nullable|numeric|min:0',
            'monthly_expenses' => 'nullable|numeric|min:0',
            'profit_estimate' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);

        $finance = $plan->finance ?? $plan->finance()->create();

        // Auto-calculate profit estimate if not provided
        if (!isset($validated['profit_estimate']) && isset($validated['expected_income'], $validated['monthly_expenses'])) {
            $validated['profit_estimate'] = $validated['expected_income'] - $validated['monthly_expenses'];
        }

        $finance->update($validated);

        // Trigger AI analysis update
        if ($this->hasSignificantChanges($finance, $validated)) {
            dispatch(new \App\Jobs\UpdatePlanAIAnalysis($plan));
        }

        return back()->with('success', 'تم تحديث البيانات المالية بنجاح');
    }

    /**
     * Generate financial projections using AI.
     */
    public function generateProjections(Plan $plan)
    {
        Gate::authorize('update', $plan);

        try {
            $finance = $plan->finance;

            if (!$finance || !$finance->hasBasicFinancials()) {
                return back()->with('error', 'يرجى إضافة البيانات الأساسية أولاً');
            }

            $projections = $this->aiService->generateFinancialProjections([
                'industry' => $plan->market->industry ?? null,
                'market_size' => $plan->market->market_size ?? null,
                'initial_budget' => $finance->initial_budget,
                'expected_income' => $finance->expected_income,
                'monthly_expenses' => $finance->monthly_expenses,
                'target_market' => $plan->market->target_market ?? null,
            ]);

            return Inertia::render('Plans/Finance/Projections', [
                'plan' => $plan,
                'projections' => $projections,
                'currentFinance' => $finance,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء توليد التوقعات المالية');
        }
    }

    /**
     * Analyze funding requirements.
     */
    public function analyzeFunding(Plan $plan)
    {
        Gate::authorize('update', $plan);

        try {
            $finance = $plan->finance;

            if (!$finance || !$finance->initial_budget) {
                return back()->with('error', 'يرجى تحديد الميزانية المطلوبة أولاً');
            }

            $fundingAnalysis = $this->aiService->analyzeFundingRequirements([
                'initial_budget' => $finance->initial_budget,
                'industry' => $plan->market->industry ?? null,
                'business_stage' => $plan->project->status ?? 'idea',
                'market_size' => $plan->market->market_size ?? null,
                'projected_revenue' => $finance->expected_income * 12,
            ]);

            return Inertia::render('Plans/Finance/FundingAnalysis', [
                'plan' => $plan,
                'analysis' => $fundingAnalysis,
                'finance' => $finance,
                'fundingSources' => $this->getFundingSourceOptions(),
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء تحليل التمويل');
        }
    }

    /**
     * Generate cost breakdown analysis.
     */
    public function generateCostBreakdown(Plan $plan)
    {
        Gate::authorize('update', $plan);

        try {
            $finance = $plan->finance;

            if (!$finance || !$finance->monthly_expenses) {
                return back()->with('error', 'يرجى تحديد المصروفات الشهرية أولاً');
            }

            $costBreakdown = $this->aiService->generateCostBreakdown([
                'industry' => $plan->market->industry ?? null,
                'monthly_expenses' => $finance->monthly_expenses,
                'initial_budget' => $finance->initial_budget,
                'business_type' => $plan->project->industry ?? null,
            ]);

            $finance->update([
                'notes' => $finance->notes . "\n\nتحليل المصروفات:\n" .
                    json_encode($costBreakdown, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
            ]);

            return back()->with('success', 'تم توليد تحليل المصروفات بنجاح');
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء تحليل المصروفات');
        }
    }

    /**
     * Get financial recommendations based on current data.
     */
    private function getFinancialRecommendations(Finance $finance): array
    {
        $recommendations = [];

        if (!$finance->hasBasicFinancials()) {
            $recommendations[] = [
                'type' => 'warning',
                'message' => 'يرجى إضافة البيانات المالية الأساسية',
            ];
        }

        if ($finance->profit_estimate !== null && $finance->profit_estimate <= 0) {
            $recommendations[] = [
                'type' => 'error',
                'message' => 'الربح المتوقع سالب - يرجى مراجعة الإيرادات والمصروفات',
            ];
        }

        if ($finance->break_even_months !== null && $finance->break_even_months > 24) {
            $recommendations[] = [
                'type' => 'warning',
                'message' => 'نقطة التعادل طويلة جداً (' . $finance->break_even_months . ' شهر)',
            ];
        }

        if ($finance->return_on_investment !== null && $finance->return_on_investment < 20) {
            $recommendations[] = [
                'type' => 'warning',
                'message' => 'العائد على الاستثمار منخفض (' . round($finance->return_on_investment, 1) . '%)',
            ];
        }

        if ($finance->isFinanciallyViable()) {
            $recommendations[] = [
                'type' => 'success',
                'message' => 'التوقعات المالية مقبولة وقابلة للتنفيذ',
            ];
        }

        return $recommendations;
    }

    /**
     * Get industry financial averages.
     */
    private function getIndustryAverages(?string $industry): array
    {
        // This would ideally fetch from a database or API
        // For now, returning sample data
        $averages = [
            'technology' => [
                'profit_margin' => 25,
                'monthly_expenses_ratio' => 70,
                'break_even_months' => 12,
            ],
            'retail' => [
                'profit_margin' => 10,
                'monthly_expenses_ratio' => 80,
                'break_even_months' => 6,
            ],
            'services' => [
                'profit_margin' => 20,
                'monthly_expenses_ratio' => 65,
                'break_even_months' => 8,
            ],
        ];

        return $averages[$industry] ?? [
            'profit_margin' => 15,
            'monthly_expenses_ratio' => 75,
            'break_even_months' => 10,
        ];
    }

    /**
     * Get funding source options.
     */
    private function getFundingSourceOptions(): array
    {
        return [
            'personal' => 'تمويل شخصي',
            'family' => 'الأصدقاء والعائلة',
            'bank_loan' => 'قرض بنكي',
            'venture_capital' => 'رأس المال المخاطر',
            'angel_investors' => 'المستثمرون الملائكة',
            'crowdfunding' => 'التمويل الجماعي',
            'government_grants' => 'منح حكومية',
            'accelerator' => 'برامج التسريع',
            'other' => 'أخرى',
        ];
    }

    /**
     * Check if the update has significant changes.
     */
    private function hasSignificantChanges(Finance $finance, array $newData): bool
    {
        $significantFields = ['initial_budget', 'expected_income', 'monthly_expenses'];

        foreach ($significantFields as $field) {
            if (isset($newData[$field]) && $finance->$field !== $newData[$field]) {
                // Check if change is more than 10%
                $oldValue = $finance->$field ?? 0;
                $newValue = $newData[$field];

                if ($oldValue > 0) {
                    $percentChange = abs(($newValue - $oldValue) / $oldValue * 100);
                    if ($percentChange > 10) {
                        return true;
                    }
                } elseif ($newValue > 0) {
                    return true;
                }
            }
        }

        return false;
    }
}
