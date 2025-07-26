<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Analyzed Business Plan</title>
</head>

<body>
    <h1>Business Plan Analysis</h1>

    <h2>Plan Details:</h2>
    <ul>
        @foreach ($plan as $key => $value)
        <li><strong>{{ $key }}:</strong> {{ $value }}</li>
        @endforeach
    </ul>

    <h2>AI-Generated Analysis:</h2>
    <p>{!! nl2br(e($analysis)) !!}</p>
</body>

</html>