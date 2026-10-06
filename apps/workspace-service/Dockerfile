FROM node:22-alpine AS base
RUN corepack enable

WORKDIR /app

FROM base AS pruner
COPY . .

RUN pnpm dlx turbo prune @purse/workspace-service --docker

FROM base AS builder

COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json

RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ ./

RUN pnpm --filter=@purse/workspace-service build

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/workspace-service/dist ./dist

CMD ["node", "dist/main.js"]
