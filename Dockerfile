FROM node:20-alpine as builder

WORKDIR /app 

COPY package*.json ./
COPY /prisma /app/
RUN npm ci 

ARG DATABASE_URL=mysql://username:password@localhost:3306/book_store?allowPublicKeyRetrieval=true
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

COPY . .
RUN npm run build


FROM node:20-alpine
COPY package*.json ./
RUN npm ci --omit=dev


COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma


CMD ["node", "dist/src/server.js"]