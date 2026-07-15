FROM node:20-alpine AS dependencies
WORKDIR /app
COPY shared ./shared
COPY api-gateway/package*.json ./api-gateway/
WORKDIR /app/api-gateway
RUN npm install --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/shared ./shared
COPY --from=dependencies /app/api-gateway/node_modules ./api-gateway/node_modules
COPY api-gateway ./api-gateway
WORKDIR /app/api-gateway
EXPOSE 8080
CMD ["node", "src/index.js"]
