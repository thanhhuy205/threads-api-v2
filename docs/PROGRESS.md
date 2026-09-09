# Trạng thái thực thi CONNECT-SERVICES.md

Ghi lại session `2026-09-03` (2 file `.txt` ở root là **cùng một session**, file thứ hai chỉ là bản export lại với wrap hẹp hơn — không phải 2 lần làm việc khác nhau).

Mục tiêu session: làm phần cơ khí/lặp lại trong `docs/CONNECT-SERVICES.md`, để lại phần cần hiểu sâu cho bạn tự code.

Tất cả trạng thái dưới đây đã được **verify lại bằng typecheck + đọc file thật** vào 2026-09-04, không phải copy từ transcript.

---

## 1. Đã xong và đã verify

| Bước trong doc | Việc | Bằng chứng |
|---|---|---|
| Bước 8 (một phần) | Xoá import dangling `@api/*` trong auth-service và user-service | `npx tsc -p apps/auth-service/tsconfig.app.json --noEmit` → **0 lỗi** |
| Bước 8 | `apps/api/generated/prisma` → trỏ về đúng owner: `AuthPrisma` cho `RefreshToken`, `Prisma` (user-service) cho `User` | `apps/user-service/src/modules/auth/repository/auth.repository.ts:1-2` |
| Bước 8 | `@api/shared/database/prisma.service` → `@user-service/prisma/prisma.service` | `auth.repository.impl.ts:1` |
| Bước 8 | `DatabaseModule` (`@api/shared/database`) → `PrismaModule` local | `auth-repository.module.ts` |
| Bước 8 | Xoá `JwtService`/`JwtModule` đã bị xoá khỏi `users.controller.ts`, `user.module.ts`, `app.module.ts` | không còn `@api/` trong 2 service này |
| — | Thay `jwtService.requestAuthToken(request)` bằng decorator mới `@GetOptionalUserId()` | `apps/libs/common/src/decorators/get-optional-user-id.decorator.ts` (file mới) |
| Bước 1 | Thống nhất cổng: auth `3003→3300`, user `3006→3301`, host `localhost→0.0.0.0` | `app.config.ts` của cả 2 service + `main.ts` truyền host vào `app.listen` |
| Bước 3 | Kong: xoá route `auth-swagger` (không có `SwaggerModule.setup()`), sửa path `/api/auth/*` → `/auth/*` (không có `setGlobalPrefix`) | `kong-dev.yaml:66,86` |
| Bước 3 | Xoá global `request-transformer` với `$(jwt_claims)` — không phải biến hợp lệ của Kong, và tranh header với plugin Lua | `kong-dev.yaml:35` |
| Bước 3 | Bỏ `consumer: anonymousConsumer` khỏi `rate-limiting` (scope route+consumer sẽ chỉ áp cho consumer đó) | `kong-dev.yaml:80-83` |
| Bước 2 | `secret: ${JWT_SECRET}` → `{vault://env/kong-jwt-secret}` + `KONG_VAULTS: env` | `kong-dev.yaml:16`, `docker-compose.provider.yaml:31,35` |
| — | **Viết lại `handler.lua`** — `kong.client.get_jwt_token_payload()` **không tồn tại** trong Kong PDK, gọi field nil sẽ 500 mọi request. Thay bằng: đọc `Authorization`/query `jwt`, tự decode base64url payload (an toàn vì plugin `jwt` priority 1450 đã verify signature+exp trước) | `apps/config/kong/plugins/auth-context/handler.lua` |
| Bước 6 | `clear_header("X-JWT-CLAIMS")` trước khi set — chống header injection từ client | `handler.lua` |
| Bước 5, 6 | Thêm `auth-service`/`user-service` vào compose dùng `expose:` (không `ports:`), Kong admin bind `127.0.0.1:8001` | `docker-compose.provider.yaml:50-100` |
| Bước 4 | Kong container | đã có sẵn từ trước session |
| — | Tạo root `package.json` (workspace scripts) và `docker/service.Dockerfile` (build 1 service theo `--build-arg SERVICE=`) | file mới |
| — | Thêm script `build`/`dev` + comment giải thích layout `outDir` vào `tsconfig.app.json` của 2 service | `apps/*/package.json`, `apps/*/tsconfig.app.json` |

---

## 2. Missions KHÔNG thành công

### 2.1 Chưa verify được — session bị block

Toàn bộ phần build/install bị **Bash classifier block liên tục** ("Auto mode could not evaluate this action"). Hệ quả:

- **`pnpm install` chưa chạy.** `tsc-alias` và `tsx` đã được khai báo trong root `package.json` nhưng **chưa cài** (`node_modules/tsc-alias` không tồn tại). Nên script `build` và `dev` của 2 service **chắc chắn fail** nếu chạy ngay bây giờ.
- **`docker/service.Dockerfile` chưa từng được build thử.** Chưa biết nó có chạy được không.
- **Layout `dist/` chưa được xác nhận.** Comment trong `tsconfig.app.json` nói entrypoint ở `dist/apps/auth-service/apps/auth-service/src/main.js` — đây là **suy luận từ `rootDir: "."`, chưa chạy `tsc` để kiểm chứng**. Dockerfile có dùng `find` để tự tìm `main.js` nên không hardcode, nhưng vẫn chưa test.
- **`kong config parse` chưa chạy.** Chưa xác nhận `kong-dev.yaml` sau khi sửa có parse được không.
- **PDK `kong.client.get_jwt_token_payload` chưa verify bằng docker.** Kết luận "không tồn tại" dựa trên kiến thức PDK, không phải grep trong image `kong:3.7`.
- **Mục 5 của doc (curl smoke test) chưa chạy dòng nào.** Chưa có gì được kiểm tra end-to-end.

### 2.2 Cố tình để lại cho bạn (2 quyết định cần hiểu sâu)

`npx tsc -p apps/user-service/tsconfig.app.json --noEmit` hiện còn **5 lỗi**, đúng 2 nhóm:

**(a) Schema ownership — `RefreshToken` vs `User` (3 lỗi)**

```
auth.repository.impl.ts(39,23): Property 'refreshToken' does not exist on type 'PrismaService'
auth.repository.impl.ts(45,24): ...
auth.repository.impl.ts(52,23): ...
```

Doc `CONNECT-SERVICES.md` mục 2 **ghi sai**: nó nói schema user-service giữ `RefreshToken`. Thực tế:

| Delegate | auth-service client | user-service client |
|---|---|---|
| `user` | — | ✅ |
| `refreshToken` | ✅ | — |

`AuthRepositoryImpl` (nằm trong user-service) gọi **cả** `prisma.user` lẫn `prisma.refreshToken`. Không client nào có cả hai → file này không thể compile bất kể chọn import path nào. Phải quyết định: ai sở hữu `RefreshToken`, và repository này thuộc service nào.

**(b) `AbilityModule` không tồn tại (2 lỗi)**

```
group-team.module.ts(4,31): Cannot find module '@auth-service/modules/ability/ability.module'
group-team.service.impl.ts(7,54): Cannot find module '@auth-service/modules/ability/service/ability.service'
```

`apps/auth-service/src/modules/` chỉ có `auth/` — module `ability` bị xoá cùng `apps/api` ở commit `d9b8490`. Đây là **phụ thuộc vòng** user-service → auth-service, cần thiết kế lại (CASL ability đặt ở đâu, hay gọi qua gRPC).

### 2.3 Bước 7 (nối DI) — chưa làm gì

`AuthModule` của auth-service vẫn `imports` rỗng nhưng inject `AUTH_REPOSITORY` + `USER_SERVICE`:

```ts
@Module({
  controllers: [AuthController],
  providers: [ /* ... */ ],   // không có imports
})
export class AuthModule { }
```

→ **Nest sẽ throw lúc boot** (`Nest can't resolve dependencies`). Đây là quyết định in-process vs gRPC, thuộc nhóm để bạn tự làm.

Kèm theo: auth-service có `prisma.service.ts` nhưng **không có `prisma.module.ts`** (chỉ user-service có) → `PrismaService` chưa được provide ở đâu trong auth-service.

### 2.4 Bước 1 — biến `.env` chưa thêm

`.env` hiện chỉ có `JWT_SECRET=your_jwt_secret_key` (giá trị placeholder). **Chưa có**:

```dotenv
AUTH_SERVICE_HOST / AUTH_SERVICE_PORT
USER_SERVICE_HOST / USER_SERVICE_PORT
MICROSERVICE_NAME
```

Default trong `app.config.ts` đã đúng (3300/3301) nên chạy được, nhưng `MICROSERVICE_NAME` bị `validate` với `skipMissingProperties: false` → auth-service **throw lúc boot** nếu thiếu.

Ngoài ra `KONG_JWT_SECRET: ${JWT_SECRET}` trong compose đang lấy giá trị placeholder — Kong sẽ verify bằng key `your_jwt_secret_key`.

### 2.5 Chưa làm: gRPC (Bước 7 hướng dài hạn)

Không có `@GrpcMethod`, `ClientsModule`, `connectMicroservice` nào. `user.proto` vẫn là bản nháp chưa load. Không có cổng gRPC nào được định nghĩa.

### 2.6 Yêu cầu "xuất md architecture" — chưa được thực hiện

Bạn yêu cầu giữa session: *"sau đó xuất md architecture để tôi hiểu luôn clear picture những gì đã làm vào md"*. Session bị interrupt trước khi viết. File này là bản trả nợ phần *"đã làm gì"*; **chưa có** md architecture mô tả kiến trúc sau khi sửa.

---

## 3. Bug mới phát hiện (do session trước tạo ra)

**`strip_path: true` trên route login/register là sai.**

`kong-dev.yaml:66-67`:

```yaml
- name: auth-login
  paths: [/auth-service/auth/login]
  strip_path: true
```

Kong strip **toàn bộ prefix đã match**. Request `/auth-service/auth/login` match trọn path → upstream nhận `/`, **không phải** `/auth/login`.

Route catchall `/auth-service` + `strip_path: true` thì đúng (vì chỉ strip `/auth-service`), nhưng route tường minh có path đầy đủ thì không. Và route tường minh **thắng** catchall (Kong ưu tiên prefix path dài hơn) → login/register sẽ 404.

Cần một trong hai:
- `strip_path: false` + `request-transformer` `replace: { uri: /auth/login }` (đúng như doc gốc đề xuất, chỉ sửa lại `/api/auth/login` → `/auth/login`), hoặc
- đổi `paths` về `[/auth-service]` và phân biệt bằng `methods` — phức tạp hơn, không nên.

---

## 4. Thứ tự nên làm tiếp

1. `pnpm install` (cài `tsc-alias`, `tsx`) → rồi `pnpm build:auth-service` để xác nhận layout `dist/`.
2. Sửa bug `strip_path` ở mục 3.
3. Thêm biến vào `.env` (mục 2.4), đổi `JWT_SECRET` khỏi giá trị placeholder.
4. **Bạn quyết định:** schema ownership `RefreshToken` (2.2a).
5. **Bạn quyết định:** `AbilityModule` đặt ở đâu (2.2b).
6. **Bạn quyết định:** Bước 7 — in-process `imports: [UserModule]` hay gRPC thật (2.3).
7. `kong config parse` → `docker compose up` → chạy mục 5 của `CONNECT-SERVICES.md`.
