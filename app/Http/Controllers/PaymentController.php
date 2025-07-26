<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use App\Services\MeeserPaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;  // Add this
use Illuminate\Support\Str;             // Add this

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

        // Get user's preferred language
        $locale = $request->get('lang') ?? session('locale') ?? app()->getLocale() ?? 'ar';
        session(['locale' => $locale]);

        // Get current subscription
        $currentSubscription = $user->subscriptions()->active()->first();

        // Get selected plan from request
        $selectedPlan = $request->get('plan', 'monthly');

        // Get available plans with localization
        $plans = [
            'monthly' => [
                'name' => $locale === 'en' ? 'Monthly Plan' : 'الخطة الشهرية',
                'price' => 29.99,
                'currency' => $locale === 'en' ? 'SAR' : 'ر.س',
                'billing_cycle' => $locale === 'en' ? 'Monthly' : 'شهرياً',
                'features' => $locale === 'en' ? [
                    'Unlimited business plans',
                    'Advanced AI analysis',
                    'Advanced PDF export',
                    'SWOT analysis',
                    'Operational plan',
                    'Personal consultations',
                    'Advanced technical support',
                    'Detailed reports',
                ] : [
                    'خطط عمل غير محدودة',
                    'تحليل ذكي متقدم',
                    'تصدير PDF متقدم',
                    'تحليل SWOT',
                    'خطة التشغيل',
                    'استشارات شخصية',
                    'دعم فني متقدم',
                    'تقارير مفصلة',
                ],
            ],
            'yearly' => [
                'name' => $locale === 'en' ? 'Yearly Plan' : 'الخطة السنوية',
                'price' => 299.99,
                'currency' => $locale === 'en' ? 'SAR' : 'ر.س',
                'billing_cycle' => $locale === 'en' ? 'Yearly' : 'سنوياً',
                'original_price' => 359.88,
                'discount' => '17%',
                'savings' => 59.89,
                'features' => $locale === 'en' ? [
                    'All monthly plan features',
                    '17% discount on yearly price',
                    'Free monthly consultation',
                    'Priority technical support',
                ] : [
                    'جميع مميزات الخطة الشهرية',
                    'خصم 17% على السعر السنوي',
                    'استشارة مجانية شهرياً',
                    'أولوية في الدعم الفني',
                ],
            ]
        ];

        // Check if user has any pending payments
        $pendingPayment = null;
        if ($currentSubscription) {
            $pendingPayment = $currentSubscription->payments()
                ->where('status', 'pending')
                ->where('created_at', '>', now()->subHour())
                ->first();
        }

        return Inertia::render('Payments/Checkout', [
            'user' => $user,
            'currentSubscription' => $currentSubscription,
            'plans' => $plans,
            'selectedPlan' => $selectedPlan,
            'pendingPayment' => $pendingPayment,
            'locale' => $locale,
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
            'currency' => 'string|nullable',
            'payment_method' => 'required|string',
        ]);

        $user = auth()->user();

        DB::beginTransaction();
        try {
            // Create subscription record
            $subscription = $user->subscriptions()->create([
                'plan_type' => 'paid',
                'start_date' => now(),
                'end_date' => $validated['plan_type'] === 'yearly' ? now()->addYear() : now()->addMonth(),
                'status' => 'active',
                'payment_method' => $validated['payment_method'],
                'amount' => $validated['amount'],
            ]);

            // Create payment record
            $payment = $subscription->payments()->create([
                'payment_date' => now(),
                'payment_method' => $validated['payment_method'],
                'amount' => $validated['amount'],
                'transaction_id' => Payment::generateTransactionId(),
                'status' => 'pending',
            ]);

            // For demo purposes, mark as completed immediately
            // In production, this would be handled by the webhook
            $payment->markAsCompleted();

            // Update user subscription type if the field exists
            $userTable = $user->getTable();
            $userColumns = \Schema::getColumnListing($userTable);

            if (in_array('subscription_type', $userColumns)) {
                $user->update(['subscription_type' => 'premium']);
            }

            // Upgrade existing plans to premium if they exist
            if ($user->projects()->exists()) {
                $user->projects()->whereHas('plans')->each(function ($project) {
                    if ($project->plans()->exists()) {
                        $project->plans()->where('status', 'completed')->update(['status' => 'premium']);
                    }
                });
            }

            DB::commit();

            return redirect()->route('payments.success', ['transaction_id' => $payment->transaction_id])
                ->with('success', 'تم الدفع بنجاح! تم ترقية اشتراكك.');
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
            // For demo purposes, comment out signature verification
            // Uncomment this when you have proper webhook setup
            /*
            if (!$this->meeserService->verifyWebhookSignature($request)) {
                Log::warning('Invalid webhook signature');
                return response()->json(['error' => 'Invalid signature'], 400);
            }
            */

            $data = $request->all();

            // Find payment by transaction ID
            $payment = Payment::where('transaction_id', $data['transaction_id'] ?? '')->first();

            if (!$payment) {
                Log::warning('Payment not found: ' . ($data['transaction_id'] ?? 'NO_ID'));
                return response()->json(['error' => 'Payment not found'], 404);
            }

            $subscription = $payment->subscription;
            $user = $subscription->user;

            DB::beginTransaction();

            // Update payment status
            $payment->update([
                'status' => $data['status'] ?? 'completed',
                'updated_at' => now(),
            ]);

            if (($data['status'] ?? 'completed') === 'completed') {
                // Activate subscription
                $subscription->update(['status' => 'active']);

                // Update user subscription type if the field exists
                $userTable = $user->getTable();
                $userColumns = \Schema::getColumnListing($userTable);

                if (in_array('subscription_type', $userColumns)) {
                    $user->update(['subscription_type' => 'premium']);
                }

                // Upgrade existing plans if they exist
                if ($user->projects()->exists()) {
                    $user->projects()->whereHas('plans')->each(function ($project) {
                        if ($project->plans()->exists()) {
                            $project->plans()->where('status', 'completed')->update(['status' => 'premium']);
                        }
                    });
                }
            } elseif (($data['status'] ?? '') === 'failed') {
                // Mark subscription as inactive
                $subscription->update(['status' => 'inactive']);
            }

            DB::commit();

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

            // Revert user subscription type if the field exists
            $userTable = $user->getTable();
            $userColumns = \Schema::getColumnListing($userTable);

            if (in_array('subscription_type', $userColumns)) {
                $user->update(['subscription_type' => 'free']);
            }

            // Downgrade premium plans to completed if they exist
            if ($user->projects()->exists()) {
                $user->projects()->whereHas('plans', function ($query) {
                    $query->where('status', 'premium');
                })->each(function ($project) {
                    if ($project->plans()->exists()) {
                        $project->plans()->where('status', 'premium')->update(['status' => 'completed']);
                    }
                });
            }

            DB::commit();

            return redirect()->route('dashboard')->with('success', 'تم إلغاء الاشتراك بنجاح');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Subscription cancellation error: ' . $e->getMessage());
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
            ->with('subscription')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Payments/History', [
            'payments' => $payments,
        ]);
    }



    /**
     * Validate and apply discount code
     */
    public function validateDiscount(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50',
            'plan_type' => 'required|string|in:monthly,yearly',
            'amount' => 'required|numeric|min:0'
        ]);

        $discountCode = strtoupper(trim($validated['code']));
        $planType = $validated['plan_type'];
        $originalAmount = $validated['amount'];

        // Define available discount codes
        $discountCodes = [
            'SAVE10' => [
                'type' => 'percentage',
                'value' => 10,
                'description' => 'خصم 10%',
                'description_en' => '10% discount',
                'min_amount' => 0,
                'max_discount' => 50,
                'valid_for' => ['monthly', 'yearly'],
                'active' => true
            ],
            'SAVE20' => [
                'type' => 'percentage',
                'value' => 20,
                'description' => 'خصم 20%',
                'description_en' => '20% discount',
                'min_amount' => 100,
                'max_discount' => 100,
                'valid_for' => ['yearly'],
                'active' => true
            ],
            'NEWUSER' => [
                'type' => 'fixed',
                'value' => 15,
                'description' => 'خصم 15 ريال للمستخدمين الجدد',
                'description_en' => '15 SAR discount for new users',
                'min_amount' => 20,
                'max_discount' => 15,
                'valid_for' => ['monthly', 'yearly'],
                'active' => true
            ],
            'YEARLY50' => [
                'type' => 'fixed',
                'value' => 50,
                'description' => 'خصم 50 ريال على الاشتراك السنوي',
                'description_en' => '50 SAR discount on yearly subscription',
                'min_amount' => 200,
                'max_discount' => 50,
                'valid_for' => ['yearly'],
                'active' => true
            ],
            // 100% TEST DISCOUNT CODE
            'TESTFREE' => [
                'type' => 'percentage',
                'value' => 100,
                'description' => 'خصم 100% - للاختبار فقط',
                'description_en' => '100% discount - Testing only',
                'min_amount' => 0,
                'max_discount' => 999999, // Very high limit to ensure 100% coverage
                'valid_for' => ['monthly', 'yearly'],
                'active' => true
            ]
        ];

        // Check if discount code exists
        if (!isset($discountCodes[$discountCode])) {
            return response()->json([
                'success' => false,
                'message' => 'كود الخصم غير صحيح',
                'message_en' => 'Invalid discount code'
            ], 422);
        }

        $discount = $discountCodes[$discountCode];

        // Check if discount is active
        if (!$discount['active']) {
            return response()->json([
                'success' => false,
                'message' => 'كود الخصم غير متاح حالياً',
                'message_en' => 'Discount code is not available'
            ], 422);
        }

        // Check if discount applies to this plan type
        if (!in_array($planType, $discount['valid_for'])) {
            return response()->json([
                'success' => false,
                'message' => 'كود الخصم غير صالح لهذه الخطة',
                'message_en' => 'Discount code is not valid for this plan'
            ], 422);
        }

        // Check minimum amount
        if ($originalAmount < $discount['min_amount']) {
            return response()->json([
                'success' => false,
                'message' => "الحد الأدنى للمبلغ {$discount['min_amount']} ريال",
                'message_en' => "Minimum amount is {$discount['min_amount']} SAR"
            ], 422);
        }

        // Calculate discount amount
        $discountAmount = 0;
        if ($discount['type'] === 'percentage') {
            $discountAmount = ($originalAmount * $discount['value']) / 100;
            // Apply max discount limit
            $discountAmount = min($discountAmount, $discount['max_discount']);
        } else {
            $discountAmount = min($discount['value'], $originalAmount);
        }

        $finalAmount = $originalAmount - $discountAmount;

        return response()->json([
            'success' => true,
            'discount' => [
                'code' => $discountCode,
                'type' => $discount['type'],
                'value' => $discount['value'],
                'amount' => round($discountAmount, 2),
                'description' => $discount['description'],
                'description_en' => $discount['description_en']
            ],
            'original_amount' => $originalAmount,
            'discount_amount' => round($discountAmount, 2),
            'final_amount' => round($finalAmount, 2),
            'message' => 'تم تطبيق كود الخصم بنجاح',
            'message_en' => 'Discount code applied successfully'
        ]);
    }
}
