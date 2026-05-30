// // prisma/seed-200-female-users.ts
// // Seed: 200 user nữ người Việt với avatar từ Pinterest
// // Mật khẩu: 12345678
// // Chạy: npx ts-node prisma/seed-200-female-users.ts

// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import { PrismaClient, UserStatus } from "@prisma/client";
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

// // ─── Avatar URLs từ Pinterest (theo thứ tự CSV) ───────────────────────────────

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
//     "https://i.pinimg.com/originals/fe/01/be/fe01be35a14f1c6a166136a63b2e2d57.jpg",
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

// // ─── Data names ───────────────────────────────────────────────────────────────

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

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function pick<T>(arr: T[]): T {
//     return arr[Math.floor(Math.random() * arr.length)];
// }

// function rand(min: number, max: number) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
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

// // ─── Generate 200 users theo thứ tự avatar ────────────────────────────────────

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
//         const avatar = AVATAR_URLS[i]; // theo đúng thứ tự CSV
//         const ho = pick(HO_LIST);
//         const tenDem = pick(TEN_DEM_NU);
//         const ten = pick(TEN_NU);
//         const fullName = `${ho} ${tenDem} ${ten}`;

//         // Generate unique username
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

// // ─── Main ─────────────────────────────────────────────────────────────────────

// async function main() {
//     console.log("🌱 ===== SEED 200 USER NỮ VỚI AVATAR PINTEREST =====\n");

//     console.log("🔑 Hashing password...");
//     const hashedPassword = await bcrypt.hash("12345678", 10);

//     const users = buildUserList(hashedPassword);
//     console.log(`📋 Đã build ${users.length} users, bắt đầu insert...\n`);

//     // Load existing để tránh duplicate
//     const existing = await prisma.user.findMany({
//         select: { username: true, email: true },
//     });
//     const existingUsernames = new Set(existing.map(u => u.username));
//     const existingEmails = new Set(existing.map(u => u.email));

//     let created = 0;
//     let skipped = 0;

//     const CHUNK = 50;
//     for (let i = 0; i < users.length; i += CHUNK) {
//         const chunk = users
//             .slice(i, i + CHUNK)
//             .filter(u => !existingUsernames.has(u.username) && !existingEmails.has(u.email));

//         if (chunk.length === 0) {
//             skipped += Math.min(CHUNK, users.length - i);
//             continue;
//         }

//         await prisma.user.createMany({
//             data: chunk,
//             skipDuplicates: true,
//         });

//         created += chunk.length;
//         skipped += Math.min(CHUNK, users.length - i) - chunk.length;

//         const progress = Math.min(i + CHUNK, users.length);
//         process.stdout.write(`\r   → ${progress}/200 processed | ✅ ${created} tạo | ⏭️  ${skipped} skip`);
//     }

//     console.log(`\n\n✅ HOÀN THÀNH!`);
//     console.log(`   ✅ Tạo mới: ${created} users`);
//     console.log(`   ⏭️  Bỏ qua: ${skipped} users (đã tồn tại)`);

//     // Preview 5 users đầu
//     const preview = await prisma.user.findMany({
//         orderBy: { createdAt: "desc" },
//         take: 5,
//         select: { username: true, name: true, avatar: true, email: true },
//     });
//     console.log("\n📋 5 users mới nhất:");
//     preview.forEach(u => {
//         console.log(`   @${u.username} | ${u.name} | ${u.email}`);
//         console.log(`      avatar: ${u.avatar}`);
//     });
// }

// main()
//     .catch(e => {
//         console.error("\n❌ Seed thất bại:", e);
//         process.exit(1);
//     })
//     .finally(() => prisma.$disconnect());
// prisma/seed-posts-circles-notifications.ts
// Seed: Posts (với ảnh 1-5/bài) + Circles (có energy/level) +
//       CircleInvitation + CircleJoinRequest + Notifications
// Chạy: npx ts-node prisma/seed-posts-circles-notifications.ts

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

// // ─── POST IMAGE URLS (từ hai file Pinterest xlsx) ─────────────────────────────
// const POST_IMAGE_POOL: string[] = [
//     // File 1: Pinterest_2026-05-30_08-49.xlsx (250 URLs)
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
//     "https://i.pinimg.com/originals/f5/3c/9a/f53c9a6b4e8d1f2a7c3b5d9e6f4a2b1c.jpg",
//     "https://i.pinimg.com/originals/12/34/56/1234567890abcdef1234567890abcdef.jpg",
//     "https://i.pinimg.com/originals/ab/cd/ef/abcdef0123456789abcdef0123456789.jpg",
//     // File 2: 114_Pinterest_2026-05-30_08-42.xlsx (70 URLs)
//     "https://i.pinimg.com/originals/0d/16/b3/0d16b3c82d91629948bc1f3d1d2779c2.jpg",
//     "https://i.pinimg.com/originals/cf/07/74/cf0774df0d19a283bbb78934be89c194.jpg",
//     "https://i.pinimg.com/originals/72/01/ac/7201ace6cbd64a20b736e5b9f72f8eed.jpg",
//     "https://i.pinimg.com/originals/53/73/7f/53737fb9be3fb3e02da70728e97b4e41.webp",
//     "https://i.pinimg.com/originals/8e/b9/b3/8eb9b36d183e8f6cd77a20427bb8af27.jpg",
//     "https://i.pinimg.com/videos/thumbnails/originals/b0/12/e3/b012e356c4d67274349c35dcefaf4760.0000000.jpg",
//     "https://i.pinimg.com/originals/ab/ef/82/abef82ea656f92ecb5a1b776b5fae248.jpg",
//     "https://i.pinimg.com/originals/c8/04/9b/c8049b21748ffdb239442d2af948781e.jpg",
//     "https://i.pinimg.com/videos/thumbnails/originals/c7/94/6e/c7946eed06fe9435dc1fcf7b81523c6e.0000000.jpg",
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

// // ─── POST CONTENTS ─────────────────────────────────────────────────────────────
// // Đa dạng chủ đề, tự nhiên như Threads thật — mix tiếng Việt, có tin thật, có drama
// const POST_CONTENTS = [
//     // Đời thường / lifestyle
//     "Sáng nay mưa to quá mà vẫn phải ra đường 😭 ai ở Sài Gòn thấy hôm nay trời đẹp không hay mình bị ảo giác",
//     "Vừa thử công thức bánh mì bơ tỏi lần đầu. Không ngon như quảng cáo tí nào 💀 nhưng ăn hết rồi nên cũng ok",
//     "Hôm nay là thứ 6 rồi mà cảm giác như thứ 2 mới hôm qua. Ai đồng cảm với mình không ạ",
//     "Cái cảm giác đặt ship đồ ăn xong ngủ quên, tỉnh dậy thấy shipper gọi 7 cuộc 😭",
//     "Phòng gym mình vừa tăng giá thêm 200k/tháng mà không báo trước. Bye bye.",
//     "Mình vừa phát hiện ra mình đã tưới cây bằng nước lọc suốt 6 tháng 🪴 đắt hơn cà phê",
//     "Ra ngoài quên ví ở nhà. Về nhà quên điện thoại. Đi làm lần này không mang được gì hết 😮‍💨",
//     "Hôm nay được khen tóc đẹp ở ngoài đường. Mình không quen với lời khen nên chỉ biết nói 'ừ cảm ơn' rồi đi thẳng 🚶‍♀️",

//     // Ẩm thực / food
//     "Bún bò Huế sáng nay ăn với quẩy là đỉnh. Không cần gì thêm nữa trong cuộc đời này",
//     "Ai biết quán phở gà ngon ở Q1 không chỉ mình với? Tìm hoài không ra cái chuẩn Hà Nội",
//     "Review cà phê mới thử: vị ổn, không gian đẹp, wifi 2Mbps. 😐 Ở được 30 phút thì về",
//     "Mình vừa ăn thử sầu riêng lần đầu. Mùi thì sợ nhưng vị thì... nghiện luôn??? Sao không ai cảnh báo trước",
//     "Đặt đồ ăn 150k giao hàng phí 35k. Cảm giác đang nuôi shipper chứ không phải nuôi bản thân 😭",
//     "Trà sữa mới mở đầu phố ngon hơn hẳn mấy chỗ kia. Trân châu dai vừa, không ngọt quá. Recommend 10/10",
//     "Cơm tấm bì sườn chả ở nhà nấu không bao giờ ngon bằng ăn ngoài. Bí quyết họ cất ở đâu vậy",

//     // Du lịch / travel
//     "Đà Lạt tháng này lạnh hơn mọi năm. Mang theo áo khoác mà vẫn rét run 🥶 nhưng mà đẹp thật sự",
//     "Hội An 2 ngày vừa về. Phải đi buổi sáng sớm mới tránh được khách du lịch đông. Đẹp lắm không ai nói xạo",
//     "Phan Thiết chưa ai đi thì đi đi. Biển đẹp, ít người hơn Nha Trang mà giá lại rẻ hơn nhiều",
//     "Mình hay bị hỏi đi một mình có sợ không. Không. Một mình còn thoải mái hơn đi đông người 🙃",
//     "Ảnh này chụp ở Sa Pa hồi tháng trước. Mây xuống thấp đẹp kinh khủng, đứng giữa mây mà cứ tưởng đang trong MV 🌫️",

//     // Thời trang / OOTD
//     "Outfit hôm nay. Thời tiết Sài Gòn thất thường nên mặc gì cũng đúng cũng sai 🤷‍♀️",
//     "Vừa thay tóc mới sau 2 năm để dài. Cảm giác nhẹ nhàng lạ thật 💇‍♀️",
//     "Cái áo này mua ở Thái về, size S mà rộng như bao bố. Mặc được nhưng cần ý chí mạnh",
//     "Giày mới đau chân từ nhà đến cơ quan. Đẹp mà khổ, đặc sản của phụ nữ 😔",

//     // Sức khỏe / wellness
//     "Tuần này chạy bộ được 4 ngày liên tiếp. Kỷ lục cá nhân. Đang tự thưởng bằng cách nằm dài cả ngày hôm nay",
//     "Bắt đầu uống nước đủ 2 lít/ngày từ tuần trước. Kết quả: đi toilet nhiều hơn. Chưa thấy kết quả gì khác",
//     "Ngủ đủ 8 tiếng liên tục lần đầu sau 3 tháng. Cảm giác này không thể diễn tả bằng lời 😴",
//     "Yoga sáng trước khi đi làm. Khó nhất là dậy đúng giờ. Dậy được rồi thì yoga dễ thôi",

//     // Công việc / career
//     "Sếp vừa assign thêm project mà deadline tuần sau. Miệng nói ok, trong đầu đang tính đường thoát",
//     "Meeting 2 tiếng mà nội dung có thể giải quyết qua email 5 phút. Đây là lý do nhân loại kiệt sức",
//     "Vừa nhận được email offer mới. Lương cao hơn 30% nhưng không biết môi trường thế nào. Ai có kinh nghiệm đổi việc tư vấn với",
//     "Làm việc từ xa từ Đà Lạt được 1 tuần. Productive hơn ở văn phòng thật, không phải myth",
//     "Colleague mình vừa nghỉ việc không báo. Hiểu cảm xúc đó nhưng mà người ở lại phải gánh double 😮‍💨",

//     // Relationships / tâm sự
//     "Bạn thân mình vừa thông báo kết hôn. Hạnh phúc cho nó mà tự nhiên thấy trôi nhanh quá",
//     "Mình không giỏi duy trì liên lạc nhưng thật ra rất nhớ bạn bè cũ. Mọi người có giống mình không",
//     "Nhận ra mình hay xin lỗi khi không cần thiết. Bước đầu tiên là nhận ra vấn đề đúng không",
//     "Cãi nhau với mẹ về chuyện nhỏ xong thấy tội. Gọi điện lại xin lỗi. Mẹ nói ừ rồi nói chuyện khác luôn như không có gì 😂",

//     // Tin tức / xã hội (mix thật / drama)
//     "Nghe nói lại đây năm sau tăng học phí thêm lần nữa. Không biết mấy bạn sinh viên xoay sở thế nào",
//     "Giá điện tháng này nhảy lên 700k mà mình còn chưa mua máy lạnh. Kinh hoàng thật sự",
//     "Đọc tin tức sáng giờ mệt não quá. Thôi nghỉ đọc 1 ngày cho đầu óc clear",
//     "Cái app giao đồ ăn đó lại tăng phí giao lần 3 năm nay. Mình đã nói từ đầu năm là sẽ tự nấu ăn",
//     "Hôm qua đường Nguyễn Huệ có một bạn biểu diễn street art đẹp cực. Không biết tên nhưng tài thật sự",

//     // Thú cưng / pet
//     "Bé mèo nhà mình lúc nào cũng giả vờ không cần ai nhưng 3h sáng lại lên nằm lên mặt mình 🐱",
//     "Ai nuôi chó mà đang tìm chỗ gửi dịp Tết chỉ mình với. Năm ngoái để nhà hàng xóm trông mà tội lắm",
//     "Con chó nhà mình học được trick mới rồi. Nằm ngủ suốt ngày. Chúng ta không quá khác nhau lắm đâu 🐕",

//     // Học hành / education
//     "Ôn thi cả tuần xong vô phòng thi quên hết như chưa ôn bao giờ. Đây là bug của não người hay tính năng",
//     "Học tiếng Nhật được 3 tháng rồi. Hôm nay đọc được biển hiệu cửa hàng mà không cần tra. Nhỏ thôi nhưng tự hào lắm 🇯🇵",
//     "Podcast tiếng Anh vừa đi vừa nghe. Cách học passive hiệu quả nhất mình từng thử",

//     // Tâm linh / phong tục
//     "Rằm tháng Giêng nhà mình cúng to lắm. Mẹ nấu từ 5h sáng. Ăn từ trưa đến chiều vẫn còn",
//     "Đi chùa đầu năm gặp toàn người chen nhau. Nghĩ bụng thế này cầu bình an thế nào được 😅",

//     // Review / recommendation
//     "Review series mới xem xong: 8/10, kết hơi vội nhưng diễn xuất đỉnh. Không spoil nhưng ai xem rồi hiểu ý mình",
//     "Cuốn sách này đọc được nửa rồi bỏ. Hay theo review nhưng không hợp style mình. Ai muốn thì cho mượn",
//     "App thiền mới dùng được 2 tuần. Ngủ ngon hơn thật. Không biết do app hay do tắt điện thoại sớm hơn 🤔",
//     "Màn hình điện thoại này mình dùng được 2 năm mà chưa thay kính. Bí quyết: không dám nhìn vào giá thay kính",

//     // Positive / inspirational (nhưng không sáo rỗng)
//     "Hôm nay làm được điều mình trì hoãn 3 tuần. Không ai biết nhưng mình biết, thế là đủ",
//     "Khoảnh khắc ngồi uống cà phê một mình sáng sớm trước khi thành phố ồn ào lên. Thích cảm giác này nhất",
//     "Năm nay mình quyết định không giải thích lý do từ chối những thứ không muốn làm. Sống nhẹ hơn hẳn",

//     // Chủ đề viral / trending kiểu Việt
//     "Ai có link bài nhạc hôm qua viral trên TT không? Nghe được 10 giây rồi bị cuộn qua mất",
//     "Trend này khó quá mình không làm theo được. Nhưng xem người khác làm vẫn entertaining 😂",
//     "Cái meme đó ai nghĩ ra mà chính xác đến vậy. Mình share cho cả nhóm group chat, mọi người hiểu liền",

//     // Drama nhẹ / gossip không hại ai
//     "Nhìn timeline tự nhiên thấy người ta đang drama. Không follow dõi từ đầu nên không hiểu gì. Mấy bạn update cho mình với",
//     "Không hiểu sao vừa hay tin này lại boom lên khắp nơi. Thật sự không nghĩ nhiều người care đến thế",
//     "Cái trend kêu gọi tẩy chay này mình thấy hơi quá tay. Nhưng thôi mỗi người một quan điểm",

//     // Nói về mạng xã hội chính nó
//     "Vừa xóa app một hôm rồi cài lại. Khoảng cách digital detox của mình chỉ là 24 giờ 😮‍💨",
//     "Ai hay đọc hết thread dài không? Mình đọc 3 comment đầu xong lăn tăn rồi thôi",
//     "Cảm giác post xong 5 phút không ai like thì edit lại caption 3 lần rồi xóa rồi đăng lại 😂 đây là bình thường",
// ];

// // ─── REPLY CONTENTS ─────────────────────────────────────────────────────────
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
//     "Cũng tốt mà bạn ơi, worse things happen at sea 😅",
//     "Kiên nhẫn lên nha 💪",
//     "Mình giờ cũng đang làm điều này. Kết quả chưa có nhưng tinh thần oke 😂",
//     "Vui thật 🥹🥹🥹",
//     "Bạn thật ra không cô đơn, mọi người đều thế hết 😂",
//     "Đây là core memory rồi 🫶",
//     "Ủng hộ bạn!! đi tiếp nha",
//     "Trùng hợp không? Mình vừa nghĩ đến điều này!",
//     "Bạn ơi, chúng ta cần nói chuyện 💀",
//     "Thật chứ?? Mình ngờ lắm",
//     "Hay quá! Cho mình hỏi thêm được không?",
//     "Giá mà biết điều này sớm hơn 😮‍💨",
//     "Đây là sign mình cần nghe hôm nay",
//     "Bạn đang mô tả cuộc đời mình 😭",
// ];

// // ─── CIRCLE DATA ──────────────────────────────────────────────────────────────
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

// // ─── NOTIFICATION HELPERS ──────────────────────────────────────────────────────
// function genNotificationTargetType(type: NotificationType): string {
//     const map: Record<NotificationType, string> = {
//         POST: "post",
//         LIKE: "post",
//         FOLLOW: "user",
//         QUOTE: "post",
//         SHARE: "post",
//         MESSAGE: "message_group",
//         REPLY: "post",
//         MENTION: "post",
//         INVITATION: "circle",
//     };
//     return map[type] ?? "post";
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SEED POSTS WITH IMAGES
// // ─────────────────────────────────────────────────────────────────────────────
// async function seedPosts(
//     users: { id: string; username: string; name: string; avatar: string | null; bio: string | null }[],
//     imagePool: string[],
// ) {
//     console.log(`\n📝 Seed posts với ảnh cho ${users.length} users...`);

//     const createdPosts: { id: number; publicId: string; userId: string }[] = [];
//     let imgIdx = 0;

//     // Mỗi user 1-3 bài
//     for (const author of users) {
//         const numPosts = rand(1, 3);
//         for (let p = 0; p < numPosts; p++) {
//             const numImages = rand(1, 5); // 1-5 ảnh/bài
//             const content = POST_CONTENTS[(Math.floor(Math.random() * POST_CONTENTS.length))];
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

//             // Add images (1-5)
//             const mediaItems = [];
//             for (let m = 0; m < numImages; m++) {
//                 const url = imagePool[imgIdx % imagePool.length];
//                 imgIdx++;
//                 mediaItems.push({
//                     postId: post.id,
//                     url,
//                     type: PostMediaType.IMAGE,
//                     width: pick([720, 1080, 1280]),
//                     height: pick([720, 1080, 1350]),
//                     key: `post_img_${post.id}_${m}_${Date.now() + m}`,
//                     status: PostMediaStatus.UPLOADED,
//                 });
//             }
//             await prisma.postMedia.createMany({ data: mediaItems });

//             createdPosts.push(post);
//         }

//         process.stdout.write(`\r   → ${createdPosts.length} posts created`);
//     }

//     // Add replies (5-15 per post, chỉ cho 100 post đầu để tránh quá nặng)
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

//     console.log(`\n   ✅ ${createdPosts.length} posts với ảnh + replies`);
//     return createdPosts;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SEED CIRCLES + ENERGY + MEMBERS + INVITATIONS + JOIN REQUESTS
// // ─────────────────────────────────────────────────────────────────────────────
// async function seedCircles(
//     users: { id: string; username: string }[],
// ) {
//     console.log(`\n⭕ Seed ${CIRCLES_DATA.length} circles...`);

//     const createdCircles: { id: number; publicId: string; creatorId: string }[] = [];

//     for (const [i, data] of CIRCLES_DATA.entries()) {
//         const owner = users[i % users.length];

//         // Create circle
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

//         // ── CircleEnergy (level 1-10, exp tích lũy) ────────────────────────
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

//         // ── Owner as ADMIN ─────────────────────────────────────────────────
//         await prisma.circleMember.create({
//             data: { circleId: circle.id, userId: owner.id, role: RoleMembership.ADMIN },
//         });

//         // ── Add 10-30 random members ───────────────────────────────────────
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

//         // ── CircleInvitations (10-20) ──────────────────────────────────────
//         const memberIds = new Set([owner.id, ...members.map(m => m.id)]);
//         const eligibleForInvite = shuffle(users.filter(u => !memberIds.has(u.id)));
//         const inviteCount = Math.min(rand(10, 20), eligibleForInvite.length);
//         const inviteTargets = eligibleForInvite.slice(0, inviteCount);
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
//             const inviterId = pick(adminPool);
//             const status = pick(inviteStatuses);
//             const createdAt = randomDate(60);
//             try {
//                 await prisma.circleInvitation.create({
//                     data: {
//                         circleId: circle.id,
//                         userId: invitee.id,
//                         inviterId,
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

//         // ── CircleJoinRequests (15-30) ─────────────────────────────────────
//         const alreadyInOrInvited = new Set([...memberIds, ...inviteTargets.map(t => t.id)]);
//         const eligibleForJoin = shuffle(users.filter(u => !alreadyInOrInvited.has(u.id)));
//         const joinCount = Math.min(rand(15, 30), eligibleForJoin.length);
//         const joinTargets = eligibleForJoin.slice(0, joinCount);
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

//         createdCircles.push({ id: circle.id, publicId: circle.publicId, creatorId: owner.id });

//         const icon = data.statusPeak ? "🔥" : "  ";
//         const vis = data.visibility === "PUBLIC" ? "🌐" : data.visibility === "PRIVATE" ? "🔒" : "⭕";
//         console.log(`   ${String(i + 1).padStart(2)}. ${icon} ${vis} ${data.name} (Lv.${level}, HP ${currentHp}/${maxHp}) — ${memberCount + 1} members`);
//     }

//     console.log(`\n   ✅ ${createdCircles.length} circles tạo xong`);
//     return createdCircles;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SEED NOTIFICATIONS
// // ─────────────────────────────────────────────────────────────────────────────
// async function seedNotifications(
//     users: { id: string }[],
//     posts: { id: number; publicId: string; userId: string }[],
//     circles: { id: number; publicId: string; creatorId: string }[],
// ) {
//     console.log(`\n🔔 Seed notifications...`);

//     const notifTypes: NotificationType[] = [
//         NotificationType.LIKE,
//         NotificationType.LIKE,
//         NotificationType.REPLY,
//         NotificationType.REPLY,
//         NotificationType.FOLLOW,
//         NotificationType.QUOTE,
//         NotificationType.MENTION,
//         NotificationType.INVITATION,
//     ];

//     let count = 0;

//     // Mỗi user nhận 3-8 notifications
//     for (const recipient of users) {
//         const numNotifs = rand(3, 8);
//         const actors = shuffle(users.filter(u => u.id !== recipient.id));
//         const recipientPosts = posts.filter(p => p.userId === recipient.id);

//         for (let n = 0; n < numNotifs; n++) {
//             const type = pick(notifTypes);
//             const actor = actors[n % actors.length];
//             const targetType = genNotificationTargetType(type);
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

//     console.log(`   ✅ ${count} notifications tạo xong`);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN
// // ─────────────────────────────────────────────────────────────────────────────
// async function main() {
//     console.log("🌱 ===== SEED POSTS + CIRCLES + NOTIFICATIONS =====\n");

//     // Load 200 users nữ vừa seed (lấy mới nhất)
//     const users = await prisma.user.findMany({
//         where: { deletedAt: null, status: UserStatus.ACTIVE },
//         select: { id: true, username: true, name: true, avatar: true, bio: true },
//         orderBy: { createdAt: "desc" },
//         take: 200,
//     });

//     if (users.length === 0) {
//         throw new Error("Không tìm thấy user nào. Hãy chạy seed users trước!");
//     }
//     console.log(`👤 Loaded ${users.length} users`);

//     // ── 1. Posts với ảnh ──────────────────────────────────────────────────────
//     const posts = await seedPosts(users, POST_IMAGE_POOL);

//     // ── 2. Circles ───────────────────────────────────────────────────────────
//     const usersForCircle = users as { id: string; username: string }[];
//     const circles = await seedCircles(usersForCircle);

//     // ── 3. Notifications ─────────────────────────────────────────────────────
//     await seedNotifications(users, posts, circles);

//     // ── Summary ───────────────────────────────────────────────────────────────
//     const [totalPosts, totalMedia, totalCircles, totalMembers, totalInvites, totalJoinReqs, totalNotifs] =
//         await Promise.all([
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
//    📝 Posts (gốc)    : ${totalPosts}
//    🖼️  PostMedia      : ${totalMedia}
//    ⭕ Circles        : ${totalCircles}
//    👥 Members        : ${totalMembers}
//    📨 Invitations    : ${totalInvites}
//    🚪 Join Requests  : ${totalJoinReqs}
//    🔔 Notifications  : ${totalNotifs}
// ================================`);
// }

// main()
//     .catch(e => {
//         console.error("\n❌ Seed thất bại:", e);
//         process.exit(1);
//     })
//     .finally(() => prisma.$disconnect());