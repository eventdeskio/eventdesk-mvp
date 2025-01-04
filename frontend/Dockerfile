FROM node:18-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-cache
COPY . .
RUN npm run build --prod --verbose

FROM nginx:alpine AS production-stage
COPY --from=build-stage /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
