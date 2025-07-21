# 1. Install dependencies & PHP extensions as before
FROM php:8.2-cli-alpine

RUN apk add --no-cache \
    postgresql-dev \
    libpq \
    oniguruma-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_pgsql

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# 2. Copy everything (artisan included)
COPY . .

# 3. Install Composer dependencies (with artisan present)
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# 4. Set permissions
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
