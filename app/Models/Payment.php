<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;
use Illuminate\Support\Str; // ✅ Fixed: Import from Support, not Models

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'subscription_id',
        'payment_date',
        'payment_method',
        'amount',
        'transaction_id',
        'status',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
    ];

    // Relations
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    public function user()
    {
        return $this->hasOneThrough(User::class, Subscription::class, 'id', 'id', 'subscription_id', 'user_id');
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('payment_date', 'desc');
    }

    public function scopeByMonth($query, $year, $month)
    {
        return $query->whereYear('payment_date', $year)
            ->whereMonth('payment_date', $month);
    }

    public function scopeByMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    // Accessors
    public function getStatusDisplayAttribute(): string
    {
        $statuses = [
            'pending' => 'في الانتظار',
            'completed' => 'مكتمل',
            'failed' => 'فشل',
        ];

        return $statuses[$this->status] ?? 'غير محدد';
    }

    public function getPaymentMethodDisplayAttribute(): string
    {
        $methods = [
            'credit_card' => 'بطاقة ائتمان',
            'debit_card' => 'بطاقة خصم',
            'bank_transfer' => 'تحويل بنكي',
            'meeser' => 'ميسر',
            'cash' => 'نقدي',
            'check' => 'شيك',
        ];

        return $methods[$this->payment_method] ?? $this->payment_method ?? 'غير محدد';
    }

    public function getFormattedAmountAttribute(): string
    {
        return number_format($this->amount, 2) . ' SAR';
    }

    public function getIsRefundableAttribute(): bool
    {
        // Can refund within 30 days if completed
        return $this->status === 'completed' &&
            $this->payment_date->isAfter(now()->subDays(30));
    }

    public function getProcessingFeeAttribute(): float
    {
        // Calculate processing fee based on payment method
        $feeRates = [
            'credit_card' => 0.029, // 2.9%
            'debit_card' => 0.029,
            'bank_transfer' => 0.01, // 1%
            'meeser' => 0.025, // 2.5%
        ];

        $rate = $feeRates[$this->payment_method] ?? 0.025;

        return $this->amount * $rate;
    }

    public function getNetAmountAttribute(): float
    {
        return $this->amount - $this->processing_fee;
    }

    // Methods
    public function markAsCompleted(): bool
    {
        return $this->update([
            'status' => 'completed',
        ]);
    }

    public function markAsFailed(string $reason = ''): bool
    {
        return $this->update([
            'status' => 'failed',
        ]);
    }

    public function retry(): bool
    {
        if ($this->status !== 'failed') {
            return false;
        }

        // Reset status to pending for retry
        return $this->update([
            'status' => 'pending',
        ]);
    }

    public function getReceiptData(): array
    {
        return [
            'payment_id' => $this->id,
            'transaction_id' => $this->transaction_id,
            'date' => $this->payment_date->format('Y-m-d H:i:s'),
            'amount' => $this->formatted_amount,
            'method' => $this->payment_method_display,
            'status' => $this->status_display,
            'subscription' => [
                'type' => $this->subscription->plan_type_display ?? 'غير محدد',
                'period' => $this->subscription->start_date ?
                    $this->subscription->start_date->format('Y-m-d') . ' - ' .
                    ($this->subscription->end_date ? $this->subscription->end_date->format('Y-m-d') : 'مفتوح') : 'غير محدد',
            ],
            'user' => [
                'name' => $this->subscription->user->name ?? 'غير محدد',
                'email' => $this->subscription->user->email ?? 'غير محدد',
            ],
        ];
    }

    public function generateInvoice(): array
    {
        return [
            'invoice_number' => 'INV-' . $this->id . '-' . $this->payment_date->format('YmdHis'),
            'invoice_date' => $this->payment_date->format('Y-m-d'),
            'due_date' => $this->payment_date->format('Y-m-d'),
            'amount' => $this->amount,
            'tax' => $this->amount * 0.15, // 15% VAT
            'total' => $this->amount * 1.15,
            'currency' => 'SAR',
            'items' => [
                [
                    'description' => 'اشتراك خطة العمل - ' . ($this->subscription->plan_type_display ?? 'غير محدد'),
                    'quantity' => 1,
                    'unit_price' => $this->amount,
                    'total' => $this->amount,
                ]
            ],
        ];
    }

    public function getTransactionFee(): float
    {
        return $this->processing_fee;
    }

    public function getPaymentDetails(): array
    {
        $details = [
            'payment_id' => $this->id,
            'transaction_id' => $this->transaction_id,
            'amount' => $this->amount,
            'currency' => 'SAR',
            'status' => $this->status,
            'method' => $this->payment_method,
            'date' => $this->payment_date,
        ];

        return $details;
    }

    public function isSuccessful(): bool
    {
        return $this->status === 'completed';
    }

    public function sendReceipt(): bool
    {
        $user = $this->subscription->user;

        if (!$user) {
            return false;
        }

        // Send email receipt (you'll need to implement the Mail class)
        // \Mail::to($user->email)->send(new \App\Mail\PaymentReceipt($this));

        return true;
    }

    public function canBeDisputed(): bool
    {
        // Allow disputes within 60 days
        return $this->status === 'completed' &&
            $this->payment_date->isAfter(now()->subDays(60));
    }

    public static function generateTransactionId(): string
    {
        return 'TXN-' . time() . '-' . strtoupper(Str::random(8));
    }

    // Helper method to get user through subscription
    public function getUser()
    {
        return $this->subscription ? $this->subscription->user : null;
    }
}
