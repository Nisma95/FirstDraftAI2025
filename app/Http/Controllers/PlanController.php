<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Project;
use App\Services\AIService;
use App\Services\PDFService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PlanController extends Controller
{
    protected $aiService;
    protected $pdfService;

    public function __construct(AIService $aiService, PDFService $pdfService)
    {
        $this->aiService = $aiService;
        $this->pdfService = $pdfService;
    }

    /**
     * Display a listing of the plans.
     */
    public function index()
    {
        $user = Auth::user();
        $plans = Plan::whereHas('project', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with(['project', 'finance', 'market'])
            ->latest()
            ->get();

        return Inertia::render('Plans/Index', [
            'plans' => $plans,
            'projects' => $user->projects
        ]);
    }

    /**
     * Show the form for creating a new plan.
     * 
     * Fixed: Remove status filter to show all projects, including launched ones
     */
    public function create(Request $request)
    {
        $user = Auth::user();

        // Get the project_id from query parameters if provided
        $projectId = $request->query('project_id');

        // Debug logging
        Log::info('PlanController@create called', [
            'user_id' => $user->id,
            'project_id' => $projectId,
            'query_params' => $request->query(),
            'all_input' => $request->all()
        ]);

        // Get all user projects - remove the status filter
        $projects = $user->projects()
            ->select('id', 'name', 'status') // Only select needed fields
            ->orderBy('created_at', 'desc') // Show newest first
            ->get();

        // If user has no projects, redirect to create project with message
        if ($projects->isEmpty()) {
            return redirect()->route('projects.create')
                ->with('info', 'يجب إنشاء مشروع أولاً قبل إنشاء خطة عمل.');
        }

        // If project_id is provided, validate that the user owns this project
        $selectedProject = null;
        if ($projectId) {
            $selectedProject = $projects->firstWhere('id', (int)$projectId);
            if (!$selectedProject) {
                // Project doesn't exist or user doesn't own it
                Log::warning('Invalid project_id provided', [
                    'project_id' => $projectId,
                    'user_id' => $user->id
                ]);
                // Redirect without the project_id parameter
                return redirect()->route('plans.create')
                    ->with('error', 'المشروع المحدد غير موجود أو غير مصرح لك بالوصول إليه.');
            }
        }

        // Debug what we're passing to React
        $responseData = [
            'projects' => $projects,
            'project_id' => $projectId ? (int)$projectId : null, // Ensure it's an integer
            'selected_project' => $selectedProject, // Add this for extra clarity
            'auth' => [
                'user' => $user
            ]
        ];

        Log::info('Passing data to React', $responseData);

        return Inertia::render('Plans/AiPlanner', $responseData);
    }

    /**
     * Store a newly created plan in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id|integer',
            'title' => 'required|string|max:255',
            'summary' => 'nullable|string|max:2000',
        ]);

        // Ensure user owns the project
        $project = Project::where('id', $validated['project_id'])
            ->where('user_id', Auth::id())
            ->first();

        if (!$project) {
            return back()->withErrors(['project_id' => 'المشروع المحدد غير موجود أو غير مصرح لك بالوصول إليه.']);
        }

        DB::beginTransaction();
        try {
            $plan = Plan::create([
                'project_id' => $project->id,
                'title' => $validated['title'],
                'summary' => $validated['summary'],
                'status' => 'draft'
            ]);

            // Initialize related records
            $plan->finance()->create([]);
            $plan->market()->create([]);

            // Generate initial AI analysis if summary provided
            if (!empty($validated['summary'])) {
                $this->generateAIAnalysis($plan);
            }

            DB::commit();

            return redirect()->route('plans.show', ['plan' => $plan->id])
                ->with('success', 'تم إنشاء خطة العمل بنجاح');
        } catch (\Exception $e) {
            DB::rollBack();

            // Log the error for debugging
            Log::error('Error creating plan: ' . $e->getMessage());

            return back()
                ->withInput()
                ->with('error', 'حدث خطأ أثناء إنشاء خطة العمل. يرجى المحاولة مرة أخرى.');
        }
    }

    /**
     * Display the specified plan.
     */
    public function show(Plan $plan)
    {
        $this->authorize('view', $plan);

        $plan->load([
            'project',
            'finance',
            'market',
            'audiences',
            'goals.tasks',
            'aiSuggestions'
        ]);

        return Inertia::render('Plans/Show', [
            'plan' => $plan,
            'sections' => $this->getPlanSections($plan),
            'canGeneratePDF' => $this->canGeneratePDF($plan),
            'isPremium' => $plan->status === 'premium'
        ]);
    }

    /**
     * Show the form for editing the specified plan.
     */
    public function edit(Plan $plan)
    {
        $this->authorize('update', $plan);

        $plan->load(['project', 'finance', 'market', 'audiences', 'goals']);

        return Inertia::render('Plans/Edit', [
            'plan' => $plan
        ]);
    }

    /**
     * Update the specified plan in storage.
     */
    public function update(Request $request, Plan $plan)
    {
        $this->authorize('update', $plan);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'summary' => 'nullable|string',
            'finance' => 'array',
            'market' => 'array',
            'audiences' => 'array',
            'goals' => 'array'
        ]);

        DB::beginTransaction();
        try {
            // Update plan
            if (isset($validated['title']) || isset($validated['summary'])) {
                $plan->update([
                    'title' => $validated['title'] ?? $plan->title,
                    'summary' => $validated['summary'] ?? $plan->summary
                ]);
            }

            // Update finance
            if (isset($validated['finance'])) {
                $plan->finance()->updateOrCreate([], $validated['finance']);
            }

            // Update market
            if (isset($validated['market'])) {
                $plan->market()->updateOrCreate([], $validated['market']);
            }

            // Update audiences
            if (isset($validated['audiences'])) {
                $plan->audiences()->delete();
                foreach ($validated['audiences'] as $audience) {
                    $plan->audiences()->create($audience);
                }
            }

            // Update goals
            if (isset($validated['goals'])) {
                foreach ($validated['goals'] as $goalData) {
                    if (isset($goalData['id'])) {
                        $goal = $plan->goals()->find($goalData['id']);
                        if ($goal) {
                            $goal->update($goalData);
                        }
                    } else {
                        $plan->goals()->create($goalData);
                    }
                }
            }

            // Generate updated AI analysis
            $this->generateAIAnalysis($plan);

            // Upgrade status if complete
            if ($plan->hasCompleteData() && $plan->status === 'draft') {
                $plan->upgradeToCompleted();
            }

            DB::commit();

            return back()->with('success', 'تم تحديث خطة العمل بنجاح');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'حدث خطأ أثناء تحديث خطة العمل');
        }
    }

    /**
     * Remove the specified plan from storage.
     */
    public function destroy(Plan $plan)
    {
        $this->authorize('delete', $plan);

        // Delete PDF file if exists
        if ($plan->pdf_path && Storage::exists($plan->pdf_path)) {
            Storage::delete($plan->pdf_path);
        }

        $plan->delete();

        return redirect()->route('plans.index')
            ->with('success', 'تم حذف خطة العمل بنجاح');
    }

    /**
     * Generate PDF for the plan.
     */
    public function generatePDF(Plan $plan)
    {
        $this->authorize('view', $plan);

        if (!$this->canGeneratePDF($plan)) {
            return back()->with('error', 'لا يمكن توليد ملف PDF لهذه الخطة حاليا');
        }

        $user = $plan->project->user;
        $isPremium = $user->subscription_type === 'premium';

        $pdfPath = $this->pdfService->generatePlanPDF($plan, $isPremium);
        $plan->updatePdfPath($pdfPath);

        return response()->download(storage_path('app/' . $pdfPath));
    }

    /**
     * Generate AI analysis for the plan.
     */
    private function generateAIAnalysis(Plan $plan)
    {
        try {
            $analysisData = $this->aiService->generatePlanAnalysis([
                'plan' => $plan,
                'project' => $plan->project,
                'finance' => $plan->finance,
                'market' => $plan->market,
                'audiences' => $plan->audiences
            ]);

            $plan->update([
                'ai_analysis' => $analysisData
            ]);

            // Generate suggestions
            if (isset($analysisData['suggestions']) && is_array($analysisData['suggestions'])) {
                foreach ($analysisData['suggestions'] as $suggestion) {
                    $plan->aiSuggestions()->create([
                        'suggestion_type' => $suggestion['type'] ?? 'general',
                        'suggestion_content' => $suggestion['content'] ?? ''
                    ]);
                }
            }
        } catch (\Exception $e) {
            // Log AI analysis error but don't fail the plan creation
            Log::warning('AI analysis failed for plan ' . $plan->id . ': ' . $e->getMessage());
        }
    }

    /**
     * Get plan sections for display.
     */
    private function getPlanSections(Plan $plan): array
    {
        return [
            'executive_summary' => [
                'title' => 'الملخص التنفيذي',
                'content' => $plan->executive_summary,
                'completed' => !empty($plan->executive_summary)
            ],
            'market_analysis' => [
                'title' => 'تحليل السوق',
                'content' => $plan->market_analysis,
                'completed' => $plan->market()->exists()
            ],
            'marketing_plan' => [
                'title' => 'خطة التسويق',
                'content' => $plan->ai_analysis['marketing_plan'] ?? '',
                'completed' => $plan->audiences()->exists()
            ],
            'financial_resources' => [
                'title' => 'الموارد المالية',
                'content' => $plan->ai_analysis['financial_plan'] ?? '',
                'completed' => $plan->finance()->exists()
            ],
            'swot_analysis' => [
                'title' => 'SWOT التحليل',
                'content' => $plan->swot_analysis,
                'completed' => !empty($plan->swot_analysis)
            ],
            'operational_plan' => [
                'title' => 'خطة التشغيل',
                'content' => $plan->operational_plan,
                'completed' => $plan->goals()->exists()
            ]
        ];
    }

    /**
     * Check if PDF can be generated.
     */
    private function canGeneratePDF(Plan $plan): bool
    {
        return $plan->status !== 'draft' && $plan->hasCompleteData();
    }
}
