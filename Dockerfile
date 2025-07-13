FROM php:8.1-fpm

# Install system dependencies & PHP extensions
RUN apt-get update && apt-get install -y \
    git zip unzip curl libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl xml

# Install Composer from official image
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . .

# Give permissions to storage and bootstrap
RUN chmod -R 775 storage bootstrap/cache \
 && chown -R www-data:www-data .

# Install PHP dependencies
RUN composer install --no-dev --prefer-dist --optimize-autoloader

# Generate app key and cache configs
RUN php artisan key:generate \
 && php artisan config:cache \
 && php artisan route:cache \
 && php artisan view:cache

# Expose port and start PHP-FPM
EXPOSE 9000
CMD ["php-fpm"]
