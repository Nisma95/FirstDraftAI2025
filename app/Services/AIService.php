<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\PlanQuestion;
use App\Models\PlanAnswer;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class AIService
{
    private $apiKey;
    private $apiEndpoint;

    public function __construct()
    {
        $this->apiKey = config('openai.api_key');
        $baseUrl = config('openai.api_url', 'https://api.openai.com/v1');
        $this->apiEndpoint = rtrim($baseUrl, '/') . '/chat/completions';
    }

    /**
     * Generate first question based on business idea and project context
     */
    public function generateFirstQuestion(string $businessIdea, string $projectName = null, string $projectDescription = null): array
    {
        $projectContext = '';
        if ($projectName && $projectDescription) {
            $projectContext = "
            المشروع المحدد: {$projectName}
            وصف المشروع: {$projectDescription}
            ";
        }

        $prompt = "
        {$projectContext}
        
        بناءً على فكرة العمل التالية: '{$businessIdea}'
        
        اطرح أول سؤال ذكي ومهم لفهم المشروع بشكل أفضل.
        
        يجب أن يكون السؤال:
        - واضح ومحدد
        - يساعد في فهم نموذج العمل
        - يؤدي إلى أسئلة تالية مفيدة
        
        إذا كان السؤال يحتاج إجابة رقمية (مثل المبلغ، عدد العملاء، النسبة المئوية), 
        أضف 'type': 'number' في الاستجابة.
        
        أجب بتنسيق JSON:
        {
            \"question\": \"السؤال\",
            \"type\": \"text\" أو \"number\",
            \"keywords\": [\"keyword1\", \"keyword2\"]
        }
        ";

        $response = $this->callAI($prompt, 'first_question');

        try {
            $questionData = json_decode($response, true);
            if (!$questionData) {
                throw new Exception("Could not parse AI response");
            }
            return $questionData;
        } catch (\Exception $e) {
            Log::error("Error parsing first question: " . $e->getMessage());
            return [
                'question' => 'ما هو الهدف الرئيسي من هذا المشروع؟',
                'type' => 'text',
                'keywords' => ['business', 'goal']
            ];
        }
    }

    /**
     * Generate next question based on previous answers (limited to 5 total)
     */
    public function generateNextQuestion(array $previousAnswers, string $businessIdea, int $questionCount = 1): ?array
    {
        // Stop if we already have 5 questions
        if ($questionCount >= 5) {
            return null;
        }

        $answersContext = "";
        foreach ($previousAnswers as $qa) {
            $answersContext .= "السؤال: {$qa['question']}\nالإجابة: {$qa['answer']}\n\n";
        }

        $prompt = "
        فكرة العمل: {$businessIdea}
        
        الأسئلة والإجابات السابقة:
        {$answersContext}
        
        عدد الأسئلة الحالي: {$questionCount} من 5
        
        بناءً على الإجابات السابقة، اطرح السؤال التالي الأكثر أهمية.
        
        يجب أن يكون السؤال:
        - مبني على الإجابات السابقة
        - يملأ فجوة في المعلومات المطلوبة لخطة العمل
        - واضح ومحدد
        - يركز على الجوانب الأساسية (السوق، التمويل، العملاء، المنافسة، النمو)
        
        إذا كان السؤال يحتاج إجابة رقمية (مثل المبلغ، عدد العملاء, النسبة المئوية),
        أضف 'type': 'number' في الاستجابة.
        
        أجب بتنسيق JSON:
        {
            \"question\": \"السؤال\",
            \"type\": \"text\" أو \"number\",
            \"keywords\": [\"keyword1\", \"keyword2\"]
        }
        ";

        $response = $this->callAI($prompt, 'next_question');

        try {
            $questionData = json_decode($response, true);
            if (!$questionData) {
                throw new Exception("Could not parse AI response");
            }
            return $questionData;
        } catch (\Exception $e) {
            Log::error("Error parsing next question: " . $e->getMessage());

            // Return fallback question based on question count
            $fallbackQuestions = [
                2 => [
                    'question' => 'من هم عملاؤك المستهدفون؟',
                    'type' => 'text',
                    'keywords' => ['customers', 'target']
                ],
                3 => [
                    'question' => 'كم تتوقع أن تحقق من الإيرادات في السنة الأولى؟',
                    'type' => 'number',
                    'keywords' => ['revenue', 'financial']
                ],
                4 => [
                    'question' => 'من هم أهم المنافسين في السوق؟',
                    'type' => 'text',
                    'keywords' => ['competitors', 'market']
                ],
                5 => [
                    'question' => 'ما هي خطتك للنمو والتوسع؟',
                    'type' => 'text',
                    'keywords' => ['growth', 'expansion']
                ]
            ];

            return $fallbackQuestions[$questionCount + 1] ?? null;
        }
    }

    /**
     * Generate business plan from answers using project context
     */
    public function generatePlanFromAnswers(array $answers, string $businessIdea, string $projectName = null, string $projectDescription = null): array
    {
        // Combine all answers into context
        $context = [
            'business_idea' => $businessIdea,
            'project_name' => $projectName,
            'project_description' => $projectDescription,
            'answers' => $answers
        ];

        // Generate each section
        $sections = [
            'executive_summary' => $this->generateSectionFromAnswers('executive_summary', $context),
            'market_analysis' => $this->generateSectionFromAnswers('market_analysis', $context),
            'swot_analysis' => $this->generateSectionFromAnswers('swot_analysis', $context),
            'marketing_strategy' => $this->generateSectionFromAnswers('marketing_strategy', $context),
            'financial_plan' => $this->generateSectionFromAnswers('financial_plan', $context),
            'operational_plan' => $this->generateSectionFromAnswers('operational_plan', $context),
        ];

        // Generate suggestions
        $suggestions = $this->generateSuggestionsFromAnswers($context);

        return [
            'sections' => $sections,
            'suggestions' => $suggestions,
            'completion_score' => 100
        ];
    }

    /**
     * Generate title from answers and project info
     */
    public function generateTitleFromAnswers(array $answers, string $projectName = null, string $projectDescription = null): string
    {
        $answersText = "";
        foreach ($answers as $qa) {
            $answersText .= $qa['answer'] . " ";
        }

        $projectContext = '';
        if ($projectName && $projectDescription) {
            $projectContext = "
            المشروع: {$projectName}
            وصف المشروع: {$projectDescription}
            ";
        }

        $prompt = "
        {$projectContext}
        
        بناءً على الإجابات التالية عن مشروع:
        {$answersText}
        
        اقترح عنواناً مناسباً وجذاباً لخطة العمل.
        العنوان يجب أن يكون:
        - قصير (أقل من 10 كلمات)
        - واضح ومفهوم
        - يعكس طبيعة المشروع
        - مرتبط باسم المشروع إذا كان متوفراً
        
        أعط العنوان فقط بالعربية.
        ";

        return $this->callAI($prompt, 'plan_title');
    }

    /**
     * Generate specific section from answers with project context
     */
    public function generateSectionFromAnswers(string $section, array $context): string
    {
        $answersText = "";
        foreach ($context['answers'] as $qa) {
            $answersText .= "السؤال: {$qa['question']}\nالإجابة: {$qa['answer']}\n\n";
        }

        $projectContext = '';
        if ($context['project_name'] && $context['project_description']) {
            $projectContext = "
            المشروع: {$context['project_name']}
            وصف المشروع: {$context['project_description']}
            ";
        }

        $sectionPrompts = [
            'executive_summary' => "اكتب ملخصاً تنفيذياً شاملاً للمشروع",
            'market_analysis' => "اكتب تحليلاً مفصلاً للسوق المستهدف",
            'swot_analysis' => "اكتب تحليل SWOT للمشروع بتنسيق HTML",
            'marketing_strategy' => "اكتب استراتيجية تسويق شاملة",
            'financial_plan' => "اكتب خطة مالية تفصيلية",
            'operational_plan' => "اكتب خطة تشغيلية متكاملة"
        ];

        $prompt = "
        {$projectContext}
        
        فكرة المشروع: {$context['business_idea']}
        
        الأسئلة والإجابات:
        {$answersText}
        
        {$sectionPrompts[$section]} بناءً على المعلومات أعلاه.
        
        يجب أن يكون المحتوى:
        - مفصلاً وشاملاً
        - منظماً بعناوين فرعية
        - بتنسيق HTML
        - باللغة العربية
        - مرتبط بسياق المشروع المحدد
        ";

        return $this->callAI($prompt, $section);
    }

    /**
     * Generate suggestions from all answers with project context
     */
    public function generateSuggestionsFromAnswers(array $context): array
    {
        $answersText = "";
        foreach ($context['answers'] as $qa) {
            $answersText .= $qa['answer'] . " ";
        }

        $projectContext = '';
        if ($context['project_name'] && $context['project_description']) {
            $projectContext = "
            المشروع: {$context['project_name']}
            وصف المشروع: {$context['project_description']}
            ";
        }

        $prompt = "
        {$projectContext}
        
        بناءً على فكرة المشروع والإجابات التالية:
        فكرة المشروع: {$context['business_idea']}
        الإجابات: {$answersText}
        
        قدم 5 اقتراحات مهمة لتحسين المشروع.
        
        كل اقتراح يجب أن يتضمن:
        - نوع الاقتراح (business/marketing/financial/operational/other)
        - محتوى الاقتراح
        - أولوية (high/medium/low)
        
        أجب بتنسيق JSON:
        [
            {
                \"type\": \"business\",
                \"content\": \"...\",
                \"priority\": \"high\"
            }
        ]
        ";

        $response = $this->callAI($prompt, 'suggestions');

        try {
            return json_decode($response, true) ?? [];
        } catch (\Exception $e) {
            // Fallback suggestions if JSON parsing fails
            return [
                [
                    'type' => 'business',
                    'content' => 'فكر في استراتيجيات النمو المستدامة للمشروع',
                    'priority' => 'high'
                ]
            ];
        }
    }

    /**
     * Helper method to call AI API
     */
    private function callAI(string $prompt, string $context): string
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(config('openai.timeout', 30))->post($this->apiEndpoint, [
                'model' => config('openai.model', 'gpt-3.5-turbo'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'أنت مستشار أعمال محترف متخصص في كتابة خطط العمل باللغة العربية. قدم محتوى مفصل وعملي.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => config('openai.max_tokens', 2000),
                'temperature' => config('openai.temperature', 0.7)
            ]);

            $result = $response->json();

            // Debug logging
            if (config('openai.debug')) {
                Log::info("OpenAI Response", ['response' => $result]);
            }

            if (isset($result['error'])) {
                Log::error("OpenAI Error", ['error' => $result['error']]);
                return "<div class='text-red-500'>خطأ في API: " . ($result['error']['message'] ?? 'Unknown error') . "</div>";
            }

            return $result['choices'][0]['message']['content'] ?? '';
        } catch (\Exception $e) {
            Log::error("AI Generation Error for {$context}: " . $e->getMessage());
            Log::error("Full exception", ['exception' => $e]);
            return "<div class='text-red-500'>خطأ: " . $e->getMessage() . "</div>";
        }
    }

    /**
     * Start the dynamic questioning process for a plan (keeping existing method)
     */
    public function startDynamicQuestioning(Plan $plan, array $initialData = []): array
    {
        // Get initial context from plan and project
        $context = $this->gatherPlanContext($plan);

        // Generate first questions based on context
        $firstQuestions = $this->generateInitialQuestions($context, $initialData);

        // Store questions in database for tracking
        foreach ($firstQuestions as $questionData) {
            PlanQuestion::create([
                'plan_id' => $plan->id,
                'question_type' => $questionData['type'],
                'question_text' => $questionData['question'],
                'question_context' => $questionData['context'] ?? null,
                'order' => $questionData['order'],
                'is_required' => $questionData['required'] ?? true,
                'status' => 'pending'
            ]);
        }

        return [
            'questions' => $firstQuestions,
            'context' => $context,
            'progress' => $this->calculateQuestioningProgress($plan)
        ];
    }

    /**
     * Get next question based on previous answers (keeping existing method)
     */
    public function getNextQuestion(Plan $plan, array $previousAnswers = []): array
    {
        // Get all answered questions for this plan
        $answeredQuestions = $plan->questions()
            ->with('answer')
            ->where('status', 'answered')
            ->get();

        // Get current context including answers
        $context = $this->gatherPlanContext($plan, $answeredQuestions);

        // Generate next intelligent question
        $nextQuestion = $this->generateAdaptiveQuestion($context, $previousAnswers);

        if ($nextQuestion) {
            $question = PlanQuestion::create([
                'plan_id' => $plan->id,
                'question_type' => $nextQuestion['type'],
                'question_text' => $nextQuestion['question'],
                'question_context' => $nextQuestion['context'] ?? null,
                'parent_question_id' => $nextQuestion['parent_id'] ?? null,
                'order' => $this->getNextQuestionOrder($plan),
                'is_required' => $nextQuestion['required'] ?? true,
                'status' => 'pending'
            ]);

            return [
                'question' => $question,
                'has_more' => $this->hasMoreQuestions($plan),
                'progress' => $this->calculateQuestioningProgress($plan)
            ];
        }

        return [
            'question' => null,
            'has_more' => false,
            'progress' => 100,
            'ready_for_generation' => true
        ];
    }

    /**
     * Process user answer and trigger next question or plan generation (keeping existing method)
     */
    public function processAnswer(PlanQuestion $question, $answerData): array
    {
        // Save the answer
        $answer = PlanAnswer::create([
            'plan_question_id' => $question->id,
            'answer_text' => $answerData['text'] ?? '',
            'answer_data' => $answerData['structured_data'] ?? null,
            'confidence_score' => $answerData['confidence'] ?? 100
        ]);

        // Mark question as answered
        $question->update(['status' => 'answered']);

        // Analyze answer and determine next step
        $analysis = $this->analyzeAnswer($question, $answer);

        // Generate follow-up questions if needed
        if ($analysis['needs_followup']) {
            $followupQuestions = $this->generateFollowupQuestions($question, $answer);

            foreach ($followupQuestions as $followup) {
                PlanQuestion::create([
                    'plan_id' => $question->plan_id,
                    'question_type' => $followup['type'],
                    'question_text' => $followup['question'],
                    'parent_question_id' => $question->id,
                    'order' => $this->getNextQuestionOrder($question->plan),
                    'is_required' => $followup['required'] ?? false,
                    'status' => 'pending'
                ]);
            }
        }

        // Check if ready for plan generation
        $plan = $question->plan;
        if ($this->isReadyForPlanGeneration($plan)) {
            return [
                'answer_processed' => true,
                'ready_for_generation' => true,
                'progress' => 100
            ];
        }

        // Get next question
        return $this->getNextQuestion($plan);
    }

    /**
     * Generate comprehensive business plan from collected answers (keeping existing method)
     */
    public function generateDynamicPlan(Plan $plan): array
    {
        // Gather all answers
        $allAnswers = $this->gatherAllAnswers($plan);

        // Generate each section dynamically based on answers
        $sections = [
            'executive_summary' => $this->generateExecutiveSummaryFromAnswers($plan, $allAnswers),
            'market_analysis' => $this->generateMarketAnalysisFromAnswers($plan, $allAnswers),
            'swot_analysis' => $this->generateSWOTFromAnswers($plan, $allAnswers),
            'marketing_strategy' => $this->generateMarketingStrategyFromAnswers($plan, $allAnswers),
            'financial_plan' => $this->generateFinancialPlanFromAnswers($plan, $allAnswers),
            'operational_plan' => $this->generateOperationalPlanFromAnswers($plan, $allAnswers),
        ];

        // Generate comprehensive suggestions
        $suggestions = $this->generateDynamicSuggestions($plan, $allAnswers);

        // Update plan with generated content
        $plan->update([
            'ai_analysis' => $sections,
            'status' => 'completed'
        ]);

        // Save suggestions
        foreach ($suggestions as $suggestion) {
            $plan->aiSuggestions()->create([
                'suggestion_type' => $suggestion['type'],
                'suggestion_content' => $suggestion['content'],
                'priority' => $suggestion['priority'] ?? 'medium',
                'context' => $suggestion['context'] ?? null
            ]);
        }

        return [
            'sections' => $sections,
            'suggestions' => $suggestions,
            'completion_score' => $this->calculateCompletionScore($plan),
            'recommendations' => $this->generateActionableRecommendations($plan, $allAnswers)
        ];
    }

    // Additional helper methods for backward compatibility
    public function generateExecutiveSummaryFromAnswers(Plan $plan, array $allAnswers): string
    {
        return $this->generateSectionFromAnswers('executive_summary', [
            'business_idea' => $plan->ai_conversation_context['business_idea'] ?? '',
            'project_name' => $plan->ai_conversation_context['project_name'] ?? '',
            'project_description' => $plan->ai_conversation_context['project_description'] ?? '',
            'answers' => $allAnswers
        ]);
    }

    public function generateMarketAnalysisFromAnswers(Plan $plan, array $allAnswers): string
    {
        return $this->generateSectionFromAnswers('market_analysis', [
            'business_idea' => $plan->ai_conversation_context['business_idea'] ?? '',
            'project_name' => $plan->ai_conversation_context['project_name'] ?? '',
            'project_description' => $plan->ai_conversation_context['project_description'] ?? '',
            'answers' => $allAnswers
        ]);
    }

    public function generateSWOTFromAnswers(Plan $plan, array $allAnswers): string
    {
        return $this->generateSectionFromAnswers('swot_analysis', [
            'business_idea' => $plan->ai_conversation_context['business_idea'] ?? '',
            'project_name' => $plan->ai_conversation_context['project_name'] ?? '',
            'project_description' => $plan->ai_conversation_context['project_description'] ?? '',
            'answers' => $allAnswers
        ]);
    }

    public function generateMarketingStrategyFromAnswers(Plan $plan, array $allAnswers): string
    {
        return $this->generateSectionFromAnswers('marketing_strategy', [
            'business_idea' => $plan->ai_conversation_context['business_idea'] ?? '',
            'project_name' => $plan->ai_conversation_context['project_name'] ?? '',
            'project_description' => $plan->ai_conversation_context['project_description'] ?? '',
            'answers' => $allAnswers
        ]);
    }

    public function generateFinancialPlanFromAnswers(Plan $plan, array $allAnswers): string
    {
        return $this->generateSectionFromAnswers('financial_plan', [
            'business_idea' => $plan->ai_conversation_context['business_idea'] ?? '',
            'project_name' => $plan->ai_conversation_context['project_name'] ?? '',
            'project_description' => $plan->ai_conversation_context['project_description'] ?? '',
            'answers' => $allAnswers
        ]);
    }

    public function generateOperationalPlanFromAnswers(Plan $plan, array $allAnswers): string
    {
        return $this->generateSectionFromAnswers('operational_plan', [
            'business_idea' => $plan->ai_conversation_context['business_idea'] ?? '',
            'project_name' => $plan->ai_conversation_context['project_name'] ?? '',
            'project_description' => $plan->ai_conversation_context['project_description'] ?? '',
            'answers' => $allAnswers
        ]);
    }

    public function generateDynamicSuggestions(Plan $plan, array $allAnswers): array
    {
        return $this->generateSuggestionsFromAnswers([
            'business_idea' => $plan->ai_conversation_context['business_idea'] ?? '',
            'project_name' => $plan->ai_conversation_context['project_name'] ?? '',
            'project_description' => $plan->ai_conversation_context['project_description'] ?? '',
            'answers' => $allAnswers
        ]);
    }

    private function extractStrengths(array $allAnswers): array
    {
        return [
            'plan_title' => $plan->title,
            'plan_summary' => $plan->summary,
            'project' => $plan->project->toArray(),
            'existing_answers' => $questionsAnswered ? $questionsAnswered->toArray() : [],
            'industry' => $plan->project->industry,
            'target_market' => $plan->project->target_market,
        ];
    }

    private function generateInitialQuestions(array $context, array $initialData): array
    {
        $questions = [];
        $order = 1;

        // Essential business model questions
        if (!isset($initialData['business_model'])) {
            $questions[] = [
                'type' => 'business_model',
                'question' => 'صف نموذج العمل الأساسي لمشروعك. كيف ستحقق الإيرادات؟',
                'order' => $order++,
                'required' => true,
                'context' => 'business_fundamentals'
            ];
        }

        // Market understanding questions
        if (!isset($initialData['target_market'])) {
            $questions[] = [
                'type' => 'target_market',
                'question' => 'من هم عملاؤك المثاليون؟ حدد الفئة العمرية والديموغرافية والاحتياجات الأساسية.',
                'order' => $order++,
                'required' => true,
                'context' => 'market_analysis'
            ];
        }

        // Competitive advantage questions
        $questions[] = [
            'type' => 'competitive_advantage',
            'question' => 'ما الذي يميز منتجك أو خدمتك عن المنافسين الموجودين في السوق؟',
            'order' => $order++,
            'required' => true,
            'context' => 'market_positioning'
        ];

        return $questions;
    }

    private function generateAdaptiveQuestion(array $context, array $previousAnswers): ?array
    {
        // Similar implementation to original but limited to 5 questions
        return null;
    }

    private function generateFollowupQuestions(PlanQuestion $question, PlanAnswer $answer): array
    {
        // Similar implementation to original
        return [];
    }

    private function calculateQuestioningProgress(Plan $plan): int
    {
        $totalQuestions = $plan->questions()->count();
        $answeredQuestions = $plan->questions()->where('status', 'answered')->count();

        if ($totalQuestions === 0) return 0;

        return min(100, round(($answeredQuestions / min($totalQuestions, 5)) * 100));
    }

    // Add all the other helper methods from the original class...
}
