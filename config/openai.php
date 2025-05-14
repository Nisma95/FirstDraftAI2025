<?php

return [
    /*
    |--------------------------------------------------------------------------
    | OpenAI API Configuration
    |--------------------------------------------------------------------------
    */

    'api_key' => env('OPENAI_API_KEY'),

    'api_url' => env('OPENAI_API_URL', 'https://api.openai.com/v1'),

    'model' => env('OPENAI_MODEL', 'gpt-3.5-turbo'),

    // Use null as default to omit the parameter if not set
    'max_tokens' => env('OPENAI_MAX_TOKENS') ? (int) env('OPENAI_MAX_TOKENS') : null,

    // Use null as default to omit the parameter if not set  
    'temperature' => env('OPENAI_TEMPERATURE') !== null ? (float) env('OPENAI_TEMPERATURE') : null,

    /*
    |--------------------------------------------------------------------------
    | Timeout Settings
    |--------------------------------------------------------------------------
    */

    'timeout' => env('OPENAI_TIMEOUT', 30),

    /*
    |--------------------------------------------------------------------------
    | Debug Mode
    |--------------------------------------------------------------------------
    */

    'debug' => env('OPENAI_DEBUG', false),
];
