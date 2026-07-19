FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY backend/package.json backend/
COPY shared/package.json shared/

RUN npm ci --workspace=backend --workspace=shared --omit=dev

# Copy source
COPY backend/ backend/
COPY shared/ shared/

# Generate Prisma client
RUN npx prisma generate --schema=backend/prisma/schema.prisma

# Runtime
ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "backend/src/server.js"]
