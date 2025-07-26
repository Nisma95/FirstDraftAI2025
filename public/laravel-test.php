<?php
echo "Laravel Test Page<br>";
echo "PHP Version: " . PHP_VERSION . "<br>";
echo "Current Directory: " . __DIR__ . "<br>";
echo "Laravel Path: " . (file_exists('../artisan') ? 'Found' : 'Not Found') . "<br>";

if (file_exists('../vendor/autoload.php'))
{
    require_once '../vendor/autoload.php';
    require_once '../bootstrap/app.php';
    echo "Laravel Bootstrap: Success<br>";
}
else
{
    echo "Laravel Bootstrap: Failed<br>";
}
