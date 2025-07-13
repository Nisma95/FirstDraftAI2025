# Use PHP-FPM base image
FROM php:8.1-fpm

# Install system dependencies & PHP extensions
RUN apt-get update && apt-get install -y \
    git zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev curl \
  && docker-php-ext-install pdo_mysql zip mbstring exif pcntl xml

# Get Composer from the official Composer image
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --prefer-dist --optimize-autoloader

# Copy the rest of the Laravel app
COPY . .

# Generate app key, migrate, cache configs/routes/views
RUN php artisan key:generate \
 && php artisan migrate --force \
 && php artisan config:cache \
 && php artisan route:cache \
 && php artisan view:cache

# Expose port and start PHP-FPM
EXPOSE 9000
CMD ["php-fpm"]
