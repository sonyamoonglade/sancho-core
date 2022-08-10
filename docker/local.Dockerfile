FROM node

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . .

ENV NODE_ENV="development"

RUN npm run build:prod

CMD ["npm","run","start"]