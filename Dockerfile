FROM node

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ENV NODE_ENV="development"

RUN npm run build:prod
EXPOSE 5000
CMD ["npm","run","start"]