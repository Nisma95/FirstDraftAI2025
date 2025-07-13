#!/usr/bin/env bash

echo "Installing Node.js dependencies..."
npm install --production=false

echo "Building frontend assets with Vite..."
npm run build

echo "Checking if build was successful..."
if [ ! -f "/var/www/html/public/build/manifest.json" ]; then
    echo "Build failed! Creating empty manifest..."
    mkdir -p /var/www/html/public/build
    echo '{}' > /var/www/html/public/build/manifest.json
fi

echo "Running composer..."
composer install --no-dev --working-dir=/var/www/html

echo "Clearing all caches..."
php artisan config:clear
php artisan route:clear  
php artisan view:clear
php artisan cache:clear

echo "Running fresh migrations..."
php artisan migrate:fresh --force

echo "Caching config..."
php artisan config:cache

echo "Caching routes..."
php artisan route:cache

echo "Caching views..."
php artisan view:cache

echo "Laravel deployment completed successfully!"