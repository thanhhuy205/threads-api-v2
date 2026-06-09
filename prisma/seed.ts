
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






// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import {
//     PostMediaStatus,
//     PostMediaType,
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

// // ─── 200+ Hashtags (thực tế Việt Nam, phân theo chủ đề) ──────────────────────
// export const ALL_HASHTAGS: string[] = [
//     // Ẩm thực (30 tags)
//     "amthuc",
//     "foodie",
//     "xuhuongamthuc",
//     "saigonfood",
//     "hanoidishes",
//     "comtam",
//     "bunbo",
//     "pho",
//     "banhmi",
//     "cafesaigon",
//     "trasuavietnam",
//     "streetfood",
//     "homecooking",
//     "naucuoi",
//     "reviewquanan",
//     "banhngot",
//     "lauphat",
//     "nuongbbq",
//     "doanhnhan",       // sẽ dùng lại nếu cần nhưng tách riêng chủ đề
//     "hatieu",
//     "raumam",
//     "banhcuon",
//     "chebavien",
//     "cahepho",
//     "nuocep",
//     "bakery",
//     "dessertlover",
//     "vietfood",
//     "anngon",
//     "foodphotography",

//     // Du lịch (30 tags)
//     "dulichvietnam",
//     "travel",
//     "xuhuongdulich",
//     "phuquoc",
//     "dalat",
//     "sapa",
//     "halong",
//     "hoian",
//     "danang",
//     "nhatrang",
//     "cantho",
//     "hue",
//     "buonmathuot",
//     "phanthiet",
//     "condao",
//     "muicne",
//     "laocai",
//     "hagiang",
//     "backpacker",
//     "solotraveler",
//     "dulichbalo",
//     "checkin",
//     "sunrisevietnam",
//     "nongnghiep",
//     "homestay",
//     "campingvn",
//     "roadtrip",
//     "phongnhatourist",
//     "trekking",
//     "mountainlife",

//     // Thời trang & Làm đẹp (30 tags)
//     "ootd",
//     "fashion",
//     "streetstyle",
//     "skincare",
//     "beauty",
//     "trangdiem",
//     "chamsocda",
//     "hairstyle",
//     "nail",
//     "makeup",
//     "thoitrang",
//     "vintage",
//     "thrifted",
//     "outfit",
//     "mensfashion",
//     "womensfashion",
//     "summerlook",
//     "casualfit",
//     "luxuryfashion",
//     "koreanskincare",
//     "routine",
//     "glowup",
//     "lipstick",
//     "eyeshadow",
//     "sundress",
//     "denim",
//     "sneakers",
//     "handbag",
//     "accessories",
//     "watchlover",

//     // Công nghệ & Lập trình (25 tags)
//     "coding",
//     "developer",
//     "tech",
//     "laptrinh",
//     "javascript",
//     "typescript",
//     "reactjs",
//     "nextjs",
//     "nodejs",
//     "python",
//     "ai",
//     "machinelearning",
//     "startup",
//     "saas",
//     "webdev",
//     "devlife",
//     "programmerhumor",
//     "opensource",
//     "database",
//     "api",
//     "deployment",
//     "docker",
//     "github",
//     "freelancer",
//     "remote",

//     // Sức khỏe & Thể thao (20 tags)
//     "fitness",
//     "gym",
//     "yoga",
//     "chaybo",
//     "suckhoe",
//     "workout",
//     "healthyeating",
//     "weightloss",
//     "muscle",
//     "running",
//     "cycling",
//     "swimming",
//     "bongda",
//     "tennis",
//     "badminton",
//     "marathon",
//     "wellbeing",
//     "mentalhealth",
//     "meditation",
//     "pilates",

//     // Đời sống & Cảm xúc (20 tags)
//     "tamsu",
//     "cuocsong",
//     "nghimoi",
//     "sachvahoa",
//     "sohoc",
//     "langman",
//     "docsach",
//     "music",
//     "nhacviet",
//     "vpop",
//     "kpop",
//     "phim",
//     "series",
//     "anime",
//     "gaming",
//     "booklover",
//     "artlover",
//     "photography",
//     "sunrise",
//     "livelife",

//     // Động vật cưng (10 tags)
//     "meocon",
//     "cuncung",
//     "doglife",
//     "catlife",
//     "petlover",
//     "thucung",
//     "rescuedog",
//     "rescuecat",
//     "cutepet",
//     "fluffycat",

//     // Môi trường & Bền vững (10 tags)
//     "zerowaste",
//     "sustainable",
//     "xanhlacay",
//     "moitruong",
//     "recycling",
//     "vegancooking",
//     "plantbased",
//     "solarpanel",
//     "gogreen",
//     "ecofriendly",

//     // Tài chính & Đầu tư (10 tags)
//     "taichinhhcanhan",
//     "dautu",
//     "chungkhoan",
//     "realestate",
//     "batdongsan",
//     "tiettiem",
//     "muagold",
//     "crypto",
//     "financelife",
//     "sidehustle",

//     // Gen Z / Viral (20 tags)
//     "genzlife",
//     "viral",
//     "trending",
//     "xuhuong",
//     "funny",
//     "meme",
//     "relatable",
//     "randomthoughts",
//     "nightowl",
//     "overthinking",
//     "introvert",
//     "coffeeaddict",
//     "mondaymotivation",
//     "fridayvibes",
//     "weekendplans",
//     "nofilter",
//     "dailyvlog",
//     "asmr",
//     "satisfying",
//     "diy",
// ];

// // ─── Image pool ───────────────────────────────────────────────────────────────
// const IMAGE_POOL: string[] = [
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
// ];

// // ─── Video pool (placeholder URLs – replace với CDN thực) ─────────────────────
// const VIDEO_POOL: string[] = [
//     "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//     "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//     "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
//     "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
//     "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
//     "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
//     "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
//     "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
//     "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
//     "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
// ];

// // ─── Content templates theo hashtag ──────────────────────────────────────────
// type PostMediaDef =
//     | { kind: "images"; count: number }
//     | { kind: "video" }
//     | { kind: "images+video"; imgCount: number };

// interface PostTemplate {
//     content: string;
//     hashtag: string;
//     media: PostMediaDef;
// }

// /**
//  * Sinh nội dung bài viết đủ đa dạng.
//  * Mỗi hashtag được gán ít nhất 1 bài, nhiều hashtag hot được gán nhiều bài hơn
//  * để dữ liệu trending có nghĩa thống kê.
//  */
// function buildPostTemplates(): PostTemplate[] {
//     // Định nghĩa weight: hashtag hot → xuất hiện nhiều lần hơn
//     const HOT_HASHTAGS: Record<string, number> = {
//         amthuc: 8,
//         ootd: 7,
//         travel: 7,
//         dulichvietnam: 6,
//         fitness: 6,
//         skincare: 6,
//         coding: 5,
//         viral: 5,
//         genzlife: 5,
//         kpop: 5,
//         foodie: 5,
//         streetfood: 4,
//         dalat: 4,
//         saigonfood: 4,
//         meme: 4,
//         photography: 4,
//         makeup: 4,
//         gym: 4,
//         yoga: 4,
//         relatable: 4,
//         trending: 4,
//         vpop: 3,
//         mentalhealth: 3,
//         remotework: 3,
//         startup: 3,
//         petlover: 3,
//     };

//     const CONTENT_BY_HASHTAG: Record<string, string[]> = {
//         amthuc: [
//             "Sáng nay thức dậy làm tô bún bò tự tay. Nước dùng hầm 4 tiếng, đậm đà không kém ngoài tiệm 🍜 #amthuc",
//             "Review quán cơm tấm mới mở cuối phố – sườn than thơm, bì dai, giá chỉ 45k. Ủng hộ quán Việt nha! #amthuc",
//             "Cuối tuần làm bánh cuốn nhân tôm thịt cho cả nhà. Bí quyết: bột gạo pha theo tỉ lệ 4:1 với bột năng 🥢 #amthuc",
//         ],
//         foodie: [
//             "Hành trình ăn sập Sài Gòn tập 3: Bắt đầu từ bánh mì đặc biệt Huynh Hoa rồi kết thúc bằng kem dừa Bến Thành 😋 #foodie",
//             "Không cần đi Nhật vẫn ăn được ramen ngon ở Sài Gòn. Chỗ mình hay ghé: quán nhỏ trong hẻm Lê Thánh Tôn 🍜 #foodie",
//         ],
//         xuhuongamthuc: [
//             "Xu hướng ẩm thực 2025: Trà matcha kết hợp với đủ thứ – từ bánh mì đến lẩu. Bạn đã thử chưa? #xuhuongamthuc",
//         ],
//         saigonfood: [
//             "Sài Gòn có một điều tuyệt vời: 2h sáng vẫn kiếm được tô phở nóng hổi ở góc đường 🌙 #saigonfood",
//             "Cơm tấm Sài Gòn với cái bì thái đều, mỡ hành vàng ươm – không đâu ngon bằng 🍚 #saigonfood",
//         ],
//         hanoidishes: [
//             "Bún chả Hà Nội chuẩn: chả viên tròn đều, nước chấm thanh ngọt, ăn kèm rau thơm Hà Nội 🌿 #hanoidishes",
//         ],
//         comtam: [
//             "Chủ nhật không cần nghĩ – cơm tấm sườn bì chả, ly cà phê sữa đá là xong cuộc đời ☀️ #comtam",
//         ],
//         bunbo: [
//             "Bún bò Huế chuẩn phải có mắm ruốc và sả – hai thứ này thiếu là mất hồn hoàn toàn 🌶️ #bunbo",
//         ],
//         pho: [
//             "Phở bò Hà Nội nước trong leo lẻo, thịt tái hồng hào – ký ức mỗi sáng mùa đông tuổi thơ ❄️ #pho",
//         ],
//         banhmi: [
//             "Bánh mì Sài Gòn: vỏ giòn, nhân đầy, giá 20k – biểu tượng ẩm thực đường phố thế giới công nhận 🥖 #banhmi",
//         ],
//         cafesaigon: [
//             "Cà phê rang xay Sài Gòn buổi sáng: đắng, thơm, đậm – không cần fancy latte gì thêm ☕ #cafesaigon",
//         ],
//         trasuavietnam: [
//             "Trà sữa truyền thống không bằng cái này: trân châu đường đen, kem phô mai mặn ngọt 🧋 #trasuavietnam",
//         ],
//         streetfood: [
//             "Bánh tráng trộn vỉa hè Sài Gòn 15k – ăn xong không thể dừng được. Nghiện nặng rồi 😅 #streetfood",
//             "Street food tour Hội An sáng sớm: cao lầu, mì Quảng, bánh xèo – ăn no từ 7h sáng 🌄 #streetfood",
//         ],
//         homecooking: [
//             "Tự nấu ăn ở nhà tiết kiệm được 2-3 triệu/tháng mà còn ngon hơn, sạch hơn ngoài tiệm. Win-win! 👨‍🍳 #homecooking",
//         ],
//         naucuoi: [
//             "Hôm nay thử nấu canh chua cá lóc lần đầu. Không fail thì không phải mình 😂 nhưng lần 2 ra chuẩn nha! #naucuoi",
//         ],
//         reviewquanan: [
//             "Review nhà hàng mới thử: view đẹp 10/10, đồ ăn 7/10, service 8/10. Tổng thể đáng đi một lần #reviewquanan",
//         ],
//         banhngot: [
//             "Bánh flan cà phê tự làm: lớp kem mịn như lụa, không bọt, không tanh. Công thức đơn giản mà ai cũng làm được 🍮 #banhngot",
//         ],
//         lauphat: [
//             "Lẩu Thái hải sản mùa mưa: vừa cay vừa chua, ngồi ăn cả buổi tối. Hạnh phúc giản đơn nhất! 🌧️ #lauphat",
//         ],
//         nuongbbq: [
//             "BBQ cuối tuần ở ban công: thịt bò nướng than hoa, rau thơm, và bạn bè – không cần đi đâu xa 🥩 #nuongbbq",
//         ],
//         vietfood: [
//             "Ẩm thực Việt Nam đã lên BBC, NYT, CNN – không phải tự hào suông mà thực sự xứng đáng 🇻🇳 #vietfood",
//         ],
//         anngon: [
//             "Bí quyết ăn ngon không tốn nhiều tiền: chợ tươi mỗi sáng, nấu đủ bữa, không đặt ship liên tục 😌 #anngon",
//         ],
//         foodphotography: [
//             "Chụp ảnh đồ ăn không cần đèn studio: ánh sáng tự nhiên buổi sáng + góc 45 độ = ảnh đẹp tự nhiên 📸 #foodphotography",
//         ],
//         bakery: [
//             "Tiệm bánh nhỏ đầu hẻm mở được 3 năm, croissant bơ mỗi sáng cháy trong 30 phút – đặt trước mới có! 🥐 #bakery",
//         ],
//         dessertlover: [
//             "Chè bà ba Sài Gòn đầy đủ topping: khoai lang, bột báng, nước cốt dừa béo ngậy 🍵 #dessertlover",
//         ],
//         hatieu: [
//             "Hủ tiếu Nam Vang chuẩn vị: nước trong, ngọt thanh, thịt bằm mềm, ăn sáng không cần suy nghĩ 🍜 #hatieu",
//         ],
//         raumam: [
//             "Trồng rau mầm tại nhà 7 ngày là thu hoạch. Vừa sạch vừa rẻ, chỉ cần khay và hạt giống 🌱 #raumam",
//         ],
//         banhcuon: [
//             "Bánh cuốn Hà Nội buổi sáng: nhân thịt mộc nhĩ, chan nước mắm cà chua, điểm chút hành phi 😍 #banhcuon",
//         ],
//         chebavien: [
//             "Chè 3 màu vỉa hè Sài Gòn đúng là món bình dân nhưng cái vị đậu xanh + cốt dừa không đâu thay thế được #chebavien",
//         ],
//         nuocep: [
//             "Nước ép dứa + dưa hấu buổi sáng: detox nhanh, ngon, rẻ hơn mua chai ngoài 10 lần 🍍 #nuocep",
//         ],

//         // Du lịch
//         dulichvietnam: [
//             "Việt Nam từ Bắc vào Nam: mỗi vùng một tính cách, một hương vị, một nhịp sống riêng. Không bao giờ hết khám phá 🗺️ #dulichvietnam",
//             "3 ngày 2 đêm Đà Nẵng budget 3 triệu/người: xe máy, biển, phố cổ và đồ ăn đường phố. Chi tiết trong comment! #dulichvietnam",
//         ],
//         travel: [
//             "Pack đồ cho 1 tuần trong 1 chiếc ba lô 25L – không check-in, không chờ hành lý, không lo mất đồ ✈️ #travel",
//             "Du lịch không cần kế hoạch quá chi tiết: book vé, tìm chỗ ngủ, còn lại cứ để trải nghiệm dẫn đường 🧭 #travel",
//         ],
//         phuquoc: [
//             "Phú Quốc mùa khô (tháng 11 - tháng 4): biển lặng, nước xanh ngọc, lặn ngắm san hô đẹp nhất 🐠 #phuquoc",
//         ],
//         dalat: [
//             "Đà Lạt tháng 11: hoa dã quỳ vàng trên đồi, sương mù buổi sáng, cà phê nóng trong tay – hoàn hảo 🌸 #dalat",
//             "Đà Lạt không cần tour: thuê xe máy, tự chạy qua thung lũng Tình Yêu, hồ Xuân Hương – tự do hơn nhiều 🛵 #dalat",
//         ],
//         sapa: [
//             "Sapa mùa lúa chín tháng 9: ruộng bậc thang vàng ươm trải dài – đẹp hơn mọi tấm hình đã thấy 🌾 #sapa",
//         ],
//         halong: [
//             "Vịnh Hạ Long lúc bình minh, chỉ có tiếng mái chèo và sương sớm – tĩnh lặng đến khó tin 🌅 #halong",
//         ],
//         hoian: [
//             "Hội An sáng sớm 6h: đường vắng, đèn lồng hắt ánh sáng vàng, không một bóng khách du lịch. Đây là Hội An thật sự 🏮 #hoian",
//         ],
//         danang: [
//             "Đà Nẵng: thành phố cầu đẹp, biển sạch, đồ ăn ngon và người dân hiền lành. Lý do mình quay lại lần 4 rồi 🌊 #danang",
//         ],
//         nhatrang: [
//             "Nha Trang 4N3Đ: lặn ngắm san hô, tắm bùn khoáng, ăn hải sản tươi ngay bờ biển 🦞 #nhatrang",
//         ],
//         cantho: [
//             "Chợ nổi Cái Răng Cần Thơ: dậy sớm 5h sáng, thuyền đầy trái cây, không khí miền Tây không nơi nào có 🌊 #cantho",
//         ],
//         hue: [
//             "Huế – thành phố của những buổi chiều mưa, cơm Hến, và kiến trúc Nguyễn triều. Lần nào đến cũng thấy bình yên lạ thường 🌧️ #hue",
//         ],
//         hagiang: [
//             "Hà Giang tháng 10: tam giác mạch nở hoa tím hồng trên cao nguyên đá. Cung đường Mã Pí Lèng hùng vĩ không thể diễn tả 🏔️ #hagiang",
//         ],
//         backpacker: [
//             "Bí quyết backpack dài ngày: ngủ hostel, ăn chợ địa phương, di chuyển xe đêm – tiết kiệm 60% mà trải nghiệm phong phú hơn 🎒 #backpacker",
//         ],
//         solotraveler: [
//             "Solo travel không phải cô đơn – đó là tự do. Tự quyết định mọi thứ từ giờ dậy đến chỗ ăn tối 🗺️ #solotraveler",
//         ],
//         dulichbalo: [
//             "3 tuần xuyên Việt bằng xe máy: 2.500km, 15 tỉnh thành, 400k xăng. Chuyến đi rẻ nhất và đáng nhất đời 🛵 #dulichbalo",
//         ],
//         checkin: [
//             "Góc check-in Sài Gòn ít người biết: con hẻm cà phê Phùng Khắc Khoan – bức tường rêu xanh cổ kính mà đẹp xuất sắc 📸 #checkin",
//         ],
//         homestay: [
//             "Homestay ven ruộng bậc thang Mù Cang Chải: ngủ nghe tiếng suối, dậy nhìn ra mây mù. 200k/đêm, đặt sớm hết liền 🏡 #homestay",
//         ],
//         roadtrip: [
//             "Road trip Hà Nội → Hội An 10 ngày theo QL1A: ăn sập từng tỉnh, chụp ảnh dọc đường, không tour nào thay thế được 🚗 #roadtrip",
//         ],
//         trekking: [
//             "Trek Fansipan không cáp treo: 2 ngày 1 đêm, đường rừng nguyên sinh, đỉnh mây bao phủ. Kiệt sức nhưng đáng từng bước 🏔️ #trekking",
//         ],

//         // Thời trang & Làm đẹp
//         ootd: [
//             "Outfit hôm nay: áo linen trắng + quần linen be + dép thô. Mặc gì cũng cần thở được mùa hè Sài Gòn 😅 #ootd",
//             "Thrift flip: mua áo blazer cũ 30k, sửa vai và tay áo, đính thêm nút – ra lò chuẩn blazer 500k 🧥 #ootd",
//         ],
//         fashion: [
//             "Xu hướng thời trang Việt Nam 2025: local brand ngày càng chất, không cần international để mặc đẹp 👗 #fashion",
//         ],
//         streetstyle: [
//             "Street style Hà Nội mùa thu: tông màu đất, layer nhẹ, giày da vintage – không cần theo trend vẫn đẹp 🍂 #streetstyle",
//         ],
//         skincare: [
//             "Routine buổi sáng 5 bước cho da nhạy cảm: Cleanser → Toner → Serum HA → Kem dưỡng → Kem chống nắng. Đơn giản nhưng hiệu quả 🌿 #skincare",
//             "Review serum Vitamin C giá rẻ dưới 200k: dùng 8 tuần, da sáng lên rõ rệt, không kích ứng. Mọi người hỏi mình dùng gì nhiều quá 😄 #skincare",
//         ],
//         beauty: [
//             "Makeup tự nhiên cho ngày đi làm: BB cream, blush nhẹ, lip balm màu hồng đất – xong trong 10 phút 💄 #beauty",
//         ],
//         trangdiem: [
//             "Trang điểm cô dâu tự làm: lớp nền mỏng, má hồng gradient, mắt khói nhẹ nhàng – đơn giản mà đẹp hơn make-up rườm rà 👰 #trangdiem",
//         ],
//         chamsocda: [
//             "Chăm sóc da 0 đồng: ngủ đủ giấc, uống đủ nước, ăn nhiều rau quả. Trước khi dùng serum thì thử cái này trước 🌙 #chamsocda",
//         ],
//         hairstyle: [
//             "Cắt tóc ngắn lần đầu sau 3 năm. Nhẹ cả đầu lẫn tâm hồn 💇‍♀️ #hairstyle",
//         ],
//         nail: [
//             "Nail tự làm ở nhà: gel nail kit 300k dùng được 50 lần, tiết kiệm hơn đi tiệm 10 lần 💅 #nail",
//         ],
//         makeup: [
//             "Tip makeup cho người mới: đầu tư vào kem chống nắng tốt và blush. Hai thứ này nâng hạng sắc diện nhiều nhất 💋 #makeup",
//         ],
//         vintage: [
//             "Thrift shop buổi sáng thứ 7: tìm được áo vintage năm 90 còn nguyên tag, chất vải dày dặn không thua hàng mới 👕 #vintage",
//         ],
//         outfit: [
//             "Outfit buổi tối: áo croptop đen basic + quần ống rộng trắng + mules. Capsule wardrobe đơn giản nhưng versatile 🖤 #outfit",
//         ],
//         glowup: [
//             "6 tháng glow up: từ da mụn sần sùi đến da thủy tinh. Không magic, chỉ cần kiên trì routine và ngủ đủ giấc ✨ #glowup",
//         ],
//         sneakers: [
//             "Sneakers trắng basic: combo không bao giờ sai với bất kỳ outfit nào. Đầu tư 1 đôi tốt xài 5 năm còn rẻ hơn mua 5 đôi rẻ 👟 #sneakers",
//         ],
//         accessories: [
//             "Phụ kiện nâng outfit: một chiếc nhẫn bạc mảnh, dây chuyền layered, túi tote vải – không cần chi nhiều mà vẫn có look cuốn 💍 #accessories",
//         ],

//         // Công nghệ
//         coding: [
//             "Sau 1 năm tự học: từ 0 code đến có job junior dev. Không cần bootcamp, chỉ cần roadmap đúng và kỷ luật 💻 #coding",
//             "Bug 3 tiếng mới ra: thiếu dấu ; . Cuộc đời lập trình viên là vậy đó 😭 #coding",
//         ],
//         developer: [
//             "Làm developer không phải chỉ code: đọc docs, debug, communicate, review, estimate. Code chỉ chiếm 40% thôi 🧑‍💻 #developer",
//         ],
//         tech: [
//             "AI đang thay đổi cách làm việc, không phải thay thế người. Ai biết dùng AI tool đúng cách sẽ productive hơn 10 lần 🤖 #tech",
//         ],
//         javascript: [
//             "JavaScript async/await: giải thích cho người mới bằng ví dụ gọi ship đồ ăn. Không await = không biết đồ đến chưa 📦 #javascript",
//         ],
//         typescript: [
//             "Chuyển từ JS sang TS: tuần đầu khó chịu, tháng 2 thấy quen, tháng 3 không muốn về JS nữa. Type safety nghiện rồi 🔒 #typescript",
//         ],
//         ai: [
//             "Dùng AI để viết PR description, tóm tắt meeting, draft email – tiết kiệm 2 tiếng/ngày. Bạn đang dùng AI cho việc gì? 🤖 #ai",
//         ],
//         startup: [
//             "Startup lesson học xương máu: validate idea trước khi code. 6 tháng build xong mới biết không ai cần. Đau thiệt sự 💀 #startup",
//         ],
//         webdev: [
//             "Web performance: 1 giây load chậm hơn = 7% conversion giảm. Optimize ảnh, lazy load, CDN – không khó nhưng ít ai làm 🚀 #webdev",
//         ],
//         freelancer: [
//             "Freelance 2 năm: thu nhập ổn hơn đi làm công ty, nhưng tự kỷ luật và find client mới là phần khó nhất 💼 #freelancer",
//         ],
//         remote: [
//             "Work from coffee shop: tìm được quán wifi tốt, yên tĩnh, giá cà phê hợp lý ở Sài Gòn – đây là công thức hạnh phúc 🏖️ #remote",
//         ],
//         opensource: [
//             "Contribute open source lần đầu: sợ vãi nhưng maintain rất tử tế, được merge PR sau 3 lần sửa. Cảm giác đỉnh lắm! 🌟 #opensource",
//         ],
//         github: [
//             "GitHub green squares: không phải để flex, mà để nhìn lại mình đã làm gì trong 365 ngày qua 📊 #github",
//         ],

//         // Sức khỏe
//         fitness: [
//             "Tuần 12 tập gym liên tiếp: chưa thấy cơ bắp đâu nhưng ngủ ngon hơn, ít stress hơn, năng lượng tốt hơn. Đó là kết quả đầu tiên 💪 #fitness",
//             "Gym không cần gương selfie: tập đúng form, đủ volume, ăn đủ protein. Đơn giản vậy thôi 🏋️ #fitness",
//         ],
//         gym: [
//             "Home gym setup 5 triệu: 1 tạ điều chỉnh, 1 thảm yoga, dây kéo kháng lực. Tập được 80% bài như ngoài phòng gym 🏠 #gym",
//         ],
//         yoga: [
//             "Yoga buổi sáng 20 phút: không cần 1 tiếng, chỉ cần đều đặn. 30 ngày liên tiếp, lưng hết đau, ngủ sâu hơn 🧘‍♀️ #yoga",
//         ],
//         chaybo: [
//             "Chạy bộ sáng sớm Sài Gòn: 5h30 sáng, công viên Lê Văn Tám, không khí mát, ít xe cộ – khoảng thời gian đỉnh nhất ngày 🏃 #chaybo",
//         ],
//         suckhoe: [
//             "Không cần diet phức tạp: ăn đủ 4 nhóm, bớt đường và muối, uống 2L nước, ngủ 7-8 tiếng. Công thức sức khỏe không tốn tiền 🌿 #suckhoe",
//         ],
//         running: [
//             "Tham gia VM Hanoi Marathon lần đầu: 5km hạng mục fun run. Không cần nhanh, chỉ cần về đích và không ân hận 🏅 #running",
//         ],
//         mentalhealth: [
//             "Sức khỏe tâm thần quan trọng như thể chất: đặt giới hạn, nói không khi cần, tìm người tin tưởng để nói chuyện 🧡 #mentalhealth",
//             "Digital detox 24h: tắt điện thoại sau 9 tối. Ngủ ngon hơn, ít lo âu hơn. Thử đi sẽ thấy khác biệt 📵 #mentalhealth",
//         ],
//         meditation: [
//             "10 phút thiền mỗi sáng: không cần hướng dẫn phức tạp, chỉ cần ngồi yên, theo dõi hơi thở. 21 ngày đầu khó, sau đó nghiện 🕯️ #meditation",
//         ],
//         wellbeing: [
//             "Wellbeing không phải là spa hay retreat đắt tiền: là tập thể dục, ăn tươi, ngủ đủ, có kết nối xã hội. Bốn thứ cơ bản đó đã đủ 🌱 #wellbeing",
//         ],

//         // Đời sống & Cảm xúc
//         tamsu: [
//             "Đôi khi cứ nhắn tin đến nửa đêm với người không hỏi thăm ban ngày. Cô đơn có hình dạng kỳ lạ lắm 🌙 #tamsu",
//         ],
//         cuocsong: [
//             "Cuộc sống không cần phải perfect. Chỉ cần đủ tốt, đủ ý nghĩa, và đủ bình yên cho bản thân mình là được 🍃 #cuocsong",
//         ],
//         docsach: [
//             "Đọc 1 cuốn/tháng nghe nhỏ nhưng cộng lại 12 cuốn/năm. Sau 3 năm tư duy thay đổi hơn bất kỳ khoá học nào 📚 #docsach",
//         ],
//         music: [
//             "Playlist chill làm việc: lo-fi hip hop, jazz bossa nova, ambient piano. Không có lời = không bị distract 🎵 #music",
//         ],
//         vpop: [
//             "V-pop năm 2024-2025 đỉnh thật: Tùng Dương, Hoàng Thùy Linh, HIEUTHUHAI, tlinh – đủ mọi genre, chất lượng không kém K-pop 🎤 #vpop",
//         ],
//         kpop: [
//             "Concert K-pop ở Việt Nam ngày càng nhiều: không cần bay sang Hàn nữa. Fan Việt cháy hết mình 🔥 #kpop",
//             "Album mới của nhóm vừa drop: đang nghe loop không ngừng được, ai cùng stan thì cmt xuống dưới 🎧 #kpop",
//         ],
//         phim: [
//             "Phim Việt đang trên đà tăng chất: Cô Gái Từ Quá Khứ, Đất Rừng Phương Nam, Kẻ Cắp Mặt Trăng – không cần xem Hollywood! 🎬 #phim",
//         ],
//         gaming: [
//             "Gaming session cuối tuần: không cần console xịn, chỉ cần PC ổn và team bạn thân là đủ vui 🎮 #gaming",
//         ],
//         photography: [
//             "Chụp ảnh bằng điện thoại đẹp: ánh sáng tự nhiên + rule of thirds + không zoom digital. Ba điều này thôi là đủ 📱 #photography",
//             "Golden hour Sài Gòn: 17h-18h, ánh sáng cam ấm, mọi thứ đều photogenic kể cả con hẻm bình thường nhất 🌇 #photography",
//         ],

//         // Thú cưng
//         meocon: [
//             "Bé mèo vào nhà lạ lẫm tuần đầu, tuần 3 đã nằm trên laptop mình làm việc 😭 mèo là boss thiệt rồi 🐱 #meocon",
//         ],
//         cuncung: [
//             "Chú chó nhà mình mỗi sáng đều đứng canh cửa đợi mình dắt đi dạo. Nghĩa vụ vui nhất ngày 🐶 #cuncung",
//         ],
//         petlover: [
//             "Nuôi thú cưng dạy mình: kiên nhẫn, yêu thương vô điều kiện, và biết rằng ai đó luôn chờ mình về nhà 🐾 #petlover",
//         ],
//         catlife: [
//             "Mèo: ngủ 16 tiếng, ăn, nhìn vào hư không, đặt ngồi lên keyboard. Cuộc sống hoàn hảo không cần giải thích 😸 #catlife",
//         ],

//         // Gen Z Viral
//         genzlife: [
//             "Gen Z không lười, chỉ đang redefined productivity: không phải làm 12 tiếng/ngày mới là chăm chỉ 💁 #genzlife",
//             "Ký ức tuổi thơ Gen Z: Yahoo chat, Audition, chép bài nhau ở lớp rồi nạp thẻ điện thoại cuối tuần 📲 #genzlife",
//         ],
//         viral: [
//             "Video này đạt 1M view trong 24h. Bài học: authentic content + right timing > production value cao 📱 #viral",
//         ],
//         trending: [
//             "Trend ẩm thực đang hot nhất: matcha + gì cũng được, cold brew với mọi vị, và bánh mì kiểu fusion. Bạn thấy trend nào tiếp theo? 👀 #trending",
//         ],
//         xuhuong: [
//             "Xu hướng sống tối giản đang lan rộng ở giới trẻ: ít đồ hơn, ít cam kết hơn, nhiều trải nghiệm hơn. Bạn có đang theo không? ✨ #xuhuong",
//         ],
//         meme: [
//             "Meme Việt Nam 2025 hình thức mới nhất: blend pop culture quốc tế với slang địa phương – hài hơn meme nước ngoài nhiều 😂 #meme",
//         ],
//         relatable: [
//             "Cái cảm giác mở app, cuộn 30 giây rồi quên mình vào app để làm gì. Này là trauma bình thường của thế kỷ 21 😅 #relatable",
//         ],
//         overthinking: [
//             "Overthinking lúc 2h sáng: replay lại cuộc hội thoại 5 năm trước và nghĩ xem mình nên nói gì khác 🌙 #overthinking",
//         ],
//         coffeeaddict: [
//             "Số ly cà phê/ngày: 1 để tỉnh táo, 2 để productive, 3 để tồn tại. Hôm nay mình đang ở level 3 ☕ #coffeeaddict",
//         ],
//         dailyvlog: [
//             "Day in my life: dậy 6h, gym, làm việc từ quán café, chiều chạy bộ, tối nấu cơm. Routine nhàm nhưng happy 📹 #dailyvlog",
//         ],
//         diy: [
//             "DIY kệ sách từ pallet gỗ cũ: chi phí 150k, 3 tiếng làm, kết quả chuẩn nội thất Bắc Âu 🪵 #diy",
//         ],

//         // Môi trường
//         zerowaste: [
//             "Zero waste không cần perfect: bắt đầu từ mang túi vải, bình nước, hộp đựng đồ ăn riêng. 3 thứ này giảm được 80% rác nhựa 🌿 #zerowaste",
//         ],
//         sustainable: [
//             "Mua đồ secondhand không phải nghèo – đó là lựa chọn có trách nhiệm với môi trường và ví tiền 🌱 #sustainable",
//         ],
//         ecofriendly: [
//             "Sản phẩm eco-friendly Việt Nam đang nở rộ: ống hút tre, túi giấy kraft, hộp bã mía – không thua kém hàng ngoại nhập 🌍 #ecofriendly",
//         ],
//         gogreen: [
//             "Trồng cây ban công: sả, rau húng, ớt, cà chua cherry – vừa xanh nhà vừa có rau sạch ăn. Ai ở chung cư cũng làm được 🌿 #gogreen",
//         ],

//         // Tài chính
//         taichinhhcanhan: [
//             "Quy tắc 50-30-20: 50% thiết yếu, 30% muốn có, 20% tiết kiệm. Đơn giản nhưng hiệu quả hơn bất kỳ app tài chính nào 💰 #taichinhhcanhan",
//         ],
//         dautu: [
//             "Đầu tư chứng khoán 2 năm: lỗ năm đầu vì không biết gì, lãi năm 2 vì đã học. Trường phí đắt nhưng bài học xứng đáng 📈 #dautu",
//         ],
//         tiettiem: [
//             "Mẹo tiết kiệm của mình: chuyển 20% lương vào tài khoản khác ngay khi nhận lương. Không thấy = không xài được 💳 #tiettiem",
//         ],
//         sidehustle: [
//             "Side hustle của mình: dạy tiếng Anh online buổi tối, 2 học sinh/ngày = thêm 4-5 triệu/tháng không ảnh hưởng công việc chính 💼 #sidehustle",
//         ],

//         // Các tag còn lại
//         sunrisevietnam: ["Bình minh trên biển Mũi Né: không có gì hơn – nước yên, trời hồng, không một bóng người 🌅 #sunrisevietnam"],
//         nongnghiep: ["Về quê học nấu rượu gạo truyền thống với ông ngoại: bí quyết 50 năm, không sách nào dạy được 🌾 #nongnghiep"],
//         campingvn: ["Camping Đà Lạt trong rừng thông: dựng lều lúc 4 chiều, nướng xúc xích lúc 7 tối, ngắm sao từ 9 đến 12 ⛺ #campingvn"],
//         phongnhatourist: ["Phong Nha hệ thống hang động dài nhất thế giới – mà đến giờ vẫn còn hang chưa khám phá hết 🕯️ #phongnhatourist"],
//         mountainlife: ["Sống ở vùng núi Tây Bắc: sáng sương mù, trưa nắng vàng, tối lạnh trong chăn dày. Nhịp sống không nơi nào có 🏔️ #mountainlife"],
//         watchlover: ["Đồng hồ vintage Seiko từ những năm 80: máy cơ, kính sapphire, dây da thật. Giá 2 triệu mà chất hơn đồng hồ mới 3-4 lần 🕐 #watchlover"],
//         koreanskincare: ["10-step Korean skincare không cần dùng hết 10 bước: chọn 5 bước phù hợp với da mình là hiệu quả hơn #koreanskincare"],
//         routine: ["Morning routine của mình: 6h dậy, không điện thoại 30 phút, tập thể dục, ăn sáng nhẹ. 30 ngày đầu khó, sau đó auto 🌅 #routine"],
//         lipstick: ["Son đất Việt Nam làm tốt không kém son ngoại: màu đẹp, bền màu, giá 80-150k. Local brand xứng đáng được ủng hộ 💄 #lipstick"],
//         eyeshadow: ["Tutorial eyeshadow smoky eye cho người mới: 3 màu cơ bản là đủ, blend đều tay là xong 🎨 #eyeshadow"],
//         sundress: ["Váy hoa mùa hè: vải thoáng, màu sáng, cổ V thấp. Một chiếc versatile đi biển, đi cà phê, đi chơi đều được 🌺 #sundress"],
//         denim: ["Quần jeans washed cũ từ thập niên 90 đang comeback: vintage wash, baggy fit, không cần ủi. Mua secondhand giá 100-200k #denim"],
//         handbag: ["Túi da thật handmade Việt Nam: thợ lành nghề, chất liệu tốt, giá bằng 30% hàng ngoại cùng chất lượng 👜 #handbag"],
//         luxuryfashion: ["Luxury fashion thật sự không nằm ở logo: nằm ở chất vải, đường may, và sự vừa vặn. Đó là lý do French wardrobe minimal vẫn đẹp 🪡 #luxuryfashion"],
//         summerlook: ["Look mùa hè Sài Gòn: thoáng, sáng màu, chịu nhiệt. Linen + cotton = combo không cần nghĩ nhiều ☀️ #summerlook"],
//         casualfit: ["Casual fit không cần đắt: tee trắng basic + jeans straight + sneakers trắng. Công thức 3 món vẫn luôn đúng 👕 #casualfit"],
//         mensfashion: ["Nam mặc đẹp không cần phức tạp: fit tốt + màu trung tính + 1 điểm nhấn. Đó là toàn bộ bí quyết 👔 #mensfashion"],
//         womensfashion: ["Tủ quần áo minimalist nữ: 10 món cơ bản phối được 30+ outfit. Ít hơn, nghĩ ít hơn, mặc đẹp hơn 👗 #womensfashion"],
//         nodejs: ["Node.js với Express: backend đơn giản dựng nhanh. 3 ngày là có REST API cơ bản. Tốt cho beginner bắt đầu 🖥️ #nodejs"],
//         reactjs: ["React hooks vẫn là powerful nhất khi hiểu flow: useState → useEffect → useContext → custom hooks. Học theo thứ tự này 🔄 #reactjs"],
//         nextjs: ["Next.js App Router vs Pages Router: App Router phức tạp hơn nhưng powerful hơn. Dự án mới nên dùng App Router 🗂️ #nextjs"],
//         python: ["Python cho người không phải dev: tự động hoá Excel, xử lý file PDF, scraping data. 3 tháng học là dùng được 🐍 #python"],
//         machinelearning: ["ML không cần PhD: học sklearn, pandas, matplotlib là có thể làm được project thực tế. Bắt đầu từ linear regression #machinelearning"],
//         saas: ["Build SaaS đầu tiên: không cần tech stack fancy. Django + PostgreSQL + Stripe là đủ để ship MVP trong 2 tuần 🚀 #saas"],
//         devlife: ["Developer life: đọc code 3 tiếng, viết code 1 tiếng, attend meeting 2 tiếng, debug 2 tiếng. Đó là 1 ngày làm việc thật 🤓 #devlife"],
//         programmerhumor: ["Print('hello world') vẫn là đoạn code đầu tiên mình viết được. 5 năm sau: vẫn dùng print để debug 😂 #programmerhumor"],
//         database: ["Database indexing: đừng để sau optimize, làm ngay từ đầu. Câu query 5s → 0.1s chỉ bằng thêm 1 index đúng chỗ ⚡ #database"],
//         api: ["REST API design: resource-based URL, HTTP verbs đúng, response format nhất quán. Ba điều này là 80% của API tốt 🔌 #api"],
//         deployment: ["Deploy lần đầu lên production: nhiều thứ crash hơn local. Nhưng đó là bài học không sách nào dạy được 🖥️ #deployment"],
//         docker: ["Docker giải quyết 'works on my machine': containerise app 1 lần, chạy mọi nơi. Học Docker = tăng 30% giá trị CV 🐋 #docker"],
//         workout: ["Workout split cho người bận: Push/Pull/Legs 3 ngày/tuần. Đủ frequency, đủ volume, không cần 6 ngày gym #workout"],
//         healthyeating: ["Ăn healthy không cần khó: thêm rau vào mọi bữa ăn, giảm đường trong đồ uống, ăn đủ protein. Đơn giản hoá đi #healthyeating"],
//         weightloss: ["Giảm cân bền vững: không cần diet cực đoan. Deficit calo nhỏ + vận động đều đặn = kết quả ổn định theo tháng 📉 #weightloss"],
//         muscle: ["Tăng cơ cần 2 thứ: progressive overload và đủ protein. Bao nhiêu thứ khác chỉ là optimization 💪 #muscle"],
//         cycling: ["Đạp xe đi làm sáng sớm: 7km, 25 phút, không kẹt xe, tiết kiệm xăng, tập thể dục miễn phí. Win all round 🚴 #cycling"],
//         swimming: ["Bơi lội: bài tập toàn thân, không impact khớp, mát mẻ mùa hè. Quân sự nhất là free style 100m × 10 reps 🏊 #swimming"],
//         bongda: ["Xem bóng đá cùng bạn bè: không quan tâm đội nào thắng bằng cái không khí la hét cùng nhau 🥅 #bongda"],
//         tennis: ["Học tennis người lớn tuổi mới tập: kiên nhẫn và footwork là quan trọng nhất, không phải tay mạnh 🎾 #tennis"],
//         badminton: ["Cầu lông tối thứ 4 với đồng nghiệp: vừa tập vừa bond team tốt hơn bất kỳ team building nào trả tiền 🏸 #badminton"],
//         marathon: ["Tập marathon lần đầu: build up từ 5km, không bỏ qua long run cuối tuần, và tìm running group để có động lực 🏃‍♂️ #marathon"],
//         pilates: ["Pilates reformer sau 8 tuần: core mạnh hơn, lưng hết đau, tư thế cải thiện rõ rệt. Đắt hơn gym nhưng xứng đáng 🧘‍♀️ #pilates"],
//         nghimoi: ["Suy nghĩ mới học được: so sánh mình với version hôm qua, không phải với người khác. Ít khổ hơn rất nhiều 💭 #nghimoi"],
//         sachvahoa: ["Đọc sách giúp mình hiểu người khác hơn trước: không phải vì sách dạy cách xử lý, mà vì thấy mình trong nhân vật 📖 #sachvahoa"],
//         sohoc: ["Học sơ học tập: spaced repetition + active recall đánh bại highlight màu mè. Anki app + luyện đề = combo không fail 📝 #sohoc"],
//         langman: ["Lãng mạn giản đơn: bữa cơm nhà nấu cùng nhau, đi dạo buổi tối, ngủ sớm không điện thoại. Không cần fancy 🌙 #langman"],
//         series: ["Series Việt Nam đang ngày càng chất: 'Người Vợ Cuối Cùng', 'Biệt Dội Rồng Đen' – không cần Netflix xịn 📺 #series"],
//         anime: ["Anime 2025 hay nhất đang xem: Frieren Beyond Journey's End. Không phải action nhưng mà sâu sắc lạ 🌸 #anime"],
//         booklover: ["Thư viện Hà Nội mở cửa miễn phí: ngày lên đây đọc 2 tiếng yên tĩnh là cách mình recharge tốt nhất 📚 #booklover"],
//         artlover: ["Triển lãm nghệ thuật Sài Gòn đang mở: nghệ sĩ trẻ Việt Nam với concept đương đại – đẹp và đáng suy nghĩ 🎨 #artlover"],
//         livelife: ["Sống thật sự: không phải perfect, không phải instagrammable. Chỉ cần present, grateful, và honest 🌿 #livelife"],
//         sunrise: ["Bình minh ở bãi biển không cần diễn: chỉ cần dậy sớm và ra đứng đó. Không filter nào cần thiết 🌅 #sunrise"],
//         rescuedog: ["Nhận nuôi chó rescue: 2 tuần sợ hãi mọi thứ, tháng 2 bắt đầu vẫy đuôi, tháng 3 ngủ trên giường mình 🐕 #rescuedog"],
//         rescuecat: ["Mèo rescue nhà mình từng bị bỏ trong thùng giấy mưa. Giờ: 4kg, hay cắn, và là trung tâm vũ trụ nhà mình 🐈 #rescuecat"],
//         cutepet: ["Khoảnh khắc thú cưng: con mèo ngủ úp mặt vào lòng bàn tay. Không cần gì hơn nữa trong cuộc đời 🐾 #cutepet"],
//         fluffycat: ["Mèo Anh lông ngắn nhà mình: mặt tưởng cáu nhưng không bao giờ cắn. Judge book by cover thật 😸 #fluffycat"],
//         doglife: ["Chó Golden của mình vẫy đuôi dù đi ra ngoài 5 phút hay 5 tiếng. Loài vật trung thành nhất đúng là không phải ví von 🐕‍🦺 #doglife"],
//         thucung: ["Nuôi thú cưng responsibility lớn hơn người ta nghĩ: vet, grooming, training, không bỏ lại khi chán. Cần suy nghĩ kỹ trước khi nhận 🐾 #thucung"],
//         recycling: ["Tái chế tại nhà dễ hơn bạn nghĩ: phân loại rác vào 3 thùng: hữu cơ, tái chế, rác thải thông thường. 10 phút học là làm được ♻️ #recycling"],
//         vegancooking: ["Nấu chay không nhạt: dùng nước tương, dầu mè, ớt tươi, và rau thơm đúng cách. Bát canh rau không cần thịt vẫn có umami 🌿 #vegancooking"],
//         plantbased: ["Plant-based diet không cần full vegan: giảm thịt 50%, tăng đậu hũ, nấm, rau lá. Sức khỏe cải thiện, chi phí giảm #plantbased"],
//         moitruong: ["Thay bóng đèn LED, tắt điện khi ra khỏi phòng, không để TV standby – 3 thói quen giảm điện 15-20%/tháng 🌍 #moitruong"],
//         xanhlacay: ["Trồng cây trong nhà không cần đất: thủy canh với pothos, thị trường, lưỡi hổ. Lọc không khí và trang trí cùng lúc 🌱 #xanhlacay"],
//         solarpanel: ["Pin mặt trời mái nhà: đầu tư 80 triệu, hoàn vốn 6-7 năm, dùng 20 năm. Toán học rõ ràng, chỉ cần quyết tâm ☀️ #solarpanel"],
//         batdongsan: ["Mua nhà lần đầu ở Sài Gòn: 2 tỷ tầm tay với chung cư 60m2 ngoại ô + xe bus kết nối. Khó nhưng không impossible 🏠 #batdongsan"],
//         realestate: ["Real estate Việt Nam 2025: thị trường đang điều chỉnh, cơ hội cho người mua ở thực. Đừng mua để lướt sóng lúc này 📊 #realestate"],
//         muagold: ["Vàng tích luỹ hàng tháng: không cần mua đủ 1 chỉ, mua 0.5 chỉ/tháng cũng tích luỹ được qua năm tháng 🥇 #muagold"],
//         crypto: ["Crypto 2025: Bitcoin ETF approval, ít biến động hơn. Vẫn không phải trò chơi cho người không hiểu rủi ro ₿ #crypto"],
//         financelife: ["Không giàu = không biết quản lý tiền, không phải không có tiền. Học tài chính cá nhân ngay từ hôm nay 💸 #financelife"],
//         chungkhoan: ["Chứng khoán Việt Nam cho người mới: bắt đầu với ETF index fund, đều đặn mỗi tháng, không cần chọn cổ phiếu 📈 #chungkhoan"],
//         nightowl: ["3h sáng productivity kỳ lạ: không ai nhắn tin, não hoạt động khác lạ, code chạy mượt hơn ban ngày. Night owl life 🌙 #nightowl"],
//         introvert: ["Recharge cách của người introvert: ở nhà 1 ngày một mình, không nghe nhạc, không mạng xã hội. Sau đó ready gặp người 🤫 #introvert"],
//         mondaymotivation: ["Thứ 2 không cần ghét: nó giống như bất kỳ ngày nào khác. Cái ghét là attitude của mình với nó thôi 🌟 #mondaymotivation"],
//         fridayvibes: ["Thứ 6 office: mọi người bỗng nhiên creative, productive, và vui hơn. Tâm lý học thú vị không? 🎉 #fridayvibes"],
//         weekendplans: ["Kế hoạch cuối tuần lý tưởng: sáng tập thể dục, trưa ăn ngon cùng gia đình, chiều đọc sách, tối không điện thoại 🌅 #weekendplans"],
//         nofilter: ["Cuộc sống thật không có filter: bừa bộn, mệt mỏi, không hoàn hảo – nhưng đó là thật và đó là đủ 💙 #nofilter"],
//         asmr: ["ASMR mưa rơi ngoài cửa sổ + cà phê nóng + sách hay = combo ngủ ngon tự nhiên không cần thuốc 🌧️ #asmr"],
//         satisfying: ["Xem video sắp xếp đồ, cắt slime, và dọn dẹp xong thấy não nhẹ hẳn. Dopamine đến từ những thứ kỳ lạ nhất 😌 #satisfying"],
//         randomthoughts: ["Tại sao ngồi chờ 5 phút dài hơn làm việc 5 phút? Não người vẫn là bí ẩn chưa giải thích hết 🤔 #randomthoughts"],
//     };

//     const templates: PostTemplate[] = [];

//     // Đảm bảo mỗi hashtag có ít nhất 1 bài, và hashtag hot có nhiều bài hơn
//     for (const tag of ALL_HASHTAGS) {
//         const contents = CONTENT_BY_HASHTAG[tag];
//         if (!contents || contents.length === 0) {
//             // Fallback cho các tag chưa có content
//             templates.push({
//                 content: `Chia sẻ về chủ đề #${tag} hôm nay. Bạn có suy nghĩ gì về điều này không? 💭 #${tag}`,
//                 hashtag: tag,
//                 media: { kind: "images", count: rand(1, 2) },
//             });
//             continue;
//         }

//         // Thêm tất cả content có sẵn
//         for (const content of contents) {
//             templates.push({
//                 content,
//                 hashtag: tag,
//                 media: pickMedia(),
//             });
//         }

//         // Hashtag hot → thêm bài extra
//         const extraCount = (HOT_HASHTAGS[tag] ?? 1) - 1;
//         for (let e = 0; e < extraCount; e++) {
//             templates.push({
//                 content: contents[e % contents.length],
//                 hashtag: tag,
//                 media: pickMedia(),
//             });
//         }
//     }

//     return templates;
// }

// function pickMedia(): PostMediaDef {
//     const r = Math.random();
//     if (r < 0.40) return { kind: "images", count: rand(1, 3) };
//     if (r < 0.55) return { kind: "images", count: rand(1, 5) };    // nhiều ảnh
//     if (r < 0.75) return { kind: "video" };
//     if (r < 0.90) return { kind: "images+video", imgCount: rand(1, 2) };
//     return { kind: "images", count: 1 };
// }

// // ─── MAIN SEED ────────────────────────────────────────────────────────────────
// async function seedHashtagPosts() {
//     console.log("\n🌱 ===== SEED HASHTAG POSTS =====\n");

//     // 1. Load users
//     const users = await prisma.user.findMany({
//         where: { deletedAt: null },
//         select: {
//             id: true,
//             username: true,
//             name: true,
//             avatar: true,
//             bio: true,
//         },
//         orderBy: { createdAt: "desc" },
//         take: 200,
//     });

//     if (users.length === 0) {
//         throw new Error("Không tìm thấy user nào. Hãy chạy seed gốc trước!");
//     }
//     console.log(`👤 Tìm thấy ${users.length} users\n`);

//     // 2. Load hoặc tạo Topics cho tất cả hashtag
//     console.log(`🏷️  Đảm bảo ${ALL_HASHTAGS.length} topics tồn tại...`);
//     const topicMap = new Map<string, number>(); // hashtag → topic.id

//     for (const tag of ALL_HASHTAGS) {
//         const topic = await prisma.topic.upsert({
//             where: { name: tag },
//             create: { name: tag, count: 0 },
//             update: {},
//             select: { id: true, name: true },
//         });
//         topicMap.set(tag, topic.id);
//     }
//     console.log(`   ✅ ${topicMap.size} topics sẵn sàng\n`);

//     // 3. Build templates
//     const templates = buildPostTemplates();
//     const shuffled = shuffle(templates);
//     console.log(`📋 Tổng số bài sẽ tạo: ${shuffled.length}\n`);

//     // 4. Tạo bài viết
//     let totalPosts = 0;
//     let totalImages = 0;
//     let totalVideos = 0;
//     let totalTopicLinks = 0;
//     const hashtagCount = new Map<string, number>();
//     let imgIdx = 0;
//     let videoIdx = 0;

//     for (let i = 0; i < shuffled.length; i++) {
//         const tmpl = shuffled[i];
//         const author = users[i % users.length];
//         const createdAt = randomDate(90);

//         // Tạo post
//         const post = await prisma.post.create({
//             data: {
//                 userId: author.id,
//                 content: tmpl.content,
//                 type: PostType.POST,
//                 visibility: VisibilityPost.PUBLIC,
//                 replyPermission: pick([
//                     ReplyPermission.EVERYONE,
//                     ReplyPermission.EVERYONE,
//                     ReplyPermission.EVERYONE,
//                     ReplyPermission.FOLLOWERS,
//                 ]),
//                 userSnapshot: {
//                     id: author.id,
//                     username: author.username,
//                     name: author.name,
//                     avatar: author.avatar,
//                     bio: author.bio,
//                 },
//                 likesCount: rand(0, 800),
//                 repliesCount: rand(0, 60),
//                 repostsCountAndQuoteCount: rand(0, 40),
//                 viewsCount: rand(100, 30000),
//                 createdAt,
//                 updatedAt: createdAt,
//             },
//             select: { id: true, publicId: true },
//         });
//         totalPosts++;

//         // Tạo media
//         const mediaDef = tmpl.media;
//         const mediaRows: {
//             postId: number;
//             url: string;
//             type: PostMediaType;
//             width?: number;
//             height?: number;
//             key: string;
//             status: PostMediaStatus;
//         }[] = [];

//         if (mediaDef.kind === "images") {
//             for (let m = 0; m < mediaDef.count; m++) {
//                 const url = IMAGE_POOL[imgIdx++ % IMAGE_POOL.length];
//                 mediaRows.push({
//                     postId: post.id,
//                     url,
//                     type: PostMediaType.IMAGE,
//                     width: pick([720, 1080, 1280]),
//                     height: pick([720, 1080, 1350]),
//                     key: `htag_img_${post.id}_${m}_${Date.now() + m}`,
//                     status: PostMediaStatus.UPLOADED,
//                 });
//                 totalImages++;
//             }
//         } else if (mediaDef.kind === "video") {
//             const url = VIDEO_POOL[videoIdx++ % VIDEO_POOL.length];
//             mediaRows.push({
//                 postId: post.id,
//                 url,
//                 type: PostMediaType.VIDEO,
//                 width: 1920,
//                 height: 1080,
//                 key: `htag_vid_${post.id}_${Date.now()}`,
//                 status: PostMediaStatus.UPLOADED,
//             });
//             totalVideos++;
//         } else if (mediaDef.kind === "images+video") {
//             // Ảnh trước
//             for (let m = 0; m < mediaDef.imgCount; m++) {
//                 const url = IMAGE_POOL[imgIdx++ % IMAGE_POOL.length];
//                 mediaRows.push({
//                     postId: post.id,
//                     url,
//                     type: PostMediaType.IMAGE,
//                     width: pick([720, 1080, 1280]),
//                     height: pick([720, 1080, 1350]),
//                     key: `htag_img2_${post.id}_${m}_${Date.now() + m}`,
//                     status: PostMediaStatus.UPLOADED,
//                 });
//                 totalImages++;
//             }
//             // Video sau
//             const url = VIDEO_POOL[videoIdx++ % VIDEO_POOL.length];
//             mediaRows.push({
//                 postId: post.id,
//                 url,
//                 type: PostMediaType.VIDEO,
//                 width: 1920,
//                 height: 1080,
//                 key: `htag_vid2_${post.id}_${Date.now() + 999}`,
//                 status: PostMediaStatus.UPLOADED,
//             });
//             totalVideos++;
//         }

//         if (mediaRows.length > 0) {
//             await prisma.postMedia.createMany({ data: mediaRows });
//         }

//         // Gắn hashtag vào TopicsPost (1 hashtag / bài)
//         const topicId = topicMap.get(tmpl.hashtag);
//         if (topicId) {
//             await prisma.topicsPost.upsert({
//                 where: { postId: post.id },
//                 create: {
//                     postId: post.id,
//                     topicId,
//                     isPublic: true,
//                 },
//                 update: { topicId },
//             });

//             // Tăng count cho topic
//             await prisma.topic.update({
//                 where: { id: topicId },
//                 data: { count: { increment: 1 } },
//             });

//             totalTopicLinks++;
//             hashtagCount.set(tmpl.hashtag, (hashtagCount.get(tmpl.hashtag) ?? 0) + 1);
//         }

//         if ((i + 1) % 50 === 0 || i === shuffled.length - 1) {
//             process.stdout.write(
//                 `\r   → ${i + 1}/${shuffled.length} bài | 🖼️ ${totalImages} ảnh | 🎬 ${totalVideos} video | 🏷️ ${totalTopicLinks} hashtag`
//             );
//         }
//     }

//     // 5. Thống kê top trending
//     console.log("\n\n📊 ===== TOP 20 HASHTAG TRENDING =====");
//     const sorted = [...hashtagCount.entries()].sort((a, b) => b[1] - a[1]);
//     sorted.slice(0, 20).forEach(([tag, count], idx) => {
//         const bar = "█".repeat(Math.ceil(count / 2));
//         console.log(`  ${String(idx + 1).padStart(2)}. #${tag.padEnd(25)} ${count.toString().padStart(3)} bài  ${bar}`);
//     });

//     console.log(`
// 🎉 ===== SEED HASHTAG POSTS HOÀN THÀNH =====
//    📝 Tổng posts       : ${totalPosts}
//    🖼️  Ảnh (IMAGE)      : ${totalImages}
//    🎬 Video            : ${totalVideos}
//    🏷️  Hashtag links    : ${totalTopicLinks}
//    🔢 Hashtag unique   : ${hashtagCount.size} / ${ALL_HASHTAGS.length}
// =============================================`);
// }

// // ─── ENTRY POINT ──────────────────────────────────────────────────────────────
// seedHashtagPosts()
//     .catch((e) => {
//         console.error("\n❌ Seed thất bại:", e);
//         process.exit(1);
//     })
//     .finally(() => prisma.$disconnect());


import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
    PostType,
    PrismaClient,
    ReplyPermission,
    ReportStatus,
    ReportTargetType,
    VisibilityPost,
} from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

// ─── Prisma setup ─────────────────────────────────────────────────────────────
const adapter = new PrismaMariaDb({
    port: Number(process.env.DB_PORT) || 3306,
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "threads_api",
});
const prisma = new PrismaClient({ adapter } as any);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomDate(daysAgo: number): Date {
    return new Date(Date.now() - Math.random() * daysAgo * 86_400_000);
}
function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Kiểu dữ liệu ─────────────────────────────────────────────────────────────

/**
 * Mô tả một kịch bản báo cáo hoàn chỉnh.
 *
 * scenario: tên kịch bản (để dễ đọc log)
 * content:  nội dung bài post
 * isDisinformation: bot/AI đã đánh dấu có khả năng sai sự thật
 * isHidden: bot tự ẩn bài khỏi feed
 * reportCount: số người báo cáo bài này
 * reports[]: mảng các report với lý do + trạng thái khác nhau
 * aiNote: ghi chú tự động của assistant (có thể null)
 * aiConfidence: độ tin cậy AI (0–1, null = chưa chạy AI)
 * adminNote: ghi chú admin nếu đã xử lý
 * reportStatus: trạng thái chung của các report
 * postVisibility: PUBLIC / PRIVATE / v.v.
 */
interface ReportScenario {
    scenario: string;
    content: string;
    isDisinformation: boolean;
    isHidden: boolean;
    reports: {
        reason: string;
        status: ReportStatus;
        isDisinformation: boolean;
        assistantNote: string | null;
        confidence: number | null;
        adminNote: string | null;
    }[];
}

// ─── 100 kịch bản báo cáo ─────────────────────────────────────────────────────
// Phân loại:
//   A. Thông tin sai / fake news (isDisinformation = true)
//   B. Nội dung độc hại / hate speech / bạo lực
//   C. Spam / quảng cáo trá hình
//   D. AI đánh giá sai → cần admin duyệt
//   E. Lạm dụng hệ thống report (báo cáo oan)
//   F. Vi phạm nhẹ đã tự giải quyết
//   G. Đa report từ nhiều người
//   H. Nội dung nhạy cảm nhưng hợp lệ
//   I. Quấy rối cá nhân
//   J. Vi phạm bản quyền / phishing

const SCENARIOS: ReportScenario[] = [
    // ══════════════════════════════════════════════
    // A. THÔNG TIN SAI / FAKE NEWS (15 bài)
    // ══════════════════════════════════════════════
    {
        scenario: "A1 – Fake news y tế nghiêm trọng, AI tự tin cao",
        content:
            "KHẨN: Vắc-xin COVID-19 gây ung thư máu sau 2 năm đã được WHO xác nhận! Bộ Y tế VN đang che giấu thông tin. Chia sẻ ngay trước khi bị xóa!! Nguồn: bbc-news-health.info",
        isDisinformation: true,
        isHidden: true,
        reports: [
            {
                reason: "Thông tin y tế sai lệch, link giả mạo BBC, gây hoang mang cộng đồng",
                status: ReportStatus.PENDING,
                isDisinformation: true,
                assistantNote:
                    "Tuyên bố không có cơ sở khoa học. Domain 'bbc-news-health.info' là giả mạo BBC chính thống. Không có tài liệu WHO xác nhận nội dung này. Khuyến nghị: XÓA NGAY và hạn chế tài khoản.",
                confidence: 0.97,
                adminNote: null,
            },
            {
                reason: "Fake news, lừa dối người dùng, link giả mạo",
                status: ReportStatus.PENDING,
                isDisinformation: true,
                assistantNote:
                    "Report thứ 2 xác nhận cùng vi phạm. Ưu tiên cao.",
                confidence: 0.95,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "A2 – Sai sự thật về thiên tai, đã resolved",
        content:
            "Động đất 7.8 độ richter vừa xảy ra tại Hà Nội lúc 3h sáng, hàng trăm tòa nhà sập. Sơ tán ngay!! Video clip phía dưới. #hanoi #dongdat #khancap",
        isDisinformation: true,
        isHidden: true,
        reports: [
            {
                reason: "Tin giả gây hoảng loạn, video clip thực ra ở Thổ Nhĩ Kỳ 2023",
                status: ReportStatus.RESOLVED,
                isDisinformation: true,
                assistantNote:
                    "Không có sự kiện động đất tại Hà Nội vào thời điểm này theo USGS và Viện Vật lý Địa cầu VN. Video đính kèm là từ trận động đất Thổ Nhĩ Kỳ 2023. Hành vi tạo nội dung gây hoảng loạn.",
                confidence: 0.98,
                adminNote: "Đã xóa bài, cảnh báo người dùng. Tài khoản vi phạm lần 1.",
            },
        ],
    },
    {
        scenario: "A3 – Fake news tài chính, AI đánh giá vừa",
        content:
            "NÓNG: Ngân hàng Vietcombank sắp phá sản! Insider tiết lộ rằng nợ xấu lên đến 200 nghìn tỷ. Rút tiền ngay trước thứ 2 tuần sau!! Đừng để mất trắng tiết kiệm cả đời.",
        isDisinformation: true,
        isHidden: true,
        reports: [
            {
                reason: "Tin thất thiệt về ngân hàng, gây hoảng loạn tài chính",
                status: ReportStatus.RESOLVED,
                isDisinformation: true,
                assistantNote:
                    "Không có bằng chứng xác thực. Thông tin về tình hình tài chính VCB hoàn toàn trái ngược với báo cáo kiểm toán. Tuy nhiên cần xem xét thêm bối cảnh trước khi kết luận hoàn toàn.",
                confidence: 0.81,
                adminNote:
                    "Xác nhận fake news sau khi liên hệ xác minh. Đã xóa và khóa 3 ngày.",
            },
        ],
    },
    {
        scenario: "A4 – Disinformation chính trị, AI không chắc chắn",
        content:
            "Thủ tướng vừa ký lệnh cấm tất cả mạng xã hội từ ngày 1/1/2026. Facebook, TikTok, Zalo đều bị chặn. Cài VPN ngay hôm nay trước khi quá muộn! 📢",
        isDisinformation: true,
        isHidden: false,
        reports: [
            {
                reason: "Thông tin sai về chính sách nhà nước, gây bất ổn xã hội",
                status: ReportStatus.PENDING,
                isDisinformation: true,
                assistantNote:
                    "Không tìm thấy văn bản pháp lý xác nhận. Tuy nhiên đây là tuyên bố về chính sách – cần admin kiểm tra nguồn chính thống từ cổng thông tin Chính phủ trước khi xử lý.",
                confidence: 0.72,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "A5 – Fake news sức khỏe thay thế, nhiều người report",
        content:
            "Uống nước chanh pha muối biển mỗi sáng CÓ THỂ CHỮA KHỎI HOÀN TOÀN ung thư giai đoạn 1-2. Bác sĩ Nhật Bản đã chứng minh qua 1000 ca. Đừng để big pharma lừa dối bạn!",
        isDisinformation: true,
        isHidden: true,
        reports: [
            {
                reason: "Thông tin y tế nguy hiểm, có thể khiến bệnh nhân từ chối điều trị thật",
                status: ReportStatus.RESOLVED,
                isDisinformation: true,
                assistantNote:
                    "Tuyên bố không có bằng chứng khoa học. Nguy hiểm cao vì khuyến khích bỏ điều trị y tế. Không tìm thấy nghiên cứu nào từ Nhật Bản xác nhận. Khuyến nghị: xóa ngay.",
                confidence: 0.96,
                adminNote: "Xóa bài. Hạn chế đăng nội dung y tế 30 ngày.",
            },
            {
                reason: "Pseudoscience nguy hiểm",
                status: ReportStatus.RESOLVED,
                isDisinformation: true,
                assistantNote: null,
                confidence: null,
                adminNote: "Xử lý theo report trước.",
            },
            {
                reason: "Lừa dối người bệnh ung thư dễ bị tổn thương",
                status: ReportStatus.RESOLVED,
                isDisinformation: true,
                assistantNote: null,
                confidence: null,
                adminNote: "Xử lý theo report trước.",
            },
        ],
    },
    {
        scenario: "A6 – Tin giả về celebrity",
        content:
            "SỐC: Ca sĩ Sơn Tùng MTP vừa bị bắt vì tội rửa tiền và buôn bán ma túy sáng nay. Công an TP.HCM xác nhận. 😱 #sontung #shocking",
        isDisinformation: true,
        isHidden: true,
        reports: [
            {
                reason: "Tin giả về người nổi tiếng, vu khống nghiêm trọng",
                status: ReportStatus.PENDING,
                isDisinformation: true,
                assistantNote:
                    "Không có thông tin từ Công an TP.HCM. Tuyên bố không có nguồn. Đây là hành vi phỉ báng cá nhân kết hợp fake news. Ưu tiên cao.",
                confidence: 0.94,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "A7 – Fake news dịch bệnh mới",
        content:
            "CẢNH BÁO: Virus mới nguy hiểm hơn COVID đang lây lan từ Q7 Sài Gòn. Triệu chứng: sốt + nổi ban đỏ. BV Chợ Rẫy đã quá tải, không nhận bệnh nhân. Ở nhà ngay!",
        isDisinformation: true,
        isHidden: false,
        reports: [
            {
                reason: "Thông tin dịch bệnh sai, gây hoảng loạn",
                status: ReportStatus.PENDING,
                isDisinformation: true,
                assistantNote:
                    "Không có thông báo chính thức nào từ Bộ Y tế hoặc BV Chợ Rẫy. Tuy nhiên cần admin xác minh nhanh do tính chất nhạy cảm về y tế công cộng.",
                confidence: 0.78,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "A8 – Sai sự thật nhưng AI đánh giá nhầm là bình thường",
        content:
            "Nghiên cứu mới từ ĐH Harvard: Người Việt Nam có IQ trung bình 94, đứng thứ 2 Đông Nam Á. Người Nhật 106, người Singapore 108. Chúng ta vẫn còn nhiều tiềm năng! 🇻🇳",
        isDisinformation: true,
        isHidden: false,
        reports: [
            {
                reason: "Số liệu IQ quốc gia này là pseudo-science, bị các nhà khoa học bác bỏ",
                status: ReportStatus.PENDING,
                isDisinformation: false, // AI chưa đánh dấu
                assistantNote:
                    "Nội dung mang tính chia sẻ thông tin học thuật. Không phát hiện vi phạm rõ ràng. Tuy nhiên reporter có chỉ ra vấn đề phương pháp luận – admin nên review.",
                confidence: 0.41, // AI không chắc chắn → cần người xem
                adminNote: null,
            },
        ],
    },
    {
        scenario: "A9 – Disinformation kinh tế, AI confidence thấp",
        content:
            "Chính phủ sắp đổi tiền, đồng 500k và 200k cũ sẽ không còn giá trị sau 31/12. Đổi ngay ở Vietinbank trước khi hết hạn. Lan truyền để mọi người biết!",
        isDisinformation: true,
        isHidden: true,
        reports: [
            {
                reason: "Tin giả về đổi tiền gây hoảng loạn, lừa đảo tài chính",
                status: ReportStatus.PENDING,
                isDisinformation: true,
                assistantNote:
                    "Không có thông báo chính thức từ NHNN Việt Nam. Dạng tin này thường xuất hiện định kỳ và luôn là giả. Đề nghị xóa.",
                confidence: 0.88,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "A10 – Fake screenshot từ nguồn uy tín",
        content:
            "[Ảnh chụp màn hình] VnExpress đưa tin: 'Bộ Giáo dục hủy kết quả thi THPT 2025 toàn quốc do phát hiện sai đề'. Chia sẻ ngay cho phụ huynh và học sinh!",
        isDisinformation: true,
        isHidden: false,
        reports: [
            {
                reason: "Screenshot giả mạo, bài gốc không tồn tại trên VnExpress",
                status: ReportStatus.PENDING,
                isDisinformation: true,
                assistantNote:
                    "Không tìm thấy bài viết tương ứng trên VnExpress. Đây có thể là screenshot chỉnh sửa. Cần admin xác minh trực tiếp với nguồn.",
                confidence: 0.69,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "A11 – Fake news tôn giáo",
        content:
            "ĐẠO PHẬT CẤM ĂN TRỨNG: Hội đồng Phật giáo VN vừa ra thông báo chính thức cấm Phật tử ăn trứng từ tháng 9. Ai không biết thì lưu lại đây.",
        isDisinformation: true,
        isHidden: false,
        reports: [
            {
                reason: "Thông tin sai về tôn giáo, chưa có thông báo chính thức từ Giáo hội",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Không tìm thấy văn bản xác nhận. Tuy nhiên đây là quan điểm tranh luận trong Phật giáo, không hẳn là disinformation. Ít nguy hại.",
                confidence: 0.43,
                adminNote:
                    "Review: Không đủ bằng chứng vi phạm nghiêm trọng. Dismiss report, để bài tồn tại.",
            },
        ],
    },
    {
        scenario: "A12 – Disinformation kép: fake news + spam",
        content:
            "SỰ THẬT về app Shopee: thu thập dữ liệu ngân hàng khi bạn ngủ. 3 triệu người Việt đã bị trừ tiền tự động. Xóa ngay + dùng app TRUSTSHOP của chúng tôi an toàn hơn! Link: trustshop.vn",
        isDisinformation: true,
        isHidden: true,
        reports: [
            {
                reason: "Fake news + quảng cáo cạnh tranh xấu, link dẫn đến trang lừa đảo",
                status: ReportStatus.RESOLVED,
                isDisinformation: true,
                assistantNote:
                    "Kết hợp disinformation và spam thương mại. Link trustshop.vn không có thông tin pháp lý. Hành vi cạnh tranh không lành mạnh. Xóa ngay.",
                confidence: 0.95,
                adminNote:
                    "Xóa, blacklist domain trustshop.vn, khóa tài khoản 7 ngày.",
            },
        ],
    },
    {
        scenario: "A13 – Fake news về ô nhiễm môi trường",
        content:
            "Nước máy Hà Nội đã bị nhiễm chất gây ung thư cao gấp 1000 lần ngưỡng cho phép! Kết quả xét nghiệm độc lập phía dưới. Không được uống nước máy nữa!!! 🚨",
        isDisinformation: true,
        isHidden: false,
        reports: [
            {
                reason: "Thông tin môi trường sai, file đính kèm là giả mạo",
                status: ReportStatus.PENDING,
                isDisinformation: true,
                assistantNote:
                    "Kết quả xét nghiệm đính kèm không có tên đơn vị kiểm nghiệm hợp lệ, số liệu bất thường. Chưa có công bố chính thức từ Cục Quản lý Tài nguyên nước.",
                confidence: 0.82,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "A14 – Tin giả về xe cứu thương bán độ",
        content:
            "Mua xe cứu thương đã qua sử dụng của bệnh viện với giá chỉ 150 triệu! Sẵn sàng giao ngay tại Hà Nội. Còn đủ thiết bị y tế bên trong. LH: 0909xxxxxx 🚑",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Mua bán tài sản nhà nước trái phép, đáng ngờ",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung rao bán có thể vi phạm quy định về tài sản công. Không đủ thông tin để kết luận. Cần admin xem xét và có thể chuyển cơ quan chức năng.",
                confidence: 0.55,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "A15 – Fake news bầu cử địa phương",
        content:
            "KẾT QUẢ BẦU CỬ HỘI ĐỒNG NHÂN DÂN Q.1: Ứng cử viên Nguyễn Văn A đã bị loại do gian lận phiếu. Nguồn tin nội bộ từ ủy ban bầu cử. SHARE để mọi người biết!",
        isDisinformation: true,
        isHidden: true,
        reports: [
            {
                reason: "Thông tin bầu cử sai sự thật, gây ảnh hưởng uy tín cá nhân",
                status: ReportStatus.PENDING,
                isDisinformation: true,
                assistantNote:
                    "Không có thông báo chính thức từ Ủy ban Bầu cử. Tên nhân vật mơ hồ. Đây là dạng nội dung cần ưu tiên xử lý trong bối cảnh bầu cử.",
                confidence: 0.87,
                adminNote: null,
            },
        ],
    },

    // ══════════════════════════════════════════════
    // B. NỘI DUNG ĐỘC HẠI / HATE SPEECH / BẠO LỰC (15 bài)
    // ══════════════════════════════════════════════
    {
        scenario: "B1 – Hate speech nhắm vào nhóm dân tộc",
        content:
            "Người [dân tộc thiểu số] không bao giờ có thể hội nhập được, bản chất họ lười biếng và hay trộm cắp. Kinh nghiệm sống 30 năm của mình, ai ở vùng đó đều biết.",
        isDisinformation: false,
        isHidden: true,
        reports: [
            {
                reason: "Phân biệt chủng tộc, kỳ thị dân tộc thiểu số",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Vi phạm nghiêm trọng điều khoản cộng đồng về hate speech. Nội dung mang định kiến sai về toàn bộ nhóm dân tộc. Xóa ngay.",
                confidence: 0.97,
                adminNote: "Xóa bài. Khóa tài khoản vĩnh viễn, lần vi phạm thứ 3.",
            },
        ],
    },
    {
        scenario: "B2 – Nội dung kích động bạo lực",
        content:
            "Bọn lừa đảo đầu tư online ở tòa nhà Landmark 81 đó ai biết không? Địa chỉ: [địa chỉ cụ thể]. Nhà mình mất 500 triệu rồi. Anh em nào cùng kéo đến đòi nợ tối nay không?",
        isDisinformation: false,
        isHidden: true,
        reports: [
            {
                reason: "Kích động tập trung gây bạo lực, doxx địa chỉ cá nhân",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Nội dung kêu gọi tập hợp đông người đến địa chỉ cụ thể với ý định đối đầu. Doxx địa chỉ và kêu gọi hành động ngay. Rủi ro bạo lực rất cao. Xóa khẩn.",
                confidence: 0.96,
                adminNote: "Xóa. Báo cáo cho đội an toàn nội dung, giữ log để hỗ trợ pháp lý nếu cần.",
            },
        ],
    },
    {
        scenario: "B3 – Ngôn ngữ thù địch nhắm cá nhân, AI không phát hiện vì dùng code",
        content:
            "Con nhỏ @username kia tưởng giỏi mà óc như cờ quê. Đứng trên sân khấu múa may như con kh*i. Mặt như cái [emoji]. Ai thích nó share bài này để xem mặt nó 😂",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Bắt nạt, xúc phạm cá nhân, gọi người khác bằng từ ngữ miệt thị",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung chứa từ ngữ xúc phạm được viết tắt/mã hóa để né lọc tự động. Nhắm vào cá nhân cụ thể. Cần admin review – bộ lọc tự động có thể bỏ sót.",
                confidence: 0.61,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "B4 – Nội dung mô tả bạo lực chi tiết",
        content:
            "Mình vừa xử một thằng ăn cắp xe máy của mình: dùng xích sắt đánh liên tục vào đầu nó, máu phun ra như vòi. Không kêu cảnh sát, tự xử kiểu Sài Gòn. Ai cũng nên làm vậy 💪",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Mô tả bạo lực chi tiết, khuyến khích tự xử pháp luật",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung mô tả hành vi bạo lực chi tiết và glorify tự xử pháp luật. Vi phạm điều khoản về nội dung bạo lực. Ẩn khỏi feed, chờ admin xem xét.",
                confidence: 0.83,
                adminNote: null,
            },
            {
                reason: "Kêu gọi tự xử, bạo lực",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote: null,
                confidence: null,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "B5 – Kỳ thị giới tính, nhiều report",
        content:
            "Phụ nữ đi làm quản lý chỉ toàn xài nước mắt và giường. Không có cô nào lên được chức cao nhờ thực lực cả. Đây là sự thật phũ phàng mà ai cũng biết nhưng không dám nói.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Kỳ thị giới tính, misogyny rõ ràng",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung thể hiện định kiến giới tính tiêu cực có hệ thống. Mức độ vi phạm vừa – không kêu gọi hành động bạo lực nhưng có hại cho cộng đồng.",
                confidence: 0.74,
                adminNote: null,
            },
            {
                reason: "Sexist, có hại cho phụ nữ trong môi trường công sở",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote: null,
                confidence: null,
                adminNote: null,
            },
            {
                reason: "Nội dung kỳ thị",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote: null,
                confidence: null,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "B6 – Nội dung nhắm vào cộng đồng LGBTQ+",
        content:
            "Người LGBT là bệnh tâm thần, không nên cho họ làm giáo viên hay chăm sóc trẻ em. WHO đã bỏ ra khỏi danh sách nhưng thực tế ai cũng biết đó là lỗi xã hội.",
        isDisinformation: true,
        isHidden: false,
        reports: [
            {
                reason: "Hate speech LGBTQ+, thông tin y tế sai về tâm thần học",
                status: ReportStatus.PENDING,
                isDisinformation: true,
                assistantNote:
                    "Kết hợp disinformation y tế và hate speech. WHO/APA không còn phân loại đồng tính là rối loạn tâm thần từ 1990/1973. Nội dung có thể gây hại cho nhóm thiểu số.",
                confidence: 0.89,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "B7 – Ngôn ngữ thù địch bình thường hóa dần dần",
        content:
            "Sau 3 năm sống cạnh hàng xóm miền Bắc vào Nam làm ăn: ồn ào, không biết ý tứ, thích chiếm đất, hay kèn cựa. Không phải tất cả nhưng mà đa số thật. #hanoivn",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Kỳ thị vùng miền, gây chia rẽ Bắc-Nam",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung thể hiện định kiến vùng miền nhưng có disclaimer 'không phải tất cả'. Ranh giới giữa ý kiến cá nhân và hate speech. Admin cần phán xét theo ngữ cảnh.",
                confidence: 0.52,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "B8 – Kêu gọi tẩy chay và doxxing",
        content:
            "Đây là thông tin chủ tiệm nail ở địa chỉ [ABC] đã lừa khách 3 triệu. Tên thật: [Tên]. SĐT: [SĐT]. Địa chỉ nhà riêng: [địa chỉ]. Kéo nhau vào review 1 sao và báo cáo nhé!",
        isDisinformation: false,
        isHidden: true,
        reports: [
            {
                reason: "Doxxing thông tin cá nhân, kêu gọi review bombing",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Vi phạm nghiêm trọng quyền riêng tư: đăng địa chỉ nhà riêng, số điện thoại cá nhân. Kêu gọi hành động tập thể nhắm vào cá nhân. Xóa khẩn.",
                confidence: 0.98,
                adminNote: "Xóa, ẩn thông tin cá nhân, cảnh cáo tài khoản.",
            },
        ],
    },
    {
        scenario: "B9 – Nội dung bạo lực nhắm vào động vật",
        content:
            "Mình vừa xử con chó hàng xóm cứ sủa đêm: đặt bẫy điện ở bờ rào. Chết êm rồi. Ai có chó sủa đêm làm phiền thì làm theo cách này, hiệu quả 100% và không để lại dấu vết.",
        isDisinformation: false,
        isHidden: true,
        reports: [
            {
                reason: "Hướng dẫn bạo hành động vật, có thể vi phạm pháp luật",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Nội dung mô tả và hướng dẫn hành vi bạo hành động vật. Vi phạm điều khoản bạo lực. Xóa.",
                confidence: 0.91,
                adminNote: "Xóa bài. Cảnh cáo.",
            },
        ],
    },
    {
        scenario: "B10 – Nội dung tự hại, disguise dưới dạng chia sẻ",
        content:
            "Mình đã dùng phương pháp này được 8 tháng rồi: khi stress quá thì cắt nhẹ vào tay, đau vật lý giúp não quên đau tinh thần. Ai muốn thử thì inbox mình chia sẻ cách làm an toàn.",
        isDisinformation: false,
        isHidden: true,
        reports: [
            {
                reason: "Nội dung tự hại, hướng dẫn self-harm, nguy hiểm cho người dùng dễ bị tổn thương",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Nội dung mô tả và kêu gọi chia sẻ phương pháp tự làm đau bản thân. Đặc biệt nguy hiểm do targeting người đang stress. Xóa ngay và gửi tài nguyên sức khỏe tâm thần cho tác giả.",
                confidence: 0.99,
                adminNote: "Xóa, gửi cảnh báo an toàn + đường dây hỗ trợ tâm lý cho tài khoản.",
            },
        ],
    },
    {
        scenario: "B11 – Đe dọa ẩn danh",
        content:
            "Tới đứa nào biết nó không? Con nhỏ @username hay đi quán X đường Y. Tao sẽ gặp nó hỏi thăm vài câu. Nếu có ai nhìn thấy nó thì tag tao vào 😊",
        isDisinformation: false,
        isHidden: true,
        reports: [
            {
                reason: "Đe dọa ngầm, theo dõi cá nhân, gây lo sợ cho nạn nhân",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Mặc dù không dùng từ ngữ đe dọa trực tiếp, ngữ cảnh và nội dung cho thấy ý định theo dõi và đối đầu cá nhân. Rủi ro an toàn thực sự. Ưu tiên cao.",
                confidence: 0.84,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "B12 – Kỳ thị người khuyết tật",
        content:
            "Tại sao nhà nước lại ưu tiên xe lăn chiếm vỉa hè, dành cả tầng trệt cho mấy người không làm được gì cho xã hội? Tiền thuế của mình đang nuôi đám ăn hại này.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Kỳ thị người khuyết tật, ngôn ngữ thù địch",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung sử dụng ngôn ngữ miệt thị ('đám ăn hại') nhắm vào người khuyết tật. Vi phạm điều khoản hate speech dù dưới dạng quan điểm về chính sách.",
                confidence: 0.77,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "B13 – Nội dung cổ xúy ý thức hệ cực đoan",
        content:
            "Chỉ có GIẢI PHÁP DUY NHẤT cho vấn đề nhập cư: thanh lọc. Mọi người nhập cư bất hợp pháp cần bị trục xuất bằng vũ lực. Đây không phải thù địch, đây là bảo vệ chính đáng.",
        isDisinformation: false,
        isHidden: true,
        reports: [
            {
                reason: "Kêu gọi bạo lực có hệ thống nhắm vào người nhập cư",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Ngôn ngữ 'thanh lọc' và 'vũ lực' nhắm vào nhóm người là dấu hiệu của hate speech cực đoan. Xóa và review tài khoản.",
                confidence: 0.93,
                adminNote: "Xóa. Khóa tài khoản 30 ngày chờ review tổng thể nội dung.",
            },
        ],
    },
    {
        scenario: "B14 – Ảnh nhạy cảm đính kèm",
        content:
            "Hình ảnh phụ nữ mặc áo dài, mình thấy cái này đẹp lắm... [đính kèm ảnh người thật không rõ nguồn gốc bị cắt chỉnh sửa]",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Ảnh đính kèm là ảnh người thật bị cắt ghép không có sự đồng ý",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung văn bản không vi phạm nhưng ảnh đính kèm có thể là nội dung không có sự đồng ý của đối tượng. Cần admin xem ảnh thực tế để phán xét.",
                confidence: 0.48,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "B15 – Glorify tội phạm",
        content:
            "Anh Tuấn Khỉ là huyền thoại Sài Gòn đích thực: không sợ ai, sống theo luật riêng, bảo vệ người yếu thế theo cách riêng. Xã hội cần nhiều người như vậy hơn là cảnh sát 🐉",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Glorify tội phạm nguy hiểm, ảnh hưởng xấu đến giới trẻ",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung tôn vinh hành vi tội phạm nhưng không kêu gọi hành động trực tiếp. Ranh giới quan điểm cá nhân và nội dung có hại. Admin cần cân nhắc theo chính sách.",
                confidence: 0.58,
                adminNote: null,
            },
        ],
    },

    // ══════════════════════════════════════════════
    // C. SPAM / QUẢNG CÁO TRÁ HÌNH (10 bài)
    // ══════════════════════════════════════════════
    {
        scenario: "C1 – Đa cấp trá hình, spam link",
        content:
            "Mình kiếm được 15 triệu tháng này làm online chỉ 2 tiếng/ngày! Không bán hàng, không vốn, không kinh nghiệm. Công ty uy tín Mỹ đang tuyển người Việt. DM mình ngay hoặc click: bit.ly/xxxxx",
        isDisinformation: true,
        isHidden: true,
        reports: [
            {
                reason: "Đa cấp, lừa đảo tuyển dụng, link ngắn đáng ngờ",
                status: ReportStatus.RESOLVED,
                isDisinformation: true,
                assistantNote:
                    "Pattern điển hình của đa cấp/scam: thu nhập khủng, ít thời gian, không cần kinh nghiệm. Link rút gọn ẩn đích đến thực sự. Spam thương mại vi phạm điều khoản.",
                confidence: 0.96,
                adminNote: "Xóa, blacklist link, đánh dấu tài khoản hay spam.",
            },
        ],
    },
    {
        scenario: "C2 – Quảng cáo thuốc không rõ nguồn gốc",
        content:
            "Thuốc giảm cân THẦN KỲ từ Thái Lan: giảm 10kg trong 2 tuần không cần ăn kiêng, không tập gym! Đã bán 50.000 hộp. 100% tự nhiên, không tác dụng phụ. Order tại: [SĐT]",
        isDisinformation: true,
        isHidden: false,
        reports: [
            {
                reason: "Thuốc không rõ nguồn gốc, quảng cáo sai sự thật về tác dụng",
                status: ReportStatus.PENDING,
                isDisinformation: true,
                assistantNote:
                    "Tuyên bố về hiệu quả thuốc vi phạm quy định quảng cáo dược phẩm. Không có số đăng ký lưu hành. Có thể gây hại sức khỏe.",
                confidence: 0.88,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "C3 – Bot farm comment thao túng",
        content:
            "Dịch vụ TĂNG LIKE, FOLLOW, VIEW giá rẻ nhất VN: 1000 like = 50k, 1000 follow = 80k. Guarantee 30 ngày không tụt. Đã phục vụ 10.000+ khách. Inbox để báo giá!",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Vi phạm điều khoản: bán dịch vụ thao túng nền tảng",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Dịch vụ mua like/follow vi phạm trực tiếp điều khoản sử dụng nền tảng. Xóa và cảnh cáo.",
                confidence: 0.99,
                adminNote: "Xóa, khóa tài khoản.",
            },
        ],
    },
    {
        scenario: "C4 – Phishing trá hình chia sẻ",
        content:
            "Viettel đang tặng 50GB miễn phí cho khách hàng VIP! Nhấn vào link này để nhận: viettel-giftdata.com/free50gb - Chia sẻ để người thân cũng nhận được nhé! ⚡",
        isDisinformation: true,
        isHidden: false,
        reports: [
            {
                reason: "Link phishing giả mạo Viettel, đánh cắp thông tin tài khoản",
                status: ReportStatus.PENDING,
                isDisinformation: true,
                assistantNote:
                    "Domain 'viettel-giftdata.com' không phải tên miền chính thức của Viettel. Pattern phishing điển hình: free offer + urgent sharing. Xóa khẩn.",
                confidence: 0.97,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "C5 – Spam tuyển cộng tác viên lặp lại",
        content:
            "Tuyển gấp CTV bán hàng online, làm tại nhà, thu nhập 8-15 triệu/tháng. Không cần vốn, không cần kinh nghiệm. Đào tạo từ đầu. Lương cứng + hoa hồng. Nhắn tin ngay!",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Spam, đây là lần đăng thứ 5 trong tuần từ tài khoản này",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Một bài đơn lẻ không vi phạm rõ ràng nhưng nếu là spam lặp lại thì vi phạm. Cần admin kiểm tra lịch sử đăng bài của tài khoản này.",
                confidence: 0.52,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "C6 – Quảng cáo trá hình review",
        content:
            "Mình vừa dùng thử kem dưỡng trắng của shop XYZ, chỉ sau 7 ngày da trắng bật tông hẳn, mụn biến mất luôn! Chị em nên thử ngay, link order dưới comment 💕 (không phải quảng cáo nhé!)",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Quảng cáo trá hình, không ghi rõ nhãn quảng cáo theo quy định",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây có thể là user-generated review thật hoặc quảng cáo không được ghi nhãn. Không đủ bằng chứng chắc chắn. Tác hại thấp.",
                confidence: 0.4,
                adminNote: "Dismiss. Không đủ cơ sở vi phạm rõ ràng. Nhắn nhở tài khoản nếu có bằng chứng hợp đồng.",
            },
        ],
    },
    {
        scenario: "C7 – Lừa đảo đầu tư forex",
        content:
            "Tham gia sàn giao dịch [Tên sàn] của mình: lợi nhuận 3-5%/ngày đảm bảo! Đã có 200 thành viên VN đang lãi đều. Nạp tối thiểu 500$. Bảo đảm rút tiền trong 24h.",
        isDisinformation: true,
        isHidden: true,
        reports: [
            {
                reason: "Lừa đảo đầu tư, hứa hẹn lợi nhuận phi thực tế",
                status: ReportStatus.RESOLVED,
                isDisinformation: true,
                assistantNote:
                    "Lợi nhuận 3-5%/ngày (>1000%/năm) là không thể có trên thị trường hợp pháp. Đây là dấu hiệu rõ ràng của Ponzi/scam. Xóa và báo cáo tài khoản.",
                confidence: 0.98,
                adminNote: "Xóa, khóa vĩnh viễn, báo cơ quan chức năng nếu có thêm báo cáo.",
            },
        ],
    },
    {
        scenario: "C8 – Spam chính trị mùa bầu cử",
        content:
            "Hãy vote cho ứng cử viên [Tên] trong cuộc bầu cử sắp tới! Click vào form đăng ký ủng hộ: form.google.com/xxxx - Thu thập thông tin để gửi tài liệu vận động. Quan trọng!",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Thu thập dữ liệu trái phép dưới danh nghĩa chính trị",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Link thu thập thông tin đáng ngờ trong bối cảnh chính trị. Cần admin xem form thực tế để xác định mức độ vi phạm.",
                confidence: 0.6,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "C9 – Fake giveaway",
        content:
            "🎁 GIVEAWAY: iPhone 15 Pro Max x5 từ đội ngũ chúng tôi! Để tham gia: 1) Follow page 2) Like bài này 3) Tag 3 bạn bè 4) Share story. Quay số ngày 30/12. GL! 🍀",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Fake giveaway để tăng follower gian lận, không có giải thưởng thật",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Giveaway có thể hợp lệ hoặc không. Không thể xác định nếu chưa qua ngày 30/12. Tạm giữ, theo dõi xem kết quả có được công bố không.",
                confidence: 0.44,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "C10 – Spam nhiều post giống nhau",
        content:
            "Cần cho thuê căn hộ 2PN quận 7, 12 triệu/tháng, full nội thất. LH: 0901xxxxxx. #chothue #cantho #q7 #saigon #hosochiminhcity #apartment #cho_thue_can_ho",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Spam: đăng bài này 20 lần trong 1 ngày trên nhiều nhóm",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung đơn lẻ không vi phạm. Nhưng nếu spam số lượng lớn thì vi phạm. Cần admin kiểm tra lịch sử post của tài khoản và xem xét rate limiting.",
                confidence: 0.5,
                adminNote: null,
            },
        ],
    },

    // ══════════════════════════════════════════════
    // D. AI ĐÁNH GIÁ SAI → CẦN ADMIN XEM (15 bài)
    // ══════════════════════════════════════════════
    {
        scenario: "D1 – AI nhầm nội dung hài là thật",
        content:
            "Tuyên bố: Mình vừa thành lập Cộng Hòa Độc Lập Ban Công Tầng 7 với dân số 3 người (mình + 2 con mèo). Yêu cầu công nhận từ LHQ. Kế hoạch kinh tế: bán cà phê cho láng giềng.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Kêu gọi ly khai, thành lập nhà nước phi pháp",
                status: ReportStatus.DISMISSED,
                isDisinformation: true, // AI nhầm đánh dấu
                assistantNote:
                    "Phát hiện từ khóa 'Cộng Hòa Độc Lập' và 'yêu cầu công nhận từ LHQ'. Có thể là nội dung nhạy cảm về chính trị. Đề nghị admin review.",
                confidence: 0.67, // AI không chắc nhưng vẫn flag
                adminNote:
                    "Review: Đây là nội dung hài hước rõ ràng (ban công + 2 con mèo). AI bị confuse bởi từ khóa. Dismiss. Không vi phạm gì. Cần cải thiện NLP context.",
            },
        ],
    },
    {
        scenario: "D2 – AI nhầm bài học lịch sử là nội dung cực đoan",
        content:
            "Trong lớp học hôm nay chúng tôi thảo luận về chiến lược quân sự của phát xít Đức trong WWII: tại sao Blitzkrieg ban đầu hiệu quả và tại sao cuối cùng thất bại. Rất thú vị về mặt lịch sử.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Người dùng thấy bài này trong feed và lo ngại về nội dung quân sự",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Phát hiện từ khóa về quân sự và tổ chức cực đoan. Flagged để review. Tuy nhiên ngữ cảnh học thuật rõ ràng – confidence thấp.",
                confidence: 0.35,
                adminNote: "Dismiss. Nội dung giáo dục lịch sử hoàn toàn hợp lệ. AI false positive.",
            },
        ],
    },
    {
        scenario: "D3 – AI bỏ sót spam tinh vi",
        content:
            "Hôm nay mình học được điều thú vị về tư duy tài chính: tiết kiệm nhỏ hàng ngày tạo ra sự khác biệt lớn theo thời gian. Ví dụ: 50k/ngày × 365 = 18.25 triệu/năm. Nhờ mentor của mình chỉ dạy, ai muốn kết nối với mentor này thì inbox mình nha!",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Nội dung có vẻ ổn nhưng phần cuối dẫn dụ vào sơ đồ đa cấp tài chính",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung phần đầu hoàn toàn bình thường và hữu ích. Phần cuối có thể là marketing network. Không phát hiện vi phạm rõ ràng. Admin review để xác nhận.",
                confidence: 0.38, // AI bỏ sót
                adminNote: null,
            },
        ],
    },
    {
        scenario: "D4 – AI flag nội dung y tế hợp lệ",
        content:
            "Hướng dẫn sơ cứu đúng cách khi bị bỏng nặng: 1) Không dùng nước đá 2) Làm mát bằng nước lạnh 15-20 phút 3) Không bôi kem đánh răng 4) Băng vết thương sạch 5) Đến BV ngay. Tránh những mẹo dân gian sai lầm!",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Thấy bài này về vết thương, lo sợ hướng dẫn sai y tế",
                status: ReportStatus.DISMISSED,
                isDisinformation: true, // AI nhầm flag
                assistantNote:
                    "Phát hiện từ khóa về chấn thương và điều trị. Flagged để xác minh tính chính xác y tế. Cần admin hoặc chuyên gia y tế xem xét.",
                confidence: 0.55,
                adminNote: "Review: Hướng dẫn y tế hoàn toàn chính xác theo chuẩn Hội Chữ Thập Đỏ. AI false positive. Dismiss. Cần train lại model.",
            },
        ],
    },
    {
        scenario: "D5 – AI không phát hiện ngôn ngữ code lách filter",
        content:
            "Mấy đứa j3w ở cty tao toàn xài ch1nh s4ch ngược đãi nhân viên người kinh. Sếp t0àn ưu tiên d0ng máu khác. Tức thật.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Hate speech sử dụng leet speak để né bộ lọc, kỳ thị sắc tộc",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Phân tích không phát hiện vi phạm rõ ràng. Nội dung về phàn nàn công ty. Tuy nhiên reporter chỉ ra pattern leet speak. Admin cần đọc kỹ ngữ nghĩa thực tế.",
                confidence: 0.28, // AI bị lừa bởi encoding
                adminNote: null,
            },
        ],
    },
    {
        scenario: "D6 – AI confident sai về nội dung satire",
        content:
            "THÔNG BÁO KHẨN: Chính phủ sẽ đánh thuế không khí từ 2026! Mức thuế: 0.001 VND/lần thở. Người giàu có thể mua gói thở không giới hạn 999k/tháng. #satire #humor #thoistay",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Tin giả về thuế nhà nước",
                status: ReportStatus.DISMISSED,
                isDisinformation: true, // AI nhầm
                assistantNote:
                    "Phát hiện tuyên bố về chính sách thuế mới chưa được xác nhận. Flagged là disinformation tiềm năng. Đề nghị admin xác minh.",
                confidence: 0.71,
                adminNote:
                    "Review: Có hashtag #satire và nội dung rõ ràng là châm biếm (thuế không khí). AI thiếu context satire. Dismiss. False positive.",
            },
        ],
    },
    {
        scenario: "D7 – AI nhầm nghiên cứu học thuật là hướng dẫn nguy hiểm",
        content:
            "Bài nghiên cứu mình đọc hôm nay phân tích cách các nhóm extremist tuyển dụng thành viên online: dùng meme, nội dung giải trí, rồi dần escalate. Hiểu cơ chế này quan trọng để counter-messaging.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Cảm giác không ổn về nội dung liên quan cực đoan",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Phát hiện từ ngữ liên quan tuyển dụng cực đoan. Flagged để xem xét. Ngữ cảnh có vẻ học thuật nhưng cần confirm.",
                confidence: 0.56,
                adminNote:
                    "Dismiss. Đây là nội dung nghiên cứu/giáo dục rõ ràng. Từ 'counter-messaging' cho thấy mục tiêu chống cực đoan. False positive của AI.",
            },
        ],
    },
    {
        scenario: "D8 – AI bỏ lọt nội dung sexist được code hóa bằng emoji",
        content:
            "Đàn bà chỉ nên ở nhà 🍳🧹👶 thôi, đi làm 💼 chỉ là tạo rắc rối cho công ty. Đây là quan điểm thực tế không phải phân biệt 😊",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Nội dung sexist dùng emoji để che giấu ý nghĩa",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Phân tích phát hiện ngôn ngữ có thể gây tranh cãi về vai trò giới tính. Không đủ tín hiệu rõ ràng để phân loại vi phạm. Confidence thấp.",
                confidence: 0.42,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "D9 – AI confident sai về meme lịch sử",
        content:
            "Cầm chịch: Đây là ảnh của Hồ Chí Minh thời trẻ khi còn làm bếp ở Paris. Ít ai biết Bác từng là chef 5 sao trước khi trở thành lãnh tụ. Thú vị không? [ảnh đính kèm]",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Thông tin lịch sử không chính xác về lãnh tụ, ảnh giả",
                status: ReportStatus.PENDING,
                isDisinformation: false, // cần admin xác minh
                assistantNote:
                    "Tuyên bố về nhân vật lịch sử quan trọng. Thực tế Hồ Chí Minh có thời gian ở Paris nhưng không rõ chi tiết này. Cần admin xác minh tính chính xác lịch sử.",
                confidence: 0.54,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "D10 – AI bỏ qua nội dung lừa đảo tinh vi",
        content:
            "Chia sẻ kinh nghiệm học online: mình học khóa 'Tư duy tài chính nâng cao' 2 triệu và thay đổi hoàn toàn cách nhìn về tiền bạc. Ai muốn tham gia cùng mình inbox, mình có discount code 20%.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "MLM pyramid scheme dưới dạng khóa học, kiếm hoa hồng từ người đăng ký",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Chia sẻ khóa học và discount code là hành vi marketing thông thường. Không phát hiện vi phạm rõ ràng. Tuy nhiên reporter nêu nghi ngờ MLM – admin có thể kiểm tra thêm.",
                confidence: 0.33,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "D11 – AI nhầm hướng dẫn nấu ăn là nguy hiểm",
        content:
            "Cách làm rượu gạo truyền thống Việt Nam tại nhà: cần nếp cái hoa vàng, men thuốc bắc, bình sành. Ủ 20 ngày ở nhiệt độ phòng. Chắt lấy nước trong, không cần chưng cất.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Hướng dẫn sản xuất rượu lậu",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Phát hiện hướng dẫn sản xuất đồ uống có cồn. Có thể vi phạm quy định tùy theo luật địa phương. Flagged để xem xét.",
                confidence: 0.61,
                adminNote:
                    "Dismiss. Hướng dẫn nấu rượu gạo truyền thống là văn hóa ẩm thực hợp pháp cho mục đích cá nhân. AI overclassified.",
            },
        ],
    },
    {
        scenario: "D12 – AI phát hiện đúng nhưng confidence quá thấp",
        content:
            "Để tránh bị phát hiện khi chụp ảnh người lạ ngoài đường: tắt âm thanh máy ảnh, dùng chế độ burst, đứng xa dùng zoom. Chụp được nhiều ảnh tự nhiên hơn 😊📸",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Hướng dẫn chụp lén người khác không có sự đồng ý – vi phạm quyền riêng tư",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung về kỹ thuật nhiếp ảnh. Câu hỏi về quyền riêng tư là chủ quan và phụ thuộc vào ngữ cảnh. Không chắc chắn đây là vi phạm.",
                confidence: 0.4, // AI quá thấp cho trường hợp này
                adminNote: null,
            },
        ],
    },
    {
        scenario: "D13 – AI flag oan nội dung văn học",
        content:
            "Trích đoạn từ tiểu thuyết mình đang viết: 'Nhân vật phản diện nhìn xuống thành phố bừng sáng, lòng ngập tràn căm hận. Một ngày nào đó hắn sẽ làm tất cả chúng trả giá.'",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Đe dọa bạo lực",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Phát hiện ngôn ngữ đe dọa và bạo lực. Tuy nhiên context 'tiểu thuyết mình đang viết' và 'nhân vật phản diện' cho thấy đây là sáng tác văn học. Cần admin xác nhận.",
                confidence: 0.47,
                adminNote:
                    "Dismiss. Rõ ràng là trích đoạn sáng tác. Reporter đã đọc không đủ context. AI đúng khi confidence thấp. False report.",
            },
        ],
    },
    {
        scenario: "D14 – AI bỏ sót bài phân biệt chủng tộc disguise bằng văn phong lịch sự",
        content:
            "Nghiên cứu di truyền học chỉ ra rằng sự khác biệt về trí tuệ giữa các chủng tộc là có cơ sở sinh học. Đây không phải phân biệt chủng tộc, chỉ là khoa học. Cần thảo luận cởi mở về điều này.",
        isDisinformation: true,
        isHidden: false,
        reports: [
            {
                reason: "Scientific racism, thông tin sai về di truyền học được dùng để biện minh cho phân biệt chủng tộc",
                status: ReportStatus.PENDING,
                isDisinformation: true,
                assistantNote:
                    "Nội dung có dạng học thuật và không chứa từ ngữ hate speech rõ ràng. Không phát hiện vi phạm bề mặt. Tuy nhiên reporter nêu vấn đề 'scientific racism' – admin cần đánh giá chuyên sâu.",
                confidence: 0.39, // AI bị đánh lừa bởi văn phong
                adminNote: null,
            },
        ],
    },
    {
        scenario: "D15 – Nhiều AI flag mâu thuẫn nhau",
        content:
            "Review trung thực sau 1 năm dùng thiết bị tập thể dục ở nhà: lười tập hơn phòng gym, không có partner, không có không khí thi đua. Nếu bạn thiếu discipline thì thiết bị nhà không phải giải pháp.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Nội dung có thể gây nản lòng người đang cố gắng tập thể dục tại nhà",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Nội dung mang tính quan điểm cá nhân về tập thể dục. Không phát hiện vi phạm rõ ràng. Tuy nhiên có thể gây discouragement – tác động tâm lý nhẹ.",
                confidence: 0.22,
                adminNote:
                    "Dismiss. Đây là review chủ quan hoàn toàn hợp lệ. Report không có cơ sở. AI confidence đúng là thấp.",
            },
        ],
    },

    // ══════════════════════════════════════════════
    // E. LẠM DỤNG HỆ THỐNG REPORT / BÁO CÁO OAN (10 bài)
    // ══════════════════════════════════════════════
    {
        scenario: "E1 – Report trả thù sau tranh luận",
        content:
            "Mình không đồng ý với quan điểm của @xyz về kinh tế học. Lý do chính: mô hình Keynesian không phải giải pháp duy nhất, các nền kinh tế Bắc Âu dùng kết hợp nhiều mô hình. Hãy thảo luận thêm.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Nội dung sai về kinh tế học, cần xóa",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là quan điểm học thuật có cơ sở về kinh tế học. Không có dấu hiệu disinformation hay vi phạm nào. Có thể là report trả thù.",
                confidence: 0.15,
                adminNote:
                    "Dismiss. Nội dung tranh luận học thuật hợp lệ. Reporter và tác giả có vẻ đang xung đột – reporter đang dùng report button không đúng mục đích.",
            },
        ],
    },
    {
        scenario: "E2 – Report vì không đồng ý quan điểm",
        content:
            "Mình thấy văn học dòng chảy ý thức (stream of consciousness) không hay, khó đọc và cố tình làm khó người đọc. Virginia Woolf hay James Joyce không phải sở thích của mình dù nhiều người khen.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Nội dung xúc phạm tác giả nổi tiếng, sai về văn học",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là quan điểm văn học cá nhân. Không có nội dung xúc phạm hay disinformation. Report không có cơ sở.",
                confidence: 0.08,
                adminNote: "Dismiss rõ ràng. Ý kiến văn học cá nhân không phải vi phạm.",
            },
        ],
    },
    {
        scenario: "E3 – Report hàng loạt từ coordinated group",
        content:
            "Review nhà hàng XYZ: phục vụ tốt, không gian đẹp, đồ ăn ngon nhưng giá hơi cao. 7/10 sẽ quay lại. #reviewquanan #saigon",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Review sai sự thật gây thiệt hại kinh doanh",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Review bình thường, không có ngôn ngữ cực đoan hay tuyên bố sai sự thật rõ ràng. 7/10 là đánh giá trung bình hợp lý.",
                confidence: 0.12,
                adminNote:
                    "Dismiss. Có 8 report giống nhau cho bài này trong 2 giờ – dấu hiệu report bomb từ phía có lợi ích với nhà hàng. Ghi nhận pattern.",
            },
            {
                reason: "Fake review, người này chưa bao giờ đến đây",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote: null,
                confidence: null,
                adminNote: "Xử lý theo report đầu.",
            },
        ],
    },
    {
        scenario: "E4 – Report vì ghen tuông",
        content:
            "Date night thành công! Anh ấy đặt bàn ở nhà hàng view Bitexco, hoa hồng đỏ, nhạc nhẹ. Hạnh phúc ghê 🌹❤️",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Khoe mẽ, nội dung giả tạo, ảnh hưởng tâm lý người khác",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là chia sẻ cuộc sống cá nhân hoàn toàn bình thường. Không có vi phạm nào.",
                confidence: 0.03,
                adminNote: "Dismiss. Report không có cơ sở.",
            },
        ],
    },
    {
        scenario: "E5 – Report nội dung nhạy cảm nhưng hợp lệ (thảo luận giới tính)",
        content:
            "Theo nghiên cứu tâm lý học hiện đại, biểu đồ phân phối chuẩn về các đặc điểm tâm lý ở nam và nữ cho thấy sự chồng lấp lớn. Sự khác biệt giới tính sinh học tồn tại nhưng không nên dùng để stereotype cá nhân.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Phân biệt giới tính dưới vỏ bọc khoa học",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Nội dung trình bày kết luận tâm lý học có bằng chứng và kết luận chống stereotype. Không vi phạm.",
                confidence: 0.21,
                adminNote: "Dismiss. Nội dung học thuật cân bằng và chính xác. Reporter hiểu nhầm.",
            },
        ],
    },
    {
        scenario: "E6 – Report vì cạnh tranh kinh doanh",
        content:
            "Sau khi thử đủ loại trà sữa ở Sài Gòn, mình nhận ra Gong Cha vẫn consistent nhất về chất lượng. Giá hơi cao nhưng đáng. Không nói Tiger Sugar hay The Alley kém, chỉ là taste preference thôi.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Quảng cáo trá hình cho Gong Cha, gây thiệt hại cho brand khác",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là review sản phẩm với ngôn ngữ trung lập và cân nhắc. Không có dấu hiệu được trả tiền hay disinformation.",
                confidence: 0.14,
                adminNote: "Dismiss. Report từ tài khoản liên kết với brand cạnh tranh. Không có vi phạm.",
            },
        ],
    },
    {
        scenario: "E7 – Report vì tức giận",
        content:
            "Trả lời @abc: Mình không đồng ý. Bạn đang dùng confirmation bias để chọn lọc dữ liệu. Các nghiên cứu peer-reviewed đều không hỗ trợ luận điểm đó. Cite nguồn đi nếu muốn tranh luận nghiêm túc.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Xúc phạm, chỉ trích gay gắt",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là phản biện học thuật với yêu cầu dẫn nguồn. Không có ngôn ngữ xúc phạm. Tranh luận trí tuệ bình thường.",
                confidence: 0.11,
                adminNote: "Dismiss. Phản biện học thuật không phải vi phạm, dù có thể gây khó chịu.",
            },
        ],
    },
    {
        scenario: "E8 – Report chính trị phân cực",
        content:
            "Phân tích chính sách kinh tế: tăng thuế doanh nghiệp có thể giảm đầu tư ngắn hạn nhưng nếu dùng để cải thiện hạ tầng và giáo dục thì lợi ích dài hạn vượt trội. Mỗi chính sách có trade-off.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Tuyên truyền cánh tả, ủng hộ tăng thuế",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là phân tích chính sách cân bằng, thừa nhận trade-off. Không phải tuyên truyền. Report mang tính chính trị.",
                confidence: 0.09,
                adminNote: "Dismiss. Phân tích chính sách học thuật. Report mang động cơ chính trị.",
            },
        ],
    },
    {
        scenario: "E9 – Report nội dung hài nhạy cảm nhưng hợp lệ",
        content:
            "Joke của ngày: Tại sao sinh viên IT luôn nhầm Halloween với Christmas? Vì Oct 31 = Dec 25 (octal vs decimal). 🎃🎄 #lập trình #hài #techhumor",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Nội dung ký tự lạ, có thể là mã độc ẩn",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là joke lập trình về hệ đếm bát phân và thập phân. Oct 31 = Dec 25 là sự thật toán học. Không có mã độc.",
                confidence: 0.06,
                adminNote: "Dismiss. Joke lập trình bình thường. Reporter không hiểu nội dung.",
            },
        ],
    },
    {
        scenario: "E10 – Serial reporter lạm dụng hệ thống",
        content:
            "Thứ 2 đầu tuần: mình hay dùng Pomodoro technique – tập trung 25 phút, nghỉ 5 phút. Hiệu quả hơn nhiều so với cố làm 3 tiếng liên tục. Ai hay dùng phương pháp quản lý thời gian nào không?",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Quảng bá sản phẩm không được phép",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Chia sẻ phương pháp làm việc cá nhân. Không có link sản phẩm hay quảng cáo. Không vi phạm.",
                confidence: 0.04,
                adminNote:
                    "Dismiss. Tài khoản reporter này đã submit 47 report trong 3 ngày – phần lớn không có cơ sở. Đánh dấu là serial reporter, xem xét hạn chế tính năng report.",
            },
        ],
    },

    // ══════════════════════════════════════════════
    // F. VI PHẠM NHẸ / ĐÃ TỰ GIẢI QUYẾT / ĐANG XỬ LÝ (10 bài)
    // ══════════════════════════════════════════════
    {
        scenario: "F1 – Bài đã xóa trước khi admin xử lý",
        content:
            "[Bài đã bị tác giả tự xóa] Nội dung gốc: Mình lỡ share thông tin sai về lịch nghỉ lễ năm 2025. Xin lỗi mọi người, đã kiểm tra lại rồi.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Thông tin ngày nghỉ sai gây nhầm lẫn cho người đi làm",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Tác giả đã tự xóa và xin lỗi trước khi report được xử lý. Tác động thấp.",
                confidence: 0.6,
                adminNote: "Resolved. Tác giả đã tự xử lý. Không cần action thêm.",
            },
        ],
    },
    {
        scenario: "F2 – Vi phạm bản quyền nhẹ",
        content:
            "Đây là đoạn nhạc mình cover bài Trịnh Công Sơn, thu âm tại nhà bằng đàn acoustic. Không kiếm tiền, chỉ để chia sẻ với bạn bè thôi 🎸 [audio clip]",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Vi phạm bản quyền âm nhạc không xin phép",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Cover cá nhân phi thương mại thường được bảo vệ bởi fair use. Cần xem xét chính sách cụ thể của nền tảng.",
                confidence: 0.38,
                adminNote:
                    "Dismiss. Cover phi thương mại của tác phẩm âm nhạc Việt Nam trong domain công cộng. Không vi phạm.",
            },
        ],
    },
    {
        scenario: "F3 – Thông tin cá nhân vô tình để lộ",
        content:
            "Hóa đơn tháng này: tiền thuê nhà 6 triệu, điện nước 800k, internet 200k, ăn uống 3.5 triệu [ảnh hóa đơn đính kèm – có thể thấy địa chỉ nhà và số tài khoản]",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Lộ thông tin tài khoản ngân hàng và địa chỉ nhà trong ảnh",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Ảnh đính kèm có thể chứa thông tin cá nhân nhạy cảm. Cần ẩn ảnh ngay và thông báo tác giả.",
                confidence: 0.82,
                adminNote: "Ẩn ảnh, nhắn tác giả gỡ thông tin nhạy cảm. Tác giả đã tự xóa sau khi được nhắc.",
            },
        ],
    },
    {
        scenario: "F4 – Ngôn ngữ thô tục nhẹ trong context hài",
        content:
            "Cái cảm giác compile xong không có lỗi: wtf không lẽ code tao đúng hết lần này? Chờ... 30 giây sau: runtime error. Tất nhiên rồi 🤦‍♂️ #devlife #programmerlife",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Ngôn ngữ thô tục (wtf)",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Viết tắt thông dụng trong ngữ cảnh hài hước lập trình. Mức độ thấp, không nhắm đến ai.",
                confidence: 0.18,
                adminNote: "Dismiss. Không đủ nghiêm trọng để xử lý.",
            },
        ],
    },
    {
        scenario: "F5 – Nội dung nhạy cảm về cờ bạc",
        content:
            "Hỏi chuyên gia: chiến lược Martingale trong baccarat có thực sự hiệu quả không? Mình đang học về xác suất và tò mò về tính toán toán học đằng sau.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Hướng dẫn cờ bạc, có hại cho người nghiện cờ bạc",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Câu hỏi học thuật về xác suất. Không phải hướng dẫn cờ bạc trực tiếp. Tuy nhiên có thể nhạy cảm tùy chính sách nền tảng về cờ bạc.",
                confidence: 0.34,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "F6 – Bài cũ được report muộn",
        content:
            "Năm 2022 mình đã dự đoán Bitcoin sẽ lên 100k USD vào cuối năm 2023. Sai hoàn toàn lol 😂 Ai cũng có thể sai dự đoán thị trường.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Thông tin sai về crypto đã gây thiệt hại tài chính cho người đọc",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Tác giả tự thừa nhận dự đoán sai. Đây không phải disinformation mà là chia sẻ bài học. Không có ý định gian dối.",
                confidence: 0.16,
                adminNote: "Dismiss. Nội dung tự phê bình, không có ý định xấu.",
            },
        ],
    },
    {
        scenario: "F7 – Vi phạm nhỏ đã được cảnh cáo",
        content:
            "Ai muốn mua vé concert BTS không? Mình có 2 vé hàng A1 giá gốc 5 triệu, bán lại 4.5 triệu vì không đi được. LH inbox hoặc SĐT [số điện thoại]",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Bán hàng không được phép trên nền tảng",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Bán vé cá nhân có thể vi phạm điều khoản về giao dịch thương mại. Tuy nhiên mức độ thấp và là vé thật.",
                confidence: 0.55,
                adminNote: "Ẩn SĐT khỏi bài, nhắn nhở tác giả dùng chức năng marketplace.",
            },
        ],
    },
    {
        scenario: "F8 – Nội dung chứa meme có thể bị hiểu sai",
        content:
            "Khi sếp hỏi 'tại sao không làm xong deadline hôm qua': [meme ảnh người đang chạy trốn] 💀 #worklife #relatable",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Khuyến khích thái độ tiêu cực với công việc",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Meme hài hước về áp lực công việc. Hoàn toàn bình thường và relatable. Không có ý định tiêu cực.",
                confidence: 0.07,
                adminNote: "Dismiss ngay. Nội dung hài lành mạnh.",
            },
        ],
    },
    {
        scenario: "F9 – Chia sẻ thông tin nhạy cảm về sức khỏe tâm thần",
        content:
            "Mình vừa được chẩn đoán ADHD ở tuổi 25. Cảm giác vừa nhẹ nhõm vừa choáng ngợp. Nếu ai đã trải qua điều này cho mình biết với – cần lắng nghe lắm 🙏",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Nội dung về bệnh tâm thần có thể gây ảnh hưởng tiêu cực",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Chia sẻ về sức khỏe tâm thần cá nhân với tông tích cực, tìm kiếm hỗ trợ cộng đồng. Rất lành mạnh và cần được khuyến khích.",
                confidence: 0.05,
                adminNote: "Dismiss. Report sai hoàn toàn. Nội dung tích cực về sức khỏe tâm thần.",
            },
        ],
    },
    {
        scenario: "F10 – Bài hỏi về luật pháp bị hiểu nhầm",
        content:
            "Hỏi pháp lý: nếu hàng xóm liên tục để xe chắn cửa nhà mình và từ chối dời xe khi nhờ, mình có quyền gọi cảnh sát hoặc xe kéo không? Đã nhờ nhiều lần không được.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Hỏi cách trả thù hàng xóm",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là câu hỏi pháp lý chính đáng về quyền lợi khi bị cản trở lối đi. Không có ý định bạo lực hay trả thù.",
                confidence: 0.09,
                adminNote: "Dismiss. Reporter diễn giải sai. Câu hỏi pháp lý hợp lệ.",
            },
        ],
    },

    // ══════════════════════════════════════════════
    // G. ĐA REPORT + TRƯỜNG HỢP PHỨC TẠP (15 bài)
    // ══════════════════════════════════════════════
    {
        scenario: "G1 – Bài viral bị report hàng loạt, nội dung hợp lệ",
        content:
            "Sau 10 năm làm việc ở Việt Nam, mình – người nước ngoài – thấy người Việt có một điểm yếu lớn: không nói thẳng. Luôn 'có thể', 'để xem', 'ok ok' nhưng thực ra là không. Điều này gây nhiều hiểu lầm trong kinh doanh.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Xúc phạm người Việt Nam, stereotype tiêu cực",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là quan sát cross-cultural từ góc nhìn người nước ngoài có kinh nghiệm thực tế. Không phải hate speech dù có thể gây khó chịu cho một số người.",
                confidence: 0.31,
                adminNote: null,
            },
            {
                reason: "Phân biệt văn hóa",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote: null,
                confidence: null,
                adminNote: null,
            },
            {
                reason: "Nội dung thiếu tôn trọng người Việt",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote: null,
                confidence: null,
                adminNote: "Dismiss sau review. Quan sát văn hóa có cơ sở, không phải hate speech.",
            },
        ],
    },
    {
        scenario: "G2 – Report từ nhiều nhóm lợi ích khác nhau",
        content:
            "Phân tích khách quan: thịt đỏ ăn vừa phải (2-3 lần/tuần) không liên quan đến ung thư đại trực tràng theo meta-analysis gần nhất. Nguy cơ tăng chỉ khi dùng processed meat >50g/ngày. #suckhoenutrition",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Thông tin sai về ung thư và thịt đỏ, WHO đã khẳng định thịt đỏ là carcinogen",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Đây là chủ đề có bằng chứng khoa học phức tạp. Tác giả trích dẫn meta-analysis nhưng không nêu nguồn cụ thể. Cần chuyên gia y tế review – không thể kết luận đơn giản.",
                confidence: 0.45,
                adminNote: null,
            },
            {
                reason: "Giải thích sai về phân loại IARC của WHO",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote: null,
                confidence: null,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "G3 – Bài nổi tiếng đột ngột bị mass report",
        content:
            "Review sau 6 tháng dùng VinFast VF8: pin thực tế thấp hơn quảng cáo 20%, app hay lỗi, service center chậm. Nhưng lái êm, không gian rộng, giá hợp lý. 6/10 tổng thể. #VinFast #review",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Review sai sự thật, bôi nhọ thương hiệu Việt",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Review cân bằng, nêu cả ưu và nhược điểm. Đây là trải nghiệm cá nhân hợp lệ. Không có dấu hiệu disinformation.",
                confidence: 0.13,
                adminNote: null,
            },
            {
                reason: "Thông tin pin sai, gây hiểu nhầm",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote: null,
                confidence: null,
                adminNote: null,
            },
            {
                reason: "Anti-Vietnam, phá hoại thương hiệu quốc gia",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote: null,
                confidence: null,
                adminNote:
                    "Dismiss tất cả reports. Pattern: 12 report trong 1 giờ sau khi bài được 500 like – dấu hiệu report bombing. Review cá nhân hoàn toàn hợp lệ.",
            },
        ],
    },
    {
        scenario: "G4 – Report chéo giữa hai bên tranh luận",
        content:
            "Bên ủng hộ năng lượng tái tạo cần thừa nhận thực tế: điện gió và mặt trời không thể là baseload nếu không có storage tốt. Đây không phải phủ nhận climate change, chỉ là kỹ thuật.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Nội dung phủ nhận năng lượng tái tạo, được tài trợ bởi Big Oil",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là quan điểm kỹ thuật có cơ sở về thách thức của lưới điện. Không phủ nhận climate change. Không có bằng chứng tài trợ.",
                confidence: 0.19,
                adminNote: "Dismiss. Thảo luận kỹ thuật hợp lệ trong tranh luận chính sách năng lượng.",
            },
        ],
    },
    {
        scenario: "G5 – Nội dung nhạy cảm nhưng giáo dục về ma túy",
        content:
            "Thread về giảm tác hại (harm reduction) khi dùng chất kích thích: nhận biết overdose, cách gọi cấp cứu đúng, không bao giờ dùng một mình. Không khuyến khích dùng – chỉ để cứu mạng nếu ai đó đã dùng.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Hướng dẫn sử dụng ma túy",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung harm reduction là lĩnh vực y tế công cộng được WHO công nhận. Tuy nhiên cần admin cân nhắc chính sách nền tảng về nội dung liên quan ma túy.",
                confidence: 0.48,
                adminNote: null,
            },
            {
                reason: "Bất hợp pháp, cổ xúy dùng ma túy",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote: null,
                confidence: null,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "G6 – Bài về người nổi tiếng bị report từ fanbase đối lập",
        content:
            "Nhận xét chuyên môn: kỹ thuật hát của ca sĩ X đang giảm sút trong album mới so với 5 năm trước. Breath support yếu, vocal runs không clean. Vẫn là nghệ sĩ tài năng nhưng cần chú ý kỹ thuật.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Nói xấu nghệ sĩ, thông tin sai về giọng hát",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là nhận xét chuyên môn về kỹ thuật thanh nhạc. Không phải attack cá nhân hay hate speech. Hoàn toàn hợp lệ.",
                confidence: 0.11,
                adminNote: "Dismiss. Phê bình nghệ thuật chuyên nghiệp là quyền tự do biểu đạt.",
            },
            {
                reason: "Gây ảnh hưởng đến sự nghiệp nghệ sĩ",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote: null,
                confidence: null,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "G7 – Nội dung gây tranh cãi về chế độ ăn kiêng",
        content:
            "Keto diet KHÔNG phải giải pháp lâu dài cho đa số người: hầu hết regain cân sau 1 năm, thiếu chất xơ tăng nguy cơ đường ruột. Khoa học dinh dưỡng ủng hộ balanced diet hơn. Đây là sự thật khó nghe.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Thông tin sai về keto, gây hại cho người đang theo keto",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Nội dung phản ánh consensus khoa học dinh dưỡng hiện tại. Không phải disinformation dù keto community có thể không đồng ý.",
                confidence: 0.27,
                adminNote: "Dismiss. Thông tin dinh dưỡng cân bằng và có bằng chứng.",
            },
        ],
    },
    {
        scenario: "G8 – Report sau scandal của tác giả",
        content:
            "Hướng dẫn đầu tư index fund cho người mới: bắt đầu với ETF, dollar-cost averaging hàng tháng, không cố chọn cổ phiếu cụ thể, time in market > timing the market. Chiến lược đơn giản và hiệu quả.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Tác giả bài này vừa bị tố cáo lừa đảo tài chính, nội dung không đáng tin",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung bài viết cụ thể này là thông tin tài chính cơ bản và chính xác. Tuy nhiên nếu tác giả có tiền sử gian lận thì cần xem xét toàn bộ tài khoản.",
                confidence: 0.4,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "G9 – Bài report vì tranh chấp quyền sở hữu nội dung",
        content:
            "Ảnh chụp hoàng hôn Đà Lạt của mình từ năm ngoái. Rất bất ngờ khi thấy ảnh này đang được một tài khoản khác dùng làm ảnh đại diện mà không xin phép 😤 #photography",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Không biết ảnh này có thật thuộc về họ không, có thể là claim giả tạo",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Đây là tranh chấp bản quyền ảnh giữa người dùng. Cần admin xem xét bằng chứng sở hữu từ cả hai phía.",
                confidence: 0.35,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "G10 – Nội dung chính trị nhạy cảm",
        content:
            "Nhìn lại 20 năm đổi mới: kinh tế VN tăng trưởng vượt bậc nhưng bất bình đẳng thu nhập cũng tăng song song. Gini coefficient từ 0.35 lên 0.42 trong giai đoạn này. Cần chính sách phân phối lại.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Nội dung chống nhà nước, số liệu sai",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là phân tích kinh tế dựa trên số liệu Gini coefficient – chỉ số có thể xác minh. Không phải nội dung chống nhà nước mà là phân tích chính sách có cơ sở.",
                confidence: 0.23,
                adminNote: "Dismiss. Phân tích kinh tế học thuật hợp lệ. Số liệu Gini VN có thể xác minh qua World Bank.",
            },
        ],
    },
    {
        scenario: "G11 – Bài về thuốc, nội dung chính xác nhưng bị report",
        content:
            "Melatonin: không phải thuốc ngủ mà là hormone điều tiết chu kỳ ngủ. Liều thấp (0.5-1mg) hiệu quả hơn liều cao (5-10mg). Dùng 30-60 phút trước khi ngủ. Phù hợp để điều chỉnh jet lag hơn là mất ngủ kinh niên.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Hướng dẫn tự dùng thuốc nguy hiểm không qua bác sĩ",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Thông tin về melatonin chính xác theo tài liệu y tế. Không bán OTC tại VN cần kê đơn nhưng nội dung là thông tin chứ không phải bán thuốc.",
                confidence: 0.36,
                adminNote: "Dismiss. Thông tin y tế chính xác. Không phải kê đơn. Reporter hiểu nhầm.",
            },
        ],
    },
    {
        scenario: "G12 – Post về ranh giới tự do ngôn luận",
        content:
            "Theo tôi, một số chính sách kinh tế hiện tại chưa thực sự tối ưu. Tôi nghĩ phân tích kinh tế học so sánh có thể giúp cải thiện. Mong muốn có thêm nghiên cứu chính sách từ phía học giả độc lập.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Chỉ trích chính sách nhà nước",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Ý kiến về chính sách kinh tế được trình bày một cách thận trọng, học thuật và xây dựng. Không phải tuyên truyền hay kêu gọi chống đối.",
                confidence: 0.17,
                adminNote: "Dismiss. Phản biện chính sách hợp lệ trong xã hội dân chủ.",
            },
        ],
    },
    {
        scenario: "G13 – Nội dung ảnh hưởng tâm lý phức tạp",
        content:
            "Sau 3 năm bị người yêu kiểm soát tài chính, cô lập xã hội, và thường xuyên bị xúc phạm – mình cuối cùng đã rời đi. Nếu ai đang trong tình huống tương tự: đây là những nguồn hỗ trợ mình đã dùng [link hotline]",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Nội dung về bạo lực gia đình có thể gây distress",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là nội dung về trải nghiệm cá nhân và chia sẻ nguồn hỗ trợ. Rất có giá trị cho cộng đồng. Không vi phạm gì.",
                confidence: 0.06,
                adminNote: "Dismiss. Nội dung tích cực, hỗ trợ nạn nhân bạo lực gia đình.",
            },
        ],
    },
    {
        scenario: "G14 – Bài bị report vì tranh luận về lịch sử",
        content:
            "Lịch sử Chiến tranh Việt Nam nhìn từ nhiều góc độ: góc độ Mỹ (cold war containment), góc độ Bắc Việt (thống nhất dân tộc), góc độ Nam Việt (tự do hóa). Mỗi narrative phản ánh một phần sự thật phức tạp.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Xuyên tạc lịch sử, đề cao quan điểm nước ngoài",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Đây là phân tích lịch sử đa chiều theo chuẩn học thuật. Không xuyên tạc mà trình bày nhiều perspective.",
                confidence: 0.24,
                adminNote: "Dismiss sau review. Phân tích lịch sử học thuật cân bằng.",
            },
        ],
    },
    {
        scenario: "G15 – Nội dung nghệ thuật bị hiểu nhầm",
        content:
            "Ảnh nghệ thuật thân thể: series ảnh đen trắng chụp bàn tay, vai, lưng – khám phá vẻ đẹp cơ thể con người không phụ thuộc vào chuẩn đẹp xã hội. [4 ảnh đính kèm, không explicit]",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Ảnh nhạy cảm",
                status: ReportStatus.DISMISSED,
                isDisinformation: false,
                assistantNote:
                    "Cần admin xem ảnh thực tế để xác nhận. Mô tả có vẻ là nghệ thuật hợp lệ nhưng cần verify.",
                confidence: 0.37,
                adminNote: "Đã review ảnh: hoàn toàn không explicit. Nghệ thuật nhiếp ảnh hợp lệ. Dismiss.",
            },
        ],
    },

    // ══════════════════════════════════════════════
    // H. VI PHẠM NGHIÊM TRỌNG CẦN HÀNH ĐỘNG NGAY (10 bài)
    // ══════════════════════════════════════════════
    {
        scenario: "H1 – Quấy rối tình dục",
        content:
            "Tag @username: em này đẹp ghê, mấy anh có số không chia với 😜. Nhìn ảnh profile thôi là biết loại người như thế nào rồi.",
        isDisinformation: false,
        isHidden: true,
        reports: [
            {
                reason: "Quấy rối tình dục, objectify phụ nữ, chia sẻ thông tin liên lạc không đồng ý",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Vi phạm nghiêm trọng: quấy rối tình dục kết hợp phán xét character từ ngoại hình. Xóa và bảo vệ tài khoản bị nhắm đến.",
                confidence: 0.95,
                adminNote: "Xóa bài. Khóa tài khoản 30 ngày. Gửi thông báo hỗ trợ cho @username.",
            },
        ],
    },
    {
        scenario: "H2 – Nội dung liên quan người dưới 18 tuổi",
        content:
            "Ảnh con gái 15 tuổi của mình mới chụp hôm nay, mặc áo dài lần đầu. Đẹp quá trời 😍 [ảnh đính kèm]",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Lo ngại về ảnh vị thành niên được đăng công khai",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Có thể là bài đăng của phụ huynh về con cái – bình thường. Tuy nhiên cần admin xem ảnh và bối cảnh tài khoản để xác nhận không có vấn đề bảo vệ trẻ em.",
                confidence: 0.45,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "H3 – Đăng địa điểm và lịch trình của người khác",
        content:
            "Cô @xyz tối nào cũng đi gym ở trung tâm ABC đường DEF lúc 7-8pm. Hôm nay mình vô tình thấy, cô ấy trông rất đẹp. Ai muốn làm quen thì biết chỗ rồi nhé 😊",
        isDisinformation: false,
        isHidden: true,
        reports: [
            {
                reason: "Doxxing lịch trình cá nhân, tạo điều kiện cho stalker",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Vi phạm nghiêm trọng quyền riêng tư: tiết lộ địa điểm và thói quen hàng ngày của cá nhân mà không có sự đồng ý. Nguy cơ stalking thực sự. Xóa khẩn.",
                confidence: 0.98,
                adminNote: "Xóa ngay. Cảnh cáo nghiêm tài khoản. Thông báo @xyz.",
            },
        ],
    },
    {
        scenario: "H4 – Nội dung phát tán thông tin sức khỏe nguy hiểm",
        content:
            "CÁCH GIẢM SỐT CHO TRẺ EM TẠI NHÀ: chỉ cần đắp khăn tẩm cồn nguyên chất lên người bé. Tuyệt đối KHÔNG dùng thuốc hạ sốt – chúng gây hại thận bé. Phương pháp này an toàn 100%.",
        isDisinformation: true,
        isHidden: true,
        reports: [
            {
                reason: "Hướng dẫn y tế SAI NGUY HIỂM cho trẻ em, cồn nguyên chất có thể ngộ độc qua da",
                status: ReportStatus.RESOLVED,
                isDisinformation: true,
                assistantNote:
                    "Hướng dẫn này đặc biệt nguy hiểm: đắp cồn nguyên chất cho trẻ em có thể gây ngộ độc ethanol qua da. Thông tin về thuốc hạ sốt cũng sai. Xóa khẩn – có nguy cơ gây chết người.",
                confidence: 0.99,
                adminNote: "Xóa ngay. Khóa tài khoản. Lưu trữ cho mục đích pháp lý.",
            },
        ],
    },
    {
        scenario: "H5 – Rao bán hàng giả",
        content:
            "Bán túi LV, Gucci, Chanel authentic 100% giá chỉ bằng 1/10 thị trường! Hàng xách tay từ Paris. Inbox để xem catalog. Ship toàn quốc. [100+ ảnh túi]",
        isDisinformation: true,
        isHidden: false,
        reports: [
            {
                reason: "Bán hàng giả nhãn hiệu, lừa dối người tiêu dùng",
                status: ReportStatus.RESOLVED,
                isDisinformation: true,
                assistantNote:
                    "Giá 1/10 thị trường cho luxury goods là dấu hiệu chắc chắn của hàng giả/nhái. Vi phạm bản quyền thương hiệu và lừa dối người tiêu dùng.",
                confidence: 0.96,
                adminNote: "Xóa, khóa tài khoản, báo cáo cho đội xử lý IP infringement.",
            },
        ],
    },
    {
        scenario: "H6 – Social engineering attack",
        content:
            "Admin hệ thống thông báo: Tài khoản của bạn sẽ bị khóa trong 24h do hoạt động đáng ngờ. Xác minh ngay tại: secure-platform-verify.net/login. Nhập username và password để giữ tài khoản.",
        isDisinformation: true,
        isHidden: true,
        reports: [
            {
                reason: "Phishing tài khoản người dùng, giả mạo thông báo hệ thống",
                status: ReportStatus.RESOLVED,
                isDisinformation: true,
                assistantNote:
                    "Đây là tấn công social engineering điển hình. Domain giả mạo. Xóa khẩn và thông báo toàn bộ người dùng về bài này.",
                confidence: 0.99,
                adminNote: "Xóa, blacklist domain, alert security team. Gửi cảnh báo platform-wide.",
            },
        ],
    },
    {
        scenario: "H7 – Nội dung tự tử ngầm",
        content:
            "Đôi khi nghĩ về việc mình không còn ở đây nữa thì mọi thứ sẽ nhẹ nhàng hơn cho mọi người. Không than vãn, chỉ là suy nghĩ thôi. Thôi không nói nữa.",
        isDisinformation: false,
        isHidden: false,
        reports: [
            {
                reason: "Bài viết ngầm về ý định tự tử, cần can thiệp khẩn",
                status: ReportStatus.PENDING,
                isDisinformation: false,
                assistantNote:
                    "Nội dung thể hiện dấu hiệu ý nghĩ thụ động về cái chết. Đây là trường hợp cần ưu tiên cao nhất. Cần liên hệ tác giả ngay với nguồn hỗ trợ sức khỏe tâm thần.",
                confidence: 0.88,
                adminNote: null,
            },
        ],
    },
    {
        scenario: "H8 – Lộ dữ liệu người dùng khác",
        content:
            "Tìm thấy file excel này trong máy anh đồng nghiệp: [ảnh chụp màn hình database với họ tên, SĐT, địa chỉ 500+ người]. Rò rỉ data kinh điển của công ty. Thật ra có nhiều chỗ bị vậy lắm.",
        isDisinformation: false,
        isHidden: true,
        reports: [
            {
                reason: "Đăng dữ liệu cá nhân của hàng trăm người không có sự đồng ý",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Vi phạm nghiêm trọng quyền riêng tư: phát tán PII của hàng trăm người. Xóa ngay lập tức và xem xét pháp lý.",
                confidence: 0.99,
                adminNote: "Xóa ngay. Báo cáo lên team pháp lý và an toàn dữ liệu.",
            },
        ],
    },
    {
        scenario: "H9 – Kêu gọi tẩy chay cá nhân vì nghi oan",
        content:
            "Cảnh báo: Giáo viên XYZ trường ABC đang lạm dụng học sinh! Mình nghe nói từ nguồn đáng tin. Hãy pull con ra khỏi lớp này ngay và tẩy chay trường này!!! 😡 Share để cảnh báo phụ huynh!",
        isDisinformation: true,
        isHidden: true,
        reports: [
            {
                reason: "Vu khống cá nhân nghiêm trọng, gây hại tên tuổi và nghề nghiệp",
                status: ReportStatus.RESOLVED,
                isDisinformation: true,
                assistantNote:
                    "Tuyên bố cáo buộc nghiêm trọng không có bằng chứng. 'Nghe nói từ nguồn đáng tin' không phải bằng chứng. Có thể là vu khống gây hại lớn. Xóa khẩn.",
                confidence: 0.94,
                adminNote: "Xóa, ẩn tên giáo viên, khóa tài khoản pending review. Có thể cần action pháp lý.",
            },
        ],
    },
    {
        scenario: "H10 – Nội dung cực đoan tôn giáo",
        content:
            "Ai theo đạo [X] đều là kẻ thù của đất nước và cần bị theo dõi. Họ luôn phục vụ nước ngoài chứ không phải VN. Đây là sự thật lịch sử không thể phủ nhận. Nhà nước cần hành động!",
        isDisinformation: false,
        isHidden: true,
        reports: [
            {
                reason: "Kêu gọi theo dõi và phân biệt đối xử tôn giáo, kích động thù ghét",
                status: ReportStatus.RESOLVED,
                isDisinformation: false,
                assistantNote:
                    "Vi phạm nghiêm trọng: hate speech tôn giáo + kêu gọi theo dõi + kích động nhà nước hành động chống nhóm tôn giáo cụ thể. Xóa ngay.",
                confidence: 0.97,
                adminNote: "Xóa, khóa vĩnh viễn tài khoản, giữ log pháp lý.",
            },
        ],
    },
];

// ─── SEED MAIN ────────────────────────────────────────────────────────────────
async function seedReportedPosts() {
    console.log("\n🚨 ===== SEED 100 BÀI POST BỊ BÁO CÁO =====\n");

    // 1. Load users
    const users = await prisma.user.findMany({
        where: { deletedAt: null },
        select: { id: true, username: true, name: true, avatar: true, bio: true },
        orderBy: { createdAt: "desc" },
        take: 200,
    });

    if (users.length === 0) {
        throw new Error("Không có user! Chạy seed gốc trước.");
    }
    console.log(`👤 Tìm thấy ${users.length} users\n`);

    const shuffledUsers = shuffle(users);

    let totalPosts = 0;
    let totalReports = 0;
    const statusCount: Record<string, number> = {
        PENDING: 0,
        RESOLVED: 0,
        DISMISSED: 0,
    };
    const categoryCount: Record<string, number> = {
        A_fake_news: 0,
        B_hate_speech: 0,
        C_spam: 0,
        D_ai_error: 0,
        E_abuse_report: 0,
        F_minor: 0,
        G_complex: 0,
        H_critical: 0,
    };

    for (let i = 0; i < SCENARIOS.length; i++) {
        const scenario = SCENARIOS[i];
        const author = shuffledUsers[i % shuffledUsers.length];
        const createdAt = randomDate(60);

        // Tạo post
        const post = await prisma.post.create({
            data: {
                userId: author.id,
                content: scenario.content,
                type: PostType.POST,
                visibility: VisibilityPost.PUBLIC,
                replyPermission: pick([
                    ReplyPermission.EVERYONE,
                    ReplyPermission.EVERYONE,
                    ReplyPermission.FOLLOWERS,
                ]),
                userSnapshot: {
                    id: author.id,
                    username: author.username,
                    name: author.name,
                    avatar: author.avatar,
                    bio: author.bio,
                },
                likesCount: rand(0, 200),
                repliesCount: rand(0, 30),
                repostsCountAndQuoteCount: rand(0, 20),
                viewsCount: rand(50, 10000),
                isHidden: scenario.isHidden,
                isDisinformation: scenario.isDisinformation,
                createdAt,
                updatedAt: createdAt,
            },
            select: { id: true, publicId: true },
        });
        totalPosts++;

        // Tạo reports – người báo cáo ngẫu nhiên, không trùng với tác giả
        const availableReporters = shuffledUsers.filter(u => u.id !== author.id);

        for (let ri = 0; ri < scenario.reports.length; ri++) {
            const reportDef = scenario.reports[ri];
            const reporter = availableReporters[(i * 3 + ri * 7) % availableReporters.length];
            const reportedAt = new Date(createdAt.getTime() + rand(3_600_000, 86_400_000 * 7));

            await prisma.report.create({
                data: {
                    reporterId: reporter.id,
                    targetType: ReportTargetType.POST,
                    targetId: post.publicId,
                    reason: reportDef.reason,
                    status: reportDef.status,
                    isDisinformation: reportDef.isDisinformation,
                    assistantNote: reportDef.assistantNote,
                    confidence: reportDef.confidence !== null
                        ? parseFloat(reportDef.confidence.toFixed(2))
                        : null,
                    adminNote: reportDef.adminNote,
                    createdAt: reportedAt,
                },
            });

            totalReports++;
            statusCount[reportDef.status] = (statusCount[reportDef.status] ?? 0) + 1;
        }

        // Thống kê category
        const cat = scenario.scenario[0];
        const catKey =
            cat === "A" ? "A_fake_news" :
                cat === "B" ? "B_hate_speech" :
                    cat === "C" ? "C_spam" :
                        cat === "D" ? "D_ai_error" :
                            cat === "E" ? "E_abuse_report" :
                                cat === "F" ? "F_minor" :
                                    cat === "G" ? "G_complex" :
                                        "H_critical";
        categoryCount[catKey] = (categoryCount[catKey] ?? 0) + 1;

        process.stdout.write(
            `\r   → ${i + 1}/100 scenarios | ${totalReports} reports`
        );
    }

    // ── Thống kê cuối ────────────────────────────────────────────────────────
    console.log("\n\n📊 ===== THỐNG KÊ SEED =====");
    console.log("\n📁 Theo danh mục:");
    const catLabels: Record<string, string> = {
        A_fake_news: "A. Fake news / Disinformation",
        B_hate_speech: "B. Hate speech / Bạo lực",
        C_spam: "C. Spam / Quảng cáo",
        D_ai_error: "D. AI đánh giá sai",
        E_abuse_report: "E. Lạm dụng report",
        F_minor: "F. Vi phạm nhẹ",
        G_complex: "G. Phức tạp / Nhiều report",
        H_critical: "H. Nghiêm trọng - Hành động ngay",
    };
    for (const [key, count] of Object.entries(categoryCount)) {
        const bar = "█".repeat(count);
        console.log(`   ${catLabels[key]}: ${String(count).padStart(2)} bài  ${bar}`);
    }

    console.log("\n📋 Theo trạng thái report:");
    for (const [status, count] of Object.entries(statusCount)) {
        const icon = status === "RESOLVED" ? "✅" : status === "DISMISSED" ? "🚫" : "⏳";
        console.log(`   ${icon} ${status}: ${count} report`);
    }

    console.log(`
🎉 ===== SEED BÁO CÁO HOÀN THÀNH =====
   📝 Posts được tạo  : ${totalPosts}
   🚨 Tổng reports    : ${totalReports}
   📊 TB report/post  : ${(totalReports / totalPosts).toFixed(1)}
   🤖 Có AI note      : ${SCENARIOS.filter(s => s.reports.some(r => r.assistantNote)).length} posts
   🔴 isHidden=true   : ${SCENARIOS.filter(s => s.isHidden).length} posts
   ⚠️  isDisinfo=true  : ${SCENARIOS.filter(s => s.isDisinformation).length} posts
==========================================`);
}

// ─── ENTRY POINT ──────────────────────────────────────────────────────────────
seedReportedPosts()
    .catch(e => {
        console.error("\n❌ Seed thất bại:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());