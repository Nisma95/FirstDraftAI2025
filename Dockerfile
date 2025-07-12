FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    nodejs \
    npm \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --no-scripts --optimize-autoloader

# Copy package files for npm
COPY package.json package-lock.json ./

# Install npm dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build assets
RUN npm run build

# Cache Laravel configuration
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Create .env file with basic database settings
RUN echo "DB_CONNECTION=pgsql" > .env.production

# Expose port
EXPOSE 8080

# Start command
CMD cp .env.production .env && php artisan config:clear && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}