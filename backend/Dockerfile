# Use official Node LTS image
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/server.js"]
