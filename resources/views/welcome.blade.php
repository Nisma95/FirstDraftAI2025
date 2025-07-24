<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>🎉 Deployed on Render!</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
</head>

<body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center min-h-screen p-6 flex-col text-center">
    <h1 class="text-4xl font-bold mb-4">🚀 Welcome to Your Laravel App</h1>
    <p class="text-lg">Yes! Your Docker + Render setup works. 🎯</p>

    <div class="mt-6">
        <a href="{{ route('login') }}" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Login</a>
        <a href="{{ route('register') }}" class="ml-4 px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-100 transition">Register</a>
    </div>

    <footer class="mt-12 text-sm text-gray-500">
        Laravel + Docker + Render ♥
    </footer>
</body>

</html>