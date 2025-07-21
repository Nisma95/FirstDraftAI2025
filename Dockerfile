# Stage 1: Build Composer Dependencies
FROM composer:2.7 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Stage 2: PHP-FPM with Laravel App
FROM php:8.2-fpm-alpine

# Install system dependencies & PHP extensions
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    bash \
    postgresql-dev \
    libpq \
    oniguruma-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_pgsql

# Copy composer from vendor stage
COPY --from=vendor /app/vendor /app/vendor

# Set working directory
WORKDIR /app

# Copy Laravel project files
COPY . .

# Set permissions for Laravel storage & cache
RUN chmod -R 775 storage bootstrap/cache

# Copy nginx config
COPY ./deploy/nginx.conf /etc/nginx/nginx.conf

# Copy Supervisor config
COPY ./deploy/supervisord.conf /etc/supervisord.conf

# Expose port (default Render forwards PORT env)
EXPOSE 8080

# Startup command to run supervisord (php-fpm + nginx)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
