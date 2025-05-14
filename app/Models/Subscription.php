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
        'meeser_subscription_id',
        'trial_ends_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'trial_ends_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    // العلاقات
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

    public function scopeTrialing($query)
    {
        return $query->where('plan_type', 'free')
            ->whereNotNull('trial_ends_at')
            ->where('trial_ends_at', '>', now());
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

        // For auto-renewing subscriptions
        if ($this->meeser_subscription_id) {
            // We would need to fetch this from Meeser API
            return null;
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
            'status' => 'canceled',
            'end_date' => now(),
        ]);

        // Update user subscription type
        $this->user->update(['subscription_type' => 'free']);

        // Downgrade premium plans
        $this->user->projects()->each(function ($project) {
            $project->plans()->where('status', 'premium')
                ->update(['status' => 'completed']);
        });

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

    public function isTrialing(): bool
    {
        return $this->trial_ends_at && $this->trial_ends_at->isFuture();
    }

    public function getTrialDaysRemaining(): ?int
    {
        if (!$this->isTrialing()) {
            return null;
        }

        return max(0, $this->trial_ends_at->diffInDays(now()));
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

        return [
            'plans_created' => $user->projects()->withCount('plans')->get()->sum('plans_count'),
            'plans_completed' => $user->projects()
                ->whereHas('plans', function ($q) {
                    $q->whereIn('status', ['completed', 'premium']);
                })
                ->count(),
            'pdfs_generated' => $user->projects()
                ->whereHas('plans', function ($q) {
                    $q->whereNotNull('pdf_path');
                })
                ->count(),
            'ai_suggestions_used' => $user->projects()
                ->withCount(['plans.aiSuggestions'])
                ->get()
                ->sum('plans.ai_suggestions_count'),
        ];
    }
}
