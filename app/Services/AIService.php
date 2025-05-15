<?php

namespace App\Services;

// Add all these imports including Exception
use App\Models\Plan;
use App\Models\PlanQuestion;
use App\Models\PlanAnswer;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\App;
use Exception; // Add this line

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
     * Get appropriate prompts based on current locale
     */
    private function getPrompts(): array
    {
        $locale = App::getLocale();

        if ($locale === 'ar') {
            return [
                'first_question_system' => 'أنت مستشار أعمال محترف متخصص في كتابة خطط العمل باللغة العربية. قدم محتوى مفصل وعملي.',
                'first_question_prompt' => "
                {PROJECT_CONTEXT}
                
                بناءً على فكرة العمل التالية: '{BUSINESS_IDEA}'
                
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
            ",
                'next_question_prompt' => "
                فكرة العمل: {BUSINESS_IDEA}
                
                الأسئلة والإجابات السابقة:
                {ANSWERS_CONTEXT}
                
                عدد الأسئلة الحالي: {QUESTION_COUNT} من 5
                
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
            ",
                'section_prompts' => [
                    'executive_summary' => "اكتب ملخصاً تنفيذياً شاملاً للمشروع",
                    'market_analysis' => "اكتب تحليلاً مفصلاً للسوق المستهدف",
                    'swot_analysis' => "اكتب تحليل SWOT للمشروع بتنسيق HTML",
                    'marketing_strategy' => "اكتب استراتيجية تسويق شاملة",
                    'financial_plan' => "اكتب خطة مالية تفصيلية",
                    'operational_plan' => "اكتب خطة تشغيلية متكاملة"
                ],
                'suggestions_prompt' => "
                {PROJECT_CONTEXT}
                
                بناءً على فكرة المشروع والإجابات التالية:
                فكرة المشروع: {BUSINESS_IDEA}
                الإجابات: {ANSWERS_TEXT}
                
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
            ",
                'fallback_questions' => [
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
                ],
                'fallback_suggestions' => [
                    [
                        'type' => 'business',
                        'content' => 'فكر في استراتيجيات النمو المستدامة للمشروع',
                        'priority' => 'high'
                    ]
                ]
            ];
        } else {
            // English prompts
            return [
                'first_question_system' => 'You are a professional business consultant specialized in creating comprehensive business plans. Provide detailed and practical content.',
                'first_question_prompt' => "
                {PROJECT_CONTEXT}
                
                Based on the following business idea: '{BUSINESS_IDEA}'
                
                Ask the first smart and important question to better understand the project.
                
                The question should be:
                - Clear and specific
                - Help understand the business model
                - Lead to useful follow-up questions
                
                If the question requires a numeric answer (like amount, number of customers, percentage), 
                add 'type': 'number' in the response.
                
                Respond in JSON format:
                {
                    \"question\": \"The question\",
                    \"type\": \"text\" or \"number\",
                    \"keywords\": [\"keyword1\", \"keyword2\"]
                }
            ",
                'next_question_prompt' => "
                Business idea: {BUSINESS_IDEA}
                
                Previous questions and answers:
                {ANSWERS_CONTEXT}
                
                Current question count: {QUESTION_COUNT} of 5
                
                Based on the previous answers, ask the next most important question.
                
                The question should be:
                - Built on previous answers
                - Fill a gap in the information needed for the business plan
                - Clear and specific
                - Focus on essential aspects (market, finance, customers, competition, growth)
                
                If the question requires a numeric answer (like amount, number of customers, percentage),
                add 'type': 'number' in the response.
                
                Respond in JSON format:
                {
                    \"question\": \"The question\",
                    \"type\": \"text\" or \"number\",
                    \"keywords\": [\"keyword1\", \"keyword2\"]
                }
            ",
                'section_prompts' => [
                    'executive_summary' => "Write a comprehensive executive summary for the project",
                    'market_analysis' => "Write a detailed analysis of the target market",
                    'swot_analysis' => "Write a SWOT analysis for the project in HTML format",
                    'marketing_strategy' => "Write a comprehensive marketing strategy",
                    'financial_plan' => "Write a detailed financial plan",
                    'operational_plan' => "Write an integrated operational plan"
                ],
                'suggestions_prompt' => "
                {PROJECT_CONTEXT}
                
                Based on the business idea and the following answers:
                Business idea: {BUSINESS_IDEA}
                Answers: {ANSWERS_TEXT}
                
                Provide 5 important suggestions to improve the project.
                
                Each suggestion should include:
                - Type of suggestion (business/marketing/financial/operational/other)
                - Suggestion content
                - Priority (high/medium/low)
                
                Respond in JSON format:
                [
                    {
                        \"type\": \"business\",
                        \"content\": \"...\",
                        \"priority\": \"high\"
                    }
                ]
            ",
                'fallback_questions' => [
                    2 => [
                        'question' => 'Who are your target customers?',
                        'type' => 'text',
                        'keywords' => ['customers', 'target']
                    ],
                    3 => [
                        'question' => 'How much revenue do you expect to generate in the first year?',
                        'type' => 'number',
                        'keywords' => ['revenue', 'financial']
                    ],
                    4 => [
                        'question' => 'Who are your main competitors in the market?',
                        'type' => 'text',
                        'keywords' => ['competitors', 'market']
                    ],
                    5 => [
                        'question' => 'What is your plan for growth and expansion?',
                        'type' => 'text',
                        'keywords' => ['growth', 'expansion']
                    ]
                ],
                'fallback_suggestions' => [
                    [
                        'type' => 'business',
                        'content' => 'Consider sustainable growth strategies for the project',
                        'priority' => 'high'
                    ]
                ]
            ];
        }
    }

    /**
     * Generate first question based on business idea and project context
     */
    public function generateFirstQuestion(string $businessIdea, string $projectName = null, string $projectDescription = null): array
    {
        $prompts = $this->getPrompts();

        $projectContext = '';
        if ($projectName && $projectDescription) {
            $currentLocale = App::getLocale();
            if ($currentLocale === 'ar') {
                $projectContext = "
                المشروع المحدد: {$projectName}
                وصف المشروع: {$projectDescription}
                ";
            } else {
                $projectContext = "
                Selected Project: {$projectName}
                Project Description: {$projectDescription}
                ";
            }
        }

        $prompt = str_replace(
            ['{PROJECT_CONTEXT}', '{BUSINESS_IDEA}'],
            [$projectContext, $businessIdea],
            $prompts['first_question_prompt']
        );

        $response = $this->callAI($prompt, 'first_question', $prompts['first_question_system']);

        try {
            $questionData = json_decode($response, true);
            if (!$questionData) {
                throw new \Exception("Could not parse AI response");
            }
            return $questionData;
        } catch (\Exception $e) {
            Log::error("Error parsing first question: " . $e->getMessage());

            // Return appropriate fallback question based on locale
            $locale = App::getLocale();
            if ($locale === 'ar') {
                return [
                    'question' => 'ما هو الهدف الرئيسي من هذا المشروع؟',
                    'type' => 'text',
                    'keywords' => ['business', 'goal']
                ];
            } else {
                return [
                    'question' => 'What is the main goal of this project?',
                    'type' => 'text',
                    'keywords' => ['business', 'goal']
                ];
            }
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

        $prompts = $this->getPrompts();

        $answersContext = "";
        foreach ($previousAnswers as $qa) {
            $locale = App::getLocale();
            if ($locale === 'ar') {
                $answersContext .= "السؤال: {$qa['question']}\nالإجابة: {$qa['answer']}\n\n";
            } else {
                $answersContext .= "Question: {$qa['question']}\nAnswer: {$qa['answer']}\n\n";
            }
        }

        $prompt = str_replace(
            ['{BUSINESS_IDEA}', '{ANSWERS_CONTEXT}', '{QUESTION_COUNT}'],
            [$businessIdea, $answersContext, $questionCount],
            $prompts['next_question_prompt']
        );

        $response = $this->callAI($prompt, 'next_question', $prompts['first_question_system']);

        try {
            $questionData = json_decode($response, true);
            if (!$questionData) {
                throw new Exception("Could not parse AI response");
            }
            return $questionData;
        } catch (\Exception $e) {
            Log::error("Error parsing next question: " . $e->getMessage());

            // Return fallback question based on question count and locale
            return $prompts['fallback_questions'][$questionCount + 1] ?? null;
        }
    }


    /**
     * Get default content for sections that fail to generate
     * Add this method to your AIService class
     */
    private function getDefaultSectionContent(string $section): string
    {
        $locale = App::getLocale();

        if ($locale === 'ar') {
            $defaults = [
                'executive_summary' => '<h3>الملخص التنفيذي</h3><p>سيتم إنشاء الملخص التنفيذي قريباً. يرجى الانتظار.</p>',
                'market_analysis' => '<h3>تحليل السوق</h3><p>سيتم إنشاء تحليل السوق قريباً. يرجى الانتظار.</p>',
                'swot_analysis' => '<h3>تحليل SWOT</h3><p>سيتم إنشاء تحليل SWOT قريباً. يرجى الانتظار.</p>',
                'marketing_strategy' => '<h3>الاستراتيجية التسويقية</h3><p>سيتم إنشاء الاستراتيجية التسويقية قريباً. يرجى الانتظار.</p>',
                'financial_plan' => '<h3>الخطة المالية</h3><p>سيتم إنشاء الخطة المالية قريباً. يرجى الانتظار.</p>',
                'operational_plan' => '<h3>الخطة التشغيلية</h3><p>سيتم إنشاء الخطة التشغيلية قريباً. يرجى الانتظار.</p>'
            ];
        } else {
            $defaults = [
                'executive_summary' => '<h3>Executive Summary</h3><p>Executive summary will be generated shortly. Please wait.</p>',
                'market_analysis' => '<h3>Market Analysis</h3><p>Market analysis will be generated shortly. Please wait.</p>',
                'swot_analysis' => '<h3>SWOT Analysis</h3><p>SWOT analysis will be generated shortly. Please wait.</p>',
                'marketing_strategy' => '<h3>Marketing Strategy</h3><p>Marketing strategy will be generated shortly. Please wait.</p>',
                'financial_plan' => '<h3>Financial Plan</h3><p>Financial plan will be generated shortly. Please wait.</p>',
                'operational_plan' => '<h3>Operational Plan</h3><p>Operational plan will be generated shortly. Please wait.</p>'
            ];
        }

        return $defaults[$section] ?? '<p>Content will be available shortly.</p>';
    }

    /**
     * Build the complete business plan prompt
     */
    private function buildCompleteBusinessPlanPrompt(array $data): string
    {
        $businessIdea = $data['business_idea'];
        $projectName = $data['project_name'] ?? '';
        $projectDescription = $data['project_description'] ?? '';
        $answers = $data['answers'] ?? [];

        $locale = App::getLocale();

        $answersText = '';
        if ($locale === 'ar') {
            foreach ($answers as $index => $answer) {
                $answersText .= "سؤال " . ($index + 1) . ": " . $answer['question'] . "\n";
                $answersText .= "الإجابة: " . $answer['answer'] . "\n\n";
            }
        } else {
            foreach ($answers as $index => $answer) {
                $answersText .= "Question " . ($index + 1) . ": " . $answer['question'] . "\n";
                $answersText .= "Answer: " . $answer['answer'] . "\n\n";
            }
        }

        if ($locale === 'ar') {
            return "
        أنشئ خطة عمل شاملة للمشروع التالي:

        **اسم المشروع:** {$projectName}
        **وصف المشروع:** {$projectDescription}
        **فكرة العمل:** {$businessIdea}

        **إجابات التحليل:**
        {$answersText}

        يرجى إنشاء خطة عمل شاملة تتضمن الأقسام التالية بصيغة HTML منظمة وجذابة:

        1. **الملخص التنفيذي** (executive_summary)
        2. **تحليل السوق** (market_analysis)  
        3. **تحليل SWOT** (swot_analysis)
        4. **الاستراتيجية التسويقية** (marketing_strategy)
        5. **الخطة المالية** (financial_plan)
        6. **الخطة التشغيلية** (operational_plan)

        يرجى تنسيق الإجابة كـ JSON صحيح بالشكل التالي:
        {
            \"executive_summary\": \"<محتوى HTML>\",
            \"market_analysis\": \"<محتوى HTML>\",
            \"swot_analysis\": \"<محتوى HTML>\",
            \"marketing_strategy\": \"<محتوى HTML>\",
            \"financial_plan\": \"<محتوى HTML>\",
            \"operational_plan\": \"<محتوى HTML>\"
        }

        تأكد من:
        - استخدام HTML منظم مع العناوين والفقرات
        - تضمين تفاصيل مفيدة وقابلة للتطبيق
        - الاستناد على المعلومات المقدمة في الإجابات
        - كتابة محتوى باللغة العربية
        ";
        } else {
            return "
        Create a comprehensive business plan for the following project:

        **Project Name:** {$projectName}
        **Project Description:** {$projectDescription}
        **Business Idea:** {$businessIdea}

        **Analysis Answers:**
        {$answersText}

        Please create a comprehensive business plan including the following sections in organized and attractive HTML format:

        1. **Executive Summary** (executive_summary)
        2. **Market Analysis** (market_analysis)  
        3. **SWOT Analysis** (swot_analysis)
        4. **Marketing Strategy** (marketing_strategy)
        5. **Financial Plan** (financial_plan)
        6. **Operational Plan** (operational_plan)

        Please format the response as valid JSON in the following format:
        {
            \"executive_summary\": \"<HTML content>\",
            \"market_analysis\": \"<HTML content>\",
            \"swot_analysis\": \"<HTML content>\",
            \"marketing_strategy\": \"<HTML content>\",
            \"financial_plan\": \"<HTML content>\",
            \"operational_plan\": \"<HTML content>\"
        }

        Make sure to:
        - Use organized HTML with headings and paragraphs
        - Include useful and actionable details
        - Base the content on the information provided in the answers
        - Write content in English
        ";
        }
    }

    /**
     * Parse the AI response into business plan sections
     */
    private function parseBusinessPlanResponse(string $response): array
    {
        try {
            // Clean the response - remove any markdown formatting or extra text
            $response = trim($response);

            // Try to extract JSON from the response
            if (preg_match('/\{.*\}/s', $response, $matches)) {
                $jsonString = $matches[0];
                $decoded = json_decode($jsonString, true);

                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    // Validate that all required sections are present
                    $requiredSections = [
                        'executive_summary',
                        'market_analysis',
                        'swot_analysis',
                        'marketing_strategy',
                        'financial_plan',
                        'operational_plan'
                    ];

                    foreach ($requiredSections as $section) {
                        if (!isset($decoded[$section])) {
                            $decoded[$section] = $this->getDefaultSectionContent($section);
                        }
                    }

                    return $decoded;
                }
            }

            // Fallback: Extract sections manually if JSON parsing fails
            return $this->extractSectionsFromText($response);
        } catch (Exception $e) {
            Log::warning('Failed to parse AI response for complete business plan: ' . $e->getMessage());
            return $this->getDefaultBusinessPlanSections();
        }
    }

    /**
     * Extract sections from text response (fallback method)
     */
    private function extractSectionsFromText(string $text): array
    {
        $locale = App::getLocale();

        $sections = [
            'executive_summary' => '',
            'market_analysis' => '',
            'swot_analysis' => '',
            'marketing_strategy' => '',
            'financial_plan' => '',
            'operational_plan' => ''
        ];

        // Define patterns based on locale
        if ($locale === 'ar') {
            $patterns = [
                'executive_summary' => '/(?:الملخص التنفيذي|executive_summary)(.*?)(?=تحليل السوق|market_analysis|تحليل SWOT|swot_analysis|$)/si',
                'market_analysis' => '/(?:تحليل السوق|market_analysis)(.*?)(?=تحليل SWOT|swot_analysis|الاستراتيجية التسويقية|marketing_strategy|$)/si',
                'swot_analysis' => '/(?:تحليل SWOT|swot_analysis)(.*?)(?=الاستراتيجية التسويقية|marketing_strategy|الخطة المالية|financial_plan|$)/si',
                'marketing_strategy' => '/(?:الاستراتيجية التسويقية|marketing_strategy)(.*?)(?=الخطة المالية|financial_plan|الخطة التشغيلية|operational_plan|$)/si',
                'financial_plan' => '/(?:الخطة المالية|financial_plan)(.*?)(?=الخطة التشغيلية|operational_plan|$)/si',
                'operational_plan' => '/(?:الخطة التشغيلية|operational_plan)(.*?)$/si'
            ];
        } else {
            $patterns = [
                'executive_summary' => '/(?:Executive Summary|executive_summary)(.*?)(?=Market Analysis|market_analysis|SWOT Analysis|swot_analysis|$)/si',
                'market_analysis' => '/(?:Market Analysis|market_analysis)(.*?)(?=SWOT Analysis|swot_analysis|Marketing Strategy|marketing_strategy|$)/si',
                'swot_analysis' => '/(?:SWOT Analysis|swot_analysis)(.*?)(?=Marketing Strategy|marketing_strategy|Financial Plan|financial_plan|$)/si',
                'marketing_strategy' => '/(?:Marketing Strategy|marketing_strategy)(.*?)(?=Financial Plan|financial_plan|Operational Plan|operational_plan|$)/si',
                'financial_plan' => '/(?:Financial Plan|financial_plan)(.*?)(?=Operational Plan|operational_plan|$)/si',
                'operational_plan' => '/(?:Operational Plan|operational_plan)(.*?)$/si'
            ];
        }

        foreach ($patterns as $section => $pattern) {
            preg_match($pattern, $text, $matches);
            if (!empty($matches[1])) {
                $content = trim($matches[1]);
                // Ensure content is wrapped in HTML tags
                if (!preg_match('/<[^>]+>/', $content)) {
                    $content = '<p>' . nl2br($content) . '</p>';
                }
                $sections[$section] = $content;
            } else {
                $sections[$section] = $this->getDefaultSectionContent($section);
            }
        }

        return $sections;
    }

    /**
     * Get default business plan sections
     */
    private function getDefaultBusinessPlanSections(): array
    {
        $locale = App::getLocale();

        if ($locale === 'ar') {
            return [
                'executive_summary' => '<h3>الملخص التنفيذي</h3><p>سيتم إنشاء الملخص التنفيذي قريباً. يرجى الانتظار.</p>',
                'market_analysis' => '<h3>تحليل السوق</h3><p>سيتم إنشاء تحليل السوق قريباً. يرجى الانتظار.</p>',
                'swot_analysis' => '<h3>تحليل SWOT</h3><p>سيتم إنشاء تحليل SWOT قريباً. يرجى الانتظار.</p>',
                'marketing_strategy' => '<h3>الاستراتيجية التسويقية</h3><p>سيتم إنشاء الاستراتيجية التسويقية قريباً. يرجى الانتظار.</p>',
                'financial_plan' => '<h3>الخطة المالية</h3><p>سيتم إنشاء الخطة المالية قريباً. يرجى الانتظار.</p>',
                'operational_plan' => '<h3>الخطة التشغيلية</h3><p>سيتم إنشاء الخطة التشغيلية قريباً. يرجى الانتظار.</p>'
            ];
        } else {
            return [
                'executive_summary' => '<h3>Executive Summary</h3><p>Executive summary will be generated shortly. Please wait.</p>',
                'market_analysis' => '<h3>Market Analysis</h3><p>Market analysis will be generated shortly. Please wait.</p>',
                'swot_analysis' => '<h3>SWOT Analysis</h3><p>SWOT analysis will be generated shortly. Please wait.</p>',
                'marketing_strategy' => '<h3>Marketing Strategy</h3><p>Marketing strategy will be generated shortly. Please wait.</p>',
                'financial_plan' => '<h3>Financial Plan</h3><p>Financial plan will be generated shortly. Please wait.</p>',
                'operational_plan' => '<h3>Operational Plan</h3><p>Operational plan will be generated shortly. Please wait.</p>'
            ];
        }
    }

    /**
     * Helper method to call AI API
     */
    private function callAI(string $prompt, string $context, string $systemMessage = null): string
    {
        try {
            // Use provided system message or get default based on locale
            if (!$systemMessage) {
                $prompts = $this->getPrompts();
                $systemMessage = $prompts['first_question_system'];
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(config('openai.timeout', 30))->post($this->apiEndpoint, [
                'model' => config('openai.model', 'gpt-3.5-turbo'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $systemMessage
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
                $locale = App::getLocale();
                $errorMsg = $locale === 'ar'
                    ? "خطأ في API: " . ($result['error']['message'] ?? 'Unknown error')
                    : "API Error: " . ($result['error']['message'] ?? 'Unknown error');
                return "<div class='text-red-500'>{$errorMsg}</div>";
            }

            return $result['choices'][0]['message']['content'] ?? '';
        } catch (\Exception $e) {
            Log::error("AI Generation Error for {$context}: " . $e->getMessage());
            Log::error("Full exception", ['exception' => $e]);
            $locale = App::getLocale();
            $errorMsg = $locale === 'ar' ? "خطأ: " . $e->getMessage() : "Error: " . $e->getMessage();
            return "<div class='text-red-500'>{$errorMsg}</div>";
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

        $locale = App::getLocale();
        $projectContext = '';

        if ($projectName && $projectDescription) {
            if ($locale === 'ar') {
                $projectContext = "
                المشروع: {$projectName}
                وصف المشروع: {$projectDescription}
                ";
            } else {
                $projectContext = "
                Project: {$projectName}
                Project Description: {$projectDescription}
                ";
            }
        }

        if ($locale === 'ar') {
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
        } else {
            $prompt = "
            {$projectContext}
            
            Based on the following project answers:
            {$answersText}
            
            Suggest an appropriate and attractive title for the business plan.
            The title should be:
            - Short (less than 10 words)
            - Clear and understandable
            - Reflect the nature of the project
            - Related to the project name if available
            
            Give only the title in English.
            ";
        }

        return $this->callAI($prompt, 'plan_title');
    }

    /**
     * Generate specific section from answers with project context
     */
    public function generateSectionFromAnswers(string $section, array $context): string
    {
        $locale = App::getLocale();
        $answersText = "";

        foreach ($context['answers'] as $qa) {
            if ($locale === 'ar') {
                $answersText .= "السؤال: {$qa['question']}\nالإجابة: {$qa['answer']}\n\n";
            } else {
                $answersText .= "Question: {$qa['question']}\nAnswer: {$qa['answer']}\n\n";
            }
        }

        $projectContext = '';
        if ($context['project_name'] && $context['project_description']) {
            if ($locale === 'ar') {
                $projectContext = "
            المشروع: {$context['project_name']}
            وصف المشروع: {$context['project_description']}
            ";
            } else {
                $projectContext = "
            Project: {$context['project_name']}
            Project Description: {$context['project_description']}
            ";
            }
        }

        // Get prompts based on locale
        $prompts = $this->getPrompts();
        $sectionPrompts = $prompts['section_prompts'];

        if ($locale === 'ar') {
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
        } else {
            $prompt = "
        {$projectContext}
        
        Business idea: {$context['business_idea']}
        
        Questions and answers:
        {$answersText}
        
        {$sectionPrompts[$section]} based on the information above.
        
        The content should be:
        - Detailed and comprehensive
        - Organized with subheadings
        - In HTML format
        - In English
        - Related to the specific project context
        ";
        }

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

        $locale = App::getLocale();
        $prompts = $this->getPrompts();

        $projectContext = '';
        if ($context['project_name'] && $context['project_description']) {
            if ($locale === 'ar') {
                $projectContext = "
            المشروع: {$context['project_name']}
            وصف المشروع: {$context['project_description']}
            ";
            } else {
                $projectContext = "
            Project: {$context['project_name']}
            Project Description: {$context['project_description']}
            ";
            }
        }

        $prompt = str_replace(
            ['{PROJECT_CONTEXT}', '{BUSINESS_IDEA}', '{ANSWERS_TEXT}'],
            [$projectContext, $context['business_idea'], $answersText],
            $prompts['suggestions_prompt']
        );

        $response = $this->callAI($prompt, 'suggestions');

        try {
            return json_decode($response, true) ?? $prompts['fallback_suggestions'];
        } catch (\Exception $e) {
            return $prompts['fallback_suggestions'];
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

    private function gatherPlanContext(Plan $plan, $questionsAnswered = null): array
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

    private function gatherAllAnswers(Plan $plan): array
    {
        // Implementation to gather all answers from the plan
        return [];
    }

    private function getNextQuestionOrder(Plan $plan): int
    {
        return $plan->questions()->max('order') + 1;
    }

    private function hasMoreQuestions(Plan $plan): bool
    {
        return $plan->questions()->where('status', 'pending')->exists();
    }

    private function analyzeAnswer(PlanQuestion $question, PlanAnswer $answer): array
    {
        return ['needs_followup' => false];
    }

    private function isReadyForPlanGeneration(Plan $plan): bool
    {
        return $plan->questions()->where('status', 'pending')->count() === 0;
    }

    private function calculateCompletionScore(Plan $plan): int
    {
        return 100;
    }

    private function generateActionableRecommendations(Plan $plan, array $allAnswers): array
    {
        return [];
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
}
