<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use App\Models\Industry;
use App\Models\BusinessType;
use App\Services\AiProjectHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Ensure user is authenticated and exists
        if (!$user instanceof User)
        {
            return redirect()->route('login');
        }

        $projects = $user->projects()->with(['industry', 'businessType'])->get();

        return Inertia::render('Projects/Index', [
            'projects' => $projects
        ]);
    }

    public function create()
    {
        // Get all industries
        $industries = Industry::orderBy('industry_name')->get();

        // Get all business types
        $businessTypes = BusinessType::orderBy('business_type_name')->get();

        return Inertia::render('Projects/Create', [
            'industries' => $industries,
            'businessTypes' => $businessTypes,
            'statusOptions' => [
                ['value' => Project::STATUS_NEW_PROJECT, 'label' => 'مشروع جديد'],
                ['value' => Project::STATUS_EXISTED_PROJECT, 'label' => 'مشروع موجود'],
            ],
            'projectScaleOptions' => [
                ['value' => Project::SCALE_SMALL, 'label' => 'مشروع صغير'],
                ['value' => Project::SCALE_MEDIUM, 'label' => 'مشروع متوسط'],
                ['value' => Project::SCALE_LARGE, 'label' => 'مشروع كبير'],
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:new_project,existed_project',
            'industry_id' => 'required|integer|exists:industries,id',
            'business_type_id' => 'required|integer|exists:business_types,id',
            'target_market' => 'required|string|max:500',
            'location' => 'required|string|max:255',
            'main_product_service' => 'nullable|string',
            'team_size' => 'nullable|integer|min:1',
            'project_scale' => 'nullable|in:small,medium,large',
            'revenue_model' => 'nullable|string|max:255',
            'main_differentiator' => 'nullable|string',
        ]);

        $user = Auth::user();

        // Ensure user is authenticated before creating project
        if (!$user instanceof User)
        {
            return redirect()->route('login');
        }

        // Ensure IDs are integers
        $validated['industry_id'] = (int) $validated['industry_id'];
        $validated['business_type_id'] = (int) $validated['business_type_id'];

        $project = $user->projects()->create($validated);

        return redirect()->route('projects.index')
            ->with('success', 'تم إنشاء المشروع بنجاح');
    }

    public function show(Project $project)
    {
        // Debug authentication
        \Log::info('ProjectController@show debug', [
            'authenticated' => auth()->check(),
            'user_id' => auth()->id(),
            'project_user_id' => $project->user_id,
            'session_id' => session()->getId(),
        ]);

        // Check if user is authenticated
        if (!auth()->check())
        {
            \Log::warning('User not authenticated, redirecting to home');
            return redirect('/')->with('error', 'يجب تسجيل الدخول لعرض المشاريع');
        }

        // Check if the project belongs to the current user
        if ($project->user_id !== auth()->id())
        {
            \Log::warning('User does not own project', [
                'auth_user_id' => auth()->id(),
                'project_user_id' => $project->user_id
            ]);
            return redirect('/')->with('error', 'غير مسموح لك بعرض هذا المشروع');
        }

        // Rest of your method...
        try
        {
            $project->load(['industry', 'businessType']);
        }
        catch (\Exception $e)
        {
            \Log::warning('Failed to load project relationships: ' . $e->getMessage());
        }

        return Inertia::render('Projects/Show', [
            'project' => $project
        ]);
    }

    public function edit(Project $project)
    {
        $this->authorize('update', $project);

        // Get all industries
        $industries = Industry::orderBy('industry_name')->get();

        // Get all business types
        $businessTypes = BusinessType::orderBy('business_type_name')->get();

        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'industries' => $industries,
            'businessTypes' => $businessTypes,
            'statusOptions' => [
                ['value' => Project::STATUS_NEW_PROJECT, 'label' => 'مشروع جديد'],
                ['value' => Project::STATUS_EXISTED_PROJECT, 'label' => 'مشروع موجود'],
            ],
            'projectScaleOptions' => [
                ['value' => Project::SCALE_SMALL, 'label' => 'مشروع صغير'],
                ['value' => Project::SCALE_MEDIUM, 'label' => 'مشروع متوسط'],
                ['value' => Project::SCALE_LARGE, 'label' => 'مشروع كبير'],
            ]
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:new_project,existed_project',
            'industry_id' => 'required|exists:industries,id',
            'business_type_id' => 'required|exists:business_types,id',
            'target_market' => 'required|string',
            'location' => 'required|string',
            'main_product_service' => 'nullable|string',
            'team_size' => 'nullable|integer|min:1',
            'project_scale' => 'nullable|in:small,medium,large',
            'revenue_model' => 'nullable|string|max:255',
            'main_differentiator' => 'nullable|string',
        ]);

        $project->update($validated);

        return back()->with('success', 'تم تحديث المشروع بنجاح');
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);
        $project->delete();
        return back()->with('success', 'تم حذف المشروع بنجاح');
    }

    /**
     * Generate AI field suggestion for new content
     */
    public function generateFieldSuggestion(Request $request)
    {
        $validated = $request->validate([
            'field' => 'required|string|in:target_market,location,main_product_service,revenue_model,main_differentiator,description',
            'project_data' => 'required|array',
            'project_data.name' => 'required|string|max:255',
            'project_data.description' => 'nullable|string',
            'project_data.industry_id' => 'required|exists:industries,id',
            'project_data.business_type_id' => 'required|exists:business_types,id',
            'language' => 'nullable|string|max:5',
        ]);

        $language = $validated['language'] ?? 'en';
        $fieldName = $validated['field'];
        $projectData = $validated['project_data'];

        // Convert to the format expected by AiProjectHelper
        $formattedData = [
            'name' => $projectData['name'],
            'description' => $projectData['description'] ?? '',
            'industry_id' => $projectData['industry_id'],
            'business_type_id' => $projectData['business_type_id'],
        ];

        try
        {
            $aiHelper = new AiProjectHelper();
            $suggestion = $aiHelper->generateFieldSuggestion($formattedData, $fieldName, $language);

            return response()->json([
                'success' => true,
                'content' => $suggestion,
                'field' => $fieldName
            ]);
        }
        catch (\Exception $e)
        {
            Log::error('Failed to generate field suggestion: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate AI suggestion: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Enhance existing field content using AI
     */
    public function enhanceFieldContent(Request $request)
    {
        $validated = $request->validate([
            'field' => 'required|string|in:target_market,location,main_product_service,revenue_model,main_differentiator,description',
            'current_content' => 'required|string',
            'project_data' => 'required|array',
            'project_data.name' => 'required|string|max:255',
            'project_data.description' => 'nullable|string',
            'project_data.industry_id' => 'required|exists:industries,id',
            'project_data.business_type_id' => 'required|exists:business_types,id',
            'language' => 'nullable|string|max:5',
        ]);

        $language = $validated['language'] ?? 'en';
        $fieldName = $validated['field'];
        $currentContent = $validated['current_content'];
        $projectData = $validated['project_data'];

        // Convert to the format expected by AiProjectHelper
        $formattedData = [
            'name' => $projectData['name'],
            'description' => $projectData['description'] ?? '',
            'industry_id' => $projectData['industry_id'],
            'business_type_id' => $projectData['business_type_id'],
        ];

        try
        {
            $aiHelper = new AiProjectHelper();
            $enhancedContent = $aiHelper->enhanceFieldContent($formattedData, $fieldName, $currentContent, $language);

            return response()->json([
                'success' => true,
                'content' => $enhancedContent,
                'field' => $fieldName
            ]);
        }
        catch (\Exception $e)
        {
            Log::error('Failed to enhance field content: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to enhance content: ' . $e->getMessage()
            ], 500);
        }
    }
}
