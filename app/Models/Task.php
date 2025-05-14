<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'goal_id',
        'title',
        'description',
        'due_date',
        'status',
        'estimated_hours',
        'actual_hours',
        'assigned_to',
        'priority',
    ];

    protected $casts = [
        'due_date' => 'date',
        'estimated_hours' => 'decimal:2',
        'actual_hours' => 'decimal:2',
    ];

    // العلاقات
    public function goal(): BelongsTo
    {
        return $this->belongsTo(Goal::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
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

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
            ->where('status', '!=', 'completed');
    }

    public function scopeDueToday($query)
    {
        return $query->whereDate('due_date', today())
            ->where('status', '!=', 'completed');
    }

    public function scopeDueThisWeek($query)
    {
        return $query->whereBetween('due_date', [now(), now()->addWeek()])
            ->where('status', '!=', 'completed');
    }

    public function scopeAssignedTo($query, $userId)
    {
        return $query->where('assigned_to', $userId);
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
            'urgent' => 'عاجلة',
        ];

        return $priorities[$this->priority] ?? 'متوسطة';
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

    public function getProgressPercentageAttribute(): int
    {
        switch ($this->status) {
            case 'completed':
                return 100;
            case 'in_progress':
                return 50;
            default:
                return 0;
        }
    }

    public function getEfficiencyRateAttribute(): ?float
    {
        if (!$this->estimated_hours || !$this->actual_hours || $this->actual_hours <= 0) {
            return null;
        }

        return ($this->estimated_hours / $this->actual_hours) * 100;
    }

    public function getTimeDescriptionAttribute(): string
    {
        if (!$this->due_date) {
            return 'لا يوجد موعد محدد';
        }

        if ($this->status === 'completed') {
            return 'مكتملة في ' . $this->updated_at->format('Y-m-d');
        }

        $daysRemaining = $this->days_remaining;

        if ($this->is_overdue) {
            $days = abs($daysRemaining);
            return "متأخرة {$days} " . ($days === 1 ? 'يوم' : 'أيام');
        }

        if ($daysRemaining === 0) {
            return 'مستحقة اليوم';
        }

        if ($daysRemaining === 1) {
            return 'مستحقة غداً';
        }

        if ($daysRemaining <= 7) {
            return "مستحقة خلال {$daysRemaining} " . ($daysRemaining === 1 ? 'يوم' : 'أيام');
        }

        return 'مستحقة في ' . $this->due_date->format('Y-m-d');
    }

    // Methods
    public function markAsInProgress(): bool
    {
        $result = $this->update(['status' => 'in_progress']);

        // Update parent goal status if needed
        $this->goal->updateProgress();

        return $result;
    }

    public function markAsCompleted(float $actualHours = null): bool
    {
        $data = ['status' => 'completed'];

        if ($actualHours !== null) {
            $data['actual_hours'] = $actualHours;
        }

        $result = $this->update($data);

        // Update parent goal status
        $this->goal->updateProgress();

        return $result;
    }

    public function assignTo(int $userId): bool
    {
        return $this->update(['assigned_to' => $userId]);
    }

    public function updateEstimate(float $hours): bool
    {
        return $this->update(['estimated_hours' => $hours]);
    }

    public function postpone(int $days): bool
    {
        if (!$this->due_date) {
            return false;
        }

        $newDueDate = $this->due_date->addDays($days);

        return $this->update(['due_date' => $newDueDate]);
    }

    public function addNote(string $note): void
    {
        $notes = $this->notes ?? '';
        $timestamp = now()->format('Y-m-d H:i');
        $newNote = "\n[{$timestamp}] {$note}";

        $this->update(['notes' => $notes . $newNote]);
    }

    public function getSubtasks(): array
    {
        if (!$this->subtasks) {
            return [];
        }

        return is_array($this->subtasks) ? $this->subtasks : json_decode($this->subtasks, true);
    }

    public function addSubtask(string $title, string $description = null): void
    {
        $subtasks = $this->getSubtasks();

        $subtasks[] = [
            'id' => uniqid(),
            'title' => $title,
            'description' => $description,
            'completed' => false,
            'created_at' => now()->toISOString(),
        ];

        $this->update(['subtasks' => $subtasks]);
    }

    public function completeSubtask(string $subtaskId): void
    {
        $subtasks = $this->getSubtasks();

        foreach ($subtasks as &$subtask) {
            if ($subtask['id'] === $subtaskId) {
                $subtask['completed'] = true;
                $subtask['completed_at'] = now()->toISOString();
                break;
            }
        }

        $this->update(['subtasks' => $subtasks]);

        // Check if all subtasks are completed
        $allCompleted = true;
        foreach ($subtasks as $subtask) {
            if (!$subtask['completed']) {
                $allCompleted = false;
                break;
            }
        }

        if ($allCompleted && !empty($subtasks)) {
            $this->markAsCompleted();
        }
    }

    public function getDependencies(): array
    {
        // Tasks that must be completed before this task can start
        return $this->goal->tasks()
            ->where('id', '!=', $this->id)
            ->where('status', '!=', 'completed')
            ->get()
            ->filter(function ($task) {
                return str_contains($this->description, "بعد مهمة: {$task->title}");
            })
            ->toArray();
    }

    public function canStart(): bool
    {
        // Check if all dependent tasks are completed
        $dependencies = $this->getDependencies();

        foreach ($dependencies as $dependency) {
            if ($dependency['status'] !== 'completed') {
                return false;
            }
        }

        return true;
    }

    public function getTimeVsProgressRatio(): ?float
    {
        if (!$this->due_date || $this->status === 'completed') {
            return null;
        }

        $totalDays = $this->created_at->diffInDays($this->due_date);
        $daysPassed = $this->created_at->diffInDays(now());

        if ($totalDays <= 0) {
            return null;
        }

        $timeProgress = ($daysPassed / $totalDays) * 100;
        $actualProgress = $this->progress_percentage;

        return $actualProgress / $timeProgress;
    }

    public function calculateProductivity(): array
    {
        return [
            'estimated_vs_actual' => $this->efficiency_rate,
            'time_vs_progress' => $this->getTimeVsProgressRatio(),
            'completion_rate' => $this->status === 'completed' ? 100 : 0,
            'overdue_risk' => $this->is_overdue ? 100 : ($this->days_remaining <= 3 ? 75 : 0),
        ];
    }
}
