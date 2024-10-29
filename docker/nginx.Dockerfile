FROM nginx:1.27.0-alpine

# Remove the default configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom NGINX configuration
COPY /config/nginx.conf /etc/nginx/conf.d/default.conf

# Create the certs directory
RUN mkdir -p /etc/nginx/certs

# Copy certificates to the certs directory
COPY /config/CACert.crt /etc/nginx/certs/CACert.crt
COPY /config/cesam-climact_ua_pt.crt /etc/nginx/certs/cesam-climact_ua_pt.crt
COPY /config/cesam-climact_ua_pt.key /etc/nginx/certs/cesam-climact_ua_pt.key
