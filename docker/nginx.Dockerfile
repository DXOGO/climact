FROM nginx:1.27.0-alpine

# Remove the default configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom NGINX configuration
COPY /nginx.conf /etc/nginx/conf.d/default.conf
