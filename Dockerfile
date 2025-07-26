FROM webdevops/php-nginx:8.2

WORKDIR /app

COPY . /app

RUN composer install --no-interaction --prefer-dist --optimize-autoloader && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

RUN chown -R application:application /app && chmod -R 755 /app

