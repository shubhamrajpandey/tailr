# Stage 1: Base runtime environment
FROM oven/bun:1.2-alpine AS base
WORKDIR /app

# Stage 2: Install production dependencies
FROM base AS dependencies
COPY package.json bun.lock* ./
RUN bun install --production

# Stage 3: Production minimal image
FROM oven/bun:1.2-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Run as non-root user
USER bun

# Copy application source and production modules
COPY --from=dependencies --chown=bun:bun /app/node_modules ./node_modules
COPY --chown=bun:bun package.json ./
COPY --chown=bun:bun src ./src
COPY --chown=bun:bun scripts ./scripts

# Expose HTTP port
EXPOSE 3001

# Production Container Healthcheck
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/health | grep -q -E '"status":\s*"(healthy|degraded)"' || exit 1

# Start production server
CMD ["bun", "run", "src/index.ts"]
