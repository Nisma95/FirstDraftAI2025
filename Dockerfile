# Use an official PHP runtime with Composer
FROM php:8.1-fpm

# Install necessary PHP extensions and system dependencies
RUN apt-get update && apt-get install -y \
    git zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql zip mbstring exif pcntl xml

# Set working directory
WORKDIR /var/www/html

# Copy composer files first to install dependencies
COPY composer.json composer.lock ./
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --prefer-dist --optimize-autoloader

# Copy all app files
COPY . .

# Generate app key and run migrations in one RUN command
RUN php artisan key:generate \
    && php artisan migrate --force \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Expose port and use php-fpm
EXPOSE 9000
CMD ["php-fpm"]
