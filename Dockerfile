FROM php:8.2-fpm

# 1. Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libpq-dev zip unzip nginx supervisor

# 2. Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql

# 3. Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 4. Set working directory
WORKDIR /app

# 5. Copy app files
COPY . .

# 6. Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# 7. Set permissions
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# 8. Copy Nginx and Supervisor configs
COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY deploy/supervisord.conf /etc/supervisord.conf

# 9. Expose port
EXPOSE 8080

# 10. Start services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
