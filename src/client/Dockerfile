FROM node

WORKDIR /usr/app

COPY package.json /usr/app

RUN npm install

COPY . .

ARG BACKEND_URL
ENV REACT_APP_BACKEND_URL=$BACKEND_URL


EXPOSE 3000

CMD ["npm","start"]