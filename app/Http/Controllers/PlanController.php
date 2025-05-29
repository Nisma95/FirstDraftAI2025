<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Project;
use App\Services\AIPlannerService;
use App\Services\AIPlannAnswerHelper;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

use Inertia\Inertia;

class PlanController extends Controller
{
    /**
     * The AI planner service instance.
     *
     * @var \App\Services\AIPlannerService
     */
    protected $aiPlanner;
    protected $aiAnswerHelper;


    /**
     * Create a new controller instance.
     *
     * @param  \App\Services\AIPlannerService  $aiPlanner
     * @return void
     */
    public function __construct(AIPlannerService $aiPlanner, AIPlannAnswerHelper $aiAnswerHelper)
    {
        $this->aiPlanner = $aiPlanner;
        $this->aiAnswerHelper = $aiAnswerHelper; // Add this
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $plans = Plan::with('project')->latest()->paginate(20);
        return Inertia::render('Plans/Index', [
            'plans' => $plans
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $projects = Project::all();

        // Get project_id from the request and ensure it's properly cast to an integer
        $project_id = $request->has('project_id') ? (int)$request->input('project_id') : null;

        return Inertia::render('Plans/AiPlanner', [
            'projects' => $projects,
            'project_id' => $project_id // This was missing!
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'summary' => 'nullable|string',
            'status' => 'required|in:draft,generating,partially_completed,completed,premium,failed',
            'progress_percentage' => 'required|integer|min:0|max:100',
        ]);

        $plan = Plan::create($validated);

        // Initialize AI conversation if not in draft mode
        if ($plan->status !== Plan::STATUS_DRAFT) {
            $project = Project::findOrFail($plan->project_id);
            $this->aiPlanner->initializeConversation($project);

            // Save the initial conversation
            // The service will update the plan with the conversation file path
        }

        return redirect("/plans/{$plan->id}");
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function edit(Plan $plan)
    {
        $projects = Project::all();
        return Inertia::render('Plans/Edit', [
            'plan' => $plan,
            'projects' => $projects
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'summary' => 'nullable|string',
            'status' => 'required|in:draft,generating,partially_completed,completed,premium,failed',
            'progress_percentage' => 'required|integer|min:0|max:100',
        ]);

        $plan->update($validated);

        return redirect()->route('Plans.show', $plan)
            ->with('success', 'Plan updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function destroy(Plan $plan)
    {
        // Delete associated files if they exist
        if (!empty($plan->ai_analysis_path) && Storage::exists($plan->ai_analysis_path)) {
            Storage::delete($plan->ai_analysis_path);
        }

        if (!empty($plan->conversation_file_path) && Storage::exists($plan->conversation_file_path)) {
            Storage::delete($plan->conversation_file_path);
        }

        if (!empty($plan->pdf_path) && Storage::exists($plan->pdf_path)) {
            Storage::delete($plan->pdf_path);
        }

        $plan->delete();

        return redirect()->route('Plans.index')
            ->with('success', 'Plan deleted successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function show(Plan $plan)
    {
        // Load the related project WITH industry and business_type relationships
        $plan->load('project.industry', 'project.business_type');

        // Parse ai_analysis if it's a JSON string
        $aiAnalysis = null;
        if (!empty($plan->ai_analysis)) {
            if (is_string($plan->ai_analysis)) {
                try {
                    $aiAnalysis = json_decode($plan->ai_analysis, true);
                } catch (\Exception $e) {
                    Log::error('Error decoding ai_analysis JSON: ' . $e->getMessage());
                    $aiAnalysis = null;
                }
            } else if (is_array($plan->ai_analysis)) {
                $aiAnalysis = $plan->ai_analysis;
            }
        }

        // Check if this is a premium plan or user has premium access
        $isPremium = $plan->status === Plan::STATUS_PREMIUM ||
            (auth()->user() && auth()->user()->hasSubscription && auth()->user()->hasSubscription());

        // Determine if user can generate PDF
        $canGeneratePDF = $plan->isCompleted() && !empty($aiAnalysis);

        // Get the analysis and conversation content if paths exist
        $analysisContent = null;
        $conversationContent = null;

        if (!empty($plan->ai_analysis_path) && Storage::exists($plan->ai_analysis_path)) {
            $analysisContent = Storage::get($plan->ai_analysis_path);
        }

        if (!empty($plan->conversation_file_path) && Storage::exists($plan->conversation_file_path)) {
            $conversationContent = Storage::get($plan->conversation_file_path);
        }

        return Inertia::render('Plans/Show', [
            'plan' => [
                'id' => $plan->id,
                'title' => $plan->title,
                'summary' => $plan->summary,
                'status' => $plan->status,
                'progress_percentage' => $plan->progress_percentage,
                'ai_analysis' => $aiAnalysis, // Pass parsed data directly
                'ai_analysis_path' => $plan->ai_analysis_path,
                'pdf_path' => $plan->pdf_path,
                'conversation_file_path' => $plan->conversation_file_path,
                'created_at' => $plan->created_at,
                'updated_at' => $plan->updated_at,
                'project' => $plan->project,
                'completion_score' => $plan->getCompletionScore(),
                'is_completed' => $plan->isCompleted(),
                'is_generating' => $plan->isGenerating(),
                'has_failed' => $plan->hasFailed()
            ],
            'analysisContent' => $analysisContent,
            'conversationContent' => $conversationContent,
            'canGeneratePDF' => $canGeneratePDF,
            'isPremium' => $isPremium
        ]);
    }

    /**
     * Initialize AI conversation.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function initializeAIConversation(Plan $plan)
    {
        $project = Project::findOrFail($plan->project_id);
        $result = $this->aiPlanner->initializeConversation($project);

        if ($result['success']) {
            $plan->update([
                'status' => Plan::STATUS_GENERATING,
                'progress_percentage' => 10,
            ]);

            return response()->json([
                'success' => true,
                'message' => $result['message']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], 500);
    }

    /**
     * Continue AI conversation.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function continueAIConversation(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $result = $this->aiPlanner->continueConversation($validated['message'], $plan);

        if ($result['success']) {
            // Update progress percentage
            $plan->update([
                'progress_percentage' => min(90, $plan->progress_percentage + 5),
            ]);

            return response()->json([
                'success' => true,
                'message' => $result['message']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], 500);
    }

    /**
     * Generate final analysis.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function generateAnalysis(Plan $plan)
    {
        $result = $this->aiPlanner->generateAnalysis($plan);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'analysis' => $result['analysis']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], 500);
    }

    /**
     * Generate PDF for the plan.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function generatePDF(Plan $plan)
    {
        $result = $this->aiPlanner->generatePDF($plan);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'pdfPath' => $result['pdfPath']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], 500);
    }

    /**
     * Download the AI analysis file.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function downloadAnalysis(Plan $plan)
    {
        if (empty($plan->ai_analysis_path) || !Storage::exists($plan->ai_analysis_path)) {
            return back()->with('error', 'Analysis file not found.');
        }

        return Storage::download($plan->ai_analysis_path, $plan->title . ' - Analysis.md');
    }

    /**
     * Download the conversation file.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function downloadConversation(Plan $plan)
    {
        if (empty($plan->conversation_file_path) || !Storage::exists($plan->conversation_file_path)) {
            return back()->with('error', 'Conversation file not found.');
        }

        return Storage::download($plan->conversation_file_path, $plan->title . ' - Conversation.txt');
    }

    /**
     * Download the PDF file.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function downloadPDF(Plan $plan)
    {
        if (empty($plan->pdf_path) || !Storage::exists($plan->pdf_path)) {
            return back()->with('error', 'PDF file not found.');
        }

        return Storage::download($plan->pdf_path, $plan->title . ' - Business Plan.pdf');
    }

    /**
     * API version of store method.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function apiStore(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'summary' => 'nullable|string',
            'status' => 'required|in:draft,generating,partially_completed,completed,premium,failed',
            'progress_percentage' => 'required|integer|min:0|max:100',
        ]);

        $plan = Plan::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Plan created successfully.',
            'plan' => $plan
        ]);
    }

    /**
     * Check the status of a plan.
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function checkStatus(Plan $plan)
    {
        return response()->json([
            'status' => $plan->status,
            'progress_percentage' => $plan->progress_percentage,
            'current_section' => 'Business plan analysis' // You can make this more detailed if needed
        ]);
    }

    /**
     * Check generation status (for React frontend).
     *
     * @param  \App\Models\Plan  $plan
     * @return \Illuminate\Http\Response
     */
    public function checkGenerationStatus(Plan $plan)
    {
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
    }

    /**
     * Start business plan creation with AI.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function startBusinessPlan(Request $request)
    {
        $validated = $request->validate([
            'business_idea' => 'required|string',
            'project_id' => 'required|exists:projects,id',
            'project_name' => 'required|string',
            'project_description' => 'nullable|string',
        ]);

        try {
            $project = Project::findOrFail($validated['project_id']);

            // Use your AI service to generate the first question
            $questionData = $this->aiPlanner->generateFirstQuestion(
                $validated['business_idea'],
                $validated['project_name'],
                $validated['project_description']
            );

            return response()->json([
                'success' => true,
                'question' => $questionData,
                'message' => 'AI conversation started successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error starting business plan: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get next question based on previous answer.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getNextQuestion(Request $request)
    {
        $validated = $request->validate([
            'answer' => 'required|string',
            'previous_answers' => 'required|array',
            'business_idea' => 'required|string',
            'question_count' => 'required|integer',
        ]);

        try {
            $questionCount = $validated['question_count'];

            // If we've reached 5 questions, indicate completion
            if ($questionCount >= 5) {
                return response()->json([
                    'success' => true,
                    'question' => null,
                    'message' => 'All questions completed'
                ]);
            }

            // Use your AI service to generate the next question
            $questionData = $this->aiPlanner->generateNextQuestion(
                $validated['previous_answers'],
                $validated['business_idea'],
                $questionCount
            );

            if ($questionData) {
                return response()->json([
                    'success' => true,
                    'question' => $questionData,
                    'message' => 'Next question generated'
                ]);
            } else {
                return response()->json([
                    'success' => true,
                    'question' => null,
                    'message' => 'All questions completed'
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error getting next question: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate final business plan from all answers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function generatePlanFromAnswers(Request $request)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
            'business_idea' => 'required|string',
            'project_id' => 'required|exists:projects,id',
            'project_name' => 'required|string',
            'project_description' => 'nullable|string',
        ]);

        try {
            $project = Project::findOrFail($validated['project_id']);

            // Generate a title for the plan using your AI service
            $title = $this->aiPlanner->generateTitleFromAnswers(
                $validated['answers'],
                $validated['project_name'],
                $validated['project_description']
            );

            // Create the plan
            $plan = Plan::create([
                'project_id' => $project->id,
                'title' => $title ?: ($validated['project_name'] . ' - AI Business Plan'),
                'summary' => 'AI-generated business plan based on interview questions',
                'status' => Plan::STATUS_GENERATING,
                'progress_percentage' => 20,
            ]);

            // Prepare data for the AI service
            $planData = [
                'business_idea' => $validated['business_idea'],
                'project_name' => $validated['project_name'],
                'project_description' => $validated['project_description'],
                'answers' => $validated['answers']
            ];

            // Generate the complete business plan using your AI service
            $analysisData = $this->aiPlanner->generateCompleteBusinessPlan($planData);

            // Update the plan with the generated analysis
            // Ensure we store the data as JSON string
            $analysisJson = is_array($analysisData) ? json_encode($analysisData) : $analysisData;

            $plan->update([
                'ai_analysis' => $analysisJson,
                'status' => Plan::STATUS_COMPLETED,
                'progress_percentage' => 100,
            ]);

            return response()->json([
                'success' => true,
                'plan' => [
                    'id' => $plan->id,
                    'title' => $plan->title
                ],
                'message' => 'Business plan generated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error generating plan from answers: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }




    public function generateAnswerSuggestion(Request $request)
    {
        try {
            // Use your existing AIPlannAnswerHelper service
            $result = $this->aiAnswerHelper->generateAnswerSuggestion([
                'question' => $request->input('question', ''),
                'question_type' => $request->input('question_type', 'text'),
                'business_idea' => $request->input('business_idea', ''),
                'project_name' => $request->input('project_name', ''),
                'project_description' => $request->input('project_description', ''),
                'previous_answers' => $request->input('previous_answers', [])
            ]);

            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Error in generateAnswerSuggestion: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error generating answer: ' . $e->getMessage(),
                'suggested_answer' => 'Please provide your own answer for this question.'
            ], 500);
        }
    }
}
