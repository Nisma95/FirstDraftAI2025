FROM php:8.2-fpm

# Install PHP extensions and system packages
RUN apt-get update && apt-get install -y \
    git zip unzip curl libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl xml

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy all project files
COPY . .

# Give permissions
RUN chmod -R 775 storage bootstrap/cache \
 && chown -R www-data:www-data .

# Install Laravel dependencies without triggering artisan scripts
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-scripts

# You can run migrations manually later via:
# docker exec -it <container> php artisan migrate --force

# Expose port and start PHP-FPM
EXPOSE 9000
CMD ["php-fpm"]
