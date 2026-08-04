# syntax=docker/dockerfile:1

FROM node:24-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS pnpm
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable pnpm

FROM pnpm AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM pnpm AS builder
# Read at build time: NEXT_PUBLIC_* is inlined into client bundles, the Sentry
# plugin uploads source maps, and the encryption key + deployment id are
# serialized into the build output.
ARG NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_AUTH_TOKEN
ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ARG RAILWAY_GIT_COMMIT_SHA
ENV NODE_ENV=production \
    SENTRY_RELEASE=$RAILWAY_GIT_COMMIT_SHA
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build
# drizzle-orm is bundled into the server chunks, so file tracing leaves it out
# of standalone/node_modules — but scripts/migrate.mjs imports it at deploy time.
RUN cp -RL node_modules/drizzle-orm .next/standalone/node_modules/drizzle-orm

FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    MALLOC_ARENA_MAX=2
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/scripts/migrate.mjs ./scripts/migrate.mjs
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
