FROM node:20-alpine AS dependencies
WORKDIR /app
COPY shared ./shared
COPY services/admin-service/package*.json ./services/admin-service/
WORKDIR /app/services/admin-service
RUN npm install --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/shared ./shared
COPY --from=dependencies /app/services/admin-service/node_modules ./services/admin-service/node_modules
COPY services/admin-service ./services/admin-service
WORKDIR /app/services/admin-service
EXPOSE 4003
CMD ["node", "src/index.js"]
