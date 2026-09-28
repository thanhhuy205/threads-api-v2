FROM node:22-alpine AS base

RUN corepack enable

WORKDIR /app

FROM base AS pruner

COPY . .

RUN pnpm dlx turbo prune @purse/auth-service --docker

FROM base AS builder

COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/tsconfig.json ./tsconfig.json
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json

RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ ./

RUN pnpm --filter @purse/common build
RUN pnpm --filter @purse/core build
RUN pnpm --filter @purse/proto build

RUN pnpm --filter @purse/auth-service prisma:generate

RUN pnpm exec nest build auth-service

RUN pnpm --filter @purse/auth-service deploy --prod --legacy /app/deploy

RUN cp -r /app/apps/auth-service/dist /app/deploy/dist

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/deploy ./

CMD ["node", "dist/main.js"]
