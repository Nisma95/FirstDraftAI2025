<?php

use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Models\Plan;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| AI Business Plan API Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->prefix('ai')->name('api.ai.')->group(function () {
    // Business plan creation routes
    Route::post('/start-business-plan', [PlanController::class, 'startBusinessPlan'])->name('start-business-plan');
    Route::post('/next-question', [PlanController::class, 'getNextQuestion'])->name('next-question');
    Route::post('/generate-plan', [PlanController::class, 'generatePlanFromAnswers'])->name('generate-plan');

    // AI field generation routes
    Route::post('/generate-field', [ProjectController::class, 'generateFieldSuggestion'])->name('generate-field');
    Route::post('/enhance-field', [ProjectController::class, 'enhanceFieldContent'])->name('enhance-field');
});

/*
|--------------------------------------------------------------------------
| Plan Status API Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->prefix('plans')->name('api.plans.')->group(function () {
    // Plan status check
    Route::get('/{plan}/status', function (Plan $plan) {
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
    })->name('status');
});

/*
|--------------------------------------------------------------------------
| Debug API Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->prefix('debug')->name('api.debug.')->group(function () {
    Route::post('/ai-answer', function (Request $request) {
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
    })->name('ai-answer');
});
