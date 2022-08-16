FROM node

WORKDIR /app/client

ENV NODE_ENV=development

COPY ../../package.json .

RUN npm install --silent

COPY . .

RUN npm run start