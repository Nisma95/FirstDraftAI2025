<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function ()
{
    try
    {
        return Inertia::render('Welcome', [
            'status' => 'success',
            'message' => 'Laravel is working!'
        ]);
    }
    catch (\Exception $e)
    {
        return response()->file(public_path('index.html'));
    }
});

// Simple test route
Route::get('/test', function ()
{
    return response()->json([
        'status' => 'success',
        'message' => 'Laravel is working!',
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected'
    ]);
});
