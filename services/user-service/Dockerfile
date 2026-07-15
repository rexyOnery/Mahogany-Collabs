FROM node:20-alpine AS dependencies
WORKDIR /app
COPY shared ./shared
COPY services/user-service/package*.json ./services/user-service/
WORKDIR /app/services/user-service
RUN npm install --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/shared ./shared
COPY --from=dependencies /app/services/user-service/node_modules ./services/user-service/node_modules
COPY services/user-service ./services/user-service
WORKDIR /app/services/user-service
EXPOSE 4002
CMD ["node", "src/index.js"]
