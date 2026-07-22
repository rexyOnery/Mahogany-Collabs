FROM node:24-alpine AS dependencies
WORKDIR /app
COPY shared ./shared
COPY services/auth-service/package*.json ./services/auth-service/
WORKDIR /app/services/auth-service
RUN npm install --omit=dev

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/shared ./shared
COPY --from=dependencies /app/services/auth-service/node_modules ./services/auth-service/node_modules
COPY services/auth-service ./services/auth-service
WORKDIR /app/services/auth-service
EXPOSE 4001
CMD ["node", "src/index.js"]
