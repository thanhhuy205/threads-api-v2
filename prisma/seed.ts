import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
    PostMediaStatus,
    PostMediaType,
    PostType,
    PrismaClient,
    ReplyPermission,
    RoleMembership,
    UserRoleType,
    UserStatus,
    Visibility,
    VisibilityPost,
} from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// ─── Prisma Setup ─────────────────────────────────────────────────────────────
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
function rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomDate(daysAgo: number): Date {
    return new Date(Date.now() - Math.random() * daysAgo * 86_400_000);
}
function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}
function slugify(str: string): string {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
}

// ─── Level Config ─────────────────────────────────────────────────────────────
// Level  Name      EXP needed  Max HP
// Lv.1   Newborn   0           500 HP
// Lv.2   Growing   200         650 HP
// Lv.3   Thriving  500         800 HP
// Lv.4   Veteran   1000        950 HP
// Lv.5   Legend    2000        1000 HP
const LEVEL_CONFIG: Record<number, { name: string; maxHp: number; minExp: number; maxExp: number }> = {
    1: { name: "Newborn", maxHp: 500, minExp: 0, maxExp: 199 },
    2: { name: "Growing", maxHp: 650, minExp: 200, maxExp: 499 },
    3: { name: "Thriving", maxHp: 800, minExp: 500, maxExp: 999 },
    4: { name: "Veteran", maxHp: 950, minExp: 1000, maxExp: 1999 },
    5: { name: "Legend", maxHp: 1000, minExp: 2000, maxExp: 5000 },
};

// ─── HP State ─────────────────────────────────────────────────────────────────
// HEALTHY : current >= 70% of max
// SICK    : current >= 50% of max
// DYING   : current >= 20% of max
// DEAD    : current = 0
type HpState = "healthy" | "sick" | "dying" | "dead";

function calcCurrentHp(maxHp: number, state: HpState): number {
    switch (state) {
        case "healthy": return rand(Math.ceil(maxHp * 0.70), maxHp);
        case "sick": return rand(Math.ceil(maxHp * 0.50), Math.ceil(maxHp * 0.69));
        case "dying": return rand(Math.ceil(maxHp * 0.20), Math.ceil(maxHp * 0.49));
        case "dead": return 0;
    }
}

// ─── Image Pools ──────────────────────────────────────────────────────────────
// 200 avatar URLs (from Pinterest scrape)
const AVATAR_URLS: string[] = [
    "https://i.pinimg.com/736x/4b/52/17/4b5217cd2ef0210bfc4544ceac1c1bbc.jpg",
    "https://i.pinimg.com/originals/fd/9a/24/fd9a2471393e259479cc54c5ef3ee424.jpg",
    "https://i.pinimg.com/originals/9a/d5/e5/9ad5e593f5383b2f94cb6bc9998d6b18.jpg",
    "https://i.pinimg.com/originals/49/01/19/490119ce28949550c11a0ee829ddd2ca.jpg",
    "https://i.pinimg.com/originals/0e/fb/89/0efb89566a95de572c4db984abdd30ca.jpg",
    "https://i.pinimg.com/originals/a6/3e/c8/a63ec83fc73b18a287886d5e485756ef.jpg",
    "https://i.pinimg.com/originals/60/9a/b5/609ab5b207a93c1ec4b49a4ab8f99584.jpg",
    "https://i.pinimg.com/originals/2d/f1/b3/2df1b36d5398d1490950a2ba8074763b.png",
    "https://i.pinimg.com/originals/c2/85/2d/c2852d4b19143eeae4a156028906d0e1.jpg",
    "https://i.pinimg.com/originals/e5/48/97/e54897c748011193a3c3a397cbb19ccf.jpg",
    "https://i.pinimg.com/originals/14/e3/16/14e31690d5a6ed781b47f217822a797b.jpg",
    "https://i.pinimg.com/originals/ed/f5/f2/edf5f26607778e31612f384437f8811e.jpg",
    "https://i.pinimg.com/originals/4d/c6/cb/4dc6cbf398e99c1be40cde9fed929640.jpg",
    "https://i.pinimg.com/originals/c2/0b/bc/c20bbc48e84301291609e8a91207bef7.jpg",
    "https://i.pinimg.com/originals/06/03/7e/06037edc2d963294cfa92ded3a759ce0.jpg",
    "https://i.pinimg.com/originals/af/d9/3d/afd93df49183a83128b76ecde1f731c9.jpg",
    "https://i.pinimg.com/originals/c7/01/de/c701de2216df92f4a116d1562fa3730a.jpg",
    "https://i.pinimg.com/originals/0b/32/f7/0b32f74b8e7c28e6bf964f1f1927c0fa.jpg",
    "https://i.pinimg.com/originals/7e/6c/e0/7e6ce0a8014b2e1deccf8c6aeb8d6756.jpg",
    "https://i.pinimg.com/originals/cb/b2/3f/cbb23f3c515c44b7f4d66ea07b350272.jpg",
    "https://i.pinimg.com/originals/99/d4/97/99d49754524361d3dafb12b0c2b19582.jpg",
    "https://i.pinimg.com/originals/a3/63/36/a363365a8a4d74e513ede4708cd3b2de.jpg",
    "https://i.pinimg.com/originals/c4/73/db/c473dbdb69710fd8ffe48472d0fdf84c.jpg",
    "https://i.pinimg.com/originals/d7/63/7f/d7637f00b073736c3471517785b521a4.jpg",
    "https://i.pinimg.com/originals/f0/62/ff/f062ff7e355e50b3ec29eaeddcc27928.jpg",
    "https://i.pinimg.com/originals/53/ac/fa/53acfa81cbfdb7bb47cf5b48e7c083ce.jpg",
    "https://i.pinimg.com/originals/a0/f4/e7/a0f4e73d80aff723bb49ea19123c871d.jpg",
    "https://i.pinimg.com/originals/e2/3c/46/e23c46bcfdaa1857f98a8f01a7a2348b.jpg",
    "https://i.pinimg.com/originals/6c/21/91/6c21915cc662cc2037716677e8c34008.jpg",
    "https://i.pinimg.com/originals/53/7b/6d/537b6d58d718f39aad656a526e7f910b.jpg",
    "https://i.pinimg.com/originals/cb/d0/29/cbd0298067d1cfa522039bd14f022c08.jpg",
    "https://i.pinimg.com/originals/29/85/bb/2985bb8c5852bd07373ffab1e834c99e.jpg",
    "https://i.pinimg.com/originals/44/8d/9d/448d9d176632bd94a82038ad027337bf.jpg",
    "https://i.pinimg.com/originals/92/e2/a9/92e2a9ac6a7d4abea6645b6c6345ec2d.jpg",
    "https://i.pinimg.com/originals/b1/33/80/b133806585d0cc1e1d2b122efb4e5c36.png",
    "https://i.pinimg.com/originals/50/67/22/506722eda209408a13e0d5f2e9fd983b.jpg",
    "https://i.pinimg.com/originals/ae/1d/fd/ae1dfd132903a095015da295f0a890c4.jpg",
    "https://i.pinimg.com/originals/5f/de/3f/5fde3f06ae18112275aa75da16d0a94d.jpg",
    "https://i.pinimg.com/originals/01/2d/76/012d76e4389aa9be0a5ef4f3a069d383.jpg",
    "https://i.pinimg.com/originals/90/76/2c/90762c6372a637f46e92964ccf720a9c.jpg",
    "https://i.pinimg.com/originals/6e/87/be/6e87be20104c44433248d05499c9c481.jpg",
    "https://i.pinimg.com/originals/cf/46/93/cf46937c2a405c5f595a0180a68b3167.jpg",
    "https://i.pinimg.com/originals/9c/c1/b1/9cc1b1f32f3006c8bc895517d709a958.jpg",
    "https://i.pinimg.com/originals/62/65/80/6265807beab7acda9ebe5a7aced328c3.jpg",
    "https://i.pinimg.com/originals/3e/0c/59/3e0c595aba74ae86c751d42ee6dec1f0.jpg",
    "https://i.pinimg.com/originals/5f/ea/e5/5feae5f47112fca8b59f0a274eb9e436.jpg",
    "https://i.pinimg.com/originals/10/bf/50/10bf50c4108c2d6501d4aaf27b29a151.jpg",
    "https://i.pinimg.com/originals/60/50/0c/60500c990d36df3c90c6b05e733c657f.jpg",
    "https://i.pinimg.com/originals/49/76/f5/4976f562b03cb8a5a1e582a2bdf3fd02.jpg",
    "https://i.pinimg.com/originals/c8/ad/79/c8ad7926a64fc5a46c084bdd34ab3bbc.jpg",
    "https://i.pinimg.com/originals/cf/00/c7/cf00c736bce0d80846024c04c9a04f5e.jpg",
    "https://i.pinimg.com/originals/b8/c4/df/b8c4df626023f5b7050d30a3f026b013.jpg",
    "https://i.pinimg.com/originals/b5/b8/1d/b5b81ddbd5f4f05ed85b0d93c3a0e946.jpg",
    "https://i.pinimg.com/originals/bc/d6/36/bcd6364fed40178adfe44bb2c82c4c50.jpg",
    "https://i.pinimg.com/originals/a8/51/bc/a851bc0757c7dce0949e9175815932cc.jpg",
    "https://i.pinimg.com/originals/ed/09/ec/ed09ec199bf3afa2547c185dd7dcaddd.jpg",
    "https://i.pinimg.com/originals/57/cb/01/57cb01921f8c6ecdfe8c1580119845a8.png",
    "https://i.pinimg.com/originals/75/ae/0f/75ae0f025f633160d72305a4dd33a2e3.jpg",
    "https://i.pinimg.com/originals/a1/29/7f/a1297f4955e77c479b1902b81fcc6243.jpg",
    "https://i.pinimg.com/originals/34/f2/ae/34f2ae7708b79c0f91ccda711010bd61.jpg",
    "https://i.pinimg.com/originals/d4/5a/71/d45a71229e0f1a4114f0e0cf15992415.jpg",
    "https://i.pinimg.com/originals/2e/86/fa/2e86fa9ad9260b873294a4b9ebb45faa.png",
    "https://i.pinimg.com/originals/d5/05/3e/d5053e99758bc630b919792cd39c9ca1.jpg",
    "https://i.pinimg.com/originals/07/7f/87/077f87715c25b535ddba9001a1f98429.jpg",
    "https://i.pinimg.com/originals/3e/dc/0a/3edc0a07715c0bb2f7e45fb407570f2b.jpg",
    "https://i.pinimg.com/originals/dc/50/b9/dc50b9a578e4327ea579617535ab75c4.jpg",
    "https://i.pinimg.com/originals/53/e8/d9/53e8d96308fee50019b6fe99c4a94d73.jpg",
    "https://i.pinimg.com/originals/83/46/5e/83465ec94c6c15a3cd59b30e24d265f4.jpg",
    "https://i.pinimg.com/originals/d7/f9/d7/d7f9d783a7c34617537d5a5e0ebe95eb.jpg",
    "https://i.pinimg.com/originals/e4/23/eb/e423eb25c19ab6d7e8f39f1e02acbecf.jpg",
    "https://i.pinimg.com/originals/f6/dc/63/f6dc63695c96e76e3a03ab74c393b2d3.jpg",
    "https://i.pinimg.com/originals/ca/0e/86/ca0e867c3691dc113cd75de82db13ce5.jpg",
    "https://i.pinimg.com/originals/21/a3/5a/21a35a8d7925d9afee888c96121d7cf0.jpg",
    "https://i.pinimg.com/originals/c7/d0/a2/c7d0a2d5242f97183bf8147bd7099233.jpg",
    "https://i.pinimg.com/originals/cd/9a/58/cd9a585465eccd7874588fd1c9a010cb.jpg",
    "https://i.pinimg.com/originals/cb/f9/fa/cbf9fad7ae19fd694018c5e7e4d849f7.jpg",
    "https://i.pinimg.com/originals/d9/f0/ec/d9f0ec44db68870e36aedf0e92a9de7f.jpg",
    "https://i.pinimg.com/originals/77/e9/5e/77e95ebe5fa1272f9be07562fd900349.jpg",
    "https://i.pinimg.com/originals/cb/de/1d/cbde1d3601b2d658d1b310d35b457b62.jpg",
    "https://i.pinimg.com/originals/0f/cb/1e/0fcb1e20666a084de1542c05e03f5e51.jpg",
    "https://i.pinimg.com/originals/1a/e4/18/1ae418409d649e5edabf137acc416b95.jpg",
    "https://i.pinimg.com/originals/81/02/9a/81029ad3a6be68405f8c361c8b5f7140.jpg",
    "https://i.pinimg.com/originals/73/38/75/733875868ac66e7574c48a9f8afef6dc.jpg",
    "https://i.pinimg.com/originals/61/b2/96/61b296d1ed09bf70d21de5431a82ce1d.jpg",
    "https://i.pinimg.com/originals/8b/7f/23/8b7f23c0daf37dc440e0cc27c6b8d208.jpg",
    "https://i.pinimg.com/originals/06/28/c7/0628c75650bce468ca2e4d028857b67a.jpg",
    "https://i.pinimg.com/originals/85/a7/7e/85a77e908aac4a4bd4a4c80772fffe26.jpg",
    "https://i.pinimg.com/originals/73/e5/af/73e5aff9443260bcbe460af627762439.jpg",
    "https://i.pinimg.com/originals/d8/10/4a/d8104a827a4fb0192536ba7b4d605142.jpg",
    "https://i.pinimg.com/originals/39/84/99/398499d08422c75850716e2d65ddc305.jpg",
    "https://i.pinimg.com/originals/e0/ee/59/e0ee59d69f3cb3a1a81fb06262ec2606.jpg",
    "https://i.pinimg.com/originals/87/d7/db/87d7dba2fa3cd6215c065ed8dd5aea3b.jpg",
    "https://i.pinimg.com/originals/e0/53/30/e05330022c4ce94f82d5986c3b9f12ee.png",
    "https://i.pinimg.com/originals/9f/a1/c1/9fa1c1aebc5ab33f8c1d45f3aca0d2eb.jpg",
    "https://i.pinimg.com/originals/de/36/43/de364397f80b8a93a4a26b5de91f395d.jpg",
    "https://i.pinimg.com/originals/da/70/23/da7023916ad9010fcbc78b23a60089c9.jpg",
    "https://i.pinimg.com/originals/ba/c7/b8/bac7b824d923ce84afc8b49f0326547c.png",
    "https://i.pinimg.com/originals/eb/8d/34/eb8d34c0980040671b95dd679baa9120.jpg",
    "https://i.pinimg.com/originals/07/40/87/0740873605334fd1ad8d86d563211678.png",
    "https://i.pinimg.com/originals/a1/c7/e8/a1c7e8e900c558f9dfa940646a82cc0b.jpg",
    "https://i.pinimg.com/originals/72/c0/3b/72c03bf554638897156ee36db104716e.jpg",
    "https://i.pinimg.com/originals/8c/93/1b/8c931b93443b1c1054b5292a276b3e09.jpg",
    "https://i.pinimg.com/originals/2c/6d/22/2c6d222e31d2050ffa1e9545c44c4d0d.jpg",
    "https://i.pinimg.com/originals/94/8c/4d/948c4ddc629e62d0ebdbe77cd079fc13.jpg",
    "https://i.pinimg.com/originals/62/d0/f9/62d0f96bc58b59a3c84d0ea759152800.jpg",
    "https://i.pinimg.com/originals/79/11/d4/7911d467213cde0faa2469c7940a6627.jpg",
    "https://i.pinimg.com/originals/4f/95/60/4f9560fe3059f6df5e458e54ba84499e.jpg",
    "https://i.pinimg.com/originals/c8/d0/2b/c8d02bb1978812e29a360efa8ce90958.jpg",
    "https://i.pinimg.com/originals/ad/b1/45/adb145baec3d10c864dab79a4c8a8709.jpg",
    "https://i.pinimg.com/originals/00/80/a3/0080a3eb3b7f009dc00ef271bb0100a9.jpg",
    "https://i.pinimg.com/originals/67/a4/64/67a464b406dbffd833da5a5ed868f390.jpg",
    "https://i.pinimg.com/originals/88/7a/0a/887a0a6331670108e444c684920b6893.png",
    "https://i.pinimg.com/originals/36/f0/43/36f043e2a08eaf5314993526d5901887.jpg",
    "https://i.pinimg.com/originals/38/83/f1/3883f19d3fc2829e13a78430b27d8fce.jpg",
    "https://i.pinimg.com/originals/02/60/ba/0260bae5ad75c069af2370aa019f7fb8.jpg",
    "https://i.pinimg.com/originals/ba/a9/fe/baa9fea0881478e009928af2283e89c4.jpg",
    "https://i.pinimg.com/originals/29/5b/44/295b4420dda169b77d1b039924beccee.jpg",
    "https://i.pinimg.com/originals/1e/12/a8/1e12a8a8cce11ab00d1416cb30bcfa7d.jpg",
    "https://i.pinimg.com/originals/10/df/25/10df255ee0a20eaa44027edae1cc0910.jpg",
    "https://i.pinimg.com/originals/e5/8c/ec/e58cecad05bace750e0dc4840a8f2fd4.jpg",
    "https://i.pinimg.com/originals/c5/4c/38/c54c384e75859354294ca1852310fe3a.jpg",
    "https://i.pinimg.com/originals/ad/f0/48/adf0482ce588c9b33c80a38f59fafb80.jpg",
    "https://i.pinimg.com/originals/86/b1/89/86b18988f53d0b94126c3d44cc6a6a69.jpg",
    "https://i.pinimg.com/originals/64/38/fe/6438fe5d71ff1a38975ce1da65905c99.jpg",
    "https://i.pinimg.com/originals/a8/b8/66/a8b866b771a8dc910514a1249f6d1a1b.jpg",
    "https://i.pinimg.com/originals/e6/0c/25/e60c2561e5ef78fd6bcfca019d99f53e.webp",
    "https://i.pinimg.com/originals/ee/46/9c/ee469cca0a2270a3bd80075b05541671.jpg",
    "https://i.pinimg.com/originals/89/fa/1f/89fa1fd180b8ff19ee9e0ba2bda67f02.jpg",
    "https://i.pinimg.com/originals/b1/d5/a7/b1d5a750fb5a0ddf2a8a9f2621eb0f5e.jpg",
    "https://i.pinimg.com/originals/58/b2/44/58b2447a9a1aa214646edba3576a5bcc.jpg",
    "https://i.pinimg.com/originals/90/be/7a/90be7a95fac6196153546ad8be69b956.jpg",
    "https://i.pinimg.com/originals/e5/c7/a0/e5c7a0c3b338852f7e69a380d6175907.jpg",
    "https://i.pinimg.com/originals/3a/a4/56/3aa4567f19b5ec556b3f85fd4d61cd18.jpg",
    "https://i.pinimg.com/originals/7b/a7/19/7ba7190465a36c59964323ad06300a4b.jpg",
    "https://i.pinimg.com/originals/90/ea/29/90ea29e6f001aed4cd1738b3dc1f955a.jpg",
    "https://i.pinimg.com/originals/bf/e7/02/bfe702bdfbd7bd0360e36e9701ef14a4.jpg",
    "https://i.pinimg.com/originals/d0/ac/96/d0ac96b48ff7f2ea14d09d9ebc6a07ef.jpg",
    "https://i.pinimg.com/originals/1b/37/c7/1b37c7774b97cfa9735bba403f5ab1c4.jpg",
    "https://i.pinimg.com/originals/e7/c5/67/e7c567f92a261fb4caa064f1cc7ae107.jpg",
    "https://i.pinimg.com/originals/f4/3d/8d/f43d8d5b801a263e782637c34c66c6a9.jpg",
    "https://i.pinimg.com/originals/f0/59/9c/f0599c51d62cf166da3effdfb071d39f.jpg",
    "https://i.pinimg.com/originals/92/c8/1a/92c81a0099d8172e1787c7ee509d4856.jpg",
    "https://i.pinimg.com/originals/8b/75/b8/8b75b8653546bffe777f39f95a2505a3.jpg",
    "https://i.pinimg.com/originals/58/23/d3/5823d3d463fecc9c639f76b19fbabf58.jpg",
    "https://i.pinimg.com/originals/4e/0e/83/4e0e83b0d03e9874d1e9c9cdcddf0b37.jpg",
    "https://i.pinimg.com/originals/fc/d3/de/fcd3de55cfe042d4355d6afe3c7f9c1c.jpg",
    "https://i.pinimg.com/originals/cc/65/f8/cc65f8e09c9d7119df056efc168fe7a9.jpg",
    "https://i.pinimg.com/originals/3e/e3/92/3ee3921c980f0a30b82c7bbab41168e4.jpg",
    "https://i.pinimg.com/originals/1a/c1/f9/1ac1f9a0dad33cc1c9c66fa45ea78072.jpg",
    "https://i.pinimg.com/originals/82/c2/bc/82c2bce5d889d72f0ffbdc95c1c48ec4.jpg",
    "https://i.pinimg.com/originals/b4/3c/51/b43c51991359caa17abc715c485c786a.png",
    "https://i.pinimg.com/originals/9b/12/d3/9b12d393236864f317b1101b9da76d64.jpg",
    "https://i.pinimg.com/originals/97/ae/72/97ae7286257ae93551bbc36cef63ceb0.jpg",
    "https://i.pinimg.com/originals/f5/c0/b7/f5c0b74fe625c80c9fdc73106fd8c08e.jpg",
    "https://i.pinimg.com/originals/1e/5d/5c/1e5d5cfe02625c60826031e8352f55c8.jpg",
    "https://i.pinimg.com/originals/69/47/2b/69472bc2bc4757bc5f8afd5c4eebbb09.jpg",
    "https://i.pinimg.com/originals/cb/28/5a/cb285a09d290d5995bd3a346cc1ee794.jpg",
    "https://i.pinimg.com/originals/d5/66/37/d56637fb11baedffeb6bf172aa074d80.jpg",
    "https://i.pinimg.com/originals/39/54/f1/3954f107ece8797c62cdd34b513fc99c.jpg",
    "https://i.pinimg.com/originals/59/6c/14/596c143e1b81b16cfa6e8102c1d7612c.jpg",
    "https://i.pinimg.com/originals/71/39/20/713920a011b2ed67482832c9488310b1.png",
    "https://i.pinimg.com/originals/e9/8c/f8/e98cf8872d7eb308dc799f1f54877f6f.jpg",
    "https://i.pinimg.com/originals/77/b5/db/77b5db5d22783940472094cd2e45d422.jpg",
    "https://i.pinimg.com/originals/55/f3/13/55f313b894f8fa3aafdab0a635be6cbe.jpg",
    "https://i.pinimg.com/originals/fa/75/09/fa75092d3127966021bf75808b7a072f.jpg",
    "https://i.pinimg.com/originals/96/cf/5e/96cf5e0872d78618512252ab651b4b38.jpg",
    "https://i.pinimg.com/originals/cb/29/99/cb299919a5b6c8d2bad0772b1dea4a0b.jpg",
    "https://i.pinimg.com/originals/23/41/2a/23412acc55745437b1c269466bec2898.jpg",
    "https://i.pinimg.com/originals/37/c5/4e/37c54e02284a60392c13b2491c0fa6ef.jpg",
    "https://i.pinimg.com/originals/17/f7/05/17f7055fb7f747ed3c325aebe9a65aa0.jpg",
    "https://i.pinimg.com/originals/21/bf/7b/21bf7bd329b52839df34e8e730cb6bd4.jpg",
    "https://i.pinimg.com/originals/0a/d1/01/0ad10190590d22597a37d1640136d529.jpg",
    "https://i.pinimg.com/originals/2a/4e/1a/2a4e1adf8445f5fb5bd59fd83387edd8.jpg",
    "https://i.pinimg.com/originals/fe/f8/bf/fef8bf8349d2032de749310ba4254dbf.jpg",
    "https://i.pinimg.com/originals/66/e3/ef/66e3ef99eda2870a932697c1e30ac09d.jpg",
    "https://i.pinimg.com/originals/8e/28/ff/8e28ff90f42516a9eee71f2d2dfb37e6.jpg",
    "https://i.pinimg.com/originals/ee/fb/ab/eefbaba3181416366336e4acfe1a411e.jpg",
    "https://i.pinimg.com/originals/2f/db/a8/2fdba8971d0fbc16031271cc76f725a0.jpg",
    "https://i.pinimg.com/originals/1f/71/18/1f71183aa53c60d3b5fa966b0fe7d777.jpg",
    "https://i.pinimg.com/originals/ec/92/50/ec92505f132c02a3987e2785e6569c01.jpg",
    "https://i.pinimg.com/originals/d1/7e/59/d17e59f6238a7eb2fcfee590dd29d98e.jpg",
    "https://i.pinimg.com/originals/e3/9e/12/e39e12e6f345dab722eb1fc28047b890.jpg",
    "https://i.pinimg.com/originals/e9/12/a4/e912a4a8a26fdb9ec5793d4fe4b40ea9.jpg",
    "https://i.pinimg.com/originals/ca/28/a9/ca28a9ab84850f856aaedc400fa4c85c.jpg",
    "https://i.pinimg.com/originals/02/c6/a2/02c6a2c68d7cbea5866b2d5b658c92c3.jpg",
    "https://i.pinimg.com/originals/99/66/5b/99665b30c5923088c54fbd60f7f28b96.jpg",
    "https://i.pinimg.com/originals/30/c0/fa/30c0faecbee9de9fa962698e3614921a.jpg",
    "https://i.pinimg.com/originals/0e/bb/92/0ebb9256cbfb705ae792c965c5032486.jpg",
    "https://i.pinimg.com/originals/c3/2f/1c/c32f1c94adba3ed579677176b734aef5.jpg",
    "https://i.pinimg.com/originals/47/01/70/4701708aaff706347b1c7ab18f73a7fa.jpg",
    "https://i.pinimg.com/originals/95/9e/0d/959e0d08575817859817fb4dc230a0e2.jpg",
    "https://i.pinimg.com/originals/18/f6/9e/18f69e8451941a66b76e80d4bf2e5cfe.jpg",
    "https://i.pinimg.com/originals/86/7f/8f/867f8fe67e0eaf44bf0fdc23f3b09587.jpg",
    "https://i.pinimg.com/originals/f3/1e/c8/f31ec860d7b6d8a84f139dccf181e9c3.jpg",
    "https://i.pinimg.com/originals/f3/ae/73/f3ae73452363dafac5a8263e0bc917b8.jpg",
    "https://i.pinimg.com/originals/59/a5/1f/59a51f9c9f9c414dc8d5e7467eca60e3.jpg",
    "https://i.pinimg.com/originals/da/b4/83/dab48347d8af030b11a67200cf53b269.jpg",
    "https://i.pinimg.com/originals/99/2d/ec/992dec77fe0888df93c67c82e26b8237.jpg",
    "https://i.pinimg.com/originals/35/97/c4/3597c4a1f52a3f5f24bfd2d1d4d755e6.jpg",
    "https://i.pinimg.com/originals/b3/58/1e/b3581e7b1725acc491189cfa3f40cae7.jpg",
];

// 384 post image URLs (from Pinterest scrape)
const POST_IMAGE_POOL: string[] = [
    "https://i.pinimg.com/originals/ae/19/03/ae19036a6f218c4ee806f9484e8f8bc7.jpg",
    "https://i.pinimg.com/originals/1c/6e/ad/1c6ead48da71e94d15b2e7fc720772bb.jpg",
    "https://i.pinimg.com/originals/f2/97/5b/f2975b617cbbe8aa1ff1fa8260dfa08c.jpg",
    "https://i.pinimg.com/originals/d1/e3/f1/d1e3f1b29aa7d2378feb6cb5f35a612a.jpg",
    "https://i.pinimg.com/originals/2f/a4/21/2fa42164b6645ae188f65b7b2c860a58.jpg",
    "https://i.pinimg.com/originals/cc/2e/80/cc2e80aaea0744b78a2d1b5f540df4de.jpg",
    "https://i.pinimg.com/originals/d2/bc/5f/d2bc5f6cda8307394ec973ecbe3abd7f.jpg",
    "https://i.pinimg.com/originals/43/b3/09/43b309faea1d5c10a314416ce781df85.jpg",
    "https://i.pinimg.com/originals/d0/0e/48/d00e48167fe543568e48fb8de0ab0f80.jpg",
    "https://i.pinimg.com/originals/37/23/b4/3723b4b86d094380006c943e97a4e7b7.jpg",
    "https://i.pinimg.com/originals/7d/2e/3b/7d2e3bbb19e19272999c87e0e27c5a8f.jpg",
    "https://i.pinimg.com/originals/bc/37/d1/bc37d15cea46f2fc4779467eacd57056.jpg",
    "https://i.pinimg.com/originals/b7/9d/17/b79d171d8c87987eb55eb23bad7a55e8.jpg",
    "https://i.pinimg.com/originals/e8/28/c1/e828c1db9eefe800f0b1574a5be37a1c.jpg",
    "https://i.pinimg.com/originals/55/6e/14/556e14eb303ea2e511026a0a07a39352.jpg",
    "https://i.pinimg.com/originals/a7/16/25/a71625dd5e77b47870877105f52caa8a.jpg",
    "https://i.pinimg.com/originals/c4/86/e4/c486e4134e8f34fa1be2697be9ac370d.jpg",
    "https://i.pinimg.com/originals/0e/83/20/0e83209912fcf0b0ddc39abfeb30b748.jpg",
    "https://i.pinimg.com/originals/f5/6b/c1/f56bc117f5229c0bc48aa2aa127cb261.jpg",
    "https://i.pinimg.com/originals/26/1a/ea/261aeae9a0954118705912f3edc1fa2a.jpg",
    "https://i.pinimg.com/originals/57/2a/00/572a003324ff394f2759a66bcd9ca8be.jpg",
    "https://i.pinimg.com/originals/27/95/16/27951626cf0d26d8968570bb4a4c0e4d.jpg",
    "https://i.pinimg.com/originals/83/ea/09/83ea093666a58ce5af07e5091a792c49.jpg",
    "https://i.pinimg.com/originals/4c/d3/98/4cd398d4bb2c495f27be4752bf14c19f.jpg",
    "https://i.pinimg.com/originals/9f/d8/54/9fd8542fa6e5adb6e44e028a0889918c.jpg",
    "https://i.pinimg.com/originals/55/18/65/5518655a26f0835eae4b02717aec8827.jpg",
    "https://i.pinimg.com/originals/d4/3c/0c/d43c0c76ca8daecfd75713f1ee16c116.jpg",
    "https://i.pinimg.com/originals/1f/3d/8f/1f3d8fe94aeb47d470c4e8d7356876c6.jpg",
    "https://i.pinimg.com/originals/2e/c5/11/2ec511bce9ac6c83f96de6188639fa31.jpg",
    "https://i.pinimg.com/originals/77/0f/b6/770fb6f41135d9f2769c7767f894798c.jpg",
    "https://i.pinimg.com/originals/39/e6/2f/39e62f526b81a1000e57e7a21cbbb6ef.jpg",
    "https://i.pinimg.com/originals/ac/f3/82/acf382da772b5d8004ec99c75ef3485a.jpg",
    "https://i.pinimg.com/originals/ae/8b/60/ae8b60c3c5f518180a8893d1966718f3.jpg",
    "https://i.pinimg.com/originals/58/b8/29/58b8293b9b1a1c196243bb26d142bd7d.png",
    "https://i.pinimg.com/originals/69/43/8a/69438aaf8afbd9697ac8a38fc99f318a.jpg",
    "https://i.pinimg.com/originals/57/21/a4/5721a4a5bec442fbe2dfeeef1791b587.jpg",
    "https://i.pinimg.com/originals/8f/9c/00/8f9c000a4c1c3237a71eb6df7825c780.png",
    "https://i.pinimg.com/originals/31/9d/28/319d2841e486b077767f4d220d2cb98a.jpg",
    "https://i.pinimg.com/originals/d1/18/2a/d1182a85fc0d172040508df4f4e52daa.jpg",
    "https://i.pinimg.com/originals/7f/e0/a0/7fe0a0f637b421634347fc7753a6c24a.png",
    "https://i.pinimg.com/originals/a4/81/fe/a481fef5009140ccf58aa97110f1f04e.jpg",
    "https://i.pinimg.com/originals/e4/1e/45/e41e4572ee8ce02dc16a196ac647d720.jpg",
    "https://i.pinimg.com/originals/9d/10/7b/9d107b32ebdaf80f4b404562783ebb6a.jpg",
    "https://i.pinimg.com/originals/2d/37/41/2d37412d8e1ad4cb7a10ee2c60f72f51.jpg",
    "https://i.pinimg.com/originals/a4/20/58/a420587e337235688e91e25069875a60.jpg",
    "https://i.pinimg.com/originals/21/bf/ad/21bfadd2f57a233a10918221dcf44088.jpg",
    "https://i.pinimg.com/originals/30/fe/ce/30fece0fe876f471f15d3bd560fd2cf9.jpg",
    "https://i.pinimg.com/videos/thumbnails/originals/57/86/d4/5786d45ca586edff950082a2e3a08562.0000000.jpg",
    "https://i.pinimg.com/736x/0f/6f/71/0f6f71ecafacc7a98964bef72487fb3f.jpg",
    "https://i.pinimg.com/originals/9c/e1/83/9ce1839ade935b96fdb6e444bfae8df1.jpg",
    "https://i.pinimg.com/originals/44/7f/ba/447fba869032fd2aa136f6131c5d4efd.jpg",
    "https://i.pinimg.com/originals/b8/b1/00/b8b1004de4dad64871654b0f6a3a13f2.jpg",
    "https://i.pinimg.com/originals/1e/13/4a/1e134ac9891aad79edd792d48a4ce971.jpg",
    "https://i.pinimg.com/originals/f0/02/f7/f002f777e7bfa520bc86df3dcb3fede3.jpg",
    "https://i.pinimg.com/originals/73/15/35/73153585da48658abc3624578153ce06.jpg",
    "https://i.pinimg.com/originals/fc/c1/37/fcc137ff02f7e622fc07006be7548bae.jpg",
    "https://i.pinimg.com/originals/89/87/41/8987417101e618ab51f74a633128383d.jpg",
    "https://i.pinimg.com/originals/e7/db/93/e7db93fa5e308eba001d3a0c6419e9cc.jpg",
    "https://i.pinimg.com/originals/88/79/cb/8879cb0efcf08c81ac6611d4319238b8.jpg",
    "https://i.pinimg.com/originals/40/9c/a1/409ca104c40c519a7af7635b6a329064.jpg",
    "https://i.pinimg.com/originals/1b/9d/77/1b9d77dd6adade5db8c537dcf006e2f9.jpg",
    "https://i.pinimg.com/originals/67/7f/48/677f4864c44785acb1ee4d5993702720.jpg",
    "https://i.pinimg.com/originals/89/87/2c/89872cb6767da8949da01e8440899f23.jpg",
    "https://i.pinimg.com/originals/74/53/1d/74531d6ec217154ecee108fa4790d553.jpg",
    "https://i.pinimg.com/originals/f3/b7/21/f3b72147d58b424a2f6de3f26f468b5a.jpg",
    "https://i.pinimg.com/originals/92/05/32/92053277243ca8191a72a49df324a480.jpg",
    "https://i.pinimg.com/originals/1c/22/f5/1c22f5d5a8b7fe01076e86ab321aed22.jpg",
    "https://i.pinimg.com/originals/21/a5/c8/21a5c8c997a37984f1558aa197ba08a5.jpg",
    "https://i.pinimg.com/originals/b1/c8/ba/b1c8ba46386657951de90d85071f2f18.jpg",
    "https://i.pinimg.com/originals/7c/37/8d/7c378d411cf7c2cd9fd82bb6f6ed9588.jpg",
    "https://i.pinimg.com/originals/56/92/1b/56921bbf86c4283afed53a9f6a16ca38.jpg",
    "https://i.pinimg.com/originals/0e/af/d5/0eafd55e841aae40d4db0b19662be044.jpg",
    "https://i.pinimg.com/736x/54/bd/e2/54bde25d26f40dcab30d99e6f12d8fb5.jpg",
    "https://i.pinimg.com/originals/ed/dc/d7/eddcd7a1683d13610ebd55f7f6c216b8.jpg",
    "https://i.pinimg.com/originals/cd/a5/2b/cda52b21f759640f2926800b6c64d8c7.jpg",
    "https://i.pinimg.com/originals/96/b0/1d/96b01d670141f152f8fa4977a9c865bf.png",
    "https://i.pinimg.com/originals/30/ba/cc/30bacc99f5f48d61e9109d07a4c4c98e.jpg",
    "https://i.pinimg.com/originals/8e/15/a1/8e15a15bd3f54ba5d9b0aaac79f65aaa.jpg",
    "https://i.pinimg.com/originals/54/b6/31/54b631a7099924d50c1353b7db2298b1.jpg",
    "https://i.pinimg.com/originals/e1/d2/64/e1d26413fd668b301da4ffc8cdffe92e.jpg",
    "https://i.pinimg.com/originals/20/c9/38/20c938d74ba5c436d73ff43df248c8f5.jpg",
    "https://i.pinimg.com/originals/23/64/ab/2364ab8f791449402b184543fc93a55c.jpg",
    "https://i.pinimg.com/736x/8e/6f/b5/8e6fb5cdc84c0de877e01ef40e383287.jpg",
    "https://i.pinimg.com/originals/9f/d3/bc/9fd3bcb7777d56055ac9f128280e6991.jpg",
    "https://i.pinimg.com/originals/b7/d0/be/b7d0be8d6966defdb9180169c250c6e5.jpg",
    "https://i.pinimg.com/originals/fd/01/3f/fd013f30c4311f61e52894a264d75230.jpg",
    "https://i.pinimg.com/originals/6e/89/ce/6e89ce79672c7e2b29105471d4dc4bd8.jpg",
    "https://i.pinimg.com/originals/1c/f5/03/1cf503ae2461b144ddb177cd799ef4ad.jpg",
    "https://i.pinimg.com/originals/44/a4/ef/44a4ef57fe59e58a4fc9972da704fb7f.jpg",
    "https://i.pinimg.com/originals/f7/ae/41/f7ae418d5d6c757c9a242b7b68f52c50.jpg",
    "https://i.pinimg.com/originals/51/b7/40/51b7404393b00316b6137b0314f36ff0.jpg",
    "https://i.pinimg.com/originals/f6/55/fa/f655fae92e34e3e7facac3482958998e.heic",
    "https://i.pinimg.com/originals/03/6a/fa/036afaa78f4281f63e6b7084e990bfb7.png",
    "https://i.pinimg.com/originals/d4/62/93/d462937440b78b2db4ac96fd9c5b7d5e.jpg",
    "https://i.pinimg.com/originals/00/08/cb/0008cb1f113c377987118d196947b251.jpg",
    "https://i.pinimg.com/originals/e3/63/d7/e363d73f923fe063dd6d6f2f62cd6e7e.jpg",
    "https://i.pinimg.com/originals/26/10/96/2610966791591d73dd1cc28bcd94a0d2.jpg",
    "https://i.pinimg.com/originals/00/3c/54/003c541dca47a8dc060dd4f31136be7e.jpg",
    "https://i.pinimg.com/originals/7f/c4/26/7fc426ebfd2a92aeeff58618da09cdf5.jpg",
    "https://i.pinimg.com/originals/68/f6/2b/68f62b05ff79e3899eee9eb7ad2aaf86.jpg",
    "https://i.pinimg.com/originals/9d/28/29/9d2829676b52c6519ade27fce902bd89.jpg",
    "https://i.pinimg.com/originals/60/9e/5c/609e5c5596225ffadc270df92e443f58.jpg",
    "https://i.pinimg.com/originals/ab/b3/1c/abb31c4233aaf1d207a41e1f654e7931.jpg",
    "https://i.pinimg.com/originals/2f/7c/93/2f7c932e2c18600e2bbd9a2dbc15f9dd.jpg",
    "https://i.pinimg.com/originals/16/2a/b9/162ab9a8cc25b28cc7c58a2457b35e49.jpg",
    "https://i.pinimg.com/originals/b8/fc/3d/b8fc3d784f8f454e390c93c5eee5b977.jpg",
    "https://i.pinimg.com/originals/0c/c9/d1/0cc9d1930ea9f3e56c6ffec9a737d681.jpg",
    "https://i.pinimg.com/originals/0c/d3/2e/0cd32e7ff0f13178463bdc12e9171458.jpg",
    "https://i.pinimg.com/originals/65/08/3a/65083aca854743f77136d4ac2cedce59.jpg",
    "https://i.pinimg.com/originals/fc/6c/db/fc6cdbe5f5db790dbe6db1a1e3808238.jpg",
    "https://i.pinimg.com/originals/25/20/89/252089a75eb259ed4550247152599c02.jpg",
    "https://i.pinimg.com/originals/65/1d/ef/651def9d1ed09300d0739741316c2465.jpg",
    "https://i.pinimg.com/originals/c7/50/f5/c750f56b544c0a5dad066c0bb18ae781.jpg",
    "https://i.pinimg.com/originals/6c/69/0b/6c690bae12d038db65195f6cc4fa102d.jpg",
    "https://i.pinimg.com/originals/af/5f/fd/af5ffd6b9df190f82ab360cd843c917a.jpg",
    "https://i.pinimg.com/originals/82/3e/0b/823e0b9f34dad66653f08ef954c503b3.jpg",
    "https://i.pinimg.com/originals/07/f8/cb/07f8cbbea7c17acf9b928910eaca5b43.jpg",
    "https://i.pinimg.com/originals/8d/f2/26/8df2266fd63a58b3529fb68f789a52fc.jpg",
    "https://i.pinimg.com/originals/ac/26/6f/ac266fa204d8771715d1d8228337a052.jpg",
    "https://i.pinimg.com/originals/66/bb/f1/66bbf17a6066346a5c040c455f2e21f6.jpg",
    "https://i.pinimg.com/originals/a5/f4/a1/a5f4a106d15896fa5aea790c3bb93ac0.jpg",
    "https://i.pinimg.com/originals/62/3d/cc/623dcc3f54060c693ff215a1b29d4f79.jpg",
    "https://i.pinimg.com/originals/86/0f/01/860f01230ed410ac39caef1974d65e89.jpg",
    "https://i.pinimg.com/originals/4e/fd/f2/4efdf25c8397bb160c1642c2843f27e8.jpg",
    "https://i.pinimg.com/originals/de/bb/be/debbbeca04de72db954783fa346b5bca.jpg",
    "https://i.pinimg.com/originals/43/16/f8/4316f8d88a2478b9782bfd42d4f9f0e6.jpg",
    "https://i.pinimg.com/originals/70/f3/b0/70f3b08f8e6d1dab0a2a1c456af0eb77.jpg",
    "https://i.pinimg.com/originals/27/73/c5/2773c544c7dfb1b293ef5fc3f76c49d3.jpg",
    "https://i.pinimg.com/originals/66/b3/80/66b3803c5e4a8a98a9abb04827e91426.jpg",
    "https://i.pinimg.com/originals/6e/ee/68/6eee686c320ff0d5146552dff6742afe.jpg",
    "https://i.pinimg.com/originals/7a/1c/d1/7a1cd1e29f0a2dea447d2bfdfad7c762.jpg",
    "https://i.pinimg.com/originals/13/09/05/1309059d8c6ce2ec7c4b3e5194621901.jpg",
    "https://i.pinimg.com/originals/51/ca/39/51ca399d848223ba7829151302bc00cd.jpg",
    "https://i.pinimg.com/originals/e8/6a/be/e86abedeb5589d0c9e43038c8608a682.jpg",
    "https://i.pinimg.com/originals/5d/ba/d9/5dbad9b1044203ce25f25cd977e2b585.jpg",
    "https://i.pinimg.com/originals/03/05/21/03052113f3a4bcb5e170c01e827b1113.jpg",
    "https://i.pinimg.com/originals/cb/73/5c/cb735cd863dab79c79d775883c239bee.jpg",
    "https://i.pinimg.com/originals/11/d4/b5/11d4b50ae8f05554501e1e36355cd174.jpg",
    "https://i.pinimg.com/originals/2c/09/72/2c09728864d47319f8b7642e8255704d.jpg",
    "https://i.pinimg.com/originals/23/6c/e2/236ce24278c6b1a906ea3cca27213b09.jpg",
    "https://i.pinimg.com/originals/70/31/2b/70312b27746cd136628952537ddb815f.jpg",
    "https://i.pinimg.com/originals/ed/93/9b/ed939be35ada517aeef1768f41b9a05b.jpg",
    "https://i.pinimg.com/originals/79/3f/0f/793f0fc153247b49d54a61bc1e7fc623.jpg",
    "https://i.pinimg.com/originals/04/f1/72/04f1725cf14356cd14ed8c60da7e22e0.jpg",
    "https://i.pinimg.com/originals/bd/a9/4d/bda94d44a47f9b06ea2e63a9ffeabda5.jpg",
    "https://i.pinimg.com/originals/45/0c/16/450c16d74e08ec1d9c67e42766e50686.jpg",
    "https://i.pinimg.com/videos/thumbnails/originals/6e/cd/6d/6ecd6d02a15082b5783bf15df50901a4.0000000.jpg",
    "https://i.pinimg.com/originals/d0/b6/70/d0b67062a4a16b0341e8540eadcf5dbc.jpg",
    "https://i.pinimg.com/originals/80/f0/c8/80f0c82ab12b0cbd2d4a126fed93f847.jpg",
    "https://i.pinimg.com/originals/29/4a/d4/294ad432326fd4917c38e0d9bd62ab74.jpg",
    "https://i.pinimg.com/originals/c9/0a/a2/c90aa2fc9a6036ead806bfca9dc3575c.jpg",
    "https://i.pinimg.com/originals/9d/e0/5c/9de05cdf46d01b5599d981ffa94b6bdf.jpg",
    "https://i.pinimg.com/originals/7d/cd/8c/7dcd8c84f35b120cc2a927c54f6a6d24.jpg",
    "https://i.pinimg.com/originals/09/de/bf/09debfa742d5129c9912254c46eb4122.jpg",
    "https://i.pinimg.com/originals/ab/fb/cb/abfbcba567cdf53afc3016634f66540a.jpg",
    "https://i.pinimg.com/originals/51/5f/81/515f810a5ad674eea0b89bd6380b735f.jpg",
    "https://i.pinimg.com/originals/a8/2e/1f/a82e1f57e5ecf34d87d68adde51d245f.jpg",
    "https://i.pinimg.com/originals/b3/3f/af/b33faf8b3964a6c2ef2b6ea319354d95.png",
    "https://i.pinimg.com/originals/bc/a7/2a/bca72ac520f53f5543db134a69d4361f.jpg",
    "https://i.pinimg.com/originals/8b/93/d2/8b93d21c5a5ed2d3c5d008788275d08e.png",
    "https://i.pinimg.com/originals/21/9f/2c/219f2c26351334a2e6bc29cb359703dc.jpg",
    "https://i.pinimg.com/originals/f8/dc/77/f8dc77c60ad260f3b87d1bad44ecc0a5.jpg",
    "https://i.pinimg.com/originals/69/1c/ce/691cceab367445bd0ebe4f3b1f58510f.jpg",
    "https://i.pinimg.com/originals/43/b7/b9/43b7b90d50bb7f73a8a50c7628bb1a39.jpg",
    "https://i.pinimg.com/originals/22/60/76/2260762e16a45a4f8985132d7772a3f6.webp",
    "https://i.pinimg.com/originals/bc/dc/54/bcdc547fa8ab5f1ecc833c3fdec6eb13.jpg",
    "https://i.pinimg.com/originals/5a/72/69/5a7269f5c9712da2a630fa63f10eab7d.jpg",
    "https://i.pinimg.com/originals/ea/a5/28/eaa528a32e9e2b4d17e46add9edfb4eb.jpg",
    "https://i.pinimg.com/originals/57/1d/9d/571d9db6f9900002d08e0d705dbf9a77.jpg",
    "https://i.pinimg.com/originals/3e/ed/ef/3eedef5e7364d3c8c111f3f37bc03c61.jpg",
    "https://i.pinimg.com/originals/7d/0e/9f/7d0e9fd688848641c2629451ccfc87c0.jpg",
    "https://i.pinimg.com/originals/a0/fe/9f/a0fe9ff8d2ec3ed35f26fb8b7a0b4a4e.jpg",
    "https://i.pinimg.com/originals/c7/ce/38/c7ce38454a037ddfc35aa37579c06b43.jpg",
    "https://i.pinimg.com/originals/29/77/46/2977463b2b5fb7047af96c7207f3b78b.jpg",
    "https://i.pinimg.com/originals/bb/24/96/bb2496bed79a0f13123143a775fcdf5c.jpg",
    "https://i.pinimg.com/originals/57/f0/2d/57f02d4ba052810dae4b9728257ca978.jpg",
    "https://i.pinimg.com/originals/fb/94/6e/fb946e15209ee15ec67abc944cc33a4a.jpg",
    "https://i.pinimg.com/originals/e7/1a/a6/e71aa6c6073246e44b7ee1d7caa3f7d6.jpg",
    "https://i.pinimg.com/originals/bf/35/89/bf3589544cf8766fb40225716e104e4b.jpg",
    "https://i.pinimg.com/originals/73/5c/69/735c69f4b92d8fa79145c4790c5179f1.jpg",
    "https://i.pinimg.com/originals/bb/03/79/bb0379fe7108615cecd59fde2fb3dbba.jpg",
    "https://i.pinimg.com/originals/c9/96/f9/c996f91f03b60ca60ec64e1b074be2f6.jpg",
    "https://i.pinimg.com/originals/6b/8d/55/6b8d557af9e7122dbd7eec1c2593232b.jpg",
    "https://i.pinimg.com/originals/6d/c3/09/6dc30917f31f54324374a9e600803a25.jpg",
    "https://i.pinimg.com/originals/02/1e/34/021e34efd44021fa1c85c1296e87814f.jpg",
    "https://i.pinimg.com/originals/5f/9c/64/5f9c6451d1b5a7910c2e45d866afcd67.jpg",
    "https://i.pinimg.com/originals/65/65/e2/6565e252dca9e279c0a43098a7280a69.jpg",
    "https://i.pinimg.com/originals/9d/96/26/9d96260c0b71a2b4364660dc36a349d5.jpg",
    "https://i.pinimg.com/originals/e7/82/8a/e7828a32eb890babba435ca8f64163cf.jpg",
    "https://i.pinimg.com/originals/18/6f/ed/186fedd6d2b1738d762a1452131ebb5f.jpg",
    "https://i.pinimg.com/originals/4a/36/28/4a36284c9a88083c0df26b5b946aa415.jpg",
    "https://i.pinimg.com/originals/2f/eb/f4/2febf411cc3d1f992b426145c4914a48.jpg",
    "https://i.pinimg.com/originals/8b/8d/98/8b8d98b258d959cf9ffe4a6c2a554dfe.jpg",
    "https://i.pinimg.com/originals/85/18/3e/85183e19bdaa2f3deaa7bfeb52065678.jpg",
    "https://i.pinimg.com/originals/5d/e7/44/5de7440bfa72fa4cc095ce721676ce59.jpg",
    "https://i.pinimg.com/originals/a0/d3/63/a0d3630d12a9a50ec944f5e0627f481a.jpg",
    "https://i.pinimg.com/originals/88/39/c3/8839c394c1e600246490ef692b67fcd6.jpg",
    "https://i.pinimg.com/originals/78/db/58/78db58d5744ba54853bc69dd1332cfbe.jpg",
    "https://i.pinimg.com/originals/1a/05/79/1a057914af2849e85c3d415bce34bd7f.jpg",
    "https://i.pinimg.com/originals/8d/45/1d/8d451d892b88af00f57631a9d4ac2b62.jpg",
    "https://i.pinimg.com/originals/23/30/55/233055956307b393b15cf05b716d59ef.jpg",
    "https://i.pinimg.com/originals/c6/af/1e/c6af1e72a5646e81b13c76409a26a2e9.jpg",
    "https://i.pinimg.com/originals/6a/b0/04/6ab004304a194135f1a656edf8ad7105.jpg",
    "https://i.pinimg.com/originals/5a/66/cb/5a66cbaeca7f3dca9dd9f3083c772258.jpg",
    "https://i.pinimg.com/originals/95/52/0d/95520d9c74aa02c5d8a4fe0ea4e1478a.jpg",
    "https://i.pinimg.com/originals/f1/c6/a3/f1c6a3bba9e8efd93b94d08b2aaaaa5f.jpg",
    "https://i.pinimg.com/originals/0e/6a/38/0e6a3888d2f3837b2d9a1e0562aaddae.jpg",
    "https://i.pinimg.com/originals/8d/cd/cd/8dcdcd1b56e6ad80fb61cd7fc8b6d3ed.jpg",
    "https://i.pinimg.com/originals/c5/9f/81/c59f81da16c2c6632ecf9c8e5a240e35.jpg",
    "https://i.pinimg.com/originals/b8/dc/4d/b8dc4dad4e5592048fb071b8e9ff3fb4.jpg",
    "https://i.pinimg.com/originals/74/36/03/7436032af030b52ce54bdd59ffd603c1.jpg",
    "https://i.pinimg.com/originals/c8/3f/4a/c83f4ac7e11829c7bd6a37d0ae62505e.jpg",
    "https://i.pinimg.com/originals/12/1a/fd/121afd23b7888afee2288232ac16087c.jpg",
    "https://i.pinimg.com/originals/18/30/78/1830781f765acfa0eb0abb12cba03bdb.jpg",
    "https://i.pinimg.com/originals/23/09/40/230940ed7e60566bb65fd988ad8c7f9c.jpg",
    "https://i.pinimg.com/originals/9f/f8/58/9ff858d2a17203189e8bc4825de96efe.jpg",
    "https://i.pinimg.com/originals/ec/f5/cb/ecf5cb81f53459039984ca69af17bb4b.jpg",
    "https://i.pinimg.com/originals/da/76/9d/da769d94481b97930eac0b5b0c33c3d9.jpg",
    "https://i.pinimg.com/originals/1c/3a/83/1c3a83eec1ce34686f23ad59185fa422.jpg",
    "https://i.pinimg.com/originals/76/67/4e/76674e30585e27f21fec082e94fa006d.jpg",
    "https://i.pinimg.com/originals/22/de/72/22de72b57766d59a53ed31c9d9828ef9.jpg",
    "https://i.pinimg.com/originals/2d/38/9b/2d389b5ad22b999aed834ef2cfe2f06a.jpg",
    "https://i.pinimg.com/originals/ab/3f/71/ab3f71ab2fa16ab4e12d085cddef05b6.jpg",
    "https://i.pinimg.com/originals/f3/d0/d2/f3d0d21080ce87179a6714d7fc81c58f.jpg",
    "https://i.pinimg.com/originals/c9/25/a7/c925a77dd51818a5d243dce82ca8b4e5.jpg",
    "https://i.pinimg.com/originals/90/80/28/908028fcd041fe43f7029845e9cd07dd.jpg",
    "https://i.pinimg.com/originals/8e/ed/52/8eed52c110e5fed7e290b54442f2ea2f.jpg",
    "https://i.pinimg.com/originals/b0/e1/76/b0e17641212ec0237837d400a9b54ce0.jpg",
    "https://i.pinimg.com/originals/0c/77/f4/0c77f46c0c9cb262d91c8eb644289d9e.jpg",
    "https://i.pinimg.com/originals/5e/6e/f1/5e6ef13ad1f36c1ca1bf2de59c940fb2.jpg",
    "https://i.pinimg.com/originals/65/4c/96/654c9671936e1d6943833362dfde09de.jpg",
    "https://i.pinimg.com/originals/9f/e2/39/9fe239b3ff09e4877cdadaa8d99a3597.jpg",
    "https://i.pinimg.com/originals/e6/19/3c/e6193cfebea63e782400e7120cd42642.jpg",
    "https://i.pinimg.com/originals/b9/ea/c0/b9eac0af81a1f8ede5253e2d6206977f.jpg",
    "https://i.pinimg.com/originals/47/9c/64/479c6479234d8e0388977581370a05fe.jpg",
    "https://i.pinimg.com/originals/ad/6e/08/ad6e084b3e48237757400922722812b8.jpg",
    "https://i.pinimg.com/originals/2c/bd/b9/2cbdb989296bac265ffad95d04a1b6c7.jpg",
    "https://i.pinimg.com/originals/c0/39/eb/c039ebf8fb05cca2ef2a43fc88f0f6b0.heic",
    "https://i.pinimg.com/originals/02/31/e4/0231e420e9a70f4468b0e1169969ab2d.jpg",
    "https://i.pinimg.com/originals/03/86/32/0386322b4ece149d680cde3e0c11a3ff.jpg",
    "https://i.pinimg.com/originals/86/38/d4/8638d4457ef035d42a8c7e8aa1f4e0e3.jpg",
    "https://i.pinimg.com/originals/0d/be/e4/0dbee42b2696240daaf24551ba1dd2c1.jpg",
    "https://i.pinimg.com/originals/e3/a3/f1/e3a3f1de0e7f90c211fe663240f03424.jpg",
    "https://i.pinimg.com/originals/c3/d4/84/c3d484204e5c2cc84c1994b55df409dd.jpg",
    "https://i.pinimg.com/originals/de/22/29/de222935573f8b18d43a1fffadc63661.jpg",
    "https://i.pinimg.com/originals/64/d2/78/64d27866e2ae5383fe0e2b0d5d0120f5.jpg",
    "https://i.pinimg.com/originals/01/45/54/01455497307a11d3b9c8d10bc9b5ac67.jpg",
    "https://i.pinimg.com/originals/b7/ad/02/b7ad025471292771a9426466acd84f26.jpg",
    "https://i.pinimg.com/originals/eb/8e/c5/eb8ec5d0ec76720a38355a02f0deca62.jpg",
    "https://i.pinimg.com/originals/92/eb/3b/92eb3b48d865381fd0bbefc0326e9fd1.jpg",
    "https://i.pinimg.com/originals/33/57/22/335722659d2b512f2c6732e6ab83d84e.jpg",
    "https://i.pinimg.com/originals/ae/b9/dd/aeb9dd33fe4803b4959478dcdcaa5757.jpg",
    "https://i.pinimg.com/originals/47/f0/42/47f042355b9e9cf4e7a1696229cc9b9d.jpg",
    "https://i.pinimg.com/originals/85/81/fb/8581fb725fe1978433b5aac686d6b257.jpg",
    "https://i.pinimg.com/originals/79/d4/87/79d487bc75d300443f584fa4eddd2b7e.jpg",
    "https://i.pinimg.com/originals/83/33/93/8333933f9e57864c76fcbfd4865ce3cc.jpg",
    "https://i.pinimg.com/originals/32/0d/96/320d96f31d2e18d01744ced33ae6394b.jpg",
    "https://i.pinimg.com/originals/14/93/38/149338306c7e26443fc1f158a7bc26f1.jpg",
    "https://i.pinimg.com/originals/77/35/08/77350849f8407691e98f69c1f85e8fee.jpg",
    "https://i.pinimg.com/originals/42/ef/f9/42eff9e0ae0c83d3a3dba05ce0a405e5.jpg",
    "https://i.pinimg.com/originals/a2/04/63/a20463a52ac0db4ef3e941b7d71f26c3.jpg",
    "https://i.pinimg.com/originals/bf/df/1b/bfdf1b2110ef89918c47d900af51516d.jpg",
    "https://i.pinimg.com/originals/79/1c/59/791c59b841e4b4bb571f4dd5cb31151b.jpg",
    "https://i.pinimg.com/originals/d3/40/16/d34016cd4e5943186ceef8e5854ab479.jpg",
    "https://i.pinimg.com/originals/8c/67/ea/8c67ea40e372e1d8593349ff0530105c.jpg",
    "https://i.pinimg.com/originals/4e/94/11/4e9411f33099e769272e546f55cbb19d.jpg",
    "https://i.pinimg.com/originals/7d/c2/71/7dc2715bcf9d2b753166f5a2c59cbb20.jpg",
    "https://i.pinimg.com/originals/dd/e6/7c/dde67cca671722d75fa73a507bf63cfd.jpg",
    "https://i.pinimg.com/originals/cd/f9/b0/cdf9b01103e595296e558cb5dd739bd2.jpg",
    "https://i.pinimg.com/originals/4b/cc/39/4bcc3932dbe606a8a3c4b49a1b8e4f6e.jpg",
    "https://i.pinimg.com/originals/ca/f5/fa/caf5fa4ed3dd1c1df16dd763a3a2575b.jpg",
    "https://i.pinimg.com/originals/d5/bf/bd/d5bfbd643891f2d5dd832c29ee9c78bb.jpg",
    "https://i.pinimg.com/originals/ca/68/59/ca6859e5f5e075ba31e59ba9b0605ddd.jpg",
    "https://i.pinimg.com/originals/36/ff/5c/36ff5c5603b51dc5725b7d939dcb3433.webp",
    "https://i.pinimg.com/originals/05/a5/62/05a562049080dfc68555debe0ce426dc.jpg",
    "https://i.pinimg.com/originals/fc/0d/55/fc0d5528e577ef6a9a8b28c8e17f3192.jpg",
    "https://i.pinimg.com/originals/36/a7/e6/36a7e61aba9d8589ef5f6a5ecce5c05a.jpg",
    "https://i.pinimg.com/originals/f0/3b/c0/f03bc03f23966cfe2ab705016f95a0ec.jpg",
    "https://i.pinimg.com/originals/95/aa/f2/95aaf20f28a6278a822b52676a026aea.jpg",
    "https://i.pinimg.com/originals/26/e4/f0/26e4f0b5e86176863ab8505c99e76ab7.jpg",
    "https://i.pinimg.com/originals/75/20/72/7520727bcbeda8e51db8814dcac6625b.jpg",
    "https://i.pinimg.com/originals/ac/3c/77/ac3c770c5da8505ac90e7b72625d4326.jpg",
    "https://i.pinimg.com/originals/f3/d8/d2/f3d8d2fa664d82c6be8fc35ddd7df6c9.jpg",
    "https://i.pinimg.com/originals/2d/93/97/2d9397136208870d11b688a63e11cb3c.jpg",
    "https://i.pinimg.com/originals/d4/b6/2d/d4b62dee272f5ace63f2cc5b2fca6139.jpg",
    "https://i.pinimg.com/736x/20/a6/94/20a694420ff181fb82ac2cdbcbbe32a6.jpg",
    "https://i.pinimg.com/originals/c2/f8/51/c2f85107ac53e6aa6c2e7a20324e1dda.jpg",
    "https://i.pinimg.com/originals/e4/c8/63/e4c863b268192e45f1fa97b99a116614.jpg",
    "https://i.pinimg.com/736x/ec/62/9f/ec629feb9dd743d5fe34684a8a0a9d33.jpg",
    "https://i.pinimg.com/originals/5b/e9/27/5be9275e4e9649fab420b281959ac9f3.jpg",
    "https://i.pinimg.com/originals/e5/c6/da/e5c6da2b212e480dd38bdd7df8adc48a.jpg",
    "https://i.pinimg.com/originals/9e/49/03/9e49033105cc8d4118e28857bdbb9dff.jpg",
    "https://i.pinimg.com/originals/9e/da/b1/9edab198393b46343962b14dc342dce6.jpg",
    "https://i.pinimg.com/originals/5c/30/04/5c3004291031cf7de540c53d2e44675a.jpg",
    "https://i.pinimg.com/originals/6c/8c/8d/6c8c8d35cb68fb364f51693198256355.jpg",
    "https://i.pinimg.com/originals/83/55/cb/8355cb40707dd64b801a4ac6eb9a8284.jpg",
    "https://i.pinimg.com/originals/b5/7d/a5/b57da5e2ae19e0e75969deb7cf4bb40f.jpg",
    "https://i.pinimg.com/originals/67/8a/47/678a470b0a42dd0452c1486f421325c3.png",
    "https://i.pinimg.com/originals/31/1a/ae/311aaed508566349ce783e089c431c52.jpg",
    "https://i.pinimg.com/originals/5c/72/8c/5c728cacf60fcc8228fc438de9c9bb15.jpg",
    "https://i.pinimg.com/originals/6d/f5/b6/6df5b62113e8d70b9f9af8edabac494d.jpg",
    "https://i.pinimg.com/originals/aa/0c/e5/aa0ce547e6787cd50a8c6d95c3fdedeb.jpg",
    "https://i.pinimg.com/originals/23/85/23/238523bb156a17cc67ace0d67d547d4d.jpg",
    "https://i.pinimg.com/originals/25/a8/0c/25a80cdfd3e5104532ed467f8183678a.jpg",
    "https://i.pinimg.com/originals/52/09/ac/5209acc68e39bbd93538ea540677e097.jpg",
    "https://i.pinimg.com/originals/f9/9d/c9/f99dc9c5208dee9628cc792be6e421ef.jpg",
    "https://i.pinimg.com/originals/5d/7f/a0/5d7fa0d2f8b15536ae6ee39bc417320b.jpg",
    "https://i.pinimg.com/originals/5c/53/e7/5c53e7e55deaa1b7ed696465f1ce3718.jpg",
    "https://i.pinimg.com/originals/51/47/9e/51479e3c62ea9d648164359ac93e5888.jpg",
    "https://i.pinimg.com/originals/d9/39/08/d93908a32b862b73e1d3e160c8353d2a.jpg",
    "https://i.pinimg.com/originals/e5/3c/0f/e53c0f9af46ef982d5d40bcbc7a16d3f.jpg",
    "https://i.pinimg.com/originals/53/9c/8d/539c8d550e666b7b324554c99686376f.jpg",
    "https://i.pinimg.com/originals/b1/79/ba/b179ba4ec4680d8cda28c950801919b8.jpg",
    "https://i.pinimg.com/originals/48/8e/5f/488e5f015c23a41dd241d0dec205c9a1.jpg",
    "https://i.pinimg.com/originals/44/2a/81/442a81293d9e94ace728ff1a7c7b3ab1.jpg",
    "https://i.pinimg.com/originals/f1/62/1e/f1621ee425dbe65914197490b8437a42.jpg",
    "https://i.pinimg.com/originals/87/2f/d3/872fd3854fcf0cb6bbb769b51c9d2807.jpg",
    "https://i.pinimg.com/originals/cc/55/e6/cc55e6b7cd903da11271cbd8cac26460.jpg",
    "https://i.pinimg.com/originals/bb/b3/36/bbb3365de7382e76f5c135cb4a8666a2.jpg",
    "https://i.pinimg.com/originals/e6/35/26/e635260053c609106a3b29706e2b5723.jpg",
    "https://i.pinimg.com/originals/d6/f2/0c/d6f20c1bcf1d61a5845633182a18eed1.jpg",
    "https://i.pinimg.com/originals/c9/a4/c1/c9a4c1edc32b008b3a4541727777eec5.jpg",
    "https://i.pinimg.com/originals/41/d7/ce/41d7ce10e38651a91de76d0abd389981.jpg",
    "https://i.pinimg.com/originals/fd/00/af/fd00af714eb4f1201299dc456f836ac2.jpg",
    "https://i.pinimg.com/originals/7b/f9/ec/7bf9ec2b33f98a2f296940c1ea664ffd.jpg",
    "https://i.pinimg.com/originals/6d/51/fb/6d51fb155527e1011728aee66e7839b7.jpg",
    "https://i.pinimg.com/originals/6f/d5/7c/6fd57cb25b4d1ecd78d0a5d3e914ae0f.jpg",
    "https://i.pinimg.com/originals/1d/98/5f/1d985f7ce7ea35a3e0d80bd582d1d769.jpg",
    "https://i.pinimg.com/originals/56/55/1d/56551d8ec2517e060617ddbcbd97c0a2.jpg",
    "https://i.pinimg.com/originals/3a/4a/84/3a4a84028d35523236821f9bd0cb2af6.jpg",
    "https://i.pinimg.com/originals/b9/77/47/b977478eff01723dbc18dc09f3d6dc3b.jpg",
    "https://i.pinimg.com/originals/e3/85/03/e38503a81fd79371d41aaca9ea220108.jpg",
    "https://i.pinimg.com/originals/2f/a4/7a/2fa47a084de165fa3a0fb765e9494fed.jpg",
    "https://i.pinimg.com/originals/e1/62/98/e16298933cfa2262d0a23f20cc5384d6.jpg",
    "https://i.pinimg.com/originals/44/67/af/4467af1f043bb9194ff8d8e2b8f355e9.jpg",
    "https://i.pinimg.com/originals/08/73/03/08730376d59729f96f7e32af1ad8e223.jpg",
    "https://i.pinimg.com/originals/65/e5/6d/65e56d10a3bb88003210b7415bcb2d4a.jpg",
    "https://i.pinimg.com/originals/10/ef/96/10ef96c2955f4dd366d780bbfba6e2bf.jpg",
    "https://i.pinimg.com/originals/ac/05/59/ac0559454fbea81117520344544ac7ba.jpg",
    "https://i.pinimg.com/originals/88/40/45/88404510653b51bd6e4b42927d534527.webp",
    "https://i.pinimg.com/originals/dc/34/f3/dc34f3b1227616baa3d3bbcf7f69efed.jpg",
    "https://i.pinimg.com/originals/0f/32/72/0f3272d3b8047a3c37bd77e2a7a253e4.jpg",
    "https://i.pinimg.com/originals/5a/26/1c/5a261cb25d5d776a27290dbd7201479e.jpg",
    "https://i.pinimg.com/originals/66/4f/65/664f65680af6c6f96d17cc6fec0c24dc.jpg",
    "https://i.pinimg.com/originals/ec/22/d1/ec22d15a3884c6395f0662e3d76e7fcc.jpg",
    "https://i.pinimg.com/originals/13/8a/74/138a74b89c15a72c101f9ee2605d1ac4.jpg",
    "https://i.pinimg.com/originals/6f/c0/0d/6fc00dcbfd3d2493e016b9fe77c20f0f.jpg",
    "https://i.pinimg.com/originals/ab/56/c6/ab56c6f45ba954f2d2255009bfaff88f.jpg",
    "https://i.pinimg.com/originals/68/a0/af/68a0af0627b12fc843cf5406e76a928a.jpg",
    "https://i.pinimg.com/originals/8b/0c/00/8b0c004844591e9d262bb3b48067655f.jpg",
    "https://i.pinimg.com/originals/b4/b1/fd/b4b1fd1494e4977259ac8ffc3440abb0.jpg",
    "https://i.pinimg.com/originals/86/f2/c2/86f2c280521709ccac48ee7c0105155e.jpg",
    "https://i.pinimg.com/originals/3b/3f/af/3b3faf015235a831676172e16e0043af.jpg",
    "https://i.pinimg.com/originals/f3/39/0b/f3390bd354ac30278c8d0b2beb253085.jpg",
    "https://i.pinimg.com/originals/ba/5e/1b/ba5e1bd99fb00e91ada6c4392ed5a63b.jpg",
    "https://i.pinimg.com/originals/32/4b/23/324b238182c254065d28c7a7a6ee1fd1.jpg",
    "https://i.pinimg.com/originals/34/29/de/3429def8f5af6a551b9b72a9b26c1edc.jpg",
    "https://i.pinimg.com/originals/ff/d2/c4/ffd2c4a3e697367eea965d1e276a79df.jpg",
    "https://i.pinimg.com/originals/99/cc/68/99cc68feb5fe860fc2933f085b5ff731.jpg",
    "https://i.pinimg.com/originals/9f/af/f0/9faff0e2032122997bb49a61165eadee.jpg",
    "https://i.pinimg.com/originals/a1/5f/8f/a15f8f84fb2f14ebf8e3552dd3a21403.jpg",
    "https://i.pinimg.com/originals/78/c9/00/78c900d67c44ba56f5c302ce04a4cf2c.jpg",
    "https://i.pinimg.com/originals/0d/47/5e/0d475e56c40f5d23fe88df503fbaf225.jpg",
    "https://i.pinimg.com/originals/c6/64/3f/c6643fdaf11226792f089b13ed45ba80.jpg",
    "https://i.pinimg.com/originals/a6/2f/c2/a62fc2a7214cb128a8cb5d7e6657f143.jpg",
    "https://i.pinimg.com/originals/81/5d/be/815dbe9449ba125ca0cd17fc873acc11.jpg",
    "https://i.pinimg.com/originals/00/55/73/0055734b2f55577c3b65f97d531f81f3.jpg",
    "https://i.pinimg.com/originals/5b/27/a4/5b27a47b22143d3e25c5b20caaf635db.jpg",
    "https://i.pinimg.com/originals/27/1a/81/271a81e0b6d86df74b5ee711f19e9681.jpg",
    "https://i.pinimg.com/originals/d8/fd/e9/d8fde9802a3fff02ff89ae78dda6b2e4.jpg",
    "https://i.pinimg.com/originals/00/33/2e/00332e00129a494e34837eff61795021.jpg",
    "https://i.pinimg.com/originals/1f/00/c1/1f00c145a86555218d1ca484964860f9.jpg",
    "https://i.pinimg.com/originals/ba/18/1f/ba181fe281813e7d133fb634994bd053.jpg",
    "https://i.pinimg.com/originals/17/a9/df/17a9df0d5290945e00e123ac6ed9b6af.jpg",
    "https://i.pinimg.com/originals/a2/a7/7a/a2a77a83b0426b56ec07d2d1edb82154.jpg",
    "https://i.pinimg.com/originals/c7/22/e9/c722e9c96eee53f2cf37da4b04b952ca.jpg",
    "https://i.pinimg.com/originals/3e/5a/2a/3e5a2a4f69c2b56d4da544ebf9e8b28e.jpg",
    "https://i.pinimg.com/originals/f2/c0/14/f2c014e1bb731ef071ea54b9015aa695.jpg",
    "https://i.pinimg.com/originals/c4/e1/c1/c4e1c19f530f81727bb588572551680c.jpg",
    "https://i.pinimg.com/originals/36/4f/0e/364f0e74f70557f69658c048e2601c87.jpg",
    "https://i.pinimg.com/originals/99/29/75/992975a74f52f2a5467fa72821a09b1d.jpg",
    "https://i.pinimg.com/originals/fc/9b/cb/fc9bcb2675c1d187f5d8cf58bcfb76d0.jpg",
    "https://i.pinimg.com/originals/d0/e4/d0/d0e4d05be733824f4d1b4e3e9ecce4ce.jpg",
    "https://i.pinimg.com/originals/91/b1/85/91b185a3fc457a7590120ccda37adea9.jpg",
];

// ─── Vietnamese Name Data ────────────────────────────────────────────────────
const HO_LIST: string[] = [
    "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ",
    "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Đinh", "Tô", "Trương",
    "Mai", "Hà", "Cao", "Đoàn", "Vương", "Lưu", "Thái", "Tăng", "Trịnh",
    "Châu", "Tạ", "Mạc", "Giang",
];
const TEN_NU: string[] = [
    "Anh", "Chi", "Diệu", "Giang", "Hà", "Hằng", "Hoa", "Hương", "Lan",
    "Liên", "Linh", "Mai", "My", "Ngân", "Nhi", "Nhung", "Phương", "Tâm",
    "Thảo", "Thu", "Thư", "Thủy", "Trang", "Trinh", "Uyên", "Vân", "Xuân",
    "Yến", "Ánh", "Châu", "Duyên", "Hạnh", "Hiền", "Huệ", "Khanh", "Loan",
    "Ngọc", "Như", "Quỳnh", "Thanh", "Thiên", "Trâm", "Tuyết", "Vy",
];
const TEN_DEM_NU: string[] = [
    "Thị", "Ngọc", "Thu", "Thanh", "Kim", "Bích", "Lan", "Phương", "Mỹ",
    "Hà", "Bảo", "Diệu", "Hồng", "Minh", "Như", "Tuyết", "Yến", "Khánh",
];
const BIO_TEMPLATES: Array<(name: string) => string> = [
    (n) => `Xin chào, mình là ${n} 👋 Đam mê công nghệ và cà phê ☕`,
    (n) => `${n} | Sống chậm lại, nghĩ nhiều hơn 🌿`,
    (n) => `Mình là ${n}. Thích đọc sách, nghe nhạc và đi café 📚🎵`,
    (_) => `Developer ban ngày ☀️ Gamer ban đêm 🎮`,
    (n) => `${n} đây! Yêu Việt Nam 🇻🇳 | Foodie | Travel lover ✈️`,
    (_) => `"Sống là để trải nghiệm" – Đang học cách tận hưởng từng khoảnh khắc 🌸`,
    (n) => `Hi, tôi là ${n}. Đang xây dựng điều gì đó nhỏ nhưng có ý nghĩa 🛠️`,
    (_) => `Thiết kế | Sáng tạo | Cà phê không đường ☕🎨`,
    (n) => `${n} | Sinh viên năm 3 | Mê AI và Machine Learning 🤖`,
    (_) => `Photographer 📸 | Hà Nội → Sài Gòn → Đà Nẵng`,
    (n) => `Chào bạn! Mình là ${n}, thích chia sẻ kiến thức và học hỏi mỗi ngày 💡`,
    (_) => `Lập trình viên fullstack. Yêu OSS. Hay than vãn về deadline 😅`,
    (n) => `${n} | Marketing & Content Creator 📱 | HCM City`,
    (_) => `Đang trên hành trình tìm bản thân 🗺️ | Mỗi ngày một điều mới`,
    (n) => `${n} – Bác sĩ tương lai 🩺 | Yêu động vật 🐾`,
    (n) => `Xin chào! Tôi là ${n}. Đang cố không lướt MXH quá nhiều… 📵`,
    (_) => `Giáo viên tiếng Anh 🇬🇧 | Mê du lịch bụi | Đã đặt chân 15 tỉnh thành`,
    (n) => `${n} | UI/UX Designer | Figma addict 🎯`,
    (_) => `Coder by day, dreamer by night ✨ | Uống trà sữa để tồn tại 🧋`,
    (n) => `${n} | Product Manager | Đang xây sản phẩm cho người Việt 🇻🇳`,
    (_) => `Freelance designer. Remote work từ Đà Lạt 🌸 | Open for projects`,
    (n) => `${n} | Data Analyst | Excel đến Python | Đam mê số liệu 📊`,
    (n) => `${n} | Content creator | Tech, food & travel 🎬`,
    (_) => `Sinh viên IT năm cuối. Đang tìm kiếm cơ hội thực tập nghiêm túc 🔍`,
    (n) => `${n} | Startup founder | Failed twice, still going 💪`,
    (_) => `Trader | Investor | Tiền không mua được hạnh phúc nhưng mua được bình yên 😌`,
    (n) => `${n} | UI/UX | Mê màu pastel và clean design 🎀`,
    (_) => `Nấu ăn như mẹ dạy, code như Google dạy 👩‍💻`,
    (n) => `${n} — viết lách, cà phê, và overthinking 📝`,
    (_) => `Yêu thích yoga buổi sáng và debug buổi đêm 🧘`,
];

// ─── Post Contents ────────────────────────────────────────────────────────────
const POST_CONTENTS: string[] = [
    "Sáng nay mưa to quá mà vẫn phải ra đường 😭 ai ở Sài Gòn thấy hôm nay trời đẹp không hay mình bị ảo giác",
    "Vừa thử công thức bánh mì bơ tỏi lần đầu. Không ngon như quảng cáo tí nào 💀 nhưng ăn hết rồi nên cũng ok",
    "Hôm nay là thứ 6 rồi mà cảm giác như thứ 2 mới hôm qua. Ai đồng cảm với mình không ạ",
    "Cái cảm giác đặt ship đồ ăn xong ngủ quên, tỉnh dậy thấy shipper gọi 7 cuộc 😭",
    "Phòng gym mình vừa tăng giá thêm 200k/tháng mà không báo trước. Bye bye.",
    "Mình vừa phát hiện ra mình đã tưới cây bằng nước lọc suốt 6 tháng 🪴 đắt hơn cà phê",
    "Ra ngoài quên ví ở nhà. Về nhà quên điện thoại. Đi làm lần này không mang được gì hết 😮‍💨",
    "Hôm nay được khen tóc đẹp ở ngoài đường. Mình không quen với lời khen nên chỉ biết nói ừ cảm ơn rồi đi thẳng 🚶‍♀️",
    "Bún bò Huế sáng nay ăn với quẩy là đỉnh. Không cần gì thêm nữa trong cuộc đời này",
    "Ai biết quán phở gà ngon ở Q1 không chỉ mình với? Tìm hoài không ra cái chuẩn Hà Nội",
    "Review cà phê mới thử: vị ổn, không gian đẹp, wifi 2Mbps. 😐 Ở được 30 phút thì về",
    "Mình vừa ăn thử sầu riêng lần đầu. Mùi thì sợ nhưng vị thì... nghiện luôn??? Sao không ai cảnh báo trước",
    "Đặt đồ ăn 150k giao hàng phí 35k. Cảm giác đang nuôi shipper chứ không phải nuôi bản thân 😭",
    "Trà sữa mới mở đầu phố ngon hơn hẳn mấy chỗ kia. Trân châu dai vừa, không ngọt quá. Recommend 10/10",
    "Cơm tấm bì sườn chả ở nhà nấu không bao giờ ngon bằng ăn ngoài. Bí quyết họ cất ở đâu vậy",
    "Đà Lạt tháng này lạnh hơn mọi năm. Mang theo áo khoác mà vẫn rét run 🥶 nhưng mà đẹp thật sự",
    "Hội An 2 ngày vừa về. Phải đi buổi sáng sớm mới tránh được khách du lịch đông. Đẹp lắm không ai nói xạo",
    "Phan Thiết chưa ai đi thì đi đi. Biển đẹp, ít người hơn Nha Trang mà giá lại rẻ hơn nhiều",
    "Mình hay bị hỏi đi một mình có sợ không. Không. Một mình còn thoải mái hơn đi đông người 🙃",
    "Outfit hôm nay. Thời tiết Sài Gòn thất thường nên mặc gì cũng đúng cũng sai 🤷‍♀️",
    "Vừa thay tóc mới sau 2 năm để dài. Cảm giác nhẹ nhàng lạ thật 💇‍♀️",
    "Tuần này chạy bộ được 4 ngày liên tiếp. Kỷ lục cá nhân. Đang tự thưởng bằng cách nằm dài cả ngày hôm nay",
    "Bắt đầu uống nước đủ 2 lít/ngày từ tuần trước. Kết quả: đi toilet nhiều hơn. Chưa thấy kết quả gì khác",
    "Ngủ đủ 8 tiếng liên tục lần đầu sau 3 tháng. Cảm giác này không thể diễn tả bằng lời 😴",
    "Sếp vừa assign thêm project mà deadline tuần sau. Miệng nói ok, trong đầu đang tính đường thoát",
    "Meeting 2 tiếng mà nội dung có thể giải quyết qua email 5 phút. Đây là lý do nhân loại kiệt sức",
    "Vừa nhận được email offer mới. Lương cao hơn 30% nhưng không biết môi trường thế nào. Ai có kinh nghiệm đổi việc tư vấn",
    "Làm việc từ xa từ Đà Lạt được 1 tuần. Productive hơn ở văn phòng thật, không phải myth",
    "Bạn thân mình vừa thông báo kết hôn. Hạnh phúc cho nó mà tự nhiên thấy trôi nhanh quá",
    "Mình không giỏi duy trì liên lạc nhưng thật ra rất nhớ bạn bè cũ. Mọi người có giống mình không",
    "Bé mèo nhà mình lúc nào cũng giả vờ không cần ai nhưng 3h sáng lại lên nằm lên mặt mình 🐱",
    "Ai nuôi chó mà đang tìm chỗ gửi dịp Tết chỉ mình với. Năm ngoái để nhà hàng xóm trông mà tội lắm",
    "Ôn thi cả tuần xong vô phòng thi quên hết như chưa ôn bao giờ. Đây là bug của não người hay tính năng",
    "Học tiếng Nhật được 3 tháng rồi. Hôm nay đọc được biển hiệu cửa hàng mà không cần tra. Nhỏ thôi nhưng tự hào 🇯🇵",
    "Giá điện tháng này nhảy lên 700k mà mình còn chưa mua máy lạnh. Kinh hoàng thật sự",
    "Hôm qua đường Nguyễn Huệ có một bạn biểu diễn street art đẹp cực. Không biết tên nhưng tài thật sự",
    "Review series mới xem xong: 8/10, kết hơi vội nhưng diễn xuất đỉnh. Không spoil nhưng ai xem rồi hiểu ý mình",
    "Hôm nay làm được điều mình trì hoãn 3 tuần. Không ai biết nhưng mình biết, thế là đủ",
    "Khoảnh khắc ngồi uống cà phê một mình sáng sớm trước khi thành phố ồn ào lên. Thích cảm giác này nhất",
    "Năm nay mình quyết định không giải thích lý do từ chối những thứ không muốn làm. Sống nhẹ hơn hẳn",
    "Ai có link bài nhạc hôm qua viral trên TT không? Nghe được 10 giây rồi bị cuộn qua mất",
    "Vừa xóa app một hôm rồi cài lại. Khoảng cách digital detox của mình chỉ là 24 giờ 😮‍💨",
    "Cảm giác post xong 5 phút không ai like thì edit lại caption 3 lần rồi xóa rồi đăng lại 😂 đây là bình thường chứ",
    "Tự nhiên 2h sáng bật dậy nhớ năm lớp 9 thi trượt môn Văn. Não người thật sự không ổn định",
    "Mình vừa hoàn thành 100 ngày học tiếng Nhật liên tiếp. Streak Duolingo không bao giờ chết nữa 🔥",
    "Đặt mua đồ online 3 tháng trước rồi quên. Hôm nay bưu phẩm đến như nhận quà bất ngờ từ version cũ của mình",
    "Ai đã từng đi Phú Quốc tháng 7 chưa? Mưa có nhiều không? Đang plan chuyến hè",
    "Hôm nay lần đầu nấu được nồi phở từ đầu. 5 tiếng đứng bếp. Ngon thật sự hay mình đang tự lừa mình",
    "Coffee tasting event ở Q3 cuối tuần này ai có lịch không? Drop comment mình tag thêm người",
];

// ─── Circle Definitions ───────────────────────────────────────────────────────
interface CircleDef {
    name: string;
    description: string;
    visibility: Visibility;
    statusPeak: boolean;
    level: number;
    hpState: HpState;
}

const CIRCLES_DATA: CircleDef[] = [
    { name: "Hội Trader Việt 📉", description: "Cộng đồng đầu tư và giao dịch. Học từ lỗ.", visibility: Visibility.PUBLIC, statusPeak: false, level: 4, hpState: "dead" },
    { name: "Vpop Underground 🎤", description: "Nhạc indie Việt – underground – không mainstream.", visibility: Visibility.PRIVATE, statusPeak: false, level: 3, hpState: "dead" },
    { name: "Meme Cà Khịa 🔥", description: "Nơi sinh ra những meme thâm cay nhất mạng Việt.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "dead" },
    { name: "Hội Sách Ngoại Văn 📗", description: "Reading club sách tiếng Anh, Pháp, Nhật. Mỗi tháng 1 cuốn.", visibility: Visibility.PRIVATE, statusPeak: false, level: 2, hpState: "dead" },
    { name: "Saigon Night Runners 🌙", description: "Chạy bộ đêm khuya – 11pm đến 1am – Sài Gòn.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "dead" },
    { name: "Hội Mê Đồ Sneaker 👟", description: "Sneaker culture Việt Nam. Authenticate, trade, collect.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "dead" },
    { name: "Cộng Đồng Podcast VN 🎙️", description: "Làm podcast, nghe podcast, và tất cả về nội dung âm thanh.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "dead" },
    { name: "Hội Film Photography 📽️", description: "Nhiếp ảnh film – Analog – Darkroom. Chậm mà chắc.", visibility: Visibility.PRIVATE, statusPeak: false, level: 4, hpState: "dead" },
    { name: "Yoga Therapy VN 🌀", description: "Yoga trị liệu và phục hồi sức khỏe. Không cần kinh nghiệm.", visibility: Visibility.PRIVATE, statusPeak: false, level: 1, hpState: "dead" },
    { name: "Startup Graveyard 💀", description: "Kể chuyện startup thất bại để người khác không mắc lại.", visibility: Visibility.PUBLIC, statusPeak: false, level: 5, hpState: "dead" },
    { name: "Hội Bơi Lội Sáng Sớm 🏊", description: "Bơi 5am mỗi ngày. Nước lạnh nhưng tinh thần ấm.", visibility: Visibility.PUBLIC, statusPeak: false, level: 1, hpState: "dying" },
    { name: "Barista Club VN ☕", description: "Làm cà phê specialty tại nhà. Review máy, grinder, beans.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "dying" },
    { name: "Cộng Đồng Violinist VN 🎻", description: "Học violin từ người mới đến nâng cao. Chia sẻ sheet nhạc.", visibility: Visibility.PRIVATE, statusPeak: false, level: 2, hpState: "dying" },
    { name: "Hội Mê Đồ Handmade 🧵", description: "Tự làm quần áo, phụ kiện, nội thất. DIY hết mọi thứ.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "dying" },
    { name: "Digital Art Community VN 🖌️", description: "Illustration, concept art, character design. Chia sẻ tác phẩm.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "dying" },
    { name: "Hội Mê Bonsai & Kiểng 🎋", description: "Bonsai, cây kiểng, terrarium. Nghệ thuật cây xanh Việt Nam.", visibility: Visibility.PUBLIC, statusPeak: false, level: 1, hpState: "dying" },
    { name: "Cộng Đồng Jazz Việt 🎷", description: "Jazz, blues, soul Việt Nam. Từ tân thủ đến nghệ sĩ chuyên nghiệp.", visibility: Visibility.PRIVATE, statusPeak: false, level: 3, hpState: "dying" },
    { name: "Hội Tập Gym Buổi Sáng 💪", description: "6am wake up, gym lúc 7am. Kỷ luật mỗi ngày.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "dying" },
    { name: "Cộng Đồng Streamer Việt 🎮", description: "Hỗ trợ streamer mới, tips tăng viewer, setup streaming.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "sick" },
    { name: "Hội Review Game Indie 🕹️", description: "Game indie từ VN và thế giới. Honest review – no ads.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "sick" },
    { name: "Hội Nuôi Cá Cảnh 🐠", description: "Bể cá, thủy sinh, cá rồng. Kỹ thuật và kinh nghiệm nuôi.", visibility: Visibility.PUBLIC, statusPeak: false, level: 1, hpState: "sick" },
    { name: "Cộng Đồng Vận Động Viên Triathlon 🏅", description: "Bơi – Đạp xe – Chạy bộ. Training cho Triathlon VN.", visibility: Visibility.PRIVATE, statusPeak: false, level: 4, hpState: "sick" },
    { name: "Hội Mê Trà Sữa 🧋", description: "Review trà sữa, so sánh topping, tìm kiếm quán ngon mới.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "sick" },
    { name: "Cùng Học Lập Trình Web 💻", description: "HTML, CSS, JS, React. Học free – cùng nhau tiến bộ.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "sick" },
    { name: "Hội Mê Gốm Sứ & Đồ Thủ Công 🏺", description: "Làm gốm, sưu tập đồ thủ công. Chia sẻ kỹ thuật và tác phẩm.", visibility: Visibility.PRIVATE, statusPeak: false, level: 1, hpState: "sick" },
    { name: "Cộng Đồng Đầu Bếp Tự Học 🍽️", description: "Không học trường chef nhưng nấu ngon hơn nhà hàng.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "sick" },
    { name: "Hội Phim Kinh Dị Asian 👻", description: "Horror phim châu Á – Hàn, Nhật, Thái, Việt. Đủ thứ sợ.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "sick" },
    { name: "Cộng Đồng Chạy Bộ Cuối Tuần 🏃", description: "Chạy 5km đến marathon. Đăng ký giải cùng nhau.", visibility: Visibility.PUBLIC, statusPeak: true, level: 3, hpState: "sick" },
    { name: "Hội Yêu Thích Cocktail 🍹", description: "Pha cocktail tại nhà. Không cần bar chuyên nghiệp.", visibility: Visibility.PRIVATE, statusPeak: false, level: 2, hpState: "sick" },
    { name: "Cộng Đồng Đi Du Lịch Solo 🗺️", description: "Một mình vẫn vui. Tips, kinh nghiệm, kết bạn đồng hành.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "sick" },
    { name: "Hội Học Guitar Acoustic 🎸", description: "Tự học guitar từ 0. Chord, finger style, tab nhạc.", visibility: Visibility.PUBLIC, statusPeak: false, level: 1, hpState: "sick" },
    { name: "Sài Gòn Foodies 🍜", description: "Hội những người yêu ẩm thực Sài Gòn. Review quán ăn, công thức nấu ăn.", visibility: Visibility.PUBLIC, statusPeak: true, level: 5, hpState: "healthy" },
    { name: "Du Lịch Việt Nam 🏔️", description: "Chia sẻ kinh nghiệm du lịch trong nước. Địa điểm đẹp, homestay giá tốt.", visibility: Visibility.PUBLIC, statusPeak: false, level: 4, hpState: "healthy" },
    { name: "OOTD Vietnam 👗", description: "Cộng đồng chia sẻ outfit, review đồ, và thời trang đường phố.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Skincare & Beauty VN 💄", description: "Review skincare, chia sẻ routine, làm đẹp theo kiểu người Việt.", visibility: Visibility.PUBLIC, statusPeak: false, level: 5, hpState: "healthy" },
    { name: "Mèo Cún Việt Nam 🐱🐶", description: "Hội yêu thú cưng. Chia sẻ ảnh, kinh nghiệm chăm sóc.", visibility: Visibility.PUBLIC, statusPeak: true, level: 5, hpState: "healthy" },
    { name: "Nhạc Việt Xưa & Nay 🎵", description: "Từ nhạc vàng đến Vpop hiện đại. Chia sẻ bài hát hay.", visibility: Visibility.PRIVATE, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Phim & Series Chill 🎬", description: "Recommend phim, series, anime. Không spoil không được vào nhóm.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Gym & Fitness Girls 💪", description: "Cộng đồng nữ yêu thể thao. Chia sẻ lịch tập, chế độ ăn.", visibility: Visibility.PRIVATE, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Café Hopping HCM ☕", description: "Review cà phê, không gian làm việc tại HCM.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Hội Tự Nấu Ăn 🍳", description: "Chia sẻ công thức, tips nấu ăn ngon mà tiết kiệm.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Thiền & Wellness 🧘", description: "Meditation, yoga, sức khỏe tinh thần.", visibility: Visibility.PRIVATE, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Đọc Sách Cùng Nhau 📚", description: "Book club online. Mỗi tháng một cuốn, cùng đọc cùng thảo luận.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Digital Nomad VN 💻", description: "Cộng đồng làm việc remote ở Việt Nam.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Vẽ & Sáng Tạo 🎨", description: "Triển lãm tác phẩm, chia sẻ kỹ thuật và cảm hứng sáng tác.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Mẹ Bỉm Sữa Thời Đại Mới 👶", description: "Hội các mẹ trẻ. Chia sẻ kinh nghiệm nuôi con, tâm sự.", visibility: Visibility.PRIVATE, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Khởi Nghiệp Việt 🚀", description: "Cộng đồng startup, freelancer và những người dám nghĩ dám làm.", visibility: Visibility.PUBLIC, statusPeak: true, level: 5, hpState: "healthy" },
    { name: "Nhiếp Ảnh Đường Phố 📸", description: "Street photography Việt Nam. Từ điện thoại đến máy film.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Hội Troll Sáng Tạo 😂", description: "Meme, video hài, và mọi thứ khiến bạn phun nước vào màn hình.", visibility: Visibility.PUBLIC, statusPeak: true, level: 3, hpState: "healthy" },
    { name: "K-Pop & K-Drama VN 🇰🇷", description: "Fandom Hàn Quốc Việt Nam. Tin tức idol, review drama.", visibility: Visibility.PUBLIC, statusPeak: false, level: 4, hpState: "healthy" },
    { name: "Tài Chính Cá Nhân 💰", description: "Học cách tiết kiệm, đầu tư và quản lý tài chính thông minh.", visibility: Visibility.PRIVATE, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Hà Nội Old Town Vibes 🏮", description: "Cộng đồng người Hà Nội. Ảnh đẹp, kỷ niệm, địa chỉ hay.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Zero Waste Lifestyle 🌿", description: "Sống xanh, giảm rác, yêu môi trường. Tips thực tế.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Nhảy Và Vũ Đạo 💃", description: "Từ ballroom đến street dance, K-pop cover đến traditional.", visibility: Visibility.PUBLIC, statusPeak: true, level: 3, hpState: "healthy" },
    { name: "Hội Cô Đơn Tự Nguyện 🫥", description: "Cho những ai thích một mình và ổn với điều đó.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Âm Nhạc Underground VN 🎸", description: "Indie, underground, alternative, jazz. Nghệ sĩ độc lập.", visibility: Visibility.PRIVATE, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Chill & Travel Backpack 🎒", description: "Phượt bụi, du lịch tự túc, budget travel.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Tarot & Spiritual VN ✨", description: "Tarot, astrology, crystals và những điều huyền bí.", visibility: Visibility.PRIVATE, statusPeak: false, level: 1, hpState: "healthy" },
    { name: "Gen Z Confess 🫣", description: "Tâm sự ẩn danh, drama đời thường.", visibility: Visibility.PUBLIC, statusPeak: true, level: 5, hpState: "healthy" },
    { name: "Nấu Chay Sáng Tạo 🥗", description: "Công thức ăn chay ngon và đẹp. Không cần ăn nhạt.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Đà Nẵng Connect 🌊", description: "Cộng đồng người Đà Nẵng. Sự kiện, địa điểm, review.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Hội Chạy Bộ Sài Gòn 🏃", description: "Running club Sài Gòn. 5am morning runs – cùng nhau khỏe.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Yêu Thú Cưng HCM 🐾", description: "Hội thú cưng HCM. Chia sẻ ảnh, tìm bác sĩ tốt.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Cộng Đồng Gamer Việt 🎮", description: "FPS, MOBA, RPG – cùng nhau chơi và học hỏi.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Lập Trình Việt Nam 💻", description: "Hỗ trợ học lập trình, chia sẻ resource, tìm việc tech.", visibility: Visibility.PUBLIC, statusPeak: false, level: 5, hpState: "healthy" },
    { name: "Marketing & Growth VN 📈", description: "Digital marketing, growth hacking, personal branding.", visibility: Visibility.PUBLIC, statusPeak: false, level: 4, hpState: "healthy" },
    { name: "Thời Trang Vintage VN 👒", description: "Thrift shop, vintage fashion, sustainable style.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Street Food Vietnam 🌮", description: "Khám phá ẩm thực đường phố Việt Nam từ Bắc vào Nam.", visibility: Visibility.PUBLIC, statusPeak: true, level: 5, hpState: "healthy" },
    { name: "Hội Những Người Thức Đêm 🌙", description: "Night owls club. Tám chuyện, làm việc, sáng tác lúc đêm.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Làm Vườn Tại Nhà 🌱", description: "Trồng rau, hoa, cây ăn quả trong nhà phố và chung cư.", visibility: Visibility.PUBLIC, statusPeak: false, level: 1, hpState: "healthy" },
    { name: "Phượt Xe Máy Xuyên Việt 🏍️", description: "Phượt xe máy xuyên Việt. Lộ trình, kinh nghiệm.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Hội Mê Anime & Manga 🎌", description: "Fandom anime manga Việt Nam. Review, fanart, cosplay.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Cộng Đồng UX/UI Việt Nam 🎯", description: "UX/UI design community. Chia sẻ case study, roast portfolio.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Running Club Việt Nam 🏃‍♀️", description: "Cộng đồng chạy bộ cả nước. Kết nối runner mọi tỉnh thành.", visibility: Visibility.PUBLIC, statusPeak: true, level: 5, hpState: "healthy" },
    { name: "Hội Làm Bánh Tại Nhà 🍰", description: "Bánh ngọt, bánh mặn, bánh Việt Nam. Công thức và tips.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Hội Review Mỹ Phẩm Nội Địa 💅", description: "Review mỹ phẩm made in Vietnam. Thật – không quảng cáo.", visibility: Visibility.PUBLIC, statusPeak: true, level: 3, hpState: "healthy" },
    { name: "Học Tiếng Anh Cùng Nhau 🇬🇧", description: "Luyện tiếng Anh free. Speaking, writing, IELTS, TOEIC.", visibility: Visibility.PUBLIC, statusPeak: false, level: 4, hpState: "healthy" },
    { name: "Cộng Đồng Chạy Bộ Buổi Sáng 🌅", description: "5am run club. Kỷ luật, sức khỏe, cộng đồng.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Hội Đi Biển Cùng Nhau 🏖️", description: "Trip biển, lặn biển, surfing. Kết bạn đi cùng.", visibility: Visibility.PUBLIC, statusPeak: true, level: 2, hpState: "healthy" },
    { name: "Hội Yêu Thích Âm Nhạc Acoustic 🎵", description: "Guitar acoustic, ukulele, kalimba. Sống chậm hơn.", visibility: Visibility.PRIVATE, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Cùng Học Tiếng Hàn 🇰🇷", description: "Học tiếng Hàn từ con số 0. TOPIK, du học, Kdrama subs.", visibility: Visibility.PUBLIC, statusPeak: false, level: 3, hpState: "healthy" },
    { name: "Hội Foodie Hà Nội 🍜", description: "Phở Hà Nội, bún chả, bánh mì chả cá. Review quán ngon HN.", visibility: Visibility.PUBLIC, statusPeak: true, level: 4, hpState: "healthy" },
    { name: "Cộng Đồng Nail Art Việt Nam 💅", description: "Nail nghệ thuật, tự làm tại nhà, học kỹ thuật nail.", visibility: Visibility.PUBLIC, statusPeak: false, level: 2, hpState: "healthy" },
    { name: "Hội Mê Orchid & Cây Kiểng 🌸", description: "Lan, hoa lan, cây kiểng ngoại. Chăm cây đúng cách.", visibility: Visibility.PUBLIC, statusPeak: false, level: 1, hpState: "healthy" },
];

// ─── Seed Users ───────────────────────────────────────────────────────────────
interface SeedUser {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
    bio: string | null;
}
// ─── Seed Special Accounts (Admin + Moderator) ────────────────────────────────
// Schema dùng bảng roles + user_roles (many-to-many), KHÔNG có field role trên User
// Flow: upsert Role → tạo User → tạo UserRole

async function seedSpecialAccounts(): Promise<void> {
    const hashedPassword = await bcrypt.hash("12345678", 10);

    // 1. Upsert các Role cần thiết vào bảng roles
    const roleNames: UserRoleType[] = [UserRoleType.ADMIN, UserRoleType.MODERATOR, UserRoleType.USER];
    const roleMap: Record<string, string> = {}; // name → id

    for (const roleName of roleNames) {
        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
            select: { id: true, name: true },
        });
        roleMap[role.name] = role.id;    }

    // 2. Danh sách tài khoản đặc biệt cần tạo
    const specials: {
        email: string;
        username: string;
        name: string;
        bio: string;
        roleName: UserRoleType;
    }[] = [
            {
                email: "admin@huydarealest.com",
                username: "admin_huydarealest",
                name: "Quản Trị Viên",
                bio: "Quản trị hệ thống 🛡️",
                roleName: UserRoleType.ADMIN,
            },
            {
                email: "moderator@huydarealest.com",
                username: "moderator_huydarealest",
                name: "Kiểm Duyệt Viên",
                bio: "Kiểm duyệt nội dung 🔍",
                roleName: UserRoleType.MODERATOR,
            },
        ];

    for (const s of specials) {
        // 3. Upsert User (nếu đã tồn tại thì bỏ qua, không throw)
        const user = await prisma.user.upsert({
            where: { email: s.email },
            update: {}, // không đổi gì nếu đã có
            create: {
                email: s.email,
                username: s.username,
                password: hashedPassword,
                name: s.name,
                bio: s.bio,
                avatar: null,
                status: UserStatus.ACTIVE,
                isPrivate: false,
                followersCount: 0,
                followingCount: 0,
                postsCount: 0,
                verifiedAt: new Date(),
            },
            select: { id: true, email: true },
        });

        // 4. Upsert UserRole — tránh duplicate nếu chạy seed nhiều lần
        const roleId = roleMap[s.roleName];
        const existingUserRole = await prisma.userRole.findFirst({
            where: { userId: user.id, roleId },
        });

        if (!existingUserRole) {
            await prisma.userRole.create({
                data: { userId: user.id, roleId },
            });        } else {        }
    }}
async function seedUsers(): Promise<SeedUser[]> {
    const hashedPassword = await bcrypt.hash("12345678", 10);
    const usedUsernames = new Set<string>();
    const usedEmails = new Set<string>();

    const userList: {
        email: string; username: string; password: string; name: string;
        bio: string; avatar: string; status: UserStatus;
        isPrivate: boolean; followersCount: number; followingCount: number;
        postsCount: number; verifiedAt: Date | null;
    }[] = [];

    for (let i = 0; i < 200; i++) {
        const avatar = AVATAR_URLS[i];
        const ho = pick(HO_LIST);
        const tenDem = pick(TEN_DEM_NU);
        const ten = pick(TEN_NU);
        const fullName = `${ho} ${tenDem} ${ten}`;

        let username = `${slugify(fullName)}${String(i + 1).padStart(3, "0")}`;
        let attempt = 0;
        while (usedUsernames.has(username)) {
            attempt++;
            username = `${slugify(fullName)}${String(i + 1).padStart(3, "0")}x${attempt}`;
        }
        usedUsernames.add(username);
        const email = `${username}@gmail.com`;
        usedEmails.add(email);

        userList.push({
            email,
            username,
            password: hashedPassword,
            name: fullName,
            bio: pick(BIO_TEMPLATES)(ten),
            avatar,
            status: UserStatus.ACTIVE,
            isPrivate: Math.random() < 0.05,
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
            verifiedAt: Math.random() < 0.3
                ? new Date(Date.now() - Math.random() * 1.5e10)
                : null,
        });
    }


    await prisma.user.createMany({ data: userList, skipDuplicates: true });
    const users = await prisma.user.findMany({
        where: { deletedAt: null, status: UserStatus.ACTIVE },
        select: { id: true, username: true, name: true, avatar: true, bio: true },
        orderBy: { createdAt: "desc" },
        take: 200,
    });    return users as SeedUser[];
}

// ─── Seed Posts ───────────────────────────────────────────────────────────────
async function seedPosts(users: SeedUser[]): Promise<void> {
    let postCount = 0;
    let imgIdx = 0;
    const TARGET = 300;

    // Shuffle users to randomise distribution
    const shuffled = shuffle(users);

    for (let i = 0; i < shuffled.length && postCount < TARGET; i++) {
        const author = shuffled[i];
        // 100 users get 2 posts, rest get 1 – totals exactly 300
        const numPosts = postCount < 100 ? 2 : 1;
        const batchEnd = Math.min(numPosts, TARGET - postCount);

        for (let p = 0; p < batchEnd; p++) {
            const numImages = rand(2, 5);
            const content = pick(POST_CONTENTS);
            const createdAt = randomDate(90);

            const post = await prisma.post.create({
                data: {
                    userId: author.id,
                    content,
                    type: PostType.POST,
                    visibility: VisibilityPost.PUBLIC,
                    replyPermission: pick([
                        ReplyPermission.EVERYONE,
                        ReplyPermission.EVERYONE,
                        ReplyPermission.FOLLOWERS,
                        ReplyPermission.MENTIONED,
                    ]),
                    userSnapshot: {
                        id: author.id,
                        username: author.username,
                        name: author.name,
                        avatar: author.avatar,
                        bio: author.bio,
                    },
                    // Counts all zero – no fake engagement
                    likesCount: 0,
                    repliesCount: 0,
                    repostsCountAndQuoteCount: 0,
                    viewsCount: 0,
                    createdAt,
                    updatedAt: createdAt,
                },
                select: { id: true },
            });

            const mediaItems = Array.from({ length: numImages }, (_, m) => {
                const url = POST_IMAGE_POOL[imgIdx++ % POST_IMAGE_POOL.length];
                return {
                    postId: post.id,
                    url,
                    type: PostMediaType.IMAGE,
                    width: pick([720, 1080, 1280]),
                    height: pick([720, 1080, 1350]),
                    key: `seed_post_${post.id}_${m}_${Date.now() + imgIdx}`,
                    status: PostMediaStatus.UPLOADED,
                };
            });
            await prisma.postMedia.createMany({ data: mediaItems });

            postCount++;
        }
        process.stdout.write(`\r   → ${postCount}/${TARGET} posts`);
    }}

// ─── Seed Circles ─────────────────────────────────────────────────────────────
async function seedCircles(users: SeedUser[]): Promise<void> {
    const statusIcon = (s: HpState) => {
        switch (s) {
            case "healthy": return "💚";
            case "sick": return "🟡";
            case "dying": return "🟠";
            case "dead": return "💀";
        }
    };

    for (const [i, def] of CIRCLES_DATA.entries()) {
        const owner = users[i % users.length];
        const cfg = LEVEL_CONFIG[def.level];
        const currentHp = calcCurrentHp(cfg.maxHp, def.hpState);
        const exp = rand(cfg.minExp, cfg.maxExp);

        // Create circle
        const circle = await prisma.circle.create({
            data: {
                name: def.name,
                description: def.description,
                visibility: def.visibility,
                statusPeak: def.statusPeak,
                createById: owner.id,
                createdAt: randomDate(120),
            },
            select: { id: true, publicId: true },
        });

        // Create CircleEnergy (correct level/exp/hp)
        await prisma.circleEnergy.create({
            data: {
                circleId: circle.id,
                level: def.level,
                exp,
                current: currentHp,
                max: cfg.maxHp,
                peak: cfg.maxHp,       // peak = theoretical max for that level
            },
        });

        // Creator as OWNER (không phải ADMIN — chỉ OWNER mới có full quyền)
        await prisma.circleMember.create({
            data: { circleId: circle.id, userId: owner.id, role: RoleMembership.OWNER },
        });

        // Pick 40–70 additional random members (never the owner)
        const memberPool = shuffle(users.filter(u => u.id !== owner.id));
        const memberCount = rand(40, Math.min(70, memberPool.length));
        const members = memberPool.slice(0, memberCount);

        // One extra admin among members
        await prisma.circleMember.createMany({
            data: members.map((u, mi) => ({
                circleId: circle.id,
                userId: u.id,
                role: mi === 0 ? RoleMembership.ADMIN : RoleMembership.MEMBER,
            })),
            skipDuplicates: true,
        });

        const totalMembers = memberCount + 1; // +1 owner
        const icon = def.statusPeak ? "🔥" : "  ";
        const vis = def.visibility === "PUBLIC" ? "🌐" : "🔒";
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
    await seedSpecialAccounts();
    const users = await seedUsers();
    if (users.length === 0) throw new Error("No users found after seed – aborting.");

    await seedPosts(users);
    await seedCircles(users);

    // ── Final summary ──────────────────────────────────────────────────────────
    const [totalUsers, totalPosts, totalMedia, totalCircles, totalMembers] =
        await Promise.all([
            prisma.user.count({ where: { status: UserStatus.ACTIVE, deletedAt: null } }),
            prisma.post.count({ where: { type: PostType.POST, isDeleted: false } }),
            prisma.postMedia.count(),
            prisma.circle.count(),
            prisma.circleMember.count(),
        ]);}

main()
    .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());
