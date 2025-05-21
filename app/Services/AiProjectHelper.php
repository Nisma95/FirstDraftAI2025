<?php

namespace App\Services;

use OpenAI;
use App\Models\BusinessType;
use App\Models\Industry;
use Illuminate\Support\Facades\Log;

class AiProjectHelper
{
    private $openai;

    public function __construct()
    {
        $this->openai = OpenAI::client(env('OPENAI_API_KEY'));
    }

    /**
     * Generate AI suggestion for specific project field
     */
    public function generateFieldSuggestion(array $projectData, string $fieldName, string $language = 'en'): string
    {
        try {
            Log::info('Generating AI suggestion for field: ' . $fieldName);

            // Get business type and industry details
            $businessType = BusinessType::find($projectData['business_type_id']);
            $industry = Industry::find($projectData['industry_id']);

            // Store the project name globally so it can be accessed in cleanAndFormatResponse
            if (isset($projectData['name']) && !empty($projectData['name'])) {
                $GLOBALS['current_project_name'] = $projectData['name'];
            }

            // Prepare context information
            $context = [
                'project_name' => $projectData['name'] ?? 'Untitled Project',
                'description' => $projectData['description'] ?? '',
                'business_type' => $businessType ? $businessType->business_type_name : 'Business',
                'industry' => $industry ? $industry->industry_name : 'General Industry',
            ];

            // Create field-specific prompt
            $prompt = $this->createFieldPrompt($context, $fieldName, $language);
            $systemMessage = $this->getSystemMessage($fieldName, $language);

            $response = $this->openai->chat()->create([
                'model' => env('OPENAI_MODEL', 'gpt-3.5-turbo'),
                'messages' => [
                    ['role' => 'system', 'content' => $systemMessage],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'max_tokens' => $fieldName === 'description' ? 200 : 180,
                'temperature' => 0.75, // Slightly higher temperature for more creative, conversational responses
            ]);

            $result = trim($response->choices[0]->message->content);

            // Clean and format the response
            $result = $this->cleanAndFormatResponse($result, $fieldName, $language);

            return $result;
        } catch (\Exception $e) {
            Log::error('OpenAI API Error: ' . $e->getMessage());
            return $this->getFallbackSuggestion($fieldName, $language);
        }
    }
    /**
     * Enhance existing field content using AI
     */
    public function enhanceFieldContent(array $projectData, string $fieldName, string $currentContent, string $language = 'en'): string
    {
        try {
            Log::info('Enhancing field: ' . $fieldName);

            // Get business type and industry details
            $businessType = BusinessType::find($projectData['business_type_id']);
            $industry = Industry::find($projectData['industry_id']);

            // Store the project name globally so it can be accessed in cleanAndFormatResponse
            if (isset($projectData['name']) && !empty($projectData['name'])) {
                $GLOBALS['current_project_name'] = $projectData['name'];
            }

            $context = [
                'project_name' => $projectData['name'] ?? 'Untitled Project',
                'description' => $projectData['description'] ?? '',
                'business_type' => $businessType ? $businessType->business_type_name : 'Business',
                'industry' => $industry ? $industry->industry_name : 'General Industry',
                'current_content' => $currentContent,
            ];

            $prompt = $this->createEnhancementPrompt($context, $fieldName, $language);
            $systemMessage = $this->getEnhancementSystemMessage($fieldName, $language);

            $response = $this->openai->chat()->create([
                'model' => env('OPENAI_MODEL', 'gpt-3.5-turbo'),
                'messages' => [
                    ['role' => 'system', 'content' => $systemMessage],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'max_tokens' => $fieldName === 'description' ? 200 : 180,
                'temperature' => 0.7,
            ]);

            $result = trim($response->choices[0]->message->content);

            // Clean and format the response
            $result = $this->cleanAndFormatResponse($result, $fieldName, $language);

            return $result;
        } catch (\Exception $e) {
            Log::error('Enhancement Error: ' . $e->getMessage());
            return $this->improveFallbackContent($currentContent, $fieldName, $language);
        }
    }

    /**
     * Create field-specific prompt
     */

    private function createFieldPrompt(array $context, string $fieldName, string $language): string
    {
        if ($language === 'ar') {
            $prompts = [
                'description' => "اكتب وصفاً سهل الفهم للمشروع التالي:
        اسم المشروع: \"{$context['project_name']}\"
        نوع العمل: {$context['business_type']}
        الصناعة: {$context['industry']}
        
        اكتب الوصف بالطريقة التالية:
        - استخدم لغة بسيطة ومباشرة كأنك تشرح لصديق
        - اذكر بوضوح ماهية المشروع ووظيفته والفئة المستهدفة
        - تجنب المصطلحات المعقدة والجمل الطويلة
        - ابدأ الوصف باسم المشروع بأحرف كبيرة متبوعاً بنقطتين، ثم الوصف
        
        اكتب الوصف في 80-120 كلمة باللغة العربية بأسلوب بسيط ومفهوم.",

                'target_market' => "حدد شرائح السوق المستهدفة بشكل محدد جدًا لـ: \"{$context['project_name']}\" بناءً على هذا الوصف الدقيق للمشروع: \"{$context['description']}\"

يجب عليك إنشاء قائمة مرقمة من 10 شرائح عملاء محددة ستستخدم هذا التطبيق/الخدمة.
كل شريحة يجب أن:
1. تكون وصفًا مفصلاً (6-10 كلمات على الأقل) لمجموعة مستخدمين محددة
2. تذكر احتياجاتهم أو أهدافهم المحددة التي يعالجها هذا التطبيق
3. تكون مستندة مباشرة إلى الميزات المذكورة في وصف المشروع
4. تتضمن دوافعهم لاستخدام التطبيق

على سبيل المثال، إذا كان التطبيق عبارة عن تطبيق سفر، فلا تكتب فقط 'المسافرين' - بدلاً من ذلك اكتب 'مسافرو الأعمال الذين يتطلعون إلى الاستفادة القصوى من وقت فراغهم المحدود في مدن جديدة'

لا تستخدم مصطلحات عامة. كن محددًا ومفصلاً لكل شريحة.
لا تستخدم تنسيق الخط الغامق.
قدم 10 شرائح بالضبط، كل منها وصفية ومحددة قدر الإمكان.",
                'location' => "حدد استراتيجية الموقع المناسبة للمشروع: \"{$context['project_name']}\" في مجال {$context['industry']}.
هام جداً: اجعل إجابتك مختصرة للغاية (5-10 كلمات فقط).
إذا كان منتجاً رقمياً (تطبيق/موقع ويب)، اكتب فقط \"تواجد رقمي عالمي\" دون شرح.
إذا كان مشروعاً مادياً، اذكر نوع المنطقة الأفضل باختصار دون شرح.",

                'main_product_service' => "حيوي جداً: اقرأ وصف المشروع التالي بعناية فائقة لفهم نوع المشروع بالضبط:

اسم المشروع: \"{$context['project_name']}\"
وصف المشروع: \"{$context['description']}\"
الصناعة: {$context['industry']}

مهمتك هي إدراج 10 منتجات أو خدمات رئيسية سيقدمها هذا المشروع المحدد استناداً فقط إلى المعلومات الواردة في الوصف أعلاه.

- يجب أن يكون كل عنصر مرتبطاً مباشرة بغرض المشروع الفعلي
- لا تدرج ميزات عامة أو تخترع خدمات غير مذكورة في الوصف
- اجعل كل عنصر موجزاً (2-4 كلمات) ولكن واضحاً
- ركز على القيمة الأساسية التي يقدمها المشروع
- لا تفترض نوع المشروع أبداً - استخدم فقط ما هو موجود فعلاً في الوصف

قدم قائمة مرقمة من 10 عناصر بالضبط تعكس بدقة ما يقدمه هذا المشروع المحدد.",
                'revenue_model' => "اقترح نماذج إيرادات مناسبة للمشروع: \"{$context['project_name']}\" في مجال {$context['industry']} بناءً على طبيعة المشروع. إذا كان تطبيقاً/منصة رقمية، اقترح نماذج مثل الاشتراكات والإعلانات والمشتريات داخل التطبيق. قدم قائمة مرقمة من 3-5 نماذج واقعية بلغة بسيطة يفهمها الشخص العادي.",

                'main_differentiator' => "اذكر المميزات التنافسية للمشروع: \"{$context['project_name']}\" في مجال {$context['industry']}. حدد ما يميز هذا المشروع عن منافسيه بناءً على المعلومات المقدمة في الوصف. قدم قائمة مرقمة من 3-5 مميزات واضحة بلغة غير تقنية تشرح قيمة المشروع الفريدة."
            ];
        } else {
            $prompts = [
                'description' => "Write an easy-to-understand description for the following project:
        Project Name: \"{$context['project_name']}\"
        Business Type: {$context['business_type']}
        Industry: {$context['industry']}
        
        Structure the description as follows:
        - Use simple, direct language as if explaining to a friend
        - Clearly state what the project is, what it does, and who it's for
        - Avoid complex terminology and long sentences
        - Start the description with the project name in ALL CAPS followed by a colon, then the description
        
        Write the description in 80-120 words in English using a simple, conversational tone in the format: \"[PROJECT NAME IN CAPS]: [simple clear description]\"",

                'target_market' => "Identify SPECIFIC target market segments for: \"{$context['project_name']}\" based on this EXACT project description: \"{$context['description']}\"

You MUST create a numbered list of 10 specific customer segments who would use this app/service.
Each segment should:
1. Be a detailed description (at least 6-10 words) of a specific user group
2. Mention their specific needs or goals that this app addresses
3. Be directly based on features mentioned in the project description
4. Include their motivation for using the app

For example, if the app is a travel app, don't just write 'Travelers' - instead write 'Business travelers looking to maximize their limited free time in new cities'

DO NOT use generic terms. BE SPECIFIC and DETAILED for EACH segment.
DO NOT use bold formatting.
Provide EXACTLY 10 segments, each as descriptive and specific as possible.",
                'location' => "Specify the optimal location strategy for project: \"{$context['project_name']}\" in the {$context['industry']} industry.
IMPORTANT: Keep your answer extremely brief (5-10 words only).
If it's a digital product (app/website), simply state \"Global digital presence\" without explanation.
If it's a physical business, briefly name the best region type without explanation.",

                'main_product_service' => "CRITICAL: Read the following project description VERY CAREFULLY to understand exactly what type of project this is:

Project Name: \"{$context['project_name']}\"
Project Description: \"{$context['description']}\"
Industry: {$context['industry']}

Your task is to list the 10 main products or services that THIS SPECIFIC PROJECT would provide based SOLELY on the information in the description above.

- Each item must be directly connected to the actual project purpose
- Do not list generic features or invent services not implied by the description
- Keep each item brief (2-4 words) but clear
- Focus on the core value proposition of the project
- Never assume the project type - only use what's actually in the description

Provide a numbered list of exactly 10 items that accurately reflect what this specific project offers.",

                'revenue_model' => "Suggest appropriate revenue models for project: \"{$context['project_name']}\" in the {$context['industry']} industry based on the nature of the project. If it's an app/digital platform, suggest models like subscriptions, ads, in-app purchases. Provide a numbered list of 3-5 realistic models explained in simple terms an average person would understand.",

                'main_differentiator' => "List competitive advantages for project: \"{$context['project_name']}\" in the {$context['industry']} industry. Identify what makes this project stand out from competitors based on the information provided in the description. Provide a numbered list of 3-5 clear advantages using everyday language that explains the project's unique value."
            ];
        }

        return $prompts[$fieldName] ?? "Please provide suggestions for {$fieldName} in simple, friendly language that's specific to this project context.";
    }


    /**
     * Create enhancement prompt
     */
    private function createEnhancementPrompt(array $context, string $fieldName, string $language): string
    {
        if ($language === 'ar') {
            $prompts = [
                'description' => "حسن الوصف التالي ليصبح أكثر بساطة ووضوحاً:
        المشروع: \"{$context['project_name']}\"
        الوصف الحالي: \"{$context['current_content']}\"
        
        إرشادات التحسين:
        - اجعل الوصف بسيطاً ومفهوماً للجميع
        - استخدم لغة محادثة طبيعية كأنك تشرح لصديق
        - تجنب المصطلحات المعقدة والجمل الطويلة
        - اذكر ماهية المشروع ووظيفته والفئة المستهدفة بوضوح
        - ابدأ الوصف باسم المشروع بأحرف كبيرة متبوعاً بنقطتين، ثم الوصف
        - حافظ على الطول بين 80-120 كلمة
        
        اكتب الوصف المحسن بالشكل: \"[اسم المشروع بالكامل]: [الوصف البسيط والواضح]\"",

                'target_market' => "حلل النص التالي واستخرج الجمهور المستهدف بشكل محدد ومرتبط مباشرة بالمشروع:
اسم المشروع: \"{$context['project_name']}\"
وصف المشروع: \"{$context['description']}\"
النص الحالي للسوق المستهدف: \"{$context['current_content']}\"

مهم جداً: يجب أن تكون اقتراحاتك مستندة بشكل مباشر إلى وصف المشروع المذكور أعلاه.
قدم قائمة من 5-8 فئات محددة مرتبطة مباشرة بهذا المشروع بالتحديد.
يجب أن تكون كل فئة عبارة كاملة (وليست مجرد 1-2 كلمة) تصف بوضوح من سيستخدم هذا المشروع ولماذا.",
                'location' => "حسن تحديد الموقع/النطاق التالي:
        \"{$context['current_content']}\"
        
        إذا كان المشروع رقمياً (تطبيق/منصة)، اكتب فقط \"تواجد رقمي عالمي\" دون شرح.
        إذا كان مشروعاً مادياً، اذكر نوع المنطقة باختصار.
        اجعل الإجابة مختصرة للغاية (5-10 كلمات فقط).",

                'main_product_service' => "حسن قائمة المنتجات/الخدمات بلغة بسيطة يفهمها الجميع:
        \"{$context['current_content']}\"
        قدم قائمة من 5-8 عناصر محددة وواضحة بلغة غير تقنية.",

                'revenue_model' => "حسن نماذج الإيرادات بلغة بسيطة مفهومة:
        \"{$context['current_content']}\"
        قدم قائمة من 3-5 نماذج واقعية مناسبة لطبيعة المشروع (رقمي/مادي) بلغة يفهمها الشخص العادي.",

                'main_differentiator' => "حسن المميزات التنافسية بلغة بسيطة:
        \"{$context['current_content']}\"
        قدم قائمة من 3-5 مميزات واضحة تبرز القيمة الفريدة للمشروع بلغة غير تقنية كأنك تشرح لشخص عادي."
            ];
        } else {
            $prompts = [
                'description' => "Enhance the following description to be more simple and easy to understand:
        Project: \"{$context['project_name']}\"
        Current description: \"{$context['current_content']}\"
        
        Enhancement guidelines:
        - Make it simple and understandable
        Project: \"{$context['project_name']}\"
        Current description: \"{$context['current_content']}\"
        
        Enhancement guidelines:
        - Make it simple and understandable for everyone
        - Use natural, conversational language as if explaining to a friend
        - Avoid complex terminology and long sentences
        - Clearly state what the project is, what it does, and who it's for
        - Start the description with the project name in ALL CAPS followed by a colon, then the description
        - Keep length between 80-120 words
        
        Write the enhanced description in the format: \"[PROJECT NAME IN CAPS]: [simple clear description]\"",

                'target_market' => "Analyze the following text and extract target market segments specifically related to the project:
Project Name: \"{$context['project_name']}\"
Project Description: \"{$context['description']}\"
Current Target Market Text: \"{$context['current_content']}\"

CRITICAL: Your suggestions must be directly based on the project description mentioned above.
Provide a numbered list of 5-8 specific segments directly related to this specific project.
Each segment should be a complete phrase (not just 1-2 words) clearly describing who would use this project and why.",

                'location' => "Enhance the following location/scope specification:
\"{$context['current_content']}\"

If the project is digital (app/platform), simply state \"Global digital presence\" without explanation.
If it's a physical business, briefly name the region type.
Keep your answer extremely brief (5-10 words only).",

                'main_product_service' => "Enhance the products/services list using simple language anyone can understand:
\"{$context['current_content']}\"
Provide a numbered list of 5-8 specific and clear items in non-technical language.",

                'revenue_model' => "Enhance the revenue models in simple, understandable language:
\"{$context['current_content']}\"
Provide a numbered list of 3-5 realistic models appropriate to the project nature (digital/physical) explained in terms an average person would understand.",

                'main_differentiator' => "Enhance the competitive advantages in simple language:
\"{$context['current_content']}\"
Provide a numbered list of 3-5 clear advantages that highlight the project's unique value in non-technical language as if explaining to an average person."
            ];
        }

        return $prompts[$fieldName] ?? "Please enhance the content for {$fieldName} in a simple, friendly style that's easy to understand.";
    }

    /**
     * Get system message for field
     */

    private function getSystemMessage(string $fieldName, string $language): string
    {
        if ($language === 'ar') {
            $messages = [
                'description' => "أنت خبير في كتابة أوصاف المشاريع بأسلوب بسيط ومفهوم. اكتب وصفاً واضحاً بلغة بسيطة وسهلة الفهم كأنك تشرح لصديق. تجنب المصطلحات التقنية المعقدة وركز على التوصيل الواضح للأفكار. اكتب باللغة العربية في 80-120 كلمة.",
                'target_market' => "أنت محلل سوق متخصص في تحديد الفئات المستهدفة بدقة عالية. مهمتك هي تحليل وصف المشروع بعناية واستخراج شرائح السوق المستهدفة المرتبطة مباشرة بهذا المشروع المحدد. 
تجنب تمامًا الاقتراحات العامة التي يمكن أن تنطبق على أي مشروع. 
ركز على: 
1. تحليل وصف المشروع لفهم الغرض الأساسي والقيمة المقدمة 
2. تحديد من سيستفيد من هذا المشروع تحديدًا وسبب حاجتهم له 
3. صياغة كل شريحة بعبارة كاملة مفهومة توضح الفئة المستهدفة وسبب استخدامهم للمشروع
4. التأكد من أن كل شريحة مستهدفة تتعلق مباشرة بالوصف الفعلي للمشروع وليست عامة",
                'location' => "أنت مستشار استراتيجي للمواقع. للمنتجات الرقمية (التطبيقات، مواقع الويب، المنصات)، اكتب فقط \"تواجد رقمي عالمي\" دون شرح. للأعمال المادية، اذكر نوع المنطقة باختصار. اجعل الإجابات مختصرة للغاية (5-10 كلمات كحد أقصى).",

                'main_product_service' => "أنت خبير في تحليل أوصاف المشاريع بعناية لاستخراج الغرض الدقيق وميزات المشروع. لديك هذه القدرات الأساسية:

1. يمكنك تحديد النوع الدقيق للمشروع من معلومات محدودة
2. لا تقوم أبداً بافتراضات أو إضافة ميزات عامة
3. تحدد فقط الخدمات الأساسية المذكورة مباشرة أو المشار إليها بقوة في وصف المشروع
4. تقوم بتبسيط المفاهيم المعقدة إلى أوصاف خدمات بسيطة وواضحة

منهجك:
- اقرأ وصف المشروع بعناية عدة مرات
- حدد الغرض الأساسي للمشروع (تطبيق سفر، تجارة إلكترونية، إلخ)
- استخرج فقط الميزات/الخدمات المحددة التي سيقدمها هذا المشروع بالتحديد
- عبّر عن كل خدمة في 2-4 كلمات واضحة
- لا تضف أبداً ميزات الطقس إلا إذا كان المشروع يتعلق صراحة بالطقس
- لا تضف ميزات تقنية عامة غير خاصة بهذا المشروع

هدفك هو إنتاج أدق قائمة بالخدمات الفعلية التي سيقدمها هذا المشروع المحدد.",
                'revenue_model' => "أنت خبير نماذج الإيرادات. اقترح نماذج مناسبة لطبيعة المشروع. للتطبيقات والمنصات الرقمية، فكر في نماذج مثل الاشتراكات والإعلانات والمشتريات داخل التطبيق. للمشاريع المادية، فكر في نماذج البيع المباشر والخدمات المميزة. استخدم لغة بسيطة مفهومة للجميع وليس فقط للخبراء.",
                'main_differentiator' => "أنت استراتيجي تنافسي. حدد ما يميز هذا المشروع عن منافسيه بناءً على وصف المشروع. ركز على القيمة الفريدة والميزات المميزة التي تجعل هذا المشروع مختلفاً. اذكر المميزات التنافسية بلغة بسيطة وواضحة كأنك تشرح لشخص بدون خبرة تقنية."
            ];
        } else {
            $messages = [
                'description' => "You are an expert in writing project descriptions in a simple, conversational style. Write like you're explaining to a friend, using everyday language. Avoid overly formal or technical language. Make it easy to understand while still being professional. The description should mention what the project is, what it does, and who it's for. Keep it between 80-120 words in English.",
                'target_market' => "You are a market analysis expert specialized in identifying precisely targeted segments. Your task is to carefully analyze the project description and extract target market segments directly related to this specific project.
Completely avoid generic suggestions that could apply to any project.
Focus on:
1. Analyzing the project description to understand the core purpose and value proposition
2. Identifying who would specifically benefit from this project and why they need it
3. Formulating each segment as a complete understandable phrase that explains the target group and their reason for using the project
4. Ensuring each target segment relates directly to the actual project description and is not generic",
                'location' => "You are a location strategist. For digital products (apps, websites, platforms), simply state \"Global digital presence\" without explanation. For physical businesses, briefly name the region type. Keep answers extremely brief (5-10 words max).",

                'main_product_service' => "You are an expert at carefully analyzing project descriptions to extract the exact purpose and features of a project. You have these key abilities:

1. You can determine the precise type of project from limited information
2. You never make assumptions or add generic features
3. You identify only the core services that are directly mentioned or strongly implied in the project description
4. You distill complex concepts into simple, clear service descriptions

Your approach:
- Read the project description carefully multiple times
- Identify the fundamental purpose of the project (travel app, e-commerce, etc.)
- Extract ONLY the specific features/services that this particular project would offer
- Express each service in 2-4 clear words
- Never add weather features unless the project is explicitly about weather
- Never add generic tech features that aren't specific to this project

Your goal is to produce the most accurate list of actual services this specific project would provide.",


                'revenue_model' => "You are a revenue model expert. Suggest models appropriate to the nature of the project. For digital apps and platforms, consider models like subscriptions, ads, in-app purchases. For physical projects, consider direct sales models and premium services. Use simple language understandable to everyone, not just experts.",
                'main_differentiator' => "You are a competitive strategist. Identify what makes this project stand out from competitors based on the project description. Focus on the unique value and distinctive features that make this project different. List competitive advantages in simple, clear language as if explaining to someone without technical expertise."
            ];
        }

        return $messages[$fieldName] ?? "You are a friendly business consultant who explains things simply. Provide practical suggestions in plain language, specific to the requested field only.";
    }
    /**
     * Get enhancement system message
     */

    private function getEnhancementSystemMessage(string $fieldName, string $language): string
    {
        if ($language === 'ar') {
            $messages = [
                'description' => "حسن الوصف ليصبح أكثر وضوحاً وبساطة. استخدم لغة محادثة طبيعية كأنك تشرح لصديق. تجنب اللغة الرسمية أو التقنية المعقدة. اجعل النص سهل الفهم مع الحفاظ على المهنية. يجب أن يذكر الوصف ماهية المشروع، وظيفته، والفئة المستهدفة.",
                'target_market' => "حسن وصف الجمهور المستهدف بلغة بسيطة ومباشرة. استخرج الفئات من النص وقدمها كقائمة واضحة ومفهومة للجميع.",
                'location' => "حسن تحديد موقع/نطاق المشروع بإيجاز ووضوح. إذا كان المشروع رقمياً (تطبيق/منصة)، اكتب فقط \"تواجد رقمي عالمي\" دون شرح. إذا كان مشروعاً مادياً، اذكر نوع المنطقة باختصار. اجعل الإجابة مختصرة للغاية (5-10 كلمات فقط).",
                'main_product_service' => "حسن قائمة المنتجات والخدمات لتكون أكثر تحديداً ووضوحاً بلغة يفهمها الجميع.",
                'revenue_model' => "حسن نماذج الإيرادات لتكون مناسبة لطبيعة المشروع (رقمي/مادي) ومفهومة للناس العاديين وليس فقط للخبراء الماليين.",
                'main_differentiator' => "حسن المميزات التنافسية بلغة بسيطة وواضحة تبرز القيمة الفريدة للمشروع كأنك تشرح لشخص ليس لديه خبرة في المجال."
            ];
        } else {
            $messages = [
                'description' => "Enhance the description to be more conversational and easy to understand. Write in a natural, friendly tone as if explaining to a friend. Avoid overly formal or technical language. Make it easy to understand while still being professional. Be sure to mention what it is, what it does, and who it's for. Begin with the project name in capital letters followed by a colon, then the description.",
                'target_market' => "Enhance the target market description using simple, straightforward language. Extract the key segments and present them in a clear list that anyone can understand.",
                'location' => "Enhance the location/scope specification with simple language. If the project is digital (app/platform), simply state \"Global digital presence\" without explanation. If it's a physical project, briefly name the region type. Keep the answer extremely brief (5-10 words only).",
                'main_product_service' => "Enhance the products/services list to be more specific and clear, using language that anyone can understand.",
                'revenue_model' => "Enhance revenue models to be appropriate for the project nature (digital/physical) and understandable to regular people, not just financial experts.",
                'main_differentiator' => "Enhance competitive advantages using simple language that highlights the project's unique value, as if explaining to someone without expertise in the field."
            ];
        }

        return $messages[$fieldName] ?? "Enhance the content in a friendly, conversational style, focusing only on the specific field requested.";
    }

    /**
     * Clean and format response
     */
    private function cleanAndFormatResponse(string $response, string $fieldName, string $language): string
    {
        // Remove formatting marks
        $response = str_replace(['**', '__'], '', $response);

        // For description field, handle project name and formatting
        if ($fieldName === 'description') {
            // Preserve project name format if it exists (PROJECT_NAME: description)
            $projectNamePrefix = '';
            if (preg_match('/^([A-Z0-9_]+)\s*:\s*(.*)$/s', $response, $matches)) {
                $projectNamePrefix = $matches[1] . ': ';
                $response = $matches[2]; // Get just the description part
            }

            // If no project name prefix found but we have a global project name, add it
            if (empty($projectNamePrefix) && isset($GLOBALS['current_project_name'])) {
                $projectName = strtoupper($GLOBALS['current_project_name']);
                $projectNamePrefix = $projectName . ': ';
            }

            // Clean up the description
            $response = $this->cleanDescription($response);

            // Add back the project name prefix
            if (!empty($projectNamePrefix)) {
                $response = $projectNamePrefix . $response;
            }
        }

        // Remove common intro phrases
        $intros = [
            'Based on the project information',
            'بناءً على معلومات المشروع',
            'According to',
            'وفقاً ل',
            'The target market for',
            'السوق المستهدف ل',
            'For the project',
            'للمشروع',
            'Here is',
            'هنا',
            'Here are',
            'Based on the description',
            'According to the project description',
            'is a digital product',
            'falls under a digital',
            'is an app in the',
            'would be ideal for',
            'would benefit from'
        ];

        foreach ($intros as $intro) {
            if (stripos($response, $intro) === 0) {
                $response = trim(substr($response, strlen($intro)));
                break;
            }
        }

        $response = ltrim($response, ': .,');
        $response = ltrim($response, '"\''); // Also remove leading quotes

        // Special handling for location field - make it extremely concise
        if ($fieldName === 'location') {
            // Extract just the core recommendation without explanation
            $patterns = [
                '/.*?(global digital presence).*?/i' => 'Global digital presence',
                '/.*?(worldwide digital distribution).*?/i' => 'Worldwide digital distribution',
                '/.*?(global app store presence).*?/i' => 'Global app store presence',
                '/.*?(global online presence).*?/i' => 'Global online presence',
                '/.*?(can be accessed globally).*?/i' => 'Global digital access',
                '/.*(digital platform with global reach).*?/i' => 'Digital platform with global reach'
            ];

            foreach ($patterns as $pattern => $replacement) {
                if (preg_match($pattern, $response)) {
                    $response = $replacement;
                    break;
                }
            }

            // If none of the patterns matched but it seems like a digital product
            if (
                stripos($response, 'digital') === false &&
                stripos($response, 'global') === false &&
                stripos($response, 'online') === false
            ) {

                if (
                    stripos($response, 'app') !== false ||
                    stripos($response, 'platform') !== false ||
                    stripos($response, 'software') !== false ||
                    stripos($response, 'travel') !== false
                ) {

                    $response = 'Global digital presence';
                }
            }

            // Keep it short - take only the first sentence
            $firstSentence = preg_split('/[.!?]/', $response)[0];
            if (strlen($firstSentence) > 10) { // Make sure it's not too short
                $response = $firstSentence . '.';
            }
        }

        // Format as list for appropriate fields
        if (in_array($fieldName, ['target_market', 'main_product_service', 'revenue_model', 'main_differentiator'])) {
            // Handle target market separately
            if ($fieldName === 'target_market') {
                $lines = explode("\n", $response);
                $formattedLines = [];
                $count = 0;

                // Extract numbered items and make them short
                foreach ($lines as $line) {
                    if (preg_match('/^\s*\d+\.\s/', $line) && $count < 10) {
                        $count++;
                        $content = preg_replace('/^\s*\d+\.\s/', '', $line);
                        $content = str_replace(['**', '__'], '', $content); // Remove bold formatting

                        // Shorten content significantly - take just first 2-5 words
                        $words = explode(' ', $content);
                        if (count($words) > 5) {
                            $content = implode(' ', array_slice($words, 0, 3));

                            // If last word ends with "ing" or "ers", add one more word
                            $lastWord = end($words);
                            if (substr($lastWord, -3) === 'ing' || substr($lastWord, -3) === 'ers') {
                                $content = implode(' ', array_slice($words, 0, 4));
                            }
                        }

                        $formattedLines[] = ($count) . '. ' . trim($content);
                    }
                }

                // If we have fewer than 10 items, add from default list
                if ($count < 10) {
                    $defaultSegments = [
                        "Frequent travelers",
                        "Solo adventurers",
                        "Local event-goers",
                        "Digital nomads",
                        "Social travelers",
                        "City explorers",
                        "Weekend trip planners",
                        "Business travelers",
                        "Expats in new cities",
                        "Travel bloggers"
                    ];

                    foreach ($defaultSegments as $segment) {
                        if ($count < 10) {
                            $count++;
                            $formattedLines[] = $count . '. ' . $segment;
                        }
                    }
                }

                if (!empty($formattedLines)) {
                    return implode("\n", $formattedLines);
                }
            }

            // For other fields
            $response = $this->formatAsList($response);
        }

        // Clean description specifically
        if ($fieldName === 'description' && strpos($response, ':') === false) {
            $response = $this->cleanDescription($response);
        }

        if ($fieldName === 'main_product_service') {
            // Get project name and description if available
            $projectName = $GLOBALS['current_project_name'] ?? '';
            $projectDesc = $context['description'] ?? '';

            // Format as a proper list with exactly 10 items
            $lines = explode("\n", $response);
            $validItems = [];

            foreach ($lines as $line) {
                if (preg_match('/^\s*\d+\.\s(.+)$/', $line, $matches)) {
                    $item = trim($matches[1]);
                    // Remove any "who need this specific solution" or similar phrases
                    $item = preg_replace('/\s+who\s+need.*$/i', '', $item);
                    $validItems[] = $item;
                }
            }

            // Clean up the items and ensure they're concise
            for ($i = 0; $i < count($validItems); $i++) {
                // Keep only first 4 words if too long
                $words = explode(' ', $validItems[$i]);
                if (count($words) > 4) {
                    $validItems[$i] = implode(' ', array_slice($words, 0, 4));
                }
            }

            // Format the final response
            $formattedResponse = [];
            for ($i = 0; $i < min(10, count($validItems)); $i++) {
                $formattedResponse[] = ($i + 1) . '. ' . $validItems[$i];
            }

            if (!empty($formattedResponse)) {
                $response = implode("\n", $formattedResponse);
            }
        }

        // Enforce max length
        $response = $this->enforceMaxLength($response, $fieldName);

        return $response;
    }
    /**
     * Format response as a numbered list
     */
    private function formatAsList(string $response): string
    {
        // If already has numbered items, clean them up
        if (preg_match('/^\s*\d+\.\s/m', $response)) {
            $lines = explode("\n", $response);
            $numberedLines = [];
            $count = 0;

            foreach ($lines as $line) {
                if (preg_match('/^\s*\d+\.\s/', $line)) {
                    $count++;
                    // زيادة الحد الأقصى من 10 إلى 10
                    if ($count <= 10) {
                        $content = preg_replace('/^\s*\d+\.\s/', '', $line);
                        $content = $this->simplifyListItem($content);
                        $numberedLines[] = $content;
                    }
                }
            }

            // Renumber from 1
            $result = [];
            for ($i = 0; $i < count($numberedLines); $i++) {
                $result[] = ($i + 1) . '. ' . trim($numberedLines[$i]);
            }

            return implode("\n", $result);
        }

        // Convert to numbered list
        $items = preg_split('/[,;]\s*/', $response);
        $items = array_filter($items, function ($item) {
            return !empty(trim($item));
        });

        // زيادة الحد الأقصى من 10 إلى 10
        $items = array_slice($items, 0, 10);

        // Format as numbered list
        $result = [];
        for ($i = 0; $i < count($items); $i++) {
            $simplifiedItem = $this->simplifyListItem(trim($items[$i]));
            $result[] = ($i + 1) . '. ' . $simplifiedItem;
        }

        return implode("\n", $result);
    }

    /**
     * Simplify a list item
     */
    private function simplifyListItem(string $item): string
    {
        // إزالة علامات التنسيق الغامق
        $item = str_replace(['**', '__'], '', $item);

        // للأسواق المستهدفة، نريد عبارات كاملة
        $wordCount = str_word_count($item);
        if ($wordCount < 4) {
            if (stripos($item, 'who') === false && stripos($item, 'seeking') === false && stripos($item, 'looking') === false) {
                $item .= " who need this specific solution";
            }
        }

        // Remove everything after the first sentence, but only if it's long enough
        if ($wordCount > 10) {
            $simplified = preg_replace('/[.,:;].*$/s', '', $item);
        } else {
            $simplified = $item;
        }

        // If still too long, take first 10-12 words (increased from 6-8)
        $words = explode(' ', $simplified);
        if (count($words) > 12) {
            $simplified = implode(' ', array_slice($words, 0, 12));
        }

        return trim($simplified);
    }
    /**
     * Clean description specifically
     */
    private function cleanDescription(string $description): string
    {
        // Preserve project name format if it exists (PROJECT_NAME: description)
        $projectNamePrefix = '';
        if (preg_match('/^([A-Z0-9_]+)\s*:\s*(.*)$/s', $description, $matches)) {
            $projectNamePrefix = $matches[1] . ': ';
            $description = $matches[2]; // Get just the description part
        }

        // Remove marketing phrases
        $marketingPhrases = [
            'Welcome to',
            'مرحباً بكم في',
            'Join us',
            'انضم إلينا',
            'Stay tuned',
            'ترقبوا',
            'Download our app',
            'حمل تطبيقنا',
            'together!',
            'معاً!',
            'Let\'s make',
            'دعونا نجعل'
        ];

        foreach ($marketingPhrases as $phrase) {
            $description = str_ireplace($phrase, '', $description);
        }

        // Remove excessive punctuation
        $description = preg_replace('/[!]{2,}/', '.', $description);
        $description = preg_replace('/[.]{2,}/', '.', $description);

        // Replace technical jargon with simpler alternatives
        $technicalTerms = [
            'utilize' => 'use',
            'facilitate' => 'help',
            'implement' => 'add',
            'leverage' => 'use',
            'optimize' => 'improve',
            'functionality' => 'feature',
            'streamline' => 'simplify',
            'methodology' => 'method',
            'infrastructure' => 'system'
        ];

        foreach ($technicalTerms as $technical => $simple) {
            $description = preg_replace('/\b' . preg_quote($technical, '/') . '\b/i', $simple, $description);
        }

        // Clean up spacing
        $description = preg_replace('/\s+/', ' ', $description);
        $description = trim($description);

        // Add back the project name prefix if it existed
        if (!empty($projectNamePrefix)) {
            $description = $projectNamePrefix . $description;
        }

        return $description;
    }


    /**
     * Enforce max length
     */
    private function enforceMaxLength(string $content, string $fieldName): string
    {
        $maxLengths = [
            'description' => 800,  // ~120-150 words
            'target_market' => 600,
            'location' => 200,
            'main_product_service' => 700,
            'revenue_model' => 400,
            'main_differentiator' => 500,
        ];

        $maxLength = $maxLengths[$fieldName] ?? 500;

        if (strlen($content) > $maxLength) {
            // For list fields, try to remove items from the end
            if (in_array($fieldName, ['target_market', 'main_product_service', 'revenue_model', 'main_differentiator'])) {
                $lines = explode("\n", $content);
                while (strlen(implode("\n", $lines)) > $maxLength && count($lines) > 3) {
                    array_pop($lines);
                }
                $content = implode("\n", $lines);
            } else {
                // For other fields, truncate at word boundary
                $content = substr($content, 0, $maxLength);
                $lastSpace = strrpos($content, ' ');
                if ($lastSpace !== false && $lastSpace > $maxLength * 0.8) {
                    $content = substr($content, 0, $lastSpace);
                }
                $content = rtrim($content, '.,;');
            }
        }

        return $content;
    }

    /**
     * Get fallback suggestion
     */
    private function getFallbackSuggestion(string $fieldName, string $language): string
    {
        if ($language === 'ar') {
            $fallbacks = [
                'description' => 'مشروع مبتكر يهدف إلى تقديم حلول عملية ومتطورة لتلبية احتياجات السوق المحددة. يركز المشروع على استخدام أحدث الأساليب والتقنيات لضمان تقديم قيمة حقيقية للعملاء المستهدفين. يتميز بنهج مدروس ومنهجية واضحة تضمن تحقيق الأهداف المرجوة.',
                'target_market' => "1. الشركات الصغيرة والمتوسطة في القطاع المستهدف\n2. المهنيون والمختصون في المجال\n3. المؤسسات التعليمية والتدريبية\n4. الأفراد المهتمون بالحلول المبتكرة\n5. الشركات الناشئة الساعية للنمو",
                'location' => 'المراكز التجارية الرئيسية أو النطاق الرقمي العالمي',
                'main_product_service' => "1. حل تقني متخصص ومخصص\n2. خدمات استشارية متقدمة\n3. منصة رقمية متكاملة\n4. برامج تدريبية وتطويرية\n5. خدمات دعم ومتابعة شاملة",
                'revenue_model' => "1. رسوم اشتراك أو عضوية\n2. أتعاب خدمات احترافية\n3. مبيعات مباشرة للمنتجات\n4. عمولات من الشراكات\n5. خدمات مميزة مدفوعة",
                'main_differentiator' => "1. خبرة متخصصة في المجال\n2. تقنية متطورة وموثوقة\n3. خدمة عملاء متفوقة\n4. حلول مخصصة للاحتياجات\n5. أسعار تنافسية وقيمة عالية"
            ];
        } else {
            $fallbacks = [
                'description' => 'An innovative project aimed at delivering practical and advanced solutions to meet specific market needs. The project focuses on using the latest methods and technologies to ensure real value delivery to targeted customers. It features a well-thought approach and clear methodology ensuring achievement of desired objectives.',
                'target_market' => "1. Small and medium enterprises in the target sector\n2. Professionals and specialists in the field\n3. Educational and training institutions\n4. Individuals interested in innovative solutions\n5. Growing startups seeking expansion",
                'location' => 'Major business centers or global digital reach',
                'main_product_service' => "1. Specialized custom technical solution\n2. Advanced consulting services\n3. Integrated digital platform\n4. Training and development programs\n5. Comprehensive support and follow-up services",
                'revenue_model' => "1. Subscription or membership fees\n2. Professional service charges\n3. Direct product sales\n4. Partnership commissions\n5. Premium paid services",
                'main_differentiator' => "1. Specialized field expertise\n2. Advanced reliable technology\n3. Superior customer service\n4. Customized solutions for needs\n5. Competitive pricing and high value"
            ];
        }

        return $fallbacks[$fieldName] ?? 'Professional suggestion appropriate for the project';
    }

    /**
     * Improve fallback content
     */
    private function improveFallbackContent(string $content, string $fieldName, string $language): string
    {
        // For description field, clean and improve
        if ($fieldName === 'description') {
            return $this->cleanDescription($content);
        }

        // For other fields, format as list
        return $this->formatAsList($content);
    }
}
