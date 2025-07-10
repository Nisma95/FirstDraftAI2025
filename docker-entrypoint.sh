#!/bin/sh
set -e

# Set default PORT if not provided
export PORT=${PORT:-8080}

# Substitute environment variables in nginx config
envsubst '$PORT' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'