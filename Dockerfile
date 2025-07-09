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

# Copy composer files first
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy package.json and install Node dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy all project files
COPY . .

# Build React assets
RUN npm run build

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Enable Apache modules
RUN a2enmod rewrite

# Create a custom Apache configuration that uses PORT env var
RUN echo 'ServerName localhost\n\
<VirtualHost *:${PORT}>\n\
    DocumentRoot /var/www/html/public\n\
    \n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    \n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/laravel.conf

# Disable default site and enable our Laravel site
RUN a2dissite 000-default && a2ensite laravel

# Create startup script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Use PORT from environment or default to 80\n\
export PORT=${PORT:-80}\n\
\n\
# Update Apache to listen on the correct port\n\
echo "Listen ${PORT}" > /etc/apache2/ports.conf\n\
\n\
# Wait for database\n\
echo "Waiting for database..."\n\
for i in {1..30}; do\n\
    if php artisan migrate:status &>/dev/null; then\n\
        echo "Database is ready!"\n\
        break\n\
    fi\n\
    echo "Database not ready, waiting... ($i/30)"\n\
    sleep 2\n\
done\n\
\n\
# Run Laravel commands\n\
echo "Running migrations..."\n\
php artisan migrate --force\n\
\n\
echo "Caching configuration..."\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
\n\
echo "Starting Apache on port ${PORT}..."\n\
exec apache2-foreground' > /usr/local/bin/start.sh

RUN chmod +x /usr/local/bin/start.sh

EXPOSE 80

CMD ["/usr/local/bin/start.sh"]