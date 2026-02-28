FROM node:20-alpine AS base
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.29.2 --activate

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tooling/typescript-config/package.json ./tooling/typescript-config/
COPY tooling/eslint-config/package.json ./tooling/eslint-config/
COPY tooling/prettier-config/package.json ./tooling/prettier-config/
COPY packages/shared/package.json ./packages/shared/
COPY packages/database/package.json ./packages/database/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

# Copy tooling configs (needed for build)
COPY tooling/ ./tooling/

# Build shared package
COPY packages/shared/ ./packages/shared/
RUN pnpm --filter @event-management/shared run build

# Build database package
COPY packages/database/ ./packages/database/
RUN pnpm --filter @event-management/database run build

# Build backend
COPY apps/api/ ./apps/api/
RUN pnpm --filter @event-management/api run build

# Production image
FROM node:20-alpine
RUN apk add --no-cache dumb-init
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages/shared/dist ./packages/shared/dist
COPY --from=base /app/packages/shared/package.json ./packages/shared/
COPY --from=base /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=base /app/packages/database/dist ./packages/database/dist
COPY --from=base /app/packages/database/package.json ./packages/database/
COPY --from=base /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=base /app/apps/api/package.json ./apps/api/
COPY --from=base /app/package.json ./

EXPOSE 3000

CMD ["dumb-init", "node", "apps/api/dist/main.js"]
