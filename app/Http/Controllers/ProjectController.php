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
        if (!$user instanceof User) {
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
            'target_market' => 'required|string',
            'location' => 'required|string',
            // إضافة الحقول الجديدة
            'main_product_service' => 'nullable|string',
            'team_size' => 'nullable|integer|min:1',
            'project_scale' => 'nullable|in:small,medium,large',
            'revenue_model' => 'nullable|string|max:255',
            'main_differentiator' => 'nullable|string',
        ]);

        $user = Auth::user();

        // Ensure user is authenticated before creating project
        if (!$user instanceof User) {
            return redirect()->route('login');
        }

        // Debug: Log the validated data
        Log::info('Project creation data:', $validated);

        // Ensure IDs are integers
        $validated['industry_id'] = (int) $validated['industry_id'];
        $validated['business_type_id'] = (int) $validated['business_type_id'];

        $project = $user->projects()->create($validated);

        // Debug: Log the created project
        Log::info('Created project:', $project->toArray());

        return redirect()->route('projects.index')
            ->with('success', 'تم إنشاء المشروع بنجاح');
    }

    public function show(Project $project)
    {
        $this->authorize('view', $project);

        // Load the relationships
        $project->load(['industry', 'businessType']);

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
            // إضافة الحقول الجديدة
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
     * Generate AI description for project
     */
    public function generateDescription(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|in:new_project,existed_project',
            'industry_id' => 'required|exists:industries,id',
            'business_type_id' => 'required|exists:business_types,id',
            'language' => 'nullable|string|max:5',
        ]);

        $language = $validated['language'] ?? 'en';

        try {
            $aiHelper = new AiProjectHelper();
            $description = $aiHelper->generateProjectDescription($validated, $language);

            return response()->json([
                'success' => true,
                'description' => $description
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate description'
            ], 500);
        }
    }

    /**
     * Enhance an existing AI description for project
     */
    public function enhanceDescription(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|in:new_project,existed_project',
            'industry_id' => 'required|exists:industries,id',
            'business_type_id' => 'required|exists:business_types,id',
            'current_description' => 'required|string',
            'language' => 'nullable|string|max:5',
        ]);

        $language = $validated['language'] ?? 'en';

        try {
            $aiHelper = new AiProjectHelper();
            $enhancedDescription = $aiHelper->enhanceProjectDescription(
                $validated,
                $validated['current_description'],
                $language
            );

            return response()->json([
                'success' => true,
                'description' => $enhancedDescription
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to enhance description'
            ], 500);
        }
    }
}
