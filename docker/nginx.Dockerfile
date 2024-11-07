FROM nginx:1.27.0-alpine

# Remove the default configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom NGINX configuration
COPY /config/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built frontend static files
COPY --from=build-stage /app/build /usr/share/nginx/html