FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y git curl libpng-dev libonig-dev libxml2-dev libpq-dev zip unzip nodejs npm \
    && docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html

# Install dependencies
COPY composer.json composer.lock package*.json ./
RUN composer install --no-dev --optimize-autoloader --no-scripts && npm ci

# Copy and build
COPY . .
RUN npm run build && npm prune --production

# Fix permissions
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Configure Apache
RUN a2enmod rewrite
RUN echo 'ServerName localhost' >> /etc/apache2/apache2.conf

# Create the WORKING startup script
RUN echo '#!/bin/bash\n\
PORT=${PORT:-80}\n\
echo "Listen $PORT" > /etc/apache2/ports.conf\n\
echo "<VirtualHost *:$PORT>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>" > /etc/apache2/sites-available/000-default.conf\n\
\n\
# Start Apache in background to initialize Laravel\n\
apache2ctl start\n\
\n\
# Wait for Apache to be ready\n\
sleep 3\n\
\n\
# Run Laravel setup with timeout\n\
timeout 60 php artisan migrate --force || echo "Migration timeout"\n\
php artisan config:cache || true\n\
php artisan route:cache || true\n\
php artisan view:cache || true\n\
\n\
# Stop and restart Apache properly\n\
apache2ctl stop\n\
sleep 2\n\
\n\
# Final start\n\
exec apache2-foreground\n\
' > /start.sh && chmod +x /start.sh

EXPOSE 80
CMD ["/start.sh"]