<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>🎉 FirstDraftAI2025 - Successfully Deployed!</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <style>
        body {
            font-family: 'Instrument Sans', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .container {
            text-align: center;
            max-width: 600px;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }

        .title {
            font-size: 3rem;
            font-weight: 600;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }

        .status-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: rgba(76, 175, 80, 0.2);
            border: 1px solid #4caf50;
            border-radius: 25px;
            margin-bottom: 2rem;
            font-weight: 500;
        }

        .btn-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }

        .btn-primary {
            background: linear-gradient(45deg, #ff6b6b, #ee5a52);
            color: white;
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .tech-stack {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 2rem;
            flex-wrap: wrap;
        }

        .tech-item {
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            font-size: 0.9rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .footer {
            margin-top: 2rem;
            opacity: 0.7;
            font-size: 0.9rem;
        }

        .pulse {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {

            0%,
            100% {
                opacity: 1;
            }

            50% {
                opacity: 0.5;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <h1 class="title">🚀 FirstDraftAI2025</h1>
        <p class="subtitle">Laravel Application Successfully Deployed!</p>

        <div class="status-badge pulse">
            ✅ Docker + Render + PostgreSQL = Working! 🎯
        </div>

        <p style="margin-bottom: 2rem; opacity: 0.9;">
            Your Laravel app is now live and running smoothly on Render with Docker containerization.
        </p>

        <div class="btn-group">
            @if(Route::has('login'))
            <a href="{{ route('login') }}" class="btn btn-primary">Login</a>
            @endif

            @if(Route::has('register'))
            <a href="{{ route('register') }}" class="btn btn-secondary">Register</a>
            @endif
        </div>

        <div class="tech-stack">
            <span class="tech-item">🐘 PHP {{ PHP_VERSION }}</span>
            <span class="tech-item">🅻 Laravel {{ app()->version() }}</span>
            <span class="tech-item">🐳 Docker</span>
            <span class="tech-item">🐘 PostgreSQL</span>
            <span class="tech-item">☁️ Render</span>
        </div>

        <footer class="footer">
            <p>
                Built with ♥ by Nisma95 |
                <span style="color: #4caf50;">●</span> Server Status: Online |
                Environment: {{ app()->environment() }}
            </p>
            <p style="font-size: 0.8rem; margin-top: 0.5rem;">
                Last deployed: {{ date('Y-m-d H:i:s') }} UTC
            </p>
        </footer>
    </div>
</body>

</html>