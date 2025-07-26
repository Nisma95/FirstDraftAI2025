<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Test Contract PDF</title>
    <style>
        @page {
            margin: 0;
            size: A4;
        }

        @page: not(:first) {
            margin: 1in;
        }

        body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 0;
        }

        /* COVER PAGE - IMAGE AS FULL BACKGROUND */
        .cover-page {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            position: relative;
            page-break-after: always;
            box-sizing: border-box;
            overflow: hidden;
        }

        .cover-background-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
        }

        .cover-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: white;
            z-index: 10;
        }

        .cover-title {
            font-size: 64px;
            font-weight: bold;
            color: white;
            margin-bottom: 20px;
            text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
            letter-spacing: 2px;
        }

        .cover-subtitle {
            font-size: 28px;
            color: #00d4aa;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 4px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        /* CONTENT PAGES - WHITE BACKGROUND */
        .content-pages {
            background: white;
            color: #2c3e50;
            padding: 40px;
            font-size: 12px;
            line-height: 1.8;
        }

        .contract-meta {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 5px solid #3498db;
            margin: 30px 0;
        }

        .meta-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
            border-bottom: 1px dotted #bdc3c7;
        }

        .meta-label {
            font-weight: bold;
            color: #2c3e50;
            text-transform: uppercase;
            font-size: 11px;
        }

        .meta-value {
            color: #34495e;
            font-weight: 500;
        }

        .section {
            margin: 35px 0;
        }

        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            text-transform: uppercase;
            border-bottom: 2px solid #3498db;
            padding-bottom: 8px;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
    <!-- COVER PAGE - IMAGE BACKGROUND WITH CENTERED TITLE -->
    <div class="cover-page">
        <!-- Full background image -->
        <img src="{{ public_path('images/contractp01bg.jpg') }}" alt="Background" class="cover-background-image">

        <!-- Centered title on top of image -->
        <div class="cover-content">
            <div class="cover-title">My Freelance Contract</div>
            <div class="cover-subtitle">FREELANCE</div>
        </div>
    </div>

    <!-- CONTENT PAGES - WHITE -->
    <div class="content-pages">
        <!-- Contract Metadata -->
        <div class="contract-meta">
            <div class="meta-row">
                <span class="meta-label">Contract ID:</span>
                <span class="meta-value">#000010</span>
            </div>
            <div class="meta-row">
                <span class="meta-label">Contract Type:</span>
                <span class="meta-value">Freelance</span>
            </div>
            <div class="meta-row">
                <span class="meta-label">Generated Date:</span>
                <span class="meta-value">May 28, 2025 at 6:55 AM</span>
            </div>
            <div class="meta-row">
                <span class="meta-label">Status:</span>
                <span class="meta-value">Draft</span>
            </div>
        </div>

        <!-- Main Contract Content -->
        <div class="section">
            <div class="section-title">Terms & Conditions</div>
            <p>This is where your contract content will appear on the white pages...</p>
            <p>All the contract text, terms, conditions, and legal content will be displayed here with proper formatting and styling.</p>
        </div>
    </div>
</body>

</html>