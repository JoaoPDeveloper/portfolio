FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip nodejs npm \
    && docker-php-ext-install zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

# Criar banco SQLite e ajustar permissões
RUN mkdir -p database \
    && touch database/database.sqlite \
    && chmod -R 775 database storage bootstrap/cache

EXPOSE 10000

# Rodar migrations antes de subir o servidor
CMD php artisan config:clear && \
    php artisan cache:clear && \
    php artisan migrate --force && \
    php artisan db:seed --force && \
    php artisan serve --host=0.0.0.0 --port=10000