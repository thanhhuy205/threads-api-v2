# 3 task cần bạn tự code (kèm mẫu để học nhanh)

Đây là 3 quyết định tôi **cố tình không làm hộ** vì chúng là phần đáng giá nhất khi đi phỏng vấn. Mỗi task có: bối cảnh đã verify, câu hỏi phỏng vấn thật, các hướng kèm trade-off, và mẫu code ngắn để bạn bám theo.

Trạng thái hiện tại: `pnpm build:auth-service` **PASS**. `pnpm build:user-service` **FAIL đúng 5 lỗi** = Task 1 (3 lỗi) + Task 2 (2 lỗi). Task 3 không phải lỗi compile — là lỗi lúc boot.

---

## Task 1 — Ai sở hữu `RefreshToken`? (3 lỗi)

```text
auth.repository.impl.ts(39,23): Property 'refreshToken' does not exist on type 'PrismaService'
auth.repository.impl.ts(45,24): ...
auth.repository.impl.ts(52,23): ...
```

### Bối cảnh (đã verify)

| | auth-service schema | user-service schema |
|---|---|---|
| Model | `Role`, `UserRole`, `Permission`, `RolePermission`, `VerificationCode`, **`RefreshToken`** | **`User`**, `UserPosition`, `PositionPermission`, `Permission`, `HistoryPosition`, `Skill`, `GroupTeam`, `UserTeam` |
| Prisma client | `apps/auth-service/generated/prisma` | `apps/user-service/generated/prisma` |

`AuthRepositoryImpl` nằm trong **user-service** nhưng gọi cả hai:

- `this.prisma.user.*` (dòng 18, 30, 59, 66, 73) → chỉ có ở user-service client ✅
- `this.prisma.refreshToken.*` (dòng 39, 45, 52) → chỉ có ở auth-service client ❌

**Điểm mấu chốt đã verify:** cả 2 `schema.prisma` đều dùng `datasource db { provider = "mysql" }` và URL được truyền lúc runtime qua `PrismaMariaDb` adapter. Cả hai đang đọc cùng `DB_NAME = pulseboard_api`, nên hiện tại 2 Prisma client khác nhau đang trỏ vào **cùng một database vật lý**. Đây chưa phải database-per-service thật; hiện tại gần với schema-per-service/client-per-service hơn.

> `CONNECT-SERVICES.md` mục 2 đang ghi sai chỗ này nếu nó nói user-service sở hữu `RefreshToken`.

### Câu hỏi phỏng vấn

> "Khi tách microservice, `RefreshToken` nên thuộc service nào? Vì sao?"

Câu trả lời tốt: **theo bounded context, không theo foreign key.** `RefreshToken` là artifact của phiên đăng nhập → auth-service. `User` là profile → user-service. `RefreshToken.userId` trỏ tới `User` không có nghĩa hai model phải cùng service; ở ranh giới microservice, quan hệ cross-service nên được nhìn như **ID reference**, không phải object relation/FK mà application code dựa vào trực tiếp.

### Ba hướng

**A. Chuyển AuthRepositoryImpl sang auth-service, tách làm 2 (khuyến nghị)**

Mỗi repository chỉ nói chuyện với Prisma client của chính nó:

```ts
// apps/auth-service/src/modules/auth/repository/refresh-token.repository.ts
export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');

export interface RefreshTokenRepository {
  create(payload: CreateRefreshTokenPayload): Promise<void>;
  findByToken(token: string): Promise<RefreshTokenRecord | null>;
  revokeById(id: number, revokedAt: Date): Promise<void>;
}
```

```ts
@Injectable()
export class RefreshTokenRepositoryImpl implements RefreshTokenRepository {
  // PrismaService CUA auth-service: @auth-service/prisma/prisma.service
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateRefreshTokenPayload): Promise<void> {
    await this.prisma.refreshToken.create({ data: payload });
  }
}
```

Phần user/password thì auth-service **không tự đọc** — hỏi user-service (xem Task 3).

Trade-off: đúng kiến trúc nhất, nhưng phải sửa AuthServiceImpl để dùng 2 dependency thay vì 1.

**B. Chuyển model RefreshToken sang user-service schema**

Nhanh nhất: copy block `model RefreshToken` (dòng 86-101 của auth schema) sang user schema, xoá khỏi auth schema, chạy lại `prisma generate`.

Nếu bảng vật lý đã tồn tại và cấu trúc bảng **không đổi**, việc chuyển model giữa hai Prisma schema chỉ để đổi client/ownership có thể không cần data migration. Nhưng phải thống nhất **một nơi duy nhất sở hữu migration của bảng `RefreshToken`**; nếu cả hai service cùng tạo migration cho cùng bảng thì rất dễ tạo migration history lệch nhau.

Trade-off: auth-service không còn tự quản session của chính nó — logout/revoke phải gọi sang user-service. Sai bounded context, nhưng compile nhanh.

**C. Merge 2 schema thành 1**

Trade-off: từ bỏ microservice ở tầng dữ liệu. Chỉ chọn nếu bạn xác định đây là modular monolith.

### Học nhanh nhất

Vẽ ra giấy 2 ô (auth / user), điền model vào, rồi kẻ mũi tên cho mỗi lời gọi `this.prisma.*` trong `auth.repository.impl.ts`. Mũi tên nào **băng qua** ranh giới ô chính là chỗ vỡ. Đây đúng là bài tập người phỏng vấn muốn thấy bạn làm được.

### Tiêu chí hoàn thành

- `RefreshToken` chỉ có **một owner** rõ ràng.
- Repository của mỗi service chỉ dùng Prisma client thuộc service đó.
- Không để hai service cùng sở hữu migration của bảng `RefreshToken`.
- `pnpm build:auth-service` và `pnpm build:user-service` đều pass sau khi tách.

---

## Task 2 — AbilityModule không tồn tại + phụ thuộc vòng (2 lỗi)

```
group-team.module.ts(4,31): Cannot find module @auth-service/modules/ability/ability.module
group-team.service.impl.ts(7,54): Cannot find module @auth-service/modules/ability/service/ability.service
```

### Bối cảnh (đã verify)

'apps/auth-service/src/modules/' chỉ có 'auth/' — module 'ability' bị xoá cùng 'apps/api' ở commit d9b8490.

Chỗ dùng, trong 'group-team.service.impl.ts':

```ts
@Inject(ABILITY_SERVICE) private readonly abilityService: AbilityService,  // dòng 38
...
await this.abilityService.assertCan(...)  // dòng 42 và 76
```

**Đây là phụ thuộc vòng:** auth-service đã import từ user-service ('auth.service.impl.ts:18-19'), giờ user-service lại import từ auth-service. Vòng tròn.

### Câu hỏi phỏng vấn

> Logic phân quyền (authorization) nên đặt ở đâu trong hệ microservice?

Phân biệt được 2 khái niệm là điểm cộng lớn:

- **Authentication** (bạn là ai) — tập trung, ở gateway/auth-service. Repo này làm đúng: Kong verify JWT.
- **Authorization** (bạn được làm gì) — **thuộc về service sở hữu resource**. GroupTeam là resource của user-service, nên rule ai được sửa team thuộc user-service.

### Ba hướng

**A. Chuyển AbilityService vào chính user-service (khuyến nghị)**

```ts
// apps/user-service/src/modules/ability/ability.service.ts
export const ABILITY_SERVICE = Symbol('ABILITY_SERVICE');

export interface AbilityService {
  assertCan(userId: string, action: Action, subject: Subject, resource?: unknown): Promise<void>;
}
```

Rule về GroupTeam nằm cùng chỗ với data về GroupTeam, cắt được vòng, và không cần network call mỗi lần check quyền.

Trade-off: nếu sau này service khác cũng cần cùng rule thì bị lặp.

**B. Đưa AbilityService vào apps/libs/core làm shared lib**

Chỉ để engine (CASL) ở lib, còn rule cụ thể do mỗi service tự định nghĩa và nạp vào.

Trade-off: cắt được vòng và tái dùng được engine, nhưng shared lib dễ phình thành distributed monolith nếu nhét cả rule vào.

**C. Nhúng permission vào JWT claim**

Plugin auth-context đã đẩy 'role' xuống service qua X-JWT-CLAIMS rồi. Có thể thêm 'permissions: [...]' vào token, service chỉ đọc, không cần AbilityService gọi DB.

Trade-off: **token phình to**, và permission bị *stale* — thu hồi quyền không có hiệu lực đến khi token hết hạn. Nói được nhược điểm này là ăn điểm.

### Học nhanh nhất

Tự trả lời: *Nếu tôi thêm post-service, nó có cần biết rule của GroupTeam không?* Nếu **không** thì rule thuộc user-service (hướng A). Nếu **có** thì chỉ nên share phần engine/contract thật sự dùng chung, không kéo rule cụ thể sang shared lib.

### Tiêu chí hoàn thành

- `user-service` không còn import `@auth-service/modules/ability/...`.
- Rule authorization của `GroupTeam` nằm cùng bounded context với `GroupTeam`.
- Shared lib (nếu có) chỉ chứa primitive/engine dùng chung, không chứa rule business của từng service.
- Build pass mà không cần import vòng auth-service ↔ user-service.

---

## Task 3 — Nối DI giữa 2 service (Bước 7 của doc)

Không phải lỗi compile — là lỗi **runtime lúc boot**.

### Bối cảnh (đã verify)

'apps/auth-service/src/modules/auth/auth.module.ts' hiện tại:

```ts
@Module({
  controllers: [AuthController],
  providers: [
    { provide: VERIFICATION_REPOSITORY, useClass: VerificationRepositoryImpl },
    { provide: AUTH_SERVICE, useClass: AuthServiceImpl },
    RefreshTokenStrategy,
  ],
  // KHÔNG có imports
})
export class AuthModule { }
```

Nhưng AuthServiceImpl inject 2 token từ user-service ('auth.service.impl.ts:50,53'):

```ts
@Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
@Inject(USER_SERVICE)   private readonly userService: UserService,
```

Nest sẽ throw 'Nest cannot resolve dependencies of AuthServiceImpl' ngay lúc boot.

**Bằng chứng coupling ở compile-time:** sau khi build, có thư mục 'dist/apps/auth-service/apps/user-service/' — tức compile auth-service **kéo theo cả source của user-service**. Đây là in-process import, không phải RPC.

### Câu hỏi phỏng vấn

> Hai service của bạn giao tiếp thế nào? Vì sao chọn cách đó?

Điểm cần nhìn đúng: `USER_SERVICE` là **DI token local của Nest**. Việc token là `Symbol` **không tự chứng minh** đây có hay không có RPC; DI token không phải payload được serialize qua mạng. Nest hỗ trợ cả string lẫn `Symbol` làm provider token.

Bằng chứng coupling ở repo này nằm ở chỗ **auth-service đang inject trực tiếp implementation/contract từ user-service và build kéo source user-service vào dist**. Khi chuyển sang RPC thật, ranh giới phải xuất hiện qua transport/client (`ClientGrpc`, `.proto`, handler gRPC...), thay vì import service implementation trực tiếp.

### Hai hướng

**A. In-process (làm trước, để chạy được)**

```ts
@Module({
  imports: [UserModule],   // user.module.ts đã export sẵn: [USER_SERVICE, AuthRepositoryModule]
  controllers: [AuthController],
  providers: [ /* như cũ */ ],
})
export class AuthModule { }
```

Tôi đã dọn sẵn đường: PrismaModule của auth-service **đã tạo và đăng ký** (trước đó chỉ có prisma.service.ts mà không module nào provide nó, nên inject sẽ fail).

Trade-off: chạy ngay, nhưng thực chất là **modular monolith mặc áo microservice**. Deploy vẫn phải deploy chung.

**B. gRPC thật (làm sau, khi mọi thứ đã xanh)**

'apps/libs/common/src/grpc/proto/user.proto' đã có bản nháp: package user, service UserService, 3 RPC (GetUser, GetUserByEmail, FindExistingIds). Chưa load ở đâu (đã verify: không có @GrpcMethod, ClientsModule, connectMicroservice nào trong repo).

Phía user-service — mở thêm gRPC server cạnh HTTP:

```ts
// user-service/src/main.ts
app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.GRPC,
  options: {
    package: 'user',
    protoPath: join(__dirname, '../../libs/common/src/grpc/proto/user.proto'),
    url: '0.0.0.0:5001',
  },
});
await app.startAllMicroservices();
```

```ts
// controller phía user-service
@GrpcMethod('UserService', 'GetUserByEmail')
async getUserByEmail(data: { email: string }) {
  return this.userService.findByEmail(data.email);
}
```

Phía auth-service — đăng ký client:

```ts
@Module({
  imports: [
    ClientsModule.register([{
      name: 'USER_PACKAGE',              // string token, KHÔNG phải Symbol
      transport: Transport.GRPC,
      options: { package: 'user', protoPath: '...', url: 'user-service:5001' },
    }]),
  ],
})
```

**Ba thay đổi quan trọng khi sang gRPC** (phần học sâu):

1. Dependency in-process (`UserService`) → **RPC contract + gRPC client**. DI token ở phía auth-service vẫn chỉ là token local của Nest; dùng string hay `Symbol` là quyết định DI, không phải serialization qua mạng.
2. Proxy lấy từ `ClientGrpc#getService()` thường được khai báo method trả về **`Observable`**. Nếu application/domain layer của bạn đang dùng `Promise`, có thể bọc tại adapter bằng `firstValueFrom()` để không làm RxJS lan khắp business logic.
3. **Không còn transaction xuyên service.** Nếu `register()` đang tạo `User` + `RefreshToken` trong một transaction, khi tách thành hai process thì mất atomic transaction đó → phải thiết kế orchestration/saga, compensation, hoặc chấp nhận eventual consistency.

Điểm 3 là câu hỏi phỏng vấn quan trọng nhất trong phần này.

Về Docker Compose: user-service phải **listen** trên `0.0.0.0:5001` và auth-service phải cùng network để gọi `user-service:5001`. `expose: 5001` có thể thêm để mô tả/document port nội bộ, nhưng **không bắt buộc** để hai container cùng Compose network giao tiếp. Chỉ cần `ports:` khi muốn publish port ra host.

### Học nhanh nhất

Làm hướng A trước để thấy hệ chạy end-to-end. Sau đó chuyển **đúng một** method (`findByEmail`) sang gRPC. Tập trung quan sát ba thay đổi thật sự: direct call → network contract, adapter `Observable` ↔ `Promise`, và transaction/local failure → distributed failure.

### Tiêu chí hoàn thành

- auth-service không import implementation của `UserService` để gọi trực tiếp.
- `findByEmail` đi qua `ClientGrpc` + `.proto` + `@GrpcMethod`.
- Có mapping rõ từ gRPC response DTO sang model/application DTO của auth-service.
- Có xử lý tối thiểu cho `UNAVAILABLE`/timeout thay vì để lỗi transport rò thẳng vào business layer.
- Build auth-service không còn kéo source implementation của user-service vào output chỉ để thực hiện call runtime.

---

## Thứ tự gợi ý

1. **Task 1 hướng B** (copy model RefreshToken sang user schema) — build xanh trong 5 phút, để có cái chạy.
2. **Task 2 hướng A** — cắt phụ thuộc vòng.
3. **Task 3 hướng A** — rồi docker compose up, chạy smoke test ở mục 5 của CONNECT-SERVICES.md.
4. Quay lại **Task 1 hướng A** (đúng kiến trúc) rồi **Task 3 hướng B** (gRPC) — lúc này đã có baseline xanh, đổi gì vỡ gì thấy ngay.

Làm ngược (gRPC trước) sẽ rất khó debug vì không biết lỗi do gRPC hay do 5 lỗi cũ.

## Bổ sung nên có trước khi coi phần microservice là hoàn chỉnh

Các điểm dưới đây không phải lỗi compile hiện tại, nhưng nên có trong learning checklist:

1. **Contract ownership:** `.proto` là contract giữa hai service; tránh import entity/Prisma type của service khác qua ranh giới RPC.
2. **Error mapping:** map lỗi domain (`UserNotFound`, `Forbidden`...) sang gRPC status phù hợp, rồi map ngược về lỗi application/HTTP ở caller.
3. **Timeout/deadline:** mọi RPC nội bộ cần giới hạn thời gian chờ; không để auth request treo vô hạn khi user-service có vấn đề.
4. **Idempotency/compensation:** flow tạo dữ liệu ở nhiều service phải trả lời được câu hỏi "service thứ hai fail sau khi service thứ nhất đã commit thì xử lý thế nào?"
5. **Observability:** log `requestId/correlationId` qua HTTP → gRPC để trace một request xuyên service.
6. **Migration ownership:** mỗi bảng/database object phải có đúng một service chịu trách nhiệm migration, kể cả khi hiện tại các service vẫn dùng chung physical DB.

Nếu trả lời được 6 điểm này cùng 3 task phía trên, phần "microservice" trong repo sẽ thuyết phục hơn nhiều khi phỏng vấn.
