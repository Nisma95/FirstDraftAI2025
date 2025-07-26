<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Market;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class MarketController extends Controller
{
    /**
     * Display the specified market analysis.
     */
    public function show(Plan $plan)
    {
        Gate::authorize('view', $plan);

        $market = $plan->market ?? new Market(['plan_id' => $plan->id]);

        return Inertia::render('Plans/Market/Show', [
            'plan' => $plan,
            'market' => $market,
            'industries' => $this->getIndustryOptions(),
            'marketSizes' => $this->getMarketSizeOptions()
        ]);
    }

    /**
     * Show the form for editing the market analysis.
     */
    public function edit(Plan $plan)
    {
        Gate::authorize('update', $plan);

        $market = $plan->market ?? $plan->market()->create();

        return Inertia::render('Plans/Market/Edit', [
            'plan' => $plan,
            'market' => $market,
            'industries' => $this->getIndustryOptions(),
            'marketSizes' => $this->getMarketSizeOptions(),
            'competitorTemplates' => $this->getCompetitorTemplates(),
            'riskCategories' => $this->getRiskCategories()
        ]);
    }

    /**
     * Update the market analysis.
     */
    public function update(Request $request, Plan $plan)
    {
        Gate::authorize('update', $plan);

        $validated = $request->validate([
            'industry' => 'nullable|string|max:255',
            'target_market' => 'nullable|string',
            'market_size' => 'nullable|string|max:255',
            'trends' => 'nullable|array',
            'trends.*' => 'string',
            'competitors' => 'nullable|array',
            'competitors.*.name' => 'required|string|max:255',
            'competitors.*.market_share' => 'nullable|numeric|min:0|max:100',
            'competitors.*.strengths' => 'nullable|string',
            'competitors.*.weaknesses' => 'nullable|string',
            'competitive_advantage' => 'nullable|string',
            'risks' => 'nullable|array',
            'risks.*.description' => 'required|string',
            'risks.*.level' => 'required|in:low,medium,high,critical',
            'risks.*.mitigation' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $market = $plan->market ?? $plan->market()->create();
        $market->updateFromArray($validated);

        // Trigger AI analysis update if significant changes
        if ($this->hasSignificantChanges($market, $validated)) {
            dispatch(new \App\Jobs\UpdatePlanAIAnalysis($plan));
        }

        return back()->with('success', 'تم تحديث تحليل السوق بنجاح');
    }

    /**
     * Analyze competitors automatically.
     */
    public function analyzeCompetitors(Plan $plan)
    {
        Gate::authorize('update', $plan);

        try {
            $market = $plan->market;

            if (!$market || !$market->industry) {
                return back()->with('error', 'يرجى تحديد الصناعة أولاً');
            }

            $competitors = app(\App\Services\AIService::class)->analyzeCompetitors([
                'industry' => $market->industry,
                'target_market' => $market->target_market,
                'location' => $plan->project->location,
            ]);

            $market->update([
                'competitors' => array_merge($market->competitors ?? [], $competitors)
            ]);

            return back()->with('success', 'تم تحليل المنافسين بنجاح');
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء تحليل المنافسين');
        }
    }

    /**
     * Generate market insights using AI.
     */
    public function generateInsights(Plan $plan)
    {
        Gate::authorize('update', $plan);

        try {
            $market = $plan->market;

            if (!$market || !$market->hasBasicData()) {
                return back()->with('error', 'يرجى إضافة البيانات الأساسية أولاً');
            }

            $insights = app(\App\Services\AIService::class)->generateMarketInsights([
                'industry' => $market->industry,
                'target_market' => $market->target_market,
                'market_size' => $market->market_size,
                'trends' => $market->trends,
                'competitors' => $market->competitors,
            ]);

            $market->update([
                'trends' => array_merge($market->trends ?? [], $insights['trends'] ?? []),
                'competitive_advantage' => $insights['competitive_advantage'] ?? $market->competitive_advantage,
                'notes' => $market->notes . "\n\n" . ($insights['additional_notes'] ?? '')
            ]);

            return back()->with('success', 'تم توليد رؤى السوق بنجاح');
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء توليد رؤى السوق');
        }
    }

    /**
     * Get industry options.
     */
    private function getIndustryOptions(): array
    {
        return [
            'technology' => 'التكنولوجيا',
            'retail' => 'التجارة',
            'healthcare' => 'الرعاية الصحية',
            'education' => 'التعليم',
            'finance' => 'التمويل',
            'real_estate' => 'العقارات',
            'manufacturing' => 'التصنيع',
            'services' => 'الخدمات',
            'food' => 'الأغذية',
            'transportation' => 'النقل',
            'entertainment' => 'الترفيه',
            'other' => 'أخرى'
        ];
    }

    /**
     * Get market size options.
     */
    private function getMarketSizeOptions(): array
    {
        return [
            'small' => 'صغير (أقل من 1M)',
            'medium' => 'متوسط (1M - 10M)',
            'large' => 'كبير (10M - 100M)',
            'very_large' => 'كبير جداً (أكثر من 100M)',
            'custom' => 'تحديد مخصص'
        ];
    }

    /**
     * Get competitor analysis templates.
     */
    private function getCompetitorTemplates(): array
    {
        return [
            'direct' => [
                'name' => '',
                'type' => 'direct',
                'market_share' => 0,
                'strengths' => '',
                'weaknesses' => '',
                'pricing_strategy' => '',
                'target_audience' => ''
            ],
            'indirect' => [
                'name' => '',
                'type' => 'indirect',
                'market_share' => 0,
                'strengths' => '',
                'weaknesses' => '',
                'alternative_offered' => ''
            ]
        ];
    }

    /**
     * Get risk categories.
     */
    private function getRiskCategories(): array
    {
        return [
            'market' => 'مخاطر السوق',
            'competition' => 'المنافسة',
            'regulatory' => 'التنظيمية',
            'technology' => 'التكنولوجية',
            'financial' => 'المالية',
            'operational' => 'التشغيلية',
            'other' => 'أخرى'
        ];
    }

    /**
     * Check if the update has significant changes.
     */
    private function hasSignificantChanges(Market $market, array $newData): bool
    {
        $significantFields = ['industry', 'target_market', 'market_size', 'competitive_advantage'];

        foreach ($significantFields as $field) {
            if (isset($newData[$field]) && $market->$field !== $newData[$field]) {
                return true;
            }
        }

        return false;
    }
}
