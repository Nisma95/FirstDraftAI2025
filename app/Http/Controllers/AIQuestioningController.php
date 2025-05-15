<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\PlanQuestion;
use App\Models\PlanAnswer;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;
use App\Jobs\GenerateBusinessPlan;



class AIQuestioningController extends Controller
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Start AI business plan creation with initial idea (UPDATED METHOD)
     */
    public function startBusinessPlan(Request $request)
    {
        // Add debug logging at the beginning
        Log::info('startBusinessPlan called', [
            'request_data' => $request->all(),
            'user_id' => auth()->id()
        ]);

        $validated = $request->validate([
            'business_idea' => 'required|string|max:1000',
            'project_id' => 'required|exists:projects,id',
            'project_name' => 'sometimes|string',
            'project_description' => 'sometimes|string'
        ]);

        try {
            // Get project info if not provided
            if (!isset($validated['project_name']) || !isset($validated['project_description'])) {
                $project = \App\Models\Project::find($validated['project_id']);
                if (!$project) {
                    Log::error('Project not found', ['project_id' => $validated['project_id']]);
                    return response()->json([
                        'success' => false,
                        'message' => App::getLocale() === 'ar' ? 'المشروع غير موجود' : 'Project not found'
                    ], 404);
                }
                $validated['project_name'] = $project->name;
                $validated['project_description'] = $project->description;
            }

            // Check if AIService is properly initialized
            if (!$this->aiService) {
                Log::error('AIService is not initialized');
                return response()->json([
                    'success' => false,
                    'message' => App::getLocale() === 'ar' ? 'خدمة الذكاء الاصطناعي غير متوفرة' : 'AI service is not available'
                ], 500);
            }

            // Debug: Check OpenAI configuration
            Log::info('OpenAI Config Check', [
                'api_key_exists' => config('openai.api_key') ? 'Yes' : 'No',
                'api_key_length' => config('openai.api_key') ? strlen(config('openai.api_key')) : 0,
                'api_url' => config('openai.api_url'),
                'model' => config('openai.model')
            ]);

            // Store business idea in session with project info
            session(['ai_business_plan' => [
                'business_idea' => $validated['business_idea'],
                'project_id' => $validated['project_id'],
                'project_name' => $validated['project_name'],
                'project_description' => $validated['project_description'],
                'answers' => [],
                'started_at' => now()
            ]]);

            Log::info('About to call AI service for first question');

            // Generate first question based on business idea and project context
            $firstQuestion = $this->aiService->generateFirstQuestion(
                $validated['business_idea'],
                $validated['project_name'],
                $validated['project_description']
            );

            Log::info('AI service response', ['first_question' => $firstQuestion]);

            // Validate the response from AI service
            if (!$firstQuestion || !isset($firstQuestion['question'])) {
                Log::error('Invalid response from AI service:', ['response' => $firstQuestion]);
                return response()->json([
                    'success' => false,
                    'message' => App::getLocale() === 'ar' ? 'فشل في إنشاء السؤال الأول' : 'Failed to generate first question'
                ], 500);
            }

            // Store current question in session
            session(['current_question' => $firstQuestion]);

            Log::info('Successfully generated first question for business plan', [
                'project_id' => $validated['project_id'],
                'business_idea' => substr($validated['business_idea'], 0, 100) // Log first 100 chars only
            ]);

            return response()->json([
                'success' => true,
                'question' => $firstQuestion
            ]);
        } catch (\Exception $e) {
            Log::error('Error starting AI business plan: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'validated' => $validated,
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);

            return response()->json([
                'success' => false,
                'message' => App::getLocale() === 'ar'
                    ? 'حدث خطأ في بدء إنشاء خطة العمل: ' . $e->getMessage()
                    : 'Error starting business plan: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Get next question based on current answer (UPDATED METHOD)
     */
    public function getNextQuestion(Request $request)
    {
        $validated = $request->validate([
            'answer' => 'required|string',
            'previous_answers' => 'sometimes|array',
            'business_idea' => 'required|string',
            'question_count' => 'sometimes|integer'
        ]);

        try {
            // Get session data
            $aiData = session('ai_business_plan', []);
            $currentQuestion = session('current_question');

            // Add current answer to answers array
            $answers = $aiData['answers'] ?? [];
            $answers[] = [
                'question' => $currentQuestion['question'],
                'question_type' => $currentQuestion['type'] ?? 'text',
                'answer' => $validated['answer'],
                'timestamp' => now()
            ];

            // Update session
            session(['ai_business_plan' => array_merge($aiData, ['answers' => $answers])]);

            // Check if we've reached the 5 question limit
            $questionCount = count($answers);
            if ($questionCount >= 5) {
                return response()->json([
                    'success' => true,
                    'question' => null,
                    'ready_to_generate' => true
                ]);
            }

            // Generate next question based on all answers
            $nextQuestion = $this->aiService->generateNextQuestion(
                $answers,
                $validated['business_idea'],
                $questionCount
            );

            if ($nextQuestion) {
                session(['current_question' => $nextQuestion]);
                return response()->json([
                    'success' => true,
                    'question' => $nextQuestion
                ]);
            } else {
                // No more questions from AI, ready to generate
                return response()->json([
                    'success' => true,
                    'question' => null,
                    'ready_to_generate' => true
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error getting next question: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الحصول على السؤال التالي'
            ], 500);
        }
    }

    /**
     * Generate final business plan from all answers (UPDATED METHOD)
     */
    /**
     * Generate final business plan from all answers (OPTIMIZED VERSION)
     */
    /**
     * Generate final business plan from all answers (FULLY OPTIMIZED)
     */
    public function generatePlanFromAnswers(Request $request)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
            'business_idea' => 'required|string',
            'project_id' => 'required|exists:projects,id',
            'project_name' => 'sometimes|string',
            'project_description' => 'sometimes|string'
        ]);

        try {
            DB::beginTransaction();

            // Get project info if not provided
            if (!isset($validated['project_name']) || !isset($validated['project_description'])) {
                $project = \App\Models\Project::find($validated['project_id']);
                if (!$project) {
                    Log::error('Project not found', ['project_id' => $validated['project_id']]);
                    return response()->json([
                        'success' => false,
                        'message' => App::getLocale() === 'ar' ? 'المشروع غير موجود' : 'Project not found'
                    ], 404);
                }
                $validated['project_name'] = $project->name;
                $validated['project_description'] = $project->description;
            }

            // Create the plan with initial status
            $plan = Plan::create([
                'project_id' => $validated['project_id'],
                'title' => $validated['project_name'] . ' - خطة العمل',
                'summary' => $validated['business_idea'],
                'status' => 'generating',
                'ai_analysis' => null,
                'user_id' => auth()->id(),
                'progress_percentage' => 0
            ]);

            // Save generation context for job processing
            $plan->ai_conversation_context = [
                'answers' => $validated['answers'],
                'business_idea' => $validated['business_idea'],
                'project_name' => $validated['project_name'],
                'project_description' => $validated['project_description'],
                'generation_started_at' => now()
            ];
            $plan->save();

            // Clear session data immediately
            session()->forget('ai_business_plan');
            session()->forget('current_question');

            Log::info('Plan created successfully, starting background generation', [
                'plan_id' => $plan->id,
                'project_id' => $validated['project_id']
            ]);

            DB::commit();

            // Dispatch background generation job
            try {
                // Check if GenerateBusinessPlan job class exists
                if (class_exists(\App\Jobs\GenerateBusinessPlan::class)) {
                    // Use the job queue for better performance and reliability
                    \App\Jobs\GenerateBusinessPlan::dispatch($plan, $validated)
                        ->onQueue('business-plans') // Use specific queue
                        ->delay(now()->addSeconds(2)); // Small delay to ensure transaction is committed

                    Log::info("Business plan generation job dispatched successfully for plan: {$plan->id}");
                } else {
                    // Fallback to closure if job class doesn't exist
                    dispatch(function () use ($plan, $validated) {
                        $this->generatePlanInBackground(
                            $plan,
                            $validated['answers'],
                            $validated['business_idea'],
                            $validated['project_name'],
                            $validated['project_description']
                        );
                    })->afterResponse();

                    Log::info("Business plan generation dispatched as closure for plan: {$plan->id}");
                }
            } catch (\Exception $e) {
                Log::error('Error dispatching business plan generation: ' . $e->getMessage());

                // Last resort: run synchronously
                try {
                    $this->generatePlanInBackground(
                        $plan,
                        $validated['answers'],
                        $validated['business_idea'],
                        $validated['project_name'],
                        $validated['project_description']
                    );
                } catch (\Exception $syncError) {
                    Log::error('Even synchronous generation failed: ' . $syncError->getMessage());
                    $plan->update([
                        'status' => 'failed',
                        'ai_analysis' => ['error' => 'Failed to start generation process']
                    ]);
                }
            }

            // Return immediate response with plan information
            return response()->json([
                'success' => true,
                'plan' => [
                    'id' => $plan->id,
                    'title' => $plan->title,
                    'status' => $plan->status,
                    'created_at' => $plan->created_at
                ],
                'plan_id' => $plan->id,
                'status_check_url' => route('plans.ai.status', $plan),
                'plan_show_url' => route('plans.show', $plan),
                'message' => App::getLocale() === 'ar'
                    ? 'تم بدء عملية إنشاء خطة العمل. سيتم إعادة توجيهك لمتابعة التقدم.'
                    : 'Business plan generation started. You will be redirected to track progress.',
                'estimated_time' => 'يقرّب من 30-60 ثانية',
                'instructions' => App::getLocale() === 'ar'
                    ? 'سيتم إعادة توجيهك تلقائياً عند اكتمال خطة العمل'
                    : 'You will be automatically redirected when the business plan is complete'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in generatePlanFromAnswers: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'validated' => $validated
            ]);

            return response()->json([
                'success' => false,
                'message' => App::getLocale() === 'ar'
                    ? 'حدث خطأ في إنشاء خطة العمل. يرجى المحاولة مرة أخرى.'
                    : 'An error occurred while creating the business plan. Please try again.',
                'error_details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Check plan generation status (AJAX endpoint)
     */
    public function checkGenerationStatus(Plan $plan)
    {
        $this->authorize('view', $plan);

        return response()->json([
            'success' => true,
            'status' => $plan->status,
            'progress' => $this->getProgressPercentage($plan->status),
            'message' => $this->getStatusMessage($plan->status),
            'is_completed' => in_array($plan->status, ['completed', 'failed']),
            'redirect_url' => $plan->status === 'completed' ? route('plans.show', $plan) : null
        ]);
    }

    /**
     * Get progress percentage based on status
     */
    private function getProgressPercentage(string $status): int
    {
        $statusMap = [
            'generating' => 10,
            'title_generated' => 20,
            'generating_sections' => 30,
            'generating_suggestions' => 80,
            'completed' => 100,
            'failed' => 0
        ];

        return $statusMap[$status] ?? 0;
    }

    /**
     * Get status message in Arabic
     */
    private function getStatusMessage(string $status): string
    {
        $messages = [
            'generating' => 'جاري بدء العملية...',
            'title_generated' => 'تم إنشاء العنوان...',
            'generating_sections' => 'جاري إنشاء أقسام خطة العمل...',
            'generating_suggestions' => 'جاري إنشاء الاقتراحات...',
            'completed' => 'تم إنشاء خطة العمل بنجاح!',
            'failed' => 'حدث خطأ في إنشاء خطة العمل'
        ];

        return $messages[$status] ?? 'معالجة...';
    }


    /**
     * Generate plan content in background with project context (OPTIMIZED)
     */
    private function generatePlanInBackground(Plan $plan, array $answers, string $businessIdea, string $projectName = null, string $projectDescription = null)
    {
        try {
            Log::info("Starting optimized background generation for plan: {$plan->id}");

            // Update status to show progress
            $plan->update(['status' => 'generating']);

            // Generate title first (quick win for user)
            try {
                $title = $this->aiService->generateTitleFromAnswers($answers, $projectName, $projectDescription);
                $plan->update(['title' => $title, 'status' => 'title_generated']);
                Log::info("Title generated for plan: {$plan->id}");
            } catch (\Exception $e) {
                Log::error("Error generating title: " . $e->getMessage());
                $plan->update(['title' => $projectName . ' - Business Plan']);
            }

            // **OPTIMIZED**: Generate all sections in a single AI call instead of multiple calls
            try {
                Log::info("Generating all sections in batch for plan: {$plan->id}");
                $plan->update(['status' => 'generating_sections']);

                // Generate complete plan in one call
                $completePlan = $this->aiService->generateCompleteBusinessPlan([
                    'business_idea' => $businessIdea,
                    'project_name' => $projectName,
                    'project_description' => $projectDescription,
                    'answers' => $answers
                ]);

                // Update plan with all sections at once
                $plan->update(['ai_analysis' => $completePlan]);
                Log::info("All sections completed for plan: {$plan->id}");
            } catch (\Exception $e) {
                Log::error("Error generating sections in batch: " . $e->getMessage());

                // Fallback to default content if batch generation fails
                $sections = [
                    'executive_summary' => $this->getDefaultSectionContent('executive_summary'),
                    'market_analysis' => $this->getDefaultSectionContent('market_analysis'),
                    'swot_analysis' => $this->getDefaultSectionContent('swot_analysis'),
                    'marketing_strategy' => $this->getDefaultSectionContent('marketing_strategy'),
                    'financial_plan' => $this->getDefaultSectionContent('financial_plan'),
                    'operational_plan' => $this->getDefaultSectionContent('operational_plan')
                ];
                $plan->update(['ai_analysis' => $sections]);
            }

            // Generate suggestions (optional, non-blocking)
            try {
                $plan->update(['status' => 'generating_suggestions']);
                $suggestions = $this->aiService->generateSuggestionsFromAnswers([
                    'business_idea' => $businessIdea,
                    'project_name' => $projectName,
                    'project_description' => $projectDescription,
                    'answers' => $answers
                ]);

                foreach ($suggestions as $suggestion) {
                    $plan->aiSuggestions()->create([
                        'suggestion_type' => $suggestion['type'],
                        'suggestion_content' => $suggestion['content'],
                        'priority' => $suggestion['priority'] ?? 'medium'
                    ]);
                }
            } catch (\Exception $e) {
                Log::error("Error generating suggestions: " . $e->getMessage());
                // Continue without suggestions
            }

            // Mark as completed
            $plan->update(['status' => 'completed']);

            Log::info("Background generation completed successfully for plan: {$plan->id}");
        } catch (\Exception $e) {
            Log::error("Fatal error in background generation for plan {$plan->id}: " . $e->getMessage());

            $plan->update([
                'status' => 'failed',
                'ai_analysis' => [
                    'error' => 'An error occurred during business plan generation: ' . $e->getMessage()
                ]
            ]);
        }
    }

    /**
     * Get default content for sections that fail to generate
     */
    private function getDefaultSectionContent(string $section): string
    {
        $defaults = [
            'executive_summary' => '<p>This section will be completed shortly. Please refresh the page in a few moments.</p>',
            'market_analysis' => '<p>Market analysis is being generated. Please check back in a moment.</p>',
            'swot_analysis' => '<p>SWOT analysis will be available shortly.</p>',
            'marketing_strategy' => '<p>Marketing strategy is being prepared.</p>',
            'financial_plan' => '<p>Financial plan will be generated shortly.</p>',
            'operational_plan' => '<p>Operational plan is being created.</p>'
        ];

        return $defaults[$section] ?? '<p>Content will be available shortly.</p>';
    }

    // Keep all existing methods below unchanged...

    /**
     * Start the AI questioning process for a plan.
     */
    public function start(Plan $plan)
    {
        $this->authorize('update', $plan);

        try {
            // Check if questioning already started
            if ($plan->questions()->exists()) {
                $nextQuestion = $plan->getNextQuestion();
                if ($nextQuestion) {
                    return $this->showQuestion($plan, $nextQuestion);
                }

                // All questions answered, ready for generation
                if ($plan->isReadyForGeneration()) {
                    return redirect()->route('plans.ai.generate', $plan)
                        ->with('success', 'تم الانتهاء من الأسئلة. يمكنك الآن توليد خطة العمل.');
                }
            }

            // Start new questioning session
            $questioningResult = $plan->startAIQuestioning();
            $plan->updateQuestioningStatus('active');

            $firstQuestion = $plan->getNextQuestion();

            return Inertia::render('Plans/AIQuestioning/Start', [
                'plan' => $plan->load('project'),
                'question' => $firstQuestion,
                'progress' => $questioningResult['progress'],
                'totalQuestions' => $plan->questions()->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error starting AI questioning: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ في بدء جلسة الأسئلة الذكية.');
        }
    }

    /**
     * Show a specific question.
     */
    public function showQuestion(Plan $plan, PlanQuestion $question)
    {
        $this->authorize('update', $plan);

        if ($question->plan_id !== $plan->id) {
            abort(404);
        }

        return Inertia::render('Plans/AIQuestioning/Question', [
            'plan' => $plan->load('project'),
            'question' => $question->load('parentQuestion'),
            'progress' => $plan->getQuestioningProgress(),
            'totalQuestions' => $plan->questions()->count(),
            'answeredQuestions' => $plan->answeredQuestions()->count(),
            'previousAnswer' => $question->parentQuestion?->answer,
        ]);
    }

    /**
     * Process an answer and get the next question.
     */
    public function processAnswer(Request $request, Plan $plan, PlanQuestion $question)
    {
        $this->authorize('update', $plan);

        if ($question->plan_id !== $plan->id) {
            abort(404);
        }

        // Validate the answer
        $validator = Validator::make($request->all(), [
            'answer_text' => 'required|string|min:5',
            'structured_data' => 'sometimes|array',
            'confidence' => 'sometimes|integer|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        DB::beginTransaction();
        try {
            // Create the answer
            $answerData = [
                'answer_text' => $request->answer_text,
                'structured_data' => $request->structured_data,
                'confidence' => $request->confidence ?? 100,
            ];

            $answer = PlanAnswer::create([
                'plan_question_id' => $question->id,
                'user_id' => Auth::id(),
                'answer_text' => $answerData['answer_text'],
                'answer_data' => $answerData['structured_data'],
                'confidence_score' => $answerData['confidence'],
            ]);

            // Mark question as answered
            $question->markAsAnswered();

            // Process with AI to get next question or completion status
            $result = $plan->processNextQuestion($question, $answerData);

            // Update plan progress
            $plan->updateProgress();

            DB::commit();

            // Check if ready for plan generation
            if ($result['ready_for_generation'] ?? false) {
                return redirect()->route('plans.ai.generate', $plan)
                    ->with('success', 'تم الانتهاء من جميع الأسئلة المطلوبة. يمكنك الآن توليد خطة العمل.');
            }

            // Show next question
            if (isset($result['question'])) {
                return redirect()->route('plans.ai.question', [$plan, $result['question']]);
            }

            // Fallback - get next pending question
            $nextQuestion = $plan->getNextQuestion();
            if ($nextQuestion) {
                return redirect()->route('plans.ai.question', [$plan, $nextQuestion]);
            }

            // No more questions, ready for generation
            return redirect()->route('plans.ai.generate', $plan)
                ->with('success', 'تم الانتهاء من جميع الأسئلة.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error processing answer: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ في معالجة الإجابة. يرجى المحاولة مرة أخرى.');
        }
    }

    /**
     * Skip a question (if it's not required).
     */
    public function skipQuestion(Plan $plan, PlanQuestion $question)
    {
        $this->authorize('update', $plan);

        if ($question->plan_id !== $plan->id || $question->is_required) {
            abort(404);
        }

        try {
            $question->update(['status' => 'skipped']);

            $nextQuestion = $plan->getNextQuestion();
            if ($nextQuestion) {
                return redirect()->route('plans.ai.question', [$plan, $nextQuestion]);
            }

            return redirect()->route('plans.ai.generate', $plan)
                ->with('success', 'تم تخطي السؤال. يمكنك الآن توليد خطة العمل.');
        } catch (\Exception $e) {
            Log::error('Error skipping question: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ في تخطي السؤال.');
        }
    }

    /**
     * Generate the business plan from collected answers.
     */
    public function generatePlan(Plan $plan)
    {
        $this->authorize('update', $plan);

        // Check if plan is ready for generation
        if (!$plan->isReadyForGeneration()) {
            return back()->with('error', 'يجب الإجابة على جميع الأسئلة المطلوبة أولاً.');
        }

        try {
            // Show loading state
            return Inertia::render('Plans/AIQuestioning/Generate', [
                'plan' => $plan->load('project'),
                'answeredQuestions' => $plan->answeredQuestions()->count(),
                'totalQuestions' => $plan->questions()->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error initiating plan generation: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ في بدء عملية التوليد.');
        }
    }

    /**
     * Process the plan generation (AJAX endpoint).
     */
    public function processGeneration(Plan $plan)
    {
        $this->authorize('update', $plan);

        if (!$plan->isReadyForGeneration()) {
            return response()->json([
                'success' => false,
                'message' => 'يجب الإجابة على جميع الأسئلة المطلوبة أولاً.'
            ], 400);
        }

        try {
            // Generate the plan using AI
            $result = $plan->generateFromAnswers();

            // Update plan status
            $plan->updateQuestioningStatus('completed');
            $plan->updateProgress();

            return response()->json([
                'success' => true,
                'completion_score' => $result['completion_score'],
                'sections_generated' => count($result['sections']),
                'suggestions_count' => count($result['suggestions']),
                'redirect_url' => route('plans.show', $plan)
            ]);
        } catch (\Exception $e) {
            Log::error('Error generating plan: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في توليد خطة العمل. يرجى المحاولة مرة أخرى.'
            ], 500);
        }
    }

    /**
     * Get AI suggestions based on current answers.
     */
    public function getSuggestions(Plan $plan)
    {
        $this->authorize('view', $plan);

        try {
            $suggestions = $this->aiService->generateDynamicSuggestions($plan, $plan->getAnswersSummary());

            return response()->json([
                'success' => true,
                'suggestions' => $suggestions
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting AI suggestions: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الحصول على الاقتراحات.'
            ], 500);
        }
    }

    /**
     * Review all answers before generating the plan.
     */
    public function reviewAnswers(Plan $plan)
    {
        $this->authorize('view', $plan);

        return Inertia::render('Plans/AIQuestioning/Review', [
            'plan' => $plan->load('project'),
            'questions' => $plan->answeredQuestions()->with('answer')->get(),
            'progress' => $plan->getQuestioningProgress(),
            'completionScore' => $plan->getCompletionScore(),
            'isReadyForGeneration' => $plan->isReadyForGeneration(),
        ]);
    }

    /**
     * Edit a specific answer.
     */
    public function editAnswer(Plan $plan, PlanQuestion $question)
    {
        $this->authorize('update', $plan);

        if ($question->plan_id !== $plan->id || !$question->isAnswered()) {
            abort(404);
        }

        return Inertia::render('Plans/AIQuestioning/EditAnswer', [
            'plan' => $plan->load('project'),
            'question' => $question->load('answer'),
        ]);
    }

    /**
     * Update an existing answer.
     */
    public function updateAnswer(Request $request, Plan $plan, PlanQuestion $question)
    {
        $this->authorize('update', $plan);

        if ($question->plan_id !== $plan->id || !$question->answer) {
            abort(404);
        }

        $validator = Validator::make($request->all(), [
            'answer_text' => 'required|string|min:5',
            'structured_data' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $question->answer->update([
                'answer_text' => $request->answer_text,
                'answer_data' => $request->structured_data,
            ]);

            // Update plan progress
            $plan->updateProgress();

            return redirect()->route('plans.ai.review', $plan)
                ->with('success', 'تم تحديث الإجابة بنجاح.');
        } catch (\Exception $e) {
            Log::error('Error updating answer: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ في تحديث الإجابة.');
        }
    }

    /**
     * Restart the questioning process.
     */
    public function restart(Plan $plan)
    {
        $this->authorize('update', $plan);

        try {
            DB::beginTransaction();

            // Delete all questions and answers
            $plan->questions()->delete();

            // Reset plan status
            $plan->update([
                'ai_analysis' => null,
                'questioning_status' => null,
                'ai_conversation_context' => null,
                'progress_percentage' => 0,
            ]);

            DB::commit();

            return redirect()->route('plans.ai.start', $plan)
                ->with('success', 'تم إعادة تشغيل عملية الأسئلة الذكية.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error restarting questioning: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ في إعادة تشغيل العملية.');
        }
    }

    /**
     * Get question statistics.
     */
    public function getStatistics(Plan $plan)
    {
        $this->authorize('view', $plan);

        $stats = [
            'total_questions' => $plan->questions()->count(),
            'answered_questions' => $plan->answeredQuestions()->count(),
            'skipped_questions' => $plan->questions()->where('status', 'skipped')->count(),
            'pending_questions' => $plan->pendingQuestions()->count(),
            'completion_percentage' => $plan->getQuestioningProgress(),
            'average_answer_length' => $plan->answers()->avg(DB::raw('LENGTH(answer_text)')),
            'question_types' => $plan->questions()
                ->select('question_type', DB::raw('count(*) as count'))
                ->groupBy('question_type')
                ->get()
                ->toArray(),
        ];

        return response()->json($stats);
    }

    /**
     * Regenerate specific sections based on updated answers.
     */
    public function regenerateSection(Request $request, Plan $plan)
    {
        $this->authorize('update', $plan);

        $validator = Validator::make($request->all(), [
            'section' => 'required|string|in:executive_summary,market_analysis,swot_analysis,marketing_strategy,financial_plan,operational_plan',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'قسم غير صحيح.'], 400);
        }

        try {
            $section = $request->section;
            $allAnswers = $plan->getAnswersSummary();

            // Generate specific section
            $content = match ($section) {
                'executive_summary' => $this->aiService->generateExecutiveSummaryFromAnswers($plan, $allAnswers),
                'market_analysis' => $this->aiService->generateMarketAnalysisFromAnswers($plan, $allAnswers),
                'swot_analysis' => $this->aiService->generateSWOTFromAnswers($plan, $allAnswers),
                'marketing_strategy' => $this->aiService->generateMarketingStrategyFromAnswers($plan, $allAnswers),
                'financial_plan' => $this->aiService->generateFinancialPlanFromAnswers($plan, $allAnswers),
                'operational_plan' => $this->aiService->generateOperationalPlanFromAnswers($plan, $allAnswers),
            };

            // Update the specific section
            $aiAnalysis = $plan->ai_analysis ?? [];
            $aiAnalysis[$section] = $content;
            $plan->update(['ai_analysis' => $aiAnalysis]);

            return response()->json([
                'success' => true,
                'content' => $content,
                'message' => 'تم إعادة توليد القسم بنجاح.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error regenerating section: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في إعادة توليد القسم.'
            ], 500);
        }
    }

    /**
     * Get AI insights about answer quality.
     */
    public function getAnswerInsights(Plan $plan, PlanQuestion $question)
    {
        $this->authorize('view', $plan);

        if ($question->plan_id !== $plan->id || !$question->answer) {
            abort(404);
        }

        try {
            $answer = $question->answer;

            $insights = [
                'length_category' => $answer->getLengthCategory(),
                'readability_score' => $answer->getReadabilityScore(),
                'keywords' => $answer->extractKeywords(),
                'confidence_score' => $answer->getConfidenceScore(),
                'suggestions' => $answer->getAISuggestions(),
                'quality_score' => $this->calculateAnswerQuality($answer),
            ];

            return response()->json([
                'success' => true,
                'insights' => $insights
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting answer insights: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الحصول على تحليل الإجابة.'
            ], 500);
        }
    }

    /**
     * Calculate answer quality score.
     */
    private function calculateAnswerQuality(PlanAnswer $answer): int
    {
        $score = 0;

        // Length factor (30% weight)
        $length = strlen($answer->answer_text);
        if ($length >= 50 && $length <= 500) {
            $score += 30;
        } elseif ($length > 500) {
            $score += 25;
        } elseif ($length >= 20) {
            $score += 15;
        }

        // Readability factor (20% weight)
        $readability = $answer->getReadabilityScore();
        $score += ($readability / 100) * 20;

        // Keyword relevance (30% weight)
        $keywords = $answer->extractKeywords();
        $keywordScore = min(count($keywords) * 5, 30);
        $score += $keywordScore;

        // Confidence factor (20% weight)
        $score += ($answer->getConfidenceScore() / 100) * 20;

        return round(min($score, 100));
    }
}
