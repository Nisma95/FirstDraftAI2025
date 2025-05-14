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
     * Generate a project description using AI (for creating new descriptions)
     */
    public function generateProjectDescription(array $projectData, string $language = 'en'): string
    {
        // Debug log the incoming data
        Log::info('Generating description with data:', $projectData);

        // Get business type and industry details
        $businessType = BusinessType::find($projectData['business_type_id']);
        $industry = Industry::find($projectData['industry_id']);

        // Prepare context information
        $context = [
            'project_name' => $projectData['name'] ?? 'Untitled Project',
            'status' => $projectData['status'] ?? 'new_project',
            'business_type' => $businessType ? $businessType->business_type_name : 'Business',
            'industry' => $industry ? $industry->industry_name : 'General Industry',
        ];

        // Log context for debugging
        Log::info('Context for AI generation:', $context);

        // Create the prompt based on language
        $prompt = $this->createPrompt($context);

        Log::info('Generated prompt: ' . $prompt);

        try {
            $response = $this->openai->chat()->create([
                'model' => env('OPENAI_MODEL', 'gpt-3.5-turbo'),
                'messages' => [
                    ['role' => 'system', 'content' => $this->getSystemMessage()],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'max_tokens' => 300,
                'temperature' => 0.7,
            ]);

            $result = trim($response->choices[0]->message->content);
            Log::info('AI response: ' . $result);

            return $result;
        } catch (\Exception $e) {
            Log::error('OpenAI API Error: ' . $e->getMessage());
            return $this->getFallbackDescription($context);
        }
    }

    /**
     * Enhance an existing project description using AI
     */
    public function enhanceProjectDescription(array $projectData, string $currentDescription, string $language = 'en'): string
    {
        // Debug log the incoming data
        Log::info('Enhancing description for project: ' . ($projectData['name'] ?? 'Unknown'));
        Log::info('Current description to enhance: ' . $currentDescription);

        // Get business type and industry details
        $businessType = BusinessType::find($projectData['business_type_id']);
        $industry = Industry::find($projectData['industry_id']);

        // Prepare context information
        $context = [
            'project_name' => $projectData['name'] ?? 'Untitled Project',
            'status' => $projectData['status'] ?? 'new_project',
            'business_type' => $businessType ? $businessType->business_type_name : 'Business',
            'industry' => $industry ? $industry->industry_name : 'General Industry',
            'current_description' => $currentDescription,
        ];

        Log::info('Enhancement context prepared for: ' . $context['project_name']);

        // Create the enhancement prompt
        $prompt = $this->createEnhancementPrompt($context);

        Log::info('Enhancement prompt generated');

        try {
            $response = $this->openai->chat()->create([
                'model' => env('OPENAI_MODEL', 'gpt-3.5-turbo'),
                'messages' => [
                    ['role' => 'system', 'content' => $this->getEnhancementSystemMessage()],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'max_tokens' => 400,
                'temperature' => 0.7,
            ]);

            $result = trim($response->choices[0]->message->content);
            Log::info('AI enhancement successful for: ' . $context['project_name']);

            return $result;
        } catch (\Exception $e) {
            Log::error('OpenAI API Error during enhancement: ' . $e->getMessage());
            return $currentDescription;
        }
    }

    /**
     * Create AI prompt for generating new descriptions
     */
    private function createPrompt(array $context): string
    {
        $statusText = $context['status'] === 'new_project' ? 'new project' : 'existing project';

        return "Write a detailed and compelling description for a project named '{$context['project_name']}' in the {$context['industry']} industry. 

Business Type: {$context['business_type']}
Project Status: {$statusText}

Requirements:
- Use the exact project name '{$context['project_name']}' throughout the description
- Write approximately 150-200 words
- Include the project's purpose, value proposition, and key benefits
- Explain why this project is important in the {$context['industry']} industry
- Mention how it addresses market needs or problems
- Use professional yet engaging language
- Be specific about the project's goals and expected outcomes";
    }

    /**
     * Create AI prompt for enhancing existing descriptions
     */
    private function createEnhancementPrompt(array $context): string
    {
        $statusText = $context['status'] === 'new_project' ? 'new project' : 'existing project';

        return "I have a project description that needs enhancement and expansion. Here are the details:

Project Name: {$context['project_name']}
Industry: {$context['industry']}
Business Type: {$context['business_type']}
Status: {$statusText}

Current Description:
\"{$context['current_description']}\"

Please enhance this description by:
1. Keeping the project name '{$context['project_name']}' exactly as provided
2. Expanding on the core idea with more specific details
3. Adding information about the project's objectives and value proposition
4. Including potential impact and benefits for stakeholders
5. Mentioning industry-specific advantages
6. Making it more professional and compelling
7. Ensuring it's approximately 200-250 words

The enhanced description should build upon the existing content while making it more comprehensive and engaging.";
    }

    /**
     * Get system message for AI (for new descriptions)
     */
    private function getSystemMessage(): string
    {
        return "You are an expert business analyst and project description writer. Your task is to create compelling, professional project descriptions that clearly communicate the project's value, purpose, and potential impact.

Guidelines:
- Always preserve the exact project name as provided
- Create descriptions that are informative yet engaging
- Focus on business value and market relevance
- Use industry-appropriate terminology
- Maintain a professional yet accessible tone
- Structure the description logically with clear flow
- Include specific details about purposes, benefits, and outcomes";
    }

    /**
     * Get system message for AI (for enhancing descriptions)
     */
    private function getEnhancementSystemMessage(): string
    {
        return "You are an expert editor specializing in business project descriptions. Your role is to enhance and improve existing project descriptions while maintaining their core message.

Guidelines:
- Never change the project name - use it exactly as provided
- Preserve the original intent and core idea
- Add valuable details and context
- Improve clarity and readability
- Enhance professional appeal
- Expand on benefits and value propositions
- Ensure consistency with the industry and business type
- Create smooth, natural flow between ideas
- Maintain a professional business tone throughout";
    }

    /**
     * Fallback description in case of API failure
     */
    private function getFallbackDescription(array $context): string
    {
        return "The {$context['project_name']} project is an innovative initiative in the {$context['industry']} industry. This {$context['business_type']} venture focuses on delivering value through strategic planning and implementation. The project aims to address market needs while providing sustainable solutions that benefit stakeholders. Through careful analysis and targeted execution, {$context['project_name']} seeks to establish itself as a significant contributor to the {$context['industry']} sector.";
    }
}
