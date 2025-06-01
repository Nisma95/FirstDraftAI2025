<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan_type',
        'start_date',
        'end_date',
        'status',
        'payment_method',
        'amount',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'amount' => 'decimal:2',
    ];

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>', now());
            });
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired')
            ->orWhere(function ($q) {
                $q->where('end_date', '<=', now())
                    ->where('status', '!=', 'canceled');
            });
    }

    public function scopeCanceled($query)
    {
        return $query->where('status', 'canceled');
    }

    public function scopePaid($query)
    {
        return $query->where('plan_type', 'paid');
    }

    // Accessors
    public function getStatusDisplayAttribute(): string
    {
        $statuses = [
            'active' => 'نشط',
            'inactive' => 'غير نشط',
            'expired' => 'منتهي',
            'canceled' => 'ملغى',
        ];

        return $statuses[$this->status] ?? 'غير محدد';
    }

    public function getPlanTypeDisplayAttribute(): string
    {
        $types = [
            'free' => 'مجاني',
            'paid' => 'مدفوع',
        ];

        return $types[$this->plan_type] ?? 'غير محدد';
    }

    public function getDaysRemainingAttribute(): ?int
    {
        if (!$this->end_date || $this->status !== 'active') {
            return null;
        }

        return max(0, $this->end_date->diffInDays(now()));
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->end_date && $this->end_date->isPast();
    }

    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active' && !$this->is_expired;
    }

    public function getIsCanceledAttribute(): bool
    {
        return $this->status === 'canceled';
    }

    public function getNextPaymentDateAttribute(): ?Carbon
    {
        if ($this->plan_type !== 'paid' || !$this->is_active) {
            return null;
        }

        if ($this->end_date) {
            return $this->end_date;
        }

        return null;
    }

    public function getTotalAmountPaidAttribute(): float
    {
        return $this->payments()
            ->where('status', 'completed')
            ->sum('amount');
    }

    public function getMonthlyPriceAttribute(): float
    {
        if ($this->plan_type !== 'paid') {
            return 0;
        }

        $billingCycle = $this->getBillingCycle();

        switch ($billingCycle) {
            case 'monthly':
                return $this->amount;
            case 'yearly':
                return $this->amount / 12;
            default:
                return 0;
        }
    }

    // Methods
    public function activate(): bool
    {
        return $this->update([
            'status' => 'active',
            'start_date' => now(),
        ]);
    }

    public function cancel(): bool
    {
        $result = $this->update([
            'status' => 'inactive', // Changed from 'canceled' to match your enum
            'end_date' => now(),
        ]);

        // Update user subscription type if user model has this field
        if ($this->user && method_exists($this->user, 'update')) {
            $this->user->update(['subscription_type' => 'free']);
        }

        // Downgrade premium plans if projects exist
        if ($this->user && $this->user->projects) {
            $this->user->projects()->each(function ($project) {
                if ($project->plans) {
                    $project->plans()->where('status', 'premium')
                        ->update(['status' => 'completed']);
                }
            });
        }

        return $result;
    }

    public function expire(): bool
    {
        return $this->update([
            'status' => 'expired',
        ]);
    }

    public function renew(): bool
    {
        if ($this->plan_type !== 'paid') {
            return false;
        }

        $billingCycle = $this->getBillingCycle();

        return $this->update([
            'start_date' => now(),
            'end_date' => $this->calculateEndDate($billingCycle),
            'status' => 'active',
        ]);
    }

    public function changePlan(string $newPlanType, float $newAmount): bool
    {
        return $this->update([
            'plan_type' => $newPlanType,
            'amount' => $newAmount,
            'start_date' => now(),
            'end_date' => $this->calculateEndDate($this->getBillingCycle()),
        ]);
    }

    public function getBillingCycle(): string
    {
        // Determine billing cycle based on amount (this is approximate)
        if ($this->amount <= 50) {
            return 'monthly';
        } elseif ($this->amount <= 600) {
            return 'yearly';
        }

        return 'monthly';
    }

    public function getNextBillingAmount(): float
    {
        if ($this->plan_type !== 'paid') {
            return 0;
        }

        return $this->amount;
    }

    public function getFeatures(): array
    {
        $features = [
            'free' => [
                'خطط عمل محدودة (3 خطط)',
                'تحليل ذكي أساسي',
                'تصدير PDF',
                'دعم فني محدود',
            ],
            'paid' => [
                'خطط عمل غير محدودة',
                'تحليل ذكي متقدم',
                'تصدير PDF متقدم',
                'تحليل SWOT',
                'خطة التشغيل',
                'استشارات شخصية',
                'دعم فني متقدم',
                'تقارير مفصلة',
            ],
        ];

        return $features[$this->plan_type] ?? [];
    }

    public function canAccess(string $feature): bool
    {
        $featureList = $this->getFeatures();

        return in_array($feature, $featureList) || $this->plan_type === 'paid';
    }

    private function calculateEndDate(string $billingCycle): Carbon
    {
        switch ($billingCycle) {
            case 'monthly':
                return now()->addMonth();
            case 'yearly':
                return now()->addYear();
            default:
                return now()->addMonth();
        }
    }

    public function getUpgradeOptions(): array
    {
        if ($this->plan_type === 'paid') {
            return [];
        }

        return [
            'monthly' => [
                'name' => 'الخطة الشهرية',
                'price' => 29.99,
                'billing_cycle' => 'شهرياً',
                'features' => $this->getFeatures()['paid'],
            ],
            'yearly' => [
                'name' => 'الخطة السنوية',
                'price' => 299.99,
                'billing_cycle' => 'سنوياً',
                'features' => $this->getFeatures()['paid'],
                'discount' => '17%',
                'savings' => 59.89,
            ],
        ];
    }

    public function calculateProratedAmount(string $targetPlan): float
    {
        if ($this->plan_type !== 'paid' || !$this->is_active) {
            return 0;
        }

        $remainingDays = $this->days_remaining ?? 0;
        $totalDays = $this->start_date->diffInDays($this->end_date);

        if ($totalDays <= 0) {
            return 0;
        }

        $unusedAmount = ($remainingDays / $totalDays) * $this->amount;

        // Calculate prorated amount for new plan
        $plans = $this->getUpgradeOptions();
        $targetAmount = $plans[$targetPlan]['price'] ?? 0;

        return max(0, $targetAmount - $unusedAmount);
    }

    public function getUsageStats(): array
    {
        $user = $this->user;

        if (!$user) {
            return [
                'plans_created' => 0,
                'plans_completed' => 0,
                'pdfs_generated' => 0,
                'ai_suggestions_used' => 0,
            ];
        }

        // Basic stats that should work with your current database structure
        $plansCreated = 0;
        $plansCompleted = 0;
        $pdfsGenerated = 0;

        if ($user->projects) {
            foreach ($user->projects as $project) {
                if ($project->plans) {
                    $plansCreated += $project->plans->count();
                    $plansCompleted += $project->plans->whereIn('status', ['completed', 'premium'])->count();
                    $pdfsGenerated += $project->plans->whereNotNull('pdf_path')->count();
                }
            }
        }

        return [
            'plans_created' => $plansCreated,
            'plans_completed' => $plansCompleted,
            'pdfs_generated' => $pdfsGenerated,
            'ai_suggestions_used' => 0, // This would need to be implemented based on your AI usage tracking
        ];
    }
}
