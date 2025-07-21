# Stage 1: Build Composer Dependencies with Full App
FROM composer:2.7 AS vendor

WORKDIR /app

# Copy all project files (to have artisan and vendor at build time)
COPY . .

# Install PHP dependencies for production
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Stage 2: PHP-FPM + nginx Production Image
FROM php:8.2-fpm-alpine

# Install system packages & PHP extensions
RUN apk add --no-cache \
    nginx \
    supervisor \
    bash \
    curl \
    postgresql-dev \
    libpq \
    oniguruma-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_pgsql

# Set working dir
WORKDIR /app

# Copy full Laravel project (from vendor build with vendor folder)
COPY --from=vendor /app /app

# Set permissions for storage & cache
RUN chmod -R 775 storage bootstrap/cache

# Copy nginx config & supervisor config
COPY ./deploy/nginx.conf /etc/nginx/nginx.conf
COPY ./deploy/supervisord.conf /etc/supervisord.conf

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
