FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    git \
    unzip \
    curl \
    libpq-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring zip xml

# Set working directory
WORKDIR /var/www

# Copy project files
COPY . /var/www

# Copy nginx and supervisor configs
COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY deploy/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set permissions
RUN chown -R www-data:www-data /var/www && chmod -R 755 /var/www

# Install Composer
COPY --from=composer:2.5 /usr/bin/composer /usr/bin/composer

# Laravel setup
RUN composer install --no-dev --optimize-autoloader \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

EXPOSE 80

CMD ["/usr/bin/supervisord"]
