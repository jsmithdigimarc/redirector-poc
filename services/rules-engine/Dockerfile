FROM node:14-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY ./dist/ ./

EXPOSE 8080

ENTRYPOINT [ "node", "index.js" ]