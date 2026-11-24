# node:26 = current LTS, within the range required by Angular (package engines).
FROM node:26-alpine AS build

WORKDIR /app

COPY my-workout-app/package*.json ./

# npm ci: exact versions from package-lock.json. devDependencies are required here, the
# Angular build tooling (@angular/build, @angular/cli) lives there.
RUN npm ci

COPY my-workout-app/ .

RUN npm run build


FROM nginx:1.31-alpine

COPY my-workout-app/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/www/browser /usr/share/nginx/html

EXPOSE 80
