<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    /**
     * Display the subscription dashboard/overview
     */
    public function index()
    {
        $user = Auth::user();

        // Get current active subscription
        $currentSubscription = $user->subscriptions()->active()->first();

        // Get subscription history
        $subscriptionHistory = $user->subscriptions()
            ->with('payments')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get usage stats if user has active subscription
        $usageStats = $currentSubscription ? $currentSubscription->getUsageStats() : [];

        // Get available upgrade options
        $upgradeOptions = $currentSubscription ? $currentSubscription->getUpgradeOptions() : [];

        return Inertia::render('Subscriptions/Index', [
            'currentSubscription' => $currentSubscription,
            'subscriptionHistory' => $subscriptionHistory,
            'usageStats' => $usageStats,
            'upgradeOptions' => $upgradeOptions,
            'user' => $user
        ]);
    }

    /**
     * Show subscription plans page
     */
    public function plans(Request $request)
    {
        $user = Auth::user();
        $currentSubscription = $user->subscriptions()->active()->first();

        // Get user's preferred language from request, session, or default to 'ar'
        $locale = $request->get('lang') ?? session('locale') ?? app()->getLocale() ?? 'ar';

        // Store locale in session for consistency
        session(['locale' => $locale]);

        // Define plan data with localization
        $plans = [
            'free' => [
                'name' => $locale === 'en' ? 'Free Plan' : 'الخطة المجانية',
                'price' => 0,
                'currency' => $locale === 'en' ? 'SAR' : 'ر.س',
                'billing_cycle' => $locale === 'en' ? 'Free' : 'مجاناً',
                'features' => $locale === 'en' ? [
                    'Limited business plans (3 plans)',
                    'Basic AI analysis',
                    'PDF export',
                    'Limited technical support',
                ] : [
                    'خطط عمل محدودة (3 خطط)',
                    'تحليل ذكي أساسي',
                    'تصدير PDF',
                    'دعم فني محدود',
                ],
                'current' => $currentSubscription ? $currentSubscription->plan_type === 'free' : true,
                'highlight' => false
            ],
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
                'current' => $currentSubscription ?
                    ($currentSubscription->plan_type === 'paid' && $currentSubscription->getBillingCycle() === 'monthly') : false,
                'highlight' => false
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
                'current' => $currentSubscription ?
                    ($currentSubscription->plan_type === 'paid' && $currentSubscription->getBillingCycle() === 'yearly') : false,
                'highlight' => true
            ]
        ];

        return Inertia::render('Subscriptions/Plans', [
            'plans' => $plans,
            'currentSubscription' => $currentSubscription,
            'user' => $user,
            'locale' => $locale
        ]);
    }

    /**
     * Create a new subscription (Free plan)
     */
    public function createFreeSubscription()
    {
        $user = Auth::user();

        // Check if user already has an active subscription
        $existingSubscription = $user->subscriptions()->active()->first();

        if ($existingSubscription) {
            return back()->with('error', 'لديك اشتراك نشط بالفعل');
        }

        DB::beginTransaction();

        try {
            // Create free subscription
            $subscription = $user->subscriptions()->create([
                'plan_type' => 'free',
                'start_date' => now(),
                'end_date' => null, // Free plan doesn't expire
                'status' => 'active',
                'payment_method' => null,
                'amount' => 0.00
            ]);

            // Update user subscription type if the field exists
            if (method_exists($user, 'update') && isset($user->subscription_type)) {
                $user->update(['subscription_type' => 'free']);
            }

            DB::commit();

            return redirect()->route('subscriptions.index')
                ->with('success', 'تم تفعيل الخطة المجانية بنجاح');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'حدث خطأ أثناء إنشاء الاشتراك');
        }
    }

    /**
     * Cancel current subscription
     */
    public function cancel(Request $request)
    {
        $user = Auth::user();
        $subscription = $user->subscriptions()->active()->first();

        if (!$subscription) {
            return back()->with('error', 'لا يوجد اشتراك نشط للإلغاء');
        }

        DB::beginTransaction();

        try {
            // Cancel the subscription
            $subscription->cancel();

            DB::commit();

            return redirect()->route('subscriptions.index')
                ->with('success', 'تم إلغاء الاشتراك بنجاح');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'حدث خطأ أثناء إلغاء الاشتراك');
        }
    }

    /**
     * Reactivate subscription
     */
    public function reactivate(Request $request)
    {
        $user = Auth::user();
        $subscription = $user->subscriptions()
            ->where('status', 'inactive')
            ->latest()
            ->first();

        if (!$subscription) {
            return back()->with('error', 'لا يوجد اشتراك متاح للتفعيل');
        }

        DB::beginTransaction();

        try {
            // Reactivate subscription
            $subscription->activate();

            DB::commit();

            return redirect()->route('subscriptions.index')
                ->with('success', 'تم تفعيل الاشتراك بنجاح');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'حدث خطأ أثناء تفعيل الاشتراك');
        }
    }

    /**
     * Show subscription details
     */
    public function show(Subscription $subscription)
    {
        // Ensure user can only view their own subscription
        if ($subscription->user_id !== Auth::id()) {
            abort(403);
        }

        $subscription->load('payments');

        return Inertia::render('Subscriptions/Show', [
            'subscription' => $subscription,
            'usageStats' => $subscription->getUsageStats(),
            'features' => $subscription->getFeatures()
        ]);
    }

    /**
     * Get subscription status for API/AJAX calls
     */
    public function status()
    {
        $user = Auth::user();
        $subscription = $user->subscriptions()->active()->first();

        return response()->json([
            'hasActiveSubscription' => $subscription !== null,
            'subscriptionType' => $subscription ? $subscription->plan_type : 'none',
            'daysRemaining' => $subscription ? $subscription->days_remaining : null,
            'isExpired' => $subscription ? $subscription->is_expired : null,
            'canUpgrade' => $subscription ? $subscription->plan_type === 'free' : true
        ]);
    }
}
