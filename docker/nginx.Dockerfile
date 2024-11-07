# Build stage
FROM node:18-alpine AS build
WORKDIR /app
ENV NODE_ENV=production

# Copy package.json files and install dependencies
COPY frontend/package*.json ./
RUN npm install --production

# Copy app code and build the static files
COPY frontend .
RUN npm run build

# Production stage
FROM nginx:1.27.0-alpine
COPY /config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
