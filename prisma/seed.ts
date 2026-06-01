
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import {
//     CircleInvitationStatus,
//     NotificationType,
//     PostMediaStatus,
//     PostMediaType,
//     PostType,
//     PrismaClient,
//     ReplyPermission,
//     RequestStatus,
//     RoleMembership,
//     UserStatus,
//     Visibility,
//     VisibilityPost,
// } from "@prisma/client";
// import bcrypt from "bcrypt";
// import dotenv from "dotenv";
// dotenv.config();

// // ─── Prisma setup ─────────────────────────────────────────────────────────────

// const adapter = new PrismaMariaDb({
//     port: Number(process.env.DB_PORT) || 3306,
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASSWORD || "password",
//     database: process.env.DB_NAME || "threads_api",
// });

// const prisma = new PrismaClient({ adapter } as any);

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function pick<T>(arr: T[]): T {
//     return arr[Math.floor(Math.random() * arr.length)];
// }

// function rand(min: number, max: number) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function randomDate(daysAgo: number): Date {
//     return new Date(Date.now() - Math.random() * daysAgo * 86_400_000);
// }

// function shuffle<T>(arr: T[]): T[] {
//     return [...arr].sort(() => Math.random() - 0.5);
// }

// function slugify(str: string): string {
//     return str
//         .normalize("NFD")
//         .replace(/[\u0300-\u036f]/g, "")
//         .replace(/đ/g, "d")
//         .replace(/Đ/g, "D")
//         .replace(/[^a-zA-Z0-9]/g, "")
//         .toLowerCase();
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // PART 1 — USER DATA
// // ═══════════════════════════════════════════════════════════════════════════════

// const AVATAR_URLS: string[] = [
//     "https://i.pinimg.com/originals/d1/8f/5b/d18f5b44b66fba28d40457328ead9d30.jpg",
//     "https://i.pinimg.com/originals/cd/76/c1/cd76c1b453faa343c1321b1256ad751c.jpg",
//     "https://i.pinimg.com/originals/a3/3c/d3/a33cd3e235d0d99723d6029f9ce5ebe4.jpg",
//     "https://i.pinimg.com/originals/a5/05/c0/a505c0583fb1dcf532ed7e6fbe6dd8f6.webp",
//     "https://i.pinimg.com/originals/5b/f1/40/5bf140a56a1c537b39d48fb4fef65ab5.jpg",
//     "https://i.pinimg.com/originals/20/1c/78/201c789712ee3fd2ec4e9f0c0fcb1bcd.jpg",
//     "https://i.pinimg.com/originals/59/f7/61/59f76117bb98955e1ec56f6d77ec7b69.jpg",
//     "https://i.pinimg.com/originals/9c/02/88/9c0288f5841e09a599a5ab9c96ddfc92.jpg",
//     "https://i.pinimg.com/originals/5e/d3/63/5ed3634cf5f2677db1782d61ffcfa4e0.jpg",
//     "https://i.pinimg.com/originals/82/d0/48/82d048c108faa43c12760c27582d183a.jpg",
//     "https://i.pinimg.com/originals/ee/21/59/ee2159b0017f0ae750cb54e21460dd33.png",
//     "https://i.pinimg.com/originals/fe/15/0c/fe150c7a7694d59407fd0ce07153859e.jpg",
//     "https://i.pinimg.com/originals/4b/95/a3/4b95a38f46ada31c30e56560ba2dd7ac.jpg",
//     "https://i.pinimg.com/originals/6c/4f/d8/6c4fd86073d801cdb2a9bf032af5afcc.jpg",
//     "https://i.pinimg.com/originals/a2/32/9f/a2329fa8334cb9e983cb01a802546ae5.webp",
//     "https://i.pinimg.com/originals/cc/4b/fa/cc4bfa89519b248ae17169e31883b5ef.jpg",
//     "https://i.pinimg.com/originals/68/f5/c7/68f5c7129712927bbda81a8a5b816770.jpg",
//     "https://i.pinimg.com/originals/c1/79/98/c17998c6f8f204380a2b3d8c1dc092f5.jpg",
//     "https://i.pinimg.com/originals/9e/b0/21/9eb02170fd7664fa7058d0dc6551fc76.jpg",
//     "https://i.pinimg.com/originals/9d/ee/98/9dee98f23eacfca16fcc32dbf21b9575.jpg",
//     "https://i.pinimg.com/originals/46/e9/8d/46e98df8cc0809e0c8cffc9d25f5c9a9.jpg",
//     "https://i.pinimg.com/originals/ca/ea/24/caea241101fad2b062388eca42d751db.jpg",
//     "https://i.pinimg.com/originals/5b/5e/a2/5b5ea26e857436c9b6c4c0529da02865.jpg",
//     "https://i.pinimg.com/originals/28/c1/a4/28c1a4607bcfaf0a6d4bcde5eb79836f.jpg",
//     "https://i.pinimg.com/originals/ed/4e/d5/ed4ed5aae5d4d07dba9dda0c74e9f8cc.jpg",
//     "https://i.pinimg.com/originals/c7/b5/96/c7b59611ce207208020aca71b77036a1.jpg",
//     "https://i.pinimg.com/originals/ca/67/6c/ca676c76d25d88c26cd0c195d6512121.jpg",
//     "https://i.pinimg.com/originals/86/66/64/866664ac3c70e9ce855fdf2b4564123e.jpg",
//     "https://i.pinimg.com/originals/35/8b/bd/358bbd2d2ebcefc3155571cc298b7a5b.jpg",
//     "https://i.pinimg.com/originals/2f/b0/11/2fb01126cde4fa7b4d4f5c209c7cb0a3.jpg",
//     "https://i.pinimg.com/originals/59/76/89/597689a248a2917b8f33d29e9da44339.jpg",
//     "https://i.pinimg.com/originals/b1/a7/26/b1a726141d0f9fbc27853e6ea3cfca68.jpg",
//     "https://i.pinimg.com/originals/a8/a6/b2/a8a6b29a4f2a1776307c6fc9b417357f.jpg",
//     "https://i.pinimg.com/originals/8d/38/49/8d384976598739555acb9a1a70fa75e9.jpg",
//     "https://i.pinimg.com/videos/thumbnails/originals/2b/79/2b/2b792b371737115e99d329849018aa53.0000000.jpg",
//     "https://i.pinimg.com/originals/3f/ce/d5/3fced55f8a60375e33edea6974a011d3.jpg",
//     "https://i.pinimg.com/originals/d1/e5/73/d1e5739d4444d8522cc228aa6430a8b0.jpg",
//     "https://i.pinimg.com/originals/a5/23/25/a523255d511831327f121c44e6c8d18e.jpg",
//     "https://i.pinimg.com/originals/34/d8/4e/34d84e8482a8cf3f298f78c0e172f4b2.jpg",
//     "https://i.pinimg.com/originals/1d/98/53/1d985338e42a0e18b85d522fa30a47a3.jpg",
//     "https://i.pinimg.com/originals/61/10/38/6110381656d3a0c3f4286b60275cb16a.jpg",
//     "https://i.pinimg.com/originals/3f/d2/d0/3fd2d08ba9be8bb0ce34d5a7df6da92c.jpg",
//     "https://i.pinimg.com/originals/31/1b/c8/311bc8eacb32540dbc6689ba45953c15.jpg",
//     "https://i.pinimg.com/originals/47/9b/c9/479bc9177c162ffdcbe2458a1864abcb.jpg",
//     "https://i.pinimg.com/originals/1e/83/f7/1e83f737df3e2fc42a552ec0175d527d.jpg",
//     "https://i.pinimg.com/originals/28/df/69/28df69381de173d03e8f7a1fe7bed27f.jpg",
//     "https://i.pinimg.com/originals/7e/85/c4/7e85c4e31bd0fc4d89839cd5b88aa009.png",
//     "https://i.pinimg.com/originals/0f/6b/7b/0f6b7b8726af4b0c5bd09c19859274c6.jpg",
//     "https://i.pinimg.com/originals/42/63/69/4263690a3f5d31b46d4892ddeaf96f81.jpg",
//     "https://i.pinimg.com/originals/dd/b2/fd/ddb2fd5d36da69914a7d72932ccc506d.jpg",
//     "https://i.pinimg.com/originals/04/ea/51/04ea514ae2f4f28632f385ced6ed0775.jpg",
//     "https://i.pinimg.com/originals/83/55/cb/8355cb40707dd64b801a4ac6eb9a8284.jpg",
//     "https://i.pinimg.com/originals/68/4f/b8/684fb83057a3b953d95b60b9860cddf1.webp",
//     "https://i.pinimg.com/originals/d6/f2/0c/d6f20c1bcf1d61a5845633182a18eed1.jpg",
//     "https://i.pinimg.com/originals/19/c4/1b/19c41b52f04c6053e9af096f377c322b.jpg",
//     "https://i.pinimg.com/originals/dd/17/be/dd17bea19f6fbfbe729b365edd69bfc0.jpg",
//     "https://i.pinimg.com/originals/68/28/88/682888da2e4d941b5dfcdd9191cba5da.jpg",
//     "https://i.pinimg.com/originals/85/85/e0/8585e0fef089d6d3b0da6cd1e61eb0f2.jpg",
//     "https://i.pinimg.com/originals/e8/7e/c5/e87ec5015658ed6b6725e2787d234e18.jpg",
//     "https://i.pinimg.com/originals/f7/45/6b/f7456b75d8bcc98cbd68815af2da660a.jpg",
//     "https://i.pinimg.com/originals/85/cd/03/85cd038073ec1cc014ca269fac4951d4.jpg",
//     "https://i.pinimg.com/originals/e8/ea/e3/e8eae3ab8dcb315a06dafdacd1baf158.jpg",
//     "https://i.pinimg.com/originals/97/80/29/978029993317f587e006ce9c7825e80b.jpg",
//     "https://i.pinimg.com/originals/c8/7d/7b/c87d7bf33e8dc3fa64bfbb173cca2581.jpg",
//     "https://i.pinimg.com/originals/11/5d/96/115d9673d7d47900cabf3cdaacf5f6a4.jpg",
//     "https://i.pinimg.com/originals/4c/c8/3c/4cc83ca6629da759429b1ef798bdeff9.jpg",
//     "https://i.pinimg.com/originals/76/2f/8e/762f8e4712a637fcfac23628bb948a5e.jpg",
//     "https://i.pinimg.com/originals/d6/66/b4/d666b44223ce749174febb239471b645.jpg",
//     "https://i.pinimg.com/originals/3b/9e/c2/3b9ec21a273c8ad665b7ffaa64c9f124.jpg",
//     "https://i.pinimg.com/originals/50/b9/9e/50b99e257657b3c822ec9b0b3390657e.jpg",
//     "https://i.pinimg.com/originals/d6/83/44/d683444ab751e0bedd795c20f5939cbd.jpg",
//     "https://i.pinimg.com/originals/c1/18/5b/c1185b4c91153e49dfa34a698f915100.jpg",
//     "https://i.pinimg.com/originals/c7/5a/9f/c75a9f21cd274661d8c5e091173b8d6d.jpg",
//     "https://i.pinimg.com/originals/ee/44/40/ee44407da12cbca540f332047f561d34.webp",
//     "https://i.pinimg.com/originals/4f/e7/23/4fe723987cbde14899a779f602b499c0.jpg",
//     "https://i.pinimg.com/originals/a9/27/86/a9278669a73c3a1eba78e7f143707d47.jpg",
//     "https://i.pinimg.com/originals/2c/fc/9d/2cfc9d913b69abf8a0cb96e0380733df.jpg",
//     "https://i.pinimg.com/originals/be/58/f3/be58f3a5f00b615fefe7f941bb6ebc08.jpg",
//     "https://i.pinimg.com/originals/a8/8b/66/a88b6690ac9be418e243b86624f7e55a.jpg",
//     "https://i.pinimg.com/originals/5d/52/45/5d52455404dae5e84164dba67ad0d9c7.jpg",
//     "https://i.pinimg.com/originals/18/3b/f0/183bf0476b239559aa9566467ccd6b9e.jpg",
//     "https://i.pinimg.com/originals/a6/02/38/a60238ab7e119c58a7dceb43c1c6d9f0.jpg",
//     "https://i.pinimg.com/videos/thumbnails/originals/06/14/a2/0614a2215330756362b34ace323033b0.0000000.jpg",
//     "https://i.pinimg.com/originals/d3/70/d3/d370d3d1c6df923f3d5de004334b726b.jpg",
//     "https://i.pinimg.com/originals/e8/27/7f/e8277f3520abf777971aac4843070ebb.jpg",
//     "https://i.pinimg.com/originals/43/e2/f8/43e2f8a4cec699959c50ca73392ae910.jpg",
//     "https://i.pinimg.com/originals/c2/7d/53/c27d5362bcbf38dfd226e3f59e156979.jpg",
//     "https://i.pinimg.com/originals/d9/63/f0/d963f021876e718bf3825fe483cf5075.jpg",
//     "https://i.pinimg.com/originals/d0/ec/ed/d0eced80c4a6c5237b195af7a690f135.jpg",
//     "https://i.pinimg.com/originals/8c/25/41/8c2541fdea840c17a18e8762f01eeeff.jpg",
//     "https://i.pinimg.com/originals/ca/f3/95/caf395787e4e739ad1941aae397e64d7.jpg",
//     "https://i.pinimg.com/originals/5f/04/15/5f0415624c8715db2fdba7bf681b212a.webp",
//     "https://i.pinimg.com/originals/18/30/78/1830781f765acfa0eb0abb12cba03bdb.jpg",
//     "https://i.pinimg.com/originals/15/aa/35/15aa3592d52894a890e69b36102786aa.jpg",
//     "https://i.pinimg.com/originals/65/92/23/659223ed5e8277e9f07630920583c560.jpg",
//     "https://i.pinimg.com/originals/12/a2/b1/12a2b1056aa5ed93e372808c281c966d.jpg",
//     "https://i.pinimg.com/originals/87/77/52/877752eb6d9a84c0f06df1d1a967a3f7.jpg",
//     "https://i.pinimg.com/originals/5e/85/bb/5e85bb2f55d95e046f5304c482836993.jpg",
//     "https://i.pinimg.com/originals/2c/06/99/2c0699783aa5e2a66f9d8b33040c322f.jpg",
//     "https://i.pinimg.com/originals/1a/ca/5d/1aca5d79e863ee4e99c1667265260869.jpg",
//     "https://i.pinimg.com/originals/e9/56/72/e956723161326f2cc2b2581427fb540f.jpg",
//     "https://i.pinimg.com/originals/6d/c5/50/6dc550fe8e4f4c5e189d57380dd6c80c.jpg",
//     "https://i.pinimg.com/originals/c6/cc/da/c6ccdab46c3f0ed2ee77876f31223055.jpg",
//     "https://i.pinimg.com/originals/44/d0/4c/44d04cc8a9e47a104f6b904f7169f5ef.jpg",
//     "https://i.pinimg.com/originals/f3/65/19/f36519e6d605bda743f8f15f73b041de.jpg",
//     "https://i.pinimg.com/originals/a4/ae/76/a4ae76770e66a062c1f142150d543683.jpg",
//     "https://i.pinimg.com/originals/35/1c/aa/351caa1bd4d979e68d2d00f83cf12db5.png",
//     "https://i.pinimg.com/originals/e2/8f/6b/e28f6bf19ebfd8434e7421c6668b2651.jpg",
//     "https://i.pinimg.com/originals/72/d3/2d/72d32d91166250c69f44d35b1e31efa3.jpg",
//     "https://i.pinimg.com/originals/98/00/ac/9800ac56bce24cbe354495b925cd5f5f.jpg",
//     "https://i.pinimg.com/originals/49/01/19/490119ce28949550c11a0ee829ddd2ca.jpg",
//     "https://i.pinimg.com/originals/31/dd/09/31dd09514507f057df24b7395f7a3b05.jpg",
//     "https://i.pinimg.com/originals/d4/73/4b/d4734bf35f5fbc6ca8e45e22b5e522a1.jpg",
//     "https://i.pinimg.com/originals/5f/0a/6d/5f0a6d85acebfd71acf63b7eac5ae474.jpg",
//     "https://i.pinimg.com/originals/a5/f6/af/a5f6afa2b85b296824e4c8ea6b02ec1f.jpg",
//     "https://i.pinimg.com/originals/80/f6/d2/80f6d2921976a1b6c23edd0c54f0a42a.jpg",
//     "https://i.pinimg.com/originals/1c/11/13/1c1113b2e15a68280a6233a5dd12e6eb.jpg",
//     "https://i.pinimg.com/originals/47/cd/2c/47cd2ca42d20fcf7132d8e820a3b1f75.jpg",
//     "https://i.pinimg.com/originals/34/36/ed/3436ed0e6987b267a701a40bb2432aee.jpg",
//     "https://i.pinimg.com/originals/a7/4e/d9/a74ed9063849531e46038e23e3316534.jpg",
//     "https://i.pinimg.com/originals/96/12/56/961256820c381749d014c3a27162840a.jpg",
//     "https://i.pinimg.com/originals/1a/a1/a5/1aa1a55d2761aabcd21aba56c9b6651b.jpg",
//     "https://i.pinimg.com/originals/42/e1/ac/42e1ac11d966215c3372f37c696f7c09.jpg",
//     "https://i.pinimg.com/originals/9b/c8/57/9bc85793721fcae91f800a9adb13d0d3.jpg",
//     "https://i.pinimg.com/originals/39/5f/18/395f18e1a10d0824ec305dc366b8ae19.jpg",
//     "https://i.pinimg.com/videos/thumbnails/originals/7f/2c/67/7f2c675775bef9912124f2858a55e33e.0000000.jpg",
//     "https://i.pinimg.com/originals/1c/c1/b2/1cc1b2832ac4ad59ee930c66eae501a1.jpg",
//     "https://i.pinimg.com/originals/f4/22/39/f42239f610a9c0144f8b0a01a4326d5a.jpg",
//     "https://i.pinimg.com/originals/0f/7d/e0/0f7de099c9fecb3fc81b9b0e12dababe.jpg",
//     "https://i.pinimg.com/originals/37/cf/e4/37cfe44fabbdc2a9a5830f8c113d674d.jpg",
//     "https://i.pinimg.com/originals/6e/2a/5a/6e2a5a070580831bda87b54fda5988e8.jpg",
//     "https://i.pinimg.com/originals/37/25/9b/37259b7f0c497059aacc1e79f8bd8e93.webp",
//     "https://i.pinimg.com/originals/30/c6/87/30c68785ab240da71cece67b351dda29.jpg",
//     "https://i.pinimg.com/originals/81/21/d4/8121d4b30d58a96fd54fa5011aec2dd2.jpg",
//     "https://i.pinimg.com/originals/18/17/30/1817308f208a8e806e6b9953ea49490d.jpg",
//     "https://i.pinimg.com/originals/f2/7c/f7/f27cf718427080650bcb137a29be7c82.jpg",
//     "https://i.pinimg.com/originals/f9/ab/13/f9ab1305716c58265455dcbda15ab82d.jpg",
//     "https://i.pinimg.com/originals/8a/03/ae/8a03aedeb20082b03962cc1c8eac0842.jpg",
//     "https://i.pinimg.com/originals/08/9f/74/089f744dae132c5554566c9f8076c363.jpg",
//     "https://i.pinimg.com/originals/74/ca/a0/74caa00aed3b6d6f9b86a3500caedeea.jpg",
//     "https://i.pinimg.com/originals/ea/a8/74/eaa87411804c1770c3b327fce42091d7.jpg",
//     "https://i.pinimg.com/originals/71/9f/c6/719fc6bd65d84c97e2ec3d8b6e9edc7b.jpg",
//     "https://i.pinimg.com/originals/1b/ee/65/1bee6560bed8b11003461f63bd3eb1e3.jpg",
//     "https://i.pinimg.com/originals/2b/ea/5f/2bea5fb9ef9e285dd6ccf9cd1c92eb84.jpg",
//     "https://i.pinimg.com/originals/99/db/14/99db14f52a804a1c9f428c2b9ce54486.jpg",
//     "https://i.pinimg.com/originals/36/81/27/36812783dfd8e3444128cfe9cc05982f.jpg",
//     "https://i.pinimg.com/originals/48/6b/79/486b796b2ef72c8617cd1193163fd2fc.jpg",
//     "https://i.pinimg.com/originals/0e/fc/4c/0efc4ca70269c2248113c5950f64f465.jpg",
//     "https://i.pinimg.com/originals/ab/13/e8/ab13e8b42b33e509483d9a278bfe841c.jpg",
//     "https://i.pinimg.com/originals/d7/f2/44/d7f2449120a5f128ed1b7963fafb23d5.jpg",
//     "https://i.pinimg.com/originals/4b/47/f9/4b47f97c0b54086d0b113e7d5c830339.jpg",
//     "https://i.pinimg.com/originals/9b/42/90/9b4290ce634cd60bbb6fc67db460e212.jpg",
//     "https://i.pinimg.com/originals/2d/ca/47/2dca4769fca376bc594d46a5bbc3eaef.jpg",
//     "https://i.pinimg.com/originals/ff/22/54/ff2254ac2e4978fbe4b6e1f1039928c8.jpg",
//     "https://i.pinimg.com/originals/c6/15/f0/c615f04e36f4c634400568661da7b097.jpg",
//     "https://i.pinimg.com/originals/51/36/48/5136489004ed0ab318567db1fcd2224f.jpg",
//     "https://i.pinimg.com/originals/17/41/45/174145fd5786d05b994f556177886424.jpg",
//     "https://i.pinimg.com/originals/b6/95/56/b69556ffe03b599d9da56d8781d15705.jpg",
//     "https://i.pinimg.com/originals/52/7f/20/527f2067ae63be0bc041b7f75e026d69.jpg",
//     "https://i.pinimg.com/originals/4c/7a/0f/4c7a0fa601d9768cc82858a7098e2f9c.jpg",
//     "https://i.pinimg.com/originals/8c/9a/d8/8c9ad899af6eafa0da686a0ebe6aba0b.jpg",
//     "https://i.pinimg.com/originals/5d/eb/6e/5deb6e53d988cc8dc85f7ceb8d5a2848.jpg",
//     "https://i.pinimg.com/originals/33/4b/3c/334b3c19da01e5ab9bad393cd3b39a9f.jpg",
//     "https://i.pinimg.com/originals/1a/00/b2/1a00b2964aac64825391f5fab2699eae.jpg",
//     "https://i.pinimg.com/originals/b6/66/dc/b666dc233cdcbb2d9de703b8fe1cade9.jpg",
//     "https://i.pinimg.com/originals/51/b4/7b/51b47b57b89ea48df7ef332372975ffc.jpg",
//     "https://i.pinimg.com/originals/80/34/b6/8034b6113dd2a6d4d73954960457b5f6.jpg",
//     "https://i.pinimg.com/originals/7e/65/f6/7e65f69821d35c89332577b69c5e13d2.jpg",
//     "https://i.pinimg.com/originals/22/eb/48/22eb48ea06b9a746875cc5589af5160e.jpg",
//     "https://i.pinimg.com/originals/08/74/c6/0874c671df3a40a91c4302afaea09298.jpg",
//     "https://i.pinimg.com/originals/25/8d/84/258d84abe0dcc38da8f4f0c5db513e0b.jpg",
//     "https://i.pinimg.com/originals/29/b5/94/29b5945f437a3752f988c40cf7c95d2d.jpg",
//     "https://i.pinimg.com/originals/39/57/c7/3957c7a3e06090cb11223ac6864e9a90.jpg",
//     "https://i.pinimg.com/originals/fe/01/be/fe01be35a14f1c6a166136a63b2e6d57.jpg",
//     "https://i.pinimg.com/originals/60/bb/51/60bb51feada9764e8a6382eee667ce38.jpg",
//     "https://i.pinimg.com/originals/5d/d9/78/5dd9782a70520e6d3b2b13a2789de517.jpg",
//     "https://i.pinimg.com/originals/60/b3/10/60b310f69704b4e0fea10f4887c38b52.jpg",
//     "https://i.pinimg.com/originals/9f/1f/8c/9f1f8c42d528f7b7e0666a4c4eb939fb.jpg",
//     "https://i.pinimg.com/originals/24/38/be/2438beac3abe0c24cee995cfa08c73d7.jpg",
//     "https://i.pinimg.com/originals/17/e9/37/17e937c776b7a27119f0c96ee43170f8.jpg",
//     "https://i.pinimg.com/originals/02/31/f4/0231f4fefa7222faeb4f3f66e3e4f64b.jpg",
//     "https://i.pinimg.com/originals/d1/1f/64/d11f6421572b791e6173060f51c58203.jpg",
//     "https://i.pinimg.com/videos/thumbnails/originals/b9/f3/d4/b9f3d40761ea71e34a28f8cf5bbfa1ef.0000000.jpg",
//     "https://i.pinimg.com/originals/75/c2/2c/75c22c4d01c60f9fd5def1f516f720b4.jpg",
//     "https://i.pinimg.com/originals/b8/4a/ff/b84aff0b3d12549e7ce976ab974c449f.jpg",
//     "https://i.pinimg.com/originals/fa/61/75/fa6175810785fc05194ab1217248856c.jpg",
//     "https://i.pinimg.com/originals/84/29/14/842914f2811988a1198eb0a55d0d43ab.jpg",
//     "https://i.pinimg.com/originals/06/4c/61/064c61a866069415ad2dbab5334394e3.jpg",
//     "https://i.pinimg.com/originals/90/f0/f5/90f0f5cd6b234d185069eb9212f8e9dc.jpg",
//     "https://i.pinimg.com/originals/e5/50/2a/e5502a9b495af0b1d02af963e4edd83e.jpg",
//     "https://i.pinimg.com/originals/88/3e/1b/883e1be81bca384d5e6c992e373f6f49.jpg",
//     "https://i.pinimg.com/originals/f1/b1/b5/f1b1b5fd35a47da7928b1cf2bdf77a21.jpg",
//     "https://i.pinimg.com/originals/97/6a/30/976a30cb341381bbd765707eba62dd38.png",
//     "https://i.pinimg.com/originals/88/5f/b2/885fb2cabe0f53adf0ab67356c8793be.jpg",
//     "https://i.pinimg.com/originals/7a/ba/f4/7abaf40dfdb01f233a2a0efac230ae46.jpg",
//     "https://i.pinimg.com/originals/3d/af/b5/3dafb5ad7722328be97d535ca5cc5d47.png",
//     "https://i.pinimg.com/videos/thumbnails/originals/da/5e/32/da5e32201d6ac6f93279be547112c1d5.0000000.jpg",
//     "https://i.pinimg.com/originals/e3/98/11/e39811913aa5f1239272f0a13178166c.jpg",
//     "https://i.pinimg.com/originals/61/bb/d1/61bbd15c8eb6c05d367375bf22758e60.jpg",
//     "https://i.pinimg.com/originals/cc/dd/4a/ccdd4a5c5233d2826bf9f2f7a9e0956a.jpg",
//     "https://i.pinimg.com/videos/thumbnails/originals/f8/82/4a/f8824aacc2930984d857f7dd6e0c9e51.0000000.jpg",
//     "https://i.pinimg.com/originals/af/54/f4/af54f4a480159d350b065b9b75baf625.jpg",
//     "https://i.pinimg.com/originals/92/c7/f6/92c7f6f0568c55813cdb644fdb72d0f2.jpg",
//     "https://i.pinimg.com/originals/42/b8/e8/42b8e875fbfd103924c08d53a1ac08a2.jpg",
//     "https://i.pinimg.com/originals/eb/34/5a/eb345ae67466c2e10a31196c9df66ac3.jpg",
//     "https://i.pinimg.com/originals/c8/c6/25/c8c6252f813b3599bde545572f6284ba.jpg",
//     "https://i.pinimg.com/originals/04/21/0d/04210dffd54eef2e7613ff47ffbefd79.jpg",
//     "https://i.pinimg.com/originals/57/06/5e/57065ef3e26a602eb020e0850cd27afc.jpg",
//     "https://i.pinimg.com/originals/66/ae/08/66ae08ef225943124dbc5194b6e3f9a3.jpg",
//     "https://i.pinimg.com/videos/thumbnails/originals/c8/7c/11/c87c11f827b29d1dd8af550a690c4030.0000000.jpg",
//     "https://i.pinimg.com/originals/40/38/14/4038143e9157f8a51b7bafd78d999889.jpg",
//     "https://i.pinimg.com/originals/56/6e/24/566e2487cb7c557344d11ef44460743a.jpg",
//     "https://i.pinimg.com/originals/cb/2b/83/cb2b833d1c64891b246f57448c8e9b6c.jpg",
//     "https://i.pinimg.com/originals/55/4f/f4/554ff408f24442dea7a0597a49ec9f26.jpg",
//     "https://i.pinimg.com/originals/c6/5c/91/c65c914ca267ba04f293e02cf9e8a264.jpg",
//     "https://i.pinimg.com/originals/3b/6a/cb/3b6acbf101acd7fd95c5e97d7b0c2fab.jpg",
//     "https://i.pinimg.com/originals/0d/dc/d7/0ddcd7b710fddbd86b5df1c93c1b2d30.jpg",
//     "https://i.pinimg.com/originals/70/18/a8/7018a8481fc99494567aa26f24324d31.jpg",
//     "https://i.pinimg.com/originals/76/51/e7/7651e7e88810122336ebbb7afa2bd9f5.jpg",
//     "https://i.pinimg.com/videos/thumbnails/originals/90/f0/19/90f019ffbaaf503f4ba46a6ecef49c4c.0000000.jpg",
//     "https://i.pinimg.com/originals/a3/ce/62/a3ce62a950288fd186aeebe4c8adeadd.jpg",
//     "https://i.pinimg.com/originals/e0/14/4e/e0144e0380dfd2dd2d3d70362f9062fb.jpg",
//     "https://i.pinimg.com/originals/38/e6/cf/38e6cf445bd976938eec01bc33ab59f2.jpg",
//     "https://i.pinimg.com/originals/a6/f4/a7/a6f4a7363c29d3bb71cb6666804b8793.jpg",
//     "https://i.pinimg.com/originals/86/15/60/86156027aef506248493925db2ebb373.jpg",
//     "https://i.pinimg.com/originals/d2/11/ec/d211ecadb7892db06b726d4f1ef5f98c.jpg",
//     "https://i.pinimg.com/originals/ff/ec/b4/ffecb46ba777e9d3e570a35f1ebf36ff.jpg",
//     "https://i.pinimg.com/originals/da/3c/22/da3c226909b0def33168d5baba54b191.jpg",
// ];

// const HO_LIST = [
//     "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ",
//     "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Đinh", "Tô", "Trương",
//     "Mai", "Hà", "Cao", "Đoàn", "Vương", "Lưu", "Thái", "Tăng", "Trịnh",
//     "Châu", "Tạ", "Mạc", "Giang",
// ];

// const TEN_NU = [
//     "Anh", "Chi", "Diệu", "Giang", "Hà", "Hằng", "Hoa", "Hương", "Lan",
//     "Liên", "Linh", "Mai", "My", "Ngân", "Nhi", "Nhung", "Phương", "Tâm",
//     "Thảo", "Thu", "Thư", "Thủy", "Trang", "Trinh", "Uyên", "Vân", "Xuân",
//     "Yến", "Ánh", "Châu", "Duyên", "Hạnh", "Hiền", "Huệ", "Khanh", "Loan",
//     "Ngọc", "Như", "Quỳnh", "Thanh", "Thiên", "Trâm", "Tuyết", "Vy",
// ];

// const TEN_DEM_NU = [
//     "Thị", "Ngọc", "Thu", "Thanh", "Kim", "Bích", "Lan", "Phương", "Mỹ",
//     "Hà", "Bảo", "Diệu", "Hồng", "Minh", "Như", "Tuyết", "Yến", "Khánh",
// ];

// const BIO_TEMPLATES: Array<(name: string) => string> = [
//     (n) => `Xin chào, mình là ${n} 👋 Đam mê công nghệ và cà phê ☕`,
//     (n) => `${n} | Sống chậm lại, nghĩ nhiều hơn 🌿`,
//     (n) => `Mình là ${n}. Thích đọc sách, nghe nhạc và đi café 📚🎵`,
//     (_) => `Developer ban ngày ☀️ Gamer ban đêm 🎮`,
//     (n) => `${n} đây! Yêu Việt Nam 🇻🇳 | Foodie | Travel lover ✈️`,
//     (_) => `"Sống là để trải nghiệm" – Đang học cách tận hưởng từng khoảnh khắc 🌸`,
//     (n) => `Hi, tôi là ${n}. Đang xây dựng điều gì đó nhỏ nhưng có ý nghĩa 🛠️`,
//     (_) => `Thiết kế | Sáng tạo | Cà phê không đường ☕🎨`,
//     (n) => `${n} | Sinh viên năm 3 | Mê AI và Machine Learning 🤖`,
//     (_) => `Photographer 📸 | Hà Nội → Sài Gòn → Đà Nẵng`,
//     (n) => `Chào bạn! Mình là ${n}, thích chia sẻ kiến thức và học hỏi mỗi ngày 💡`,
//     (_) => `Lập trình viên fullstack. Yêu OSS. Hay than vãn về deadline 😅`,
//     (n) => `${n} | Marketing & Content Creator 📱 | HCM City`,
//     (_) => `Đang trên hành trình tìm bản thân 🗺️ | Mỗi ngày một điều mới`,
//     (n) => `${n} – Bác sĩ tương lai 🩺 | Yêu động vật 🐾`,
//     (n) => `Xin chào! Tôi là ${n}. Đang cố không lướt MXH quá nhiều… 📵`,
//     (_) => `Giáo viên tiếng Anh 🇬🇧 | Mê du lịch bụi | Đã đặt chân 15 tỉnh thành`,
//     (n) => `${n} | UI/UX Designer | Figma addict 🎯`,
//     (_) => `Coder by day, dreamer by night ✨ | Uống trà sữa để tồn tại 🧋`,
//     (n) => `${n} | Product Manager | Đang xây sản phẩm cho người Việt 🇻🇳`,
//     (_) => `Freelance designer. Remote work từ Đà Lạt 🌸 | Open for projects`,
//     (n) => `${n} | Data Analyst | Excel đến Python | Đam mê số liệu 📊`,
//     (n) => `${n} | Content creator | Tech, food & travel 🎬`,
//     (_) => `Sinh viên IT năm cuối. Đang tìm kiếm cơ hội thực tập nghiêm túc 🔍`,
//     (n) => `${n} | Startup founder | Failed twice, still going 💪`,
//     (_) => `Trader | Investor | "Tiền không mua được hạnh phúc nhưng mua được bình yên" 😌`,
//     (n) => `${n} | UI/UX | Mê màu pastel và clean design 🎀`,
//     (_) => `Nấu ăn như mẹ dạy, code như Google dạy 👩‍💻`,
//     (n) => `${n} — viết lách, cà phê, và overthinking 📝`,
//     (_) => `Yêu thích yoga buổi sáng và debug buổi đêm 🧘`,
// ];

// interface UserData {
//     email: string;
//     username: string;
//     password: string;
//     name: string;
//     bio: string;
//     avatar: string;
//     status: UserStatus;
//     isPrivate: boolean;
//     followersCount: number;
//     followingCount: number;
//     postsCount: number;
//     verifiedAt: Date | null;
// }

// function buildUserList(hashedPassword: string): UserData[] {
//     const users: UserData[] = [];
//     const usedUsernames = new Set<string>();
//     const usedEmails = new Set<string>();

//     for (let i = 0; i < 200; i++) {
//         const avatar = AVATAR_URLS[i];
//         const ho = pick(HO_LIST);
//         const tenDem = pick(TEN_DEM_NU);
//         const ten = pick(TEN_NU);
//         const fullName = `${ho} ${tenDem} ${ten}`;

//         let username = `${slugify(fullName)}${String(i + 1).padStart(3, "0")}`;
//         let attempt = 0;
//         while (usedUsernames.has(username) || usedEmails.has(`${username}@gmail.com`)) {
//             attempt++;
//             username = `${slugify(fullName)}${String(i + 1).padStart(3, "0")}x${attempt}`;
//         }
//         usedUsernames.add(username);
//         const email = `${username}@gmail.com`;
//         usedEmails.add(email);

//         users.push({
//             email,
//             username,
//             password: hashedPassword,
//             name: fullName,
//             bio: pick(BIO_TEMPLATES)(ten),
//             avatar,
//             status: UserStatus.ACTIVE,
//             isPrivate: Math.random() < 0.05,
//             followersCount: rand(0, 3000),
//             followingCount: rand(0, 800),
//             postsCount: rand(0, 300),
//             verifiedAt: Math.random() < 0.3
//                 ? new Date(Date.now() - Math.random() * 1.5e10)
//                 : null,
//         });
//     }

//     return users;
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // PART 2 — POST / CIRCLE / NOTIFICATION DATA
// // ═══════════════════════════════════════════════════════════════════════════════

// const POST_IMAGE_POOL: string[] = [
//     "https://i.pinimg.com/originals/88/e0/6e/88e06ede2822923413088897af065b03.jpg",
//     "https://i.pinimg.com/originals/38/5e/15/385e15ed827b40a02b4734edde8cfa8a.jpg",
//     "https://i.pinimg.com/originals/f2/58/29/f25829d5213996ef3bf765c67ed68fbb.jpg",
//     "https://i.pinimg.com/originals/0b/66/9a/0b669aa31c8781da6010960c6e1012b0.jpg",
//     "https://i.pinimg.com/originals/15/dd/c3/15ddc353abf305016f88cc6dba86fde1.jpg",
//     "https://i.pinimg.com/originals/b1/af/cf/b1afcfaf70963daaa6c2786ec7f6f2eb.jpg",
//     "https://i.pinimg.com/originals/68/f4/db/68f4db72ab2c505a01c5de443c4315fd.jpg",
//     "https://i.pinimg.com/originals/c4/71/0e/c4710ee2d312d2bf2a5bc1b478013bce.jpg",
//     "https://i.pinimg.com/originals/0a/da/bd/0adabd591af61a5f3c18d2252ccb9de4.jpg",
//     "https://i.pinimg.com/originals/98/10/47/98104778fe1e452538306d7d736284c2.png",
//     "https://i.pinimg.com/originals/a0/1d/d6/a01dd625cab0b709548f7cc6a5313283.jpg",
//     "https://i.pinimg.com/originals/47/ba/58/47ba587905d613fee12e5880066b63f6.jpg",
//     "https://i.pinimg.com/originals/ea/9b/b3/ea9bb30e50ab6ce72f93b85e4d2e04fd.jpg",
//     "https://i.pinimg.com/originals/b5/b6/49/b5b649d6ccc9591cbba28504bc7f590d.jpg",
//     "https://i.pinimg.com/originals/31/66/d4/3166d4b65811830f66c075eb73c1e012.png",
//     "https://i.pinimg.com/originals/64/a9/6f/64a96f5bb5c87b3a0820d38b19866a72.jpg",
//     "https://i.pinimg.com/originals/36/94/3d/36943d474097deeb81184928ec77528b.jpg",
//     "https://i.pinimg.com/originals/9c/b2/62/9cb262438a90c8c07984fcd4d728ef3b.jpg",
//     "https://i.pinimg.com/originals/fa/79/9f/fa799f519b2a73164993ca359209e99e.jpg",
//     "https://i.pinimg.com/originals/ea/89/2b/ea892bb809352c4dbb67b3cb68d2a11c.jpg",
//     "https://i.pinimg.com/originals/f3/ae/43/f3ae4388515cd35bcc405a91d6fce50b.jpg",
//     "https://i.pinimg.com/originals/99/a6/55/99a655ac3326ba1f6b0f9e9d5aedbbcd.jpg",
//     "https://i.pinimg.com/originals/eb/d8/03/ebd80398f0a65be8e6d224b0f3bb0893.jpg",
//     "https://i.pinimg.com/originals/3b/7c/71/3b7c719b72b34623d522dc8fca4f87ab.webp",
//     "https://i.pinimg.com/originals/ee/a9/8e/eea98e09c408ad37a44d796a51d70a1a.jpg",
//     "https://i.pinimg.com/originals/0d/7c/73/0d7c73b4e20a4fc8a99e8be866374e38.jpg",
//     "https://i.pinimg.com/originals/bf/9c/1e/bf9c1e8ab9b00118c1ff763e10566141.jpg",
//     "https://i.pinimg.com/originals/7e/02/f1/7e02f15a302b42865eca7572a5b5915f.jpg",
//     "https://i.pinimg.com/originals/28/77/c9/2877c9a6e74bccfa81b622ed46b34665.jpg",
//     "https://i.pinimg.com/originals/b1/11/7a/b1117af52695b493113d480a57029f95.jpg",
//     "https://i.pinimg.com/originals/e2/33/fa/e233fa2b27c3e6d404d955cde2541958.jpg",
//     "https://i.pinimg.com/originals/84/b5/a1/84b5a152ca0ed18d5e953005f6395e11.jpg",
//     "https://i.pinimg.com/originals/c9/bc/86/c9bc86729d1d75332adfb76c97eb064d.jpg",
//     "https://i.pinimg.com/originals/00/fd/4f/00fd4f3628a65d825138e1a2de583934.jpg",
//     "https://i.pinimg.com/originals/91/90/26/919026794d43466ec1d5a6e2fdcbbba8.jpg",
//     "https://i.pinimg.com/originals/ae/15/5a/ae155a7f304d44e7c27a38600c29af44.jpg",
//     "https://i.pinimg.com/originals/26/4d/53/264d539f2fd7313989809b3779c88483.jpg",
//     "https://i.pinimg.com/originals/94/9d/1c/949d1cf0e0890ef81f21746768f2d431.jpg",
//     "https://i.pinimg.com/originals/c9/0a/a2/c90aa2fc9a6036ead806bfca9dc3575c.jpg",
//     "https://i.pinimg.com/originals/e3/98/86/e3988646d3a8390dd6b242e3ea722d61.jpg",
//     "https://i.pinimg.com/originals/b8/42/fe/b842fe411245e8bf5ce2cd311296c83d.jpg",
//     "https://i.pinimg.com/originals/fc/ca/be/fccabeaf0e55f8657c199d3f3c7a0702.jpg",
//     "https://i.pinimg.com/originals/81/96/f9/8196f9e1e4c6fdd80084e1b9b8c4841b.jpg",
//     "https://i.pinimg.com/originals/e0/74/c2/e074c242a7794f82001651f02bed31c6.jpg",
//     "https://i.pinimg.com/originals/f2/4e/20/f24e20a4b70b3e9a0b36ef2dd0dabfbc.jpg",
//     "https://i.pinimg.com/originals/c9/50/c4/c950c44c162d2820fac9d39704d9708d.jpg",
//     "https://i.pinimg.com/originals/86/e7/7c/86e77c29e3c6efbeb8de6e9c3d30bdba.jpg",
//     "https://i.pinimg.com/originals/0d/16/b3/0d16b3c82d91629948bc1f3d1d2779c2.jpg",
//     "https://i.pinimg.com/originals/cf/07/74/cf0774df0d19a283bbb78934be89c194.jpg",
//     "https://i.pinimg.com/originals/72/01/ac/7201ace6cbd64a20b736e5b9f72f8eed.jpg",
//     "https://i.pinimg.com/originals/53/73/7f/53737fb9be3fb3e02da70728e97b4e41.webp",
//     "https://i.pinimg.com/originals/8e/b9/b3/8eb9b36d183e8f6cd77a20427bb8af27.jpg",
//     "https://i.pinimg.com/originals/ab/ef/82/abef82ea656f92ecb5a1b776b5fae248.jpg",
//     "https://i.pinimg.com/originals/c8/04/9b/c8049b21748ffdb239442d2af948781e.jpg",
//     "https://i.pinimg.com/originals/5f/08/15/5f08155700a060a6b4abeb0072ddf18f.png",
//     "https://i.pinimg.com/originals/ca/c8/4c/cac84cece9c283d7b06c920c387601e0.jpg",
//     "https://i.pinimg.com/originals/ee/98/b0/ee98b0a7fc84518381ac23a8e8a7bdaa.jpg",
//     "https://i.pinimg.com/originals/ac/1e/e1/ac1ee157998f87a438f70a09c657f305.jpg",
//     "https://i.pinimg.com/originals/d5/fa/10/d5fa1010800441eaead3feeecebd097f.jpg",
//     "https://i.pinimg.com/originals/4f/28/8e/4f288e2b0e09b3c3b27633b1f84a27f4.jpg",
//     "https://i.pinimg.com/originals/51/92/6f/51926f0997d96b06e0c479a9f8e38149.jpg",
//     "https://i.pinimg.com/originals/44/bc/3e/44bc3eb9438b11381d6732b0e72134ff.jpg",
//     "https://i.pinimg.com/originals/a1/69/83/a16983d246f37b5d44ecf558639890ba.jpg",
//     "https://i.pinimg.com/originals/12/16/8e/12168ed102d252176793dca62c1b809f.jpg",
//     "https://i.pinimg.com/originals/b0/ee/92/b0ee922fb3af522e84aef27def8586e9.png",
//     "https://i.pinimg.com/originals/ef/0c/15/ef0c1533c9067731b28bcefd2e738f98.jpg",
//     "https://i.pinimg.com/originals/07/44/f1/0744f18a402d2cf2d5f63f45ce64e183.png",
//     "https://i.pinimg.com/originals/f9/04/dd/f904dd32ac75927eb3caf94b010921a7.jpg",
//     "https://i.pinimg.com/originals/99/9c/06/999c0636bc809d75bfc109d03f96dfd1.jpg",
//     "https://i.pinimg.com/originals/68/ba/73/68ba732c636f6bfadf9ffb2e495ebefe.jpg",
//     "https://i.pinimg.com/originals/a0/81/b9/a081b9de0bed54a152740997f1f5bd9c.jpg",
//     "https://i.pinimg.com/originals/bc/fe/65/bcfe6530140d31e1b7a7a0d50bd554ae.jpg",
//     "https://i.pinimg.com/originals/64/87/22/6487224eae4ed2bf8a791503c0c8a4c5.jpg",
//     "https://i.pinimg.com/originals/52/89/29/528929dc3fcf2b2374ab2d7152750206.jpg",
//     "https://i.pinimg.com/originals/f7/32/46/f73246d64dae9e2c0ad1a8a88b253f56.jpg",
//     "https://i.pinimg.com/originals/67/d2/86/67d2868c23276d5264233ea38ee2e8da.jpg",
//     "https://i.pinimg.com/originals/c6/53/0e/c6530e617c1a858a3d32dc5fd2227d5e.jpg",
// ];

// const POST_CONTENTS = [
//     "Sáng nay mưa to quá mà vẫn phải ra đường 😭 ai ở Sài Gòn thấy hôm nay trời đẹp không hay mình bị ảo giác",
//     "Vừa thử công thức bánh mì bơ tỏi lần đầu. Không ngon như quảng cáo tí nào 💀 nhưng ăn hết rồi nên cũng ok",
//     "Hôm nay là thứ 6 rồi mà cảm giác như thứ 2 mới hôm qua. Ai đồng cảm với mình không ạ",
//     "Cái cảm giác đặt ship đồ ăn xong ngủ quên, tỉnh dậy thấy shipper gọi 7 cuộc 😭",
//     "Phòng gym mình vừa tăng giá thêm 200k/tháng mà không báo trước. Bye bye.",
//     "Mình vừa phát hiện ra mình đã tưới cây bằng nước lọc suốt 6 tháng 🪴 đắt hơn cà phê",
//     "Ra ngoài quên ví ở nhà. Về nhà quên điện thoại. Đi làm lần này không mang được gì hết 😮‍💨",
//     "Hôm nay được khen tóc đẹp ở ngoài đường. Mình không quen với lời khen nên chỉ biết nói 'ừ cảm ơn' rồi đi thẳng 🚶‍♀️",
//     "Bún bò Huế sáng nay ăn với quẩy là đỉnh. Không cần gì thêm nữa trong cuộc đời này",
//     "Ai biết quán phở gà ngon ở Q1 không chỉ mình với? Tìm hoài không ra cái chuẩn Hà Nội",
//     "Review cà phê mới thử: vị ổn, không gian đẹp, wifi 2Mbps. 😐 Ở được 30 phút thì về",
//     "Mình vừa ăn thử sầu riêng lần đầu. Mùi thì sợ nhưng vị thì... nghiện luôn??? Sao không ai cảnh báo trước",
//     "Đặt đồ ăn 150k giao hàng phí 35k. Cảm giác đang nuôi shipper chứ không phải nuôi bản thân 😭",
//     "Trà sữa mới mở đầu phố ngon hơn hẳn mấy chỗ kia. Trân châu dai vừa, không ngọt quá. Recommend 10/10",
//     "Cơm tấm bì sườn chả ở nhà nấu không bao giờ ngon bằng ăn ngoài. Bí quyết họ cất ở đâu vậy",
//     "Đà Lạt tháng này lạnh hơn mọi năm. Mang theo áo khoác mà vẫn rét run 🥶 nhưng mà đẹp thật sự",
//     "Hội An 2 ngày vừa về. Phải đi buổi sáng sớm mới tránh được khách du lịch đông. Đẹp lắm không ai nói xạo",
//     "Phan Thiết chưa ai đi thì đi đi. Biển đẹp, ít người hơn Nha Trang mà giá lại rẻ hơn nhiều",
//     "Mình hay bị hỏi đi một mình có sợ không. Không. Một mình còn thoải mái hơn đi đông người 🙃",
//     "Outfit hôm nay. Thời tiết Sài Gòn thất thường nên mặc gì cũng đúng cũng sai 🤷‍♀️",
//     "Vừa thay tóc mới sau 2 năm để dài. Cảm giác nhẹ nhàng lạ thật 💇‍♀️",
//     "Tuần này chạy bộ được 4 ngày liên tiếp. Kỷ lục cá nhân. Đang tự thưởng bằng cách nằm dài cả ngày hôm nay",
//     "Bắt đầu uống nước đủ 2 lít/ngày từ tuần trước. Kết quả: đi toilet nhiều hơn. Chưa thấy kết quả gì khác",
//     "Ngủ đủ 8 tiếng liên tục lần đầu sau 3 tháng. Cảm giác này không thể diễn tả bằng lời 😴",
//     "Sếp vừa assign thêm project mà deadline tuần sau. Miệng nói ok, trong đầu đang tính đường thoát",
//     "Meeting 2 tiếng mà nội dung có thể giải quyết qua email 5 phút. Đây là lý do nhân loại kiệt sức",
//     "Vừa nhận được email offer mới. Lương cao hơn 30% nhưng không biết môi trường thế nào. Ai có kinh nghiệm đổi việc tư vấn với",
//     "Làm việc từ xa từ Đà Lạt được 1 tuần. Productive hơn ở văn phòng thật, không phải myth",
//     "Bạn thân mình vừa thông báo kết hôn. Hạnh phúc cho nó mà tự nhiên thấy trôi nhanh quá",
//     "Mình không giỏi duy trì liên lạc nhưng thật ra rất nhớ bạn bè cũ. Mọi người có giống mình không",
//     "Bé mèo nhà mình lúc nào cũng giả vờ không cần ai nhưng 3h sáng lại lên nằm lên mặt mình 🐱",
//     "Ai nuôi chó mà đang tìm chỗ gửi dịp Tết chỉ mình với. Năm ngoái để nhà hàng xóm trông mà tội lắm",
//     "Ôn thi cả tuần xong vô phòng thi quên hết như chưa ôn bao giờ. Đây là bug của não người hay tính năng",
//     "Học tiếng Nhật được 3 tháng rồi. Hôm nay đọc được biển hiệu cửa hàng mà không cần tra. Nhỏ thôi nhưng tự hào lắm 🇯🇵",
//     "Giá điện tháng này nhảy lên 700k mà mình còn chưa mua máy lạnh. Kinh hoàng thật sự",
//     "Hôm qua đường Nguyễn Huệ có một bạn biểu diễn street art đẹp cực. Không biết tên nhưng tài thật sự",
//     "Review series mới xem xong: 8/10, kết hơi vội nhưng diễn xuất đỉnh. Không spoil nhưng ai xem rồi hiểu ý mình",
//     "Hôm nay làm được điều mình trì hoãn 3 tuần. Không ai biết nhưng mình biết, thế là đủ",
//     "Khoảnh khắc ngồi uống cà phê một mình sáng sớm trước khi thành phố ồn ào lên. Thích cảm giác này nhất",
//     "Năm nay mình quyết định không giải thích lý do từ chối những thứ không muốn làm. Sống nhẹ hơn hẳn",
//     "Ai có link bài nhạc hôm qua viral trên TT không? Nghe được 10 giây rồi bị cuộn qua mất",
//     "Vừa xóa app một hôm rồi cài lại. Khoảng cách digital detox của mình chỉ là 24 giờ 😮‍💨",
//     "Cảm giác post xong 5 phút không ai like thì edit lại caption 3 lần rồi xóa rồi đăng lại 😂 đây là bình thường",
// ];

// const REPLY_CONTENTS = [
//     "Trời ơi mình y chang bạn luôn 😭😭",
//     "Hahaha đồng cảm cực kỳ!!!",
//     "Bạn ở đâu vậy? Mình cũng gặp y chang",
//     "Ủa sao quen thế này 😂",
//     "Thật không??? Kể thêm đi",
//     "Omg mình cũng vừa trải qua điều này hôm qua",
//     "Lmaooo đây là tôi mỗi sáng thứ 2",
//     "Cảm ơn bạn đã nói lên tâm tư của mình 🙏",
//     "Không một lần. Mà nhiều lần. Nhiều lần lắm.",
//     "Đây là sự thật đau lòng mà ai cũng biết nhưng không ai nói 💀",
//     "Share luôn không xin phép 🫶",
//     "Bạn ơi recommend đi! Mình cũng muốn thử",
//     "Địa chỉ đâu ạ? Drop link với!",
//     "Chính xác. Không bàn thêm gì được nữa.",
//     "Tôi đang khóc. Tại sao nó đúng đến thế.",
//     "Mình bookmark bài này lại rồi 📌",
//     "Kiên nhẫn lên nha 💪",
//     "Mình giờ cũng đang làm điều này. Kết quả chưa có nhưng tinh thần oke 😂",
//     "Vui thật 🥹🥹🥹",
//     "Bạn thật ra không cô đơn, mọi người đều thế hết 😂",
//     "Đây là core memory rồi 🫶",
//     "Ủng hộ bạn!! đi tiếp nha",
//     "Trùng hợp không? Mình vừa nghĩ đến điều này!",
//     "Bạn ơi, chúng ta cần nói chuyện 💀",
//     "Hay quá! Cho mình hỏi thêm được không?",
//     "Giá mà biết điều này sớm hơn 😮‍💨",
//     "Đây là sign mình cần nghe hôm nay",
//     "Bạn đang mô tả cuộc đời mình 😭",
// ];

// const CIRCLES_DATA = [
//     { name: "Sài Gòn Foodies 🍜", description: "Hội những người yêu ẩm thực Sài Gòn. Review quán ăn, công thức nấu ăn, và mọi thứ liên quan đến đồ ăn ngon.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Du Lịch Việt Nam 🏔️", description: "Chia sẻ kinh nghiệm du lịch trong nước. Địa điểm đẹp, quán ngon, homestay giá tốt.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "OOTD Vietnam 👗", description: "Cộng đồng chia sẻ outfit, review đồ, và thời trang đường phố Việt Nam.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Skincare & Beauty VN 💄", description: "Review skincare, chia sẻ routine, và tất cả về làm đẹp theo kiểu người Việt.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Mèo Cún Việt Nam 🐱🐶", description: "Hội yêu thú cưng. Chia sẻ ảnh, kinh nghiệm chăm sóc, và tìm nhà cho các bé bị bỏ rơi.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Nhạc Việt Xưa & Nay 🎵", description: "Từ nhạc vàng đến Vpop hiện đại. Chia sẻ bài hát hay, kỷ niệm với âm nhạc.", visibility: Visibility.PRIVATE, statusPeak: false },
//     { name: "Phim & Series Chill 🎬", description: "Recommend phim, series, anime. Không spoil không được vào nhóm 😤", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Gym & Fitness Girls 💪", description: "Cộng đồng nữ yêu thể thao. Chia sẻ lịch tập, chế độ ăn, và hành trình thay đổi bản thân.", visibility: Visibility.PRIVATE, statusPeak: true },
//     { name: "Café Hopping HCM ☕", description: "Review cà phê, không gian làm việc, và quán thích hợp cho từng tâm trạng ở HCM.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Hội Tự Nấu Ăn 🍳", description: "Chia sẻ công thức, tips nấu ăn ngon mà tiết kiệm. Không cần đầu bếp chuyên nghiệp.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Thiền & Wellness 🧘", description: "Meditation, yoga, sức khỏe tinh thần. Không gian bình yên giữa thế giới ồn ào.", visibility: Visibility.PRIVATE, statusPeak: false },
//     { name: "Đọc Sách Cùng Nhau 📚", description: "Book club online. Mỗi tháng một cuốn, cùng đọc cùng thảo luận. Đủ thể loại.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Digital Nomad VN 💻", description: "Cộng đồng làm việc remote ở Việt Nam. Chia sẻ địa điểm làm việc, kinh nghiệm, cơ hội.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Vẽ & Sáng Tạo 🎨", description: "Triển lãm tác phẩm, chia sẻ kỹ thuật và cảm hứng sáng tác. Mọi trình độ đều welcome.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Mẹ Bỉm Sữa Thời Đại Mới 👶", description: "Hội các mẹ trẻ. Chia sẻ kinh nghiệm nuôi con, tâm sự chuyện gia đình, cân bằng cuộc sống.", visibility: Visibility.PRIVATE, statusPeak: false },
//     { name: "Khởi Nghiệp Việt 🚀", description: "Cộng đồng startup, freelancer và những người dám nghĩ dám làm. Chia sẻ kinh nghiệm thực chiến.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Nhiếp Ảnh Đường Phố 📸", description: "Street photography Việt Nam. Từ điện thoại đến máy film. Cái đẹp ở xung quanh chúng ta.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Hội Troll Sáng Tạo 😂", description: "Meme, video hài, và mọi thứ khiến bạn phun nước vào màn hình. Không toxic.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "K-Pop & K-Drama VN 🇰🇷", description: "Fandom Hàn Quốc Việt Nam. Tin tức idol, review drama, fanart và nhiều hơn nữa.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Tài Chính Cá Nhân 💰", description: "Học cách tiết kiệm, đầu tư và quản lý tài chính thông minh. Không bán khóa học ở đây.", visibility: Visibility.PRIVATE, statusPeak: false },
//     { name: "Hà Nội Old Town Vibes 🏮", description: "Cộng đồng người Hà Nội và những ai yêu Hà Nội. Ảnh đẹp, kỷ niệm, địa chỉ hay.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Zero Waste Lifestyle 🌿", description: "Sống xanh, giảm rác, yêu môi trường. Tips thực tế cho cuộc sống bền vững.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Nhảy Và Vũ Đạo 💃", description: "Từ ballroom đến street dance, K-pop cover đến traditional. Học hỏi và cùng nhau tiến bộ.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Hội Cô Đơn Tự Nguyện 🫥", description: "Cho những ai thích một mình và ổn với điều đó. Không cô đơn khi cùng nhau tự cô đơn 😂", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Âm Nhạc Underground VN 🎸", description: "Indie, underground, alternative, jazz. Nghệ sĩ độc lập và người nghe tìm đến nhau.", visibility: Visibility.PRIVATE, statusPeak: true },
//     { name: "Chill & Travel Backpack 🎒", description: "Phượt bụi, du lịch tự túc, budget travel. Chia sẻ kinh nghiệm đi đâu cũng được.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Tarot & Spiritual VN ✨", description: "Tarot, astrology, crystals và những điều huyền bí. Không mê tín, chỉ là thú vị.", visibility: Visibility.PRIVATE, statusPeak: false },
//     { name: "Gen Z Confess 🫣", description: "Tâm sự ẩn danh, drama đời thường, và những điều chỉ Gen Z mới hiểu nhau được.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Nấu Chay Sáng Tạo 🥗", description: "Công thức ăn chay ngon và đẹp. Không cần ăn nhạt để ăn lành mạnh.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Đà Nẵng Connect 🌊", description: "Cộng đồng người Đà Nẵng và yêu Đà Nẵng. Sự kiện, địa điểm, review.", visibility: Visibility.PUBLIC, statusPeak: false },
// ];

// // ═══════════════════════════════════════════════════════════════════════════════
// // SEED FUNCTIONS
// // ═══════════════════════════════════════════════════════════════════════════════

// type SeedUser = { id: string; username: string; name: string; avatar: string | null; bio: string | null };

// async function seedUsers(): Promise<SeedUser[]> {
//     console.log("\n👤 ===== PART 1: SEED 200 USER NỮ =====\n");

//     console.log("🔑 Hashing password...");
//     const hashedPassword = await bcrypt.hash("12345678", 10);
//     const userList = buildUserList(hashedPassword);
//     console.log(`📋 Built ${userList.length} users, bắt đầu insert...\n`);

//     const existing = await prisma.user.findMany({
//         select: { username: true, email: true },
//     });
//     const existingUsernames = new Set(existing.map(u => u.username));
//     const existingEmails = new Set(existing.map(u => u.email));

//     let created = 0;
//     let skipped = 0;
//     const CHUNK = 50;

//     for (let i = 0; i < userList.length; i += CHUNK) {
//         const chunk = userList
//             .slice(i, i + CHUNK)
//             .filter(u => !existingUsernames.has(u.username) && !existingEmails.has(u.email));

//         if (chunk.length > 0) {
//             await prisma.user.createMany({ data: chunk, skipDuplicates: true });
//             created += chunk.length;
//         }
//         skipped += Math.min(CHUNK, userList.length - i) - chunk.length;
//         process.stdout.write(`\r   → ${Math.min(i + CHUNK, userList.length)}/200 processed | ✅ ${created} tạo | ⏭️  ${skipped} skip`);
//     }

//     console.log(`\n\n✅ Users: ${created} tạo mới, ${skipped} bỏ qua`);

//     // Load lại toàn bộ để dùng cho các bước sau
//     const users = await prisma.user.findMany({
//         where: { deletedAt: null, status: UserStatus.ACTIVE },
//         select: { id: true, username: true, name: true, avatar: true, bio: true },
//         orderBy: { createdAt: "desc" },
//         take: 200,
//     });

//     // Preview
//     const preview = users.slice(0, 3);
//     console.log("\n📋 3 users mới nhất:");
//     preview.forEach(u => console.log(`   @${u.username} | ${u.name}`));

//     return users as SeedUser[];
// }

// async function seedPosts(users: SeedUser[]) {
//     console.log(`\n📝 ===== PART 2: SEED POSTS =====`);

//     const createdPosts: { id: number; publicId: string; userId: string }[] = [];
//     let imgIdx = 0;

//     for (const author of users) {
//         const numPosts = rand(1, 3);
//         for (let p = 0; p < numPosts; p++) {
//             const numImages = rand(1, 5);
//             const content = pick(POST_CONTENTS);
//             const createdAt = randomDate(60);

//             const post = await prisma.post.create({
//                 data: {
//                     userId: author.id,
//                     content,
//                     type: PostType.POST,
//                     visibility: VisibilityPost.PUBLIC,
//                     replyPermission: pick([
//                         ReplyPermission.EVERYONE,
//                         ReplyPermission.EVERYONE,
//                         ReplyPermission.EVERYONE,
//                         ReplyPermission.FOLLOWERS,
//                     ]),
//                     userSnapshot: {
//                         id: author.id,
//                         username: author.username,
//                         name: author.name,
//                         avatar: author.avatar,
//                         bio: author.bio,
//                     },
//                     likesCount: rand(0, 500),
//                     repliesCount: rand(0, 50),
//                     repostsCountAndQuoteCount: rand(0, 30),
//                     viewsCount: rand(100, 15000),
//                     createdAt,
//                     updatedAt: createdAt,
//                 },
//                 select: { id: true, publicId: true, userId: true },
//             });

//             const mediaItems = Array.from({ length: numImages }, (_, m) => {
//                 const url = POST_IMAGE_POOL[imgIdx++ % POST_IMAGE_POOL.length];
//                 return {
//                     postId: post.id,
//                     url,
//                     type: PostMediaType.IMAGE,
//                     width: pick([720, 1080, 1280]),
//                     height: pick([720, 1080, 1350]),
//                     key: `post_img_${post.id}_${m}_${Date.now() + m}`,
//                     status: PostMediaStatus.UPLOADED,
//                 };
//             });
//             await prisma.postMedia.createMany({ data: mediaItems });

//             createdPosts.push(post);
//         }
//         process.stdout.write(`\r   → ${createdPosts.length} posts created`);
//     }

//     // Replies
//     console.log(`\n   💬 Thêm replies...`);
//     const postsToReply = createdPosts.slice(0, Math.min(100, createdPosts.length));
//     for (const post of postsToReply) {
//         const numReplies = rand(3, 10);
//         const repliers = shuffle(users.filter(u => u.id !== post.userId)).slice(0, numReplies);
//         await prisma.post.createMany({
//             data: repliers.map((replier) => ({
//                 userId: replier.id,
//                 content: pick(REPLY_CONTENTS),
//                 type: PostType.REPLY,
//                 visibility: VisibilityPost.PUBLIC,
//                 replyPermission: ReplyPermission.EVERYONE,
//                 parentId: post.id,
//                 parentPublicId: post.publicId,
//                 rootPostId: post.id,
//                 rootPublicId: post.publicId,
//                 userSnapshot: {
//                     id: replier.id,
//                     username: replier.username,
//                     name: replier.name,
//                     avatar: replier.avatar,
//                     bio: replier.bio,
//                 },
//                 likesCount: rand(0, 50),
//                 repliesCount: 0,
//                 repostsCountAndQuoteCount: 0,
//                 viewsCount: rand(10, 500),
//                 createdAt: randomDate(30),
//                 updatedAt: randomDate(30),
//             })),
//         });
//     }

//     console.log(`\n   ✅ ${createdPosts.length} posts + replies`);
//     return createdPosts;
// }

// async function seedCircles(users: SeedUser[]) {
//     console.log(`\n⭕ ===== PART 3: SEED CIRCLES =====`);

//     const createdCircles: { id: number; publicId: string; creatorId: string }[] = [];

//     for (const [i, data] of CIRCLES_DATA.entries()) {
//         const owner = users[i % users.length];

//         const circle = await prisma.circle.create({
//             data: {
//                 name: data.name,
//                 description: data.description,
//                 visibility: data.visibility,
//                 statusPeak: data.statusPeak,
//                 createById: owner.id,
//             },
//             select: { id: true, publicId: true },
//         });

//         // CircleEnergy
//         const level = rand(1, 10);
//         const maxHp = 500 + (level - 1) * 200;
//         const currentHp = rand(Math.floor(maxHp * 0.3), maxHp);
//         await prisma.circleEnergy.create({
//             data: {
//                 circleId: circle.id,
//                 level,
//                 exp: rand(0, level * 500),
//                 current: currentHp,
//                 max: maxHp,
//                 peak: maxHp,
//             },
//         });

//         // Owner as ADMIN
//         await prisma.circleMember.create({
//             data: { circleId: circle.id, userId: owner.id, role: RoleMembership.ADMIN },
//         });

//         // Members
//         const pool = shuffle(users.filter(u => u.id !== owner.id));
//         const memberCount = rand(10, 30);
//         const members = pool.slice(0, memberCount);
//         if (members.length > 0) {
//             await prisma.circleMember.createMany({
//                 data: members.map((u, mi) => ({
//                     circleId: circle.id,
//                     userId: u.id,
//                     role: mi === 0 ? RoleMembership.ADMIN : RoleMembership.MEMBER,
//                 })),
//                 skipDuplicates: true,
//             });
//         }

//         // Invitations
//         const memberIds = new Set([owner.id, ...members.map(m => m.id)]);
//         const eligibleForInvite = shuffle(users.filter(u => !memberIds.has(u.id)));
//         const inviteTargets = eligibleForInvite.slice(0, Math.min(rand(10, 20), eligibleForInvite.length));
//         const adminPool = [owner.id, ...(members.length > 0 ? [members[0].id] : [])];
//         const inviteStatuses = [
//             CircleInvitationStatus.PENDING,
//             CircleInvitationStatus.PENDING,
//             CircleInvitationStatus.ACCEPTED,
//             CircleInvitationStatus.REJECTED,
//             CircleInvitationStatus.CANCELLED,
//         ];

//         for (let inv = 0; inv < inviteTargets.length; inv++) {
//             const invitee = inviteTargets[inv];
//             const status = pick(inviteStatuses);
//             const createdAt = randomDate(60);
//             try {
//                 await prisma.circleInvitation.create({
//                     data: {
//                         circleId: circle.id,
//                         userId: invitee.id,
//                         inviterId: pick(adminPool),
//                         status,
//                         role: Math.random() < 0.1 ? RoleMembership.ADMIN : RoleMembership.MEMBER,
//                         isUser: true,
//                         tokenHash: `tok_${circle.id}_${invitee.id.slice(0, 6)}_${inv}_${Date.now()}`,
//                         resentCount: status === CircleInvitationStatus.PENDING ? rand(0, 3) : 0,
//                         createdAt,
//                         updatedAt: createdAt,
//                     },
//                 });
//             } catch { /* skip duplicate */ }
//         }

//         // Join Requests
//         const alreadyHandled = new Set([...memberIds, ...inviteTargets.map(t => t.id)]);
//         const eligibleForJoin = shuffle(users.filter(u => !alreadyHandled.has(u.id)));
//         const joinTargets = eligibleForJoin.slice(0, Math.min(rand(15, 30), eligibleForJoin.length));
//         const joinStatuses = [
//             RequestStatus.PENDING, RequestStatus.PENDING, RequestStatus.PENDING,
//             RequestStatus.ACCEPTED, RequestStatus.REJECTED, RequestStatus.CANCELLED,
//         ];
//         const JOIN_REASONS = [
//             "Mình muốn tham gia để học hỏi thêm từ cộng đồng",
//             "Bạn bè giới thiệu nhóm này, muốn vào xem thử",
//             "Thấy nội dung nhóm rất hay, muốn được contribute",
//             null, null, null,
//         ];

//         if (joinTargets.length > 0) {
//             await prisma.circleJoinRequest.createMany({
//                 data: joinTargets.map(u => ({
//                     userId: u.id,
//                     circleId: circle.id,
//                     status: pick(joinStatuses),
//                     reason: pick(JOIN_REASONS),
//                     createdAt: randomDate(90),
//                 })),
//                 skipDuplicates: true,
//             });
//         }

//         const icon = data.statusPeak ? "🔥" : "  ";
//         const vis = data.visibility === "PUBLIC" ? "🌐" : "🔒";
//         console.log(`   ${String(i + 1).padStart(2)}. ${icon} ${vis} ${data.name} (Lv.${level}, HP ${currentHp}/${maxHp}) — ${memberCount + 1} thành viên`);

//         createdCircles.push({ id: circle.id, publicId: circle.publicId, creatorId: owner.id });
//     }

//     console.log(`\n   ✅ ${createdCircles.length} circles`);
//     return createdCircles;
// }

// async function seedNotifications(
//     users: SeedUser[],
//     posts: { id: number; publicId: string; userId: string }[],
//     circles: { id: number; publicId: string; creatorId: string }[],
// ) {
//     console.log(`\n🔔 ===== PART 4: SEED NOTIFICATIONS =====`);

//     function genTargetType(type: NotificationType): string {
//         const map: Record<NotificationType, string> = {
//             POST: "post", LIKE: "post", FOLLOW: "user", QUOTE: "post",
//             SHARE: "post", MESSAGE: "message_group", REPLY: "post",
//             MENTION: "post", INVITATION: "circle",
//         };
//         return map[type] ?? "post";
//     }

//     const notifTypes: NotificationType[] = [
//         NotificationType.LIKE, NotificationType.LIKE,
//         NotificationType.REPLY, NotificationType.REPLY,
//         NotificationType.FOLLOW, NotificationType.QUOTE,
//         NotificationType.MENTION, NotificationType.INVITATION,
//     ];

//     let count = 0;
//     for (const recipient of users) {
//         const numNotifs = rand(3, 8);
//         const actors = shuffle(users.filter(u => u.id !== recipient.id));
//         const recipientPosts = posts.filter(p => p.userId === recipient.id);

//         for (let n = 0; n < numNotifs; n++) {
//             const type = pick(notifTypes);
//             const actor = actors[n % actors.length];
//             const targetType = genTargetType(type);
//             const lastEventAt = randomDate(14);

//             let targetId: string;
//             let originPostId: string | null = null;

//             if (targetType === "post" && recipientPosts.length > 0) {
//                 const p = pick(recipientPosts);
//                 targetId = p.publicId;
//                 originPostId = p.publicId;
//             } else if (targetType === "user") {
//                 targetId = recipient.id;
//             } else if (targetType === "circle" && circles.length > 0) {
//                 targetId = pick(circles).publicId;
//             } else {
//                 targetId = recipient.id;
//             }

//             try {
//                 await prisma.notificationGroup.create({
//                     data: {
//                         recipientId: recipient.id,
//                         type,
//                         targetType,
//                         targetId,
//                         actorIds: [actor.id],
//                         count: rand(1, 5),
//                         isRead: Math.random() < 0.4,
//                         lastActorId: actor.id,
//                         lastEventAt,
//                         createdAt: lastEventAt,
//                         updatedAt: lastEventAt,
//                         originPostId,
//                     },
//                 });
//                 count++;
//             } catch { /* skip */ }
//         }
//     }

//     console.log(`   ✅ ${count} notifications`);
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // MAIN
// // ═══════════════════════════════════════════════════════════════════════════════

// async function main() {
//     console.log("🌱 ===== SEED ALL: USERS → POSTS → CIRCLES → NOTIFICATIONS =====");

//     // Step 1: Users
//     const users = await seedUsers();
//     if (users.length === 0) throw new Error("Không load được users!");

//     // Step 2: Posts + media + replies
//     const posts = await seedPosts(users);

//     // Step 3: Circles + energy + members + invitations + join requests
//     const circles = await seedCircles(users);

//     // Step 4: Notifications
//     await seedNotifications(users, posts, circles);

//     // ── Summary ────────────────────────────────────────────────────────────────
//     const [totalUsers, totalPosts, totalMedia, totalCircles, totalMembers, totalInvites, totalJoinReqs, totalNotifs] =
//         await Promise.all([
//             prisma.user.count({ where: { status: UserStatus.ACTIVE, deletedAt: null } }),
//             prisma.post.count({ where: { type: PostType.POST } }),
//             prisma.postMedia.count(),
//             prisma.circle.count(),
//             prisma.circleMember.count(),
//             prisma.circleInvitation.count(),
//             prisma.circleJoinRequest.count(),
//             prisma.notificationGroup.count(),
//         ]);

//     console.log(`
// 🎉 ===== SEED HOÀN THÀNH =====
//    👤 Users (active)  : ${totalUsers}
//    📝 Posts (gốc)     : ${totalPosts}
//    🖼️  PostMedia       : ${totalMedia}
//    ⭕ Circles         : ${totalCircles}
//    👥 Members         : ${totalMembers}
//    📨 Invitations     : ${totalInvites}
//    🚪 Join Requests   : ${totalJoinReqs}
//    🔔 Notifications   : ${totalNotifs}
// ================================`);
// }

// main()
//     .catch(e => {
//         console.error("\n❌ Seed thất bại:", e);
//         process.exit(1);
//     })
//     .finally(() => prisma.$disconnect());
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import {
//     ExpReason,
//     PostMediaStatus,
//     PostMediaType,
//     PostScoreLabel,
//     PostType,
//     PrismaClient,
//     ReplyPermission,
//     VisibilityPost,
// } from "@prisma/client";
// import dotenv from "dotenv";
// dotenv.config();

// // ─── Prisma setup ─────────────────────────────────────────────────────────────
// const adapter = new PrismaMariaDb({
//     port: Number(process.env.DB_PORT) || 3306,
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASSWORD || "password",
//     database: process.env.DB_NAME || "threads_api",
// });
// const prisma = new PrismaClient({ adapter } as any);

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function pick<T>(arr: T[]): T {
//     return arr[Math.floor(Math.random() * arr.length)];
// }
// function rand(min: number, max: number) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }
// function randomDate(daysAgo: number): Date {
//     return new Date(Date.now() - Math.random() * daysAgo * 86_400_000);
// }
// function shuffle<T>(arr: T[]): T[] {
//     return [...arr].sort(() => Math.random() - 0.5);
// }

// // ─── Lexical JSON builder helpers ────────────────────────────────────────────

// /** Tạo một paragraph node Lexical */
// function lexParagraph(children: object[]): object {
//     return {
//         children,
//         direction: "ltr",
//         format: "",
//         indent: 0,
//         type: "paragraph",
//         version: 1,
//     };
// }

// /** Text node thường */
// function lexText(
//     text: string,
//     format: number = 0,
//     style: string = ""
// ): object {
//     return {
//         detail: 0,
//         format,
//         mode: "normal",
//         style,
//         text,
//         type: "text",
//         version: 1,
//     };
// }

// /** Bold text (format = 1) */
// function lexBold(text: string): object {
//     return lexText(text, 1);
// }

// /** Italic text (format = 2) */
// function lexItalic(text: string): object {
//     return lexText(text, 2);
// }

// /** Bold + Italic (format = 3) */
// function lexBoldItalic(text: string): object {
//     return lexText(text, 3);
// }

// /** Heading node */
// function lexHeading(children: object[], tag: "h1" | "h2" | "h3"): object {
//     return {
//         children,
//         direction: "ltr",
//         format: "",
//         indent: 0,
//         type: "heading",
//         tag,
//         version: 1,
//     };
// }

// /** Unordered list */
// function lexList(items: string[], listType: "bullet" | "number" = "bullet"): object {
//     return {
//         children: items.map((item) => ({
//             children: [lexText(item)],
//             direction: "ltr",
//             format: "",
//             indent: 0,
//             type: "listitem",
//             value: 1,
//             version: 1,
//         })),
//         direction: "ltr",
//         format: "",
//         indent: 0,
//         type: "list",
//         listType,
//         start: 1,
//         tag: listType === "bullet" ? "ul" : "ol",
//         version: 1,
//     };
// }

// /** Quote block */
// function lexQuote(children: object[]): object {
//     return {
//         children,
//         direction: "ltr",
//         format: "",
//         indent: 0,
//         type: "quote",
//         version: 1,
//     };
// }

// /** Horizontal rule */
// function lexHorizontalRule(): object {
//     return { type: "horizontalrule", version: 1 };
// }

// /** Wrap thành root Lexical */
// function lexRoot(children: object[]): object {
//     return {
//         root: {
//             children,
//             direction: "ltr",
//             format: "",
//             indent: 0,
//             type: "root",
//             version: 1,
//         },
//     };
// }

// // ─── Score → HP/EXP delta mapping ─────────────────────────────────────────────
// const SCORE_CONFIG: Record<
//     PostScoreLabel,
//     { hpDelta: number; expDelta: number; expReason: ExpReason }
// > = {
//     MASTERPIECE: { hpDelta: 5, expDelta: 10, expReason: ExpReason.POST_MASTERPIECE },
//     DEEP_TALK: { hpDelta: 3, expDelta: 6, expReason: ExpReason.POST_DEEP_TALK },
//     SOLID: { hpDelta: 1, expDelta: 2, expReason: ExpReason.POST_SOLID },
//     NEUTRAL: { hpDelta: 0, expDelta: 0, expReason: ExpReason.POST_NEUTRAL },
//     NOISE: { hpDelta: -1, expDelta: 0, expReason: ExpReason.POST_NOISE },
//     TOXIC: { hpDelta: -3, expDelta: 0, expReason: ExpReason.POST_TOXIC },
//     PENDING: { hpDelta: 0, expDelta: 0, expReason: ExpReason.POST_NEUTRAL },
// };

// // ─── CIRCLE POST DATA: nội dung theo từng nhóm ────────────────────────────────

// // Cấu trúc: { content: string, contentJson: object, label: PostScoreLabel, confidence: number, isToxic?: boolean, isSpam?: boolean, hasImage?: boolean }
// type CirclePostTemplate = {
//     content: string;
//     contentJson: object;
//     label: PostScoreLabel;
//     confidence: number;
//     isToxic?: boolean;
//     isSpam?: boolean;
//     hasImage?: boolean;
//     numLikes?: number;
//     numReplies?: number;
// };

// // ── 1. Sài Gòn Foodies 🍜 ─────────────────────────────────────────────────────
// const FOODIES_POSTS: CirclePostTemplate[] = [
//     {
//         content: "Review chi tiết bún bò Huế số 5 Đinh Tiên Hoàng – Chuẩn vị Huế giữa lòng Sài Gòn",
//         contentJson: lexRoot([
//             lexHeading([lexText("🍜 Review: Bún Bò Huế số 5 Đinh Tiên Hoàng")], "h2"),
//             lexParagraph([
//                 lexText("Đã ăn bún bò ở rất nhiều nơi nhưng đây là lần đầu tiên mình thực sự cảm giác như đang ngồi ở một con hẻm nhỏ ở Huế. "),
//                 lexBold("Nước dùng đậm đà"),
//                 lexText(", cay vừa phải, mùi sả và mắm ruốc quyện vào nhau hoàn hảo."),
//             ]),
//             lexHeading([lexText("Chi tiết các món")], "h3"),
//             lexList([
//                 "Bún bò đặc biệt (65k): Có đủ giò heo, chả cua, thịt bò. Phần ăn chuẩn, không bị chiếu lệ.",
//                 "Nước dùng: Màu đỏ đẹp, không đục, vị sâu – đây là điểm sáng nhất.",
//                 "Bún: Sợi tươi, dai vừa, không bị nhão sau 10 phút.",
//                 "Rau ăn kèm: Đủ và tươi, chuối bắp thái mỏng.",
//             ]),
//             lexQuote([
//                 lexText("Mình đánh giá 9/10. Trừ 1 điểm vì bãi giữ xe hơi xa và hay hết chỗ vào giờ trưa."),
//             ]),
//             lexParagraph([
//                 lexText("📍 "),
//                 lexBold("Địa chỉ:"),
//                 lexText(" 5 Đinh Tiên Hoàng, P. Đa Kao, Q.1 | Mở cửa 6:30 – 14:00"),
//             ]),
//         ]),
//         label: PostScoreLabel.MASTERPIECE,
//         confidence: 0.92,
//         hasImage: true,
//         numLikes: 148,
//         numReplies: 23,
//     },
//     {
//         content: "Công thức bánh cuốn tôm thịt làm tại nhà – Không cần máy vẫn dai ngon",
//         contentJson: lexRoot([
//             lexHeading([lexText("🥢 Công Thức Bánh Cuốn Tôm Thịt Tại Nhà")], "h2"),
//             lexParagraph([
//                 lexText("Mình đã thử ít nhất 4 lần mới ra được công thức này. "),
//                 lexItalic("Bí quyết nằm ở tỉ lệ bột"),
//                 lexText(" và nhiệt độ chảo. Chia sẻ để mọi người cùng thử!"),
//             ]),
//             lexHeading([lexText("Nguyên liệu (4 người ăn)")], "h3"),
//             lexList([
//                 "200g bột gạo tẻ + 50g bột năng",
//                 "400ml nước lọc (thêm 1 muỗng dầu ăn)",
//                 "200g thịt heo xay, 100g tôm bóc vỏ",
//                 "Mộc nhĩ, hành khô phi vàng",
//                 "Nước mắm pha: 3 muỗng nước mắm + 2 muỗng đường + nước cốt chanh",
//             ], "bullet"),
//             lexHeading([lexText("Cách làm")], "h3"),
//             lexList([
//                 "Hoà bột với nước, để nghỉ 30 phút – bước này quan trọng nhất.",
//                 "Phi hành, xào thịt + tôm với gia vị vừa miệng.",
//                 "Dùng chảo chống dính, thoa dầu mỏng, đổ một muỗng canh bột mỏng.",
//                 "Đậy nắp 30 giây, cho nhân vào giữa rồi cuốn.",
//             ], "number"),
//             lexParagraph([lexBold("Tips: "), lexText("Chảo phải đủ nóng và lớp bột thật mỏng thì bánh mới trong và mềm. Lần đầu sẽ hỏng 2-3 cái – hoàn toàn bình thường!")]),
//         ]),
//         label: PostScoreLabel.DEEP_TALK,
//         confidence: 0.88,
//         hasImage: true,
//         numLikes: 97,
//         numReplies: 31,
//     },
//     {
//         content: "Top 5 quán cơm tấm sườn chuẩn vị ở Sài Gòn mình đã ăn thử hết",
//         contentJson: lexRoot([
//             lexHeading([lexText("🍚 Top 5 Quán Cơm Tấm Sườn Chuẩn Vị Sài Gòn")], "h2"),
//             lexParagraph([lexText("Dành 3 tuần cuối tuần đi ăn thử, đây là danh sách mình tin tưởng nhất. Tiêu chí: sườn mềm đúng kiểu (không quá mềm), cơm không dính, bì thái đều, mỡ hành thơm.")]),
//             lexList([
//                 "Cơm Tấm Thuận Kiều (Q.5) – Sườn ướp đậm, than hoa thật, xếp hàng đáng.",
//                 "Cơm Tấm Bụi (nhiều chi nhánh) – Chuẩn giá cả, đồng đều chất lượng.",
//                 "Cơm Tấm Ba Ghiền (Bùi Đình Tuý) – Mỡ hành ngon nhất trong danh sách.",
//                 "Cơm Tấm Kiều Giang (Nguyễn Trãi) – Bì dai vừa, nước mắm pha ngon.",
//                 "Cơm Tấm Mộc (Đinh Tiên Hoàng) – Không gian sạch, phù hợp đưa khách.",
//             ]),
//             lexParagraph([lexItalic("Lưu ý: Tất cả đều đã ăn trực tiếp ít nhất 2 lần, không phải review quảng cáo.")]),
//         ]),
//         label: PostScoreLabel.SOLID,
//         confidence: 0.85,
//         hasImage: false,
//         numLikes: 72,
//         numReplies: 18,
//     },
//     {
//         content: "Quán này ngon vl luôn mọi người ơi!!!! Đi ăn đi hết 😍😍😍",
//         contentJson: lexRoot([
//             lexParagraph([lexText("Quán này ngon vl luôn mọi người ơi!!!! Đi ăn đi hết 😍😍😍")]),
//             lexParagraph([lexText("Không nhớ tên quán, ở đâu đó Q7 á. Đại khái là ngon 🔥🔥")]),
//         ]),
//         label: PostScoreLabel.NOISE,
//         confidence: 0.78,
//         hasImage: false,
//         numLikes: 11,
//         numReplies: 4,
//     },
//     {
//         content: "Mày ăn ở chỗ đó bị food poisoning hả? Tao nghe nói chủ quán không vệ sinh gì hết à 🤮",
//         contentJson: lexRoot([
//             lexParagraph([lexText("Mày ăn ở chỗ đó bị food poisoning hả? Tao nghe nói chủ quán không vệ sinh gì hết à 🤮")]),
//             lexParagraph([lexText("Dơ bẩn kinh khủng, đừng ăn chỗ này nữa. Review của bọn kia toàn là fake hết á.")]),
//         ]),
//         label: PostScoreLabel.TOXIC,
//         confidence: 0.91,
//         isToxic: true,
//         numLikes: 2,
//         numReplies: 1,
//     },
//     {
//         content: "Hướng dẫn nấu phở bò chuẩn Hà Nội: nước dùng trong veo, thơm hồi quế",
//         contentJson: lexRoot([
//             lexHeading([lexText("🍲 Phở Bò Hà Nội – Công Thức Nước Dùng Chuẩn Vị")], "h2"),
//             lexParagraph([
//                 lexText("Phở Hà Nội khác phở Nam ở điểm "),
//                 lexBold("nước dùng trong, ngọt tự nhiên từ xương"),
//                 lexText(", không dùng bột ngọt nhiều. Đây là công thức mình học từ bà nội ở Hà Nội truyền lại."),
//             ]),
//             lexHeading([lexText("Bí quyết nước dùng")], "h3"),
//             lexList([
//                 "Xương ống bò 2kg: Chần sơ 5 phút rồi rửa sạch – loại bỏ tạp chất giúp nước trong.",
//                 "Nướng gừng, hành tây, hoa hồi, quế, thảo quả trên lửa trực tiếp đến khi có mùi thơm.",
//                 "Hầm xương ít nhất 6 tiếng, hớt bọt liên tục 1 tiếng đầu.",
//                 "Nêm nước mắm ngon + muối, không cần đường nếu xương tươi.",
//             ]),
//             lexQuote([lexText("\"Phở ngon hay dở phụ thuộc 70% vào nước dùng. Thịt chỉ là điểm cộng thêm.\"")]),
//             lexParagraph([lexText("Thời gian nấu: ~7 tiếng. Nhưng kết quả xứng đáng 100%!")]),
//         ]),
//         label: PostScoreLabel.MASTERPIECE,
//         confidence: 0.94,
//         hasImage: true,
//         numLikes: 201,
//         numReplies: 45,
//     },
//     {
//         content: "Thử làm bánh flan cafe tại nhà – mịn như nhung, không bọt",
//         contentJson: lexRoot([
//             lexHeading([lexText("☕ Bánh Flan Cafe – Mịn Không Bọt")], "h2"),
//             lexParagraph([lexText("Mình thử recipe này sau khi fail 3 lần với các công thức khác. Vấn đề chính là nhiệt độ và cách lọc trứng.")]),
//             lexHeading([lexText("Nguyên liệu")], "h3"),
//             lexList([
//                 "4 lòng đỏ + 2 trứng nguyên",
//                 "300ml sữa tươi không đường",
//                 "200ml kem tươi (heavy cream)",
//                 "80g đường + 1 shot espresso đặc",
//                 "Caramel: 100g đường + 2 muỗng nước",
//             ]),
//             lexHeading([lexText("Bí quyết không bọt")], "h3"),
//             lexList([
//                 "Đánh trứng nhẹ tay, không dùng máy – tránh tạo bọt khí.",
//                 "Lọc hỗn hợp qua rây 2 lần.",
//                 "Hấp cách thuỷ nhiệt độ thấp (70-80°C) trong 40 phút.",
//                 "Bọc màng thực phẩm trước khi hấp để hơi nước không rơi vào.",
//             ], "number"),
//         ]),
//         label: PostScoreLabel.DEEP_TALK,
//         confidence: 0.87,
//         hasImage: true,
//         numLikes: 113,
//         numReplies: 27,
//     },
//     {
//         content: "Chỉ có 100k ăn gì no ngon ở Q1?",
//         contentJson: lexRoot([
//             lexParagraph([lexText("Chỉ có 100k ăn gì no ngon ở Q1? Sáng giờ chưa ăn, đói quá 😭")]),
//             lexParagraph([lexText("Ai biết chỉ mình với, tks trước nha!")]),
//         ]),
//         label: PostScoreLabel.NEUTRAL,
//         confidence: 0.72,
//         numLikes: 8,
//         numReplies: 14,
//     },
//     {
//         content: "Khám phá ẩm thực đường phố Đà Nẵng – 10 món không thể bỏ qua",
//         contentJson: lexRoot([
//             lexHeading([lexText("🌊 Ẩm Thực Đà Nẵng – 10 Món Đường Phố Không Thể Bỏ Qua")], "h2"),
//             lexParagraph([lexBold("Vừa đi Đà Nẵng về, đây là danh sách đầy đủ nhất mình có thể làm.")]),
//             lexList([
//                 "Mì Quảng Bà Mua (Ngũ Hành Sơn) – Nước ngọt tự nhiên, bánh tráng nướng thơm.",
//                 "Bánh Xèo Bà Dưỡng – Giòn, nhân đầy đặn, nước chấm chuẩn Quảng.",
//                 "Bún Chả Cá – Khác hoàn toàn bún chả cá ở Sài Gòn, vị sâu hơn.",
//                 "Bánh Tráng Cuốn Thịt Heo – Ăn kèm mắm nêm, đặc sản không đâu có.",
//                 "Chè Bắp Hội An – Ngọt nhẹ, thơm, ăn nóng mới đúng vị.",
//                 "Bún Mắm Nêm – Mùi đặc trưng, không phải ai cũng thích nhưng ăn quen rồi ghiền.",
//                 "Bánh Bèo – Nhỏ xinh, chan nước đầy, ăn 10 cái mới đủ no.",
//                 "Cá Bống Kho Tiêu – Cơm chan, ăn đến cái đáy nồi.",
//                 "Nem Lụi Đà Nẵng – Cuốn rau thơm với bánh tráng mỏng, chấm tương bỏ đậu phộng.",
//                 "Chả Mực Tươi Hạ Long Đặt Hàng Tại Chỗ – Không phải Đà Nẵng nhưng có bán ở đây, chiên giòn ăn ngay.",
//             ]),
//             lexParagraph([lexItalic("Budget trung bình: 80-150k/bữa. Hoàn toàn thoải mái ăn ngon!")]),
//         ]),
//         label: PostScoreLabel.MASTERPIECE,
//         confidence: 0.9,
//         hasImage: true,
//         numLikes: 176,
//         numReplies: 38,
//     },
//     {
//         content: "Sự thật về \"cà phê trứng\" Hà Nội – Có thực sự ngon hay chỉ là hype?",
//         contentJson: lexRoot([
//             lexHeading([lexText("☕ Cà Phê Trứng Hà Nội – Hype hay Thực Chất?")], "h2"),
//             lexParagraph([lexText("Trước khi đi Hà Nội mình đã nghe quá nhiều về cà phê trứng. Kết quả sau khi thử 4 quán khác nhau:")]),
//             lexQuote([lexText("\"Ngon thật – nhưng chỉ ngon khi uống đúng chỗ đúng nhiệt độ.\"")]),
//             lexParagraph([
//                 lexText("Cà phê trứng "),
//                 lexBold("Đinh ở Đinh Tiên Hoàng"),
//                 lexText(" (nơi được cho là phát minh ra món này) cho mình cảm giác tốt nhất. Lớp kem trứng "),
//                 lexItalic("béo nhẹ, không tanh"),
//                 lexText(", phần cà phê bên dưới đắng vừa phải. Uống nóng bắt buộc."),
//             ]),
//             lexList([
//                 "Cà phê Đinh: 8.5/10 – Chuẩn vị gốc, không gian cổ kính.",
//                 "Cà phê Giảng: 7.5/10 – Đông khách hơn, vị ổn nhưng không bằng.",
//                 "Các quán copy: 5/10 – Kem trứng đặc quá, thiếu cà phê bên dưới.",
//             ]),
//         ]),
//         label: PostScoreLabel.DEEP_TALK,
//         confidence: 0.83,
//         numLikes: 89,
//         numReplies: 22,
//     },
// ];

// // ── 2. Du Lịch Việt Nam 🏔️ ───────────────────────────────────────────────────
// const TRAVEL_POSTS: CirclePostTemplate[] = [
//     {
//         content: "Hành trình 7N6Đ Tây Bắc dưới 5 triệu – Toàn bộ chi phí & kinh nghiệm",
//         contentJson: lexRoot([
//             lexHeading([lexText("🏔️ Tây Bắc 7N6Đ – Dưới 5 Triệu / Người")], "h2"),
//             lexParagraph([
//                 lexText("Chuyến đi Tây Bắc "),
//                 lexBold("tháng 9"),
//                 lexText(" vừa qua với 3 người, đây là toàn bộ hành trình và chi phí thực tế. Không phải con số lý thuyết trên mạng."),
//             ]),
//             lexHeading([lexText("Lịch trình")], "h3"),
//             lexList([
//                 "Ngày 1: Hà Nội → Mộc Châu (xe khách đêm 250k)",
//                 "Ngày 2: Mộc Châu – Đồi chè, thác Dải Yếm, chiều lên Sơn La",
//                 "Ngày 3: Sơn La → Điện Biên (xe máy thuê 150k/ngày)",
//                 "Ngày 4: Điện Biên – Tham quan chiến trường lịch sử",
//                 "Ngày 5: Điện Biên → Lai Châu qua đèo Tây Trang",
//                 "Ngày 6: Lai Châu → Sapa (xe khách 120k)",
//                 "Ngày 7: Sapa – Fansipan rồi tàu về Hà Nội đêm",
//             ], "number"),
//             lexHeading([lexText("Tổng chi phí (3 người, chia đều)")], "h3"),
//             lexList([
//                 "Xe khách đi về: 800k",
//                 "Homestay: 200k/đêm/người × 6 = 1.200k",
//                 "Xe máy thuê: 800k",
//                 "Ăn uống: 1.200k",
//                 "Vé tham quan & xăng: 400k",
//                 "Tổng: ~4.400k/người ✅",
//             ]),
//             lexParagraph([lexItalic("Tiết kiệm nhất: ăn cơm địa phương, tránh quán Tây. Thêm 500k nếu muốn leo Fansipan bằng cáp treo.")]),
//         ]),
//         label: PostScoreLabel.MASTERPIECE,
//         confidence: 0.95,
//         hasImage: true,
//         numLikes: 284,
//         numReplies: 67,
//     },
//     {
//         content: "Cần tư vấn đi Phú Quốc 3 ngày 2 đêm",
//         contentJson: lexRoot([
//             lexParagraph([lexText("Nhà mình 4 người (2 người lớn + 2 con nhỏ 5 và 8 tuổi) cần tư vấn đi Phú Quốc 3 ngày 2 đêm.")]),
//             lexParagraph([lexText("Budget khoảng 15-20 triệu. Không biết nên ở đâu, đi tour hay tự túc, mùa nào đẹp?")]),
//             lexParagraph([lexText("Ai có kinh nghiệm cho mình xin ý kiến với ạ, cảm ơn nhiều!")]),
//         ]),
//         label: PostScoreLabel.NEUTRAL,
//         confidence: 0.7,
//         numLikes: 5,
//         numReplies: 19,
//     },
//     {
//         content: "Review trung thực Sapa tháng 12 – Đẹp nhưng không phải như ảnh Instagram",
//         contentJson: lexRoot([
//             lexHeading([lexText("❄️ Sapa Tháng 12 – Review Không Filter")], "h2"),
//             lexParagraph([
//                 lexText("Trước khi đi mình xem toàn ảnh Instagram đẹp lung linh. Thực tế thì "),
//                 lexBold("đẹp thật nhưng rất đặc thù"),
//                 lexText(" – cần biết để không thất vọng."),
//             ]),
//             lexHeading([lexText("Thực tế vs Kỳ vọng")], "h3"),
//             lexList([
//                 "Sương mù: Nhiều hơn ảnh rất nhiều. Có ngày không thấy núi gì cả.",
//                 "Nhiệt độ: 5-12°C ban ngày, ban đêm xuống 2-3°C. Mang áo thật ấm.",
//                 "Đường: Đẹp khi khô, trơn kinh khủng khi ướt – cẩn thận nếu tự lái.",
//                 "Ruộng bậc thang: Tháng 12 đã thu hoạch, không vàng như tháng 9-10.",
//             ]),
//             lexHeading([lexText("Điểm vẫn đáng đi")], "h3"),
//             lexList([
//                 "Bản Cát Cát lúc sáng sớm trước 8h – ít người, ánh sáng đẹp.",
//                 "Ăn lẩu thắng cố nóng trong rét – trải nghiệm không nơi nào có.",
//                 "Chợ tình Sapa cuối tuần – văn hoá đặc sắc.",
//             ]),
//             lexQuote([lexText("\"Sapa đẹp nhất khi bạn không có kỳ vọng gì.\"")]),
//         ]),
//         label: PostScoreLabel.DEEP_TALK,
//         confidence: 0.88,
//         hasImage: true,
//         numLikes: 156,
//         numReplies: 34,
//     },
//     {
//         content: "BÁN TOUR GIÁ RẺ ĐÀ LẠT CHỈ 99K/NGƯỜI!! LH NGAY!!",
//         contentJson: lexRoot([
//             lexParagraph([lexBold("BÁN TOUR GIÁ RẺ ĐÀ LẠT CHỈ 99K/NGƯỜI!! LH NGAY!!")]),
//             lexParagraph([lexText("Bao gồm xe đưa đón, hướng dẫn viên, ăn uống đầy đủ. Số lượng có hạn!! Zalo 0909xxxxxx")]),
//         ]),
//         label: PostScoreLabel.TOXIC,
//         confidence: 0.97,
//         isSpam: true,
//         isToxic: true,
//         numLikes: 0,
//         numReplies: 2,
//     },
//     {
//         content: "Kinh nghiệm đi Hội An bằng xe máy từ Đà Nẵng – 30km đường ven biển đẹp nhất VN",
//         contentJson: lexRoot([
//             lexHeading([lexText("🛵 Đà Nẵng → Hội An Bằng Xe Máy")], "h2"),
//             lexParagraph([
//                 lexText("Đây là cung đường ven biển "),
//                 lexBoldItalic("đẹp nhất tôi từng đi"),
//                 lexText(" ở Việt Nam. 30km từ Đà Nẵng xuống Hội An qua Non Nước, Mỹ Khê, Cửa Đại."),
//             ]),
//             lexHeading([lexText("Lộ trình chi tiết")], "h3"),
//             lexList([
//                 "Xuất phát từ Đà Nẵng lúc 5:30 sáng – chụp bình minh trên biển.",
//                 "Dừng tại Ngũ Hành Sơn (7h) – leo vào hang động buổi sáng ít người.",
//                 "Tiếp tục qua bãi biển Mỹ Khê – biển đẹp nhất Đà Nẵng.",
//                 "Ghé làng rau Trà Quế (9h) – trải nghiệm làm nông nếu muốn.",
//                 "Đến phố cổ Hội An lúc 10h – trước khi nắng to.",
//             ], "number"),
//             lexParagraph([
//                 lexText("Thuê xe máy ở Đà Nẵng khoảng "),
//                 lexBold("100-150k/ngày"),
//                 lexText(". Xăng + phí gửi xe về là ~50k. Tổng chi phí đi về chưa đến 200k/người – không tour nào rẻ hơn."),
//             ]),
//         ]),
//         label: PostScoreLabel.MASTERPIECE,
//         confidence: 0.91,
//         hasImage: true,
//         numLikes: 219,
//         numReplies: 52,
//     },
//     {
//         content: "5 homestay dưới 300k/đêm ở Đà Lạt – Sạch sẽ, view núi, chủ thân thiện",
//         contentJson: lexRoot([
//             lexHeading([lexText("🌸 5 Homestay Đà Lạt Dưới 300k – Tự Trải Nghiệm")], "h2"),
//             lexParagraph([lexText("Mình đã ở từng nơi ít nhất 1 đêm, đây là đánh giá thực tế.")]),
//             lexList([
//                 "The Cliff House – 280k/đêm, view thung lũng, giường êm, chủ nhà nấu sáng ngon.",
//                 "Pine House Homestay – 250k, nằm trong rừng thông, yên tĩnh tuyệt đối.",
//                 "Cozy Nest Dalat – 220k, gần chợ đêm, thiết kế trẻ trung, wifi tốt.",
//                 "Mộc Nhiên Villa – 290k, phòng gỗ ấm áp, ban công hướng đồi chè.",
//                 "The Nest Cabin – 270k, kiểu cabin nhỏ, riêng tư, thích hợp couple.",
//             ]),
//             lexParagraph([lexItalic("Tip: Book trước 2 tuần vào cuối tuần. Mùa hoa dã quỳ (tháng 11-12) giá tăng gấp đôi.")]),
//         ]),
//         label: PostScoreLabel.SOLID,
//         confidence: 0.82,
//         numLikes: 103,
//         numReplies: 29,
//     },
//     {
//         content: "Đi du lịch một mình lần đầu cảm giác thế nào – Thực sự cô đơn hay tự do?",
//         contentJson: lexRoot([
//             lexHeading([lexText("🎒 Solo Travel Lần Đầu – Cô Đơn Hay Tự Do?")], "h2"),
//             lexParagraph([lexText("Tháng trước mình quyết định đi Phong Nha một mình sau khi kế hoạch đi nhóm bị huỷ lần 3. Đây là những gì mình học được.")]),
//             lexQuote([lexText("\"Cô đơn và cô lập là hai thứ khác nhau. Solo travel cho bạn cô đơn nhưng không cô lập.\"")]),
//             lexParagraph([lexText("Thực tế mình đã gặp 6 người khác ở hostel và cùng đi cave tour với họ cả ngày. Cuối ngày còn có bạn nhậu. Một mình không có nghĩa là không gặp ai.")]),
//             lexHeading([lexText("Điều mình học được")], "h3"),
//             lexList([
//                 "Tự quyết định không cần thuyết phục ai – vô giá.",
//                 "Phải tự lo mọi thứ – rèn tính tự lập nhanh hơn bất kỳ khoá học nào.",
//                 "Gặp nhiều người hơn khi đi một mình vì buộc phải mở lòng.",
//                 "Sợ nhất là ăn bàn 1 người, nhưng rồi cũng qua.",
//             ]),
//         ]),
//         label: PostScoreLabel.DEEP_TALK,
//         confidence: 0.86,
//         numLikes: 134,
//         numReplies: 41,
//     },
//     {
//         content: "Mưa liên tục 3 ngày ở Hạ Long, tàu bị huỷ, tiền mất tật mang 😤",
//         contentJson: lexRoot([
//             lexParagraph([lexText("Mưa liên tục 3 ngày ở Hạ Long, tàu bị huỷ, tiền mất tật mang 😤")]),
//             lexParagraph([lexText("Ai đi tháng 7-8 Hạ Long thì cân nhắc lại đi, mưa bão không khác gì ở nhà. Phí vé không hoàn lại nữa, tức điên.")]),
//         ]),
//         label: PostScoreLabel.NOISE,
//         confidence: 0.74,
//         numLikes: 23,
//         numReplies: 8,
//     },
//     {
//         content: "Bản đồ ẩm thực dọc theo Quốc lộ 1A – Từ Hà Nội vào Sài Gòn bằng xe máy",
//         contentJson: lexRoot([
//             lexHeading([lexText("🗺️ Ẩm Thực Dọc QL1A – Hà Nội → Sài Gòn")], "h2"),
//             lexParagraph([
//                 lexText("Hành trình xuyên Việt bằng xe máy 22 ngày. Mình ghi lại tất cả quán ngon đáng dừng chân theo từng tỉnh."),
//             ]),
//             lexList([
//                 "Ninh Bình – Cơm cháy Ninh Bình + thịt dê núi: Đặc sản không thể bỏ.",
//                 "Thanh Hoá – Nem chua Thanh Hoá: Chỉ ngon khi mua ở chợ, không phải siêu thị.",
//                 "Nghệ An – Cháo lươn Vinh: Sáng sớm, quán bà Minh đường Hồ Xuân Hương.",
//                 "Hà Tĩnh – Kẹo cu đơ: Mua tại lò, ăn nóng mới đúng điệu.",
//                 "Quảng Bình – Bánh đúc nước cốt dừa: Ít ai biết món này.",
//                 "Huế – Bún bò, bánh bèo, cơm hến: Cả buổi sáng đi ăn rong.",
//                 "Đà Nẵng – Mì Quảng, bánh xèo, bún chả cá.",
//                 "Quảng Ngãi – Bún bò giò heo: Ít nổi tiếng nhưng ngon vl.",
//                 "Bình Định – Bún chả cá 17 tháng 9: Địa chỉ bà con địa phương chỉ.",
//                 "Bình Thuận – Bánh căn Phan Thiết: Ăn chiều mát trời.",
//             ]),
//             lexParagraph([lexBold("Full Google Map pin: "), lexText("Sẽ share trong comment, ai cần cmt xin.")]),
//         ]),
//         label: PostScoreLabel.MASTERPIECE,
//         confidence: 0.93,
//         hasImage: true,
//         numLikes: 312,
//         numReplies: 89,
//     },
//     {
//         content: "Câu hỏi ngu: Visa Nhật xin ở đâu? Có cần chứng minh tài chính không?",
//         contentJson: lexRoot([
//             lexParagraph([lexText("Câu hỏi ngu: Visa Nhật xin ở đâu? Có cần chứng minh tài chính không? Mình chưa đi nước ngoài lần nào nên không biết gì hết.")]),
//             lexParagraph([lexText("Lương 15tr/tháng, có sổ tiết kiệm 50tr, đủ không ạ? Cảm ơn mọi người!")]),
//         ]),
//         label: PostScoreLabel.NEUTRAL,
//         confidence: 0.68,
//         numLikes: 6,
//         numReplies: 22,
//     },
// ];

// // ── 3. Digital Nomad VN 💻 ────────────────────────────────────────────────────
// const NOMAD_POSTS: CirclePostTemplate[] = [
//     {
//         content: "Làm remote 2 năm: Bài học xương máu về năng suất, cô đơn và tự do thật sự",
//         contentJson: lexRoot([
//             lexHeading([lexText("💻 2 Năm Làm Remote – Bài Học Xương Máu")], "h2"),
//             lexParagraph([
//                 lexText("Quit job văn phòng tháng 3/2023 để full remote. Đây là những gì mình "),
//                 lexBold("không ai nói trước"),
//                 lexText(" về lifestyle này."),
//             ]),
//             lexHeading([lexText("Những gì đẹp thật sự")], "h3"),
//             lexList([
//                 "Không commute 2 tiếng/ngày = thêm 60 giờ/tháng cho bản thân.",
//                 "Làm việc từ quán cà phê Đà Lạt lúc 7h sáng, nhìn ra sương mù – không đánh đổi được.",
//                 "Tự chọn môi trường làm việc theo năng lượng của ngày.",
//             ]),
//             lexHeading([lexText("Những gì không ai nói")], "h3"),
//             lexList([
//                 "Cô đơn thật sự, không phải cô đơn lãng mạn. Đặc biệt khi sick hoặc có chuyện.",
//                 "Ranh giới work-life blur hoàn toàn – giờ nào cũng có thể là giờ làm.",
//                 "Tự kỷ luật khó hơn 10 lần có sếp nhìn màn hình.",
//                 "Chi phí cafe/cowork/internet di động cộng lại không ít.",
//             ]),
//             lexQuote([lexText("\"Remote work không phải vacation. Đó là công việc thật, chỉ là location khác.\"")]),
//             lexParagraph([lexText("Tổng kết: Mình vẫn chọn remote. Nhưng sẽ chuẩn bị tốt hơn nếu quay lại vạch xuất phát.")]),
//         ]),
//         label: PostScoreLabel.MASTERPIECE,
//         confidence: 0.93,
//         hasImage: false,
//         numLikes: 267,
//         numReplies: 71,
//     },
//     {
//         content: "Top 7 coworking space ở TP.HCM cho digital nomad – Giá, wifi, vibe",
//         contentJson: lexRoot([
//             lexHeading([lexText("🏢 7 Coworking Space Tốt Nhất HCM")], "h2"),
//             lexParagraph([lexText("Đã thử hơn 15 chỗ, đây là top 7 mình thật sự recommend.")]),
//             lexList([
//                 "Toong (Phạm Ngọc Thạch) – 120k/ngày, wifi blazing fast, cộng đồng startup đông.",
//                 "WeWork (Bitexco) – Sang nhưng xứng đáng 200k/ngày, view Sài Gòn đỉnh.",
//                 "Kafnu (Đống Đa) – Vừa là cafe vừa là cowork, 80k/ngày có drink.",
//                 "The Hive (Pasteur) – Yên tĩnh, phù hợp deep work, 90k/ngày.",
//                 "Venn (Võ Văn Tần) – Nhiều event networking, 100k/ngày.",
//                 "Base Hub (nhiều địa điểm) – Giá rẻ nhất 60k/ngày, wifi ổn.",
//                 "Mori Cowork (Tân Bình) – Gần sân bay, 70k/ngày, không khí creative.",
//             ]),
//             lexParagraph([lexItalic("Tip: Nhiều chỗ có gói tháng rẻ hơn 40-50% so với ngày. Negotiate được nếu đăng ký 3 tháng.")]),
//         ]),
//         label: PostScoreLabel.SOLID,
//         confidence: 0.84,
//         numLikes: 89,
//         numReplies: 26,
//     },
//     {
//         content: "Ai có kinh nghiệm làm freelance trên Upwork cho người Việt không? Share với",
//         contentJson: lexRoot([
//             lexParagraph([lexText("Ai có kinh nghiệm làm freelance trên Upwork cho người Việt không? Share với mình.")]),
//             lexParagraph([lexText("Mình là dev backend 3 năm, muốn thêm thu nhập bên ngoài. Bắt đầu từ đâu, profile cần gì, bid rate bao nhiêu?")]),
//         ]),
//         label: PostScoreLabel.NEUTRAL,
//         confidence: 0.65,
//         numLikes: 12,
//         numReplies: 31,
//     },
//     {
//         content: "Giải pháp internet ổn định cho nomad ở Việt Nam – Sim, pocket wifi hay cáp?",
//         contentJson: lexRoot([
//             lexHeading([lexText("📶 Internet Cho Digital Nomad Ở Việt Nam – So Sánh Thực Tế")], "h2"),
//             lexParagraph([lexText("Sau 18 tháng làm việc từ 12 tỉnh thành, đây là đánh giá thực tế của mình về các giải pháp internet.")]),
//             lexHeading([lexText("Sim 4G/5G")], "h3"),
//             lexList([
//                 "Viettel: Phủ sóng rộng nhất, vùng núi vẫn có sóng. 150k/tháng gói 12GB tốc độ cao.",
//                 "Vinaphone: Nhanh ở thành phố, yếu ở vùng xa. 120k/tháng.",
//                 "Mobifone: Ổn định vừa phải, phù hợp backup sim.",
//             ]),
//             lexHeading([lexText("Pocket Wifi")], "h3"),
//             lexList([
//                 "Thuê theo ngày: 50-80k, phù hợp đi ngắn hạn.",
//                 "Mua thiết bị: 800k-1.5tr, kết nối 5-10 thiết bị cùng lúc.",
//             ]),
//             lexQuote([lexText("Kết luận: Sim Viettel + Vinaphone backup = đủ dùng 95% tình huống ở Việt Nam.")]),
//         ]),
//         label: PostScoreLabel.DEEP_TALK,
//         confidence: 0.86,
//         numLikes: 121,
//         numReplies: 33,
//     },
//     {
//         content: "Tuyển CỘNG TÁC VIÊN kiếm thêm thu nhập 5-10tr/tháng làm việc tại nhà. Ai quan tâm nhắn tin!",
//         contentJson: lexRoot([
//             lexParagraph([lexBold("Tuyển CỘNG TÁC VIÊN kiếm thêm thu nhập 5-10tr/tháng làm việc tại nhà. Ai quan tâm nhắn tin!")]),
//             lexParagraph([lexText("Không cần kinh nghiệm, làm online hoàn toàn, thu nhập theo performance, hoa hồng hấp dẫn.")]),
//         ]),
//         label: PostScoreLabel.TOXIC,
//         confidence: 0.96,
//         isSpam: true,
//         isToxic: true,
//         numLikes: 1,
//         numReplies: 0,
//     },
//     {
//         content: "Kinh nghiệm setup home office chuẩn chỉnh với budget 10 triệu",
//         contentJson: lexRoot([
//             lexHeading([lexText("🖥️ Home Office Chuẩn Chỉnh – Budget 10 Triệu")], "h2"),
//             lexParagraph([lexText("Sau khi thử nhiều setup khác nhau, đây là cấu hình mình thấy cho năng suất tốt nhất mà không cần chi quá nhiều.")]),
//             lexHeading([lexText("List mua sắm")], "h3"),
//             lexList([
//                 "Màn hình 24-27\" (IPS, 75Hz+): 2.5-3tr – đầu tư tốt nhất, mắt đỡ mỏi.",
//                 "Bàn phím mechanical (Keychron K2 hoặc Anne Pro 2): 1.5-2tr",
//                 "Chuột ergonomic (Logitech MX Master hoặc M720): 800k-1.5tr",
//                 "Webcam 1080p (Logitech C920): 1.2tr – quan trọng cho call",
//                 "Đèn LED ring/key light: 300-500k",
//                 "Ghế ngồi (quan trọng!): 1.5-2tr tối thiểu",
//                 "Bàn nâng hạ: Nếu còn ngân sách, thêm 3-4tr",
//             ]),
//             lexParagraph([lexBold("Tổng: ~9-10tr"), lexText(". Không cần Mac hay màn hình 4K ở bước này.")]),
//         ]),
//         label: PostScoreLabel.SOLID,
//         confidence: 0.81,
//         hasImage: true,
//         numLikes: 95,
//         numReplies: 28,
//     },
// ];

// // ─── Post Image Pool ───────────────────────────────────────────────────────────
// const POST_IMAGE_POOL = [
//     "https://i.pinimg.com/originals/88/e0/6e/88e06ede2822923413088897af065b03.jpg",
//     "https://i.pinimg.com/originals/38/5e/15/385e15ed827b40a02b4734edde8cfa8a.jpg",
//     "https://i.pinimg.com/originals/f2/58/29/f25829d5213996ef3bf765c67ed68fbb.jpg",
//     "https://i.pinimg.com/originals/0b/66/9a/0b669aa31c8781da6010960c6e1012b0.jpg",
//     "https://i.pinimg.com/originals/15/dd/c3/15ddc353abf305016f88cc6dba86fde1.jpg",
//     "https://i.pinimg.com/originals/b1/af/cf/b1afcfaf70963daaa6c2786ec7f6f2eb.jpg",
//     "https://i.pinimg.com/originals/68/f4/db/68f4db72ab2c505a01c5de443c4315fd.jpg",
//     "https://i.pinimg.com/originals/c4/71/0e/c4710ee2d312d2bf2a5bc1b478013bce.jpg",
//     "https://i.pinimg.com/originals/0a/da/bd/0adabd591af61a5f3c18d2252ccb9de4.jpg",
//     "https://i.pinimg.com/originals/98/10/47/98104778fe1e452538306d7d736284c2.png",
//     "https://i.pinimg.com/originals/a0/1d/d6/a01dd625cab0b709548f7cc6a5313283.jpg",
//     "https://i.pinimg.com/originals/47/ba/58/47ba587905d613fee12e5880066b63f6.jpg",
// ];

// const REPLY_POOL = [
//     "Bài này hay quá! Save lại để đọc sau 📌",
//     "Ủa vậy mình bị ngược lại hoàn toàn lol",
//     "Cảm ơn bạn đã chia sẻ! Đúng kinh nghiệm mình cần",
//     "Mình đồng ý điểm 2 và 4, còn điểm 3 thì hơi khác nhau chút",
//     "Omg đây là thông tin mình tìm kiếm cả tuần nay",
//     "Bổ sung thêm: theo kinh nghiệm của mình thì...",
//     "Thật không, mình sắp thử mà đọc bài này thêm tự tin rồi 😄",
//     "Disagree chút xíu, nhưng overall bài viết tốt",
//     "Bạn chia sẻ thêm về điểm X được không?",
//     "Cảm giác đọc bài này xong muốn pack đồ đi liền 😭",
// ];

// // ─── Mapping tên circle → template posts ──────────────────────────────────────
// const CIRCLE_POST_MAP: Record<string, CirclePostTemplate[]> = {
//     "Sài Gòn Foodies 🍜": FOODIES_POSTS,
//     "Du Lịch Việt Nam 🏔️": TRAVEL_POSTS,
//     "Digital Nomad VN 💻": NOMAD_POSTS,
// };

// // Fallback: Sinh bài generic cho các circle còn lại
// function buildGenericPostsForCircle(circleName: string, count: number): CirclePostTemplate[] {
//     const topics: Record<string, { heads: string[]; labels: PostScoreLabel[]; contents: string[] }> = {
//         "OOTD Vietnam 👗": {
//             heads: ["Look của ngày hôm nay", "Thời trang đường phố Hà Nội", "Outfit cho mùa mưa"],
//             labels: [PostScoreLabel.SOLID, PostScoreLabel.NOISE, PostScoreLabel.MASTERPIECE, PostScoreLabel.DEEP_TALK],
//             contents: ["Hôm nay mình thử mix vintage và streetwear. Cảm giác khá ổn!", "Mưa Sài Gòn mà vẫn phải fashion 🌧️"],
//         },
//         "Skincare & Beauty VN 💄": {
//             heads: ["Routine buổi sáng của mình", "Review serum Vitamin C giá rẻ", "Đừng mắc những lỗi này khi chăm da"],
//             labels: [PostScoreLabel.DEEP_TALK, PostScoreLabel.SOLID, PostScoreLabel.NEUTRAL, PostScoreLabel.MASTERPIECE],
//             contents: ["Sau 3 tháng kiên trì skin care, da mình thay đổi rõ rệt.", "Review thật lòng về sản phẩm này sau 4 tuần dùng."],
//         },
//         "Mèo Cún Việt Nam 🐱🐶": {
//             heads: ["Bé nhà mình hôm nay", "Chia sẻ kinh nghiệm nuôi mèo", "Cần tìm nhà cho bé này"],
//             labels: [PostScoreLabel.SOLID, PostScoreLabel.DEEP_TALK, PostScoreLabel.MASTERPIECE, PostScoreLabel.NEUTRAL],
//             contents: ["Bé mèo tên Mochi nhà mình có sở thích ngủ trên laptop 💻", "Chia sẻ cách chọn thức ăn cho mèo lười ăn."],
//         },
//         default: {
//             heads: ["Chia sẻ của ngày hôm nay", "Kinh nghiệm đáng giá", "Câu chuyện hay"],
//             labels: [PostScoreLabel.SOLID, PostScoreLabel.NEUTRAL, PostScoreLabel.MASTERPIECE, PostScoreLabel.NOISE, PostScoreLabel.DEEP_TALK],
//             contents: ["Hôm nay có điều muốn chia sẻ với mọi người.", "Đây là bài học mình rút ra sau thời gian dài."],
//         },
//     };

//     const cfg = topics[circleName] || topics.default;
//     const results: CirclePostTemplate[] = [];

//     for (let i = 0; i < count; i++) {
//         const head = pick(cfg.heads);
//         const contentText = pick(cfg.contents);
//         const label = pick(cfg.labels);
//         const isNegative = label === PostScoreLabel.TOXIC || label === PostScoreLabel.NOISE;

//         results.push({
//             content: `${head} – ${contentText}`,
//             contentJson: lexRoot([
//                 lexHeading([lexText(head)], "h2"),
//                 lexParagraph([
//                     lexText(contentText),
//                     lexText(" "),
//                     label === PostScoreLabel.MASTERPIECE ? lexBold("Chất lượng cao, đáng đọc!") : lexText(""),
//                 ]),
//                 lexParagraph([lexText(`📌 Chia sẻ trong nhóm ${circleName}`)]),
//             ]),
//             label,
//             confidence: parseFloat((Math.random() * 0.3 + 0.65).toFixed(2)),
//             isToxic: label === PostScoreLabel.TOXIC,
//             isSpam: isNegative && Math.random() < 0.3,
//             hasImage: Math.random() < 0.4,
//             numLikes: isNegative ? rand(0, 15) : rand(10, 200),
//             numReplies: rand(0, 30),
//         });
//     }
//     return results;
// }

// // ─── MAIN SEED ────────────────────────────────────────────────────────────────
// async function seedCirclePosts() {
//     console.log("\n🌱 ===== SEED CIRCLE POSTS =====\n");

//     // Load circles với members
//     const circles = await prisma.circle.findMany({
//         select: {
//             id: true,
//             publicId: true,
//             name: true,
//             circleMembers: {
//                 select: {
//                     id: true,
//                     userId: true,
//                     user: {
//                         select: { id: true, username: true, name: true, avatar: true, bio: true },
//                     },
//                 },
//             },
//             circleEnergies: { select: { id: true, current: true, max: true, level: true } },
//         },
//         take: 30,
//     });

//     if (circles.length === 0) {
//         throw new Error("Không có circle nào! Hãy chạy seed gốc trước.");
//     }

//     console.log(`📋 Tìm thấy ${circles.length} circles. Bắt đầu tạo bài viết...\n`);

//     let totalPosts = 0;
//     let totalMedia = 0;
//     let totalQualityLogs = 0;
//     let totalExpLogs = 0;
//     let totalReplies = 0;
//     let imgIdx = 0;

//     for (const circle of circles) {
//         if (circle.circleMembers.length === 0) {
//             console.log(`   ⚠️  ${circle.name} – Không có member, bỏ qua`);
//             continue;
//         }

//         const energy = circle.circleEnergies[0];
//         let currentHp = energy?.current ?? 500;
//         const energyId = energy?.id;

//         // Lấy template bài viết cho circle này
//         const templatePosts =
//             CIRCLE_POST_MAP[circle.name] ??
//             buildGenericPostsForCircle(circle.name, rand(50, 60));

//         // Đảm bảo ít nhất 50 bài
//         let postsToCreate = [...templatePosts];
//         if (postsToCreate.length < 50) {
//             const extra = buildGenericPostsForCircle(circle.name, 50 - postsToCreate.length);
//             postsToCreate = [...postsToCreate, ...extra];
//         }
//         // Shuffle để phân bố label ngẫu nhiên
//         postsToCreate = shuffle(postsToCreate);

//         const members = circle.circleMembers;
//         const circlePostsCreated: number[] = [];

//         console.log(`\n  ⭕ ${circle.name} (${members.length} members, ${postsToCreate.length} bài)`);

//         for (let pi = 0; pi < postsToCreate.length; pi++) {
//             const template = postsToCreate[pi];
//             const member = members[pi % members.length];
//             const author = member.user;
//             const createdAt = randomDate(90);

//             // 1. Tạo post
//             const post = await prisma.post.create({
//                 data: {
//                     userId: author.id,
//                     content: template.content,
//                     contentJson: template.contentJson,
//                     type: PostType.CIRCLE,
//                     visibility: VisibilityPost.CIRCLE,
//                     replyPermission: pick([ReplyPermission.EVERYONE, ReplyPermission.FOLLOWERS, ReplyPermission.EVERYONE]),
//                     userSnapshot: {
//                         id: author.id,
//                         username: author.username,
//                         name: author.name,
//                         avatar: author.avatar,
//                         bio: author.bio,
//                     },
//                     likesCount: template.numLikes ?? rand(0, 150),
//                     repliesCount: template.numReplies ?? rand(0, 30),
//                     repostsCountAndQuoteCount: rand(0, 20),
//                     viewsCount: rand(50, 8000),
//                     isHidden: template.isToxic ? Math.random() < 0.7 : false,
//                     isDisinformation: template.isSpam ?? false,
//                     createdAt,
//                     updatedAt: createdAt,
//                 },
//                 select: { id: true, publicId: true },
//             });
//             circlePostsCreated.push(post.id);
//             totalPosts++;

//             // 2. Tạo media nếu có
//             if (template.hasImage) {
//                 const numImages = rand(1, 3);
//                 const mediaItems = Array.from({ length: numImages }, (_, m) => ({
//                     postId: post.id,
//                     url: POST_IMAGE_POOL[imgIdx++ % POST_IMAGE_POOL.length],
//                     type: PostMediaType.IMAGE,
//                     width: pick([720, 1080, 1280]),
//                     height: pick([720, 1080, 1350]),
//                     key: `circle_img_${post.id}_${m}_${Date.now() + m + pi}`,
//                     status: PostMediaStatus.UPLOADED,
//                 }));
//                 await prisma.postMedia.createMany({ data: mediaItems });
//                 totalMedia += numImages;
//             }

//             // 3. CirclePostQualityLog
//             if (template.label !== PostScoreLabel.PENDING) {
//                 const cfg = SCORE_CONFIG[template.label];
//                 const score =
//                     template.label === PostScoreLabel.MASTERPIECE ? rand(9, 10) :
//                         template.label === PostScoreLabel.DEEP_TALK ? rand(7, 8) :
//                             template.label === PostScoreLabel.SOLID ? rand(5, 6) :
//                                 template.label === PostScoreLabel.NEUTRAL ? rand(3, 4) :
//                                     template.label === PostScoreLabel.NOISE ? rand(2, 3) :
//                                         rand(0, 1); // TOXIC

//                 try {
//                     await prisma.circlePostQualityLog.create({
//                         data: {
//                             circleId: circle.id,
//                             circleMemberId: member.id,
//                             postId: post.id,
//                             score,
//                             label: template.label,
//                             hpDelta: cfg.hpDelta,
//                             expDelta: cfg.expDelta,
//                             reason: template.label === PostScoreLabel.MASTERPIECE
//                                 ? "Bài viết chất lượng cao, thông tin chi tiết và hữu ích cho cộng đồng"
//                                 : template.label === PostScoreLabel.DEEP_TALK
//                                     ? "Nội dung sâu sắc, khơi gợi thảo luận tích cực"
//                                     : template.label === PostScoreLabel.SOLID
//                                         ? "Bài viết ổn định, đúng chủ đề nhóm"
//                                         : template.label === PostScoreLabel.NEUTRAL
//                                             ? "Nội dung bình thường, không vi phạm nhưng không đặc sắc"
//                                             : template.label === PostScoreLabel.NOISE
//                                                 ? "Nội dung chưa đủ giá trị, thiếu thông tin cụ thể"
//                                                 : "Vi phạm nội quy nhóm, nội dung tiêu cực hoặc spam",
//                             confidence: template.confidence,
//                             isToxic: template.isToxic ?? false,
//                             isSpam: template.isSpam ?? false,
//                             createdAt,
//                         },
//                     });
//                     totalQualityLogs++;

//                     // 4. Cập nhật HP của circle energy
//                     if (energyId && cfg.hpDelta !== 0) {
//                         currentHp = Math.max(0, Math.min(energy?.max ?? 500, currentHp + cfg.hpDelta));
//                     }

//                     // 5. CircleExpLog (chỉ khi có exp tăng)
//                     if (cfg.expDelta > 0) {
//                         try {
//                             await prisma.circleExpLog.create({
//                                 data: {
//                                     userId: author.id,
//                                     circleId: circle.id,
//                                     postId: post.id,
//                                     expReason: cfg.expReason,
//                                     expDelta: cfg.expDelta,
//                                     isDelta: true,
//                                     createdAt,
//                                     updatedAt: createdAt,
//                                 },
//                             });
//                             totalExpLogs++;
//                         } catch {
//                             // unique constraint – skip
//                         }
//                     }
//                 } catch (e) {
//                     // skip nếu post đã có quality log
//                 }
//             }

//             // 6. Replies
//             const numReplies = template.numReplies ?? rand(0, 8);
//             if (numReplies > 0) {
//                 const repliers = shuffle(members.filter((m) => m.userId !== author.id)).slice(0, numReplies);
//                 if (repliers.length > 0) {
//                     const replyCreatedAt = new Date(createdAt.getTime() + rand(60_000, 3_600_000));
//                     await prisma.post.createMany({
//                         data: repliers.map((r) => ({
//                             userId: r.user.id,
//                             content: pick(REPLY_POOL),
//                             type: PostType.CIRCLE_REPLY,
//                             visibility: VisibilityPost.CIRCLE,
//                             replyPermission: ReplyPermission.EVERYONE,
//                             parentId: post.id,
//                             parentPublicId: post.publicId,
//                             rootPostId: post.id,
//                             rootPublicId: post.publicId,
//                             userSnapshot: {
//                                 id: r.user.id,
//                                 username: r.user.username,
//                                 name: r.user.name,
//                                 avatar: r.user.avatar,
//                                 bio: r.user.bio,
//                             },
//                             likesCount: rand(0, 20),
//                             repliesCount: 0,
//                             repostsCountAndQuoteCount: 0,
//                             viewsCount: rand(5, 200),
//                             createdAt: replyCreatedAt,
//                             updatedAt: replyCreatedAt,
//                         })),
//                     });
//                     totalReplies += repliers.length;
//                 }
//             }

//             process.stdout.write(`\r    ${pi + 1}/${postsToCreate.length} bài | HP: ${currentHp}`);
//         }

//         // Cập nhật HP vào CircleEnergy
//         if (energyId) {
//             await prisma.circleEnergy.update({
//                 where: { id: energyId },
//                 data: { current: currentHp, updatedAt: new Date() },
//             });
//         }

//         console.log(`\n    ✅ ${postsToCreate.length} bài | HP cập nhật: ${energy?.current} → ${currentHp}`);
//     }

//     // ── Summary ──────────────────────────────────────────────────────────────────
//     console.log(`
// 🎉 ===== SEED CIRCLE POSTS HOÀN THÀNH =====
//    📝 Posts Circle    : ${totalPosts}
//    🖼️  PostMedia       : ${totalMedia}
//    📊 Quality Logs    : ${totalQualityLogs}
//    ⚡ Exp Logs        : ${totalExpLogs}
//    💬 Replies         : ${totalReplies}
// ==========================================`);
// }

// // ─── ENTRY POINT ──────────────────────────────────────────────────────────────
// seedCirclePosts()
//     .catch((e) => {
//         console.error("\n❌ Seed thất bại:", e);
//         process.exit(1);
//     })
//     .finally(() => prisma.$disconnect());