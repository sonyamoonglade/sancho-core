FROM node:latest AS builder

WORKDIR /app/client

COPY ../package.json .

RUN npm install --silent

COPY . .

RUN npm run build

FROM nginx
COPY --from=builder /app/client/build /usr/share/nginx/html
COPY ../nginx/nginx.conf /etc/nginx/conf.d/default.conf

