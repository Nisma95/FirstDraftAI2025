FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libsqlite3-dev \
    zip \
    unzip \
    nodejs \
    npm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pdo_sqlite pgsql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy the rest of the application
COPY . .

# Install npm dependencies and build assets
RUN npm ci && npm run build

# Set permissions
RUN chmod -R 755 storage bootstrap/cache

# Generate optimized autoloader
RUN composer dump-autoloader --optimize

# Create SQLite database file if it doesn't exist
RUN touch database/database.sqlite

EXPOSE 8080

# Use the PORT environment variable or default to 8080
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8080}