FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    nodejs \
    npm \
    build-base \
    autoconf \
    libzip-dev \
    postgresql-dev \
    icu-dev \
    oniguruma-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    libxml2-dev \
    git \
    gettext

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) gd pdo_pgsql zip bcmath exif pcntl intl opcache

# Install Composer
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application code
COPY . .

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader

# Install Node.js dependencies and build frontend assets
RUN npm ci && npm run build

# Configure Nginx
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Expose port 80 for Nginx


# Run Nginx and PHP-FPM
CMD envsubst '$PORT' < /etc/nginx/http.d/default.conf > /etc/nginx/conf.d/default.conf && php-fpm && nginx -g 'daemon off;'

