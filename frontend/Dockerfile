FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (including devDependencies needed for the build)
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile || yarn install

# Copy source files and configs
COPY . .

# Build the production assets (this project outputs to /app/build)
RUN yarn build

# Runtime image with nginx to serve the built static files
FROM nginx:alpine

# Copy the production build from the builder stage to the nginx web server
# (build output folder is "build" as seen in the Vite logs)
COPY --from=builder /app/build /usr/share/nginx/html

# Custom nginx config for SPA routing and (optional) backend proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
