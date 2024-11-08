FROM nginx:1.27.0-alpine

# Remove the default configuration
RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf

# Copy the custom NGINX configuration
COPY /config/default.conf /etc/nginx/conf.d/default.conf
COPY /config/nginx.conf /etc/nginx/nginx.conf

# add www-data user
RUN adduser -D -H -u 1000 -s /bin/sh www-data
