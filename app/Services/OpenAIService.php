<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAIService
{
    protected string $apiKey;
    protected string $apiUrl;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = config('openai.api_key');
        $this->apiUrl = config('openai.api_url', 'https://api.openai.com/v1');
        $this->model = config('openai.model', 'gpt-3.5-turbo');
    }

    /**
     * Send a chat completion request to OpenAI.
     */
    public function chatCompletion(array $messages, array $options = []): array
    {
        try {
            $payload = [
                'model' => $this->model,
                'messages' => $messages,
            ];

            // Add optional parameters only if they are set and valid
            if (config('openai.max_tokens') && is_int(config('openai.max_tokens'))) {
                $payload['max_tokens'] = (int) config('openai.max_tokens');
            }

            if (config('openai.temperature') !== null && is_numeric(config('openai.temperature'))) {
                $payload['temperature'] = (float) config('openai.temperature');
            }

            // Merge any additional options
            $payload = array_merge($payload, $options);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . '/chat/completions', $payload);

            if (!$response->successful()) {
                throw new Exception('OpenAI API error: ' . $response->body());
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('OpenAI API Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get a simple text response from OpenAI.
     */
    public function getResponse(array $messages): string
    {
        $response = $this->chatCompletion($messages);

        return $response['choices'][0]['message']['content'] ?? 'No response received.';
    }

    /**
     * Validate that the service is properly configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->apiKey);
    }
}
