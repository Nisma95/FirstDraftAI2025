<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProjectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
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

    // AI enhancement routes
    Route::post('/generate-description', [ProjectController::class, 'generateDescription'])->name('projects.generate-description');
    Route::post('/enhance-description', [ProjectController::class, 'enhanceDescription'])->name('projects.enhance-description');

    // NEW: AI field generation route
    Route::post('/generate-field-suggestion', [ProjectController::class, 'generateFieldSuggestion'])->name('projects.generate-field-suggestion');
});

// AI Field Generation Routes
// Add these routes to your web.php file
Route::middleware(['auth'])->group(function () {
    // Generate new field content
    Route::post('/ai/generate-field', [ProjectController::class, 'generateFieldSuggestion'])
        ->name('ai.generate-field');

    // Enhance existing field content
    Route::post('/ai/enhance-field', [ProjectController::class, 'enhanceFieldContent'])
        ->name('ai.enhance-field');
});

/*
|--------------------------------------------------------------------------
| AI Business Plan Creation API Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('api/ai')->group(function () {
    // Start business plan creation with AI
    Route::post('/start-business-plan', [PlanController::class, 'startBusinessPlan']);

    // Get next question based on previous answer
    Route::post('/next-question', [PlanController::class, 'getNextQuestion']);

    // Generate final business plan from all answers
    Route::post('/generate-plan', [PlanController::class, 'generatePlanFromAnswers']);
});

/*
|--------------------------------------------------------------------------
| Plan Status Check Route (for React frontend)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->get('/api/plans/{plan}/status', function (Plan $plan) {
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
});

/*
|--------------------------------------------------------------------------
| Alternative Plans Routes (for backward compatibility)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->prefix('plans')->name('plans.')->group(function () {
    // Alternative lowercase routes for backward compatibility
    Route::get('/', [PlanController::class, 'index'])->name('index');
    Route::get('/create', [PlanController::class, 'create'])->name('create');
    Route::post('/', [PlanController::class, 'store'])->name('store');
    Route::get('/{plan}', [PlanController::class, 'show'])->name('show');
    Route::get('/{plan}/edit', [PlanController::class, 'edit'])->name('edit');
    Route::put('/{plan}', [PlanController::class, 'update'])->name('update');
    Route::delete('/{plan}', [PlanController::class, 'destroy'])->name('destroy');
    Route::get('/{plan}/pdf', [PlanController::class, 'generatePDF'])->name('pdf');
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
})->middleware('auth')->name('create-with-ai');

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';
