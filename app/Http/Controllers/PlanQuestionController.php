<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\PlanQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PlanQuestionController extends Controller
{
    /**
     * Display a listing of plan questions.
     */
    public function index(Plan $plan)
    {
        $this->authorize('view', $plan);

        $questions = $plan->questions()
            ->with('answer')
            ->orderBy('order')
            ->get();

        return Inertia::render('Plans/Questions/Index', [
            'plan' => $plan->load('project'),
            'questions' => $questions,
        ]);
    }

    /**
     * Show the form for creating a new question.
     */
    public function create(Plan $plan)
    {
        $this->authorize('update', $plan);

        return Inertia::render('Plans/Questions/Create', [
            'plan' => $plan->load('project'),
            'questionTypes' => $this->getQuestionTypes(),
        ]);
    }

    /**
     * Store a newly created question.
     */
    public function store(Request $request, Plan $plan)
    {
        $this->authorize('update', $plan);

        $validator = Validator::make($request->all(), [
            'question_type' => 'required|string',
            'question_text' => 'required|string',
            'question_context' => 'sometimes|array',
            'validation_rules' => 'sometimes|array',
            'is_required' => 'boolean',
            'order' => 'sometimes|integer',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $order = $request->order ?? $plan->questions()->max('order') + 1;

            $question = PlanQuestion::create([
                'plan_id' => $plan->id,
                'question_type' => $request->question_type,
                'question_text' => $request->question_text,
                'question_context' => $request->question_context,
                'validation_rules' => $request->validation_rules,
                'is_required' => $request->is_required ?? true,
                'order' => $order,
            ]);

            return redirect()->route('plans.questions.index', $plan)
                ->with('success', 'تم إنشاء السؤال بنجاح.');
        } catch (\Exception $e) {
            Log::error('Error creating question: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ في إنشاء السؤال.');
        }
    }

    /**
     * Display the specified question.
     */
    public function show(Plan $plan, PlanQuestion $question)
    {
        $this->authorize('view', $plan);

        if ($question->plan_id !== $plan->id) {
            abort(404);
        }

        return Inertia::render('Plans/Questions/Show', [
            'plan' => $plan->load('project'),
            'question' => $question->load(['answer', 'parentQuestion', 'followupQuestions']),
        ]);
    }

    /**
     * Show the form for editing the specified question.
     */
    public function edit(Plan $plan, PlanQuestion $question)
    {
        $this->authorize('update', $plan);

        if ($question->plan_id !== $plan->id) {
            abort(404);
        }

        return Inertia::render('Plans/Questions/Edit', [
            'plan' => $plan->load('project'),
            'question' => $question,
            'questionTypes' => $this->getQuestionTypes(),
        ]);
    }

    /**
     * Update the specified question.
     */
    public function update(Request $request, Plan $plan, PlanQuestion $question)
    {
        $this->authorize('update', $plan);

        if ($question->plan_id !== $plan->id) {
            abort(404);
        }

        $validator = Validator::make($request->all(), [
            'question_type' => 'required|string',
            'question_text' => 'required|string',
            'question_context' => 'sometimes|array',
            'validation_rules' => 'sometimes|array',
            'is_required' => 'boolean',
            'order' => 'sometimes|integer',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $question->update([
                'question_type' => $request->question_type,
                'question_text' => $request->question_text,
                'question_context' => $request->question_context,
                'validation_rules' => $request->validation_rules,
                'is_required' => $request->is_required ?? true,
                'order' => $request->order ?? $question->order,
            ]);

            return redirect()->route('plans.questions.index', $plan)
                ->with('success', 'تم تحديث السؤال بنجاح.');
        } catch (\Exception $e) {
            Log::error('Error updating question: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ في تحديث السؤال.');
        }
    }

    /**
     * Remove the specified question.
     */
    public function destroy(Plan $plan, PlanQuestion $question)
    {
        $this->authorize('delete', $plan);

        if ($question->plan_id !== $plan->id) {
            abort(404);
        }

        try {
            DB::beginTransaction();

            // Delete follow-up questions first
            $question->followupQuestions()->delete();

            // Delete the question itself
            $question->delete();

            DB::commit();

            return redirect()->route('plans.questions.index', $plan)
                ->with('success', 'تم حذف السؤال بنجاح.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting question: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ في حذف السؤال.');
        }
    }

    /**
     * Reorder questions.
     */
    public function reorder(Request $request, Plan $plan)
    {
        $this->authorize('update', $plan);

        $validator = Validator::make($request->all(), [
            'questions' => 'required|array',
            'questions.*.id' => 'required|exists:plan_questions,id',
            'questions.*.order' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            foreach ($request->questions as $questionData) {
                PlanQuestion::where('id', $questionData['id'])
                    ->where('plan_id', $plan->id)
                    ->update(['order' => $questionData['order']]);
            }

            DB::commit();

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error reordering questions: ' . $e->getMessage());
            return response()->json(['error' => 'حدث خطأ في إعادة ترتيب الأسئلة.'], 500);
        }
    }

    /**
     * Get question statistics.
     */
    public function statistics(Plan $plan)
    {
        $this->authorize('view', $plan);

        $stats = [
            'total' => $plan->questions()->count(),
            'answered' => $plan->answeredQuestions()->count(),
            'pending' => $plan->pendingQuestions()->count(),
            'skipped' => $plan->questions()->where('status', 'skipped')->count(),
            'required' => $plan->requiredQuestions()->count(),
            'optional' => $plan->questions()->where('is_required', false)->count(),
            'by_type' => $plan->questions()
                ->select('question_type', DB::raw('count(*) as count'))
                ->groupBy('question_type')
                ->get()
                ->pluck('count', 'question_type'),
        ];

        return response()->json($stats);
    }

    /**
     * Get available question types.
     */
    private function getQuestionTypes(): array
    {
        return [
            'business_model' => 'نموذج العمل',
            'target_market' => 'السوق المستهدف',
            'competitive_advantage' => 'الميزة التنافسية',
            'financial_plan' => 'الخطة المالية',
            'marketing_strategy' => 'استراتيجية التسويق',
            'operational_plan' => 'خطة التشغيل',
            'team_structure' => 'هيكل الفريق',
            'product_service' => 'المنتج أو الخدمة',
            'revenue_model' => 'نموذج الإيرادات',
            'risk_assessment' => 'تقييم المخاطر',
            'growth_strategy' => 'استراتيجية النمو',
            'other' => 'أخرى',
        ];
    }
}
