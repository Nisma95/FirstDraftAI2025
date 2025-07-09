<?php
// File: app/Http/Middleware/DatabaseConnectionCheck.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class DatabaseConnectionCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try
        {
            // Try a simple database query to check connection
            DB::connection()->getPdo();

            // If we reach here, the connection is working
            return $next($request);
        }
        catch (\Exception $e)
        {
            Log::error('Database connection failed', [
                'error' => $e->getMessage(),
                'url' => $request->url(),
                'ip' => $request->ip()
            ]);

            // If it's an API request, return JSON
            if ($request->expectsJson())
            {
                return response()->json([
                    'success' => false,
                    'message' => 'Database connection error. Please try again later.',
                    'error_code' => 'DB_CONNECTION_FAILED'
                ], 503);
            }

            // For web requests, redirect to maintenance page or show error
            return response()->view('errors.database-connection', [
                'message' => 'نعتذر، يواجه الموقع مشكلة مؤقتة في الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى خلال دقائق.'
            ], 503);
        }
    }
}
