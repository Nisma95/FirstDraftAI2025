<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ContactController;

use App\Http\Controllers\PaymentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Models\Contact;

use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

use App\Models\Project;  // Add this line


/*
|--------------------------------------------------------------------------
| Check app health
|--------------------------------------------------------------------------
*/

Route::get('/up', function ()
{
    return response('OK', 200);
});

/*
|--------------------------------------------------------------------------
| Language Route
|--------------------------------------------------------------------------
*/

Route::get('/lang/{locale}', function ($locale)
{
    session(['locale' => $locale]);
    return redirect()->back();
});

/*
|--------------------------------------------------------------------------
| Welcome Page (Landing Page)
|--------------------------------------------------------------------------
*/
Route::get('/', function ()
{
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
Route::middleware(['auth'])->group(function ()
{
    Route::get('/dashboard', function ()
    {
        return Inertia::render('Dashboard/Dashboard');
    })->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| User Profile Management
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function ()
{
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Auth + Verified)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function ()
{

    /*
    |--------------------------------------------------------------------------
    | Projects Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('projects')->name('projects.')->group(function ()
    {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::get('/create', [ProjectController::class, 'create'])->name('create');
        Route::post('/', [ProjectController::class, 'store'])->name('store');
        Route::get('/{project}', [ProjectController::class, 'show'])->name('show');
        Route::get('/{project}/edit', [ProjectController::class, 'edit'])->name('edit');
        Route::put('/{project}', [ProjectController::class, 'update'])->name('update');
        Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('destroy');

        // AI enhancement routes (these stay in web.php as they're for web forms)
        Route::post('/generate-description', [ProjectController::class, 'generateDescription'])->name('generate-description');
        Route::post('/enhance-description', [ProjectController::class, 'enhanceDescription'])->name('enhance-description');
        Route::post('/generate-field-suggestion', [ProjectController::class, 'generateFieldSuggestion'])->name('generate-field-suggestion');
    });

    /*
    |--------------------------------------------------------------------------
    | Plans Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('plans')->name('plans.')->group(function ()
    {
        Route::get('/', [PlanController::class, 'index'])->name('index');
        Route::get('/create', [PlanController::class, 'create'])->name('create');
        Route::post('/', [PlanController::class, 'store'])->name('store');
        Route::get('/{plan}', [PlanController::class, 'show'])->name('show');
        Route::get('/{plan}/edit', [PlanController::class, 'edit'])->name('edit');
        Route::put('/{plan}', [PlanController::class, 'update'])->name('update');
        Route::delete('/{plan}', [PlanController::class, 'destroy'])->name('destroy');
        Route::get('/{plan}/pdf', [PlanController::class, 'generatePDF'])->name('pdf');

        // AI answer generation (this stays in web.php as it's for web forms)
        Route::post('/ai/generate-answer', [PlanController::class, 'generateAnswerSuggestion'])->name('generate-answer');
    });

    /*
    |--------------------------------------------------------------------------
    | Direct AI Planner Route
    |--------------------------------------------------------------------------
    */
    Route::get('/create-with-ai', function ()
    {
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
    Route::prefix('contracts')->name('contracts.')->group(function ()
    {
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
    Route::prefix('subscriptions')->name('subscriptions.')->group(function ()
    {
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
    Route::prefix('payments')->name('payments.')->group(function ()
    {
        Route::get('/checkout', [PaymentController::class, 'checkout'])->name('checkout');
        Route::post('/process', [PaymentController::class, 'process'])->name('process');
        Route::post('/cancel-subscription', [PaymentController::class, 'cancelSubscription'])->name('cancel-subscription');
        Route::get('/history', [PaymentController::class, 'history'])->name('history');
        Route::get('/success', [PaymentController::class, 'success'])->name('success');
        Route::get('/failure', [PaymentController::class, 'failure'])->name('failure');
        Route::get('/payments/success', [PaymentController::class, 'success'])->name('payments.success');

        Route::post('/validate-discount', [PaymentController::class, 'validateDiscount'])->name('validate-discount');
    });

    /*
    |--------------------------------------------------------------------------
    | API v1 Routes (Sanctum Authentication)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth:sanctum'])->prefix('api/v1')->name('api.v1.')->group(function ()
    {
        Route::prefix('subscriptions')->name('subscriptions.')->group(function ()
        {
            Route::get('/current', [SubscriptionController::class, 'status'])->name('current');
            Route::get('/plans', function ()
            {
                return response()->json([
                    'free' => ['name' => 'مجاني', 'price' => 0],
                    'monthly' => ['name' => 'شهري', 'price' => 29.99],
                    'yearly' => ['name' => 'سنوي', 'price' => 299.99]
                ]);
            })->name('plans');
        });
    });
});

/*
|--------------------------------------------------------------------------
| Webhook Routes (No Authentication)
|--------------------------------------------------------------------------
*/
Route::prefix('webhooks')->name('webhooks.')->group(function ()
{
    // Meeser payment callback/webhook
    Route::post('/meeser/callback', [PaymentController::class, 'callback'])->name('meeser.callback');
});




Route::get('/test-direct-api', function ()
{
    try
    {
        // Make a direct HTTP POST request to your API
        $response = \Illuminate\Support\Facades\Http::post(url('/api/contact'), [
            'name' => 'Direct API Test',
            'company' => 'Test Company',
            'email' => 'nsma22k@gmail.com',
            'message' => 'This is a direct test of the /api/contact endpoint.'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Direct API test completed',
            'api_url' => url('/api/contact'),
            'status_code' => $response->status(),
            'response_body' => $response->json(),
            'response_headers' => $response->headers()
        ]);
    }
    catch (\Exception $e)
    {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'api_url' => url('/api/contact')
        ]);
    }
});

/*
|--------------------------------------------------------------------------
| AI Enhancement Routes (for Web Forms)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('ai')->name('ai.')->group(function ()
{
    Route::post('/generate-field', [ProjectController::class, 'generateFieldSuggestion'])->name('generate-field');
    Route::post('/enhance-field', [ProjectController::class, 'enhanceFieldContent'])->name('enhance-field');
});

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/



require __DIR__ . '/auth.php';
