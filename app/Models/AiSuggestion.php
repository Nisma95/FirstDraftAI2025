<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class AiSuggestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'suggestion_type',
        'suggestion_content',
        'priority',
        'is_implemented',
        'implemented_at',
        'impact_score',
        'category',
        'related_section',
        'action_items',
        'user_feedback',
        'metadata',
    ];

    protected $casts = [
        'implemented_at' => 'datetime',
        'is_implemented' => 'boolean',
        'impact_score' => 'integer',
        'action_items' => 'array',
        'metadata' => 'array',
    ];

    // العلاقات
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    // Scopes
    public function scopeByType($query, string $type)
    {
        return $query->where('suggestion_type', $type);
    }

    public function scopeImplemented($query)
    {
        return $query->where('is_implemented', true);
    }

    public function scopeNotImplemented($query)
    {
        return $query->where('is_implemented', false);
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'high');
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeBySection($query, string $section)
    {
        return $query->where('related_section', $section);
    }

    // Accessors
    public function getSuggestionTypeDisplayAttribute(): string
    {
        $types = [
            'business' => 'استراتيجية العمل',
            'marketing' => 'التسويق',
            'financial' => 'مالية',
            'operational' => 'تشغيلية',
            'other' => 'عامة',
        ];

        return $types[$this->suggestion_type] ?? 'غير محدد';
    }

    public function getPriorityDisplayAttribute(): string
    {
        $priorities = [
            'low' => 'منخفضة',
            'medium' => 'متوسطة',
            'high' => 'عالية',
            'critical' => 'حرجة',
        ];

        return $priorities[$this->priority] ?? 'متوسطة';
    }

    public function getCategoryDisplayAttribute(): string
    {
        $categories = [
            'growth' => 'النمو',
            'efficiency' => 'الكفاءة',
            'risk' => 'إدارة المخاطر',
            'opportunity' => 'الفرص',
            'cost' => 'التكلفة',
            'revenue' => 'الإيرادات',
            'customer' => 'العملاء',
            'product' => 'المنتج',
            'operation' => 'العمليات',
        ];

        return $categories[$this->category] ?? $this->category ?? 'عامة';
    }

    public function getStatusAttribute(): string
    {
        if ($this->is_implemented) {
            return 'implemented';
        }

        $daysOld = $this->created_at->diffInDays(now());

        if ($daysOld > 30) {
            return 'stale';
        }

        if ($this->priority === 'critical' && $daysOld > 7) {
            return 'urgent';
        }

        return 'pending';
    }

    public function getImplementationTimeAttribute(): ?int
    {
        if (!$this->is_implemented || !$this->implemented_at) {
            return null;
        }

        return $this->created_at->diffInDays($this->implemented_at);
    }

    public function getActionItemsCountAttribute(): int
    {
        return count($this->action_items ?? []);
    }

    public function getCompletedActionItemsCountAttribute(): int
    {
        if (!is_array($this->action_items)) {
            return 0;
        }

        return count(array_filter($this->action_items, function ($item) {
            return $item['completed'] ?? false;
        }));
    }

    public function getActionItemsProgressAttribute(): int
    {
        if ($this->action_items_count === 0) {
            return 0;
        }

        return round(($this->completed_action_items_count / $this->action_items_count) * 100);
    }

    // Methods
    public function markAsImplemented(string $feedback = null): bool
    {
        return $this->update([
            'is_implemented' => true,
            'implemented_at' => now(),
            'user_feedback' => $feedback,
        ]);
    }

    public function addActionItem(string $title, string $description = null): void
    {
        $actionItems = $this->action_items ?? [];

        $actionItems[] = [
            'id' => uniqid(),
            'title' => $title,
            'description' => $description,
            'completed' => false,
            'created_at' => now()->toISOString(),
        ];

        $this->update(['action_items' => $actionItems]);
    }

    public function completeActionItem(string $itemId): void
    {
        $actionItems = $this->action_items ?? [];

        foreach ($actionItems as &$item) {
            if ($item['id'] === $itemId) {
                $item['completed'] = true;
                $item['completed_at'] = now()->toISOString();
                break;
            }
        }

        $this->update(['action_items' => $actionItems]);

        // Check if all action items are completed
        if ($this->areAllActionItemsCompleted()) {
            $this->markAsImplemented();
        }
    }

    public function updateImpactScore(int $score): bool
    {
        if ($score < 1 || $score > 10) {
            return false;
        }

        return $this->update(['impact_score' => $score]);
    }

    public function addMetadata(string $key, $value): void
    {
        $metadata = $this->metadata ?? [];
        $metadata[$key] = $value;

        $this->update(['metadata' => $metadata]);
    }

    public function getMetadata(string $key, $default = null)
    {
        $metadata = $this->metadata ?? [];

        return $metadata[$key] ?? $default;
    }

    public function archive(): bool
    {
        return $this->update([
            'is_implemented' => true,
            'implemented_at' => now(),
            'user_feedback' => 'Archived',
        ]);
    }

    public function dismiss(string $reason = ''): bool
    {
        return $this->update([
            'is_implemented' => true,
            'implemented_at' => now(),
            'user_feedback' => "Dismissed: {$reason}",
        ]);
    }

    public function areAllActionItemsCompleted(): bool
    {
        $actionItems = $this->action_items ?? [];

        if (empty($actionItems)) {
            return false;
        }

        foreach ($actionItems as $item) {
            if (!($item['completed'] ?? false)) {
                return false;
            }
        }

        return true;
    }

    public function getTimeToImplement(): ?int
    {
        if (!$this->is_implemented) {
            return null;
        }

        return $this->created_at->diffInDays($this->implemented_at);
    }

    public function generateImplementationPlan(): array
    {
        $plan = [];

        // Based on suggestion type and priority, create implementation steps
        switch ($this->suggestion_type) {
            case 'marketing':
                $plan = [
                    ['step' => 'تحليل الموضوع', 'estimated_hours' => 2],
                    ['step' => 'إعداد الاستراتيجية', 'estimated_hours' => 4],
                    ['step' => 'تنفيذ الحملة', 'estimated_hours' => 8],
                    ['step' => 'متابعة النتائج', 'estimated_hours' => 2],
                ];
                break;

            case 'financial':
                $plan = [
                    ['step' => 'مراجعة البيانات المالية', 'estimated_hours' => 3],
                    ['step' => 'إعداد التحليل', 'estimated_hours' => 4],
                    ['step' => 'تطبيق التوصيات', 'estimated_hours' => 6],
                    ['step' => 'مراقبة التأثير', 'estimated_hours' => 2],
                ];
                break;

            default:
                $plan = [
                    ['step' => 'تحليل الوضع الحالي', 'estimated_hours' => 2],
                    ['step' => 'وضع خطة التنفيذ', 'estimated_hours' => 3],
                    ['step' => 'تنفيذ التغييرات', 'estimated_hours' => 6],
                    ['step' => 'تقييم النتائج', 'estimated_hours' => 2],
                ];
        }

        return $plan;
    }

    public function calculateROI(): ?float
    {
        if (!$this->is_implemented || !$this->impact_score) {
            return null;
        }

        // Simple ROI calculation based on impact score
        $estimatedBenefit = $this->impact_score * 1000; // Assume each point equals 1000 SAR
        $estimatedCost = 500; // Base implementation cost

        return (($estimatedBenefit - $estimatedCost) / $estimatedCost) * 100;
    }

    public function getSimilarSuggestions(): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('id', '!=', $this->id)
            ->where('plan_id', $this->plan_id)
            ->where('suggestion_type', $this->suggestion_type)
            ->where('category', $this->category)
            ->notImplemented()
            ->get();
    }

    public function getRequiredResources(): array
    {
        $resources = [];

        // Add human resources
        $resources['human'] = [
            'roles' => $this->getRequiredRoles(),
            'estimated_hours' => $this->getEstimatedHours(),
        ];

        // Add financial resources
        $resources['financial'] = [
            'budget' => $this->getEstimatedBudget(),
            'roi' => $this->calculateROI(),
        ];

        // Add technical resources
        $resources['technical'] = [
            'tools' => $this->getRequiredTools(),
            'systems' => $this->getRequiredSystems(),
        ];

        return $resources;
    }

    private function getRequiredRoles(): array
    {
        $roleMap = [
            'marketing' => ['مدير التسويق', 'مصمم جرافيك', 'كاتب محتوى'],
            'financial' => ['مدير مالي', 'محاسب', 'مدقق'],
            'operational' => ['مدير العمليات', 'فني', 'مدير مشروع'],
            'business' => ['مدير عام', 'مستشار استراتيجي', 'محلل أعمال'],
        ];

        return $roleMap[$this->suggestion_type] ?? ['مدير عام', 'موظف متخصص'];
    }

    private function getEstimatedHours(): int
    {
        $priorityHours = [
            'low' => 8,
            'medium' => 16,
            'high' => 40,
            'critical' => 80,
        ];

        return $priorityHours[$this->priority] ?? 16;
    }

    private function getEstimatedBudget(): float
    {
        $hours = $this->getEstimatedHours();
        $hourlyRate = 100; // Average hourly rate in SAR

        return $hours * $hourlyRate;
    }

    private function getRequiredTools(): array
    {
        $toolMap = [
            'marketing' => ['Adobe Creative Suite', 'Google Analytics', 'Social Media Tools'],
            'financial' => ['Excel/Google Sheets', 'Accounting Software', 'Financial Analysis Tools'],
            'operational' => ['Project Management Tools', 'Process Mapping Software', 'ERP System'],
        ];

        return $toolMap[$this->suggestion_type] ?? ['Microsoft Office', 'Project Management Tool'];
    }

    private function getRequiredSystems(): array
    {
        $systemMap = [
            'marketing' => ['CRM', 'Marketing Automation', 'Analytics Platform'],
            'financial' => ['ERP', 'Financial Reporting System', 'Budgeting Tool'],
            'operational' => ['ERP', 'Workflow Management', 'Quality Management System'],
        ];

        return $systemMap[$this->suggestion_type] ?? ['Basic Business Systems'];
    }

    public function rate(int $rating, string $comment = ''): void
    {
        $feedback = $this->user_feedback ?? '';
        $newFeedback = [
            'rating' => $rating,
            'comment' => $comment,
            'rated_at' => now()->toISOString(),
        ];

        $this->update([
            'user_feedback' => $feedback . "\n" . json_encode($newFeedback, JSON_UNESCAPED_UNICODE),
        ]);
    }

    public function getAverageRating(): ?float
    {
        $feedback = $this->user_feedback ?? '';
        $ratings = [];

        // Extract ratings from feedback
        preg_match_all('/"rating":(\d+)/', $feedback, $matches);

        if (empty($matches[1])) {
            return null;
        }

        return array_sum($matches[1]) / count($matches[1]);
    }
}
