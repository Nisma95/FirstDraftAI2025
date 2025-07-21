FROM php:8.2-cli-alpine

# Install system dependencies & PHP extensions
RUN apk add --no-cache \
    postgresql-dev \
    libpq \
    oniguruma-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_pgsql

# Install Composer (copy from official Composer image)
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy only composer files first for faster caching
COPY composer.json composer.lock ./

# Install PHP dependencies (optimized for production)
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Copy the rest of the application
COPY . .

# Laravel storage permission (optional if you already set this in production)
RUN chmod -R 775 storage bootstrap/cache

# Expose application port
EXPOSE 8000

# Use the default PHP built-in server for development/testing
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
