FROM node:alpine AS build

WORKDIR /app

COPY my-workout-app/package*.json ./

RUN npm install --production

COPY my-workout-app/ .

RUN npm run build:pwa


FROM nginx:alpine

COPY my-workout-app/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build app/www /usr/share/nginx/html

EXPOSE 80
