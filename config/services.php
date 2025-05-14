<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */


    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'endpoint' => env('OPENAI_API_URL', 'https://api.openai.com/v1') . '/chat/completions',
        'model' => env('OPENAI_MODEL', 'gpt-3.5-turbo'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],



    'meeser' => [
        'api_key' => env('MEESER_API_KEY'),
        'secret_key' => env('MEESER_SECRET_KEY'),
        'public_key' => env('MEESER_PUBLIC_KEY'),
        'environment' => env('MEESER_ENVIRONMENT', 'test'), // 'test' or 'production'
        'webhook_secret' => env('MEESER_WEBHOOK_SECRET'),

        // Test credentials (these will be provided by Meeser)
        'test' => [
            'api_key' => env('MEESER_TEST_API_KEY'),
            'secret_key' => env('MEESER_TEST_SECRET_KEY'),
            'public_key' => env('MEESER_TEST_PUBLIC_KEY'),
        ],

        // Production credentials
        'production' => [
            'api_key' => env('MEESER_PRODUCTION_API_KEY'),
            'secret_key' => env('MEESER_PRODUCTION_SECRET_KEY'),
            'public_key' => env('MEESER_PRODUCTION_PUBLIC_KEY'),
        ],

        // Default currency
        'currency' => 'SAR',

        // Payment methods to enable
        'enabled_methods' => [
            'card',
            'bank_transfer',
            'wallet',
            'installments',
        ],

        // Redirect URLs
        'success_url' => env('MEESER_SUCCESS_URL', '/payments/success'),
        'failure_url' => env('MEESER_FAILURE_URL', '/payments/failure'),
        'callback_url' => env('MEESER_CALLBACK_URL', '/payments/callback'),
    ],

];
