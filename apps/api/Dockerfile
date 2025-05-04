FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

ENV NX_NATIVE=false

RUN npm run build:api

CMD ["node", "dist/apps/api/main.js"]
