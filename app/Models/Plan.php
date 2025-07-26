<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Plan extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'plans';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'project_id',
        'title',
        'summary',
        'ai_analysis',
        'ai_analysis_path',
        'pdf_path',
        'status',
        'progress_percentage',
        'conversation_file_path',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'project_id' => 'integer',
        'progress_percentage' => 'integer',
        'ai_analysis' => 'array', // Cast JSON to array
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Status constants
     */
    const STATUS_DRAFT = 'draft';
    const STATUS_GENERATING = 'generating';
    const STATUS_PARTIALLY_COMPLETED = 'partially_completed';
    const STATUS_COMPLETED = 'completed';
    const STATUS_PREMIUM = 'premium';
    const STATUS_FAILED = 'failed';

    /**
     * Scope a query to only include draft plans.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', self::STATUS_DRAFT);
    }

    /**
     * Scope a query to only include generating plans.
     */
    public function scopeGenerating($query)
    {
        return $query->where('status', self::STATUS_GENERATING);
    }

    /**
     * Scope a query to only include completed plans.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    /**
     * Scope a query to only include premium plans.
     */
    public function scopePremium($query)
    {
        return $query->where('status', self::STATUS_PREMIUM);
    }

    /**
     * Get the project that owns the plan.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the plan's AI suggestions.
     */
    public function aiSuggestions()
    {
        return $this->hasMany(AISuggestion::class);
    }

    /**
     * Check if the plan has complete data.
     */
    public function hasCompleteData(): bool
    {
        return !empty($this->ai_analysis) &&
            is_array($this->ai_analysis) &&
            count($this->ai_analysis) >= 6; // Expect 6 sections
    }

    /**
     * Get executive summary section.
     */
    public function getExecutiveSummaryAttribute(): ?string
    {
        return $this->ai_analysis['executive_summary'] ?? null;
    }

    /**
     * Get market analysis section.
     */
    public function getMarketAnalysisAttribute(): ?string
    {
        return $this->ai_analysis['market_analysis'] ?? null;
    }

    /**
     * Get SWOT analysis section.
     */
    public function getSwotAnalysisAttribute(): ?string
    {
        return $this->ai_analysis['swot_analysis'] ?? null;
    }

    /**
     * Get marketing strategy section.
     */
    public function getMarketingStrategyAttribute(): ?string
    {
        return $this->ai_analysis['marketing_strategy'] ?? null;
    }

    /**
     * Get financial plan section.
     */
    public function getFinancialPlanAttribute(): ?string
    {
        return $this->ai_analysis['financial_plan'] ?? null;
    }

    /**
     * Get operational plan section.
     */
    public function getOperationalPlanAttribute(): ?string
    {
        return $this->ai_analysis['operational_plan'] ?? null;
    }

    /**
     * Update PDF path.
     */
    public function updatePdfPath(string $path): void
    {
        $this->update(['pdf_path' => $path]);
    }

    /**
     * Upgrade to completed status.
     */
    public function upgradeToCompleted(): void
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'progress_percentage' => 100
        ]);
    }

    /**
     * Check if plan is in completed state.
     */
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    /**
     * Check if plan is being generated.
     */
    public function isGenerating(): bool
    {
        return $this->status === self::STATUS_GENERATING;
    }

    /**
     * Check if plan generation failed.
     */
    public function hasFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    /**
     * Get completion score based on available sections.
     */
    public function getCompletionScore(): int
    {
        if (empty($this->ai_analysis) || !is_array($this->ai_analysis)) {
            return 0;
        }

        $expectedSections = [
            'executive_summary',
            'market_analysis',
            'swot_analysis',
            'marketing_strategy',
            'financial_plan',
            'operational_plan'
        ];

        $completedSections = 0;
        foreach ($expectedSections as $section) {
            if (!empty($this->ai_analysis[$section])) {
                $completedSections++;
            }
        }

        return round(($completedSections / count($expectedSections)) * 100);
    }

    /**
     * Get all section titles and content.
     */
    public function getAllSections(): array
    {
        $locale = app()->getLocale();

        if ($locale === 'ar') {
            $sectionTitles = [
                'executive_summary' => 'الملخص التنفيذي',
                'market_analysis' => 'تحليل السوق',
                'swot_analysis' => 'تحليل SWOT',
                'marketing_strategy' => 'الاستراتيجية التسويقية',
                'financial_plan' => 'الخطة المالية',
                'operational_plan' => 'الخطة التشغيلية'
            ];
        } else {
            $sectionTitles = [
                'executive_summary' => 'Executive Summary',
                'market_analysis' => 'Market Analysis',
                'swot_analysis' => 'SWOT Analysis',
                'marketing_strategy' => 'Marketing Strategy',
                'financial_plan' => 'Financial Plan',
                'operational_plan' => 'Operational Plan'
            ];
        }

        $sections = [];
        foreach ($sectionTitles as $key => $title) {
            $sections[$key] = [
                'title' => $title,
                'content' => $this->ai_analysis[$key] ?? '',
                'completed' => !empty($this->ai_analysis[$key])
            ];
        }

        return $sections;
    }

    /**
     * Check if plan can be downloaded as PDF.
     */
    public function canDownloadPdf(): bool
    {
        return $this->isCompleted() && $this->hasCompleteData();
    }

    /**
     * Get formatted status for display.
     */
    public function getFormattedStatusAttribute(): string
    {
        $locale = app()->getLocale();

        if ($locale === 'ar') {
            $statusMap = [
                self::STATUS_DRAFT => 'مسودة',
                self::STATUS_GENERATING => 'جاري الإنشاء',
                self::STATUS_PARTIALLY_COMPLETED => 'مكتمل جزئياً',
                self::STATUS_COMPLETED => 'مكتمل',
                self::STATUS_PREMIUM => 'مميز',
                self::STATUS_FAILED => 'فشل'
            ];
        } else {
            $statusMap = [
                self::STATUS_DRAFT => 'Draft',
                self::STATUS_GENERATING => 'Generating',
                self::STATUS_PARTIALLY_COMPLETED => 'Partially Completed',
                self::STATUS_COMPLETED => 'Completed',
                self::STATUS_PREMIUM => 'Premium',
                self::STATUS_FAILED => 'Failed'
            ];
        }

        return $statusMap[$this->status] ?? $this->status;
    }

    /**
     * Get status color for UI.
     */
    public function getStatusColorAttribute(): string
    {
        $colorMap = [
            self::STATUS_DRAFT => 'gray',
            self::STATUS_GENERATING => 'blue',
            self::STATUS_PARTIALLY_COMPLETED => 'yellow',
            self::STATUS_COMPLETED => 'green',
            self::STATUS_PREMIUM => 'purple',
            self::STATUS_FAILED => 'red'
        ];

        return $colorMap[$this->status] ?? 'gray';
    }
}
