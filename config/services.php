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



    /*
    |--------------------------------------------------------------------------
    | Meeser Payment Gateway Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Meeser payment processing service
    |
    */
    'meeser' => [
        'api_key' => env('MEESER_API_KEY'),
        'secret_key' => env('MEESER_SECRET_KEY'),
        'public_key' => env('MEESER_PUBLIC_KEY'), // For frontend integration
        'environment' => env('MEESER_ENVIRONMENT', 'test'), // test or production
        'webhook_secret' => env('MEESER_WEBHOOK_SECRET'),

        // API URLs (automatically set based on environment)
        'test_url' => 'https://test-api.meeser.sa/v1',
        'production_url' => 'https://api.meeser.sa/v1',

        // Default currency
        'currency' => env('MEESER_DEFAULT_CURRENCY', 'SAR'),

        // Webhook settings
        'webhook_tolerance' => env('MEESER_WEBHOOK_TOLERANCE', 300), // 5 minutes

        // Payment settings
        'default_success_url' => env('APP_URL') . '/payments/success',
        'default_failure_url' => env('APP_URL') . '/payments/failure',
        'default_callback_url' => env('APP_URL') . '/webhooks/meeser/callback',
    ],




];
