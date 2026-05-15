// // // prisma/seed_posts_media.ts
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import {
//     PostMediaStatus,
//     PostMediaType,
//     PostType,
//     PrismaClient,
//     ReplyPermission,
//     VisibilityPost
// } from "@prisma/client";
// import dotenv from "dotenv";
// dotenv.config();

// const adapter = new PrismaMariaDb({
//     port: Number(process.env.DB_PORT) || 3306,
//     host: process.env.DB_HOST || "localhost",
//     user: process.env.DB_USER || "root",
//     password: process.env.DB_PASSWORD || "password",
//     database: process.env.DB_NAME || "threads_api",
// });

// const prisma = new PrismaClient({ adapter } as any);


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
//     return new Date(Date.now() - Math.random() * daysAgo * 86400000);
// }

// // ─── Image URLs (picsum.photos – dùng seed cố định để stable) ────────────────
// // Format: https://picsum.photos/seed/{seed}/{width}/{height}
// // Các ID seed này cho ảnh đẹp, đa dạng chủ đề

// const IMAGE_SEEDS = [
//     // landscape / city
//     { seed: "hanoi01", w: 1080, h: 1080, caption: "Hà Nội sáng sớm 🌅" },
//     { seed: "saigon02", w: 1080, h: 1350, caption: "Sài Gòn về đêm ✨" },
//     { seed: "danang03", w: 1080, h: 720, caption: "Biển Đà Nẵng xanh ngát 🌊" },
//     {
//         seed: "dalat04",
//         w: 1080,
//         h: 1080,
//         caption: "Đà Lạt sương mù buổi sáng 🌿",
//     },
//     { seed: "coffee05", w: 800, h: 800, caption: "Cà phê sáng ☕" },
//     { seed: "food06", w: 1080, h: 1080, caption: "Bún bò Huế chuẩn vị 🍜" },
//     { seed: "street07", w: 1080, h: 720, caption: "Góc phố quen thuộc 🏙️" },
//     { seed: "nature08", w: 1200, h: 800, caption: "Thiên nhiên tươi mát 🌳" },
//     { seed: "desk09", w: 1080, h: 1080, caption: "Setup làm việc tại nhà 💻" },
//     {
//         seed: "sunset10",
//         w: 1200,
//         h: 630,
//         caption: "Hoàng hôn hôm nay đẹp quá 🌇",
//     },
//     { seed: "cat11", w: 800, h: 800, caption: "Boss nhà mình 🐱" },
//     { seed: "book12", w: 1080, h: 1080, caption: "Reading corner cuối tuần 📚" },
//     { seed: "gym13", w: 1080, h: 1350, caption: "Ngày 47 của hành trình 💪" },
//     {
//         seed: "market14",
//         w: 1080,
//         h: 720,
//         caption: "Chợ buổi sáng, rau tươi đẹp lắm 🥬",
//     },
//     { seed: "flower15", w: 800, h: 1000, caption: "Hoa trước nhà nở rồi 🌸" },
//     { seed: "rain16", w: 1080, h: 1080, caption: "Mưa Sài Gòn chiều nay 🌧️" },
//     { seed: "lake17", w: 1200, h: 800, caption: "Hồ Tây lúc 6 giờ sáng 🌅" },
//     { seed: "pho18", w: 1080, h: 1080, caption: "Phở gà sáng nay thơm quá 🍲" },
//     { seed: "work19", w: 1080, h: 720, caption: "Team outing hôm nay 🎉" },
//     { seed: "sky20", w: 1200, h: 630, caption: "Bầu trời hôm nay đặc biệt 🌤️" },
// ];

// function picsumUrl(seed: string, w: number, h: number): string {
//     return `https://picsum.photos/seed/${seed}/${w}/${h}.jpg`;
// }

// // ─── Video URLs (public MP4s từ các CDN free) ─────────────────────────────────

// const VIDEO_POOL = [
//     {
//         url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//         w: 1280,
//         h: 720,
//         caption: "Video thú vị mình tìm được 🐰",
//     },
//     {
//         url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//         w: 1280,
//         h: 720,
//         caption: "Chia sẻ clip này với mọi người 🎬",
//     },
//     {
//         url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
//         w: 1280,
//         h: 720,
//         caption: "Clip này chill lắm mọi người ơi 🔥",
//     },
//     {
//         url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
//         w: 1280,
//         h: 720,
//         caption: "Cuối tuần này đi đây không mọi người? 🌲",
//     },
//     {
//         url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
//         w: 1280,
//         h: 720,
//         caption: "Cảnh đẹp quá trời 🚗✨",
//     },
//     {
//         url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
//         w: 1280,
//         h: 720,
//         caption: "Xem xong có nhiều suy nghĩ lắm 🤔",
//     },
//     {
//         url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
//         w: 1280,
//         h: 720,
//         caption: "Trải nghiệm này không thể quên 🎥",
//     },
//     {
//         url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
//         w: 1280,
//         h: 720,
//         caption: "Hay quá chia sẻ cho mọi người 🎞️",
//     },
// ];

// // ─── Post content có ảnh/video ────────────────────────────────────────────────

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

// const REPLY_CONTENTS = [
//     "Ảnh/clip đẹp quá bạn ơi! 😍",
//     "Trời ơi nhìn thèm quá đi 😭",
//     "Bạn chụp bằng máy gì vậy? Ảnh sắc nét lắm",
//     "Địa điểm này ở đâu vậy bạn? Muốn đến quá!",
//     "Clip này chill vãi, mình xem 3 lần rồi 🥹",
//     "Nhìn ảnh này tự nhiên muốn nghỉ việc đi du lịch liền 😂",
//     "Đẹp thật sự luôn, không filter mà vẫn đẹp thế này 🙌",
//     "Ước gì mình cũng ở đó lúc này 😌",
//     "Bạn ơi chia sẻ preset/setting chụp ảnh không?",
//     "Mình cũng vừa đến chỗ này! Trùng hợp ghê 😱",
//     "Nhìn ảnh thấy muốn order đồ ăn ngay 🍜",
//     "Setup này clean quá, wallpaper gì vậy bạn?",
//     "Video mượt lắm, edit bằng app gì thế?",
//     "Cái này ngon/đẹp thật không hay filter nhiều? 😅",
//     "Quán/địa điểm này mình biết rồi, đúng là đẹp!",
//     "Mình lưu ảnh này làm wallpaper được không? 🙏",
//     "Đây là content tôi cần hôm nay 🌿",
//     "Bạn có talent nhiếp ảnh thật sự đó",
//     "Nhìn clip muốn ngủ tiếp quá 😴 Chill lắm",
//     "Mình đến chỗ này mà không giống như bạn chụp 😅 Bạn có tips gì không?",
// ];

// const QUOTE_CONTENTS = [
//     "Quote lại vì ảnh đẹp quá, muốn share cho bạn bè cùng thấy 📸",
//     "Bài gốc hay, mình muốn thêm: địa điểm này mình cũng recommend 100%",
//     "Nhìn ảnh/clip này lại nhớ chuyến đi năm ngoái của mình 🥹",
//     "Tag bạn bè mình vào để rủ đi chỗ này cuối tuần 📍",
//     "Thêm context: mình đã ở đây rồi và confirm đẹp như trong ảnh, không phải photoshop",
//     "Quote lại vì cái setup này là mục tiêu của mình 💻✨",
//     "Nhìn ảnh đồ ăn này mình quyết định hôm nay phải tự nấu 🍳",
//     "Chia sẻ lại vì quá chill, cần lan tỏa năng lượng tốt 🌿",
//     "Bổ sung: mình cũng hay đến đây, giờ biết thêm một người quen 😄",
//     "Quote để lưu lại địa điểm này, nhất định phải ghé một lần 📌",
// ];

// // ─── Media generator ─────────────────────────────────────────────────────────

// interface MediaItem {
//     url: string;
//     type: PostMediaType;
//     width: number;
//     height: number;
//     caption: string;
//     key: string;
// }

// function generateImageMedia(postIndex: number, count: number): MediaItem[] {
//     const items: MediaItem[] = [];
//     for (let i = 0; i < count; i++) {
//         const seed = IMAGE_SEEDS[(postIndex * 3 + i) % IMAGE_SEEDS.length];
//         items.push({
//             url: picsumUrl(seed.seed, seed.w, seed.h),
//             type: PostMediaType.IMAGE,
//             width: seed.w,
//             height: seed.h,
//             caption: seed.caption,
//             key: `post_img_${postIndex}_${i}_${Date.now()}`,
//         });
//     }
//     return items;
// }

// function generateVideoMedia(postIndex: number, count: number): MediaItem[] {
//     const items: MediaItem[] = [];
//     for (let i = 0; i < count; i++) {
//         const v = VIDEO_POOL[(postIndex + i) % VIDEO_POOL.length];
//         items.push({
//             url: v.url,
//             type: PostMediaType.VIDEO,
//             width: v.w,
//             height: v.h,
//             caption: v.caption,
//             key: `post_vid_${postIndex}_${i}_${Date.now()}`,
//         });
//     }
//     return items;
// }

// // Mỗi post sẽ có một trong các combo sau:
// // - chỉ ảnh (1-4 ảnh)
// // - chỉ video (1 video)
// // - ảnh + video (1-3 ảnh + 1 video)
// type MediaCombo = "images_only" | "video_only" | "mixed";

// function getMediaCombo(index: number): MediaCombo {
//     const combos: MediaCombo[] = [
//         "images_only",
//         "images_only",
//         "images_only", // 50% chỉ ảnh
//         "video_only",
//         "video_only", // 25% chỉ video
//         "mixed",
//         "mixed", // 25% kết hợp
//     ];
//     return combos[index % combos.length];
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────

// async function main() {
//     console.log("🌱 Seed 40 posts có ảnh/video...");

//     const users = await prisma.user.findMany({
//         select: { id: true, username: true, name: true, avatar: true, bio: true },
//         take: 100,
//         orderBy: { createdAt: "asc" },
//     });

//     if (users.length < 2) {
//         throw new Error("Cần ít nhất 2 user. Chạy seed_users.ts trước!");
//     }

//     console.log(`✅ Tìm thấy ${users.length} users`);

//     let totalImages = 0;
//     let totalVideos = 0;

//     for (let i = 0; i < 40; i++) {
//         const author = users[i % users.length];
//         const content = MEDIA_POST_CONTENTS[i % MEDIA_POST_CONTENTS.length];
//         const createdAt = randomDate(45);
//         const combo = getMediaCombo(i);

//         // ── Tạo post gốc ──────────────────────────────────────────────────────
//         const post = await prisma.post.create({
//             data: {
//                 userId: author.id,
//                 content,
//                 type: PostType.POST,
//                 visibility: VisibilityPost.PUBLIC,
//                 replyPermission: pick([
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
//                 likesCount: rand(50, 2000),
//                 repliesCount: 40,
//                 repostsCountAndQuoteCount: 40,
//                 viewsCount: rand(500, 50000),
//                 createdAt,
//                 updatedAt: createdAt,
//             },
//         });

//         // ── Tạo PostMedia ──────────────────────────────────────────────────────
//         const mediaItems: MediaItem[] = [];

//         if (combo === "images_only") {
//             const count = rand(1, 4); // 1–4 ảnh
//             mediaItems.push(...generateImageMedia(i, count));
//         } else if (combo === "video_only") {
//             mediaItems.push(...generateVideoMedia(i, 1));
//         } else {
//             // mixed: 1–3 ảnh + 1 video
//             const imgCount = rand(1, 3);
//             mediaItems.push(...generateImageMedia(i, imgCount));
//             mediaItems.push(...generateVideoMedia(i, 1));
//         }

//         await prisma.postMedia.createMany({
//             data: mediaItems.map((m, order) => ({
//                 postId: post.id,
//                 url: m.url,
//                 type: m.type,
//                 width: m.width,
//                 height: m.height,
//                 key: `${m.key}_${order}`,
//                 status: PostMediaStatus.UPLOADED,
//             })),
//         });

//         const imgCount = mediaItems.filter(
//             (m) => m.type === PostMediaType.IMAGE,
//         ).length;
//         const vidCount = mediaItems.filter(
//             (m) => m.type === PostMediaType.VIDEO,
//         ).length;
//         totalImages += imgCount;
//         totalVideos += vidCount;

//         // ── 40 Replies ─────────────────────────────────────────────────────────
//         await prisma.post.createMany({
//             data: Array.from({ length: 40 }, (_, ri) => {
//                 const replier = pickOther(users, author.id);
//                 const rAt = randomDate(30);
//                 return {
//                     userId: replier.id,
//                     content: REPLY_CONTENTS[(i * 40 + ri) % REPLY_CONTENTS.length],
//                     type: PostType.REPLY,
//                     visibility: VisibilityPost.PUBLIC,
//                     replyPermission: ReplyPermission.EVERYONE,
//                     parentId: post.id,
//                     parentPublicId: post.publicId,
//                     rootPostId: post.id,
//                     rootPublicId: post.publicId,
//                     userSnapshot: {
//                         id: replier.id,
//                         username: replier.username,
//                         name: replier.name,
//                         avatar: replier.avatar,
//                         bio: replier.bio,
//                     },
//                     likesCount: rand(0, 200),
//                     repliesCount: 0,
//                     repostsCountAndQuoteCount: 0,
//                     viewsCount: rand(50, 2000),
//                     createdAt: rAt,
//                     updatedAt: rAt,
//                 };
//             }),
//         });

//         // ── 40 Quotes ──────────────────────────────────────────────────────────
//         await prisma.post.createMany({
//             data: Array.from({ length: 40 }, (_, qi) => {
//                 const quoter = pickOther(users, author.id);
//                 const qAt = randomDate(30);
//                 return {
//                     userId: quoter.id,
//                     content: QUOTE_CONTENTS[(i * 40 + qi) % QUOTE_CONTENTS.length],
//                     type: PostType.QUOTE,
//                     visibility: VisibilityPost.PUBLIC,
//                     replyPermission: ReplyPermission.EVERYONE,
//                     originPostId: post.id,
//                     originPublicId: post.publicId,
//                     isQuote: true,
//                     userSnapshot: {
//                         id: quoter.id,
//                         username: quoter.username,
//                         name: quoter.name,
//                         avatar: quoter.avatar,
//                         bio: quoter.bio,
//                     },
//                     likesCount: rand(0, 300),
//                     repliesCount: 0,
//                     repostsCountAndQuoteCount: 0,
//                     viewsCount: rand(100, 5000),
//                     createdAt: qAt,
//                     updatedAt: qAt,
//                 };
//             }),
//         });

//         const mediaLabel = mediaItems
//             .map((m) => (m.type === PostMediaType.IMAGE ? "🖼️" : "🎬"))
//             .join("");
//         console.log(
//             `  [${i + 1}/40] ${mediaLabel} ${combo.padEnd(12)} | ${imgCount} ảnh ${vidCount} video | @${author.username}`,
//         );
//     }

//     const totalPosts = await prisma.post.count();
//     const totalMedia = await prisma.postMedia.count();

//     console.log(`
// ✅ Seed hoàn thành!
//    📝 40 posts có media
//    🖼️  ${totalImages} ảnh tổng cộng
//    🎬 ${totalVideos} video tổng cộng
//    💬 1,600 replies  (40 × 40)
//    🔁 1,600 quotes   (40 × 40)
//    ─────────────────────────────────
//    📦 3,240 bản ghi mới
//    💾 Tổng posts trong DB : ${totalPosts}
//    🗂️  Tổng media trong DB : ${totalMedia}
//   `);
// }

// main()
//     .catch((e) => {
//         console.error("❌ Seed thất bại:", e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

// prisma/seed_posts.ts
// dotenv.config();


// function pick<T>(arr: T[]): T {
//   return arr[Math.floor(Math.random() * arr.length)];
// }

// function pickOther<T extends { id: string }>(arr: T[], excludeId: string): T {
//   const filtered = arr.filter((u) => u.id !== excludeId);
//   return pick(filtered);
// }

// function randomDate(daysAgo: number): Date {
//   const ms = Math.random() * daysAgo * 24 * 60 * 60 * 1000;
//   return new Date(Date.now() - ms);
// }

// // ─── Content pools ────────────────────────────────────────────────────────────

// const POST_CONTENTS = [
//   "Sáng nay uống cà phê một mình, nhìn ra ngoài cửa sổ, bỗng thấy cuộc đời này đẹp thật ☕🌿",
//   "Ai đang học lập trình không? Chia sẻ kinh nghiệm tự học với mình với 🙋",
//   "Vừa deploy xong feature làm cả tuần. Cảm giác này không có gì bằng 🚀",
//   "Hà Nội hôm nay mưa to, nằm nhà nghe nhạc thôi 🎵🌧️",
//   "Mọi người đang xài tool gì để quản lý task cá nhân? Notion hay Obsidian?",
//   "Đôi khi mình tự hỏi, mình đang chạy theo mục tiêu hay đang trốn tránh điều gì đó 🤔",
//   "Tip cho dân dev: đặt tên biến rõ ràng hơn comment dài dòng. Code tự document chính nó 👨‍💻",
//   "Sài Gòn 11 giờ đêm vẫn đông như ban ngày. Thành phố này không bao giờ ngủ 🌃",
//   "Vừa đọc xong 'Sapiens'. Ai đọc rồi cùng discuss nhé, nhiều điểm rất thú vị 📖",
//   "Hot take: Remote work không phải ai cũng hợp. Cần self-discipline cực cao mới làm lâu được",
//   "Hôm nay ăn bún bò, ngon đến mức quên luôn diet 😭🍜",
//   "Mình bắt đầu chạy bộ sáng từ 3 tháng trước. Đây là những gì thay đổi sau 90 ngày 🏃",
//   "Câu hỏi nghiêm túc: mọi người có hay nói chuyện với ChatGPT khi buồn không? 😅",
//   "Junior dev vs Senior dev không phải là số năm kinh nghiệm, mà là cách giải quyết vấn đề 💡",
//   "Cuối tuần này Đà Lạt hay Vũng Tàu? Cần ý kiến gấp 🏔️🌊",
//   "Mình nhận ra mình học tốt nhất lúc... 2 giờ sáng. Não người thật kỳ lạ 🧠",
//   "Review quán cà phê mới ở Q.1: không gian đẹp, wifi ổn, nhưng giá hơi chát ☕",
//   "Ai có kinh nghiệm freelance không? Mình đang phân vân giữa full-time và freelance 🤷",
//   "Lần đầu present trước 50 người. Run lắm nhưng xong rồi thấy tự tin hơn nhiều 🎤",
//   "Mọi người nghĩ sao về xu hướng AI đang thay thế nhiều nghề nghiệp? Lo hay không lo?",
//   "Vừa setup xong bàn làm việc mới. Productivity tăng hẳn khi môi trường gọn gàng 🖥️",
//   "Đọc sách giấy vs sách điện tử - mình vẫn thích cầm sách thật trên tay hơn 📚",
//   "Học ngoại ngữ hiệu quả nhất theo mình là: immersion + thực hành mỗi ngày, không có shortcut",
//   "Hôm nay là sinh nhật mình 🎂 Cảm ơn tất cả mọi người đã nhớ đến!",
//   "TypeScript strict mode lần đầu dùng: muốn bỏ cuộc. Sau 1 tháng: không thể sống thiếu nó",
//   "Mẹ mình vừa học dùng smartphone. Cảm giác dạy ba mẹ dùng công nghệ vừa vui vừa... kiên nhẫn 😄",
//   "Tip tiết kiệm tiền hiệu quả: ghi chép chi tiêu mỗi ngày, dù chỉ mất 2 phút 💰",
//   "Sự khác biệt giữa busy và productive mình mãi gần đây mới thực sự hiểu ra",
//   "Ai ở Hà Nội không? Recommend cho mình quán ăn ngon khu Cầu Giấy với 🍽️",
//   "Vừa pass technical interview ở công ty mơ ước. Ôn 3 tháng cuối cùng cũng có kết quả 🙏",
//   "Burnout là có thật. Đừng cố gắng heroic khi cơ thể và đầu óc đang cần nghỉ ngơi",
//   "Side project của mình vừa đạt 100 users đầu tiên. Nhỏ thôi nhưng ý nghĩa lắm 🥹",
//   "Docker + WSL2 trên Windows giờ mượt lắm rồi. Anh em Windows dev không cần ghen tị Mac nữa 😏",
//   "Mình đang đọc về stoicism. Triết học này áp dụng vào cuộc sống hàng ngày được nhiều lắm",
//   "Đà Nẵng tháng 6 nắng cháy da nhưng biển đẹp kinh khủng 🏖️ Worth it!",
//   "Một ngày không scroll mạng xã hội: năng suất tăng gấp đôi. Đáng sợ thật sự 😬",
//   "Mọi người dùng framework gì cho backend Node.js? Express, Fastify hay NestJS?",
//   "Khoảnh khắc code chạy sau cả tiếng debug không có cảm giác nào sướng hơn 😤✨",
//   "Góc tâm sự: áp lực so sánh bản thân với người khác trên mạng xã hội thật sự mệt mỏi",
//   "Mình vừa học xong khóa design cơ bản. Bây giờ nhìn logo xấu là đau mắt ngay 👁️",
//   "Vietnamese street food là di sản văn hóa phi vật thể, không có gì tranh cãi 🍜🇻🇳",
//   "Open source contribution đầu tiên được merge. Nhỏ thôi nhưng hạnh phúc không tả được 🎉",
//   "Work-life balance không phải 50/50 mỗi ngày, mà là cân bằng theo từng giai đoạn cuộc đời",
//   "Mưa Sài Gòn chiều nào cũng đúng 3-5 giờ. Dự đoán chính xác hơn cả weather app 🌧️",
//   "Vừa thử intermittent fasting được 2 tuần. Kết quả: ngủ ngon hơn, tập trung hơn, đói hơn 😂",
//   "Nguyên tắc mình giữ khi làm việc nhóm: nói thẳng nhưng tử tế, không để hiểu nhầm tích tụ",
//   "PostgreSQL vs MySQL - mình đã switch và không nhìn lại. Ai cần lý do thì hỏi mình 🐘",
//   "Chiều nay ngồi công viên đọc sách, không điện thoại 1 tiếng. Recommend mọi người thử 🌳",
//   "Các bạn trẻ mới ra trường: đừng sợ nhận job lương thấp hơn nếu môi trường học được nhiều hơn",
//   "Mình đang build một app nhỏ giải quyết vấn đề của chính mình. Ai muốn beta test không? 🛠️",
// ];

// const REPLY_CONTENTS = [
//   "Đồng ý với bạn 100% luôn! Mình cũng vậy 👏",
//   "Thật ra mình cũng đang tự hỏi điều tương tự 🤔",
//   "Ủa giống mình quá vậy 😂 Hôm qua mình cũng vừa trải qua",
//   "Bạn nói rất đúng, nhưng mình nghĩ còn một góc nhìn khác nữa...",
//   "Cảm ơn bạn đã chia sẻ, đọc xong thấy nhẹ lòng hơn nhiều 🙏",
//   "Lmao mình cũng y chang bạn luôn 😭",
//   "Theo mình thì nên thử thêm một vài cách khác xem sao",
//   "Haha đúng quá, ai mà không biết cảm giác này chứ",
//   "Bạn có thể kể thêm không? Mình tò mò lắm 👀",
//   "Ôi trời mình đang cần nghe điều này hôm nay, cảm ơn bạn nhiều!",
//   "Mình không đồng ý lắm, vì theo kinh nghiệm của mình thì...",
//   "Quá chill luôn, mình muốn làm điều này lắm 😌",
//   "Bạn recommend app/tool gì để bắt đầu không?",
//   "Đây là reminder mình cần hôm nay 💪",
//   "Mình đã làm điều này được 6 tháng rồi, thực sự thay đổi nhiều lắm",
//   "Bạn làm ở đâu vậy? Công ty có tuyển không hỏi thẳng luôn 😂",
//   "Cần khai thác topic này nhiều hơn, bạn post tiếp đi!",
//   "Mình đang ở bước đầu, bạn có tips gì không?",
//   "Sự thật đau lòng nhưng cần nghe 😤",
//   "+1, hoàn toàn đồng ý với bạn",
//   "Mình nghĩ khác một chút, nhưng quan điểm của bạn cũng có lý",
//   "Haizzz đúng lắm bạn ơi, burnout thật sự là có thật",
//   "Đang làm điều y chang bạn luôn, mình không đơn độc rồi 🥹",
//   "Bạn nói được điều mình không biết cách diễn đạt 🙌",
//   "Hỏi thật nhé, bạn làm điều này bao lâu rồi?",
//   "Mình bookmark cái này để đọc lại khi cần động lực",
//   "Giờ mình mới biết điều này, cảm ơn bạn nhiều lắm!",
//   "Nhìn lại thấy mình cũng đã qua giai đoạn này rồi, bạn cố lên nhé 💙",
//   "Không ngờ nhiều người cũng cảm thấy vậy, tưởng chỉ mình thôi",
//   "Mình sẽ thử áp dụng ngay hôm nay xem sao 🔥",
//   "Bạn có thể viết chi tiết hơn không? Muốn hiểu rõ hơn",
//   "Đây là content chất lượng, mình chia sẻ cho mấy đứa bạn liền",
//   "Mình từng nghĩ khác nhưng giờ thì thấy bạn nói đúng rồi",
//   "Câu này đáng suy nghĩ thật sự 👆",
//   "Bạn vừa nói hộ lòng mình luôn 😮‍💨",
//   "Cái này không dễ làm nhưng đáng thử lắm",
//   "Mình cũng đang cố gắng mỗi ngày, chúng ta cùng cố nhé!",
//   "Ủa bạn ở đâu vậy? Cùng gặp cafe nói chuyện thêm không 😄",
//   "Lần đầu thấy ai nói thẳng được điều này, respect bạn nhiều lắm",
//   "Facts. Không có gì cần thêm 🫡",
// ];

// const QUOTE_CONTENTS = [
//   "Bài này hay quá, mình muốn thêm: đừng quên nghỉ ngơi cũng là một phần của quá trình 🌿",
//   "Đồng ý! Và mình nghĩ điều quan trọng hơn là bắt đầu từ những thứ nhỏ nhất",
//   "Thêm vào đây: việc này cực kỳ đúng với dân IT, mình thấy ở mọi team mình từng làm",
//   "Quote lại vì quá relevant với tình trạng của mình lúc này 😅",
//   "Bổ sung thêm góc nhìn: điều này cũng áp dụng được cho cả cuộc sống cá nhân, không chỉ công việc",
//   "Mình đồng ý nhưng có một exception: khi bạn đang trong flow state thì đừng dừng lại 🔥",
//   "Cái này mình đã thực hành 6 tháng và confirm là đúng. Highly recommend!",
//   "Thêm context: mình đã sai vì không làm điều này sớm hơn 🫠",
//   "Chia sẻ lại vì bạn bè mình cần đọc cái này ngay hôm nay",
//   "Góc nhìn của bạn hay lắm. Mình muốn counter một chút: và nếu không thì sao?",
//   "Facts. Mình đã trải qua và xác nhận điều này 100%",
//   "Hay đấy! Nhưng còn một điều nữa mọi người hay bỏ qua là consistency",
//   "Tag một người bạn cần đọc cái này 👇",
//   "Đây là reminder cho mình tuần này. Cảm ơn bạn đã post!",
//   "Mình quote lại không phải để tranh luận mà để nói: bạn nói rất đúng 👏",
//   "Bổ sung: và đừng so sánh journey của mình với người khác, mỗi người một con đường",
//   "Câu này đáng in ra dán lên màn hình máy tính thật sự 📌",
//   "Thêm vào: điều này đúng hơn gấp đôi khi bạn làm việc remote",
//   "Mình quote vì đây là điều mình muốn nói nhưng không biết cách diễn đạt 🙌",
//   "Có thể thêm hashtag không? Muốn nhiều người thấy bài này hơn",
//   "Repost kèm: ai đang struggle với điều này thì bình luận, mình ở đây",
//   "Mình có góc nhìn ngược lại: đôi khi làm ngược lại cũng cho kết quả tốt",
//   "Cái này áp dụng cho cả relationship nữa, không chỉ công việc 🤭",
//   "Quote lại và thêm: điều mình học được sau 2 năm đi làm chính là điều này",
//   "Bạn nói ngắn gọn nhưng đầy đủ lắm. Mình muốn expand thêm một chút...",
//   "Này là life advice xịn xò mà không cần trả phí khóa học nào 😂",
//   "Mình chia sẻ lại vì muốn giữ lại để đọc sau, và cũng muốn bạn bè thấy",
//   "Đồng ý 80%, 20% còn lại mình nghĩ cần thêm điều kiện là...",
//   "Hot take nhưng mình thấy đây là sự thật mà ít ai chịu thừa nhận",
//   "Bài gốc hay rồi, mình chỉ muốn add thêm: đừng bỏ cuộc sau lần đầu tiên thất bại 💪",
//   "Đây là điều mình ước được ai đó nói với mình 3 năm trước",
//   "Thêm data point: mình thử và thất bại 3 lần trước khi thành công, bình thường lắm",
//   "Không đồng ý hoàn toàn nhưng tôn trọng góc nhìn của bạn. Đây là lý do mình nghĩ khác...",
//   "Mình quote lại để nhớ rằng mình không phải đang đi một mình trên con đường này 🙏",
//   "Cái này dành cho các bạn đang cân nhắc career switch: đọc đi rồi quyết định",
//   "Góc nhìn của người trong ngành: chính xác 100%, không có gì thêm",
//   "Thêm một tip nhỏ: ghi journal hàng ngày giúp mình thực hành điều này hiệu quả hơn",
//   "Quote kèm warning: điều này dễ nói khó làm, nhưng once bạn làm được thì game changer",
//   "Mình đã làm điều ngược lại trong 2 năm và hối hận. Bạn nói đúng rồi 😮‍💨",
//   "Bài này deserve nhiều like hơn. Mình spread giúp nhé!",
// ];

// // ─── Main ─────────────────────────────────────────────────────────────────────

// async function main() {
//   console.log("🌱 Bắt đầu seed posts, replies, quotes...");

//   // Lấy 100 user đã seed
//   const users = await prisma.user.findMany({
//     select: { id: true, username: true, name: true, avatar: true, bio: true },
//     take: 100,
//     orderBy: { createdAt: "asc" },
//   });

//   if (users.length < 2) {
//     throw new Error("Cần ít nhất 2 user trong DB. Chạy seed_users.ts trước!");
//   }

//   console.log(`✅ Tìm thấy ${users.length} users`);

//   // ── 1. Tạo 100 bài POST gốc ──────────────────────────────────────────────

//   console.log("📝 Tạo 100 bài POST gốc...");

//   const createdPosts: {
//     id: number;
//     publicId: string;
//     userId: string;
//     content: string;
//   }[] = [];

//   for (let i = 0; i < 100; i++) {
//     const author = users[i % users.length];
//     const content = POST_CONTENTS[i % POST_CONTENTS.length];
//     const createdAt = randomDate(60);

//     const post = await prisma.post.create({
//       data: {
//         userId: author.id,
//         content,
//         type: PostType.POST,
//         visibility: VisibilityPost.PUBLIC,
//         replyPermission: pick([
//           ReplyPermission.EVERYONE,
//           ReplyPermission.FOLLOWERS,
//           ReplyPermission.EVERYONE,
//           ReplyPermission.EVERYONE, // bias về EVERYONE
//         ]),
//         userSnapshot: {
//           id: author.id,
//           username: author.username,
//           name: author.name,
//           avatar: author.avatar,
//           bio: author.bio,
//         },
//         likesCount: Math.floor(Math.random() * 500),
//         repliesCount: 40,
//         repostsCountAndQuoteCount: 40,
//         viewsCount: Math.floor(Math.random() * 10000),
//         createdAt,
//         updatedAt: createdAt,
//       },
//       select: { id: true, publicId: true, userId: true, content: true },
//     });

//     createdPosts.push(post);

//     if ((i + 1) % 10 === 0) console.log(`  → ${i + 1}/100 posts`);
//   }

//   // ── 2. Tạo 40 REPLY cho mỗi post ─────────────────────────────────────────

//   console.log("💬 Tạo replies (100 posts × 40 replies)...");

//   for (let pi = 0; pi < createdPosts.length; pi++) {
//     const parentPost = createdPosts[pi];

//     const replyData = Array.from({ length: 40 }, (_, ri) => {
//       const replier = pickOther(users, parentPost.userId);
//       const createdAt = randomDate(30);
//       return {
//         userId: replier.id,
//         content: REPLY_CONTENTS[(pi * 40 + ri) % REPLY_CONTENTS.length],
//         type: PostType.REPLY,
//         visibility: VisibilityPost.PUBLIC,
//         replyPermission: ReplyPermission.EVERYONE,
//         parentId: parentPost.id,
//         parentPublicId: parentPost.publicId,
//         rootPostId: parentPost.id,
//         rootPublicId: parentPost.publicId,
//         userSnapshot: {
//           id: replier.id,
//           username: replier.username,
//           name: replier.name,
//           avatar: replier.avatar,
//           bio: replier.bio,
//         },
//         likesCount: Math.floor(Math.random() * 100),
//         repliesCount: 0,
//         repostsCountAndQuoteCount: 0,
//         viewsCount: Math.floor(Math.random() * 1000),
//         createdAt,
//         updatedAt: createdAt,
//       };
//     });

//     await prisma.post.createMany({ data: replyData });

//     if ((pi + 1) % 10 === 0)
//       console.log(`  → Replies: ${pi + 1}/100 posts done`);
//   }

//   // ── 3. Tạo 40 QUOTE cho mỗi post ─────────────────────────────────────────

//   console.log("🔁 Tạo quotes (100 posts × 40 quotes)...");

//   for (let pi = 0; pi < createdPosts.length; pi++) {
//     const originPost = createdPosts[pi];

//     const quoteData = Array.from({ length: 40 }, (_, qi) => {
//       const quoter = pickOther(users, originPost.userId);
//       const createdAt = randomDate(30);
//       return {
//         userId: quoter.id,
//         content: QUOTE_CONTENTS[(pi * 40 + qi) % QUOTE_CONTENTS.length],
//         type: PostType.QUOTE,
//         visibility: VisibilityPost.PUBLIC,
//         replyPermission: ReplyPermission.EVERYONE,
//         originPostId: originPost.id,
//         originPublicId: originPost.publicId,
//         isQuote: true,
//         userSnapshot: {
//           id: quoter.id,
//           username: quoter.username,
//           name: quoter.name,
//           avatar: quoter.avatar,
//           bio: quoter.bio,
//         },
//         likesCount: Math.floor(Math.random() * 150),
//         repliesCount: 0,
//         repostsCountAndQuoteCount: 0,
//         viewsCount: Math.floor(Math.random() * 2000),
//         createdAt,
//         updatedAt: createdAt,
//       };
//     });

//     await prisma.post.createMany({ data: quoteData });

//     if ((pi + 1) % 10 === 0)
//       console.log(`  → Quotes: ${pi + 1}/100 posts done`);
//   }

//   // ── Tổng kết ──────────────────────────────────────────────────────────────

//   const totalPosts = await prisma.post.count();
//   console.log(`
// ✅ Seed hoàn thành!
//    📝 100 posts gốc
//    💬 4,000 replies  (100 × 40)
//    🔁 4,000 quotes   (100 × 40)
//    ─────────────────────────────
//    📦 Tổng cộng: 8,100 bản ghi mới
//    💾 Tổng posts trong DB: ${totalPosts}
//   `);
// }

// main()
//   .catch((e) => {
//     console.error("❌ Seed thất bại:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// const hoList = [
//     "Nguyễn",
//     "Trần",
//     "Lê",
//     "Phạm",
//     "Hoàng",
//     "Huỳnh",
//     "Phan",
//     "Vũ",
//     "Võ",
//     "Đặng",
//     "Bùi",
//     "Đỗ",
//     "Hồ",
//     "Ngô",
//     "Dương",
//     "Lý",
//     "Đinh",
//     "Tô",
//     "Trương",
//     "Mai",
// ];

// const tenNam = [
//     "An",
//     "Bình",
//     "Cường",
//     "Dũng",
//     "Đạt",
//     "Hải",
//     "Hiếu",
//     "Hùng",
//     "Khoa",
//     "Khôi",
//     "Lâm",
//     "Long",
//     "Minh",
//     "Nam",
//     "Nghĩa",
//     "Nhân",
//     "Phong",
//     "Quân",
//     "Quang",
//     "Sơn",
//     "Tài",
//     "Thắng",
//     "Thiện",
//     "Toàn",
//     "Trí",
//     "Trọng",
//     "Tuấn",
//     "Tú",
//     "Việt",
//     "Vũ",
// ];

// const tenNu = [
//     "Anh",
//     "Chi",
//     "Diệu",
//     "Giang",
//     "Hà",
//     "Hằng",
//     "Hoa",
//     "Hương",
//     "Lan",
//     "Liên",
//     "Linh",
//     "Mai",
//     "My",
//     "Ngân",
//     "Nhi",
//     "Nhung",
//     "Phương",
//     "Tâm",
//     "Thảo",
//     "Thu",
//     "Thư",
//     "Thủy",
//     "Trang",
//     "Trinh",
//     "Uyên",
//     "Vân",
//     "Xuân",
//     "Yến",
// ];

// const tenDemNam = [
//     "Văn",
//     "Hữu",
//     "Đức",
//     "Minh",
//     "Quốc",
//     "Thành",
//     "Anh",
//     "Ngọc",
//     "Công",
//     "Bảo",
// ];
// const tenDemNu = [
//     "Thị",
//     "Ngọc",
//     "Thu",
//     "Thanh",
//     "Kim",
//     "Bích",
//     "Lan",
//     "Phương",
//     "Mỹ",
//     "Hà",
// ];

// const bioTemplates = [
//     (name: string) =>
//         `Xin chào, mình là ${name} 👋 Đam mê công nghệ và cà phê ☕`,
//     (name: string) => `${name} | Sống chậm lại, nghĩ nhiều hơn 🌿`,
//     (name: string) =>
//         `Mình là ${name}. Thích đọc sách, nghe nhạc và đi café 📚🎵`,
//     (_: string) => `Developer ban ngày ☀️ Gamer ban đêm 🎮`,
//     (name: string) => `${name} đây! Yêu Việt Nam 🇻🇳 | Foodie | Travel lover ✈️`,
//     (_: string) =>
//         `"Sống là để trải nghiệm" – Đang học cách tận hưởng từng khoảnh khắc 🌸`,
//     (name: string) =>
//         `Hi, tôi là ${name}. Đang xây dựng điều gì đó nhỏ nhưng có ý nghĩa 🛠️`,
//     (_: string) => `Thiết kế | Sáng tạo | Cà phê không đường ☕🎨`,
//     (name: string) => `${name} | Sinh viên năm 3 | Mê AI và Machine Learning 🤖`,
//     (_: string) => `Photographer 📸 | Hà Nội → Sài Gòn → Đà Nẵng`,
//     (name: string) =>
//         `Chào bạn! Mình là ${name}, thích chia sẻ kiến thức và học hỏi mỗi ngày 💡`,
//     (_: string) =>
//         `Lập trình viên fullstack. Yêu OSS. Hay than vãn về deadline 😅`,
//     (name: string) => `${name} | Marketing & Content Creator 📱 | HCM City`,
//     (_: string) => `Đang trên hành trình tìm bản thân 🗺️ | Mỗi ngày một điều mới`,
//     (name: string) => `${name} – Bác sĩ tương lai 🩺 | Yêu động vật 🐾`,
//     (_: string) =>
//         `Trader | Investor | "Tiền không mua được hạnh phúc nhưng mua được bình yên" 😌`,
//     (name: string) =>
//         `Xin chào! Tôi là ${name}. Đang cố không lướt mạng xã hội quá nhiều… 📵`,
//     (_: string) =>
//         `Giáo viên tiếng Anh 🇬🇧 | Mê du lịch bụi | Đã đặt chân 15 tỉnh thành`,
//     (name: string) => `${name} | UI/UX Designer | Figma addict 🎯`,
//     (_: string) =>
//         `Coder by day, dreamer by night ✨ | Uống trà sữa để tồn tại 🧋`,
// ];

// // ─── Helpers ────────────────────────────────────────────────────────────────

// function pick<T>(arr: T[]): T {
//     return arr[Math.floor(Math.random() * arr.length)];
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

// function makeUsername(fullName: string, index: number): string {
//     const base = slugify(fullName);
//     // thêm số cuối để tránh trùng
//     const suffix = (index + 1).toString().padStart(2, "0");
//     return `${base}${suffix}`;
// }

// interface UserSeedData {
//     email: string;
//     username: string;
//     password: string;
//     name: string;
//     bio: string;
//     avatar: string | null;
//     status: UserStatus;
//     isPrivate: boolean;
//     followersCount: number;
//     followingCount: number;
//     postsCount: number;
//     verifiedAt: Date | null;
// }

// function generateUserData(index: number): UserSeedData {
//     const isNam = Math.random() < 0.5;
//     const ho = pick(hoList);
//     const tenDem = isNam ? pick(tenDemNam) : pick(tenDemNu);
//     const ten = isNam ? pick(tenNam) : pick(tenNu);
//     const fullName = `${ho} ${tenDem} ${ten}`;

//     const username = makeUsername(fullName, index);
//     const email = `${username}@gmail.com`;
//     const bio = pick(bioTemplates)(ten);

//     // random stats trông thực tế
//     const followersCount = Math.floor(Math.random() * 2000);
//     const followingCount = Math.floor(Math.random() * 500);
//     const postsCount = Math.floor(Math.random() * 200);

//     // ~30% user verified, ~5% private
//     const verifiedAt =
//         Math.random() < 0.3 ? new Date(Date.now() - Math.random() * 1e10) : null;
//     const isPrivate = Math.random() < 0.05;

//     return {
//         email,
//         username,
//         password: "", // sẽ hash bên dưới
//         name: fullName,
//         bio,
//         avatar: null,
//         status: UserStatus.ACTIVE,
//         isPrivate,
//         followersCount,
//         followingCount,
//         postsCount,
//         verifiedAt,
//     };
// }

// // ─── Main seed ───────────────────────────────────────────────────────────────

// async function main() {
//     console.log("🌱 Bắt đầu seed 100 user Việt Nam...");

//     const PLAIN_PASSWORD = "12345678";
//     const hashedPassword = await bcrypt.hash(PLAIN_PASSWORD, 10);

//     const usedUsernames = new Set<string>();
//     const usedEmails = new Set<string>();

//     const usersData: UserSeedData[] = [];

//     for (let i = 0; i < 100; i++) {
//         let data = generateUserData(i);

//         // đảm bảo username / email không trùng
//         let attempt = 0;
//         while (usedUsernames.has(data.username) || usedEmails.has(data.email)) {
//             attempt++;
//             data = generateUserData(i + attempt * 1000);
//             data.username = `${data.username}${attempt}`;
//             data.email = `${data.username}@gmail.com`;
//         }

//         usedUsernames.add(data.username);
//         usedEmails.add(data.email);
//         usersData.push({ ...data, password: hashedPassword });
//     }

//     // upsert từng user (idempotent khi chạy lại)
//     let created = 0;
//     let skipped = 0;

//     for (const userData of usersData) {
//         const existing = await prisma.user.findFirst({
//             where: {
//                 OR: [{ email: userData.email }, { username: userData.username }],
//             },
//         });

//         if (existing) {
//             skipped++;
//             continue;
//         }

//         await prisma.user.create({
//             data: {
//                 email: userData.email,
//                 username: userData.username,
//                 password: userData.password,
//                 name: userData.name,
//                 bio: userData.bio,
//                 avatar: userData.avatar,
//                 status: userData.status,
//                 isPrivate: userData.isPrivate,
//                 followersCount: userData.followersCount,
//                 followingCount: userData.followingCount,
//                 postsCount: userData.postsCount,
//                 verifiedAt: userData.verifiedAt,
//             },
//         });
//         created++;
//     }

//     console.log(
//         `✅ Hoàn thành! Đã tạo: ${created} | Bỏ qua (đã tồn tại): ${skipped}`,
//     );

//     // In preview 5 user đầu
//     console.log("\n📋 Preview 5 user đầu tiên:");
//     usersData.slice(0, 5).forEach((u, i) => {
//         console.log(
//             `  ${i + 1}. ${u.name.padEnd(25)} | @${u.username.padEnd(20)} | ${u.email}`,
//         );
//         console.log(`     Bio: ${u.bio.slice(0, 60)}...`);
//         console.log(
//             `     👥 ${u.followersCount} followers · ${u.followingCount} following · ${u.postsCount} posts · ${u.verifiedAt ? "✔ verified" : "unverified"}`,
//         );
//     });
// }

// main()
//     .catch((e) => {
//         console.error("❌ Seed thất bại:", e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });



// async function addUsersToCircle() {
//     const CIRCLE_PUBLIC_ID = 'cmp3r74cp0014vstkkmwl0j2f'
//     const TARGET_USER_COUNT = 60

//     try {
//         // 1. Lấy circle cần thêm thành viên
//         const circle = await prisma.circle.findUnique({
//             where: { publicId: CIRCLE_PUBLIC_ID },
//             select: { id: true, createById: true }
//         })

//         if (!circle) {
//             throw new Error(`Circle with publicId ${CIRCLE_PUBLIC_ID} not found`)
//         }

//         console.log(`Found circle: id=${circle.id}, ownerId=${circle.createById}`)

//         // 2. Lấy danh sách user hiện có trong circle (để tránh duplicate)
//         const existingMemberUserIds = await prisma.circleMember.findMany({
//             where: { circleId: circle.id },
//             select: { userId: true }
//         }).then(members => members.map(m => m.userId))

//         console.log(`Circle already has ${existingMemberUserIds.length} members`)

//         // 3. Lấy TARGET_USER_COUNT user chưa có trong circle
//         //    (có thể loại trừ owner nếu muốn, nhưng owner đã là member? thường owner đã có trong circleMembers)
//         //    Lấy user bất kỳ, không phải owner? Bạn có thể điều chỉnh điều kiện.
//         const availableUsers = await prisma.user.findMany({
//             where: {
//                 id: {
//                     notIn: existingMemberUserIds,
//                     // not: circle.createById // optional: nếu bạn không muốn thêm owner lần nữa
//                 }
//             },
//             take: TARGET_USER_COUNT,
//             select: { id: true }
//         })

//         if (availableUsers.length === 0) {
//             console.log('No new users to add.')
//             return
//         }

//         console.log(`Found ${availableUsers.length} users not yet in circle`)

//         // 4. Chuẩn bị dữ liệu để insert
//         const membersToAdd = availableUsers.map(user => ({
//             circleId: circle.id,
//             userId: user.id,
//             role: RoleMembership.MEMBER
//         }))

//         // 5. Thêm vào bảng CircleMember (dùng createMany để tối ưu)
//         const result = await prisma.circleMember.createMany({
//             data: membersToAdd,
//             skipDuplicates: true // an toàn trong trường hợp race condition
//         })

//         console.log(`Successfully added ${result.count} users to circle ${CIRCLE_PUBLIC_ID}`)

//         // 6. (Tuỳ chọn) Cập nhật lại số lượng member trong bảng circle nếu có field membersCount
//         //    Schema hiện tại không có membersCount, nên bỏ qua.
//         //    Nếu cần, có thể increment bằng $executeRaw hoặc thêm field sau.

//     } catch (error) {
//         console.error('Error adding users to circle:', error)
//     } finally {
//         await prisma.$disconnect()
//     }
// }

// addUsersToCircle()
// async function main() {
//     const users = await prisma.user.findMany({
//         where: { deletedAt: null },
//         select: { id: true, username: true },
//     });

//     if (users.length === 0) {
//         throw new Error('Không tìm thấy user nào trong database!');
//     }

//     const pick = (i: number) => users[i % users.length];

//     const circlesData = [
//         // 🧑‍💻 Tech & Dev
//         { name: 'Dev Vietnam 🇻🇳', description: 'Cộng đồng lập trình viên Việt Nam. Chia sẻ kiến thức, kinh nghiệm và cơ hội nghề nghiệp trong ngành công nghệ.', visibility: Visibility.PUBLIC, statusPeak: true },
//         { name: 'AI & Machine Learning', description: 'Thảo luận về trí tuệ nhân tạo, machine learning và các xu hướng AI mới nhất trên thế giới.', visibility: Visibility.PUBLIC, statusPeak: true },
//         { name: 'Backend Engineers', description: 'Nhóm kín dành cho backend engineers. Thảo luận về architecture, system design, database và DevOps chuyên sâu.', visibility: Visibility.PRIVATE, statusPeak: false },
//         { name: 'Frontend Wizards', description: 'React, Vue, Svelte hay Vanilla JS? Không quan trọng — miễn là UI đẹp và UX mượt mà.', visibility: Visibility.PUBLIC, statusPeak: false },
//         { name: 'Cloud & DevOps Hub', description: 'Chia sẻ kiến thức về AWS, GCP, Azure, Kubernetes, CI/CD và các thực hành DevOps hiện đại.', visibility: Visibility.PUBLIC, statusPeak: true },
//         { name: 'Mobile Dev Club', description: 'iOS, Android, Flutter, React Native — tất cả về phát triển ứng dụng di động đều có ở đây.', visibility: Visibility.PUBLIC, statusPeak: false },
//         { name: 'Open Source VN', description: 'Kết nối các contributor và maintainer open source Việt Nam. Cùng nhau build những thứ cool.', visibility: Visibility.PUBLIC, statusPeak: true },
//         { name: 'Security & Pentest', description: 'Nhóm kín về an ninh mạng, penetration testing, CTF và bug bounty dành cho các hacker mũ trắng.', visibility: Visibility.PRIVATE, statusPeak: false },
//         { name: 'Database Architects', description: 'PostgreSQL, MySQL, MongoDB, Redis — thảo luận về thiết kế database, query optimization và data modeling.', visibility: Visibility.PUBLIC, statusPeak: false },
//         { name: 'GameDev Việt', description: 'Cộng đồng phát triển game Việt Nam. Từ indie game đến AAA, Unity đến Unreal Engine đều welcome.', visibility: Visibility.PUBLIC, statusPeak: false },

//         // 🎨 Design & Creative
//         { name: 'Design & UX Community', description: 'Không gian dành cho các designer, UX researcher và những ai yêu thích thiết kế sản phẩm số.', visibility: Visibility.PUBLIC, statusPeak: false },
//         { name: 'Motion & Animation', description: 'After Effects, Lottie, CSS animation — chia sẻ tác phẩm và kỹ thuật làm motion design đỉnh cao.', visibility: Visibility.PUBLIC, statusPeak: true },
//         { name: 'Brand Identity Lab', description: 'Nơi các brand designer chia sẻ case study, logo design, brand guidelines và câu chuyện thương hiệu.', visibility: Visibility.PRIVATE, statusPeak: false },
//         { name: 'Figma Masters VN', description: 'Tips, tricks, plugins và resources Figma. Auto layout đến variables — master hết tất cả.', visibility: Visibility.PUBLIC, statusPeak: false },
//         { name: 'Photography Circle', description: 'Chia sẻ ảnh chụp, kỹ thuật nhiếp ảnh, gear review và hành trình khám phá ánh sáng & khoảnh khắc.', visibility: Visibility.CIRCLE, statusPeak: false },

//         // 🚀 Business & Career
//         { name: 'Startup Founders Circle', description: 'Dành cho những người sáng lập startup. Chia sẻ hành trình, thách thức và bài học kinh nghiệm khởi nghiệp.', visibility: Visibility.PUBLIC, statusPeak: true },
//         { name: 'Product Managers VN', description: 'Cộng đồng PM Việt Nam. Roadmap, prioritization, stakeholder management và tất cả về làm product.', visibility: Visibility.PUBLIC, statusPeak: false },
//         { name: 'Freelancers Vietnam', description: 'Cộng đồng freelancer Việt Nam. Kết nối, chia sẻ dự án, rate card và kinh nghiệm làm việc tự do.', visibility: Visibility.CIRCLE, statusPeak: false },
//         { name: 'Growth Hackers', description: 'Chiến lược tăng trưởng, A/B testing, funnel optimization và các growth experiment thực chiến.', visibility: Visibility.PRIVATE, statusPeak: true },
//         { name: 'Tech Recruiters Network', description: 'Mạng lưới recruiter ngành công nghệ. Chia sẻ JD hay, sourcing tips và insight về thị trường nhân sự IT.', visibility: Visibility.PUBLIC, statusPeak: false },

//         // 🌐 Web3 & Finance
//         { name: 'Web3 & Blockchain VN', description: 'Khám phá thế giới Web3, DeFi, NFT và công nghệ blockchain cùng cộng đồng crypto Việt Nam.', visibility: Visibility.PUBLIC, statusPeak: true },
//         { name: 'DeFi Research Lab', description: 'Phân tích protocol, tokenomics, yield farming strategy và các cơ hội DeFi cho người nghiêm túc.', visibility: Visibility.PRIVATE, statusPeak: true },
//         { name: 'Stock & Investment Club', description: 'Phân tích cổ phiếu, ETF, crypto và các kênh đầu tư tài chính. Knowledge sharing, không phải pump & dump.', visibility: Visibility.CIRCLE, statusPeak: false },
//         { name: 'Fintech Builders', description: 'Xây dựng tương lai tài chính số. Payment, lending, insurtech và mọi thứ về fintech đều ở đây.', visibility: Visibility.PUBLIC, statusPeak: false },

//         // 📚 Learning & Knowledge
//         { name: 'Book Club Tech', description: 'Câu lạc bộ đọc sách về công nghệ, kinh doanh và phát triển bản thân. Mỗi tháng một cuốn sách mới.', visibility: Visibility.PRIVATE, statusPeak: false },
//         { name: 'English for Techies', description: 'Luyện tiếng Anh chuyên ngành công nghệ. Từ technical writing đến presentation skills và interview prep.', visibility: Visibility.PUBLIC, statusPeak: false },
//         { name: 'Research Paper Club', description: 'Đọc và thảo luận các paper về AI, CS và công nghệ. Từ arxiv đến NeurIPS — cùng nhau hiểu sâu hơn.', visibility: Visibility.PRIVATE, statusPeak: true },
//         { name: 'Junior Dev Support', description: 'Nơi an toàn để junior developer hỏi bất cứ điều gì. Không có câu hỏi nào là ngu ngốc ở đây.', visibility: Visibility.PUBLIC, statusPeak: false },
//         { name: 'CS Fundamentals', description: 'Algorithms, data structures, system design và những kiến thức nền tảng mà mọi developer cần nắm vững.', visibility: Visibility.PUBLIC, statusPeak: false },

//         // 🎮 Lifestyle & Community
//         { name: 'Tech & Coffee ☕', description: 'Chill, networking và nói chuyện random về tech. Không cần agenda — chỉ cần cà phê và đam mê.', visibility: Visibility.PUBLIC, statusPeak: false },
//         { name: 'Remote Work Life', description: 'Chia sẻ kinh nghiệm làm việc remote — từ setup workspace, quản lý thời gian đến tìm client quốc tế.', visibility: Visibility.PUBLIC, statusPeak: false },
//         { name: 'Vietnam Expat Tech', description: 'Dành cho tech người Việt đang làm việc ở nước ngoài. Networking, cơ hội việc làm và chia sẻ cuộc sống abroad.', visibility: Visibility.CIRCLE, statusPeak: false },
//         { name: 'Women in Tech VN', description: 'Cộng đồng phụ nữ trong ngành công nghệ Việt Nam. Mentorship, networking và cùng nhau phá vỡ rào cản.', visibility: Visibility.PUBLIC, statusPeak: true },
//         { name: 'Tech Memes & Fun', description: 'Meme, joke và tất cả những thứ buồn cười về cuộc đời developer. Vì không phải lúc nào cũng phải serious.', visibility: Visibility.PUBLIC, statusPeak: false },

//         // 🏙️ Local Communities
//         { name: 'HCM Tech Community', description: 'Cộng đồng công nghệ Thành phố Hồ Chí Minh. Events, meetup, hackathon và kết nối người làm tech tại HCM.', visibility: Visibility.PUBLIC, statusPeak: true },
//         { name: 'Hanoi Dev Guild', description: 'Hội lập trình viên Hà Nội. Meetup định kỳ, chia sẻ kinh nghiệm và kết nối cộng đồng tech thủ đô.', visibility: Visibility.PUBLIC, statusPeak: false },
//         { name: 'Da Nang Tech Scene', description: 'Cộng đồng công nghệ Đà Nẵng. Thành phố đáng sống — và ngành tech đang bùng nổ tại đây.', visibility: Visibility.PUBLIC, statusPeak: false },

//         // 🔬 Specialized
//         { name: 'IoT & Embedded Systems', description: 'Arduino, Raspberry Pi, ESP32 và tất cả về Internet of Things. Hardware meets software.', visibility: Visibility.PUBLIC, statusPeak: false },
//         { name: 'Data Engineers VN', description: 'Data pipeline, ETL, Spark, Kafka và mọi thứ về data engineering cho người xây dựng hạ tầng dữ liệu.', visibility: Visibility.PRIVATE, statusPeak: false },
//         { name: 'No-Code & Low-Code', description: 'Bubble, Webflow, Zapier, n8n — xây dựng sản phẩm nhanh hơn mà không cần (nhiều) code.', visibility: Visibility.PUBLIC, statusPeak: false },
//         { name: 'Tech for Social Good', description: 'Dùng công nghệ để giải quyết vấn đề xã hội. Giáo dục, môi trường, y tế — tech có thể tạo ra sự khác biệt.', visibility: Visibility.PUBLIC, statusPeak: true },
//     ];

//     console.log('🌱 Bắt đầu seed 40 circles...\n');

//     let count = 0;
//     for (const [i, data] of circlesData.entries()) {
//         const circle = await circleRepository.create({
//             ...data, createById: pick(i).id
//         });

//         count++;
//         const peakIcon = circle.statusPeak ? '🔥' : '  ';
//         const visIcon = circle.visibility === 'PUBLIC' ? '🌐' : circle.visibility === 'PRIVATE' ? '🔒' : '⭕';
//         console.log(`${String(count).padStart(2, '0')}. ${peakIcon} ${visIcon} ${circle.name} — @${circle.createdBy.username}`);
//     }

//     console.log(`\n✅ Đã tạo ${count} circles thành công!`);
// }

// main()
//     .catch((e) => {
//         console.error('❌ Seed thất bại:', e);
//         process.exit(1);
//     })
//     .finally(() => prisma.$disconnect());