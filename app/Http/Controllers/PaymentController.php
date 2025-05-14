<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use App\Services\MeeserPaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $meeserService;

    public function __construct(MeeserPaymentService $meeserService)
    {
        $this->meeserService = $meeserService;
    }

    /**
     * Show the checkout page.
     */
    public function checkout(Request $request)
    {
        $user = auth()->user();

        // Get current subscription
        $currentSubscription = $user->subscriptions()->active()->first();

        // Get available plans
        $plans = $this->getAvailablePlans();

        // Check if user has any pending payments
        $pendingPayment = $user->subscriptions()
            ->whereHas('payments', function ($query) {
                $query->where('status', 'pending')
                    ->where('created_at', '>', now()->subHour());
            })
            ->first();

        return Inertia::render('Payments/Checkout', [
            'user' => $user,
            'currentSubscription' => $currentSubscription,
            'plans' => $plans,
            'pendingPayment' => $pendingPayment,
            'meeserConfig' => [
                'publicKey' => config('services.meeser.public_key'),
                'environment' => config('services.meeser.environment'),
            ]
        ]);
    }

    /**
     * Process payment using Meeser.
     */
    public function process(Request $request)
    {
        $validated = $request->validate([
            'plan_type' => 'required|in:monthly,yearly',
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|default:SAR',
            'payment_method_id' => 'required|string', // Meeser payment method ID
        ]);

        $user = auth()->user();

        DB::beginTransaction();
        try {
            // Create subscription record
            $subscription = $user->subscriptions()->create([
                'plan_type' => $validated['plan_type'] === 'yearly' ? 'paid' : 'paid',
                'start_date' => now(),
                'end_date' => $validated['plan_type'] === 'yearly' ? now()->addYear() : now()->addMonth(),
                'status' => 'active',
                'payment_method' => 'meeser',
                'amount' => $validated['amount'],
            ]);

            // Prepare payment data for Meeser
            $paymentData = [
                'amount' => $validated['amount'],
                'currency' => $validated['currency'],
                'customer' => [
                    'email' => $user->email,
                    'name' => $user->name,
                    'phone' => $user->phone,
                ],
                'order_reference' => "SUB-{$subscription->id}-" . time(),
                'callback_url' => route('payments.callback'),
                'metadata' => [
                    'subscription_id' => $subscription->id,
                    'plan_type' => $validated['plan_type'],
                    'user_id' => $user->id,
                ],
                'payment_method_id' => $validated['payment_method_id'],
            ];

            // Process payment with Meeser
            $paymentResult = $this->meeserService->processPayment($paymentData);

            // Create payment record
            $payment = $subscription->payments()->create([
                'payment_date' => now(),
                'payment_method' => 'meeser',
                'amount' => $validated['amount'],
                'transaction_id' => $paymentResult['transaction_id'],
                'status' => $paymentResult['status'], // 'pending', 'completed', 'failed'
            ]);

            DB::commit();

            if ($paymentResult['status'] === 'completed') {
                // Update user subscription type
                $user->update(['subscription_type' => 'premium']);

                // Upgrade existing plans to premium
                $user->projects()->whereHas('plans')->each(function ($project) {
                    $project->plans()->where('status', 'completed')->update(['status' => 'premium']);
                });

                return redirect()->route('dashboard')->with('success', 'تم الدفع بنجاح! تم ترقية اشتراكك.');
            } else {
                // Handle pending or 3DS authentication required
                return redirect()->away($paymentResult['payment_url']);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment processing error: ' . $e->getMessage());

            return back()->with('error', 'حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.');
        }
    }

    /**
     * Handle Meeser callback/webhook.
     */
    public function callback(Request $request)
    {
        try {
            // Verify webhook signature
            if (!$this->meeserService->verifyWebhookSignature($request)) {
                Log::warning('Invalid webhook signature');
                return response()->json(['error' => 'Invalid signature'], 400);
            }

            $data = $request->all();

            // Find payment by transaction ID
            $payment = Payment::where('transaction_id', $data['transaction_id'])->first();

            if (!$payment) {
                Log::warning('Payment not found: ' . $data['transaction_id']);
                return response()->json(['error' => 'Payment not found'], 404);
            }

            $subscription = $payment->subscription;
            $user = $subscription->user;

            DB::beginTransaction();

            // Update payment status
            $payment->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);

            if ($data['status'] === 'completed') {
                // Activate subscription
                $subscription->update(['status' => 'active']);

                // Update user subscription type
                $user->update(['subscription_type' => 'premium']);

                // Upgrade existing plans
                $user->projects()->whereHas('plans')->each(function ($project) {
                    $project->plans()->where('status', 'completed')->update(['status' => 'premium']);
                });

                // Send success notification
                $this->sendPaymentSuccessNotification($user, $subscription);
            } elseif ($data['status'] === 'failed') {
                // Mark subscription as inactive
                $subscription->update(['status' => 'inactive']);

                // Send failure notification
                $this->sendPaymentFailureNotification($user, $subscription, $data['failure_reason'] ?? '');
            }

            DB::commit();

            // Return success response to Meeser
            return response()->json(['status' => 'success'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Webhook processing error: ' . $e->getMessage());

            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Show payment success page.
     */
    public function success(Request $request)
    {
        $transactionId = $request->query('transaction_id');

        $payment = Payment::where('transaction_id', $transactionId)
            ->where('status', 'completed')
            ->first();

        if (!$payment) {
            return redirect()->route('dashboard')->with('error', 'لم يتم العثور على عملية دفع مكتملة');
        }

        return Inertia::render('Payments/Success', [
            'payment' => $payment,
            'subscription' => $payment->subscription,
        ]);
    }

    /**
     * Show payment failure page.
     */
    public function failure(Request $request)
    {
        $transactionId = $request->query('transaction_id');
        $reason = $request->query('reason');

        $payment = Payment::where('transaction_id', $transactionId)->first();

        return Inertia::render('Payments/Failure', [
            'payment' => $payment,
            'reason' => $reason,
        ]);
    }

    /**
     * Cancel subscription.
     */
    public function cancelSubscription(Request $request)
    {
        $user = auth()->user();
        $subscription = $user->subscriptions()->active()->first();

        if (!$subscription) {
            return back()->with('error', 'لا يوجد اشتراك نشط للإلغاء');
        }

        DB::beginTransaction();
        try {
            // Update subscription status
            $subscription->update([
                'status' => 'inactive',
                'end_date' => now(),
            ]);

            // Revert user subscription type
            $user->update(['subscription_type' => 'free']);

            // Downgrade premium plans to completed
            $user->projects()->whereHas('plans', function ($query) {
                $query->where('status', 'premium');
            })->each(function ($project) {
                $project->plans()->where('status', 'premium')->update(['status' => 'completed']);
            });

            DB::commit();

            return redirect()->route('dashboard')->with('success', 'تم إلغاء الاشتراك بنجاح');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'حدث خطأ أثناء إلغاء الاشتراك');
        }
    }

    /**
     * Get payment history.
     */
    public function history()
    {
        $user = auth()->user();

        $payments = Payment::whereHas('subscription', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Payments/History', [
            'payments' => $payments,
        ]);
    }

    /**
     * Get available subscription plans.
     */
    private function getAvailablePlans(): array
    {
        return [
            'monthly' => [
                'name' => 'الخطة الشهرية',
                'price' => 29.99,
                'currency' => 'SAR',
                'billing_cycle' => 'شهرياً',
                'features' => [
                    'خطط عمل غير محدودة',
                    'تحليل ذكي متقدم',
                    'تصدير PDF محسن',
                    'دعم فني متقدم',
                ],
                'highlight' => false,
            ],
            'yearly' => [
                'name' => 'الخطة السنوية',
                'price' => 299.99,
                'currency' => 'SAR',
                'billing_cycle' => 'سنوياً',
                'original_price' => 359.88,
                'discount' => '17%',
                'features' => [
                    'جميع مميزات الخطة الشهرية',
                    'خصم 17% على السعر',
                    'استشارة مجانية شهرياً',
                    'أولوية في الدعم الفني',
                ],
                'highlight' => true,
            ],
        ];
    }

    /**
     * Send payment success notification.
     */
    private function sendPaymentSuccessNotification($user, $subscription)
    {
        // Implement notification logic (email, SMS, etc.)
        // Example: Mail::to($user->email)->send(new PaymentSuccessful($subscription));
    }

    /**
     * Send payment failure notification.
     */
    private function sendPaymentFailureNotification($user, $subscription, $reason)
    {
        // Implement notification logic (email, SMS, etc.)
        // Example: Mail::to($user->email)->send(new PaymentFailed($subscription, $reason));
    }
}
