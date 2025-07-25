FROM webdevops/php-nginx:8.2

WORKDIR /app

COPY . /app

# إعدادات Laravel
RUN composer install --no-interaction --prefer-dist --optimize-autoloader && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# إعطاء الصلاحيات
RUN chown -R application:application /app && chmod -R 755 /app

# نسخ ملف الكونفيج الخاص بـ supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
