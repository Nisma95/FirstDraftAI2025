<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\PlanQuestion;
use App\Models\PlanAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PlanAnswerController extends Controller
{
    /**
     * Display answers for a specific question.
     */
    public function index(Plan $plan, PlanQuestion $question)
    {
        $this->authorize('view', $plan);

        if ($question->plan_id !== $plan->id) {
            abort(404);
        }

        return Inertia::render('Plans/Answers/Index', [
            'plan' => $plan->load('project'),
            'question' => $question,
            'answer' => $question->answer,
        ]);
    }

    /**
     * Show the form for creating a new answer.
     */
    public function create(Plan $plan, PlanQuestion $question)
    {
        $this->authorize('update', $plan);

        if ($question->plan_id !== $plan->id) {
            abort(404);
        }

        // Check if answer already exists
        if ($question->answer) {
            return redirect()->route('plans.questions.answers.edit', [$plan, $question])
                ->with('info', 'توجد إجابة بالفعل لهذا السؤال. يمكنك تعديلها.');
        }

        return Inertia::render('Plans/Answers/Create', [
            'plan' => $plan->load('project'),
            'question' => $question,
        ]);
    }

    /**
     * Store a newly created answer.
     */
    public function store(Request $request, Plan $plan, PlanQuestion $question)
    {
        $this->authorize('update', $plan);

        if ($question->plan_id !== $plan->id) {
            abort(404);
        }

        // Check if answer already exists
        if ($question->answer) {
            return back()->with('error', 'توجد إجابة بالفعل لهذا السؤال.');
        }

        $validator = Validator::make($request->all(), [
            'answer_text' => 'required|string|min:5',
            'answer_data' => 'sometimes|array',
            'confidence_score' => 'sometimes|integer|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $answer = PlanAnswer::create([
                'plan_question_id' => $question->id,
                'user_id' => Auth::id(),
                'answer_text' => $request->answer_text,
                'answer_data' => $request->answer_data,
                'confidence_score' => $request->confidence_score ?? 100,
            ]);

            // Mark question as answered
            $question->markAsAnswered();

            // Update plan progress
            $plan->updateProgress();

            return redirect()->route('plans.questions.answers.index', [$plan, $question])
                ->with('success', 'تم حفظ الإجابة بنجاح.');
        } catch (\Exception $e) {
            Log::error('Error creating answer: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ في حفظ الإجابة.');
        }
    }

    /**
     * Display the specified answer.
     */
    public function show(Plan $plan, PlanQuestion $question, PlanAnswer $answer)
    {
        $this->authorize('view', $plan);

        if ($question->plan_id !== $plan->id || $answer->plan_question_id !== $question->id) {
            abort(404);
        }

        return Inertia::render('Plans/Answers/Show', [
            'plan' => $plan->load('project'),
            'question' => $question,
            'answer' => $answer,
            'insights' => [
                'length_category' => $answer->getLengthCategory(),
                'readability_score' => $answer->getReadabilityScore(),
                'keywords' => $answer->extractKeywords(),
                'confidence_score' => $answer->getConfidenceScore(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified answer.
     */
    public function edit(Plan $plan, PlanQuestion $question)
    {
        $this->authorize('update', $plan);

        if ($question->plan_id !== $plan->id || !$question->answer) {
            abort(404);
        }

        return Inertia::render('Plans/Answers/Edit', [
            'plan' => $plan->load('project'),
            'question' => $question,
            'answer' => $question->answer,
        ]);
    }

    /**
     * Update the specified answer.
     */
    public function update(Request $request, Plan $plan, PlanQuestion $question)
    {
        $this->authorize('update', $plan);

        if ($question->plan_id !== $plan->id || !$question->answer) {
            abort(404);
        }

        $validator = Validator::make($request->all(), [
            'answer_text' => 'required|string|min:5',
            'answer_data' => 'sometimes|array',
            'confidence_score' => 'sometimes|integer|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $question->answer->update([
                'answer_text' => $request->answer_text,
                'answer_data' => $request->answer_data,
                'confidence_score' => $request->confidence_score ?? $question->answer->confidence_score,
            ]);

            // Update plan progress
            $plan->updateProgress();

            return redirect()->route('plans.questions.answers.index', [$plan, $question])
                ->with('success', 'تم تحديث الإجابة بنجاح.');
        } catch (\Exception $e) {
            Log::error('Error updating answer: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ في تحديث الإجابة.');
        }
    }

    /**
     * Remove the specified answer.
     */
    public function destroy(Plan $plan, PlanQuestion $question)
    {
        $this->authorize('delete', $plan);

        if ($question->plan_id !== $plan->id || !$question->answer) {
            abort(404);
        }

        try {
            DB::beginTransaction();

            // Delete the answer
            $question->answer->delete();

            // Mark question as pending
            $question->update(['status' => 'pending']);

            // Update plan progress
            $plan->updateProgress();

            DB::commit();

            return redirect()->route('plans.questions.index', $plan)
                ->with('success', 'تم حذف الإجابة بنجاح.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting answer: ' . $e->getMessage());
            return back()->with('error', 'حدث خطأ في حذف الإجابة.');
        }
    }

    /**
     * Analyze answer with AI.
     */
    public function analyze(Plan $plan, PlanQuestion $question)
    {
        $this->authorize('update', $plan);

        if ($question->plan_id !== $plan->id || !$question->answer) {
            abort(404);
        }

        try {
            $answer = $question->answer;

            // Analyze answer quality and extract insights
            $insights = [
                'length_category' => $answer->getLengthCategory(),
                'readability_score' => $answer->getReadabilityScore(),
                'keywords' => $answer->extractKeywords(),
                'confidence_score' => $answer->getConfidenceScore(),
                'quality_score' => $this->calculateAnswerQuality($answer),
            ];

            // Generate AI suggestions for improvement
            $aiService = app('App\Services\AIService');
            $suggestions = $aiService->analyzeAnswer($question, $answer);

            // Mark answer as analyzed
            $answer->markAsAnalyzed($insights, $suggestions);

            return response()->json([
                'success' => true,
                'insights' => $insights,
                'suggestions' => $suggestions,
            ]);
        } catch (\Exception $e) {
            Log::error('Error analyzing answer: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تحليل الإجابة.'
            ], 500);
        }
    }

    /**
     * Get answer insights without AI analysis.
     */
    public function insights(Plan $plan, PlanQuestion $question)
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
                'quality_score' => $this->calculateAnswerQuality($answer),
                'word_count' => str_word_count($answer->answer_text),
                'character_count' => strlen($answer->answer_text),
                'created_at' => $answer->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $answer->updated_at->format('Y-m-d H:i:s'),
            ];

            return response()->json([
                'success' => true,
                'insights' => $insights,
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
     * Get all answers for a plan.
     */
    public function planAnswers(Plan $plan)
    {
        $this->authorize('view', $plan);

        try {
            $answers = $plan->answers()
                ->with(['question', 'user'])
                ->orderBy('created_at')
                ->get();

            return response()->json([
                'success' => true,
                'answers' => $answers,
                'statistics' => [
                    'total_answers' => $answers->count(),
                    'average_length' => $answers->avg(function ($answer) {
                        return strlen($answer->answer_text);
                    }),
                    'average_confidence' => $answers->avg('confidence_score'),
                    'completion_rate' => ($answers->count() / $plan->questions()->count()) * 100,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting plan answers: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الحصول على الإجابات.'
            ], 500);
        }
    }

    /**
     * Export answers for a plan.
     */
    public function export(Plan $plan, Request $request)
    {
        $this->authorize('view', $plan);

        $format = $request->input('format', 'json');

        try {
            $answers = $plan->answeredQuestions()
                ->with('answer')
                ->orderBy('order')
                ->get()
                ->map(function ($question) {
                    return [
                        'question_text' => $question->question_text,
                        'question_type' => $question->question_type,
                        'answer_text' => $question->answer->answer_text,
                        'answer_data' => $question->answer->answer_data,
                        'confidence_score' => $question->answer->confidence_score,
                        'created_at' => $question->answer->created_at,
                    ];
                });

            switch ($format) {
                case 'csv':
                    return $this->exportToCsv($answers, $plan);
                case 'pdf':
                    return $this->exportToPdf($answers, $plan);
                default:
                    return response()->json($answers);
            }
        } catch (\Exception $e) {
            Log::error('Error exporting answers: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في تصدير الإجابات.'
            ], 500);
        }
    }

    /**
     * Compare answers between versions.
     */
    public function compare(Plan $plan, PlanQuestion $question, Request $request)
    {
        $this->authorize('view', $plan);

        if ($question->plan_id !== $plan->id) {
            abort(404);
        }

        // This would require answer versioning - placeholder for future implementation
        return response()->json([
            'success' => false,
            'message' => 'ميزة مقارنة الإجابات ستكون متاحة قريباً.'
        ]);
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

    /**
     * Export answers to CSV.
     */
    private function exportToCsv($answers, Plan $plan)
    {
        $filename = "plan-{$plan->id}-answers-" . date('Y-m-d') . ".csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$filename}",
        ];

        $callback = function () use ($answers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Question', 'Type', 'Answer', 'Confidence', 'Date']);

            foreach ($answers as $answer) {
                fputcsv($file, [
                    $answer['question_text'],
                    $answer['question_type'],
                    $answer['answer_text'],
                    $answer['confidence_score'],
                    $answer['created_at'],
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export answers to PDF (placeholder).
     */
    private function exportToPdf($answers, Plan $plan)
    {
        // This would integrate with your PDF service
        return response()->json([
            'success' => false,
            'message' => 'تصدير PDF سيكون متاح قريباً.'
        ]);
    }
}
