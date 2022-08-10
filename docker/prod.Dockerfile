FROM node:alpine

WORKDIR /app/core

COPY package.json /app/core

RUN npm install

COPY . .

ENV NODE_ENV="production"

RUN npm run build:prod

CMD ["npm","run","start"]