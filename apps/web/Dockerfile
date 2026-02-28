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
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile

# Copy tooling configs (needed for build)
COPY tooling/ ./tooling/

# Build shared package
COPY packages/shared/ ./packages/shared/
RUN pnpm --filter @event-management/shared run build

# Build frontend
COPY apps/web/ ./apps/web/
RUN pnpm --filter @event-management/web run build

# Serve with nginx
FROM nginx:alpine
COPY --from=base /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
