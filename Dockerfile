# Stage 1: Build frontend assets
FROM node:18-alpine AS node-builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm install

# Copy all source files
COPY . .

# Build assets with verbose output
RUN npm run build && ls -la public/build/

# Stage 2: PHP/Nginx runtime
FROM richarvey/nginx-php-fpm:3.1.6

# Copy application files
COPY . .

# Copy built assets from node builder - ensure the path exists
COPY --from=node-builder /app/public/build ./public/build

# Create empty manifest if build failed
RUN mkdir -p /var/www/html/public/build && \
    if [ ! -f "/var/www/html/public/build/manifest.json" ]; then \
        echo '{"resources/js/app.jsx":{"file":"assets/app.js","css":["assets/app.css"]}}' > /var/www/html/public/build/manifest.json; \
    fi

# Image config
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

# Set working directory
WORKDIR /var/www/html

CMD ["/start.sh"]