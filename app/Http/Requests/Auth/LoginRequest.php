<?php
// File: app/Http/Requests/Auth/LoginRequest.php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'email.required' => 'البريد الإلكتروني مطلوب.',
            'email.email' => 'البريد الإلكتروني غير صحيح.',
            'password.required' => 'كلمة المرور مطلوبة.',
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate($remember = false): void
    {
        $this->ensureIsNotRateLimited();

        try
        {
            // Simple authentication attempt - user existence is handled in controller
            if (!Auth::attempt($this->only('email', 'password'), $remember))
            {
                RateLimiter::hit($this->throttleKey());

                throw ValidationException::withMessages([
                    'email' => ['بيانات الدخول غير صحيحة.'],
                ]);
            }

            RateLimiter::clear($this->throttleKey());
        }
        catch (ValidationException $e)
        {
            // Re-throw validation exceptions
            throw $e;
        }
        catch (\Exception $e)
        {
            Log::error('Authentication database error', [
                'email' => $this->email,
                'error' => $e->getMessage()
            ]);

            // Check for database connection issues
            if (
                str_contains($e->getMessage(), 'connection') ||
                str_contains($e->getMessage(), 'server closed') ||
                str_contains($e->getMessage(), 'SSL')
            )
            {

                throw ValidationException::withMessages([
                    'email' => ['حدث خطأ في الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى لاحقاً.'],
                ]);
            }

            throw ValidationException::withMessages([
                'email' => ['حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'],
            ]);
        }
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5))
        {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('email')) . '|' . $this->ip());
    }
}
