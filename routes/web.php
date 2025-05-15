<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\AIAnalysisController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PDFController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use Illuminate\Support\Facades\Log;


use App\Http\Controllers\ChatController;

use App\Http\Controllers\AIQuestioningController;
use App\Http\Controllers\PlanQuestionController;
use App\Http\Controllers\PlanAnswerController;

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
Route::get('dashboard', function () {
    return Inertia::render('Dashboard/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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
| Plans Routes
|--------------------------------------------------------------------------
*/
// ADD THESE MISSING BASIC PLAN ROUTES
Route::middleware('auth')->prefix('plans')->name('plans.')->group(function () {
    Route::get('/', [PlanController::class, 'index'])->name('index');
    Route::get('/create', [PlanController::class, 'create'])->name('create');
    Route::post('/', [PlanController::class, 'store'])->name('store');
    Route::get('/{plan}', [PlanController::class, 'show'])->name('show');
    Route::get('/{plan}/edit', [PlanController::class, 'edit'])->name('edit');
    Route::put('/{plan}', [PlanController::class, 'update'])->name('update');
    Route::delete('/{plan}', [PlanController::class, 'destroy'])->name('destroy');
    Route::get('/{plan}/pdf', [PlanController::class, 'generatePDF'])->name('pdf');
});

// ADD THE AI-FIRST PLAN CREATION ROUTE
Route::get('/create-with-ai', function () {
    $user = auth()->user();
    return Inertia::render('Plans/AIFirst', [
        'projects' => $user->projects
    ]);
})->middleware('auth')->name('create-with-ai');

// ADD API ROUTES FOR AI QUESTIONING
Route::middleware('auth')->prefix('api/ai')->group(function () {
    Route::post('/start-business-plan', [AIQuestioningController::class, 'startBusinessPlan']);
    Route::post('/next-question', [AIQuestioningController::class, 'getNextQuestion']);
    Route::post('/generate-plan', [AIQuestioningController::class, 'generatePlanFromAnswers']);
});

Route::middleware(['auth'])->prefix('plans/{plan}/ai')->name('plans.ai.')->group(function () {
    // Start the AI questioning process
    Route::get('/start', [AIQuestioningController::class, 'start'])->name('start');

    // Show a specific question
    Route::get('/question/{question}', [AIQuestioningController::class, 'showQuestion'])->name('question');

    // Process an answer
    Route::post('/question/{question}/answer', [AIQuestioningController::class, 'processAnswer'])->name('answer');

    // Skip a question
    Route::post('/question/{question}/skip', [AIQuestioningController::class, 'skipQuestion'])->name('skip');

    // Review all answers
    Route::get('/review', [AIQuestioningController::class, 'reviewAnswers'])->name('review');

    // Generate plan from answers
    Route::get('/generate', [AIQuestioningController::class, 'generatePlan'])->name('generate');

    // Process generation (AJAX)
    Route::post('/generate', [AIQuestioningController::class, 'processGeneration'])->name('process-generation');

    // Get AI suggestions
    Route::get('/suggestions', [AIQuestioningController::class, 'getSuggestions'])->name('suggestions');

    // Restart questioning
    Route::post('/restart', [AIQuestioningController::class, 'restart'])->name('restart');

    // ADD THIS MISSING ROUTE - Check generation status (AJAX)
    Route::get('/status', [AIQuestioningController::class, 'checkGenerationStatus'])->name('status');
});

// Add this route to check plan generation status
// Update this route to check plan generation status
Route::get('/api/plans/{plan}/status', function (Plan $plan) {
    try {
        // Check if the plan status column exists and has a value
        $status = $plan->status ?? 'unknown';

        // Try to get completion score if the method exists
        $progress = 0;
        if (method_exists($plan, 'getCompletionScore')) {
            $progress = $plan->getCompletionScore();
        }

        return response()->json([
            'status' => $status,
            'progress' => $progress,
            'id' => $plan->id,
            'title' => $plan->title
        ]);
    } catch (\Exception $e) {
        Log::error('Error checking plan status: ' . $e->getMessage());
        return response()->json([
            'status' => 'unknown',
            'progress' => 0
        ], 500);
    }
})->middleware('auth');
// Question Management Routes
Route::middleware(['auth'])->prefix('plans/{plan}/questions')->name('plans.questions.')->group(function () {
    // Question CRUD
    Route::get('/', [PlanQuestionController::class, 'index'])->name('index');
    Route::get('/create', [PlanQuestionController::class, 'create'])->name('create');
    Route::post('/', [PlanQuestionController::class, 'store'])->name('store');
    Route::get('/{question}', [PlanQuestionController::class, 'show'])->name('show');
    Route::get('/{question}/edit', [PlanQuestionController::class, 'edit'])->name('edit');
    Route::put('/{question}', [PlanQuestionController::class, 'update'])->name('update');
    Route::delete('/{question}', [PlanQuestionController::class, 'destroy'])->name('destroy');

    // Question ordering
    Route::post('/reorder', [PlanQuestionController::class, 'reorder'])->name('reorder');

    // Question statistics
    Route::get('/statistics', [PlanQuestionController::class, 'statistics'])->name('statistics');

    // Answer routes nested under questions
    Route::prefix('{question}/answers')->name('answers.')->group(function () {
        Route::get('/', [PlanAnswerController::class, 'index'])->name('index');
        Route::get('/create', [PlanAnswerController::class, 'create'])->name('create');
        Route::post('/', [PlanAnswerController::class, 'store'])->name('store');
        Route::get('/edit', [PlanAnswerController::class, 'edit'])->name('edit');
        Route::put('/', [PlanAnswerController::class, 'update'])->name('update');
        Route::delete('/', [PlanAnswerController::class, 'destroy'])->name('destroy');

        // Answer analysis
        Route::post('/analyze', [PlanAnswerController::class, 'analyze'])->name('analyze');
        Route::get('/insights', [PlanAnswerController::class, 'insights'])->name('insights');
    });
});

// Additional answer routes
Route::middleware(['auth'])->prefix('plans/{plan}/answers')->name('plans.answers.')->group(function () {
    // Get all answers for a plan
    Route::get('/', [PlanAnswerController::class, 'planAnswers'])->name('index');

    // Export answers
    Route::get('/export', [PlanAnswerController::class, 'export'])->name('export');
});

/*
|--------------------------------------------------------------------------
| Payment Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('payments')->group(function () {
    Route::get('/checkout', [PaymentController::class, 'checkout'])->name('payments.checkout');
    Route::post('/process', [PaymentController::class, 'process'])->name('payments.process');
    Route::get('/callback', [PaymentController::class, 'callback'])->name('payments.callback');
    Route::get('/success', [PaymentController::class, 'success'])->name('payments.success');
    Route::get('/failure', [PaymentController::class, 'failure'])->name('payments.failure');
    Route::post('/cancel-subscription', [PaymentController::class, 'cancelSubscription'])->name('payments.cancel-subscription');
    Route::get('/history', [PaymentController::class, 'history'])->name('payments.history');
});

/*
|--------------------------------------------------------------------------
| Projects Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('projects')->group(function () {
    Route::get('/', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('/', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::get('/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::put('/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // Fixed routes - removed the duplicate /projects prefix
    Route::post('/generate-description', [ProjectController::class, 'generateDescription'])->name('projects.generate-description');
    Route::post('/enhance-description', [ProjectController::class, 'enhanceDescription'])->name('projects.enhance-description');
});


Route::middleware(['auth'])->group(function () {
    // Chat routes
    Route::prefix('chat')->name('chat.')->group(function () {
        // Get all conversations
        Route::get('/conversations', [ChatController::class, 'getConversations'])->name('conversations');

        // Create new conversation
        Route::post('/conversations', [ChatController::class, 'createConversation'])->name('conversations.create');

        // Get specific conversation
        Route::get('/conversations/{conversation}', [ChatController::class, 'getConversation'])->name('conversations.show');

        // Send message to AI
        Route::post('/conversations/{conversation}/messages', [ChatController::class, 'sendMessage'])->name('messages.send');

        // Delete conversation
        Route::delete('/conversations/{conversation}', [ChatController::class, 'deleteConversation'])->name('conversations.delete');

        // Update conversation title
        Route::patch('/conversations/{conversation}/title', [ChatController::class, 'updateConversationTitle'])->name('conversations.update-title');
    });

    // Add a route to serve the chat page
    Route::get('/chat', function () {
        return view('chat'); // You'll need to create this view
    })->name('chat.index');
});


/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';
