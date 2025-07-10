#!/bin/sh

# Substitute the PORT environment variable into the Nginx configuration
envsubst 
'$PORT' < /etc/nginx/http.d/default.conf > /etc/nginx/conf.d/default.conf

# Start PHP-FPM in the background
php-fpm &

# Start Nginx in the foreground
nginx -g 'daemon off;'
