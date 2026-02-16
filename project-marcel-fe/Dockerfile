# ─── Build Stage ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Build args for Next.js public env vars (baked at build time)
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_SERVER_FILE_HOST
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_FILE_HOST=$NEXT_PUBLIC_SERVER_FILE_HOST

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# ─── Production Stage ───────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]
