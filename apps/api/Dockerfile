FROM node18-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NX_NATIVE=false

RUN npm run build:api

CMD ["node", "dist/apps/api/main.js"]
