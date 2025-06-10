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



/*
|--------------------------------------------------------------------------
| Contact API Routes
|--------------------------------------------------------------------------
| Add these routes to your routes/api.php file
*/

// Public contact form submission (no authentication required)
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Protected contact management routes (require authentication)
Route::middleware(['auth:sanctum'])->group(function ()
{
    Route::get('/contacts', [ContactController::class, 'index'])->name('contacts.index');
    Route::get('/contacts/stats', [ContactController::class, 'stats'])->name('contacts.stats');
    Route::get('/contacts/{contact}', [ContactController::class, 'show'])->name('contacts.show');
    Route::patch('/contacts/{contact}/status', [ContactController::class, 'updateStatus'])->name('contacts.update-status');
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy'])->name('contacts.destroy');
});




Route::get('/test-contact-form-submit', function ()
{
    try
    {
        // Create a test contact (like your contact form would)
        $contact = Contact::create([
            'name' => 'Test User',
            'company' => 'Test Company',
            'email' => 'nsma22k@gmail.com', // Use the email from your previous test
            'message' => 'This is a test message from the contact form debug route.',
            'status' => 'new',
            'metadata' => [
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Test Browser',
                'referer' => 'https://firstdraft.sa',
                'submitted_at' => now()->toISOString(),
            ]
        ]);

        // Setup SMTP transport (same as working force test)
        $transport = new EsmtpTransport('mail.firstdraft.sa', 465, true);
        $transport->setUsername('contact@firstdraft.sa');
        $transport->setPassword('B8tV#k2$!mY');
        $mailer = new Mailer($transport);

        $results = [];

        // Test 1: Send user confirmation email
        try
        {
            $userEmail = (new Email())
                ->from('contact@firstdraft.sa')
                ->to('nsma22k@gmail.com')
                ->subject('Thank you for contacting us - First Draft')
                ->html('
                    <h2>Thank You, Test User!</h2>
                    <p>Thank you for reaching out to us! We received your message:</p>
                    <blockquote>"This is a test message from the contact form debug route."</blockquote>
                    <p>We will get back to you within 24 hours.</p>
                    <p>Best regards,<br>The First Draft Team</p>
                ');

            $mailer->send($userEmail);
            $results['user_email'] = 'SUCCESS - Sent to nsma22k@gmail.com';
        }
        catch (\Exception $e)
        {
            $results['user_email'] = 'FAILED: ' . $e->getMessage();
        }

        // Test 2: Send admin notification email
        try
        {
            $adminEmail = (new Email())
                ->from('contact@firstdraft.sa')
                ->to('admin@firstdraft.sa')
                ->replyTo('nsma22k@gmail.com')
                ->subject('New Contact Form Submission - Test User')
                ->html('
                    <h2>🚨 New Contact Form Submission</h2>
                    <p><strong>Name:</strong> Test User</p>
                    <p><strong>Company:</strong> Test Company</p>
                    <p><strong>Email:</strong> <a href="mailto:nsma22k@gmail.com">nsma22k@gmail.com</a></p>
                    <p><strong>Message:</strong><br>This is a test message from the contact form debug route.</p>
                    <p><strong>Submitted:</strong> ' . now()->format('M d, Y \a\t g:i A') . '</p>
                    <p><a href="mailto:nsma22k@gmail.com?subject=Re:%20Your%20Contact%20Form%20Submission">📧 Reply to Test User</a></p>
                ');

            $mailer->send($adminEmail);
            $results['admin_email'] = 'SUCCESS - Sent to admin@firstdraft.sa';
        }
        catch (\Exception $e)
        {
            $results['admin_email'] = 'FAILED: ' . $e->getMessage();
        }

        return response()->json([
            'success' => true,
            'message' => 'Contact form test completed!',
            'contact_id' => $contact->id,
            'email_results' => $results,
            'instructions' => [
                'Check nsma22k@gmail.com inbox and spam folder',
                'Check admin@firstdraft.sa inbox and spam folder',
                'Both emails should arrive within 1-2 minutes'
            ]
        ]);
    }
    catch (\Exception $e)
    {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
    }
});

// Add this route to check if contact form endpoint is working
Route::get('/test-contact-endpoint', function ()
{
    try
    {
        // Simulate a POST request to your contact form
        $response = app()->call('App\Http\Controllers\ContactController@store', [
            'request' => new \Illuminate\Http\Request([
                'name' => 'Test User Endpoint',
                'company' => 'Test Company',
                'email' => 'nsma22k@gmail.com',
                'message' => 'This is a test from the endpoint test route.'
            ])
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Contact endpoint test completed',
            'controller_response' => $response->getData()
        ]);
    }
    catch (\Exception $e)
    {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'message' => 'Contact endpoint test failed'
        ]);
    }
});

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/



require __DIR__ . '/auth.php';
