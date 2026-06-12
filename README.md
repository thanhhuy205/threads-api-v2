# Threads API v2

Backend API cho nền tảng mạng xã hội theo kiến trúc modular, tập trung vào:

- Thiết kế module rõ ràng, dễ mở rộng
- Luồng xử lý bất đồng bộ bằng BullMQ + Redis workers
- Semantic search cho bài viết bằng Mixedbread embeddings + Pinecone vector DB
- Upload ảnh qua Cloudflare R2 (S3-compatible)
- Tối ưu kiểm tra trùng username/email bằng Redis Bloom Filter

## Project Snapshot

Dự án này thể hiện năng lực backend ở các điểm mà nhà tuyển dụng thường quan tâm:

- Thiết kế service thực tế có API sync + async pipeline
- Tách tầng rõ ràng `route -> controller -> service -> repository`
- Kết hợp nhiều hệ thống ngoài: Redis, BullMQ, Pinecone, Mixedbread, Cloudflare R2, Nodemailer
- Có Swagger docs để kiểm thử và review nhanh

## Docs Hub (Nghiệp vụ)

Ngoài Swagger API, repo có thêm docs nghiệp vụ để đọc nhanh theo ngữ cảnh vận hành:

- [Docs Hub (Online)](https://thanhhuy205.github.io/threads-api-v2/)
- [Docs Hub (Local)](docs/index.html)
- [Sơ đồ hạ tầng](infrastructure/infa.png)
- [Mux Webhook Flow](docs/mux-webhook-flow.html)

Gợi ý: mở link online hoặc file `docs/index.html` trước, sau đó đi vào từng tài liệu con.

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Runtime | Node.js, TypeScript |
| HTTP API | Express 5 |
| Database | MySQL + Prisma ORM |
| Queue | BullMQ |
| Cache / Data structure | Redis + Redis Bloom |
| Semantic Search | Mixedbread AI (embedding) + Pinecone |
| File Storage | Cloudflare R2 (S3 API) |
| Auth | JWT access token + refresh token |
| API Docs | Swagger UI |

## Kiến Trúc Modular (Tóm Tắt)

Mỗi domain được tổ chức thành module độc lập (Auth, Post, Upload, Circle, Notification...), bám pattern nhất quán:

- `controller`: nhận request/response
- `dto`: validate schema (Zod) + type
- `service`: nghiệp vụ
- `repository`: truy cập DB
- `interfaces`: payload/type chia sẻ
- `docs`: swagger schema/path
- `*.route.ts`: định tuyến theo module

Ví dụ cấu trúc module:

```text
src/modules/post/
  controller/
  docs/
  dto/
    request/
  interfaces/
  mapper/
  repository/
  service/
  post.routes.ts
```

Luồng xử lý request đồng bộ:

```text
Route -> Validate (Zod) -> Controller -> Service -> Repository -> Prisma/MySQL
```

Luồng xử lý bất đồng bộ:

```text
Service -> Producer -> BullMQ Queue (Redis) -> Worker -> External Service/DB
```

## Tính Năng Nổi Bật

### 1) Auth + Session + Email async

- Đăng ký, đăng nhập, refresh token, logout
- Refresh token được hash và lưu DB
- Access token blacklist trên Redis khi logout
- Gửi email verify/forgot password bằng queue riêng (`email_queue`) qua worker

### 2) Redis Bloom Filter cho username/email

- Khi register: enqueue job `bloom_queue` để add username/email vào Bloom Filter
- Khi validate: check nhanh qua `BF.EXISTS` trước khi xử lý sâu hơn
- Giảm chi phí query trực tiếp DB cho các API kiểm tra availability

### 3) Post system + async like sync

- Tạo post, reply, quote, repost, feed, like
- Like state ghi tạm vào Redis, dùng job `like_queue` để sync DB
- Có cơ chế dedupe job bằng key Redis (`NX + EX`) để tránh enqueue dồn

### 4) Semantic Search (Mixedbread + Pinecone)

- Khi tạo post:
  - Producer đẩy job vào `pinecone_queue`
  - Worker tạo embedding từ `content + topic` qua Mixedbread
  - Upsert vector + metadata vào Pinecone namespace `posts`
- Khi search (`GET /posts/search`):
  - Sinh embedding query
  - Query topK vectors tương đồng trong Pinecone
  - Trả về bài viết gần nghĩa theo semantic score

### 5) Upload ảnh với Cloudflare R2

- Upload avatar/media qua API upload
- Dùng `multer` memory storage + filter mime ảnh
- Resize ảnh bằng `sharp` trước khi put object
- Lưu object lên Cloudflare R2 bằng S3-compatible SDK

### 6) Swagger Documentation

- Tài liệu API sẵn tại `/api/v1/docs`
- Dễ demo cho QA, frontend, và reviewer kỹ thuật

## Luồng Worker/Queue Hiện Có

| Queue | Producer | Worker | Mục đích |
|---|---|---|---|
| `email_queue` | `emailProducer` | `emailWorker` | Gửi verify/forgot password email |
| `bloom_queue` | `bloomProducer` | `bloomWorker` | Cập nhật Redis Bloom username/email |
| `pinecone_queue` | `pineProducer` | `pineWorker` | Embed post và upsert vector Pinecone |
| `like_queue` | `likeProducer` | `likeWorker` | Đồng bộ trạng thái like từ Redis về DB |

## Sequence tham khảo

Semantic indexing flow:

```text
POST /posts
-> PostService.create
-> pineProducer.addToPineconeQueue
-> pineWorker.process
-> mixedBreadService.generateEmbedding
-> pineconeService.savePostEmbeddingToPinecone
```

Bloom validation flow:

```text
POST /auth/register
-> bloomProducer.addUserNameAndEmailToBloom
-> bloomWorker.addUserNameAndEmailToBloom
-> Redis Bloom

POST /auth/validate/email | /auth/validate/username
-> redisService.bf.exists
```

## API Groups

Base path: `http://localhost:<PORT>/api/v1`

- `/auth`
- `/posts`
- `/upload`
- `/users`, `/user`, `/me`
- `/circle`
- `/notification`
- `/health`

## Chạy Local

Yêu cầu:

- Node.js 20+
- MySQL
- Redis
- Tài khoản/dịch vụ cho: Mixedbread, Pinecone, Cloudflare R2, SMTP

Cài đặt:

```bash
npm install
npm run db:generate
npm run dev
```

Chạy workers (terminal riêng):

```bash
npm run worker
```

Chạy queue event listeners (optional, hiện đang lắng nghe `email_queue`, `bloom_queue`, `pinecone_queue`):

```bash
npm run queue
```

Build production:

```bash
npm run build
npm run start
```

## Docker services (hạ tầng local)

Repo có `docker-compose.provider.yaml` để chạy nhanh:

- MySQL
- Redis
- RedisInsight
- Nginx

## Biến Môi Trường Chính

Dự án validate env bằng Zod trong `src/config/config.ts`. Những biến quan trọng:

Core:

- `NODE_ENV`, `PORT`, `CORS_ORIGIN`, `FRONTEND_URL`

Database:

- `DATABASE_URL`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_POOL_SIZE`

Redis:

- `REDIS_URL`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`

JWT/Auth:

- `JWT_SECRET`, `ACCESS_EXPIRES`, `REFRESH_TOKEN_EXPIRES_IN`
- `RESET_PASSWORD_TOKEN_EXPIRES_IN`, `RESET_PASSWORD_TOKEN_EXPIRES_IN_TEXT`
- `RESEND_VERIFY_EMAIL_TOKEN_EXPIRES_IN`, `RESEND_VERIFY_EMAIL_TOKEN_EXPIRES_IN_TEXT`

Cloudflare R2:

- `R2_ENDPOINT`, `R2_BUCKET_NAME`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
- `R2_ACCOUNT_ID`, `R2_TOKEN_VALUE`, `S3_ENDPOINT`

Semantic Search:

- `MIXEDBREAD_API_KEY`, `MIXEDBREAD_MODEL_NAME`
- `PINECONE_API_KEY`, `PINECONE_INDEX_NAME`

Email:

- `NODEMAILER_HOST`, `NODEMAILER_PORT`, `NODEMAILER_SECURE`, `NODEMAILER_USER`, `NODEMAILER_PASS`

Realtime:

- `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_HOST`, `PUSHER_PORT`, `PUSHER_USE_TLS`, `PUSHER_CLUSTER`

## Điểm Kiến Trúc Đáng Chú Ý

- Dùng modular monolith để giữ tốc độ phát triển nhưng vẫn tách biệt domain
- API xử lý nhanh ở lớp sync, tác vụ nặng đẩy qua async workers
- Chuẩn hóa response/error qua middleware riêng
- Tận dụng Redis cho cả cache state, token blacklist, Bloom filter, và queue transport
- Semantic search pipeline được tách khỏi request lifecycle để giảm độ trễ khi create post

## Swagger

Sau khi chạy server, truy cập:

- `http://localhost:<PORT>/api/v1/docs`
