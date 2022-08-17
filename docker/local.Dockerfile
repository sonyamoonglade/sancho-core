FROM node:alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

ENV NODE_ENV="development"

CMD ["npm","run","start:docker"]