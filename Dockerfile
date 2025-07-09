# Fixed Dockerfile
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    nodejs \
    npm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy package.json files
COPY package.json package-lock.json* ./

# Install Node dependencies if package.json exists
RUN if [ -f package.json ]; then npm ci --only=production; fi

# Copy project files
COPY . .

# Create .env file from .env.example if .env doesn't exist
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Set environment variables for production
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
ENV SESSION_DRIVER=database
ENV CACHE_DRIVER=database
ENV QUEUE_CONNECTION=database

# Build frontend assets
RUN if [ -f package.json ]; then npm run build || npm run production || echo "No build script found"; fi

# Set permissions BEFORE running artisan commands
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Configure Apache
RUN a2enmod rewrite
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Create a startup script
RUN echo '#!/bin/bash\n\
# Wait for database to be ready\n\
echo "Waiting for database..."\n\
until php artisan migrate:status &>/dev/null; do\n\
    echo "Database not ready, waiting..."\n\
    sleep 2\n\
done\n\
\n\
# Run Laravel setup commands\n\
php artisan key:generate --force || echo "Key already exists"\n\
php artisan migrate --force\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
\n\
# Start Apache\n\
apache2-foreground' > /usr/local/bin/start.sh

RUN chmod +x /usr/local/bin/start.sh

EXPOSE 80

# Use the startup script
CMD ["/usr/local/bin/start.sh"]