<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

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
        'currency',
        'payment_gateway',
        'gateway_response',
        'failure_reason',
        'refunded_amount',
        'refund_transaction_id',
    ];

    protected $casts = [
        'payment_date' => 'datetime',
        'amount' => 'decimal:2',
        'refunded_amount' => 'decimal:2',
        'gateway_response' => 'array',
    ];

    // العلاقات
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id', function ($query) {
            $query->join('subscriptions', 'payments.subscription_id', '=', 'subscriptions.id');
        });
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

    public function scopeRefunded($query)
    {
        return $query->where('status', 'refunded');
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
            'refunded' => 'مسترد',
            'chargeback' => 'مسترد عن طريق البنك',
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
        return number_format($this->amount, 2) . ' ' . ($this->currency ?? 'SAR');
    }

    public function getIsRefundableAttribute(): bool
    {
        // Can refund within 30 days if completed and not already refunded
        return $this->status === 'completed' &&
            $this->refunded_amount === null &&
            $this->payment_date->isAfter(now()->subDays(30));
    }

    public function getIsPartialRefundAttribute(): bool
    {
        return $this->refunded_amount > 0 && $this->refunded_amount < $this->amount;
    }

    public function getIsFullRefundAttribute(): bool
    {
        return $this->refunded_amount >= $this->amount;
    }

    public function getRemainingRefundableAmountAttribute(): float
    {
        return max(0, $this->amount - ($this->refunded_amount ?? 0));
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
    public function markAsCompleted(array $gatewayResponse = []): bool
    {
        return $this->update([
            'status' => 'completed',
            'gateway_response' => $gatewayResponse,
        ]);
    }

    public function markAsFailed(string $reason = '', array $gatewayResponse = []): bool
    {
        return $this->update([
            'status' => 'failed',
            'failure_reason' => $reason,
            'gateway_response' => $gatewayResponse,
        ]);
    }

    public function refund(float $amount = null, string $reason = ''): bool
    {
        $amount = $amount ?? $this->amount;
        $amount = min($amount, $this->remaining_refundable_amount);

        if ($amount <= 0) {
            return false;
        }

        // Process refund with payment gateway
        // This would typically involve API calls to Meeser or other payment gateways

        return $this->update([
            'status' => $this->amount === $amount ? 'refunded' : 'partially_refunded',
            'refunded_amount' => ($this->refunded_amount ?? 0) + $amount,
            'failure_reason' => $reason ? "Refunded: {$reason}" : null,
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
            'failure_reason' => null,
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
                'type' => $this->subscription->plan_type_display,
                'period' => $this->subscription->start_date->format('Y-m-d') . ' - ' . $this->subscription->end_date->format('Y-m-d'),
            ],
            'user' => [
                'name' => $this->subscription->user->name,
                'email' => $this->subscription->user->email,
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
            'currency' => $this->currency ?? 'SAR',
            'items' => [
                [
                    'description' => 'اشتراك خطة العمل - ' . $this->subscription->plan_type_display,
                    'quantity' => 1,
                    'unit_price' => $this->amount,
                    'total' => $this->amount,
                ]
            ],
        ];
    }

    public function getTransactionFee(): float
    {
        // Get transaction fee from gateway response if available
        if (isset($this->gateway_response['transaction_fee'])) {
            return (float) $this->gateway_response['transaction_fee'];
        }

        return $this->processing_fee;
    }

    public function getPaymentDetails(): array
    {
        $details = [
            'payment_id' => $this->id,
            'transaction_id' => $this->transaction_id,
            'amount' => $this->amount,
            'currency' => $this->currency ?? 'SAR',
            'status' => $this->status,
            'method' => $this->payment_method,
            'date' => $this->payment_date,
        ];

        // Add card details if available (masked)
        if (isset($this->gateway_response['card'])) {
            $details['card'] = [
                'last_four' => $this->gateway_response['card']['last_four'] ?? null,
                'brand' => $this->gateway_response['card']['brand'] ?? null,
                'exp_month' => $this->gateway_response['card']['exp_month'] ?? null,
                'exp_year' => $this->gateway_response['card']['exp_year'] ?? null,
            ];
        }

        // Add refund information if applicable
        if ($this->refunded_amount > 0) {
            $details['refund'] = [
                'amount' => $this->refunded_amount,
                'transaction_id' => $this->refund_transaction_id,
                'status' => $this->is_full_refund ? 'full' : 'partial',
            ];
        }

        return $details;
    }

    public function isSuccessful(): bool
    {
        return $this->status === 'completed';
    }

    public function sendReceipt(): bool
    {
        $user = $this->subscription->user;

        // Send email receipt
        \Mail::to($user->email)->send(new \App\Mail\PaymentReceipt($this));

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
        return 'TXN-' . time() . '-' . strtoupper(\Str::random(8));
    }
}
