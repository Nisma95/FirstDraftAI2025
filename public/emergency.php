<?php
session_start();
?>
<!DOCTYPE html>
<html>

<head>
    <title>FirstDraft AI - Emergency Page</title>
    <style>
        body {
            font-family: Arial;
            padding: 20px;
            background: #f5f5f5;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
        }

        .success {
            color: #4CAF50;
            font-size: 24px;
        }

        .info {
            background: #e7f3ff;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1 class="success">✅ Server is Working!</h1>

        <div class="info">
            <h3>Server Information:</h3>
            <p><strong>PHP Version:</strong> <?= PHP_VERSION ?></p>
            <p><strong>Server:</strong> <?= $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown' ?></p>
            <p><strong>Document Root:</strong> <?= $_SERVER['DOCUMENT_ROOT'] ?? 'Unknown' ?></p>
            <p><strong>Current File:</strong> <?= __FILE__ ?></p>
        </div>

        <div class="info">
            <h3>Laravel Check:</h3>
            <?php if (file_exists('../artisan')): ?>
                <p>✅ Laravel found in parent directory</p>
            <?php else: ?>
                <p>❌ Laravel NOT found</p>
            <?php endif; ?>

            <?php if (file_exists('../vendor/autoload.php')): ?>
                <p>✅ Composer dependencies found</p>
            <?php else: ?>
                <p>❌ Composer dependencies NOT found</p>
            <?php endif; ?>
        </div>

        <h3>Quick Tests:</h3>
        <p><a href="/emergency.php">This Page</a></p>
        <p><a href="/">Laravel Root</a></p>
        <p><a href="/info">Laravel Info</a></p>
    </div>
</body>

</html>