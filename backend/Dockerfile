FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

COPY . .
RUN npm run build

FROM node:20

WORKDIR /app
RUN chown -R node:node /app
USER node

COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
