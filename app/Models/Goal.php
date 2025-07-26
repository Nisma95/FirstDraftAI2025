<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'title',
        'description',
        'priority',
        'due_date',
        'status',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    // العلاقات
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'high');
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
            ->where('status', '!=', 'completed');
    }

    public function scopeDueThisWeek($query)
    {
        return $query->whereBetween('due_date', [now(), now()->addWeek()])
            ->where('status', '!=', 'completed');
    }

    // Accessors
    public function getStatusDisplayAttribute(): string
    {
        $statuses = [
            'pending' => 'في الانتظار',
            'in_progress' => 'جارٍ التنفيذ',
            'completed' => 'مكتمل',
        ];

        return $statuses[$this->status] ?? 'غير محدد';
    }

    public function getPriorityDisplayAttribute(): string
    {
        $priorities = [
            'low' => 'منخفضة',
            'medium' => 'متوسطة',
            'high' => 'عالية',
        ];

        return $priorities[$this->priority] ?? 'متوسطة';
    }

    public function getProgressPercentageAttribute(): int
    {
        if ($this->status === 'completed') {
            return 100;
        }

        $totalTasks = $this->tasks()->count();

        if ($totalTasks === 0) {
            return $this->status === 'in_progress' ? 50 : 0;
        }

        $completedTasks = $this->tasks()->where('status', 'completed')->count();

        return round(($completedTasks / $totalTasks) * 100);
    }

    public function getDaysRemainingAttribute(): ?int
    {
        if (!$this->due_date || $this->status === 'completed') {
            return null;
        }

        return $this->due_date->diffInDays(now(), false);
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->due_date &&
            $this->due_date->isPast() &&
            $this->status !== 'completed';
    }

    public function getTimelineStatusAttribute(): string
    {
        if ($this->status === 'completed') {
            return 'completed';
        }

        if ($this->is_overdue) {
            return 'overdue';
        }

        if ($this->due_date && $this->due_date->diffInDays(now()) <= 7) {
            return 'urgent';
        }

        if ($this->due_date && $this->due_date->diffInDays(now()) <= 30) {
            return 'upcoming';
        }

        return 'future';
    }

    // Methods
    public function markAsInProgress(): bool
    {
        return $this->update(['status' => 'in_progress']);
    }

    public function markAsCompleted(): bool
    {
        $result = $this->update(['status' => 'completed']);

        // Mark all tasks as completed
        $this->tasks()->where('status', '!=', 'completed')
            ->update(['status' => 'completed']);

        return $result;
    }

    public function addTask(array $taskData): Task
    {
        return $this->tasks()->create($taskData);
    }

    public function updateProgress(): void
    {
        $totalTasks = $this->tasks()->count();

        if ($totalTasks === 0) {
            return;
        }

        $completedTasks = $this->tasks()->where('status', 'completed')->count();
        $inProgressTasks = $this->tasks()->where('status', 'in_progress')->count();

        if ($completedTasks === $totalTasks) {
            $this->markAsCompleted();
        } elseif ($inProgressTasks > 0 || $completedTasks > 0) {
            $this->markAsInProgress();
        }
    }

    public function generateTasks(): array
    {
        // Generate suggested tasks based on goal type and description
        // This is a simplified implementation
        $tasks = [];

        if (str_contains(strtolower($this->title), 'تسويق')) {
            $tasks = [
                ['title' => 'إنشاء استراتيجية التسويق', 'description' => 'وضع خطة تسويقية شاملة'],
                ['title' => 'تصميم المواد التسويقية', 'description' => 'إنشاء اللوجو والهوية البصرية'],
                ['title' => 'إطلاق حملة تسويقية', 'description' => 'تنفيذ أول حملة تسويقية'],
            ];
        } elseif (str_contains(strtolower($this->title), 'مال')) {
            $tasks = [
                ['title' => 'إعداد الدراسة المالية', 'description' => 'حساب التكاليف والإيرادات المتوقعة'],
                ['title' => 'البحث عن ممولين', 'description' => 'التواصل مع المستثمرين المحتملين'],
                ['title' => 'فتح حساب بنكي', 'description' => 'فتح حساب للشركة'],
            ];
        } else {
            $tasks = [
                ['title' => 'تحديد المتطلبات', 'description' => 'وضع قائمة بالمتطلبات اللازمة'],
                ['title' => 'وضع خطة العمل', 'description' => 'إنشاء خطة مفصلة للتنفيذ'],
                ['title' => 'تنفيذ الخطة', 'description' => 'البدء في تنفيذ الأنشطة المطلوبة'],
            ];
        }

        return $tasks;
    }

    public function getDependentGoals(): \Illuminate\Database\Eloquent\Collection
    {
        // Goals that depend on this goal being completed
        return $this->plan->goals()
            ->where('id', '!=', $this->id)
            ->where('status', 'pending')
            ->get()
            ->filter(function ($goal) {
                return str_contains($goal->description, "بعد إكمال: {$this->title}");
            });
    }

    public function getBlockingGoals(): \Illuminate\Database\Eloquent\Collection
    {
        // Goals that must be completed before this goal can start
        return $this->plan->goals()
            ->where('id', '!=', $this->id)
            ->where('status', '!=', 'completed')
            ->get()
            ->filter(function ($goal) {
                return str_contains($this->description, "بعد إكمال: {$goal->title}");
            });
    }

    public function getEstimatedDuration(): ?int
    {
        // Return estimated duration in days based on tasks
        $totalDays = 0;

        foreach ($this->tasks as $task) {
            if ($task->estimated_hours) {
                $totalDays += ceil($task->estimated_hours / 8); // Assuming 8 hours per day
            }
        }

        return $totalDays > 0 ? $totalDays : null;
    }

    public function getRiskLevel(): string
    {
        $risks = [];

        // Check if overdue
        if ($this->is_overdue) {
            $risks[] = 'overdue';
        }

        // Check if has blocking goals
        if ($this->getBlockingGoals()->count() > 0) {
            $risks[] = 'dependencies';
        }

        // Check if high priority and due soon
        if ($this->priority === 'high' && $this->days_remaining !== null && $this->days_remaining <= 7) {
            $risks[] = 'urgent';
        }

        if (empty($risks)) {
            return 'low';
        } elseif (count($risks) >= 3) {
            return 'critical';
        } elseif (count($risks) === 2) {
            return 'high';
        } else {
            return 'medium';
        }
    }
}
