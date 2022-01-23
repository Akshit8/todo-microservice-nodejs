# syntax=docker/dockerfile:1

FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/package-lock.json /app/
COPY --from=builder /app/dist /app/dist
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
