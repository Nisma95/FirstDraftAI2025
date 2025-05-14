<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_question_id',
        'user_id',
        'answer_text',
        'answer_data',
        'confidence_score',
        'ai_analysis',
        'ai_suggestions',
        'analyzed_at',
    ];

    protected $casts = [
        'answer_data' => 'array',
        'ai_analysis' => 'array',
        'analyzed_at' => 'datetime',
    ];

    /**
     * Get the question this answer belongs to.
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(PlanQuestion::class, 'plan_question_id');
    }

    /**
     * Get the user who provided this answer.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the plan through the question.
     */
    public function plan()
    {
        return $this->hasOneThrough(Plan::class, PlanQuestion::class, 'id', 'id', 'plan_question_id', 'plan_id');
    }

    /**
     * Check if this answer has been analyzed by AI.
     */
    public function isAnalyzed(): bool
    {
        return !is_null($this->analyzed_at);
    }

    /**
     * Get structured data from the answer.
     */
    public function getStructuredData(?string $key = null)
    {
        if (is_null($key)) {
            return $this->answer_data;
        }

        return $this->answer_data[$key] ?? null;
    }

    /**
     * Get AI analysis for this answer.
     */
    public function getAIAnalysis(): array
    {
        return $this->ai_analysis ?? [];
    }

    /**
     * Get AI suggestions based on this answer.
     */
    public function getAISuggestions(): ?string
    {
        return $this->ai_suggestions;
    }

    /**
     * Get confidence score for this answer.
     */
    public function getConfidenceScore(): int
    {
        return $this->confidence_score;
    }

    /**
     * Mark this answer as analyzed.
     */
    public function markAsAnalyzed(array $analysis, ?string $suggestions = null): void
    {
        $this->update([
            'ai_analysis' => $analysis,
            'ai_suggestions' => $suggestions,
            'analyzed_at' => now(),
        ]);
    }

    /**
     * Extract key information from answer text.
     */
    public function extractKeywords(): array
    {
        $text = strtolower($this->answer_text);
        $keywords = [];

        // Common business keywords in Arabic
        $businessTerms = [
            'رقمي' => 'digital',
            'اشتراك' => 'subscription',
            'خدمة' => 'service',
            'منتج' => 'product',
            'عميل' => 'customer',
            'سوق' => 'market',
            'تطبيق' => 'application',
            'منافس' => 'competitor',
            'ربح' => 'profit',
            'تكلفة' => 'cost',
        ];

        foreach ($businessTerms as $arabic => $english) {
            if (strpos($text, $arabic) !== false) {
                $keywords[] = [
                    'term' => $arabic,
                    'english' => $english,
                    'found' => true
                ];
            }
        }

        return $keywords;
    }

    /**
     * Check if answer contains certain keywords.
     */
    public function containsKeyword(string $keyword): bool
    {
        return strpos(strtolower($this->answer_text), strtolower($keyword)) !== false;
    }

    /**
     * Get answer length category.
     */
    public function getLengthCategory(): string
    {
        $length = strlen($this->answer_text);

        if ($length < 50) return 'short';
        if ($length < 200) return 'medium';
        return 'long';
    }

    /**
     * Get readability score.
     */
    public function getReadabilityScore(): int
    {
        $length = strlen($this->answer_text);
        $words = str_word_count($this->answer_text, 0, 'أبتثجحخدذرزسشصضطظعغفقكلمنهوي');

        if ($words === 0) return 0;

        $avgWordsPerChar = $length / $words;

        // Simple readability calculation
        if ($avgWordsPerChar < 5) return 90; // Very readable
        if ($avgWordsPerChar < 7) return 70; // Readable
        if ($avgWordsPerChar < 10) return 50; // Moderate
        return 30; // Complex
    }
}
