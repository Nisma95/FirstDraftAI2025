<?php

namespace App\Jobs;

use App\Models\Plan;
use App\Services\AIService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Exception;

class GenerateBusinessPlan implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    protected $plan;
    protected $answers;
    protected $businessIdea;
    protected $projectName;
    protected $projectDescription;

    /**
     * The number of times the job may be attempted.
     */
    public $tries = 3;

    /**
     * The maximum number of seconds the job can run.
     */
    public $timeout = 300; // 5 minutes

    /**
     * Create a new job instance.
     */
    public function __construct(Plan $plan, array $data)
    {
        $this->plan = $plan;
        $this->answers = $data['answers'];
        $this->businessIdea = $data['business_idea'];
        $this->projectName = $data['project_name'] ?? null;
        $this->projectDescription = $data['project_description'] ?? null;
    }

    /**
     * Execute the job.
     */
    public function handle(AIService $aiService): void
    {
        try {
            Log::info("Starting business plan generation job for plan: {$this->plan->id}");

            // Update status to show progress
            $this->plan->update(['status' => 'generating']);

            // Generate title first (quick win for user)
            try {
                $title = $aiService->generateTitleFromAnswers($this->answers, $this->projectName, $this->projectDescription);
                $this->plan->update(['title' => $title, 'status' => 'title_generated']);
                Log::info("Title generated for plan: {$this->plan->id}");
            } catch (Exception $e) {
                Log::error("Error generating title: " . $e->getMessage());
                $this->plan->update(['title' => ($this->projectName ?? 'Business') . ' - Business Plan']);
            }

            // Generate all sections in a single AI call
            try {
                Log::info("Generating all sections in batch for plan: {$this->plan->id}");
                $this->plan->update(['status' => 'generating_sections']);

                // Generate complete plan in one call
                $completePlan = $aiService->generateCompleteBusinessPlan([
                    'business_idea' => $this->businessIdea,
                    'project_name' => $this->projectName,
                    'project_description' => $this->projectDescription,
                    'answers' => $this->answers
                ]);

                // Update plan with all sections at once
                $this->plan->update(['ai_analysis' => $completePlan]);
                Log::info("All sections completed for plan: {$this->plan->id}");
            } catch (Exception $e) {
                Log::error("Error generating sections in batch: " . $e->getMessage());

                // Fallback to default content if batch generation fails
                $sections = [
                    'executive_summary' => $this->getDefaultSectionContent('executive_summary'),
                    'market_analysis' => $this->getDefaultSectionContent('market_analysis'),
                    'swot_analysis' => $this->getDefaultSectionContent('swot_analysis'),
                    'marketing_strategy' => $this->getDefaultSectionContent('marketing_strategy'),
                    'financial_plan' => $this->getDefaultSectionContent('financial_plan'),
                    'operational_plan' => $this->getDefaultSectionContent('operational_plan')
                ];
                $this->plan->update(['ai_analysis' => $sections]);
            }

            // Generate suggestions (optional, non-blocking)
            try {
                $this->plan->update(['status' => 'generating_suggestions']);
                $suggestions = $aiService->generateSuggestionsFromAnswers([
                    'business_idea' => $this->businessIdea,
                    'project_name' => $this->projectName,
                    'project_description' => $this->projectDescription,
                    'answers' => $this->answers
                ]);

                foreach ($suggestions as $suggestion) {
                    $this->plan->aiSuggestions()->create([
                        'suggestion_type' => $suggestion['type'],
                        'suggestion_content' => $suggestion['content'],
                        'priority' => $suggestion['priority'] ?? 'medium'
                    ]);
                }
            } catch (Exception $e) {
                Log::error("Error generating suggestions: " . $e->getMessage());
                // Continue without suggestions
            }

            // Mark as completed
            $this->plan->update(['status' => 'completed']);

            Log::info("Business plan generation job completed successfully for plan: {$this->plan->id}");
        } catch (Exception $e) {
            Log::error("Fatal error in business plan generation job for plan {$this->plan->id}: " . $e->getMessage());

            $this->plan->update([
                'status' => 'failed',
                'ai_analysis' => [
                    'error' => 'An error occurred during business plan generation: ' . $e->getMessage()
                ]
            ]);

            // Rethrow to trigger job retry if attempts remain
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Exception $exception): void
    {
        Log::error("Business plan generation job failed permanently for plan {$this->plan->id}: " . $exception->getMessage());

        $this->plan->update([
            'status' => 'failed',
            'ai_analysis' => [
                'error' => 'Business plan generation failed after multiple attempts: ' . $exception->getMessage()
            ]
        ]);
    }

    /**
     * Get default content for sections that fail to generate
     */
    private function getDefaultSectionContent(string $section): string
    {
        $defaults = [
            'executive_summary' => '<p>This section will be completed shortly. Please refresh the page in a few moments.</p>',
            'market_analysis' => '<p>Market analysis is being generated. Please check back in a moment.</p>',
            'swot_analysis' => '<p>SWOT analysis will be available shortly.</p>',
            'marketing_strategy' => '<p>Marketing strategy is being prepared.</p>',
            'financial_plan' => '<p>Financial plan will be generated shortly.</p>',
            'operational_plan' => '<p>Operational plan is being created.</p>'
        ];

        return $defaults[$section] ?? '<p>Content will be available shortly.</p>';
    }
}
