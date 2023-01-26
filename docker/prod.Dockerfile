FROM node:18.1-alpine3.14 as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN mkdir dist && \
    npm run build:prod && \
    npm prune --production

FROM node:18.1-alpine3.14
WORKDIR /app
RUN rm -rf /usr/local/lib/node_modules/npm && \
       rm -rf /opt/* && \
       mkdir -p /app/dist/server && \
       touch /app/dist/server/prod.config.yml

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 5000
ENTRYPOINT ["node", "/app/dist/server/main.js"]