<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\Project;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\App;
use Exception;

class AIPlannerService
{
    /**
     * The OpenAI API endpoint.
     *
     * @var string
     */
    protected $endpoint;

    /**
     * The OpenAI API key.
     *
     * @var string
     */
    protected $apiKey;

    /**
     * The model to use.
     *
     * @var string
     */
    protected $model;

    /**
     * Create a new AIPlannerService instance.
     */
    public function __construct()
    {
        $this->endpoint = config('services.openai.endpoint', 'https://api.openai.com/v1/chat/completions');
        $this->apiKey = config('services.openai.api_key');
        $this->model = config('services.openai.model', 'gpt-3.5-turbo');

        // Validate API key
        if (empty($this->apiKey))
        {
            Log::error('OpenAI API key is not configured');
        }
    }

    /**
     * Parse AI response more robustly
     */
    private function parseAIResponse(string $response): ?array
    {
        // Clean the response
        $response = trim($response);

        Log::info('Raw AI Response:', ['response' => $response]);

        // Remove any markdown code block formatting
        $response = preg_replace('/```json\s*/', '', $response);
        $response = preg_replace('/```\s*$/', '', $response);

        // Try to find JSON in the response
        if (preg_match('/\{.*\}/s', $response, $matches))
        {
            $jsonString = $matches[0];

            // Try to decode
            $decoded = json_decode($jsonString, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded))
            {
                Log::info('Successfully parsed AI response:', $decoded);
                return $decoded;
            }
            else
            {
                Log::error('JSON decode error:', ['error' => json_last_error_msg(), 'json' => $jsonString]);
            }
        }

        Log::warning('Could not extract JSON from AI response');
        return null;
    }

    /**
     * Get appropriate prompts based on current locale - Updated for Business Plan Focus
     */
    private function getPrompts(): array
    {
        $locale = App::getLocale();

        if ($locale === 'ar')
        {
            return [
                'first_question_system' => 'أنت مستشار أعمال محترف متخصص في كتابة خطط العمل باللغة العربية. لديك معلومات كاملة عن المشروع (الوصف، الصناعة، نوع العمل، الجمهور المستهدف، نموذج الإيرادات، إلخ). ركز على الأسئلة الاستراتيجية لخطة العمل وليس المعلومات الأساسية. أجب دائماً بتنسيق JSON صحيح.',
                'first_question_prompt' => "
                المشروع: {PROJECT_NAME}
                الوصف: {PROJECT_DESCRIPTION}
                الصناعة: {PROJECT_INDUSTRY}
                نوع العمل: {PROJECT_BUSINESS_TYPE}
                الجمهور المستهدف: {PROJECT_TARGET}
                الموقع: {PROJECT_LOCATION}
                نموذج الإيرادات: {PROJECT_REVENUE_MODEL}
                المنتج/الخدمة الرئيسية: {PROJECT_MAIN_PRODUCT}
                
                بناءً على معلومات المشروع أعلاه لـ '{BUSINESS_IDEA}'
                
                اطرح أول سؤال استراتيجي مهم لبناء خطة عمل قوية. 
                
                يجب أن يركز السؤال على:
                - الاستراتيجية التنافسية
                - التحديات المتوقعة
                - خطة التمويل والاستثمار
                - استراتيجية النمو والتوسع
                - التحليل المالي المتقدم
                - خطة التشغيل والإدارة
                
                لا تسأل عن المعلومات الأساسية المتوفرة بالفعل.
                
                أجب بتنسيق JSON صحيح فقط:
                {
                    \"question\": \"السؤال الاستراتيجي\",
                    \"type\": \"text\",
                    \"keywords\": [\"keyword1\", \"keyword2\"],
                    \"category\": \"strategy/finance/operations/marketing/competition\"
                }
            ",
                'next_question_prompt' => "
                معلومات المشروع:
                - الاسم: {PROJECT_NAME}
                - الوصف: {PROJECT_DESCRIPTION}
                - الصناعة: {PROJECT_INDUSTRY}
                - نوع العمل: {PROJECT_BUSINESS_TYPE}
                - الجمهور المستهدف: {PROJECT_TARGET}
                - نموذج الإيرادات: {PROJECT_REVENUE_MODEL}
                
                الأسئلة والإجابات السابقة:
                {ANSWERS_CONTEXT}
                
                عدد الأسئلة الحالي: {QUESTION_COUNT} من 5
                
                بناءً على معلومات المشروع والإجابات السابقة، اطرح السؤال الاستراتيجي التالي لإكمال خطة العمل.
                
                ركز على الجوانب التي لم يتم تغطيتها بعد:
                - التحليل التنافسي المتعمق
                - استراتيجية دخول السوق
                - خطة التمويل والميزانية التشغيلية
                - مؤشرات الأداء الرئيسية (KPIs)
                - إدارة المخاطر
                - خطة التوظيف والفريق
                - استراتيجية التسعير
                - خطة التسويق والمبيعات
                
                أجب بتنسيق JSON صحيح فقط:
                {
                    \"question\": \"السؤال الاستراتيجي\",
                    \"type\": \"text\",
                    \"keywords\": [\"keyword1\", \"keyword2\"],
                    \"category\": \"strategy/finance/operations/marketing/competition\"
                }
            ",
                'fallback_questions' => [
                    2 => [
                        'question' => 'ما هي استراتيجيتك للتميز عن المنافسين في السوق؟',
                        'type' => 'text',
                        'keywords' => ['competitive', 'strategy'],
                        'category' => 'competition'
                    ],
                    3 => [
                        'question' => 'كم تحتاج من رأس المال للبدء وما هي مصادر التمويل المخططة؟',
                        'type' => 'number',
                        'keywords' => ['capital', 'funding'],
                        'category' => 'finance'
                    ],
                    4 => [
                        'question' => 'ما هي خطتك لتحقيق النمو في السنوات الثلاث الأولى؟',
                        'type' => 'text',
                        'keywords' => ['growth', 'scaling'],
                        'category' => 'strategy'
                    ],
                    5 => [
                        'question' => 'ما هي أكبر التحديات المتوقعة وكيف ستتعامل معها؟',
                        'type' => 'text',
                        'keywords' => ['challenges', 'risks'],
                        'category' => 'strategy'
                    ]
                ]
            ];
        }
        else
        {
            // English prompts
            return [
                'first_question_system' => 'You are a professional business consultant specialized in creating comprehensive business plans. You have complete project information (description, industry, business type, target audience, revenue model, etc.). Focus on strategic business plan questions, not basic project information. Always respond in valid JSON format only.',
                'first_question_prompt' => "
                Project: {PROJECT_NAME}
                Description: {PROJECT_DESCRIPTION}
                Industry: {PROJECT_INDUSTRY}
                Business Type: {PROJECT_BUSINESS_TYPE}
                Target Audience: {PROJECT_TARGET}
                Location: {PROJECT_LOCATION}
                Revenue Model: {PROJECT_REVENUE_MODEL}
                Main Product/Service: {PROJECT_MAIN_PRODUCT}
                
                Based on the project information above for '{BUSINESS_IDEA}'
                
                Ask the first strategic question important for building a strong business plan.
                
                The question should focus on:
                - Competitive strategy
                - Expected challenges
                - Funding and investment plan
                - Growth and expansion strategy
                - Advanced financial analysis
                - Operations and management plan
                
                Do NOT ask about basic information already available.
                
                Respond in valid JSON format only:
                {
                    \"question\": \"Strategic question\",
                    \"type\": \"text\",
                    \"keywords\": [\"keyword1\", \"keyword2\"],
                    \"category\": \"strategy/finance/operations/marketing/competition\"
                }
            ",
                'next_question_prompt' => "
                Project Information:
                - Name: {PROJECT_NAME}
                - Description: {PROJECT_DESCRIPTION}
                - Industry: {PROJECT_INDUSTRY}
                - Business Type: {PROJECT_BUSINESS_TYPE}
                - Target Audience: {PROJECT_TARGET}
                - Revenue Model: {PROJECT_REVENUE_MODEL}
                
                Previous questions and answers:
                {ANSWERS_CONTEXT}
                
                Current question count: {QUESTION_COUNT} of 5
                
                Based on the project information and previous answers, ask the next strategic question to complete the business plan.
                
                Focus on aspects not yet covered:
                - Deep competitive analysis
                - Market entry strategy
                - Funding plan and operational budget
                - Key Performance Indicators (KPIs)
                - Risk management
                - Hiring and team plan
                - Pricing strategy
                - Marketing and sales plan
                
                Respond in valid JSON format only:
                {
                    \"question\": \"Strategic question\",
                    \"type\": \"text\",
                    \"keywords\": [\"keyword1\", \"keyword2\"],
                    \"category\": \"strategy/finance/operations/marketing/competition\"
                }
            ",
                'fallback_questions' => [
                    2 => [
                        'question' => 'What is your strategy to differentiate from competitors in the market?',
                        'type' => 'text',
                        'keywords' => ['competitive', 'strategy'],
                        'category' => 'competition'
                    ],
                    3 => [
                        'question' => 'How much capital do you need to start and what are your planned funding sources?',
                        'type' => 'number',
                        'keywords' => ['capital', 'funding'],
                        'category' => 'finance'
                    ],
                    4 => [
                        'question' => 'What is your plan for achieving growth in the first three years?',
                        'type' => 'text',
                        'keywords' => ['growth', 'scaling'],
                        'category' => 'strategy'
                    ],
                    5 => [
                        'question' => 'What are the biggest expected challenges and how will you handle them?',
                        'type' => 'text',
                        'keywords' => ['challenges', 'risks'],
                        'category' => 'strategy'
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
        Log::info('Generating first question', [
            'business_idea' => $businessIdea,
            'project_name' => $projectName,
            'project_description' => $projectDescription
        ]);

        $prompts = $this->getPrompts();

        $projectContext = '';
        if ($projectName && $projectDescription)
        {
            $currentLocale = App::getLocale();
            if ($currentLocale === 'ar')
            {
                $projectContext = "
                المشروع المحدد: {$projectName}
                وصف المشروع: {$projectDescription}
                ";
            }
            else
            {
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

        if (empty($response))
        {
            Log::error('Empty response from AI for first question');
            return $this->getFallbackFirstQuestion();
        }

        try
        {
            $questionData = $this->parseAIResponse($response);
            if (!$questionData)
            {
                Log::warning('Could not parse AI response, using fallback');
                return $this->getFallbackFirstQuestion();
            }

            // Validate required fields
            if (!isset($questionData['question']) || empty($questionData['question']))
            {
                Log::error('Missing question field in AI response');
                return $this->getFallbackFirstQuestion();
            }

            // Set default values for optional fields
            $questionData['type'] = $questionData['type'] ?? 'text';
            $questionData['keywords'] = $questionData['keywords'] ?? [];

            Log::info('Successfully generated first question', $questionData);
            return $questionData;
        }
        catch (\Exception $e)
        {
            Log::error("Error parsing first question: " . $e->getMessage());
            return $this->getFallbackFirstQuestion();
        }
    }

    /**
     * Generate next question based on previous answers (limited to 5 total)
     */
    public function generateNextQuestion(array $previousAnswers, string $businessIdea, int $questionCount = 1): ?array
    {
        // Stop if we already have 5 questions
        if ($questionCount >= 5)
        {
            Log::info('Reached maximum number of questions (5)');
            return null;
        }

        Log::info('Generating next question', [
            'question_count' => $questionCount,
            'previous_answers_count' => count($previousAnswers),
            'business_idea' => $businessIdea
        ]);

        $prompts = $this->getPrompts();

        $answersContext = "";
        foreach ($previousAnswers as $qa)
        {
            $locale = App::getLocale();
            if ($locale === 'ar')
            {
                $answersContext .= "السؤال: {$qa['question']}\nالإجابة: {$qa['answer']}\n\n";
            }
            else
            {
                $answersContext .= "Question: {$qa['question']}\nAnswer: {$qa['answer']}\n\n";
            }
        }

        $prompt = str_replace(
            ['{BUSINESS_IDEA}', '{ANSWERS_CONTEXT}', '{QUESTION_COUNT}'],
            [$businessIdea, $answersContext, $questionCount],
            $prompts['next_question_prompt']
        );

        $response = $this->callAI($prompt, 'next_question', $prompts['first_question_system']);

        if (empty($response))
        {
            Log::error('Empty response from AI for next question');
            return $prompts['fallback_questions'][$questionCount + 1] ?? null;
        }

        try
        {
            $questionData = $this->parseAIResponse($response);
            if (!$questionData)
            {
                Log::warning('Could not parse AI response for next question, using fallback');
                return $prompts['fallback_questions'][$questionCount + 1] ?? null;
            }

            // Validate required fields
            if (!isset($questionData['question']) || empty($questionData['question']))
            {
                Log::error('Missing question field in AI response for next question');
                return $prompts['fallback_questions'][$questionCount + 1] ?? null;
            }

            // Set default values for optional fields
            $questionData['type'] = $questionData['type'] ?? 'text';
            $questionData['keywords'] = $questionData['keywords'] ?? [];

            Log::info('Successfully generated next question', $questionData);
            return $questionData;
        }
        catch (\Exception $e)
        {
            Log::error("Error parsing next question: " . $e->getMessage());
            return $prompts['fallback_questions'][$questionCount + 1] ?? null;
        }
    }

    /**
     * Generate complete business plan from answers using project context
     */
    public function generateCompleteBusinessPlan(array $data): array
    {
        $businessIdea = $data['business_idea'];
        $projectName = $data['project_name'] ?? '';
        $projectDescription = $data['project_description'] ?? '';
        $answers = $data['answers'] ?? [];

        Log::info('Generating complete business plan', [
            'business_idea' => $businessIdea,
            'project_name' => $projectName,
            'answers_count' => count($answers)
        ]);

        $locale = App::getLocale();

        $answersText = '';
        if ($locale === 'ar')
        {
            foreach ($answers as $index => $answer)
            {
                $answersText .= "سؤال " . ($index + 1) . ": " . $answer['question'] . "\n";
                $answersText .= "الإجابة: " . $answer['answer'] . "\n\n";
            }
        }
        else
        {
            foreach ($answers as $index => $answer)
            {
                $answersText .= "Question " . ($index + 1) . ": " . $answer['question'] . "\n";
                $answersText .= "Answer: " . $answer['answer'] . "\n\n";
            }
        }

        if ($locale === 'ar')
        {
            $systemMessage = 'أنت مستشار أعمال محترف متخصص في كتابة خطط العمل باللغة العربية. قدم محتوى مفصل وعملي بتنسيق JSON صحيح.';

            $prompt = "
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

        يرجى تنسيق الإجابة كـ JSON صحيح بالشكل التالي فقط (لا تضف أي نص إضافي):
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
        - الإجابة بـ JSON صحيح فقط
        ";
        }
        else
        {
            $systemMessage = 'You are a professional business consultant specialized in creating comprehensive business plans. Provide detailed and practical content in valid JSON format only.';

            $prompt = "
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

        Please format the response as valid JSON only (no additional text):
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
        - Respond with valid JSON only
        ";
        }

        $response = $this->callAI($prompt, 'complete_business_plan', $systemMessage);

        if (empty($response))
        {
            Log::error('Empty response from AI for complete business plan');
            return $this->getDefaultBusinessPlanSections();
        }

        try
        {
            // Clean the response - remove any markdown formatting or extra text
            $response = trim($response);

            // Try to extract JSON from the response
            if (preg_match('/\{.*\}/s', $response, $matches))
            {
                $jsonString = $matches[0];
                $decoded = json_decode($jsonString, true);

                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded))
                {
                    // Validate that all required sections are present
                    $requiredSections = [
                        'executive_summary',
                        'market_analysis',
                        'swot_analysis',
                        'marketing_strategy',
                        'financial_plan',
                        'operational_plan'
                    ];

                    foreach ($requiredSections as $section)
                    {
                        if (!isset($decoded[$section]))
                        {
                            $decoded[$section] = $this->getDefaultSectionContent($section);
                        }
                    }

                    Log::info('Successfully generated complete business plan');
                    return $decoded;
                }
            }

            // Fallback: Extract sections manually if JSON parsing fails
            Log::warning('JSON parsing failed, attempting manual extraction');
            return $this->extractSectionsFromText($response);
        }
        catch (Exception $e)
        {
            Log::error('Failed to parse AI response for complete business plan: ' . $e->getMessage());
            return $this->getDefaultBusinessPlanSections();
        }
    }

    /**
     * Generate title from answers and project info
     */
    public function generateTitleFromAnswers(array $answers, string $projectName = null, string $projectDescription = null): string
    {
        $answersText = "";
        foreach ($answers as $qa)
        {
            $answersText .= $qa['answer'] . " ";
        }

        $locale = App::getLocale();
        $projectContext = '';

        if ($projectName && $projectDescription)
        {
            if ($locale === 'ar')
            {
                $projectContext = "
                المشروع: {$projectName}
                وصف المشروع: {$projectDescription}
                ";
            }
            else
            {
                $projectContext = "
                Project: {$projectName}
                Project Description: {$projectDescription}
                ";
            }
        }

        if ($locale === 'ar')
        {
            $systemMessage = 'أنت مستشار أعمال محترف. قدم عنواناً واضحاً ومباشراً لخطة العمل. أجب بالعنوان فقط بدون أي تنسيق إضافي أو JSON.';
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
            
            أعط العنوان فقط بالعربية بدون أي تنسيق إضافي.
            ";
        }
        else
        {
            $systemMessage = 'You are a professional business consultant. Provide a clear and direct business plan title. Respond with only the title without any additional formatting or JSON.';
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
            
            Give only the title in English without any additional formatting.
            ";
        }

        $title = $this->callAI($prompt, 'plan_title', $systemMessage);

        // Clean the title - remove any JSON formatting, quotes, or extra characters
        $title = trim($title);
        $title = trim($title, '"\'');

        // Remove any JSON-like formatting
        if (preg_match('/^{\s*"title"\s*:\s*"([^"]+)"\s*}$/', $title, $matches))
        {
            $title = $matches[1];
        }

        // Remove markdown or other formatting
        $title = preg_replace('/^\*\*(.+)\*\*$/', '$1', $title);
        $title = preg_replace('/^#+\s*(.+)$/', '$1', $title);

        // Provide fallback if title is still problematic
        if (empty($title) || strlen($title) > 100 || str_contains($title, '{') || str_contains($title, '}'))
        {
            return $projectName ? "{$projectName} - Business Plan" : "AI-Generated Business Plan";
        }

        return $title;
    }

    /**
     * Helper method to call AI API with improved error handling
     */
    private function callAI(string $prompt, string $context, string $systemMessage = null): string
    {
        if (empty($this->apiKey))
        {
            Log::error('OpenAI API key is not configured');
            return '';
        }

        try
        {
            // Use provided system message or get default based on locale
            if (!$systemMessage)
            {
                $prompts = $this->getPrompts();
                $systemMessage = $prompts['first_question_system'];
            }

            Log::info("Making AI API call for context: {$context}");

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(60)->post($this->endpoint, [
                'model' => $this->model,
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
                'max_tokens' => 3000,
                'temperature' => 0.7
            ]);

            Log::info("AI API Response Status: " . $response->status());

            if (!$response->successful())
            {
                Log::error("OpenAI API Error", [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'context' => $context
                ]);

                // Return appropriate error message based on status
                if ($response->status() === 401)
                {
                    throw new Exception('Invalid OpenAI API key');
                }
                elseif ($response->status() === 429)
                {
                    throw new Exception('OpenAI API rate limit exceeded');
                }
                elseif ($response->status() === 500)
                {
                    throw new Exception('OpenAI API server error');
                }
                else
                {
                    throw new Exception("OpenAI API error: " . $response->status());
                }
            }

            $result = $response->json();

            if (isset($result['error']))
            {
                Log::error("OpenAI Error", ['error' => $result['error'], 'context' => $context]);
                throw new Exception("OpenAI API Error: " . ($result['error']['message'] ?? 'Unknown error'));
            }

            if (!isset($result['choices'][0]['message']['content']))
            {
                Log::error("Unexpected AI response format", ['result' => $result, 'context' => $context]);
                throw new Exception('Unexpected response format from OpenAI');
            }

            $content = $result['choices'][0]['message']['content'];
            Log::info("AI API call successful for context: {$context}");

            return $content;
        }
        catch (\Exception $e)
        {
            Log::error("AI Generation Error for {$context}: " . $e->getMessage(), [
                'exception' => $e,
                'context' => $context
            ]);
            throw $e;
        }
    }

    /**
     * Get fallback first question
     */
    private function getFallbackFirstQuestion(): array
    {
        $locale = App::getLocale();
        if ($locale === 'ar')
        {
            return [
                'question' => 'ما هو الهدف الرئيسي من هذا المشروع؟',
                'type' => 'text',
                'keywords' => ['business', 'goal']
            ];
        }
        else
        {
            return [
                'question' => 'What is the main goal of this project?',
                'type' => 'text',
                'keywords' => ['business', 'goal']
            ];
        }
    }

    /**
     * Get default content for sections that fail to generate
     */
    private function getDefaultSectionContent(string $section): string
    {
        $locale = App::getLocale();

        if ($locale === 'ar')
        {
            $defaults = [
                'executive_summary' => '<h3>الملخص التنفيذي</h3><p>سيتم إنشاء الملخص التنفيذي قريباً. يرجى الانتظار.</p>',
                'market_analysis' => '<h3>تحليل السوق</h3><p>سيتم إنشاء تحليل السوق قريباً. يرجى الانتظار.</p>',
                'swot_analysis' => '<h3>تحليل SWOT</h3><p>سيتم إنشاء تحليل SWOT قريباً. يرجى الانتظار.</p>',
                'marketing_strategy' => '<h3>الاستراتيجية التسويقية</h3><p>سيتم إنشاء الاستراتيجية التسويقية قريباً. يرجى الانتظار.</p>',
                'financial_plan' => '<h3>الخطة المالية</h3><p>سيتم إنشاء الخطة المالية قريباً. يرجى الانتظار.</p>',
                'operational_plan' => '<h3>الخطة التشغيلية</h3><p>سيتم إنشاء الخطة التشغيلية قريباً. يرجى الانتظار.</p>'
            ];
        }
        else
        {
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
        if ($locale === 'ar')
        {
            $patterns = [
                'executive_summary' => '/(?:الملخص التنفيذي|executive_summary)(.*?)(?=تحليل السوق|market_analysis|تحليل SWOT|swot_analysis|$)/si',
                'market_analysis' => '/(?:تحليل السوق|market_analysis)(.*?)(?=تحليل SWOT|swot_analysis|الاستراتيجية التسويقية|marketing_strategy|$)/si',
                'swot_analysis' => '/(?:تحليل SWOT|swot_analysis)(.*?)(?=الاستراتيجية التسويقية|marketing_strategy|الخطة المالية|financial_plan|$)/si',
                'marketing_strategy' => '/(?:الاستراتيجية التسويقية|marketing_strategy)(.*?)(?=الخطة المالية|financial_plan|الخطة التشغيلية|operational_plan|$)/si',
                'financial_plan' => '/(?:الخطة المالية|financial_plan)(.*?)(?=الخطة التشغيلية|operational_plan|$)/si',
                'operational_plan' => '/(?:الخطة التشغيلية|operational_plan)(.*?)$/si'
            ];
        }
        else
        {
            $patterns = [
                'executive_summary' => '/(?:Executive Summary|executive_summary)(.*?)(?=Market Analysis|market_analysis|SWOT Analysis|swot_analysis|$)/si',
                'market_analysis' => '/(?:Market Analysis|market_analysis)(.*?)(?=SWOT Analysis|swot_analysis|Marketing Strategy|marketing_strategy|$)/si',
                'swot_analysis' => '/(?:SWOT Analysis|swot_analysis)(.*?)(?=Marketing Strategy|marketing_strategy|Financial Plan|financial_plan|$)/si',
                'marketing_strategy' => '/(?:Marketing Strategy|marketing_strategy)(.*?)(?=Financial Plan|financial_plan|Operational Plan|operational_plan|$)/si',
                'financial_plan' => '/(?:Financial Plan|financial_plan)(.*?)(?=Operational Plan|operational_plan|$)/si',
                'operational_plan' => '/(?:Operational Plan|operational_plan)(.*?)$/si'
            ];
        }

        foreach ($patterns as $section => $pattern)
        {
            preg_match($pattern, $text, $matches);
            if (!empty($matches[1]))
            {
                $content = trim($matches[1]);
                // Ensure content is wrapped in HTML tags
                if (!preg_match('/<[^>]+>/', $content))
                {
                    $content = '<p>' . nl2br($content) . '</p>';
                }
                $sections[$section] = $content;
            }
            else
            {
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

        if ($locale === 'ar')
        {
            return [
                'executive_summary' => '<h3>الملخص التنفيذي</h3><p>سيتم إنشاء الملخص التنفيذي قريباً. يرجى الانتظار.</p>',
                'market_analysis' => '<h3>تحليل السوق</h3><p>سيتم إنشاء تحليل السوق قريباً. يرجى الانتظار.</p>',
                'swot_analysis' => '<h3>تحليل SWOT</h3><p>سيتم إنشاء تحليل SWOT قريباً. يرجى الانتظار.</p>',
                'marketing_strategy' => '<h3>الاستراتيجية التسويقية</h3><p>سيتم إنشاء الاستراتيجية التسويقية قريباً. يرجى الانتظار.</p>',
                'financial_plan' => '<h3>الخطة المالية</h3><p>سيتم إنشاء الخطة المالية قريباً. يرجى الانتظار.</p>',
                'operational_plan' => '<h3>الخطة التشغيلية</h3><p>سيتم إنشاء الخطة التشغيلية قريباً. يرجى الانتظار.</p>'
            ];
        }
        else
        {
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
     * Generate suggestions from all answers with project context
     */
    public function generateSuggestionsFromAnswers(array $context): array
    {
        $answersText = "";
        foreach ($context['answers'] as $qa)
        {
            $answersText .= $qa['answer'] . " ";
        }

        $locale = App::getLocale();

        $projectContext = '';
        if ($context['project_name'] && $context['project_description'])
        {
            if ($locale === 'ar')
            {
                $projectContext = "
            المشروع: {$context['project_name']}
            وصف المشروع: {$context['project_description']}
            ";
            }
            else
            {
                $projectContext = "
            Project: {$context['project_name']}
            Project Description: {$context['project_description']}
            ";
            }
        }

        if ($locale === 'ar')
        {
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
        }
        else
        {
            $prompt = "
            {$projectContext}
            
            Based on the business idea and the following answers:
            Business idea: {$context['business_idea']}
            Answers: {$answersText}
            
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
            ";
        }

        try
        {
            $response = $this->callAI($prompt, 'suggestions');
            return json_decode($response, true) ?? $this->getFallbackSuggestions();
        }
        catch (\Exception $e)
        {
            Log::error('Error generating suggestions: ' . $e->getMessage());
            return $this->getFallbackSuggestions();
        }
    }

    /**
     * Get fallback suggestions
     */
    private function getFallbackSuggestions(): array
    {
        $locale = App::getLocale();

        if ($locale === 'ar')
        {
            return [
                [
                    'type' => 'business',
                    'content' => 'فكر في استراتيجيات النمو المستدامة للمشروع',
                    'priority' => 'high'
                ],
                [
                    'type' => 'marketing',
                    'content' => 'طور حملة تسويقية متكاملة للوصول إلى العملاء المستهدفين',
                    'priority' => 'high'
                ],
                [
                    'type' => 'financial',
                    'content' => 'ضع خطة مالية واضحة تتضمن التكاليف والإيرادات المتوقعة',
                    'priority' => 'medium'
                ],
                [
                    'type' => 'operational',
                    'content' => 'اعمل على تطوير العمليات الداخلية لضمان الكفاءة والجودة',
                    'priority' => 'medium'
                ],
                [
                    'type' => 'other',
                    'content' => 'قم بدراسة المنافسين وتحليل نقاط القوة والضعف في السوق',
                    'priority' => 'low'
                ]
            ];
        }
        else
        {
            return [
                [
                    'type' => 'business',
                    'content' => 'Consider sustainable growth strategies for the project',
                    'priority' => 'high'
                ],
                [
                    'type' => 'marketing',
                    'content' => 'Develop an integrated marketing campaign to reach target customers',
                    'priority' => 'high'
                ],
                [
                    'type' => 'financial',
                    'content' => 'Create a clear financial plan including expected costs and revenues',
                    'priority' => 'medium'
                ],
                [
                    'type' => 'operational',
                    'content' => 'Work on developing internal processes to ensure efficiency and quality',
                    'priority' => 'medium'
                ],
                [
                    'type' => 'other',
                    'content' => 'Study competitors and analyze market strengths and weaknesses',
                    'priority' => 'low'
                ]
            ];
        }
    }

    // Legacy methods for backward compatibility

    /**
     * Initialize the conversation for a project (legacy method)
     */
    public function initializeConversation(Project $project)
    {
        $businessIdea = $project->description ?: $project->name;

        try
        {
            $firstQuestion = $this->generateFirstQuestion(
                $businessIdea,
                $project->name,
                $project->description
            );

            return [
                'success' => true,
                'message' => $firstQuestion['question'],
                'question_data' => $firstQuestion
            ];
        }
        catch (\Exception $e)
        {
            Log::error('Error initializing conversation: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to initialize conversation: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Continue conversation (legacy method)
     */
    public function continueConversation(string $message, Plan $plan)
    {
        // This method can be used for the new conversation system
        // For now, just return a generic response
        return [
            'success' => true,
            'message' => 'Message received. Please use the new AI questioning system.'
        ];
    }

    /**
     * Generate analysis from conversation (legacy method)
     */
    public function generateAnalysis(Plan $plan)
    {
        // Check if plan has ai_analysis
        if (!empty($plan->ai_analysis))
        {
            return [
                'success' => true,
                'message' => 'Analysis already exists.',
                'analysis' => is_array($plan->ai_analysis) ? json_encode($plan->ai_analysis) : $plan->ai_analysis
            ];
        }

        return [
            'success' => false,
            'message' => 'No conversation found to generate analysis.'
        ];
    }

    /**
     * Generate PDF version of the analysis (legacy method)
     */
    public function generatePDF(Plan $plan)
    {
        if (empty($plan->ai_analysis))
        {
            return [
                'success' => false,
                'message' => 'No analysis found to generate PDF.'
            ];
        }

        // Path for the PDF file
        $pdfPath = 'plans/' . $plan->id . '/analysis.pdf';

        // Update the path in the plan
        $plan->update([
            'pdf_path' => $pdfPath
        ]);

        return [
            'success' => true,
            'message' => 'PDF generation prepared.',
            'pdfPath' => $pdfPath
        ];
    }



    /**
     * Generate first question based on business idea and complete project data
     */
    public function generateFirstQuestionWithProjectData(string $businessIdea, array $projectData): array
    {
        Log::info('Generating first question with project data', [
            'business_idea' => $businessIdea,
            'project_data' => $projectData
        ]);

        $prompts = $this->getPrompts();

        // Replace placeholders in the prompt with actual project data
        $prompt = str_replace(
            [
                '{PROJECT_NAME}',
                '{PROJECT_DESCRIPTION}',
                '{PROJECT_INDUSTRY}',
                '{PROJECT_BUSINESS_TYPE}',
                '{PROJECT_TARGET}',
                '{PROJECT_LOCATION}',
                '{PROJECT_REVENUE_MODEL}',
                '{PROJECT_MAIN_PRODUCT}',
                '{BUSINESS_IDEA}'
            ],
            [
                $projectData['project_name'] ?? 'Not specified',
                $projectData['project_description'] ?? 'Not specified',
                $projectData['project_industry'] ?? 'Not specified',
                $projectData['project_business_type'] ?? 'Not specified',
                $projectData['project_target'] ?? 'Not specified',
                $projectData['project_location'] ?? 'Not specified',
                $projectData['project_revenue_model'] ?? 'Not specified',
                $projectData['project_main_product'] ?? 'Not specified',
                $businessIdea
            ],
            $prompts['first_question_prompt']
        );

        $response = $this->callAI($prompt, 'first_question_with_project_data', $prompts['first_question_system']);

        if (empty($response))
        {
            Log::error('Empty response from AI for first question');
            return $this->getFallbackFirstQuestion();
        }

        try
        {
            $questionData = $this->parseAIResponse($response);
            if (!$questionData)
            {
                Log::warning('Could not parse AI response, using fallback');
                return $this->getFallbackFirstQuestion();
            }

            // Validate required fields
            if (!isset($questionData['question']) || empty($questionData['question']))
            {
                Log::error('Missing question field in AI response');
                return $this->getFallbackFirstQuestion();
            }

            // Set default values for optional fields
            $questionData['type'] = $questionData['type'] ?? 'text';
            $questionData['keywords'] = $questionData['keywords'] ?? [];
            $questionData['category'] = $questionData['category'] ?? 'strategy';

            Log::info('Successfully generated first question with project data', $questionData);
            return $questionData;
        }
        catch (\Exception $e)
        {
            Log::error("Error parsing first question: " . $e->getMessage());
            return $this->getFallbackFirstQuestion();
        }
    }

    /**
     * Generate next question based on previous answers and project data
     */
    public function generateNextQuestionWithProjectData(array $previousAnswers, string $businessIdea, int $questionCount = 1, array $projectData = null): ?array
    {
        // Stop if we already have 5 questions
        if ($questionCount >= 5)
        {
            Log::info('Reached maximum number of questions (5)');
            return null;
        }

        Log::info('Generating next question with project data', [
            'question_count' => $questionCount,
            'previous_answers_count' => count($previousAnswers),
            'business_idea' => $businessIdea,
            'has_project_data' => !empty($projectData)
        ]);

        $prompts = $this->getPrompts();

        $answersContext = "";
        foreach ($previousAnswers as $qa)
        {
            $locale = App::getLocale();
            if ($locale === 'ar')
            {
                $answersContext .= "السؤال: {$qa['question']}\nالإجابة: {$qa['answer']}\n\n";
            }
            else
            {
                $answersContext .= "Question: {$qa['question']}\nAnswer: {$qa['answer']}\n\n";
            }
        }

        // Replace placeholders in the prompt
        $replacements = [
            '{BUSINESS_IDEA}' => $businessIdea,
            '{ANSWERS_CONTEXT}' => $answersContext,
            '{QUESTION_COUNT}' => $questionCount
        ];

        // Add project data replacements if available
        if (!empty($projectData))
        {
            $replacements['{PROJECT_NAME}'] = $projectData['project_name'] ?? 'Not specified';
            $replacements['{PROJECT_DESCRIPTION}'] = $projectData['project_description'] ?? 'Not specified';
            $replacements['{PROJECT_INDUSTRY}'] = $projectData['project_industry'] ?? 'Not specified';
            $replacements['{PROJECT_BUSINESS_TYPE}'] = $projectData['project_business_type'] ?? 'Not specified';
            $replacements['{PROJECT_TARGET}'] = $projectData['project_target'] ?? 'Not specified';
            $replacements['{PROJECT_REVENUE_MODEL}'] = $projectData['project_revenue_model'] ?? 'Not specified';
        }

        $prompt = str_replace(
            array_keys($replacements),
            array_values($replacements),
            $prompts['next_question_prompt']
        );

        $response = $this->callAI($prompt, 'next_question_with_project_data', $prompts['first_question_system']);

        if (empty($response))
        {
            Log::error('Empty response from AI for next question');
            return $prompts['fallback_questions'][$questionCount + 1] ?? null;
        }

        try
        {
            $questionData = $this->parseAIResponse($response);
            if (!$questionData)
            {
                Log::warning('Could not parse AI response for next question, using fallback');
                return $prompts['fallback_questions'][$questionCount + 1] ?? null;
            }

            // Validate required fields
            if (!isset($questionData['question']) || empty($questionData['question']))
            {
                Log::error('Missing question field in AI response for next question');
                return $prompts['fallback_questions'][$questionCount + 1] ?? null;
            }

            // Set default values for optional fields
            $questionData['type'] = $questionData['type'] ?? 'text';
            $questionData['keywords'] = $questionData['keywords'] ?? [];
            $questionData['category'] = $questionData['category'] ?? 'strategy';

            Log::info('Successfully generated next question with project data', $questionData);
            return $questionData;
        }
        catch (\Exception $e)
        {
            Log::error("Error parsing next question: " . $e->getMessage());
            return $prompts['fallback_questions'][$questionCount + 1] ?? null;
        }
    }
}
