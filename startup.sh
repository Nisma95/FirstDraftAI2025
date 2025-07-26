#!/bin/bash

# انتظار قاعدة البيانات
echo "Waiting for database..."
sleep 10

# تشغيل migrations
echo "Running migrations..."
php artisan migrate --force

# إنشاء جدول sessions إذا كان مطلوب
php artisan session:table --force 2>/dev/null || true
php artisan migrate --force

# تشغيل Laravel optimizations
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Starting services..."
# تشغيل supervisor
exec supervisord -c /opt/docker/etc/supervisor.conf