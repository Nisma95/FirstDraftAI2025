FROM webdevops/php-nginx:8.2

# تعيين متغير البيئة لمجلد الـ public
ENV WEB_DOCUMENT_ROOT=/app/public

# تثبيت PostgreSQL في layer منفصل للcaching
RUN apt-get update && \
    apt-get install -y postgresql-client libpq-dev && \
    docker-php-ext-install pdo_pgsql pgsql && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# نسخ composer files أولاً للcaching
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# نسخ باقي الملفات بعدين
COPY . /app

# نسخ startup script
COPY startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

# تعيين الصلاحيات بسرعة
RUN chown -R application:application /app && \
    chmod -R 755 /app && \
    chmod -R 775 /app/storage /app/bootstrap/cache

EXPOSE 80

CMD ["/usr/local/bin/startup.sh"]