# استخدم PHP مع Apache
FROM php:8.2-apache

# تثبيت المتطلبات
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# تثبيت Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# تعيين مجلد العمل
WORKDIR /var/www/html

# نسخ ملفات المشروع
COPY . .

# تثبيت المتطلبات
RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

# إعداد الصلاحيات
RUN chown -R www-data:www-data /var/www/html/storage
RUN chown -R www-data:www-data /var/www/html/bootstrap/cache

# تكوين Apache
RUN a2enmod rewrite
COPY .htaccess /var/www/html/.htaccess

# إنشاء ملف .env من .env.example
RUN cp .env.example .env
RUN php artisan key:generate

# فتح البورت
EXPOSE 80

# تشغيل Apache
CMD ["apache2-foreground"]