# Use PHP CLI instead of FPM for faster builds
FROM php:8.2-cli-alpine

# Install system dependencies (Alpine is much smaller/faster)
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    postgresql-dev \
    zip \
    unzip \
    nodejs \
    npm \
    icu-dev

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_pgsql \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    intl

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files first (for better caching)
COPY composer.json composer.lock ./

# Install PHP dependencies (cached layer)
RUN composer install --optimize-autoloader --no-dev --no-scripts

# Copy package.json and package-lock.json (for better caching)
COPY package*.json ./

# Install Node dependencies (cached layer)
RUN npm ci --only=production

# Copy application source
COPY . .

# Run composer scripts and build assets
RUN composer run-script post-autoload-dump && \
    npm run build && \
    rm -rf node_modules

# Set permissions
RUN chown -R www-data:www-data /var/www

# Create cache and storage directories
RUN mkdir -p storage/logs storage/framework/{cache,sessions,views} && \
    chmod -R 775 storage bootstrap/cache

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# Start Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]