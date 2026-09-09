# Kết nối auth-service, user-service và Kong

Tài liệu này giải thích cách 3 thành phần **được thiết kế** để nối với nhau, trạng thái thực tế trong repo, và các bước cần làm để chạy end-to-end.

> **Đọc mục [2. Trạng thái hiện tại](#2-trạng-thái-hiện-tại) trước.** Phần lớn kiến trúc dưới đây là thiết kế, chưa chạy được. Nhánh `migrate/pulse-board-api` đang ở giữa quá trình tách monolith `apps/api` thành microservices.

---

## 1. Ý tưởng kiến trúc

Kong là **cửa vào duy nhất**. Kong verify JWT, rồi truyền danh tính xuống service qua header `X-JWT-CLAIMS`. Các service **không tự verify JWT** — chúng chỉ parse header đó.

```text
Client
  |  Authorization: Bearer <access_token>
  v
Kong (proxy)
  |  1. plugin `jwt`          -> verify HS256, tìm consumer theo claim `iss`
  |  2. plugin `auth-context` -> encode claims vào header X-JWT-CLAIMS (Lua, priority 1000)
  |  3. rewrite path          -> /auth-service/... -> /...
  v
auth-service (:3300)              user-service (:3301)
  |  AppAuthGuard (APP_GUARD toàn cục, bỏ qua nếu @IsPublic())
  |  BaseGatewayAuthStrategy -> parse X-JWT-CLAIMS -> TokenPayload
  |  GrpcGatewayAuthStrategy -> check type/key -> UserRequestPayload {id,email,jti,role}
  v
Prisma 7.8 + @prisma/adapter-mariadb -> MySQL
```

**Hệ quả bảo mật:** service tin tuyệt đối vào `X-JWT-CLAIMS`. Ai gọi trực tiếp `:3300` và tự set header đó thì mạo danh được bất kỳ user nào. Vì vậy hai service **không được expose ra ngoài** — chỉ Kong được truy cập (xem [Bước 6](#bước-6--khoá-đường-vào-trực-tiếp)).

### Mắt xích khoá: claim `iss`

`apps/libs/common/src/enums/jwt.enum.ts`:

```ts
export const JWT_ISSUER = 'auth-service';
```

Hằng số này xuất hiện ở 3 nơi và phải khớp nhau:

1. Token do auth-service phát có `iss = 'auth-service'` (qua `jwtConfiguration.issuer`).
2. Kong consumer có `username`/`key` = `auth-service`.
3. Plugin `jwt` của Kong dùng `key_claim_name: iss` để tra consumer.

Ngoài ra token phải có claim `type: 'access_token'` và `key: 'auth-service'`, vì `GrpcGatewayAuthStrategy` kiểm tra hai giá trị này.

---

## 2. Trạng thái hiện tại

| Thành phần | Trạng thái |
|---|---|
| Kong declarative config | Có — `apps/config/kong/kong-dev.yaml` |
| Kong custom plugin `auth-context` | Có — `apps/config/kong/plugins/auth-context/{handler,schema}.lua` |
| Guard/Strategy đọc `X-JWT-CLAIMS` | Có — `apps/libs/core/src/auth/` |
| Kong container | **Không** — không compose service nào chạy Kong |
| gRPC giữa 2 service | **Không** — xem bên dưới |
| auth-service gọi user-service | Qua **import TypeScript trực tiếp**, không qua network |
| Root `package.json` | **Không có** — không có script `dev`/`build` ở root |

### Chưa có gRPC

Grep toàn repo cho `@GrpcMethod`, `@MessagePattern`, `ClientsModule`, `ClientGrpc`, `createMicroservice`, `protoPath`, `Transport.` — **không có match nào**. `@nestjs/microservices`, `@grpc/grpc-js`, `@grpc/proto-loader` được khai báo dependency nhưng không import ở đâu. File `apps/libs/common/src/grpc/proto/user.proto` (package `user`, service `UserService`, 3 RPC: `GetUser`, `GetUserByEmail`, `FindExistingIds`) là **bản nháp**, chưa được load.

Tên `GrpcGatewayAuthStrategy` gây nhầm lẫn: nó không làm gì liên quan gRPC, chỉ validate nội dung claims.

### Hai service đang coupling ở compile-time

`apps/auth-service/src/modules/auth/service/impl/auth.service.impl.ts`:

```ts
import { AUTH_REPOSITORY, type AuthRepository } from '@user-service/modules/auth/repository/auth.repository';
import { USER_SERVICE, type UserService } from '@user-service/modules/user/service/user.service';
```

Đây là import trực tiếp qua path alias, **in-process DI**, không phải RPC. Bằng chứng rõ nhất: `USER_SERVICE` là một `Symbol` — không thể đi qua ranh giới process.

Lý do tồn tại: schema Prisma của user-service giữ `password` và model `RefreshToken`, còn schema auth-service chỉ có `Role`/`Permission`. Nên auth-service buộc phải với sang repository của user-service để register/login.

Còn có **phụ thuộc vòng**: `apps/user-service/src/modules/group-team/` import `AbilityModule` và `ABILITY_SERVICE` từ `@auth-service/modules/ability/...` — nhưng `apps/auth-service/src/modules/` chỉ có `auth/`, **không có `ability`**. Import này đang dangling.

---

## 3. Kong config đang có gì

File: `apps/config/kong/kong-dev.yaml` (`_format_version: "3.0"`, định dạng dành cho **DB-less mode**).

### Services và routes

| Kong service | Upstream | Route | Path | strip_path | Plugin riêng |
|---|---|---|---|---|---|
| `auth-service` | `auth-service:3300` | `auth-swagger` | `/auth-service/swagger` | false | jwt (anonymous), rewrite `/swagger` |
| | | `auth-login` | `/auth-service/api/auth/login` | false | jwt (anonymous), rewrite `/api/auth/login`, **rate-limiting 5/phút** |
| | | `auth-register` | `/auth-service/api/auth/register` | false | jwt (anonymous), rewrite `/api/auth/register` |
| | | `auth-service-catchall` | `/auth-service` | true | — (thừa hưởng jwt toàn cục) |
| `user-service` | `user-service:3301` | `user-service-catchall` | `/user-service` | true | — (thừa hưởng jwt toàn cục) |

Không có block `upstreams:` — nghĩa là không load balancing, không health check, Kong resolve host trực tiếp.

### Cách làm route public

Thay vì tắt plugin `jwt`, route public **khai báo lại** `jwt` với `anonymous: anonymousConsumer`. Request không token vẫn đi qua dưới danh nghĩa anonymous consumer, và plugin Lua set `X-JWT-CLAIMS: "{}"`. Việc cho phép hay không do app quyết định bằng `@IsPublic()`.

### Plugin `auth-context` (handler.lua)

```lua
local payload, err = kong.client.get_jwt_token_payload()
if not payload then
  kong.service.request.set_header("X-JWT-CLAIMS", "{}")
  return
end
local claims = {
  id = payload.sub, email = payload.email, type = payload.type,
  role = payload.role, jti = payload.jti, key = payload.key,
}
kong.service.request.set_header("X-JWT-CLAIMS", cjson.encode(claims))
```

Lưu ý nó map `payload.sub` -> `claims.id`.

---

## 4. Các bước để chạy được

Các bước dưới đây **chưa được thực hiện** trong repo. Đây là việc cần làm, kèm config cụ thể.

### Bước 1 — Thống nhất cổng

Hiện đang lệch nhau 3 chỗ:

| Service | App listen (default) | Kong proxy tới |
|---|---|---|
| auth-service | `3003` (`apps/auth-service/src/config/app.config.ts`) | `3300` |
| user-service | `3006` (`apps/user-service/src/main.ts`) | `3301` |

Sửa bằng cách thêm vào `.env` (hiện **không có** biến nào trong số này):

```dotenv
AUTH_SERVICE_HOST=0.0.0.0
AUTH_SERVICE_PORT=3300
USER_SERVICE_HOST=0.0.0.0
USER_SERVICE_PORT=3301
MICROSERVICE_NAME=AuthService
```

`MICROSERVICE_NAME` là bắt buộc: `apps/auth-service/src/app.module.ts` truyền `validate` vào `ConfigModule.forRoot`, và hàm này validate với `skipMissingProperties: false` — thiếu biến là **throw ngay lúc boot**.

### Bước 2 — Sửa `jwt_secrets` trong Kong config

Hiện đang sai cú pháp — là list gồm 3 object một-key:

```yaml
# SAI
jwt_secrets:
  - algorithm: HS256
  - key: auth-service
  - secret: ${JWT_SECRET}
```

Phải là **một** object ba key:

```yaml
# ĐÚNG
jwt_secrets:
  - algorithm: HS256
    key: auth-service
    secret: <giá trị JWT_SECRET>
```

Thêm nữa: `${JWT_SECRET}` **không tự được thay thế**. Kong chỉ interpolate khi bật env templating (`KONG_DECLARATIVE_CONFIG` + biến dạng `${{ env "KONG_JWT_SECRET" }}`). Cách đơn giản nhất khi dev: điền secret thẳng vào file và không commit.

### Bước 3 — Sửa path cho khớp controller thật

Route Kong trỏ tới `/api/auth/login`, `/api/auth/register`, `/swagger`. Nhưng:

- `setGlobalPrefix` **không xuất hiện ở đâu** trong repo -> path thật là `/auth/login`, `/auth/register`.
- `SwaggerModule.setup()` **không được gọi** -> `/swagger` không tồn tại (dù decorator `@ApiTags` có dùng).

Chọn một trong hai:

- **A.** Sửa `replace.uri` trong `kong-dev.yaml` thành `/auth/login`, `/auth/register`; bỏ route `auth-swagger`.
- **B.** Thêm `app.setGlobalPrefix('api')` vào `apps/auth-service/src/main.ts` và setup Swagger.

Khuyến nghị **A** — ít thay đổi code hơn, và giữ path rewriting nằm ở gateway.

Cũng nên nhất quán cách rewrite: route tường minh dùng `strip_path: false` + `request-transformer`, còn catchall dùng `strip_path: true`. Hai cơ chế cho cùng một việc.

Ngoài ra plugin `request-transformer` toàn cục đang set `"X-JWT-CLAIMS: $(jwt_claims)"` — `$(jwt_claims)` **không phải biến hợp lệ** của Kong. Plugin `auth-context` mới là cái thực sự set header. Nên xoá `transform_jwt_claims` để tránh ghi đè lẫn nhau.

### Bước 4 — Thêm Kong vào docker-compose

Chưa có compose file nào chạy Kong, và cổng proxy/admin (8000/8001) chưa được định nghĩa ở đâu. Thêm vào `docker-compose.provider.yaml`:

```yaml
  kong:
    image: kong:3.7
    container_name: pulse-kong
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /kong/kong-dev.yaml
      KONG_PLUGINS: bundled,auth-context
      KONG_LUA_PACKAGE_PATH: /kong/plugins/?.lua;;
      KONG_PROXY_LISTEN: 0.0.0.0:8000
      KONG_ADMIN_LISTEN: 0.0.0.0:8001
      KONG_LOG_LEVEL: info
    ports:
      - "8000:8000"   # proxy
      - "8001:8001"   # admin API
    volumes:
      - ./apps/config/kong:/kong:ro
    networks:
      - threads-network
```

Custom plugin phải nằm ở `/kong/plugins/auth-context/handler.lua` để `KONG_LUA_PACKAGE_PATH` resolve được `kong.plugins.auth-context.handler` — cấu trúc thư mục hiện tại đã đúng.

Kiểm tra config trước khi chạy:

```bash
docker run --rm -v "$PWD/apps/config/kong:/kong:ro" kong:3.7 kong config parse /kong/kong-dev.yaml
```

### Bước 5 — Thêm 2 service vào compose

Hostname trong Kong config (`auth-service`, `user-service`) phải khớp **tên service trong compose**, vì Kong resolve qua DNS của Docker network. Chính comment trong file cũng ghi: `# đổi đúng tên container/host thật trong docker-compose`.

Lưu ý `Dockerfile` ở root đang build **monolith cũ** (copy `package.json`, `prisma/`, `template/` từ root — đều không còn), và `CMD` trỏ `dist/src/server.js`. Cần Dockerfile riêng cho từng service, hoặc một Dockerfile nhận `--build-arg SERVICE=auth-service`.

```yaml
  auth-service:
    build:
      context: .
      args:
        SERVICE: auth-service
    container_name: pulse-auth-service
    env_file: .env
    expose:
      - "3300"        # expose, KHÔNG ports — xem Bước 6
    depends_on: [mysql, redis]
    networks: [threads-network]

  user-service:
    build:
      context: .
      args:
        SERVICE: user-service
    container_name: pulse-user-service
    env_file: .env
    expose:
      - "3301"
    depends_on: [mysql, redis]
    networks: [threads-network]
```

### Bước 6 — Khoá đường vào trực tiếp

Dùng `expose:` chứ **không** `ports:` cho hai service. `ports:` publish ra host, cho phép bypass Kong và tự set `X-JWT-CLAIMS` -> mạo danh user.

Hai việc nên làm thêm:

- Thay `app.enableCors()` (đang cho phép mọi origin) bằng whitelist từ `CORS_ORIGIN`.
- Cho Kong strip `X-JWT-CLAIMS` từ request của client trước khi plugin set lại, tránh header injection từ ngoài.

### Bước 7 — Nối DI giữa hai service

`AuthModule` inject `AUTH_REPOSITORY` và `USER_SERVICE` nhưng **không import gì cả**:

```ts
@Module({
  controllers: [AuthController],
  providers: [ /* ... */ ],
})
export class AuthModule { }
```

User-service đã export sẵn đúng những token này (`apps/user-service/src/modules/user/user.module.ts`):

```ts
exports: [USER_SERVICE, AuthRepositoryModule],
```

Chọn hướng:

- **Ngắn hạn (in-process):** thêm `imports: [UserModule]` vào `AuthModule`, và thêm `PrismaModule` cho auth-service (hiện auth-service **không có** `PrismaModule`, nên `PrismaService` không được provide ở đâu).
- **Dài hạn (gRPC thật):** implement `user.proto` — user-service mở gRPC server bằng `app.connectMicroservice`, auth-service đăng ký `ClientsModule` với `Transport.GRPC`, rồi thay các `@Inject(USER_SERVICE)` bằng gRPC client. Lúc đó `Symbol` token phải đổi thành string token.

### Bước 8 — Sửa alias dangling

Các alias sau trỏ vào `apps/api/src` **đã bị xoá** (commit `d9b8490`) nhưng vẫn được import:

| Alias | Ai đang import |
|---|---|
| `@api/*` | user-service `app.module.ts` (`JwtModule`) và 5 service khác |
| `@/shared/database/*`, `@/*` | nhiều service |
| `apps/api/generated/prisma` | `apps/user-service/src/modules/auth/repository/auth.repository.ts:1` |
| `@auth-service/modules/ability/*` | user-service `group-team` — module không tồn tại |
| `@libs/cache/*`, `@/util/*` | thư mục không tồn tại |

Build hiện đang **hỏng** vì những import này.

Một cái bẫy nữa khi đọc code: `@libs/core/config/*` và `@libs/core/constants/*` resolve vào **`libs/common`**, không phải `libs/core`.

---

## 5. Kiểm tra sau khi dựng xong

```bash
# 1. Kong sống chưa
curl -i http://localhost:8001/status

# 2. Route public — không cần token, phải trả 200/201
curl -i -X POST http://localhost:8000/auth-service/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"a@b.com","password":"secret"}'

# 3. Route cần auth, không token — phải trả 401
curl -i http://localhost:8000/auth-service/auth/me

# 4. Route cần auth, có token — phải trả 200
curl -i http://localhost:8000/auth-service/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 5. Rate limit trên login — request thứ 6 trong 1 phút phải trả 429
for i in $(seq 1 6); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST \
    http://localhost:8000/auth-service/auth/login \
    -H 'Content-Type: application/json' -d '{}'
done

# 6. Qua user-service
curl -i http://localhost:8000/user-service/users/someusername
```

### Debug khi 401

Theo thứ tự:

1. Token có claim `iss: "auth-service"`? Thiếu -> Kong không tìm được consumer.
2. `secret` trong Kong config có khớp `JWT_SECRET` của app? Lệch -> verify fail.
3. Token có `type: "access_token"` và `key: "auth-service"`? Thiếu -> `GrpcGatewayAuthStrategy` reject dù Kong đã pass.
4. Header `X-JWT-CLAIMS` có tới service không? Log nó ra ở strategy. Nếu là `"{}"` thì Kong coi request là anonymous.
5. Route có cần `@IsPublic()` không? Guard là `APP_GUARD` toàn cục, mặc định **mọi** route đều yêu cầu auth.

Một điểm đáng biết: phần check token bị revoke trong Redis ở `BaseGatewayAuthStrategy` **đang bị comment out**. Nên logout hiện chưa thực sự vô hiệu hoá access token.

---

## 6. Bảng cổng

| Cổng | Dùng cho | Khai báo ở |
|---|---|---|
| 8000 | Kong proxy | *chưa có — cần thêm* |
| 8001 | Kong admin API | *chưa có — cần thêm* |
| 3300 | auth-service HTTP | `kong-dev.yaml`; app default là 3003 |
| 3301 | user-service HTTP | `kong-dev.yaml`; app default là 3006 |
| 3308 | MySQL (host) | `docker-compose.provider.yaml` -> 3306 trong container |
| 6379 | Redis | `docker-compose.provider.yaml` (bind `127.0.0.1`) |
| 5540 | RedisInsight UI | `docker-compose.provider.yaml` |
| 27018 | MongoDB (host) | `docker-compose.provider.yaml` -> 27017 trong container |
| 6001 | Soketi websocket | cả hai compose file |
| 3302 | monolith cũ | `.env` (`PORT`), `docker-compose.yml` |

Không có cổng gRPC nào được định nghĩa ở đâu.

---

## 7. File cần biết

| Đường dẫn | Nội dung |
|---|---|
| `apps/config/kong/kong-dev.yaml` | Kong declarative config |
| `apps/config/kong/plugins/auth-context/handler.lua` | Encode JWT claims -> `X-JWT-CLAIMS` |
| `apps/libs/core/src/auth/strategies/base-gateway.startegies.ts` | Parse `X-JWT-CLAIMS` (tên file sai chính tả trong repo) |
| `apps/libs/core/src/auth/strategies/grpc-gate.startegies.ts` | Validate claims `type`/`key` |
| `apps/libs/core/src/auth/guards/auth.guard.ts` | `AppAuthGuard`, xử lý `@IsPublic()` |
| `apps/libs/common/src/enums/jwt.enum.ts` | `JWT_ISSUER`, `JwtTokenType` |
| `apps/libs/common/src/config/jwt.config.ts` | Cấu hình sign token |
| `apps/libs/common/src/interfaces/auth.interface.ts` | `TokenPayload`, `UserRequestPayload` |
| `apps/libs/common/src/grpc/proto/user.proto` | Bản nháp gRPC contract (chưa dùng) |
| `apps/auth-service/src/main.ts` | Bootstrap (chỉ HTTP) |
| `apps/user-service/src/main.ts` | Bootstrap (chỉ HTTP) |
| `apps/user-service/src/modules/user/service/user.service.ts` | Interface `UserService` mà auth-service consume |

---

## 8. Thứ tự làm việc gợi ý

1. Bước 8 (sửa alias dangling) — **trước tiên**, vì build đang hỏng, chưa chạy được gì.
2. Bước 7 hướng in-process + Bước 1 (cổng) -> chạy được 2 service riêng lẻ.
3. Bước 2, 3 (sửa Kong config) -> config parse được.
4. Bước 4, 5, 6 (compose + khoá cổng) -> chạy end-to-end.
5. Mục 5 (kiểm tra) -> xác nhận luồng auth đúng.
6. Bước 7 hướng gRPC — sau cùng, khi mọi thứ đã xanh.
