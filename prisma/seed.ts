// // prisma/seed.ts
// import { PrismaMariaDb } from '@prisma/adapter-mariadb';
// import { PostType, PrismaClient } from '@prisma/client';
// import dotenv from 'dotenv';
// dotenv.config();

// const adapter = new PrismaMariaDb({
//     port: Number(process.env.DB_PORT) || 3306,
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || 'password',
//     database: process.env.DB_NAME || 'threads_api',
// });
// const prisma = new PrismaClient({
//     adapter,
// });

// // Realistic post templates - mix Vietnamese and English
// const postTemplates = [
//     // Tech / Dev
//     "Hôm nay debug cả ngày mới tìm ra bug, hoá ra chỉ thiếu một dấu chấm phẩy 😭 #coding #developer",
//     "Just shipped a feature I've been working on for 2 weeks. The feeling is unmatched 🚀",
//     "TypeScript đôi khi làm tôi phát điên nhưng không có nó thì còn phát điên hơn 😂",
//     "Mọi người đang dùng framework gì cho side project? Tôi đang cân nhắc giữa Next.js và Nuxt",
//     "Code review culture is so important. A good review can teach you more than any tutorial.",
//     "3 giờ sáng vẫn còn code, deadline mai rồi 💀",
//     "Prisma + PostgreSQL combo is genuinely underrated for indie projects",
//     "Ai có kinh nghiệm với Redis Pub/Sub cho real-time features không? Đang implement notification system",
//     "Clean code is not about being clever. It's about being clear.",
//     "Vừa migrate từ REST sang GraphQL, đúng là có nhiều trade-offs hơn tôi nghĩ",

//     // Life / Personal
//     "Sáng nay cà phê ngon quá, cả ngày có động lực ☕",
//     "Work from home sau 2 năm vẫn chưa quen được cái khoản tự kỷ luật 😅",
//     "Cuối tuần mà vẫn ngồi nghĩ về công việc, ai cũng vậy không?",
//     "Hà Nội mưa cả ngày, perfect excuse to stay in and read books 📚",
//     "TGIF! What are everyone's plans for the weekend?",
//     "Đôi khi chỉ cần một buổi chiều không làm gì, không nghĩ gì là đủ rồi",
//     "Vừa đặt vé đi Đà Lạt tháng sau, ai có chỗ nào hay recommend không?",
//     "The older I get, the more I appreciate slow mornings",
//     "Gym 3 tháng liên tục không nghỉ ngày nào, cảm giác tự hào ghê 💪",
//     "Cooking at home > eating out. Change my mind.",

//     // Opinions / Thoughts
//     "Hot take: meetings that could be emails are stealing people's most productive hours",
//     "Người ta hay nói 'fake it till you make it' nhưng tôi nghĩ 'learn it till you become it' thực tế hơn",
//     "The best investment you can make is in yourself. Sounds cliche but it's true.",
//     "Quiet quitting không phải là lười, đôi khi chỉ là đang bảo vệ sức khoẻ tinh thần",
//     "Social media làm cho chúng ta so sánh cuộc sống thật của mình với highlight reel của người khác",
//     "Vulnerability is not weakness. It takes courage to be honest about struggles.",
//     "Tôi thấy Gen Z có work-life balance mindset tốt hơn thế hệ trước rất nhiều",
//     "Imposter syndrome hits different when you're the only one who knows how fake you feel 😭",
//     "The world would be better if people were just a little kinder online",
//     "Passion follows mastery, not the other way around. Stop waiting to feel passionate first.",

//     // Questions / Engagement
//     "Mọi người học tiếng Anh bằng cách nào hiệu quả nhất? Đang tìm cách cải thiện speaking",
//     "Best productivity app you've used this year? I've tried too many and nothing sticks",
//     "Netflix hay đang xem series gì hay không? Đã xem hết mọi thứ trong watchlist rồi 😭",
//     "Ai có kinh nghiệm freelance không? Đang tính chuyển từ fulltime sang",
//     "What's one book that genuinely changed how you think?",
//     "Sài Gòn vs Hà Nội, mọi người thích sống ở đâu hơn và tại sao?",
//     "Remote work or office? What do you prefer after experiencing both?",
//     "Mọi người tự học AI/ML bằng tài liệu gì? Đang bắt đầu từ zero",

//     // Casual / Humor
//     "Me before coffee: 😵 Me after coffee: 😵‍💫",
//     "Vừa xem lại code của mình 6 tháng trước... xin lỗi tôi của tương lai 😅",
//     "The audacity of bugs appearing only in production 🙃",
//     "Hôm nay productive không? Tôi thì productive trong việc lướt Twitter 💀",
//     "When the designer says 'just make it pop' 🫠",
//     "Monday energy: 💀 Friday energy: 💀 but different",
//     "Ăn sáng 1 mình nhìn điện thoại vs ăn sáng cùng bạn bè nói chuyện thật... gen Z chúng mình đang mất dần cái gì đó rồi",
//     "2024 taught me: done is better than perfect. Still unlearning perfectionism daily.",
//     "Why do the best ideas always come in the shower?",
//     "Đặt alarm 6am để tập thể dục, tắt alarm, ngủ tiếp. Mỗi. Sáng.",
// ];

// // Reply templates
// const replyTemplates = [
//     "Tôi cũng vậy! Đồng cảm quá 😂",
//     "Agree 100%! Đã share cho team rồi",
//     "This is so relatable omg",
//     "Haha same!! Mỗi ngày đều như vậy",
//     "Trời ơi đúng không thể đúng hơn 😭",
//     "Hot take nhưng đúng 👏",
//     "Bro cần ngủ đi 😭",
//     "Skill issue thôi bạn ơi 😂",
//     "Okay this made my day 😂",
//     "Sự thật đau lòng nhưng phải công nhận",
//     "Chờ tôi note lại cái này",
//     "Đây là lý do tôi follow bạn 🔥",
//     "Real talk fr fr",
//     "Mình cũng đang như vậy, solidarity 🫂",
//     "Unpopular opinion but I agree with this",
//     "Cái cuối cùng là cái cần nhất 😂",
//     "Touch grass bestie 🌿",
//     "This post found me at the right time",
//     "Nói thay cho bao nhiêu người luôn 👏",
//     "Okay but seriously though, facts",
// ];

// // Quote post additions
// const quoteAdditions = [
//     "Thêm vào này:",
//     "Có thêm một điều nữa là...",
//     "True, và thực ra còn hơn thế:",
//     "Relate quá, nhưng cũng cần nói thêm:",
//     "Ý này hay, extend thêm chút:",
// ];

// async function main() {
//     console.log("🌱 Fetching existing users...");

//     const users = await prisma.user.findMany({
//         where: { deletedAt: null, status: "ACTIVE" },
//         select: { id: true, username: true, name: true },
//         take: 50,
//     });

//     if (users.length === 0) {
//         console.error("❌ No users found! Please seed users first.");
//         process.exit(1);
//     }

//     console.log(`✅ Found ${users.length} users`);

//     const shuffle = <T>(arr: T[]): T[] =>
//         arr
//             .map((v) => ({ v, sort: Math.random() }))
//             .sort((a, b) => a.sort - b.sort)
//             .map(({ v }) => v);

//     const randomUser = () => users[Math.floor(Math.random() * users.length)];
//     const randomItem = <T>(arr: T[]): T =>
//         arr[Math.floor(Math.random() * arr.length)];

//     const shuffledTemplates = shuffle([...postTemplates]);
//     const targetThreads = Math.min(50, shuffledTemplates.length);

//     console.log(`\n📝 Creating ${targetThreads} threads...`);

//     const createdPosts: number[] = [];

//     for (let i = 0; i < targetThreads; i++) {
//         const author = randomUser();
//         const content = shuffledTemplates[i];

//         // Randomize created time within last 30 days
//         const daysAgo = Math.floor(Math.random() * 30);
//         const hoursAgo = Math.floor(Math.random() * 24);
//         const createdAt = new Date(
//             Date.now() - daysAgo * 86400000 - hoursAgo * 3600000
//         );

//         // Create root post
//         const post = await prisma.post.create({
//             data: {
//                 userId: author.id,
//                 content,
//                 type: PostType.POST,
//                 createdAt,
//                 updatedAt: createdAt,
//             },
//         });

//         createdPosts.push(post.id);
//         process.stdout.write(`  ✓ Thread ${i + 1}/${targetThreads} (ID: ${post.id}) by @${author.username}\n`);

//         // Add 1-5 replies
//         const replyCount = Math.floor(Math.random() * 5) + 1;
//         let lastReplyId = post.id;
//         let rootId = post.id;

//         for (let r = 0; r < replyCount; r++) {
//             const replier = randomUser();
//             const replyContent = randomItem(replyTemplates);
//             const replyAt = new Date(createdAt.getTime() + (r + 1) * 600000 * (Math.random() + 0.5));

//             const reply = await prisma.post.create({
//                 data: {
//                     userId: replier.id,
//                     content: replyContent,
//                     type: PostType.REPLY,
//                     parentId: r === 0 ? post.id : lastReplyId,
//                     rootPostId: rootId,
//                     createdAt: replyAt,
//                     updatedAt: replyAt,
//                 },
//             });

//             // Update parent reply count
//             await prisma.post.update({
//                 where: { id: r === 0 ? post.id : lastReplyId },
//                 data: { repliesCount: { increment: 1 } },
//             });

//             lastReplyId = reply.id;
//         }

//         // 30% chance of quote post
//         if (Math.random() < 0.3 && i > 0) {
//             const quotedId = createdPosts[Math.floor(Math.random() * createdPosts.length)];
//             const quoter = randomUser();
//             const quoteAt = new Date(createdAt.getTime() + Math.random() * 3600000 * 5);

//             await prisma.post.create({
//                 data: {
//                     userId: quoter.id,
//                     content: `${randomItem(quoteAdditions)} ${randomItem(replyTemplates)}`,
//                     type: PostType.QUOTE,
//                     originPostId: quotedId,
//                     createdAt: quoteAt,
//                     updatedAt: quoteAt,
//                 },
//             });

//             await prisma.post.update({
//                 where: { id: quotedId },
//                 data: { quotesCount: { increment: 1 } },
//             });
//         }

//         // 20% chance of repost
//         if (Math.random() < 0.2 && i > 0) {
//             const repostedId = createdPosts[Math.floor(Math.random() * createdPosts.length)];
//             const reposter = randomUser();
//             const repostAt = new Date(createdAt.getTime() + Math.random() * 3600000 * 3);

//             // Get original content for snapshot
//             const original = await prisma.post.findUnique({
//                 where: { id: repostedId },
//                 include: { user: { select: { username: true, name: true, avatar: true } } },
//             });

//             if (original) {
//                 await prisma.post.create({
//                     data: {
//                         userId: reposter.id,
//                         content: original.content,
//                         type: PostType.REPOST,
//                         originPostId: repostedId,
//                         userSnapshot: {
//                             id: original.user.id,
//                             username: original.user.username,
//                             name: original.user.name,
//                             avatar: original.user.avatar,
//                         },
//                         createdAt: repostAt,
//                         updatedAt: repostAt,
//                     },
//                 });

//                 await prisma.post.update({
//                     where: { id: repostedId },
//                     data: { repostsCount: { increment: 1 } },
//                 });
//             }
//         }

//         // Add random likes
//         const likeCount = Math.floor(Math.random() * 15);
//         const likers = shuffle([...users]).slice(0, likeCount);

//         for (const liker of likers) {
//             if (liker.id === author.id) continue;
//             try {
//                 await prisma.like.create({
//                     data: { userId: liker.id, postId: post.id },
//                 });
//             } catch { } // ignore duplicate
//         }

//         if (likeCount > 0) {
//             await prisma.post.update({
//                 where: { id: post.id },
//                 data: { likesCount: likeCount },
//             });
//         }
//     }

//     const totalPosts = await prisma.post.count();
//     const totalLikes = await prisma.like.count();

//     console.log(`\n🎉 Done!`);
//     console.log(`   📬 Total posts in DB: ${totalPosts}`);
//     console.log(`   ❤️  Total likes in DB: ${totalLikes}`);
//     console.log(`   🧵 Threads created: ${targetThreads}`);
// }

// main()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(() => prisma.$disconnect());
