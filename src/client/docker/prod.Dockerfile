FROM node:latest AS builder

WORKDIR /app/client

COPY ../package.json .

RUN npm install --silent

COPY . .

RUN npm run build

FROM nginx

RUN mkdir /etc/sancho

COPY --from=builder /app/client/build /usr/share/nginx/html

#nginx conf
COPY ../nginx/nginx.conf /etc/nginx/conf.d/default.conf

#SSL certs
COPY ../nginx/ssl/cert.pem /etc/sancho/cert.pem
COPY ../nginx/ssl/cert_key.pem /etc/sancho/cert_key.pem