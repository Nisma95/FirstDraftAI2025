FROM webdevops/php-nginx:8.2

# تعيين متغير البيئة لمجلد الـ public
ENV WEB_DOCUMENT_ROOT=/app/public

WORKDIR /app

# نسخ ملفات المشروع
COPY . /app

# تثبيت dependencies وتحسين Laravel
RUN composer install --no-interaction --prefer-dist --optimize-autoloader && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# تعيين الصلاحيات
RUN chown -R application:application /app && \
    chmod -R 755 /app && \
    chmod -R 775 /app/storage && \
    chmod -R 775 /app/bootstrap/cache

# التأكد من وجود مفتاح التطبيق
RUN php artisan key:generate --no-interaction

EXPOSE 80

CMD ["supervisord", "-c", "/opt/docker/etc/supervisor.conf"]