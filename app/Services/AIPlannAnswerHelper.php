<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\App;
use Exception;

class AIPlannAnswerHelper
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
     * Create a new AIPlannAnswerHelper instance.
     */

    public function __construct()
    {
        $this->endpoint = config('services.openai.endpoint', 'https://api.openai.com/v1/chat/completions');
        $this->apiKey = config('services.openai.api_key'); // Same as AIPlannerService
        $this->model = config('services.openai.model', 'gpt-3.5-turbo');

        // Validate API key
        if (empty($this->apiKey)) {
            Log::error('OpenAI API key is not configured for AIPlannAnswerHelper');
        }
    }

    /**
     * Generate AI answer suggestion for a specific question
     */
    public function generateAnswerSuggestion(array $data): array
    {
        $question = $data['question'];
        $questionType = $data['question_type'] ?? 'text';
        $businessIdea = $data['business_idea'] ?? '';
        $projectName = $data['project_name'] ?? '';
        $projectDescription = $data['project_description'] ?? '';
        $previousAnswers = $data['previous_answers'] ?? [];

        Log::info('Generating AI answer suggestion', [
            'question' => $question,
            'question_type' => $questionType,
            'business_idea' => $businessIdea,
            'project_name' => $projectName
        ]);

        try {
            $locale = App::getLocale();
            $prompt = $this->buildAnswerPrompt($question, $questionType, $businessIdea, $projectName, $projectDescription, $previousAnswers, $locale);
            $systemMessage = $this->getSystemMessage($locale);

            $response = $this->callAI($prompt, 'answer_suggestion', $systemMessage);

            if (empty($response)) {
                Log::error('Empty response from AI for answer suggestion');
                return [
                    'success' => false,
                    'message' => 'Failed to generate answer suggestion',
                    'suggested_answer' => ''
                ];
            }

            // Clean the response - remove any formatting
            $cleanAnswer = $this->cleanAIResponse($response);

            Log::info('Successfully generated AI answer suggestion');

            return [
                'success' => true,
                'message' => 'Answer suggestion generated successfully',
                'suggested_answer' => $cleanAnswer
            ];
        } catch (Exception $e) {
            Log::error('Error generating AI answer suggestion: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Failed to generate answer suggestion: ' . $e->getMessage(),
                'suggested_answer' => $this->getFallbackAnswer($question, $questionType, $locale)
            ];
        }
    }

    /**
     * Build the prompt for AI answer generation
     */
    private function buildAnswerPrompt(string $question, string $questionType, string $businessIdea, string $projectName, string $projectDescription, array $previousAnswers, string $locale): string
    {
        $projectContext = '';
        if ($projectName && $projectDescription) {
            if ($locale === 'ar') {
                $projectContext = "
                اسم المشروع: {$projectName}
                وصف المشروع: {$projectDescription}
                فكرة العمل: {$businessIdea}
                ";
            } else {
                $projectContext = "
                Project Name: {$projectName}
                Project Description: {$projectDescription}
                Business Idea: {$businessIdea}
                ";
            }
        }

        $previousContext = '';
        if (!empty($previousAnswers)) {
            if ($locale === 'ar') {
                foreach ($previousAnswers as $index => $qa) {
                    $previousContext .= "السؤال " . ($index + 1) . ": {$qa['question']}\n";
                    $previousContext .= "الإجابة: {$qa['answer']}\n\n";
                }
            } else {
                foreach ($previousAnswers as $index => $qa) {
                    $previousContext .= "Question " . ($index + 1) . ": {$qa['question']}\n";
                    $previousContext .= "Answer: {$qa['answer']}\n\n";
                }
            }
        }

        if ($locale === 'ar') {
            $prompt = "
            {$projectContext}
            
            " . (!empty($previousContext) ? "الأسئلة والإجابات السابقة:\n{$previousContext}" : "") . "
            
            السؤال الحالي: {$question}
            نوع السؤال: {$questionType}
            
            قم بإنشاء إجابة مفيدة ومناسبة لهذا السؤال بناءً على:
            - معلومات المشروع المتوفرة
            - الإجابات السابقة (إن وجدت)
            - طبيعة السؤال المطروح
            
            متطلبات الإجابة:
            - يجب أن تكون واقعية وقابلة للتطبيق
            - مناسبة لطبيعة المشروع
            - مفصلة بما فيه الكفاية
            - متماسكة مع الإجابات السابقة
            ";

            if ($questionType === 'number') {
                $prompt .= "
                - يجب أن تكون الإجابة رقماً فقط أو رقماً مع وحدة قياس مناسبة
                - قدم رقماً واقعياً ومعقولاً للمشروع
                ";
            } else {
                $prompt .= "
                - يجب أن تكون الإجابة نصية مفصلة
                - قدم تفاصيل كافية لفهم الموضوع
                ";
            }

            $prompt .= "
            
            قدم الإجابة مباشرة بدون أي تنسيق إضافي أو مقدمات.
            ";
        } else {
            $prompt = "
            {$projectContext}
            
            " . (!empty($previousContext) ? "Previous questions and answers:\n{$previousContext}" : "") . "
            
            Current question: {$question}
            Question type: {$questionType}
            
            Generate a helpful and appropriate answer for this question based on:
            - Available project information
            - Previous answers (if any)
            - Nature of the question asked
            
            Answer requirements:
            - Should be realistic and actionable
            - Appropriate for the project's nature
            - Detailed enough to be useful
            - Consistent with previous answers
            ";

            if ($questionType === 'number') {
                $prompt .= "
                - Answer should be a number only or number with appropriate unit
                - Provide a realistic and reasonable number for the project
                ";
            } else {
                $prompt .= "
                - Answer should be detailed text
                - Provide sufficient details to understand the topic
                ";
            }

            $prompt .= "
            
            Provide the answer directly without any additional formatting or introductions.
            ";
        }

        return $prompt;
    }

    /**
     * Get system message based on locale
     */
    private function getSystemMessage(string $locale): string
    {
        if ($locale === 'ar') {
            return 'أنت مساعد ذكي متخصص في مساعدة رواد الأعمال على الإجابة على أسئلة خطط العمل. قدم إجابات عملية ومفيدة ومناسبة للسياق. أجب مباشرة بدون تنسيق إضافي.';
        } else {
            return 'You are an intelligent assistant specialized in helping entrepreneurs answer business plan questions. Provide practical, helpful, and contextually appropriate answers. Respond directly without additional formatting.';
        }
    }

    /**
     * Clean AI response from any unwanted formatting
     */
    private function cleanAIResponse(string $response): string
    {
        $response = trim($response);

        // Remove any markdown formatting
        $response = preg_replace('/^\*\*(.+)\*\*$/', '$1', $response);
        $response = preg_replace('/^#+\s*(.+)$/', '$1', $response);

        // Remove any quotes if the entire response is wrapped in quotes
        if (preg_match('/^"(.+)"$/', $response, $matches)) {
            $response = $matches[1];
        }

        // Remove any JSON-like formatting
        if (preg_match('/^{\s*"answer"\s*:\s*"([^"]+)"\s*}$/', $response, $matches)) {
            $response = $matches[1];
        }

        return $response;
    }

    /**
     * Get fallback answer if AI generation fails
     */
    private function getFallbackAnswer(string $question, string $questionType, string $locale): string
    {
        if ($questionType === 'number') {
            return $locale === 'ar' ? '0' : '0';
        }

        if ($locale === 'ar') {
            return 'يرجى تقديم إجابة مناسبة بناءً على خبرتك ومعرفتك بالمشروع.';
        } else {
            return 'Please provide an appropriate answer based on your experience and knowledge of the project.';
        }
    }

    /**
     * Helper method to call AI API
     */
    private function callAI(string $prompt, string $context, string $systemMessage): string
    {
        if (empty($this->apiKey)) {
            Log::error('OpenAI API key is not configured');
            throw new Exception('OpenAI API key is not configured');
        }

        try {
            Log::info("Making AI API call for context: {$context}");

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(45)->post($this->endpoint, [
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
                'max_tokens' => 1000,
                'temperature' => 0.7
            ]);

            Log::info("AI API Response Status: " . $response->status());

            if (!$response->successful()) {
                Log::error("OpenAI API Error", [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'context' => $context
                ]);

                if ($response->status() === 401) {
                    throw new Exception('Invalid OpenAI API key');
                } elseif ($response->status() === 429) {
                    throw new Exception('OpenAI API rate limit exceeded');
                } elseif ($response->status() === 500) {
                    throw new Exception('OpenAI API server error');
                } else {
                    throw new Exception("OpenAI API error: " . $response->status());
                }
            }

            $result = $response->json();

            if (isset($result['error'])) {
                Log::error("OpenAI Error", ['error' => $result['error'], 'context' => $context]);
                throw new Exception("OpenAI API Error: " . ($result['error']['message'] ?? 'Unknown error'));
            }

            if (!isset($result['choices'][0]['message']['content'])) {
                Log::error("Unexpected AI response format", ['result' => $result, 'context' => $context]);
                throw new Exception('Unexpected response format from OpenAI');
            }

            $content = $result['choices'][0]['message']['content'];
            Log::info("AI API call successful for context: {$context}");

            return $content;
        } catch (Exception $e) {
            Log::error("AI Generation Error for {$context}: " . $e->getMessage(), [
                'exception' => $e,
                'context' => $context
            ]);
            throw $e;
        }
    }

    /**
     * Generate multiple answer suggestions (advanced feature)
     */
    public function generateMultipleAnswerSuggestions(array $data, int $count = 3): array
    {
        $suggestions = [];

        for ($i = 0; $i < $count; $i++) {
            try {
                $result = $this->generateAnswerSuggestion($data);
                if ($result['success']) {
                    $suggestions[] = [
                        'id' => $i + 1,
                        'answer' => $result['suggested_answer'],
                        'confidence' => rand(75, 95) // Simulated confidence score
                    ];
                }
            } catch (Exception $e) {
                Log::warning("Failed to generate suggestion {$i}: " . $e->getMessage());
            }
        }

        return [
            'success' => !empty($suggestions),
            'message' => !empty($suggestions) ? 'Multiple suggestions generated' : 'Failed to generate suggestions',
            'suggestions' => $suggestions
        ];
    }

    /**
     * Improve user's existing answer
     */
    public function improveAnswer(array $data): array
    {
        $userAnswer = $data['user_answer'];
        $question = $data['question'];
        $businessIdea = $data['business_idea'] ?? '';
        $projectName = $data['project_name'] ?? '';

        $locale = App::getLocale();

        if ($locale === 'ar') {
            $prompt = "
            المشروع: {$projectName}
            فكرة العمل: {$businessIdea}
            السؤال: {$question}
            إجابة المستخدم الحالية: {$userAnswer}
            
            قم بتحسين هذه الإجابة من خلال:
            - إضافة تفاصيل مفيدة
            - تحسين الوضوح والدقة
            - التأكد من الاتساق مع طبيعة المشروع
            - الحفاظ على المعنى الأساسي للإجابة الأصلية
            
            قدم الإجابة المحسنة مباشرة:
            ";
        } else {
            $prompt = "
            Project: {$projectName}
            Business Idea: {$businessIdea}
            Question: {$question}
            User's current answer: {$userAnswer}
            
            Improve this answer by:
            - Adding useful details
            - Improving clarity and accuracy
            - Ensuring consistency with the project nature
            - Maintaining the core meaning of the original answer
            
            Provide the improved answer directly:
            ";
        }

        try {
            $systemMessage = $this->getSystemMessage($locale);
            $response = $this->callAI($prompt, 'improve_answer', $systemMessage);
            $improvedAnswer = $this->cleanAIResponse($response);

            return [
                'success' => true,
                'message' => 'Answer improved successfully',
                'improved_answer' => $improvedAnswer,
                'original_answer' => $userAnswer
            ];
        } catch (Exception $e) {
            Log::error('Error improving answer: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Failed to improve answer: ' . $e->getMessage(),
                'improved_answer' => $userAnswer,
                'original_answer' => $userAnswer
            ];
        }
    }
}
