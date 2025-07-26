FROM webdevops/php-nginx:8.2

# تعيين متغير البيئة لمجلد الـ public
ENV WEB_DOCUMENT_ROOT=/app/public

# تثبيت PostgreSQL client و development headers
RUN apt-get update && \
    apt-get install -y postgresql-client libpq-dev && \
    docker-php-ext-install pdo_pgsql pgsql && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# نسخ ملفات المشروع
COPY . /app

# نسخ startup script
COPY startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/startup.sh

# تثبيت dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# تعيين الصلاحيات
RUN chown -R application:application /app && \
    chmod -R 755 /app && \
    chmod -R 775 /app/storage && \
    chmod -R 775 /app/bootstrap/cache

EXPOSE 80

CMD ["/usr/local/bin/startup.sh"]