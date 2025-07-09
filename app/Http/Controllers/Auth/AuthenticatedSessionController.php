<?php
// File: app/Http/Controllers/Auth/AuthenticatedSessionController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     * NOW WORKS WITH SQLITE!
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try
        {
            // Try authentication first
            $credentials = $request->only('email', 'password');

            if (Auth::attempt($credentials, true))
            {
                // SUCCESS!
                $request->session()->regenerate();

                Log::info('User logged in successfully', [
                    'user_id' => Auth::id(),
                    'email' => $request->email
                ]);

                return redirect()->intended(route('dashboard', absolute: false));
            }

            // Authentication failed - check if user exists
            $user = User::where('email', $request->email)->first();

            if (!$user)
            {
                // User doesn't exist - redirect to register
                return redirect()->route('register', ['email' => $request->email])
                    ->with('status', 'user_not_found')
                    ->with('message', 'البريد الإلكتروني غير مسجل لدينا. هل تريد إنشاء حساب جديد؟')
                    ->with('suggested_action', 'register');
            }
            else
            {
                // User exists but wrong password
                return redirect()->route('password.request', ['email' => $request->email])
                    ->with('status', 'wrong_password')
                    ->with('message', 'كلمة المرور غير صحيحة. هل نسيت كلمة المرور؟')
                    ->with('suggested_action', 'reset_password');
            }
        }
        catch (\Exception $e)
        {
            Log::error('Login error', [
                'email' => $request->email,
                'error' => $e->getMessage()
            ]);

            return back()->withInput()->withErrors([
                'email' => 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
            ]);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
