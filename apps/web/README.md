# Threads Meta Frontend

Frontend Next.js cho ứng dụng mạng xã hội phong cách Threads. Ứng dụng hỗ trợ đăng nhập/đăng ký, feed bài viết, hồ sơ người dùng, tương tác bài viết, tìm kiếm, tin nhắn, thông báo realtime và tính năng Circle để tạo cộng đồng, đăng bài trong nhóm, quản lý thành viên/lời mời và theo dõi trạng thái nhóm.

Repository hiện tại là phần frontend người dùng. Trong workspace này chưa có thư mục `ui/`; nếu dự án được tách thành monorepo, hãy đặt README riêng tại `ui/README.md`, rồi cập nhật liên kết tại mục "Liên kết README".

## Liên kết README

- Frontend người dùng: [README.md](./README.md)
- Tài liệu kỹ thuật: [docs/index.html](./docs/index.html)
- Báo cáo trạng thái kỹ thuật: [docs/thread-nextjs-technical-status-report.html](./docs/thread-nextjs-technical-status-report.html)
- SEO review frontend: [docs/thread-nextjs-fe-seo-review.html](./docs/thread-nextjs-fe-seo-review.html)
- UI README: chưa có trong workspace hiện tại (`ui/README.md`)

## Công nghệ sử dụng

- Next.js 16, App Router
- React 19, TypeScript
- Tailwind CSS 4
- next-intl cho đa ngôn ngữ `vi` và `en`
- TanStack Query cho server state/cache
- Zustand cho client state
- Radix UI, shadcn-style components, lucide-react
- React Hook Form và Zod cho form validation
- Pusher JS/Soketi cho realtime
- Lexical và TipTap cho rich text/editor
- Axios/fetch proxy qua Next.js API routes

## Chức năng chính

- Xác thực người dùng: đăng nhập, đăng ký, quên mật khẩu, reset mật khẩu, xác minh email.
- Feed bài viết: tạo bài viết, trả lời, repost, quote, like, lưu bài, chia sẻ, embed.
- Hồ sơ người dùng: trang cá nhân, follower/following, bạn bè, yêu cầu kết bạn, cài đặt hồ sơ.
- Circle: khám phá circle, tham gia, đăng bài trong circle, quản lý thành viên, lời mời, yêu cầu tham gia, vai trò và thống kê.
- Tin nhắn và thông báo realtime.
- Giao diện đa ngôn ngữ và dark/light theme.

## Yêu cầu môi trường

- Node.js 20 hoặc mới hơn
- npm
- Backend API tương thích với các route được proxy qua `BACKEND_URL`
- Soketi/Pusher server nếu cần realtime ở local

## Cài đặt

```bash
npm install
```

Sao chép file môi trường mẫu:

```bash
cp .env.example .env
```

Trên Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Biến môi trường

| Biến | Bắt buộc | Mô tả | Giá trị local ví dụ |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Có | URL frontend dùng để resolve URL nội bộ/server API | `http://localhost:3000` |
| `BACKEND_URL` | Có | Base URL backend API, không có dấu `/` cuối | `http://localhost:3302/api/v1` |
| `NEXT_PUBLIC_SOKETI_KEY` | Không | App key của Soketi/Pusher client | `9bb6c219` |
| `NEXT_PUBLIC_SOKETI_HOST` | Không | Host websocket realtime | `localhost` |
| `NEXT_PUBLIC_SOKETI_PORT` | Không | Port websocket realtime | `6001` |
| `ACCESS_TOKEN_COOKIE_NAME` | Không | Tên cookie lưu access token | `at` |
| `REFRESH_TOKEN_COOKIE_NAME` | Không | Tên cookie lưu refresh token | `rt` |
| `ACCESS_TOKEN_COOKIE_MAX_AGE` | Không | Thời gian sống access token cookie, tính bằng giây | `840` |
| `REFRESH_TOKEN_COOKIE_MAX_AGE` | Không | Thời gian sống refresh token cookie, tính bằng giây | `604800` |

Ví dụ `.env` local:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
BACKEND_URL=http://localhost:3302/api/v1

NEXT_PUBLIC_SOKETI_KEY=9bb6c219
NEXT_PUBLIC_SOKETI_HOST=localhost
NEXT_PUBLIC_SOKETI_PORT=6001

ACCESS_TOKEN_COOKIE_NAME=at
REFRESH_TOKEN_COOKIE_NAME=rt
ACCESS_TOKEN_COOKIE_MAX_AGE=840
REFRESH_TOKEN_COOKIE_MAX_AGE=604800
```

## Chạy dự án

Chạy môi trường development:

```bash
npm run dev
```

Mở ứng dụng tại:

```text
http://localhost:3000/vi
```

Build production:

```bash
npm run build
```

Chạy production build:

```bash
npm run start
```

Kiểm tra lint:

```bash
npm run lint
```

## Tài khoản demo

Repo frontend này không chứa seed database hoặc credential demo. Cập nhật bảng dưới đây theo tài khoản đã seed ở backend/staging trước khi gửi cho reviewer.

| Vai trò | Tài khoản | Mật khẩu | Ghi chú |
| --- | --- | --- | --- |
| User | `TODO_USER_EMAIL_OR_USERNAME` | `TODO_USER_PASSWORD` | Dùng để kiểm tra flow người dùng thông thường |

## Cấu trúc thư mục chính

```text
src/
  app/            Next.js App Router, route groups, API proxy routes
  components/     Layout provider và UI components dùng chung
  config/         Đọc cấu hình từ biến môi trường
  features/       API, hooks, keys và logic theo domain
  i18n/           Cấu hình locale và message loading
  lib/            HTTP helpers, realtime client, TanStack Query helpers
  messages/       Bản dịch tiếng Việt/tiếng Anh
  schema/         Zod schemas
  services/       Service layer dùng lại ở client
  types/          TypeScript types
```

## Ghi chú vận hành

- Route mặc định có locale prefix, ví dụ `/vi`, `/en`, `/vi/login`.
- Các route private được bảo vệ trong `src/proxy.ts`; nếu thiếu token sẽ redirect về trang đăng nhập.
- Next.js API routes forward request tới backend qua `BACKEND_URL` và đồng bộ auth token qua cookie.
- Realtime phụ thuộc `NEXT_PUBLIC_SOKETI_*`; nếu Soketi/Pusher không chạy, các tính năng realtime có thể không cập nhật tức thì.
