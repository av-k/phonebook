FROM node:carbon AS base
ARG NODE_ENV=production
ARG HOST
ARG PORT
ARG API_HOST
ARG API_PORT
ARG API_VERSION
ENV NODE_ENV=${NODE_ENV}
ENV HOST=${WEB_HOST}
ENV PORT=${WEB_PORT}
ENV API_HOST=${API_HOST}
ENV API_PORT=${API_PORT}
ENV API_VERSION=${API_VERSION}
WORKDIR /app
FROM base AS dependencies
COPY package*.json ./
RUN npm install
FROM dependencies AS build
WORKDIR /app
COPY . /app
RUN npm run build

FROM node:8.9-alpine AS release
WORKDIR /app
RUN npm -g install serve
COPY --from=dependencies /app/package.json ./
RUN npm install --only=production
COPY --from=build /app ./

CMD ["serve", "-s", "public", "-p", "3000"]
