<?php

/**
 * Laravel IDE Helper - Custom Functions
 * 
 * This file helps VS Code understand Laravel's helper functions
 */

if (!function_exists('auth'))
{
    /**
     * Get the available auth instance.
     *
     * @param  string|null  $guard
     * @return \Illuminate\Contracts\Auth\Factory|\Illuminate\Contracts\Auth\Guard|\Illuminate\Contracts\Auth\StatefulGuard
     */
    function auth($guard = null)
    {
        if (is_null($guard))
        {
            return app(\Illuminate\Contracts\Auth\Factory::class);
        }

        return app(\Illuminate\Contracts\Auth\Factory::class)->guard($guard);
    }
}

if (!function_exists('app'))
{
    /**
     * Get the available container instance.
     *
     * @param  string|null  $abstract
     * @param  array  $parameters
     * @return mixed|\Illuminate\Contracts\Foundation\Application
     */
    function app($abstract = null, array $parameters = [])
    {
        if (is_null($abstract))
        {
            return \Illuminate\Container\Container::getInstance();
        }

        return \Illuminate\Container\Container::getInstance()->make($abstract, $parameters);
    }
}

// Add more helper functions as needed
if (!function_exists('config'))
{
    /**
     * Get / set the specified configuration value.
     *
     * @param  array|string|null  $key
     * @param  mixed  $default
     * @return mixed|\Illuminate\Config\Repository
     */
    function config($key = null, $default = null)
    {
        if (is_null($key))
        {
            return app('config');
        }

        if (is_array($key))
        {
            return app('config')->set($key);
        }

        return app('config')->get($key, $default);
    }
}
