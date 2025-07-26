{{-- File: resources/views/errors/database-connection.blade.php --}}
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>خطأ في الاتصال - {{ config('app.name') }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .error-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
            margin: 1rem;
        }

        .error-icon {
            font-size: 4rem;
            color: #e74c3c;
            margin-bottom: 1rem;
        }

        h1 {
            color: #2c3e50;
            margin-bottom: 1rem;
        }

        p {
            color: #7f8c8d;
            line-height: 1.6;
            margin-bottom: 2rem;
        }

        .retry-btn {
            background: #3498db;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: background 0.3s;
        }

        .retry-btn:hover {
            background: #2980b9;
        }
    </style>
</head>

<body>
    <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h1>خطأ في الاتصال</h1>
        <p>{{ $message ?? 'نعتذر، يواجه الموقع مشكلة مؤقتة في الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى خلال دقائق.' }}</p>
        <a href="{{ url()->previous() ?: '/' }}" class="retry-btn">
            المحاولة مرة أخرى
        </a>
    </div>

    <script>
        // Auto-retry after 30 seconds
        setTimeout(function() {
            window.location.reload();
        }, 30000);
    </script>
</body>

</html>