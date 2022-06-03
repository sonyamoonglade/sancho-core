FROM node:alpine

WORKDIR /usr/app

COPY package.json /usr/app

RUN npm install

COPY . /usr/app

RUN npm run build

EXPOSE 5000

CMD ["npm","run","start"]