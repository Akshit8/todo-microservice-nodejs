# syntax=docker/dockerfile:1

FROM node:16-alpine AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
