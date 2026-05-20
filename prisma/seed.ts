// // prisma/seed.ts — Combined seed: users → posts → posts+media → circles → circle members
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import {
//     PostMediaStatus,
//     PostMediaType,
//     PostType,
//     PrismaClient,
//     ReplyPermission,
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

// // ─── Shared helpers ───────────────────────────────────────────────────────────

// function pick<T>(arr: T[]): T {
//     return arr[Math.floor(Math.random() * arr.length)];
// }

// function pickOther<T extends { id: string }>(arr: T[], excludeId: string): T {
//     const filtered = arr.filter((u) => u.id !== excludeId);
//     return pick(filtered);
// }

// function rand(min: number, max: number) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function randomDate(daysAgo: number): Date {
//     return new Date(Date.now() - Math.random() * daysAgo * 86_400_000);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // 1. SEED USERS
// // ─────────────────────────────────────────────────────────────────────────────

// const hoList = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Đinh", "Tô", "Trương", "Mai"];
// const tenNam = ["An", "Bình", "Cường", "Dũng", "Đạt", "Hải", "Hiếu", "Hùng", "Khoa", "Khôi", "Lâm", "Long", "Minh", "Nam", "Nghĩa", "Nhân", "Phong", "Quân", "Quang", "Sơn", "Tài", "Thắng", "Thiện", "Toàn", "Trí", "Trọng", "Tuấn", "Tú", "Việt", "Vũ"];
// const tenNu = ["Anh", "Chi", "Diệu", "Giang", "Hà", "Hằng", "Hoa", "Hương", "Lan", "Liên", "Linh", "Mai", "My", "Ngân", "Nhi", "Nhung", "Phương", "Tâm", "Thảo", "Thu", "Thư", "Thủy", "Trang", "Trinh", "Uyên", "Vân", "Xuân", "Yến"];
// const tenDemNam = ["Văn", "Hữu", "Đức", "Minh", "Quốc", "Thành", "Anh", "Ngọc", "Công", "Bảo"];
// const tenDemNu = ["Thị", "Ngọc", "Thu", "Thanh", "Kim", "Bích", "Lan", "Phương", "Mỹ", "Hà"];

// const bioTemplates: Array<(name: string) => string> = [
//     (name) => `Xin chào, mình là ${name} 👋 Đam mê công nghệ và cà phê ☕`,
//     (name) => `${name} | Sống chậm lại, nghĩ nhiều hơn 🌿`,
//     (name) => `Mình là ${name}. Thích đọc sách, nghe nhạc và đi café 📚🎵`,
//     (_) => `Developer ban ngày ☀️ Gamer ban đêm 🎮`,
//     (name) => `${name} đây! Yêu Việt Nam 🇻🇳 | Foodie | Travel lover ✈️`,
//     (_) => `"Sống là để trải nghiệm" – Đang học cách tận hưởng từng khoảnh khắc 🌸`,
//     (name) => `Hi, tôi là ${name}. Đang xây dựng điều gì đó nhỏ nhưng có ý nghĩa 🛠️`,
//     (_) => `Thiết kế | Sáng tạo | Cà phê không đường ☕🎨`,
//     (name) => `${name} | Sinh viên năm 3 | Mê AI và Machine Learning 🤖`,
//     (_) => `Photographer 📸 | Hà Nội → Sài Gòn → Đà Nẵng`,
//     (name) => `Chào bạn! Mình là ${name}, thích chia sẻ kiến thức và học hỏi mỗi ngày 💡`,
//     (_) => `Lập trình viên fullstack. Yêu OSS. Hay than vãn về deadline 😅`,
//     (name) => `${name} | Marketing & Content Creator 📱 | HCM City`,
//     (_) => `Đang trên hành trình tìm bản thân 🗺️ | Mỗi ngày một điều mới`,
//     (name) => `${name} – Bác sĩ tương lai 🩺 | Yêu động vật 🐾`,
//     (_) => `Trader | Investor | "Tiền không mua được hạnh phúc nhưng mua được bình yên" 😌`,
//     (name) => `Xin chào! Tôi là ${name}. Đang cố không lướt mạng xã hội quá nhiều… 📵`,
//     (_) => `Giáo viên tiếng Anh 🇬🇧 | Mê du lịch bụi | Đã đặt chân 15 tỉnh thành`,
//     (name) => `${name} | UI/UX Designer | Figma addict 🎯`,
//     (_) => `Coder by day, dreamer by night ✨ | Uống trà sữa để tồn tại 🧋`,
// ];

// function slugify(str: string): string {
//     return str
//         .normalize("NFD")
//         .replace(/[\u0300-\u036f]/g, "")
//         .replace(/đ/g, "d").replace(/Đ/g, "D")
//         .replace(/[^a-zA-Z0-9]/g, "")
//         .toLowerCase();
// }

// function makeUsername(fullName: string, index: number): string {
//     return `${slugify(fullName)}${String(index + 1).padStart(2, "0")}`;
// }

// interface UserSeedData {
//     email: string; username: string; password: string; name: string;
//     bio: string; avatar: string | null; status: UserStatus; isPrivate: boolean;
//     followersCount: number; followingCount: number; postsCount: number;
//     verifiedAt: Date | null;
// }

// function generateUserData(index: number): UserSeedData {
//     const isNam = Math.random() < 0.5;
//     const ho = pick(hoList);
//     const tenDem = isNam ? pick(tenDemNam) : pick(tenDemNu);
//     const ten = isNam ? pick(tenNam) : pick(tenNu);
//     const fullName = `${ho} ${tenDem} ${ten}`;
//     const username = makeUsername(fullName, index);
//     return {
//         email: `${username}@gmail.com`,
//         username,
//         password: "",
//         name: fullName,
//         bio: pick(bioTemplates)(ten),
//         avatar: null,
//         status: UserStatus.ACTIVE,
//         isPrivate: Math.random() < 0.05,
//         followersCount: rand(0, 2000),
//         followingCount: rand(0, 500),
//         postsCount: rand(0, 200),
//         verifiedAt: Math.random() < 0.3 ? new Date(Date.now() - Math.random() * 1e10) : null,
//     };
// }

// async function seedUsers() {
//     console.log("\n👤 [1/4] Seed 100 users...");
//     const hashed = await bcrypt.hash("12345678", 10);
//     const usedUsernames = new Set<string>();
//     const usedEmails = new Set<string>();
//     const usersData: UserSeedData[] = [];

//     for (let i = 0; i < 100; i++) {
//         let data = generateUserData(i);
//         let attempt = 0;
//         while (usedUsernames.has(data.username) || usedEmails.has(data.email)) {
//             attempt++;
//             data = generateUserData(i + attempt * 1000);
//             data.username = `${data.username}${attempt}`;
//             data.email = `${data.username}@gmail.com`;
//         }
//         usedUsernames.add(data.username);
//         usedEmails.add(data.email);
//         usersData.push({ ...data, password: hashed });
//     }

//     let created = 0, skipped = 0;
//     for (const u of usersData) {
//         const exists = await prisma.user.findFirst({
//             where: { OR: [{ email: u.email }, { username: u.username }] },
//         });
//         if (exists) { skipped++; continue; }
//         await prisma.user.create({
//             data: {
//                 email: u.email, username: u.username, password: u.password,
//                 name: u.name, bio: u.bio, avatar: u.avatar, status: u.status,
//                 isPrivate: u.isPrivate, followersCount: u.followersCount,
//                 followingCount: u.followingCount, postsCount: u.postsCount,
//                 verifiedAt: u.verifiedAt,
//             },
//         });
//         created++;
//     }
//     console.log(`   ✅ Tạo: ${created} | Bỏ qua (đã có): ${skipped}`);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // 2. SEED POSTS (text only)
// // ─────────────────────────────────────────────────────────────────────────────

// const POST_CONTENTS = [
//     "Sáng nay uống cà phê một mình, nhìn ra ngoài cửa sổ, bỗng thấy cuộc đời này đẹp thật ☕🌿",
//     "Ai đang học lập trình không? Chia sẻ kinh nghiệm tự học với mình với 🙋",
//     "Vừa deploy xong feature làm cả tuần. Cảm giác này không có gì bằng 🚀",
//     "Hà Nội hôm nay mưa to, nằm nhà nghe nhạc thôi 🎵🌧️",
//     "Mọi người đang xài tool gì để quản lý task cá nhân? Notion hay Obsidian?",
//     "Đôi khi mình tự hỏi, mình đang chạy theo mục tiêu hay đang trốn tránh điều gì đó 🤔",
//     "Tip cho dân dev: đặt tên biến rõ ràng hơn comment dài dòng. Code tự document chính nó 👨‍💻",
//     "Sài Gòn 11 giờ đêm vẫn đông như ban ngày. Thành phố này không bao giờ ngủ 🌃",
//     "Vừa đọc xong 'Sapiens'. Ai đọc rồi cùng discuss nhé, nhiều điểm rất thú vị 📖",
//     "Hot take: Remote work không phải ai cũng hợp. Cần self-discipline cực cao mới làm lâu được",
//     "Hôm nay ăn bún bò, ngon đến mức quên luôn diet 😭🍜",
//     "Mình bắt đầu chạy bộ sáng từ 3 tháng trước. Đây là những gì thay đổi sau 90 ngày 🏃",
//     "Câu hỏi nghiêm túc: mọi người có hay nói chuyện với ChatGPT khi buồn không? 😅",
//     "Junior dev vs Senior dev không phải là số năm kinh nghiệm, mà là cách giải quyết vấn đề 💡",
//     "Cuối tuần này Đà Lạt hay Vũng Tàu? Cần ý kiến gấp 🏔️🌊",
//     "Mình nhận ra mình học tốt nhất lúc... 2 giờ sáng. Não người thật kỳ lạ 🧠",
//     "Review quán cà phê mới ở Q.1: không gian đẹp, wifi ổn, nhưng giá hơi chát ☕",
//     "Ai có kinh nghiệm freelance không? Mình đang phân vân giữa full-time và freelance 🤷",
//     "Lần đầu present trước 50 người. Run lắm nhưng xong rồi thấy tự tin hơn nhiều 🎤",
//     "Mọi người nghĩ sao về xu hướng AI đang thay thế nhiều nghề nghiệp? Lo hay không lo?",
//     "Vừa setup xong bàn làm việc mới. Productivity tăng hẳn khi môi trường gọn gàng 🖥️",
//     "Đọc sách giấy vs sách điện tử - mình vẫn thích cầm sách thật trên tay hơn 📚",
//     "Học ngoại ngữ hiệu quả nhất theo mình là: immersion + thực hành mỗi ngày, không có shortcut",
//     "Hôm nay là sinh nhật mình 🎂 Cảm ơn tất cả mọi người đã nhớ đến!",
//     "TypeScript strict mode lần đầu dùng: muốn bỏ cuộc. Sau 1 tháng: không thể sống thiếu nó",
//     "Mẹ mình vừa học dùng smartphone. Cảm giác dạy ba mẹ dùng công nghệ vừa vui vừa... kiên nhẫn 😄",
//     "Tip tiết kiệm tiền hiệu quả: ghi chép chi tiêu mỗi ngày, dù chỉ mất 2 phút 💰",
//     "Sự khác biệt giữa busy và productive mình mãi gần đây mới thực sự hiểu ra",
//     "Ai ở Hà Nội không? Recommend cho mình quán ăn ngon khu Cầu Giấy với 🍽️",
//     "Vừa pass technical interview ở công ty mơ ước. Ôn 3 tháng cuối cùng cũng có kết quả 🙏",
//     "Burnout là có thật. Đừng cố gắng heroic khi cơ thể và đầu óc đang cần nghỉ ngơi",
//     "Side project của mình vừa đạt 100 users đầu tiên. Nhỏ thôi nhưng ý nghĩa lắm 🥹",
//     "Docker + WSL2 trên Windows giờ mượt lắm rồi. Anh em Windows dev không cần ghen tị Mac nữa 😏",
//     "Mình đang đọc về stoicism. Triết học này áp dụng vào cuộc sống hàng ngày được nhiều lắm",
//     "Đà Nẵng tháng 6 nắng cháy da nhưng biển đẹp kinh khủng 🏖️ Worth it!",
//     "Một ngày không scroll mạng xã hội: năng suất tăng gấp đôi. Đáng sợ thật sự 😬",
//     "Mọi người dùng framework gì cho backend Node.js? Express, Fastify hay NestJS?",
//     "Khoảnh khắc code chạy sau cả tiếng debug không có cảm giác nào sướng hơn 😤✨",
//     "Góc tâm sự: áp lực so sánh bản thân với người khác trên mạng xã hội thật sự mệt mỏi",
//     "Mình vừa học xong khóa design cơ bản. Bây giờ nhìn logo xấu là đau mắt ngay 👁️",
//     "Vietnamese street food là di sản văn hóa phi vật thể, không có gì tranh cãi 🍜🇻🇳",
//     "Open source contribution đầu tiên được merge. Nhỏ thôi nhưng hạnh phúc không tả được 🎉",
//     "Work-life balance không phải 50/50 mỗi ngày, mà là cân bằng theo từng giai đoạn cuộc đời",
//     "Mưa Sài Gòn chiều nào cũng đúng 3-5 giờ. Dự đoán chính xác hơn cả weather app 🌧️",
//     "Vừa thử intermittent fasting được 2 tuần. Kết quả: ngủ ngon hơn, tập trung hơn, đói hơn 😂",
//     "Nguyên tắc mình giữ khi làm việc nhóm: nói thẳng nhưng tử tế, không để hiểu nhầm tích tụ",
//     "PostgreSQL vs MySQL - mình đã switch và không nhìn lại. Ai cần lý do thì hỏi mình 🐘",
//     "Chiều nay ngồi công viên đọc sách, không điện thoại 1 tiếng. Recommend mọi người thử 🌳",
//     "Các bạn trẻ mới ra trường: đừng sợ nhận job lương thấp hơn nếu môi trường học được nhiều hơn",
//     "Mình đang build một app nhỏ giải quyết vấn đề của chính mình. Ai muốn beta test không? 🛠️",
// ];

// const POST_REPLY_CONTENTS = [
//     "Đồng ý với bạn 100% luôn! Mình cũng vậy 👏",
//     "Thật ra mình cũng đang tự hỏi điều tương tự 🤔",
//     "Ủa giống mình quá vậy 😂 Hôm qua mình cũng vừa trải qua",
//     "Bạn nói rất đúng, nhưng mình nghĩ còn một góc nhìn khác nữa...",
//     "Cảm ơn bạn đã chia sẻ, đọc xong thấy nhẹ lòng hơn nhiều 🙏",
//     "Lmao mình cũng y chang bạn luôn 😭",
//     "Theo mình thì nên thử thêm một vài cách khác xem sao",
//     "Haha đúng quá, ai mà không biết cảm giác này chứ",
//     "Bạn có thể kể thêm không? Mình tò mò lắm 👀",
//     "Ôi trời mình đang cần nghe điều này hôm nay, cảm ơn bạn nhiều!",
//     "Mình không đồng ý lắm, vì theo kinh nghiệm của mình thì...",
//     "Quá chill luôn, mình muốn làm điều này lắm 😌",
//     "Bạn recommend app/tool gì để bắt đầu không?",
//     "Đây là reminder mình cần hôm nay 💪",
//     "Mình đã làm điều này được 6 tháng rồi, thực sự thay đổi nhiều lắm",
//     "Bạn làm ở đâu vậy? Công ty có tuyển không hỏi thẳng luôn 😂",
//     "Cần khai thác topic này nhiều hơn, bạn post tiếp đi!",
//     "Mình đang ở bước đầu, bạn có tips gì không?",
//     "Sự thật đau lòng nhưng cần nghe 😤",
//     "+1, hoàn toàn đồng ý với bạn",
// ];

// const POST_QUOTE_CONTENTS = [
//     "Bài này hay quá, mình muốn thêm: đừng quên nghỉ ngơi cũng là một phần của quá trình 🌿",
//     "Đồng ý! Và mình nghĩ điều quan trọng hơn là bắt đầu từ những thứ nhỏ nhất",
//     "Thêm vào đây: việc này cực kỳ đúng với dân IT, mình thấy ở mọi team mình từng làm",
//     "Quote lại vì quá relevant với tình trạng của mình lúc này 😅",
//     "Bổ sung thêm góc nhìn: điều này cũng áp dụng được cho cả cuộc sống cá nhân, không chỉ công việc",
//     "Mình đồng ý nhưng có một exception: khi bạn đang trong flow state thì đừng dừng lại 🔥",
//     "Cái này mình đã thực hành 6 tháng và confirm là đúng. Highly recommend!",
//     "Thêm context: mình đã sai vì không làm điều này sớm hơn 🫠",
//     "Chia sẻ lại vì bạn bè mình cần đọc cái này ngay hôm nay",
//     "Góc nhìn của bạn hay lắm. Mình muốn counter một chút: và nếu không thì sao?",
// ];

// async function seedPosts(users: { id: string; username: string; name: string; avatar: string | null; bio: string | null }[]) {
//     console.log("\n📝 [2/4] Seed 100 posts (text)...");

//     const createdPosts: { id: number; publicId: string; userId: string }[] = [];

//     for (let i = 0; i < 100; i++) {
//         const author = users[i % users.length];
//         const createdAt = randomDate(60);

//         const post = await prisma.post.create({
//             data: {
//                 userId: author.id,
//                 content: POST_CONTENTS[i % POST_CONTENTS.length],
//                 type: PostType.POST,
//                 visibility: VisibilityPost.PUBLIC,
//                 replyPermission: pick([ReplyPermission.EVERYONE, ReplyPermission.FOLLOWERS, ReplyPermission.EVERYONE, ReplyPermission.EVERYONE]),
//                 userSnapshot: { id: author.id, username: author.username, name: author.name, avatar: author.avatar, bio: author.bio },
//                 likesCount: rand(0, 500),
//                 repliesCount: 40,
//                 repostsCountAndQuoteCount: 40,
//                 viewsCount: rand(0, 10000),
//                 createdAt,
//                 updatedAt: createdAt,
//             },
//             select: { id: true, publicId: true, userId: true },
//         });

//         createdPosts.push(post);
//         if ((i + 1) % 20 === 0) console.log(`   → ${i + 1}/100 posts`);
//     }

//     // Replies
//     console.log("   💬 Tạo replies...");
//     for (let pi = 0; pi < createdPosts.length; pi++) {
//         const p = createdPosts[pi];
//         await prisma.post.createMany({
//             data: Array.from({ length: 40 }, (_, ri) => {
//                 const replier = pickOther(users, p.userId);
//                 const createdAt = randomDate(30);
//                 return {
//                     userId: replier.id,
//                     content: POST_REPLY_CONTENTS[(pi * 40 + ri) % POST_REPLY_CONTENTS.length],
//                     type: PostType.REPLY,
//                     visibility: VisibilityPost.PUBLIC,
//                     replyPermission: ReplyPermission.EVERYONE,
//                     parentId: p.id, parentPublicId: p.publicId,
//                     rootPostId: p.id, rootPublicId: p.publicId,
//                     userSnapshot: { id: replier.id, username: replier.username, name: replier.name, avatar: replier.avatar, bio: replier.bio },
//                     likesCount: rand(0, 100), repliesCount: 0, repostsCountAndQuoteCount: 0,
//                     viewsCount: rand(0, 1000), createdAt, updatedAt: createdAt,
//                 };
//             }),
//         });
//         if ((pi + 1) % 20 === 0) console.log(`   → Replies: ${pi + 1}/100`);
//     }

//     // Quotes
//     console.log("   🔁 Tạo quotes...");
//     for (let pi = 0; pi < createdPosts.length; pi++) {
//         const p = createdPosts[pi];
//         await prisma.post.createMany({
//             data: Array.from({ length: 40 }, (_, qi) => {
//                 const quoter = pickOther(users, p.userId);
//                 const createdAt = randomDate(30);
//                 return {
//                     userId: quoter.id,
//                     content: POST_QUOTE_CONTENTS[(pi * 40 + qi) % POST_QUOTE_CONTENTS.length],
//                     type: PostType.QUOTE,
//                     visibility: VisibilityPost.PUBLIC,
//                     replyPermission: ReplyPermission.EVERYONE,
//                     originPostId: p.id, originPublicId: p.publicId,
//                     isQuote: true,
//                     userSnapshot: { id: quoter.id, username: quoter.username, name: quoter.name, avatar: quoter.avatar, bio: quoter.bio },
//                     likesCount: rand(0, 150), repliesCount: 0, repostsCountAndQuoteCount: 0,
//                     viewsCount: rand(0, 2000), createdAt, updatedAt: createdAt,
//                 };
//             }),
//         });
//         if ((pi + 1) % 20 === 0) console.log(`   → Quotes: ${pi + 1}/100`);
//     }

//     console.log("   ✅ 100 posts + 4,000 replies + 4,000 quotes");
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // 3. SEED POSTS + MEDIA
// // ─────────────────────────────────────────────────────────────────────────────

// const IMAGE_SEEDS = [
//     { seed: "hanoi01", w: 1080, h: 1080 }, { seed: "saigon02", w: 1080, h: 1350 },
//     { seed: "danang03", w: 1080, h: 720 }, { seed: "dalat04", w: 1080, h: 1080 },
//     { seed: "coffee05", w: 800, h: 800 }, { seed: "food06", w: 1080, h: 1080 },
//     { seed: "street07", w: 1080, h: 720 }, { seed: "nature08", w: 1200, h: 800 },
//     { seed: "desk09", w: 1080, h: 1080 }, { seed: "sunset10", w: 1200, h: 630 },
//     { seed: "cat11", w: 800, h: 800 }, { seed: "book12", w: 1080, h: 1080 },
//     { seed: "gym13", w: 1080, h: 1350 }, { seed: "market14", w: 1080, h: 720 },
//     { seed: "flower15", w: 800, h: 1000 }, { seed: "rain16", w: 1080, h: 1080 },
//     { seed: "lake17", w: 1200, h: 800 }, { seed: "pho18", w: 1080, h: 1080 },
//     { seed: "work19", w: 1080, h: 720 }, { seed: "sky20", w: 1200, h: 630 },
// ];

// const VIDEO_POOL = [
//     { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", w: 1280, h: 720 },
//     { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", w: 1280, h: 720 },
//     { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", w: 1280, h: 720 },
//     { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", w: 1280, h: 720 },
//     { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", w: 1280, h: 720 },
//     { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", w: 1280, h: 720 },
//     { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", w: 1280, h: 720 },
//     { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4", w: 1280, h: 720 },
// ];

// const MEDIA_POST_CONTENTS = [
//     "Cuối tuần tranh thủ đi chụp ảnh một chút. Hà Nội đẹp lắm khi nhìn đúng góc 📸",
//     "Setup WFH mới của mình. Năng suất tăng hẳn sau khi dọn lại bàn làm việc 💻✨",
//     "Bữa trưa hôm nay tự nấu. Ăn ngon hơn hàng quán nhiều mà lại rẻ hơn 🍳",
//     "Đà Lạt sau 3 năm mới quay lại. Nhiều thứ thay đổi nhưng cái lạnh và hoa vẫn vậy 🌸",
//     "Team building hôm nay vui lắm mọi người ơi! Đồng nghiệp tốt là một phần không thể thiếu 🎉",
//     "Góc đọc sách yêu thích của mình. Không có gì thư giãn hơn một buổi chiều như thế này 📚",
//     "Hồ Tây lúc 5:30 sáng. Ai dậy sớm thì biết cảm giác này tuyệt vời thế nào 🌅",
//     "Phở gà sáng nay đúng chuẩn Hà Nội. Bí quyết là nước dùng ninh xương 8 tiếng 🍲",
//     "Bé cún nhà mình ngày đầu về. Một năm rồi, lớn nhanh quá 🐶",
//     "Concert tối qua đỉnh thật sự. Live music khác hẳn nghe qua tai nghe 🎵",
//     "Chuyến phượt Tây Bắc weekend vừa rồi. 800km, 2 ngày, vô số kỷ niệm 🏔️",
//     "Mình vừa học xong lớp nhiếp ảnh cơ bản. Đây là những tấm ảnh đầu tiên 📷",
//     "Quán cà phê mới ở Q.3 cực xịn. Không gian, âm nhạc, cà phê đều đỉnh ☕",
//     "Hoàng hôn từ văn phòng hôm nay đẹp đến mức phải chụp lại 🌇",
//     "Market sáng chủ nhật ở Hà Nội. Rau củ tươi, người bán vui tính, không khí dễ chịu 🥬",
//     "Clip này mình quay lúc đi Đà Nẵng tháng trước. Biển sáng sớm bình yên lắm 🌊",
//     "Vlog một ngày làm việc của mình. Đừng romanticize developer life nhé 😅💻",
//     "Khoảnh khắc bé mèo boss nhà mình chiếm toàn bộ bàn phím 😂🐱",
//     "Road trip Hà Nội → Ninh Bình. 2 tiếng lái xe, cảnh đẹp đến quên đường về 🚗",
//     "Buổi sáng chạy bộ ven hồ. Không có gì reset não tốt hơn 30 phút này 🏃",
//     "Lần đầu thử nấu bánh mì Việt Nam tại nhà. Không đẹp bằng tiệm nhưng ngon không kém 🍞",
//     "Góc nhỏ yêu thích trong căn phòng. Đôi khi chỉ cần một góc riêng để sạc lại năng lượng 🌿",
//     "Triển lãm nghệ thuật cuối tuần vừa rồi. Nhiều tác phẩm khiến mình đứng nhìn rất lâu 🎨",
//     "Bữa tiệc sinh nhật bạn thân. 10 năm bạn bè, vẫn như hồi mới quen 🎂",
//     "Tập gym buổi sáng trước khi làm việc. Khó duy trì nhưng 3 tháng rồi không bỏ ngày nào 💪",
//     "Mưa Sài Gòn chiều nay đổ xuống nhanh lắm. Kẹt đường nhưng đẹp thật sự 🌧️",
//     "Văn phòng mới công ty mình vừa dọn vào. Môi trường tốt hơn năng suất tăng thật 🏢",
//     "Ngày đầu tiên ở Hội An. Thành phố này không bao giờ làm mình thất vọng 🏮",
//     "Timelapse một ngày làm việc của mình. Thấy thời gian trôi nhanh hơn nhiều khi nhìn lại ⏱️",
//     "Cà phê trứng Hà Nội, đặc sản không nơi nào có. Ngọt mà không ngấy ☕🥚",
//     "Bộ sưu tập cây xanh trong nhà ngày càng đông. Nhìn xanh mát, không khí tốt hơn hẳn 🌱",
//     "Lần đầu đi leo núi. Lên đến đỉnh mới hiểu tại sao người ta nghiện cảm giác này 🧗",
//     "Sắp xếp lại tủ sách cuối tuần. Phát hiện nhiều cuốn chưa đọc đang chờ 📚",
//     "Sunset từ rooftop bar. Hơi tốn tiền nhưng view đáng đồng tiền 🌆",
//     "Workshop coding đầu tiên mình tham gia. Học được nhiều, quen thêm được nhiều bạn 👨‍💻",
//     "Ảnh chụp từ máy bay lúc hạ cánh xuống Nội Bài. Mỗi lần về nhà đều xúc động ✈️",
//     "Vườn nhà ông bà ngoại ở quê. Mỗi lần về thấy bình yên hơn bất cứ nơi nào 🌾",
//     "Studio thu âm lần đầu tiên đặt chân vào. Âm nhạc nhìn từ phía trong khác hẳn 🎙️",
//     "Bữa cơm gia đình cuối tuần. Đơn giản nhưng là khoảnh khắc mình trân trọng nhất ❤️",
//     "Cảnh view từ phòng khách sạn ở Phú Quốc. 4 ngày nghỉ dưỡng sau 1 năm không nghỉ 🏝️",
// ];

// const MEDIA_REPLY_CONTENTS = [
//     "Ảnh/clip đẹp quá bạn ơi! 😍", "Trời ơi nhìn thèm quá đi 😭",
//     "Bạn chụp bằng máy gì vậy? Ảnh sắc nét lắm", "Địa điểm này ở đâu vậy bạn? Muốn đến quá!",
//     "Clip này chill vãi, mình xem 3 lần rồi 🥹", "Nhìn ảnh này tự nhiên muốn nghỉ việc đi du lịch liền 😂",
//     "Đẹp thật sự luôn, không filter mà vẫn đẹp thế này 🙌", "Ước gì mình cũng ở đó lúc này 😌",
//     "Bạn ơi chia sẻ preset/setting chụp ảnh không?", "Mình cũng vừa đến chỗ này! Trùng hợp ghê 😱",
// ];

// const MEDIA_QUOTE_CONTENTS = [
//     "Quote lại vì ảnh đẹp quá, muốn share cho bạn bè cùng thấy 📸",
//     "Bài gốc hay, mình muốn thêm: địa điểm này mình cũng recommend 100%",
//     "Nhìn ảnh/clip này lại nhớ chuyến đi năm ngoái của mình 🥹",
//     "Tag bạn bè mình vào để rủ đi chỗ này cuối tuần 📍",
//     "Thêm context: mình đã ở đây rồi và confirm đẹp như trong ảnh, không phải photoshop",
// ];

// type MediaCombo = "images_only" | "video_only" | "mixed";
// function getMediaCombo(i: number): MediaCombo {
//     return (["images_only", "images_only", "images_only", "video_only", "video_only", "mixed", "mixed"] as MediaCombo[])[i % 7];
// }

// async function seedPostsWithMedia(users: { id: string; username: string; name: string; avatar: string | null; bio: string | null }[]) {
//     console.log("\n🖼️  [3/4] Seed 40 posts with media...");

//     let totalImages = 0, totalVideos = 0;

//     for (let i = 0; i < 40; i++) {
//         const author = users[i % users.length];
//         const createdAt = randomDate(45);
//         const combo = getMediaCombo(i);

//         const post = await prisma.post.create({
//             data: {
//                 userId: author.id,
//                 content: MEDIA_POST_CONTENTS[i % MEDIA_POST_CONTENTS.length],
//                 type: PostType.POST,
//                 visibility: VisibilityPost.PUBLIC,
//                 replyPermission: pick([ReplyPermission.EVERYONE, ReplyPermission.EVERYONE, ReplyPermission.FOLLOWERS]),
//                 userSnapshot: { id: author.id, username: author.username, name: author.name, avatar: author.avatar, bio: author.bio },
//                 likesCount: rand(50, 2000), repliesCount: 40, repostsCountAndQuoteCount: 40,
//                 viewsCount: rand(500, 50000), createdAt, updatedAt: createdAt,
//             },
//         });

//         // Build media list
//         const mediaItems: { url: string; type: PostMediaType; width: number; height: number; key: string }[] = [];

//         const addImages = (count: number) => {
//             for (let j = 0; j < count; j++) {
//                 const s = IMAGE_SEEDS[(i * 3 + j) % IMAGE_SEEDS.length];
//                 mediaItems.push({
//                     url: `https://picsum.photos/seed/${s.seed}/${s.w}/${s.h}.jpg`,
//                     type: PostMediaType.IMAGE, width: s.w, height: s.h,
//                     key: `post_img_${i}_${j}_${Date.now()}`,
//                 });
//             }
//         };
//         const addVideos = (count: number) => {
//             for (let j = 0; j < count; j++) {
//                 const v = VIDEO_POOL[(i + j) % VIDEO_POOL.length];
//                 mediaItems.push({
//                     url: v.url, type: PostMediaType.VIDEO, width: v.w, height: v.h,
//                     key: `post_vid_${i}_${j}_${Date.now()}`,
//                 });
//             }
//         };

//         if (combo === "images_only") addImages(rand(1, 4));
//         else if (combo === "video_only") addVideos(1);
//         else { addImages(rand(1, 3)); addVideos(1); }

//         await prisma.postMedia.createMany({
//             data: mediaItems.map((m, order) => ({
//                 postId: post.id, url: m.url, type: m.type,
//                 width: m.width, height: m.height,
//                 key: `${m.key}_${order}`, status: PostMediaStatus.UPLOADED,
//             })),
//         });

//         totalImages += mediaItems.filter(m => m.type === PostMediaType.IMAGE).length;
//         totalVideos += mediaItems.filter(m => m.type === PostMediaType.VIDEO).length;

//         // Replies
//         await prisma.post.createMany({
//             data: Array.from({ length: 40 }, (_, ri) => {
//                 const replier = pickOther(users, author.id);
//                 const rAt = randomDate(30);
//                 return {
//                     userId: replier.id,
//                     content: MEDIA_REPLY_CONTENTS[(i * 40 + ri) % MEDIA_REPLY_CONTENTS.length],
//                     type: PostType.REPLY, visibility: VisibilityPost.PUBLIC,
//                     replyPermission: ReplyPermission.EVERYONE,
//                     parentId: post.id, parentPublicId: post.publicId,
//                     rootPostId: post.id, rootPublicId: post.publicId,
//                     userSnapshot: { id: replier.id, username: replier.username, name: replier.name, avatar: replier.avatar, bio: replier.bio },
//                     likesCount: rand(0, 200), repliesCount: 0, repostsCountAndQuoteCount: 0,
//                     viewsCount: rand(50, 2000), createdAt: rAt, updatedAt: rAt,
//                 };
//             }),
//         });

//         // Quotes
//         await prisma.post.createMany({
//             data: Array.from({ length: 40 }, (_, qi) => {
//                 const quoter = pickOther(users, author.id);
//                 const qAt = randomDate(30);
//                 return {
//                     userId: quoter.id,
//                     content: MEDIA_QUOTE_CONTENTS[(i * 40 + qi) % MEDIA_QUOTE_CONTENTS.length],
//                     type: PostType.QUOTE, visibility: VisibilityPost.PUBLIC,
//                     replyPermission: ReplyPermission.EVERYONE,
//                     originPostId: post.id, originPublicId: post.publicId,
//                     isQuote: true,
//                     userSnapshot: { id: quoter.id, username: quoter.username, name: quoter.name, avatar: quoter.avatar, bio: quoter.bio },
//                     likesCount: rand(0, 300), repliesCount: 0, repostsCountAndQuoteCount: 0,
//                     viewsCount: rand(100, 5000), createdAt: qAt, updatedAt: qAt,
//                 };
//             }),
//         });

//         if ((i + 1) % 10 === 0) console.log(`   → ${i + 1}/40 media posts`);
//     }

//     console.log(`   ✅ 40 posts | 🖼️  ${totalImages} ảnh | 🎬 ${totalVideos} video | + 1,600 replies + 1,600 quotes`);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // 4. SEED CIRCLES + MEMBERS
// // ─────────────────────────────────────────────────────────────────────────────

// const CIRCLES_DATA = [
//     { name: "Dev Vietnam 🇻🇳", description: "Cộng đồng lập trình viên Việt Nam.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "AI & Machine Learning", description: "Thảo luận về AI, machine learning và các xu hướng mới nhất.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Backend Engineers", description: "Nhóm kín dành cho backend engineers. Architecture, system design, database.", visibility: Visibility.PRIVATE, statusPeak: false },
//     { name: "Frontend Wizards", description: "React, Vue, Svelte hay Vanilla JS? Miễn là UI đẹp và UX mượt mà.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Cloud & DevOps Hub", description: "AWS, GCP, Azure, Kubernetes, CI/CD và các thực hành DevOps hiện đại.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Mobile Dev Club", description: "iOS, Android, Flutter, React Native — tất cả về mobile dev.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Open Source VN", description: "Kết nối contributor và maintainer open source Việt Nam.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Security & Pentest", description: "An ninh mạng, penetration testing, CTF và bug bounty.", visibility: Visibility.PRIVATE, statusPeak: false },
//     { name: "Database Architects", description: "PostgreSQL, MySQL, MongoDB, Redis — thiết kế và tối ưu database.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "GameDev Việt", description: "Cộng đồng phát triển game Việt Nam. Unity đến Unreal Engine.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Design & UX Community", description: "Không gian cho designer và UX researcher yêu thích thiết kế sản phẩm số.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Motion & Animation", description: "After Effects, Lottie, CSS animation — motion design đỉnh cao.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Brand Identity Lab", description: "Brand designer chia sẻ case study, logo design và brand guidelines.", visibility: Visibility.PRIVATE, statusPeak: false },
//     { name: "Figma Masters VN", description: "Tips, tricks, plugins và resources Figma. Auto layout đến variables.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Photography Circle", description: "Chia sẻ ảnh chụp, kỹ thuật nhiếp ảnh và hành trình khám phá ánh sáng.", visibility: Visibility.CIRCLE, statusPeak: false },
//     { name: "Startup Founders Circle", description: "Dành cho người sáng lập startup. Chia sẻ hành trình và bài học khởi nghiệp.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Product Managers VN", description: "Cộng đồng PM Việt Nam. Roadmap, prioritization, stakeholder management.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Freelancers Vietnam", description: "Cộng đồng freelancer Việt Nam. Kết nối, chia sẻ dự án và kinh nghiệm.", visibility: Visibility.CIRCLE, statusPeak: false },
//     { name: "Growth Hackers", description: "Chiến lược tăng trưởng, A/B testing, funnel optimization.", visibility: Visibility.PRIVATE, statusPeak: true },
//     { name: "Tech Recruiters Network", description: "Mạng lưới recruiter ngành công nghệ. Insight về thị trường nhân sự IT.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Web3 & Blockchain VN", description: "Khám phá Web3, DeFi, NFT và blockchain cùng cộng đồng crypto Việt Nam.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "DeFi Research Lab", description: "Phân tích protocol, tokenomics, yield farming strategy.", visibility: Visibility.PRIVATE, statusPeak: true },
//     { name: "Stock & Investment Club", description: "Phân tích cổ phiếu, ETF, crypto. Knowledge sharing, không pump & dump.", visibility: Visibility.CIRCLE, statusPeak: false },
//     { name: "Fintech Builders", description: "Payment, lending, insurtech và mọi thứ về fintech.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Book Club Tech", description: "Câu lạc bộ đọc sách về công nghệ, kinh doanh và phát triển bản thân.", visibility: Visibility.PRIVATE, statusPeak: false },
//     { name: "English for Techies", description: "Luyện tiếng Anh chuyên ngành công nghệ. Technical writing, interview prep.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Research Paper Club", description: "Đọc và thảo luận paper AI, CS — từ arxiv đến NeurIPS.", visibility: Visibility.PRIVATE, statusPeak: true },
//     { name: "Junior Dev Support", description: "Nơi an toàn để junior developer hỏi bất cứ điều gì.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "CS Fundamentals", description: "Algorithms, data structures, system design — kiến thức nền tảng cho dev.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Tech & Coffee ☕", description: "Chill, networking và nói chuyện random về tech. Không cần agenda.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Remote Work Life", description: "Kinh nghiệm làm việc remote — workspace, time management, tìm client.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Vietnam Expat Tech", description: "Tech người Việt làm việc nước ngoài. Networking và chia sẻ cuộc sống.", visibility: Visibility.CIRCLE, statusPeak: false },
//     { name: "Women in Tech VN", description: "Cộng đồng phụ nữ trong ngành công nghệ Việt Nam. Mentorship & networking.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Tech Memes & Fun", description: "Meme, joke và những thứ buồn cười về cuộc đời developer.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "HCM Tech Community", description: "Cộng đồng công nghệ TP.HCM. Events, meetup, hackathon.", visibility: Visibility.PUBLIC, statusPeak: true },
//     { name: "Hanoi Dev Guild", description: "Hội lập trình viên Hà Nội. Meetup định kỳ và kết nối cộng đồng tech.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Da Nang Tech Scene", description: "Cộng đồng công nghệ Đà Nẵng. Thành phố đáng sống, ngành tech bùng nổ.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "IoT & Embedded Systems", description: "Arduino, Raspberry Pi, ESP32 và Internet of Things.", visibility: Visibility.PUBLIC, statusPeak: false },
//     { name: "Data Engineers VN", description: "Data pipeline, ETL, Spark, Kafka và hạ tầng dữ liệu.", visibility: Visibility.PRIVATE, statusPeak: false },
//     { name: "Tech for Social Good", description: "Dùng công nghệ giải quyết vấn đề xã hội: giáo dục, môi trường, y tế.", visibility: Visibility.PUBLIC, statusPeak: true },
// ];

// async function seedCircles(users: { id: string; username: string }[]) {
//     console.log("\n⭕ [4/4] Seed 40 circles + members...");

//     let count = 0;
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

//         // Add owner as admin member
//         await prisma.circleMember.create({
//             data: { circleId: circle.id, userId: owner.id, role: RoleMembership.ADMIN },
//         });

//         // Add up to 20 random other members
//         const others = users
//             .filter(u => u.id !== owner.id)
//             .sort(() => Math.random() - 0.5)
//             .slice(0, 20);

//         if (others.length > 0) {
//             await prisma.circleMember.createMany({
//                 data: others.map(u => ({ circleId: circle.id, userId: u.id, role: RoleMembership.MEMBER })),
//                 skipDuplicates: true,
//             });
//         }

//         count++;
//         const icon = data.statusPeak ? "🔥" : "  ";
//         const vis = data.visibility === "PUBLIC" ? "🌐" : data.visibility === "PRIVATE" ? "🔒" : "⭕";
//         console.log(`   ${String(count).padStart(2, "0")}. ${icon} ${vis} ${data.name} — @${owner.username} (+${others.length} members)`);
//     }

//     console.log(`   ✅ ${count} circles, mỗi circle có owner + tối đa 20 thành viên`);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN
// // ─────────────────────────────────────────────────────────────────────────────

// async function main() {
//     console.log("🌱 ===== BẮT ĐẦU SEED =====");

//     // 1. Users
//     await seedUsers();

//     // Load users for subsequent seeds
//     const users = await prisma.user.findMany({
//         where: { deletedAt: null },
//         select: { id: true, username: true, name: true, avatar: true, bio: true },
//         take: 100,
//         orderBy: { createdAt: "asc" },
//     });

//     if (users.length < 2) {
//         throw new Error("Cần ít nhất 2 user. Kiểm tra lại bước seed users!");
//     }

//     // 2. Text posts
//     await seedPosts(users);

//     // 3. Media posts
//     await seedPostsWithMedia(users);

//     // 4. Circles
//     await seedCircles(users);

//     // Summary
//     const [totalUsers, totalPosts, totalMedia, totalCircles, totalMembers] = await Promise.all([
//         prisma.user.count(),
//         prisma.post.count(),
//         prisma.postMedia.count(),
//         prisma.circle.count(),
//         prisma.circleMember.count(),
//     ]);

//     console.log(`
// 🎉 ===== SEED HOÀN THÀNH =====
//    👤 Users       : ${totalUsers}
//    📝 Posts       : ${totalPosts}  (bao gồm replies & quotes)
//    🗂️  PostMedia   : ${totalMedia}
//    ⭕ Circles     : ${totalCircles}
//    👥 Members     : ${totalMembers}
// ================================`);
// }

// main()
//     .catch((e) => { console.error("❌ Seed thất bại:", e); process.exit(1); })
//     .finally(() => prisma.$disconnect());