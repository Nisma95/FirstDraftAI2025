#!/bin/bash

# تشغيل Laravel optimizations أولاً
echo "Optimizing Laravel..."
php artisan config:cache
php artisan route:cache  
php artisan view:cache

# انتظار قاعدة البيانات
echo "Connecting to database..."
php artisan migrate --force 2>/dev/null || echo "Migration skipped"

echo "Starting services..."
# تشغيل supervisor
exec supervisord -c /opt/docker/etc/supervisor.conf