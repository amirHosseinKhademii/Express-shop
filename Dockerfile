# syntax=docker/dockerfile:1
# Parser directive: must be first line; selects BuildKit’s Dockerfile v1 frontend for current build behavior.

# Pin major Node.js version; reused in both stages so builder and runner match (same libc, same native addons).
ARG NODE_VERSION=22

# Start the build stage: Debian Bookworm slim image with Node preinstalled; name it "builder" for later COPY --from.
FROM node:${NODE_VERSION}-bookworm-slim AS builder

# All following commands in this stage run from /app (and it is created if missing).
WORKDIR /app

# Refresh apt package index.
# Install OpenSSL libs Prisma needs to pick the correct query-engine binary during generate.
# Remove apt lists to avoid bloating the image layer with cached index files.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# Prisma reads DATABASE_URL from the schema at generate time; dummy URL is enough—no real database is contacted.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"

# Copy dependency manifests first so Docker can cache npm install when only source code changes.
COPY package.json package-lock.json ./

# Install exact versions from the lockfile (including devDependencies needed for build and prisma CLI).
RUN npm ci

# Copy TypeScript compiler config (paths, module resolution, include globs).
COPY tsconfig.json ./

# Copy Prisma schema (and migrations folder if present) for client generation.
COPY prisma ./prisma

# Copy application source to compile.
COPY src ./src

# Generate the Prisma client into ./generated/prisma per schema output setting (required before tsc).
RUN npx prisma generate

# Compile TypeScript (src + types) into ./dist (layout preserves src/ → dist/src/).
RUN npm run build

# Drop devDependencies and the Prisma CLI from node_modules; keep only runtime packages for copying to the final stage.
RUN npm prune --omit=dev

# Final stage: fresh slim image so the published image does not contain build-only layers or dev tools.
FROM node:${NODE_VERSION}-bookworm-slim AS runner

# Application root in the container filesystem.
WORKDIR /app

# Tell Node and libraries this is production (e.g. smaller logs, no dev-only behavior).
ENV NODE_ENV=production

# Default HTTP port; Kubernetes Services and Docker -p map to this unless overridden.
ENV PORT=3000

# Refresh apt index.
# dumb-init runs as PID 1 so signals (SIGTERM from k8s/docker stop) reach Node for graceful shutdown.
# openssl: runtime Prisma engine still needs OpenSSL libraries on Debian slim.
# Clean apt cache again to keep the layer small.
RUN apt-get update \
  && apt-get install -y --no-install-recommends dumb-init openssl \
  && rm -rf /var/lib/apt/lists/*

# Copy production node_modules from builder (already pruned); chown to non-root user for security.
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Copy compiled JavaScript output.
COPY --from=builder --chown=node:node /app/dist ./dist

# Copy generated Prisma client (not in git); required at runtime alongside @prisma/client in node_modules.
COPY --from=builder --chown=node:node /app/generated ./generated

# Copy package.json for metadata; optional for npm start (we use node directly in CMD).
COPY --from=builder --chown=node:node /app/package.json ./package.json

# Drop root privileges: the official node image provides user "node" (uid 1000).
USER node

# Document which port the process listens on (informational; does not publish the port by itself).
EXPOSE 3000

# Periodically check /api/health: 30s between checks, 5s command timeout, 15s grace before first failure count, 3 failures = unhealthy.
# Inline Node uses fetch to match the app’s real HTTP route (mounted under /api); exit 0 only if response is OK.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "const p=process.env.PORT||'3000';fetch('http://127.0.0.1:'+p+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Wrap the main process with dumb-init so signals and zombie reaping work correctly when PID 1 is Node’s parent chain.
ENTRYPOINT ["dumb-init", "--"]

# Default process: run the compiled entrypoint (tsconfig rootDir "." emits server under dist/src/).
CMD ["node", "dist/src/server.js"]




# docker build -t express-init:latest .
# docker run --rm -p 3000:3000 \
#   -e DATABASE_URL="postgresql://..." \
#   -e MONGODB_URI="mongodb://..." \
#   -e JWT_SECRET="..." \
#   -e JWT_REFRESH_SECRET="..." \
#   express-init:latest