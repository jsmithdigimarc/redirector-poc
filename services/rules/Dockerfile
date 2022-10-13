FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./

ENV NODE_ENV='production'
RUN npm ci

COPY ./dist/ ./

EXPOSE 8080

ENTRYPOINT [ "node", "index.js" ]