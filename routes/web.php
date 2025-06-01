<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\PaymentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Plan;

/*
|--------------------------------------------------------------------------
| Language Route
|--------------------------------------------------------------------------
*/

Route::get('/lang/{locale}', function ($locale) {
    session(['locale' => $locale]);
    return redirect()->back();
});

/*
|--------------------------------------------------------------------------
| Welcome Page (Landing Page)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Dashboard');
    })->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| User Profile Management
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Auth + Verified)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Projects Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('projects')->name('projects.')->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::get('/create', [ProjectController::class, 'create'])->name('create');
        Route::post('/', [ProjectController::class, 'store'])->name('store');
        Route::get('/{project}', [ProjectController::class, 'show'])->name('show');
        Route::get('/{project}/edit', [ProjectController::class, 'edit'])->name('edit');
        Route::put('/{project}', [ProjectController::class, 'update'])->name('update');
        Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('destroy');

        // AI enhancement routes
        Route::post('/generate-description', [ProjectController::class, 'generateDescription'])->name('generate-description');
        Route::post('/enhance-description', [ProjectController::class, 'enhanceDescription'])->name('enhance-description');
        Route::post('/generate-field-suggestion', [ProjectController::class, 'generateFieldSuggestion'])->name('generate-field-suggestion');
    });

    /*
    |--------------------------------------------------------------------------
    | Plans Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('plans')->name('plans.')->group(function () {
        Route::get('/', [PlanController::class, 'index'])->name('index');
        Route::get('/create', [PlanController::class, 'create'])->name('create');
        Route::post('/', [PlanController::class, 'store'])->name('store');
        Route::get('/{plan}', [PlanController::class, 'show'])->name('show');
        Route::get('/{plan}/edit', [PlanController::class, 'edit'])->name('edit');
        Route::put('/{plan}', [PlanController::class, 'update'])->name('update');
        Route::delete('/{plan}', [PlanController::class, 'destroy'])->name('destroy');
        Route::get('/{plan}/pdf', [PlanController::class, 'generatePDF'])->name('pdf');

        // AI answer generation
        Route::post('/ai/generate-answer', [PlanController::class, 'generateAnswerSuggestion'])->name('generate-answer');
    });

    /*
    |--------------------------------------------------------------------------
    | AI Business Plan Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('ai')->name('ai.')->group(function () {
        // AI field generation
        Route::post('/generate-field', [ProjectController::class, 'generateFieldSuggestion'])->name('generate-field');
        Route::post('/enhance-field', [ProjectController::class, 'enhanceFieldContent'])->name('enhance-field');

        // Business plan creation
        Route::post('/start-business-plan', [PlanController::class, 'startBusinessPlan'])->name('start-business-plan');
        Route::post('/next-question', [PlanController::class, 'getNextQuestion'])->name('next-question');
        Route::post('/generate-plan', [PlanController::class, 'generatePlanFromAnswers'])->name('generate-plan');
    });

    /*
    |--------------------------------------------------------------------------
    | Direct AI Planner Route
    |--------------------------------------------------------------------------
    */
    Route::get('/create-with-ai', function () {
        $user = auth()->user();
        return Inertia::render('Plans/AiPlanner', [
            'projects' => $user->projects
        ]);
    })->name('create-with-ai');

    /*
    |--------------------------------------------------------------------------
    | Contract Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('contracts')->name('contracts.')->group(function () {
        Route::get('/', [ContractController::class, 'index'])->name('index');
        Route::get('/create', [ContractController::class, 'create'])->name('create');
        Route::post('/', [ContractController::class, 'store'])->name('store');
        Route::get('/{contract}', [ContractController::class, 'show'])->name('show');
        Route::get('/{contract}/download', [ContractController::class, 'downloadPdf'])->name('download');
        Route::delete('/{contract}', [ContractController::class, 'destroy'])->name('destroy');
        Route::post('/{contract}/regenerate-pdf', [ContractController::class, 'regeneratePdf'])->name('regenerate');
    });

    /*
    |--------------------------------------------------------------------------
    | Subscription Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('subscriptions')->name('subscriptions.')->group(function () {
        Route::get('/', [SubscriptionController::class, 'index'])->name('index');
        Route::get('/plans', [SubscriptionController::class, 'plans'])->name('plans');
        Route::post('/free', [SubscriptionController::class, 'createFreeSubscription'])->name('create-free');
        Route::get('/{subscription}', [SubscriptionController::class, 'show'])->name('show');
        Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
        Route::post('/reactivate', [SubscriptionController::class, 'reactivate'])->name('reactivate');
        Route::get('/status/check', [SubscriptionController::class, 'status'])->name('status');
    });

    /*
|--------------------------------------------------------------------------
| Payment Routes
|--------------------------------------------------------------------------
*/
    Route::prefix('payments')->name('payments.')->group(function () {
        Route::get('/checkout', [PaymentController::class, 'checkout'])->name('checkout');
        Route::post('/process', [PaymentController::class, 'process'])->name('process');
        Route::post('/cancel-subscription', [PaymentController::class, 'cancelSubscription'])->name('cancel-subscription');
        Route::get('/history', [PaymentController::class, 'history'])->name('history');
        Route::get('/success', [PaymentController::class, 'success'])->name('success');
        Route::get('/failure', [PaymentController::class, 'failure'])->name('failure');
        Route::get('/payments/success', [PaymentController::class, 'success'])->name('payments.success');



        // Add this line:
        Route::post('/validate-discount', [PaymentController::class, 'validateDiscount'])->name('validate-discount');
    });

    /*
|--------------------------------------------------------------------------
| API Routes (Authenticated)
|--------------------------------------------------------------------------
*/
    Route::middleware('auth')->prefix('api')->name('api.')->group(function () {

        // Plan status check
        Route::get('/plans/{plan}/status', function (Plan $plan) {
            try {
                // Ensure the authenticated user owns this plan
                if ($plan->project->user_id !== auth()->id()) {
                    return response()->json(['error' => 'Unauthorized'], 403);
                }

                return response()->json([
                    'status' => $plan->status,
                    'progress' => $plan->progress_percentage ?? 0,
                    'completion_score' => $plan->getCompletionScore(),
                    'id' => $plan->id,
                    'title' => $plan->title,
                    'has_analysis' => !empty($plan->ai_analysis),
                    'is_completed' => $plan->isCompleted(),
                    'is_generating' => $plan->isGenerating(),
                    'has_failed' => $plan->hasFailed()
                ]);
            } catch (\Exception $e) {
                Log::error('Error checking plan status: ' . $e->getMessage());
                return response()->json([
                    'status' => 'unknown',
                    'progress' => 0,
                    'error' => 'Unable to check status'
                ], 500);
            }
        })->name('plans.status');

        // Debug route for AI testing
        Route::post('/debug/ai-answer', function (Request $request) {
            try {
                Log::info('Debug route hit', ['data' => $request->all()]);

                $helper = app(App\Services\AIPlannAnswerHelper::class);
                Log::info('AIPlannAnswerHelper created successfully');

                $apiKey = config('services.openai.api_key');
                Log::info('OpenAI config check', [
                    'has_api_key' => !empty($apiKey),
                    'api_key_length' => $apiKey ? strlen($apiKey) : 0
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Debug route working',
                    'config_check' => [
                        'has_openai_key' => !empty($apiKey),
                        'helper_loaded' => true
                    ]
                ]);
            } catch (\Exception $e) {
                Log::error('Debug route error', [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]);

                return response()->json([
                    'success' => false,
                    'error' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ], 500);
            }
        })->name('debug.ai-answer');
    });

    /*
|--------------------------------------------------------------------------
| API v1 Routes (Sanctum Authentication)
|--------------------------------------------------------------------------
*/
    Route::middleware(['auth:sanctum'])->prefix('api/v1')->name('api.v1.')->group(function () {
        Route::prefix('subscriptions')->name('subscriptions.')->group(function () {
            Route::get('/current', [SubscriptionController::class, 'status'])->name('current');
            Route::get('/plans', function () {
                return response()->json([
                    'free' => ['name' => 'مجاني', 'price' => 0],
                    'monthly' => ['name' => 'شهري', 'price' => 29.99],
                    'yearly' => ['name' => 'سنوي', 'price' => 299.99]
                ]);
            })->name('plans');
        });
    });

    /*
|--------------------------------------------------------------------------
| Webhook Routes (No Authentication)
|--------------------------------------------------------------------------
*/
    Route::prefix('webhooks')->name('webhooks.')->group(function () {
        // Meeser payment callback/webhook
        Route::post('/meeser/callback', [PaymentController::class, 'callback'])->name('meeser.callback');

        // Future webhook integrations can be added here
        // Route::post('/stripe/webhook', [PaymentController::class, 'stripeWebhook'])->name('stripe.webhook');
        // Route::post('/paypal/webhook', [PaymentController::class, 'paypalWebhook'])->name('paypal.webhook');
    });

    /*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/
});

require __DIR__ . '/auth.php';
