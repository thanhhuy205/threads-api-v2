FROM node:20-alpine AS builder

WORKDIR /app 

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/

RUN corepack enable && pnpm install --frozen-lockfile

ARG DATABASE_URL=mysql://username:password@localhost:3306/book_store?allowPublicKeyRetrieval=true
ENV DATABASE_URL=$DATABASE_URL
RUN pnpm run db:generate

COPY . . 
RUN pnpm run build

RUN pnpm prune --prod

FROM node:20-alpine 

WORKDIR /app 
COPY --from=builder /app/node_modules ./node_modules 
COPY --from=builder /app/dist ./dist 
COPY --from=builder /app/template ./template
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
CMD ["node", "dist/src/server.js"]
