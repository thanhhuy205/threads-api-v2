FROM node:20-alpine as builder

WORKDIR /app 

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci 

ARG DATABASE_URL=mysql://username:password@localhost:3306/book_store?allowPublicKeyRetrieval=true
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

COPY . . 
RUN npm run build 

RUN npm prune --production

FROM node:20-alpine 

WORKDIR /app 
COPY package*.json ./ 
COPY --from=builder /app/node_modules ./node_modules 
COPY --from=builder /app/dist ./dist 
COPY --from=builder /app/prisma ./prisma

CMD ["node", "dist/src/server.js"]