<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlanQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'parent_question_id',
        'question_type',
        'question_text',
        'question_context',
        'validation_rules',
        'order',
        'is_required',
        'status',
        'ai_metadata',
        'ai_generated_at',
    ];

    protected $casts = [
        'question_context' => 'array',
        'validation_rules' => 'array',
        'ai_metadata' => 'array',
        'is_required' => 'boolean',
        'ai_generated_at' => 'datetime',
    ];

    /**
     * Get the plan that owns this question.
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Get the parent question if this is a follow-up question.
     */
    public function parentQuestion(): BelongsTo
    {
        return $this->belongsTo(PlanQuestion::class, 'parent_question_id');
    }

    /**
     * Get the follow-up questions for this question.
     */
    public function followupQuestions(): HasMany
    {
        return $this->hasMany(PlanQuestion::class, 'parent_question_id');
    }

    /**
     * Get the answer for this question.
     */
    public function answer(): HasOne
    {
        return $this->hasOne(PlanAnswer::class);
    }

    /**
     * Scope to get pending questions only.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get answered questions only.
     */
    public function scopeAnswered($query)
    {
        return $query->where('status', 'answered');
    }

    /**
     * Scope to get required questions only.
     */
    public function scopeRequired($query)
    {
        return $query->where('is_required', true);
    }

    /**
     * Check if this question is answered.
     */
    public function isAnswered(): bool
    {
        return $this->status === 'answered';
    }

    /**
     * Check if this question is required.
     */
    public function isRequired(): bool
    {
        return $this->is_required;
    }

    /**
     * Get the next question in the sequence.
     */
    public function getNextQuestion()
    {
        return self::where('plan_id', $this->plan_id)
            ->where('order', '>', $this->order)
            ->where('status', 'pending')
            ->orderBy('order')
            ->first();
    }

    /**
     * Get question progress percentage.
     */
    public function getProgressPercentage(): int
    {
        $totalQuestions = self::where('plan_id', $this->plan_id)->count();
        $answeredQuestions = self::where('plan_id', $this->plan_id)
            ->where('status', 'answered')
            ->count();

        if ($totalQuestions === 0) return 0;

        return round(($answeredQuestions / $totalQuestions) * 100);
    }

    /**
     * Mark question as answered.
     */
    public function markAsAnswered(): void
    {
        $this->update(['status' => 'answered']);
    }

    /**
     * Get validation rules for the answer.
     */
    public function getValidationRules(): array
    {
        return $this->validation_rules ?? [];
    }

    /**
     * Get question context for AI processing.
     */
    public function getContext(): array
    {
        return $this->question_context ?? [];
    }
}
