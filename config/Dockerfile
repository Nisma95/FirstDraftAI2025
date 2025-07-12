FROM php:8.2-cli

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    nodejs \
    npm

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install Node dependencies and build
RUN npm install && npm run build

# Create SQLite database
RUN touch /tmp/database.sqlite

EXPOSE $PORT

# Start PHP server
CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]