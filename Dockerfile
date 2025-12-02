# ----------- 1. Base Image (Node 25) -------------
FROM node:25-alpine AS base
WORKDIR /app

# ----------- 2. Dependencies Stage -------------
FROM base AS deps

# Fix for Next.js sharp / image optimizations
RUN apk add --no-cache libc6-compat

# Copy lock files only (supports npm/yarn/pnpm)
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies
RUN npm install

# ----------- 3. Build Stage -------------
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js app
RUN npm run build

# ----------- 4. Runtime Stage -------------
FROM node:25-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy required runtime artifacts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]