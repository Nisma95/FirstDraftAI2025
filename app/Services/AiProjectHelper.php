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
        try
        {
            Log::info('Generating AI suggestion for field: ' . $fieldName);

            // Get business type and industry details
            $businessType = BusinessType::find($projectData['business_type_id']);
            $industry = Industry::find($projectData['industry_id']);

            // Store the project name globally so it can be accessed in cleanAndFormatResponse
            if (isset($projectData['name']) && !empty($projectData['name']))
            {
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
                'max_tokens' => $fieldName === 'description' ? 200 : ($fieldName === 'revenue_model' ? 80 : ($fieldName === 'main_product_service' ? 250 : ($fieldName === 'target_market' ? 120 : 180))),
                'temperature' => 0.75, // Slightly higher temperature for more creative, conversational responses
            ]);

            $result = trim($response->choices[0]->message->content);

            // Clean and format the response
            $result = $this->cleanAndFormatResponse($result, $fieldName, $language);

            return $result;
        }
        catch (\Exception $e)
        {
            Log::error('OpenAI API Error: ' . $e->getMessage());
            return $this->getFallbackSuggestion($fieldName, $language);
        }
    }
    /**
     * Enhance existing field content using AI
     */
    public function enhanceFieldContent(array $projectData, string $fieldName, string $currentContent, string $language = 'en'): string
    {
        try
        {
            Log::info('Enhancing field: ' . $fieldName);

            // Get business type and industry details
            $businessType = BusinessType::find($projectData['business_type_id']);
            $industry = Industry::find($projectData['industry_id']);

            // Store the project name globally so it can be accessed in cleanAndFormatResponse
            if (isset($projectData['name']) && !empty($projectData['name']))
            {
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
                'max_tokens' => $fieldName === 'description' ? 200 : ($fieldName === 'revenue_model' ? 80 : ($fieldName === 'main_product_service' ? 250 : ($fieldName === 'target_market' ? 120 : 180))),
                'temperature' => 0.7,
            ]);

            $result = trim($response->choices[0]->message->content);

            // Clean and format the response
            $result = $this->cleanAndFormatResponse($result, $fieldName, $language);

            return $result;
        }
        catch (\Exception $e)
        {
            Log::error('Enhancement Error: ' . $e->getMessage());
            return $this->improveFallbackContent($currentContent, $fieldName, $language);
        }
    }

    /**
     * Create field-specific prompt
     */

    private function createFieldPrompt(array $context, string $fieldName, string $language): string
    {
        if ($language === 'ar')
        {
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

                'target_market' => "اذكر 3-5 مجموعات عملاء محددة لـ \"{$context['project_name']}\":

                    الوصف: \"{$context['description']}\"
                    
                    المتطلبات:
                    - كل مجموعة: 6-8 كلمات كحد أقصى
                    - كن محدداً لهذا المشروع
                    - المجموع أقل من 200 حرف
                    - ركز على من سيستخدم هذا فعلاً
                    
                    مجموعات العملاء:",

                'location' => "حلل هذا المشروع المحدد وحدد استراتيجية الموقع المثلى:

                          اسم المشروع: \"{$context['project_name']}\"
                          وصف المشروع: \"{$context['description']}\"
                          نوع العمل: {$context['business_type']}
                          الصناعة: {$context['industry']}

                            تحليل مطلوب بعناية:
                            1. اقرأ وصف المشروع بعناية لفهم ما إذا كان هذا:
                               - منتج رقمي (تطبيق، موقع ويب، منصة إلكترونية، برنامج) = أجب \"تواجد رقمي عالمي\"
                               - عمل مادي (مطعم، متجر، عيادة، مكتب) = حدد نوع الموقع المطلوب
                               - عمل خدمي = حدد أين ستُقدم الخدمات

                            2. أسس إجابتك فقط على ما هو المشروع فعلاً، وليس نصائح عامة.

                            3. إذا كان مشروعاً رقمياً بوضوح (تطبيق، منصة، خدمة إلكترونية)، أجب بالضبط: \"تواجد رقمي عالمي\"

                            4. إذا كان عملاً مادياً، كن محدداً حول نوع الموقع (مثل: \"مجمع تجاري\"، \"حي سكني\"، \"منطقة أعمال\")

                            5. اجعل الإجابة مختصرة للغاية (5 كلمات كحد أقصى).

                            حلل وصف المشروع أعلاه وقدم استراتيجية الموقع المناسبة:",

                'main_product_service' => "اذكر 10 عناصر قائمة طعام محددة وكاملة أو خدمات لـ {$context['project_name']}:

                            المشروع: {$context['project_name']}
                            الوصف: {$context['description']}
                            الصناعة: {$context['industry']}

                            المتطلبات:
                            - كل عنصر يجب أن يكون اسماً كاملاً (4-8 كلمات)
                            - فكر كعناصر قائمة طعام حقيقية يطلبها العملاء
                            - كن محدداً وكاملاً، وليس مقطوعاً
                            - بصيغة قائمة مرقمة

                            أمثلة:
                            1. سلطة الدجاج المشوي بالجبن
                            2. وعاء الكينوا المتوسطي الخاص
                            3. وعاء العصير بالتوت الطازج
                            4. سلمون تيرياكي مع الأرز المطبوخ
                            5. لفافة الخضار مع دهن الحمص

                            قدم 10 عناصر قائمة كاملة:",

                'revenue_model' => "ماذا يبيع \"{$context['project_name']}\" فعلاً لكسب المال؟

                    الوصف: \"{$context['description']}\"
                    
                    اذكر مصادر الإيرادات الرئيسية (1-5 عناصر):
                    - إذا كان مشروع طعام = الوجبات اليومية، الباقات الأسبوعية، إلخ
                    - إذا كان تطبيق = الاشتراكات، الإعلانات، إلخ
                    - إذا كان خدمة = رسوم الخدمة، الاستشارات، إلخ
                    
                    القواعد:
                    - 2-3 كلمات لكل عنصر
                    - اذكر مصادر إيرادات فعلية، وليس أوصاف
                    - ركز على ما يدفع العملاء مقابله فعلاً
                    
                    مصادر الإيرادات:",

                'main_differentiator' => "اذكر ما يميز {$context['project_name']} عن المنافسين في صناعة {$context['industry']}.

                            المشروع: {$context['project_name']}
                            الوصف: {$context['description']}
                            الصناعة: {$context['industry']}

                            المتطلبات:
                            - كل ميزة يجب أن تكون قصيرة (3-5 كلمات كحد أقصى)
                            - ركز على ما يجعل هذا المشروع فريداً
                            - بدون شروحات أو أوصاف طويلة
                            - فقط اذكر المزايا الأساسية

                            أمثلة للمطعم: خيارات قائمة مميزة، خدمة توصيل على مدار الساعة، عروض طبخ مباشرة، مكونات فاخرة فقط، تقنية طاولات تفاعلية

                            قدم 5 مزايا تنافسية قصيرة:",


            ];
        }
        else
        {
            $prompts = [
                'description' => "Write an easy-to-understand description for the following project:
                                Project Name: \"{$context['project_name']}\"
                                Business Type: {$context['business_type']}
                                Industry: {$context['industry']}
                                
                                Structure the description as follows:
                                - Write like a business description, not casual conversation
                                - Use professional but accessible language
                                - Clearly state what the project is, what it does, and who it's for
                                - Avoid complex terminology and long sentences
                                - Start the description with the project name
                                Write the description in 80-120 words in English using a simple, conversational tone in the format",

                'target_market' => "List 3-5 specific customer groups for \"{$context['project_name']}\":

                    Description: \"{$context['description']}\"
                    
                    Requirements:
                    - Each group: 6-8 words maximum
                    - Be specific to THIS project
                    - Total under 200 characters
                    - Focus on who would actually use this
                    
                    Customer groups:",

                'location' => "Analyze this specific project and determine the optimal location strategy:

                                    Project Name: \"{$context['project_name']}\"
                                    Project Description: \"{$context['description']}\"
                                    Business Type: {$context['business_type']}
                                    Industry: {$context['industry']}

                                    CRITICAL ANALYSIS REQUIRED:
                                    1. Read the project description carefully to understand if this is:
                                    - A digital product (app, website, online platform, software) = Answer \"Global digital presence\"
                                    - A physical business (restaurant, store, clinic, office) = Specify the location type needed
                                    - A service business = Specify where services would be delivered

                                    2. Base your answer ONLY on what the project actually is, not generic business advice.

                                    3. If it's clearly a digital project (app, platform, online service), respond with exactly: \"Global digital presence\"

                                    4. If it's a physical business, be specific about the location type needed (e.g., \"Shopping mall food court\", \"Residential neighborhood\", \"Business district\")

                                    5. Keep the answer extremely brief (maximum 5 words).

                                    Analyze the project description above and provide the appropriate location strategy:",
                'main_product_service' => "List 10 specific complete menu items or services for {$context['project_name']}:

                            Project: {$context['project_name']}
                            Description: {$context['description']}
                            Industry: {$context['industry']}

                            Requirements:
                            - Each item must be a COMPLETE name (4-8 words)
                            - Think like actual menu items customers would order
                            - Be specific and complete, not cut off
                            - Format as numbered list

                            Examples:
                            1. Grilled Chicken Caesar Salad
                            2. Mediterranean Quinoa Bowl Special
                            3. Fresh Berry Smoothie Bowl
                            4. Teriyaki Salmon with Steamed Rice
                            5. Veggie Wrap with Hummus Spread

                            Provide 10 complete menu items:",
                'revenue_model' => "What does \"{$context['project_name']}\" actually sell to make money?

                    Description: \"{$context['description']}\"
                    
                    List the MAIN revenue sources (1-5 items):
                    - If it's food business = Daily Meals, Weekly Packages, etc.
                    - If it's app = Subscriptions, Ads, etc.
                    - If it's service = Service Fees, Consultations, etc.
                    
                    Rules:
                    - 2-3 words per item
                    - List actual revenue streams, not descriptions
                    - Focus on what customers actually pay for
                    
                    Revenue streams:",


                'main_differentiator' => "List what makes {$context['project_name']} different from competitors in the {$context['industry']} industry.

                                    Project: {$context['project_name']}
                                    Description: {$context['description']}
                                    Industry: {$context['industry']}

                                    Requirements:
                                    - Each differentiator must be SHORT (3-5 words maximum)
                                    - Focus on what makes THIS project unique
                                    - No long explanations or descriptions
                                    - Just list the key advantages

                                    Examples for restaurant: Fusion Menu Options, 24/7 Delivery Service, Live Cooking Shows, Premium Ingredients Only, Interactive Table Technology

                                    Provide 5 short competitive advantages:",

            ];
        }

        return $prompts[$fieldName] ?? "Please provide suggestions for {$fieldName} in simple, friendly language that's specific to this project context.";
    }


    /**
     * Create enhancement prompt
     */
    private function createEnhancementPrompt(array $context, string $fieldName, string $language): string
    {
        if ($language === 'ar')
        {
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
        }
        else
        {
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
        if ($language === 'ar')
        {
            $messages = [
                'description' => "أنت خبير في كتابة أوصاف المشاريع بأسلوب بسيط ومفهوم. اكتب وصفاً واضحاً بلغة بسيطة وسهلة الفهم كأنك تشرح لصديق. تجنب المصطلحات التقنية المعقدة وركز على التوصيل الواضح للأفكار. اكتب باللغة العربية في 80-120 كلمة.",
                'target_market' => "أنت محلل سوق متخصص في تحديد الفئات المستهدفة بدقة عالية. مهمتك هي تحليل وصف المشروع بعناية واستخراج شرائح السوق المستهدفة المرتبطة مباشرة بهذا المشروع المحدد. 
                                تجنب تمامًا الاقتراحات العامة التي يمكن أن تنطبق على أي مشروع. 
                                ركز على: 
                                1. تحليل وصف المشروع لفهم الغرض الأساسي والقيمة المقدمة 
                                2. تحديد من سيستفيد من هذا المشروع تحديدًا وسبب حاجتهم له 
                                3. صياغة كل شريحة بعبارة كاملة مفهومة توضح الفئة المستهدفة وسبب استخدامهم للمشروع
                                4. التأكد من أن كل شريحة مستهدفة تتعلق مباشرة بالوصف الفعلي للمشروع وليست عامة",



                'location' => "أنت استراتيجي مواقع ذكي يقرأ ويفهم أوصاف المشاريع فعلاً.

                                مهمتك الوحيدة: تحديد ما إذا كان هذا منتجاً رقمياً أم عملاً مادياً من خلال قراءة الوصف.

                                المنتجات الرقمية (تطبيقات، مواقع، منصات، برامج، خدمات إلكترونية):
                                - أجب دائماً بالضبط \"تواجد رقمي عالمي\" - لا شيء آخر!

                                الأعمال المادية (مطاعم، متاجر، عيادات، مكاتب):
                                - حدد نوع الموقع المطلوب بالضبط في 3-5 كلمات
                                - أمثلة: \"موقع في مجمع تجاري\"، \"حي سكني\"، \"مكتب في منطقة أعمال\"

                                اقرأ وصف المشروع بعناية. لا تعطِ نصائح عامة. كن محدداً لما هو المشروع فعلاً.",



                'main_product_service' => "أنت محلل أعمال يحدد المنتجات والخدمات المحددة الملموسة التي يمكن للعملاء شراؤها أو استخدامها.

                                لا تذكر أوصافاً عامة مثل 'طعام جيد' أو 'تجربة لطيفة'.
                                اذكر عناصر محددة مثل 'قائمة الإفطار' أو 'خدمة التوصيل'.

                                فكر كعميل: ما الأشياء المحددة التي يمكنني شراؤها/طلبها/الحصول عليها من هذا العمل؟
                                فكر كقائمة طعام/كتالوج: ما العناصر المحددة التي ستُدرج مع الأسعار؟

                                مهمتك هي تحديد منتجات/خدمات ملموسة قابلة للشراء، وليس أوصافاً تسويقية.",



                'revenue_model' => "تذكر أسماء مصادر الإيرادات البسيطة والواضحة. اجعل كل عنصر من 2-4 كلمات كحد أقصى. بدون علامات اقتباس، بدون شروحات، فقط أسماء مصادر الإيرادات النظيفة. ركز على الطرق الواقعية التي يكسب بها هذا النوع من الأعمال المال.",



                'main_differentiator' => "اذكر مزايا تنافسية قصيرة ومؤثرة. اجعل كل عنصر من 3-5 كلمات كحد أقصى. بدون علامات اقتباس، بدون شروحات طويلة، فقط أسماء المزايا النظيفة. ركز على ما يجعل هذا العمل المحدد فريداً عن المنافسين.",
            ];
        }
        else
        {
            $messages = [
                'description' => "You are an expert in writing project descriptions in a simple, conversational style. Write like you're explaining to a friend, using everyday language. Avoid overly formal or technical language. Make it easy to understand while still being professional. The description should mention what the project is, what it does, and who it's for. Keep it between 80-120 words in English.",
                'target_market' => "You are a market analysis expert specialized in identifying precisely targeted segments. Your task is to carefully analyze the project description and extract target market segments directly related to this specific project.
                                Completely avoid generic suggestions that could apply to any project.
                                Focus on:
                                1. Analyzing the project description to understand the core purpose and value proposition
                                2. Identifying who would specifically benefit from this project and why they need it
                                3. Formulating each segment as a complete understandable phrase that explains the target group and their reason for using the project
                                4. Ensuring each target segment relates directly to the actual project description and is not generic",



                'location' => "You are a smart location strategist who actually reads and understands project descriptions. 

                                YOUR ONLY JOB: Determine if this is a digital product or physical business by reading the description.

                                DIGITAL PRODUCTS (apps, websites, platforms, software, online services): 
                                - Always respond with exactly \"Global digital presence\" - nothing else!

                                PHYSICAL BUSINESSES (restaurants, stores, clinics, offices):
                                - Specify the exact location type needed in 3-5 words
                                - Examples: \"Shopping mall location\", \"Residential neighborhood\", \"Business district office\"

                                READ THE PROJECT DESCRIPTION CAREFULLY. Don't give generic advice. Be specific to what the project actually is.",



                'main_product_service' => "You are a business analyst who identifies SPECIFIC, TANGIBLE products and services that customers can purchase or use.

                                DO NOT list vague descriptions like 'good food' or 'nice experience'. 
                                DO list specific items like 'breakfast menu' or 'delivery service'.

                                Think like a customer: What exact things can I buy/order/request from this business?
                                Think like a menu/catalog: What specific items would be listed with prices?

                                Your job is to identify concrete, purchasable products/services, not marketing descriptions.",




                'revenue_model' => "You list simple, clear revenue stream names. Keep each item to 2-4 words maximum. No quotes, no explanations, just clean revenue source names. Focus on realistic ways this specific business type makes money.",




                'main_differentiator' => "You list short, punchy competitive advantages. Keep each item to 3-5 words maximum. No quotes, no long explanations, just clean advantage names. Focus on what makes this specific business unique from competitors.",
            ];
        }

        return $messages[$fieldName] ?? "You are a friendly business consultant who explains things simply. Provide practical suggestions in plain language, specific to the requested field only.";
    }
    /**
     * Get enhancement system message
     */

    private function getEnhancementSystemMessage(string $fieldName, string $language): string
    {
        if ($language === 'ar')
        {
            $messages = [
                'description' => "حسن الوصف ليصبح أكثر وضوحاً وبساطة. استخدم لغة محادثة طبيعية كأنك تشرح لصديق. تجنب اللغة الرسمية أو التقنية المعقدة. اجعل النص سهل الفهم مع الحفاظ على المهنية. يجب أن يذكر الوصف ماهية المشروع، وظيفته، والفئة المستهدفة.",
                'target_market' => "حسن وصف الجمهور المستهدف بلغة بسيطة ومباشرة. استخرج الفئات من النص وقدمها كقائمة واضحة ومفهومة للجميع.",
                'location' => "حسن تحديد موقع/نطاق المشروع بإيجاز ووضوح. إذا كان المشروع رقمياً (تطبيق/منصة)، اكتب فقط \"تواجد رقمي عالمي\" دون شرح. إذا كان مشروعاً مادياً، اذكر نوع المنطقة باختصار. اجعل الإجابة مختصرة للغاية (5-10 كلمات فقط).",
                'main_product_service' => "حسن قائمة المنتجات والخدمات لتكون أكثر تحديداً ووضوحاً بلغة يفهمها الجميع.",
                'revenue_model' => "حسن نماذج الإيرادات لتكون مناسبة لطبيعة المشروع (رقمي/مادي) ومفهومة للناس العاديين وليس فقط للخبراء الماليين.",
                'main_differentiator' => "حسن المميزات التنافسية بلغة بسيطة وواضحة تبرز القيمة الفريدة للمشروع كأنك تشرح لشخص ليس لديه خبرة في المجال."
            ];
        }
        else
        {
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

        // For description field, handle project name and formatting
        if ($fieldName === 'description')
        {
            // Extract just the description part, removing any project name prefix
            $cleanDescription = $response;

            if (preg_match('/^([A-Z0-9_\s]+)\s*:\s*(.*)$/s', $response, $matches))
            {
                $cleanDescription = $matches[2]; // Get just the description part without prefix
            }

            // Clean up the description
            $cleanDescription = $this->cleanDescription($cleanDescription);

            // Return only the clean description without project name
            $response = $cleanDescription;
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

        foreach ($intros as $intro)
        {
            if (stripos($response, $intro) === 0)
            {
                $response = trim(substr($response, strlen($intro)));
                break;
            }
        }

        $response = ltrim($response, ': .,');
        $response = ltrim($response, '"\''); // Also remove leading quotes

        // Special handling for location field - make it extremely concise
        if ($fieldName === 'location')
        {
            // Extract just the core recommendation without explanation
            $patterns = [
                '/.*?(global digital presence).*?/i' => 'Global digital presence',
                '/.*?(worldwide digital distribution).*?/i' => 'Worldwide digital distribution',
                '/.*?(global app store presence).*?/i' => 'Global app store presence',
                '/.*?(global online presence).*?/i' => 'Global online presence',
                '/.*?(can be accessed globally).*?/i' => 'Global digital access',
                '/.*(digital platform with global reach).*?/i' => 'Digital platform with global reach'
            ];

            foreach ($patterns as $pattern => $replacement)
            {
                if (preg_match($pattern, $response))
                {
                    $response = $replacement;
                    break;
                }
            }

            // If none of the patterns matched but it seems like a digital product
            if (
                stripos($response, 'digital') === false &&
                stripos($response, 'global') === false &&
                stripos($response, 'online') === false
            )
            {

                if (
                    stripos($response, 'app') !== false ||
                    stripos($response, 'platform') !== false ||
                    stripos($response, 'software') !== false ||
                    stripos($response, 'travel') !== false
                )
                {

                    $response = 'Global digital presence';
                }
            }

            // Keep it short - take only the first sentence
            $firstSentence = preg_split('/[.!?]/', $response)[0];
            if (strlen($firstSentence) > 10)
            { // Make sure it's not too short
                $response = $firstSentence . '.';
            }
        }

        // Format as list for appropriate fields
        if (in_array($fieldName, ['target_market', 'main_product_service', 'revenue_model', 'main_differentiator']))
        {

            if ($fieldName === 'target_market')
            {
                $lines = explode("\n", $response);
                $formattedLines = [];
                $count = 0;

                // Extract numbered items and preserve complete descriptions
                foreach ($lines as $line)
                {
                    if (preg_match('/^\s*\d+\.\s/', $line))
                    {
                        $count++;
                        $content = preg_replace('/^\s*\d+\.\s/', '', $line);
                        $content = str_replace(['**', '__'], '', $content); // Remove bold formatting

                        // Keep it short but complete - limit to 6-8 words max
                        $words = explode(' ', $content);
                        if (count($words) > 8)
                        {
                            $content = implode(' ', array_slice($words, 0, 7));
                        }

                        // Make sure it doesn't end with incomplete words
                        if (preg_match('/\b(seeking|looking|wanting|needing|in|for|to|who)$/', $content))
                        {
                            $content .= " solutions";
                        }

                        $formattedLines[] = $count . '. ' . trim($content);
                    }
                }

                if (!empty($formattedLines))
                {
                    return implode("\n", $formattedLines);
                }
            }

            // Handle revenue_model formatting specifically
            if ($fieldName === 'revenue_model')
            {
                $lines = explode("\n", $response);
                $formattedLines = [];
                $count = 0;

                foreach ($lines as $line)
                {
                    $line = trim($line);
                    if (empty($line)) continue;

                    // Remove existing numbering if present
                    $content = preg_replace('/^\s*\d+\.\s*/', '', $line);
                    $content = str_replace(['**', '__'], '', $content); // Remove bold formatting
                    $content = trim($content);

                    if (!empty($content))
                    {
                        $count++;
                        $formattedLines[] = $count . '. ' . $content;
                    }
                }

                if (!empty($formattedLines))
                {
                    return implode("\n", $formattedLines);
                }
            }

            // For other fields (main_product_service, main_differentiator)
            $response = $this->formatAsList($response);
        }
        // Clean description specifically
        if ($fieldName === 'description' && strpos($response, ':') === false)
        {
            $response = $this->cleanDescription($response);
        }

        if ($fieldName === 'main_product_service')
        {
            // Get project name and description if available
            $projectName = $GLOBALS['current_project_name'] ?? '';
            $projectDesc = $context['description'] ?? '';

            // Format as a proper list with exactly 10 items
            $lines = explode("\n", $response);
            $validItems = [];

            foreach ($lines as $line)
            {
                if (preg_match('/^\s*\d+\.\s(.+)$/', $line, $matches))
                {
                    $item = trim($matches[1]);
                    // Remove any "who need this specific solution" or similar phrases
                    $item = preg_replace('/\s+who\s+need.*$/i', '', $item);
                    $validItems[] = $item;
                }
            }

            // Clean up the items and ensure they're concise
            for ($i = 0; $i < count($validItems); $i++)
            {
                // Keep only first 4 words if too long
                $words = explode(' ', $validItems[$i]);
                if (count($words) > 4)
                {
                    $validItems[$i] = implode(' ', array_slice($words, 0, 4));
                }
            }

            // Format the final response
            $formattedResponse = [];
            for ($i = 0; $i < min(10, count($validItems)); $i++)
            {
                $formattedResponse[] = ($i + 1) . '. ' . $validItems[$i];
            }

            if (!empty($formattedResponse))
            {
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
        if (preg_match('/^\s*\d+\.\s/m', $response))
        {
            $lines = explode("\n", $response);
            $numberedLines = [];
            $count = 0;

            foreach ($lines as $line)
            {
                if (preg_match('/^\s*\d+\.\s/', $line))
                {
                    $count++;
                    // زيادة الحد الأقصى من 10 إلى 10
                    if ($count <= 10)
                    {
                        $content = preg_replace('/^\s*\d+\.\s/', '', $line);
                        $content = $this->simplifyListItem($content);
                        $numberedLines[] = $content;
                    }
                }
            }

            // Renumber from 1
            $result = [];
            for ($i = 0; $i < count($numberedLines); $i++)
            {
                $result[] = ($i + 1) . '. ' . trim($numberedLines[$i]);
            }

            return implode("\n", $result);
        }

        // Convert to numbered list
        $items = preg_split('/[,;]\s*/', $response);
        $items = array_filter($items, function ($item)
        {
            return !empty(trim($item));
        });

        // زيادة الحد الأقصى من 10 إلى 10
        $items = array_slice($items, 0, 10);

        // Format as numbered list
        $result = [];
        for ($i = 0; $i < count($items); $i++)
        {
            $simplifiedItem = $this->simplifyListItem(trim($items[$i]));
            $result[] = ($i + 1) . '. ' . $simplifiedItem;
        }

        return implode("\n", $result);
    }

    /**
     * Simplify a list item - FIXED VERSION
     */
    private function simplifyListItem(string $item): string
    {
        // Remove bold formatting
        $item = str_replace(['**', '__'], '', $item);

        // Clean up the item first
        $item = trim($item);

        // For target market, we want complete meaningful phrases
        // Don't truncate at punctuation for target market items
        $wordCount = str_word_count($item);

        // If the item is too short and doesn't seem complete, try to complete it
        if ($wordCount < 6)
        {
            // Check if it ends with common incomplete patterns
            $incompletePatterns = [
                '/seeking$/',
                '/looking$/',
                '/wanting$/',
                '/needing$/',
                '/searching$/',
                '/in$/',
                '/for$/',
                '/to$/',
                '/who$/',
                '/that$/'
            ];

            $isIncomplete = false;
            foreach ($incompletePatterns as $pattern)
            {
                if (preg_match($pattern, $item))
                {
                    $isIncomplete = true;
                    break;
                }
            }

            if ($isIncomplete)
            {
                $item .= " convenient solutions";
            }
        }

        // Only remove content after sentence-ending punctuation (not commas/colons)
        // This preserves "Young professionals seeking work-life balance" instead of cutting at comma
        $simplified = preg_replace('/[.!?]+.*$/s', '', $item);

        // If still too long, take first 15 words (increased from 12 to allow complete thoughts)
        $words = explode(' ', $simplified);
        if (count($words) > 15)
        {
            $simplified = implode(' ', array_slice($words, 0, 15));
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
        if (preg_match('/^([A-Z0-9_]+)\s*:\s*(.*)$/s', $description, $matches))
        {
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

        foreach ($marketingPhrases as $phrase)
        {
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

        foreach ($technicalTerms as $technical => $simple)
        {
            $description = preg_replace('/\b' . preg_quote($technical, '/') . '\b/i', $simple, $description);
        }

        // Clean up spacing
        $description = preg_replace('/\s+/', ' ', $description);
        $description = trim($description);

        // Add back the project name prefix if it existed
        if (!empty($projectNamePrefix))
        {
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
            'target_market' => 200,  // ← Changed to 200
            'location' => 200,
            'main_product_service' => 700,
            'revenue_model' => 400,
            'main_differentiator' => 500,
        ];

        $maxLength = $maxLengths[$fieldName] ?? 500;

        if (strlen($content) > $maxLength)
        {
            // For list fields, try to remove items from the end
            if (in_array($fieldName, ['target_market', 'main_product_service', 'revenue_model', 'main_differentiator']))
            {
                $lines = explode("\n", $content);
                while (strlen(implode("\n", $lines)) > $maxLength && count($lines) > 3)
                {
                    array_pop($lines);
                }
                $content = implode("\n", $lines);
            }
            else
            {
                // For other fields, truncate at word boundary
                $content = substr($content, 0, $maxLength);
                $lastSpace = strrpos($content, ' ');
                if ($lastSpace !== false && $lastSpace > $maxLength * 0.8)
                {
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
        if ($language === 'ar')
        {
            $fallbacks = [
                'description' => 'مشروع مبتكر يهدف إلى تقديم حلول عملية ومتطورة لتلبية احتياجات السوق المحددة. يركز المشروع على استخدام أحدث الأساليب والتقنيات لضمان تقديم قيمة حقيقية للعملاء المستهدفين. يتميز بنهج مدروس ومنهجية واضحة تضمن تحقيق الأهداف المرجوة.',
                'target_market' => "1. الشركات الصغيرة والمتوسطة في القطاع المستهدف\n2. المهنيون والمختصون في المجال\n3. المؤسسات التعليمية والتدريبية\n4. الأفراد المهتمون بالحلول المبتكرة\n5. الشركات الناشئة الساعية للنمو",
                'location' => 'المراكز التجارية الرئيسية أو النطاق الرقمي العالمي',
                'main_product_service' => "1. حل تقني متخصص ومخصص\n2. خدمات استشارية متقدمة\n3. منصة رقمية متكاملة\n4. برامج تدريبية وتطويرية\n5. خدمات دعم ومتابعة شاملة",
                'revenue_model' => "1. رسوم اشتراك أو عضوية\n2. أتعاب خدمات احترافية\n3. مبيعات مباشرة للمنتجات\n4. عمولات من الشراكات\n5. خدمات مميزة مدفوعة",
                'main_differentiator' => "1. خبرة متخصصة في المجال\n2. تقنية متطورة وموثوقة\n3. خدمة عملاء متفوقة\n4. حلول مخصصة للاحتياجات\n5. أسعار تنافسية وقيمة عالية"
            ];
        }
        else
        {
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
        if ($fieldName === 'description')
        {
            return $this->cleanDescription($content);
        }

        // For other fields, format as list
        return $this->formatAsList($content);
    }
}
