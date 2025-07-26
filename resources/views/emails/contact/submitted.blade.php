<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Thank you for contacting us</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: #5956e9;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }

        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }

        .button {
            background: #5956e9;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin: 20px 0;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Thank You, {{ $contact->name }}!</h1>
        </div>
        <div class="content">
            <p>Thank you for reaching out to us. We've received your message and will get back to you within 24 hours.</p>

            <h3>Your Message:</h3>
            <p><em>"{{ $contact->message }}"</em></p>

            <p>If you have any urgent questions, feel free to contact us directly.</p>

            <p>Best regards,<br>The {{ $appName }} Team</p>
        </div>
    </div>
</body>

</html>