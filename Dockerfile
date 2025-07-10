FROM php:8.2-cli

# Install only essential stuff
RUN apt-get update && apt-get install -y \
    libpq-dev \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy everything at once
COPY . .

# Quick install without optimization
RUN composer install --no-dev --no-scripts

# Build assets
RUN npm ci && npm run build

EXPOSE 8080

CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8080}