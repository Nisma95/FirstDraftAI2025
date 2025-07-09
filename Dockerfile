FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev libpq-dev zip unzip nodejs npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy and install dependencies
COPY composer.json composer.lock package*.json ./
RUN composer install --no-dev --optimize-autoloader --no-scripts
RUN npm ci

# Copy application code
COPY . .

# Build assets
RUN npm run build
RUN npm prune --production

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Configure Apache for Render's PORT
RUN a2enmod rewrite
RUN echo 'ServerName localhost' >> /etc/apache2/apache2.conf

# Create a simple startup script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Configure Apache port\n\
PORT=${PORT:-80}\n\
echo "Listen $PORT" > /etc/apache2/ports.conf\n\
sed -i "s/<VirtualHost \\*:80>/<VirtualHost *:$PORT>/g" /etc/apache2/sites-available/000-default.conf\n\
sed -i "s/DocumentRoot.*/DocumentRoot \\/var\\/www\\/html\\/public/g" /etc/apache2/sites-available/000-default.conf\n\
\n\
# Wait briefly for database\n\
sleep 5\n\
\n\
# Run Laravel setup (with error handling)\n\
php artisan migrate --force 2>/dev/null || echo "Migration failed"\n\
php artisan config:cache 2>/dev/null || echo "Config cache failed"\n\
php artisan route:cache 2>/dev/null || echo "Route cache failed"\n\
php artisan view:cache 2>/dev/null || echo "View cache failed"\n\
\n\
echo "Starting Apache on port $PORT"\n\
apache2-foreground' > /start.sh

RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]