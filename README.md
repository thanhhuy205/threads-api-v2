# Threads API v2

Khung dự án Express + TypeScript + Prisma 7 + MySQL.

## Cấu trúc

- `config/`: biến môi trường và Prisma client
- `prisma/`: schema, seed và migration sau này
- `src/modules/`: các module theo feature

## Chạy dự án

1. Cài dependencies: `npm install`
2. Chỉnh `DATABASE_URL` trong `.env`
3. Sinh Prisma client: `npm run db:generate`
4. Chạy dev: `npm run dev`

## Scripts chính

- `npm run dev`: chạy local với `tsx`
- `npm run build`: build TypeScript ra `dist/`
- `npm run start`: chạy bản build
- `npm run db:migrate`: tạo và áp migration Prisma
- `npm run db:studio`: mở Prisma Studio

## Endpoint mẫu

- `GET /api/v1/health`
- `GET /api/v1/health/ready`
