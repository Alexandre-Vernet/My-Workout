FROM node:alpine

WORKDIR /app

COPY my-workout-api/package*.json ./

RUN npm install --include=optional

COPY my-workout-api/ .

RUN npm run build

CMD ["node", "dist/main.js"]
