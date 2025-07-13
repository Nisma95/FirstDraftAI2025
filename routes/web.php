<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function ()
{
    return '<h1>🚀 Laravel Works!</h1><p>Environment: ' . config('app.env') . '</p>';
});

Route::get('/info', function ()
{
    return response()->json([
        'status' => 'success',
        'laravel' => app()->version(),
        'php' => PHP_VERSION,
        'env' => config('app.env')
    ]);
});
