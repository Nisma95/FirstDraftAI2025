<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AIAnalysisController extends Controller
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Analyze the plan using AI.
     */
    public function analyze(Plan $plan)
    {
        Gate::authorize('update', $plan);

        try {
            // Check if analysis was recently generated (avoid repeated calls)
            $cacheKey = "plan_ai_analysis_{$plan->id}";
            if (Cache::has($cacheKey)) {
                return back()->with('info', 'تم تحليل الخطة مؤخراً. يرجى الانتظار قليلاً قبل إعادة التحليل.');
            }

            // Gather all plan data for analysis
            $planData = $this->preparePlanDataForAnalysis($plan);

            // Generate comprehensive AI analysis
            $analysis = $this->aiService->generateComprehensiveAnalysis($planData);

            // Update plan with AI analysis
            $plan->update([
                'ai_analysis' => $analysis['sections'],
            ]);

            // Create AI suggestions
            foreach ($analysis['suggestions'] ?? [] as $suggestion) {
                $plan->aiSuggestions()->create([
                    'suggestion_type' => $suggestion['type'],
                    'suggestion_content' => $suggestion['content'],
                ]);
            }

            // Cache to prevent repeated calls
            Cache::put($cacheKey, true, now()->addMinutes(30));

            return back()->with('success', 'تم تحليل الخطة بنجاح وإضافة اقتراحات جديدة');
        } catch (\Exception $e) {
            \Log::error('AI Analysis Error: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ أثناء تحليل الخطة. يرجى المحاولة مرة أخرى.');
        }
    }

    /**
     * Generate executive summary.
     */
    public function generateExecutiveSummary(Plan $plan)
    {
        Gate::authorize('update', $plan);

        try {
            $planData = $this->preparePlanDataForAnalysis($plan);

            $summary = $this->aiService->generateExecutiveSummary($planData);

            $plan->update([
                'ai_analysis' => array_merge($plan->ai_analysis ?? [], [
                    'executive_summary' => $summary
                ])
            ]);

            return response()->json([
                'success' => true,
                'summary' => $summary
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء توليد الملخص التنفيذي'
            ], 500);
        }
    }

    /**
     * Generate SWOT analysis.
     */
    public function generateSWOT(Plan $plan)
    {
        Gate::authorize('update', $plan);

        try {
            // Check premium status for SWOT
            if ($plan->status !== 'premium' && auth()->user()->subscription_type !== 'premium') {
                return back()->with('error', 'تحليل SWOT متاح للمشتركين المتميزين فقط');
            }

            $planData = $this->preparePlanDataForAnalysis($plan);

            $swot = $this->aiService->generateSWOT($planData);

            $plan->update([
                'ai_analysis' => array_merge($plan->ai_analysis ?? [], [
                    'swot_analysis' => $swot
                ])
            ]);

            return back()->with('success', 'تم توليد تحليل SWOT بنجاح');
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء توليد تحليل SWOT');
        }
    }

    /**
     * Generate operational plan.
     */
    public function generateOperationalPlan(Plan $plan)
    {
        Gate::authorize('update', $plan);

        try {
            // Check premium status for operational plan
            if ($plan->status !== 'premium' && auth()->user()->subscription_type !== 'premium') {
                return back()->with('error', 'خطة التشغيل متاحة للمشتركين المتميزين فقط');
            }

            $planData = $this->preparePlanDataForAnalysis($plan);

            $operationalPlan = $this->aiService->generateOperationalPlan($planData);

            $plan->update([
                'ai_analysis' => array_merge($plan->ai_analysis ?? [], [
                    'operational_plan' => $operationalPlan
                ])
            ]);

            return back()->with('success', 'تم توليد خطة التشغيل بنجاح');
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء توليد خطة التشغيل');
        }
    }

    /**
     * Generate marketing strategy.
     */
    public function generateMarketingStrategy(Plan $plan)
    {
        Gate::authorize('update', $plan);

        try {
            $planData = $this->preparePlanDataForAnalysis($plan);

            $marketingStrategy = $this->aiService->generateMarketingStrategy($planData);

            $plan->update([
                'ai_analysis' => array_merge($plan->ai_analysis ?? [], [
                    'marketing_strategy' => $marketingStrategy
                ])
            ]);

            return back()->with('success', 'تم توليد استراتيجية التسويق بنجاح');
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء توليد استراتيجية التسويق');
        }
    }

    /**
     * Generate risks and mitigation strategies.
     */
    public function generateRiskAnalysis(Plan $plan)
    {
        Gate::authorize('update', $plan);

        try {
            $planData = $this->preparePlanDataForAnalysis($plan);

            $riskAnalysis = $this->aiService->generateRiskAnalysis($planData);

            $plan->update([
                'ai_analysis' => array_merge($plan->ai_analysis ?? [], [
                    'risk_analysis' => $riskAnalysis
                ])
            ]);

            return back()->with('success', 'تم توليد تحليل المخاطر بنجاح');
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء توليد تحليل المخاطر');
        }
    }

    /**
     * Get daily tasks recommendations.
     */
    public function getDailyTasks(Plan $plan)
    {
        Gate::authorize('view', $plan);

        try {
            $planData = $this->preparePlanDataForAnalysis($plan);
            $currentGoals = $plan->goals()->where('status', '!=', 'completed')->get();

            $tasks = $this->aiService->generateDailyTasks([
                'plan' => $planData,
                'current_goals' => $currentGoals->toArray(),
                'user_preferences' => auth()->user()->preferences ?? []
            ]);

            return response()->json([
                'success' => true,
                'tasks' => $tasks
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء توليد المهام اليومية'
            ], 500);
        }
    }

    /**
     * Get weekly progress report.
     */
    public function getWeeklyProgress(Plan $plan)
    {
        Gate::authorize('view', $plan);

        try {
            $weeklyData = [
                'completed_tasks' => $plan->goals()
                    ->whereHas('tasks', function ($query) {
                        $query->where('status', 'completed')
                            ->where('updated_at', '>=', now()->subWeek());
                    })->count(),
                'upcoming_deadlines' => $plan->goals()
                    ->whereBetween('due_date', [now(), now()->addWeek()])
                    ->get(),
                'recent_suggestions' => $plan->aiSuggestions()
                    ->where('created_at', '>=', now()->subWeek())
                    ->get()
            ];

            $report = $this->aiService->generateWeeklyReport($weeklyData);

            return response()->json([
                'success' => true,
                'report' => $report
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء توليد التقرير الأسبوعي'
            ], 500);
        }
    }

    /**
     * Check for opportunities and threats.
     */
    public function checkOpportunitiesThreats(Plan $plan)
    {
        Gate::authorize('view', $plan);

        try {
            $planData = $this->preparePlanDataForAnalysis($plan);
            $marketData = $this->getMarketTrends($plan);

            $analysis = $this->aiService->analyzeOpportunitiesThreats([
                'plan' => $planData,
                'market_trends' => $marketData,
                'competitors' => $plan->market->competitors ?? []
            ]);

            // Create alerts for critical opportunities/threats
            foreach ($analysis['critical_items'] ?? [] as $item) {
                $plan->aiSuggestions()->create([
                    'suggestion_type' => $item['type'],
                    'suggestion_content' => $item['content'],
                ]);
            }

            return response()->json([
                'success' => true,
                'analysis' => $analysis
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحليل الفرص والتهديدات'
            ], 500);
        }
    }

    /**
     * Get competitor comparison analysis.
     */
    public function compareWithCompetitors(Plan $plan)
    {
        Gate::authorize('view', $plan);

        try {
            $planData = $this->preparePlanDataForAnalysis($plan);
            $competitors = $plan->market->competitors ?? [];

            $comparison = $this->aiService->compareWithCompetitors([
                'plan' => $planData,
                'competitors' => $competitors,
                'differentiators' => $plan->market->competitive_advantage ?? ''
            ]);

            return response()->json([
                'success' => true,
                'comparison' => $comparison
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء المقارنة مع المنافسين'
            ], 500);
        }
    }

    /**
     * Prepare plan data for AI analysis.
     */
    private function preparePlanDataForAnalysis(Plan $plan): array
    {
        return [
            'plan' => [
                'id' => $plan->id,
                'title' => $plan->title,
                'summary' => $plan->summary,
                'status' => $plan->status,
            ],
            'project' => $plan->project->toArray(),
            'finance' => $plan->finance?->toArray(),
            'market' => $plan->market?->toArray(),
            'audiences' => $plan->audiences->toArray(),
            'goals' => $plan->goals->toArray(),
            'existing_analysis' => $plan->ai_analysis ?? []
        ];
    }

    /**
     * Get current market trends for analysis.
     */
    private function getMarketTrends(Plan $plan): array
    {
        // This would ideally fetch from a real market data API
        // For now, return sample trends based on industry
        $industry = $plan->market->industry ?? 'general';

        return Cache::remember("market_trends_{$industry}", now()->addHours(6), function () use ($industry) {
            // Placeholder for market trends data
            return [
                'growth_rate' => rand(5, 25),
                'emerging_trends' => [
                    'Digital transformation',
                    'AI integration',
                    'Sustainability focus'
                ],
                'economic_indicators' => [
                    'gdp_growth' => 4.2,
                    'inflation_rate' => 2.8,
                    'unemployment_rate' => 3.5
                ]
            ];
        });
    }
}
