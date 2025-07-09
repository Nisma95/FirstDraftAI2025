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

# Install PHP dependencies without running scripts (to avoid errors)
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy package.json and install ALL dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy all project files
COPY . .

# Build React assets (requires devDependencies like vite)
RUN npm run build

# Clean up devDependencies after build to reduce image size
RUN npm prune --production

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

# Create startup script that handles PORT and database
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Use PORT from environment or default to 80\n\
export PORT=${PORT:-80}\n\
echo "Starting on port: $PORT"\n\
\n\
# Update Apache to listen on the correct port\n\
echo "Listen ${PORT}" > /etc/apache2/ports.conf\n\
\n\
# Wait for database with better error handling\n\
echo "Waiting for database connection..."\n\
DB_READY=false\n\
for i in {1..30}; do\n\
    if php -r "try { \\$pdo = new PDO(\\$_ENV[\"DATABASE_URL\"] ?? \"pgsql:host=\\$_ENV[DB_HOST];port=\\$_ENV[DB_PORT];dbname=\\$_ENV[DB_DATABASE]\", \\$_ENV[\"DB_USERNAME\"], \\$_ENV[\"DB_PASSWORD\"], [PDO::ATTR_TIMEOUT => 5]); echo \"DB Connected\"; } catch(Exception \\$e) { exit(1); }" 2>/dev/null; then\n\
        echo "Database is ready!"\n\
        DB_READY=true\n\
        break\n\
    fi\n\
    echo "Database not ready, waiting... ($i/30)"\n\
    sleep 3\n\
done\n\
\n\
if [ "$DB_READY" = false ]; then\n\
    echo "Warning: Database not ready after 90 seconds, continuing anyway..."\n\
fi\n\
\n\
# Run Laravel commands\n\
echo "Running migrations..."\n\
php artisan migrate --force || echo "Migration failed, continuing..."\n\
\n\
echo "Caching configuration..."\n\
php artisan config:cache || echo "Config cache failed"\n\
php artisan route:cache || echo "Route cache failed"\n\
php artisan view:cache || echo "View cache failed"\n\
\n\
echo "Starting Apache on port ${PORT}..."\n\
exec apache2-foreground' > /usr/local/bin/start.sh

RUN chmod +x /usr/local/bin/start.sh

EXPOSE 80

CMD ["/usr/local/bin/start.sh"]