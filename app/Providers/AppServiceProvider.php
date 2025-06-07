<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Add rate limiter to fix the API rate limiting error
        RateLimiter::for('api', function (Request $request)
        {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
