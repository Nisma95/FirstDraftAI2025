<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;

use App\Services\AIService;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'summary',
        'ai_analysis',
        'pdf_path',
        'status',
        'progress_percentage',
        'questioning_status',
        'ai_conversation_context',
    ];

    protected $casts = [
        'ai_analysis' => 'array',
        'ai_conversation_context' => 'array',
    ];

    // Existing relationships (keeping them for backwards compatibility)
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    // New dynamic questioning relationships
    public function questions(): HasMany
    {
        return $this->hasMany(PlanQuestion::class);
    }

    public function answers(): HasManyThrough
    {
        return $this->hasManyThrough(PlanAnswer::class, PlanQuestion::class);
    }

    /**
     * Get pending questions for this plan.
     */
    public function pendingQuestions(): HasMany
    {
        return $this->questions()->where('status', 'pending')->orderBy('order');
    }

    /**
     * Get answered questions for this plan.
     */
    public function answeredQuestions(): HasMany
    {
        return $this->questions()->where('status', 'answered')->orderBy('order');
    }

    /**
     * Get required questions for this plan.
     */
    public function requiredQuestions(): HasMany
    {
        return $this->questions()->where('is_required', true);
    }

    /**
     * Get the next pending question.
     */
    public function getNextQuestion(): ?PlanQuestion
    {
        return $this->pendingQuestions()->first();
    }

    /**
     * Check if all required questions are answered.
     */
    public function hasAnsweredAllRequiredQuestions(): bool
    {
        $requiredCount = $this->requiredQuestions()->count();
        $answeredRequiredCount = $this->requiredQuestions()
            ->where('status', 'answered')
            ->count();

        return $requiredCount === $answeredRequiredCount;
    }

    /**
     * Get questioning progress percentage.
     */
    public function getQuestioningProgress(): int
    {
        $totalQuestions = $this->questions()->count();
        $answeredQuestions = $this->answeredQuestions()->count();

        if ($totalQuestions === 0) return 0;

        return round(($answeredQuestions / $totalQuestions) * 100);
    }

    /**
     * Check if plan is ready for AI generation.
     */
    public function isReadyForGeneration(): bool
    {
        // Check if minimum required questions are answered
        $requiredTypes = ['business_model', 'target_market', 'competitive_advantage'];
        $answeredTypes = $this->answeredQuestions()
            ->pluck('question_type')
            ->toArray();

        foreach ($requiredTypes as $type) {
            if (!in_array($type, $answeredTypes)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get AI conversation context.
     */
    public function getAIContext(): array
    {
        return array_merge([
            'plan' => [
                'id' => $this->id,
                'title' => $this->title,
                'summary' => $this->summary,
            ],
            'project' => $this->project->toArray(),
            'answers' => $this->getAnswersSummary(),
        ], $this->ai_conversation_context ?? []);
    }

    /**
     * Update AI conversation context.
     */
    public function updateAIContext(array $newContext): void
    {
        $currentContext = $this->ai_conversation_context ?? [];
        $this->update([
            'ai_conversation_context' => array_merge($currentContext, $newContext)
        ]);
    }

    /**
     * Get summary of all answers for AI processing.
     */
    public function getAnswersSummary(): array
    {
        return $this->answeredQuestions()
            ->with('answer')
            ->get()
            ->map(function ($question) {
                return [
                    'type' => $question->question_type,
                    'question' => $question->question_text,
                    'answer' => $question->answer->answer_text,
                    'structured_data' => $question->answer->answer_data,
                    'keywords' => $question->answer->extractKeywords(),
                ];
            })
            ->toArray();
    }

    /**
     * Get answers by question type.
     */
    public function getAnswerByType(string $type): ?PlanAnswer
    {
        return $this->questions()
            ->where('question_type', $type)
            ->with('answer')
            ->first()
            ?->answer;
    }

    /**
     * Update questioning status.
     */
    public function updateQuestioningStatus(string $status): void
    {
        $this->update(['questioning_status' => $status]);
    }

    /**
     * Generate plan sections from answers.
     */
    public function generateFromAnswers(): array
    {
        $aiService = app(AIService::class);
        return $aiService->generateDynamicPlan($this);
    }

    /**
     * Check if plan has complete data.
     */
    public function hasCompleteData(): bool
    {
        // Check if all major sections are present
        $requiredSections = ['executive_summary', 'market_analysis', 'swot_analysis'];
        $aiAnalysis = $this->ai_analysis ?? [];

        foreach ($requiredSections as $section) {
            if (empty($aiAnalysis[$section])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get completion score based on answered questions and generated content.
     */
    public function getCompletionScore(): int
    {
        $questioningProgress = $this->getQuestioningProgress();
        $contentProgress = $this->getContentProgress();

        return round(($questioningProgress * 0.6) + ($contentProgress * 0.4));
    }

    /**
     * Get content generation progress.
     */
    private function getContentProgress(): int
    {
        $possibleSections = 6; // Total sections in business plan
        $generatedSections = 0;
        $aiAnalysis = $this->ai_analysis ?? [];

        $sections = [
            'executive_summary',
            'market_analysis',
            'swot_analysis',
            'marketing_strategy',
            'financial_plan',
            'operational_plan'
        ];

        foreach ($sections as $section) {
            if (!empty($aiAnalysis[$section])) {
                $generatedSections++;
            }
        }

        return round(($generatedSections / $possibleSections) * 100);
    }

    /**
     * Start AI questioning process.
     */
    public function startAIQuestioning(): array
    {
        $aiService = app(AIService::class);
        return $aiService->startDynamicQuestioning($this, [
            'project_industry' => $this->project->industry ?? null,
            'project_summary' => $this->summary,
        ]);
    }

    /**
     * Process next AI question.
     */
    public function processNextQuestion(PlanQuestion $question, array $answerData): array
    {
        $aiService = app(AIService::class);
        return $aiService->processAnswer($question, $answerData);
    }

    /**
     * Upgrade plan status when complete.
     */
    public function upgradeToCompleted(): void
    {
        if ($this->getCompletionScore() >= 80) {
            $this->update(['status' => 'completed']);
        }
    }

    /**
     * Update PDF path for the plan.
     */
    public function updatePdfPath(string $path): void
    {
        $this->update(['pdf_path' => $path]);
    }

    /**
     * Update progress percentage.
     */
    public function updateProgress(): void
    {
        $progress = $this->getCompletionScore();
        $this->update(['progress_percentage' => $progress]);
    }

    /**
     * Scopes
     */
    public function scopeWithQuestioningData($query)
    {
        return $query->with(['questions.answer', 'project']);
    }

    public function scopeReadyForGeneration($query)
    {
        return $query->whereHas('questions', function ($q) {
            $q->where('question_type', 'business_model')
                ->where('status', 'answered');
        })
            ->whereHas('questions', function ($q) {
                $q->where('question_type', 'target_market')
                    ->where('status', 'answered');
            });
    }

    // Legacy methods for backwards compatibility with existing code
    public function finance(): HasOne
    {
        return $this->hasOne(Finance::class);
    }

    public function market(): HasOne
    {
        return $this->hasOne(Market::class);
    }

    public function audiences(): HasMany
    {
        return $this->hasMany(Audience::class);
    }

    public function goals(): HasMany
    {
        return $this->hasMany(Goal::class);
    }

    public function aiSuggestions(): HasMany
    {
        return $this->hasMany(AISuggestion::class);
    }
}
