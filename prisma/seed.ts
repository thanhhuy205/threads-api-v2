// prisma/seed.ts
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

// const rootContents = [
//     // Tech / Dev
//     `Sau 3 năm làm backend, mình nhận ra rằng: code sạch không phải là viết ít dòng nhất — mà là code người khác đọc vào hiểu ngay mà không cần hỏi. 🧹`,
//     `Hot take: TypeScript không làm bạn code nhanh hơn, nhưng nó làm bạn ngủ ngon hơn lúc 2am khi production bị lỗi 😅`,
//     `Vừa refactor một đống code 3 năm tuổi không có test. Đây là góc nhìn của tôi sau khi sống sót qua 2 tuần địa ngục: thread 🧵`,
//     `Hỏi thật: mọi người đang dùng gì để quản lý state trong 2025? Redux vẫn đang sống hay đã bị thay thế hoàn toàn rồi?`,
//     `Điều không ai nói với bạn khi bắt đầu làm dev: phần khó nhất không phải là code — mà là đặt tên biến. Đây là hoàn toàn nghiêm túc. 😐`,
//     `Just shipped a side project I've been building for 6 months. Zero users so far. Still the proudest I've been of anything I've built. 🚢`,
//     `The best career advice I ever got: your job is not to write code. Your job is to solve problems. Code is just one tool.`,
//     `AI tools are changing how I work, but not in the way I expected. I spend less time writing boilerplate and more time thinking about architecture. That's actually a good thing?`,
//     `Unpopular opinion: most apps don't need a microservices architecture. A well-structured monolith will serve you for years. Don't over-engineer.`,
//     `Database indexing saved our app from death today. One missing index → queries going from 8s to 40ms. Please index your columns, people. 🙏`,

//     // Life / Travel
//     `Đà Lạt 3 ngày 2 đêm với budget 1.5 triệu/người. Có thể làm được không? Cùng mình khám phá nhé 🌿`,
//     `Tokyo solo trip tips không ai chia sẻ: luôn mua IC card ngay tại sân bay, tránh đổi tiền ở khách sạn, và 7-Eleven ngon hơn nhiều nhà hàng bình dân ở VN 🇯🇵`,
//     `Coffee shop culture ở Hà Nội vs TP.HCM: người HN ngồi uống cà phê để suy nghĩ, người SG uống để làm việc. Cả hai đều đúng. ☕`,
//     `Solo travelling changed me more than any therapy session ever did. There's something about being alone in an unfamiliar city that forces you to actually meet yourself.`,
//     `The hidden cost of travelling that nobody budgets for: the week after you come back when nothing feels right and your bed feels too familiar.`,
//     `Living abroad for 2 years now. The things I miss about home aren't the places — they're the sounds. My mom's voice in the kitchen. Rain on the roof at 3am.`,

//     // Food
//     `Công thức nước chấm bún bò Huế chuẩn của ngoại mình. Không phải bí mật gia truyền gì, chỉ là kiên nhẫn và mắm ruốc chất lượng 🫙`,
//     `Ai bảo ăn healthy là phải nhạt nhẽo? Mình đã ăn plant-based 8 tháng và đây là 5 món mình không thể sống thiếu 🥑`,
//     `Rating all 12 instant noodle brands I tried this month. Doing the lord's work so you don't have to 🍜`,
//     `Controversial food opinion: Vietnamese coffee is objectively the best coffee culture in the world. The ratio of condensed milk to bitter espresso is an art form.`,

//     // Wellness / Mindset
//     `Mình đã bỏ điện thoại khỏi phòng ngủ được 6 tháng. Đây là những gì thay đổi: giấc ngủ tốt hơn, buổi sáng chậm hơn, và mình dần ngừng cảm thấy mình đang bỏ lỡ gì đó.`,
//     `Burnout isn't about working too much. It's about working too much on things that don't align with your values. That distinction took me 3 years to understand.`,
//     `Therapy taught me that most of my "productivity" habits were actually anxiety coping mechanisms. Restructuring that has been the hardest and best thing I've done.`,
//     `30 days no social media. Here's what actually happened (spoiler: I did not suddenly become enlightened, but I did read 4 books) 📚`,

//     // Design / Creative
//     `Design trend mình ghét nhất năm nay: dark mode mà contrast quá thấp đến mức đọc không được. Tối thui ≠ đẹp. 🎨`,
//     `Every good designer I know has a dedicated "ugly work" phase. The gap between your taste and your skill is real — the only way through it is volume.`,
//     `Just redesigned our onboarding flow. Reduced drop-off by 34% with one change: removing a question we asked but never actually used. Delete > redesign.`,

//     // Career / Work
//     `Mình từ chối offer lương 3x để ở lại công ty cũ. Lý do: team tốt, scope lớn, và tôi còn đang học rất nhiều. Tiền quan trọng nhưng không phải tất cả.`,
//     `3 điều mình ước ai đó nói trước khi mình nhảy startup: equity ≠ tiền thật, runway ngắn hơn bạn nghĩ, và culture fit quan trọng gấp đôi kỹ năng. 📌`,
//     `Been a manager for 18 months. The skill nobody prepares you for: having hard conversations with people you genuinely like and respect.`,
//     `Remote work isn't for everyone and that's okay. The people who thrive in it are usually the ones who had already figured out self-direction. It's a skill, not a personality type.`,

//     // Random / Relatable
//     `Tại sao cứ 9pm mình mới nảy ra ý tưởng hay nhất ngày và không còn energy để thực hiện? Ai giải thích được không? 😭`,
//     `The audacity of my brain to give me my best ideas at 2am when I have a 9am meeting tomorrow.`,
//     `Hot take: "I'll sleep when I'm dead" is the least productive mindset a founder can have. Sleep is when your brain solves problems. You're literally skipping the solver.`,
//     `Mình có một quy tắc: không bao giờ ra quyết định quan trọng sau 10pm. Ngủ một đêm và xem lại sáng hôm sau. Chưa bao giờ hối hận vì điều này.`,

//     // Music / Art / Culture
//     `Nghe lại album cũ sau 5 năm mới thấy: âm nhạc không chỉ là âm thanh — nó là snapshot của một khoảnh khắc trong cuộc sống bạn. 🎵`,
//     `There's a specific kind of loneliness that only vinyl collectors understand: when the record ends and you have to get up to flip it, but the song was too good to pause.`,
//     `Film photography in 2025 feels like a radical act. You get 36 shots. You have to mean it. Slowing down is the whole point. 📷`,

//     // Environment / Social
//     `Sau chuyến đi Phú Quốc về, mình không thể không nghĩ đến lượng rác nhựa mình thấy trên biển. Cần làm gì đó, dù nhỏ thôi. 🌊`,
//     `The climate conversation often forgets the global south — the people least responsible for emissions are the most affected. That's not a talking point. That's injustice.`,

//     // Relationships
//     `Bạn thân là người không cần cập nhật context mỗi lần gặp lại. Họ hiểu câu chuyện đang ở chỗ nào dù đã lâu không liên lạc. 🫂`,
//     `Friendship advice: the people who show up when things are bad > the people who celebrate with you when things are good. Both matter, but scarcity reveals everything.`,
//     `Long distance relationships taught me that presence isn't always physical. Sometimes it's a voice note at 7am that says "thought of you."`,

//     // Finance
//     `Mình bắt đầu đầu tư từ năm 22 tuổi với 1 triệu/tháng. 5 năm sau đây là những gì thực sự xảy ra (không phải highlight reel) 📊`,
//     `Personal finance tip that saved me: before any purchase over $100, I wait 72 hours. 80% of the time I don't buy it. The other 20% I'm genuinely glad I did.`,

//     // Misc hot topics
//     `AI-generated content is flooding the internet and honestly my biggest fear isn't job loss — it's the erosion of genuine human voice online. Are you reading a person right now?`,
//     `The paradox of choice is real: I have access to every song ever recorded and I still replay the same 40 songs on shuffle. 🔁`,
//     `Học tiếng Anh không cần phải học ngữ pháp hoàn hảo trước. Cứ nói, cứ sai, cứ sửa. Perfection is the enemy of fluency. 🗣`,
//     `Sau khi đọc "Deep Work" của Cal Newport, mình đã thay đổi toàn bộ cách làm việc. 4 tiếng tập trung thực sự > 8 tiếng liên tục bị ngắt quãng.`,
//     `The gym taught me more about discipline than any self-help book. You can't read your way to a deadlift. You have to show up.`,
// ];

// const replyPools: string[] = [
//     // Agreement
//     `Đồng ý 100%. Đã trải qua điều này rồi và không thể nói hay hơn.`,
//     `This is the content I come here for. Thank you for saying this out loud.`,
//     `Chính xác những gì mình đang cần nghe hôm nay. 🙌`,
//     `Saved this. Going to reread every time I need a reality check.`,
//     `Mình share cái này cho team rồi. Quá đúng.`,
//     `Người duy nhất trên internet đang nói thật 😭`,
//     `Finally someone said it. I've been thinking about this for months.`,
//     `Thread này đáng được nhiều người đọc hơn.`,

//     // Questions / Discussion
//     `Tò mò: bạn đến nhận thức này sau bao lâu làm việc?`,
//     `Can you expand on this? Especially the part about [context]. I feel like there's a lot more to unpack.`,
//     `Bạn có gợi ý tài nguyên nào để đọc thêm về cái này không?`,
//     `What was the turning point for you?`,
//     `Mình đang ở giai đoạn đầu của hành trình này. Bạn có lời khuyên gì cho người mới không?`,
//     `Have you written more about this somewhere? Would love to read a longer piece.`,
//     `Câu hỏi thật sự: điều gì khó nhất để áp dụng trong thực tế?`,
//     `How long did it take before you noticed actual results?`,

//     // Personal stories
//     `Mình đã từng trải qua y hệt vậy. Cảm giác biết mình không phải một mình thật sự rất nhẹ nhõm.`,
//     `This resonated deeply. I went through something similar last year and it changed everything.`,
//     `Cái phần về [chi tiết] — mình cần ai đó nói điều đó 3 năm trước. Đã lãng phí bao nhiêu thời gian.`,
//     `Reading this at 1am after a rough week. Needed this more than I knew.`,
//     `Bạn vừa mô tả chính xác cuộc sống của mình trong 6 tháng vừa rồi wtf 😭`,
//     `I screenshot this. Sending to my therapist next session lol.`,
//     `Đây là lần đầu tiên mình comment trên một bài post vì cảm thấy quá đồng cảm.`,

//     // Pushback / Different views
//     `Không hoàn toàn đồng ý — tôi nghĩ có những trường hợp ngoại lệ quan trọng mà bạn đang bỏ qua.`,
//     `Interesting take but I think the nuance here matters a lot. It really depends on context.`,
//     `Có một góc nhìn khác: điều này có thể đúng với một số người nhưng không phải tất cả.`,
//     `Counterpoint: what works for you in your context might not scale. Curious to hear your thoughts on edge cases.`,
//     `Tôi nghĩ đây hơi oversimplify vấn đề. Reality phức tạp hơn nhiều.`,

//     // Humor
//     `Me reading this while doing exactly what you just said not to do 🙃`,
//     `Bộ não mình: *đọc xong bài này* okay okay tôi hiểu rồi. Bộ não mình lúc 2am: 🤡`,
//     `I am being called out and I don't appreciate it 😭`,
//     `Mình đang làm điều ngược lại với mọi thứ bạn vừa nói và bài này tìm thấy mình một cách rất chính xác.`,
//     `God said let there be a post that personally attacks me today and here we are`,
//     `Tại sao cái này lại đúng đến mức đau thế? 😂`,
//     `Thanks I hate it (mình đang nhìn vào gương qua bài post này)`,
//     `The audacity of this post to be correct`,

//     // Emojis / Short reactions
//     `🔥🔥🔥`,
//     `Cần bookmark cái này ngay. 📌`,
//     `Screenshotting and printing this. Framing it. 🖼`,
//     `💯 nothing else to add`,
//     `Mình cần xăm cái này lên tay 😅`,
//     `Real ones know 🤝`,
//     `👏👏👏`,
//     `Ơn giời cuối cùng cũng có người nói thẳng ra.`,

//     // Tagging / Sharing intent
//     `Đang tag mấy người bạn cần đọc cái này.`,
//     `Gửi cái này cho crush xem có đồng quan điểm không lol`,
//     `Đang screenshot để dành cho lần sau khi mình quên mất điều này.`,
//     `Forwarding this to my entire team right now.`,
//     `Mình vừa gửi link này cho 6 người. Không giải thích thêm.`,
//     `The group chat is going to explode when I share this.`,

//     // Follow-up questions
//     `Phần 2 khi nào ra vậy?`,
//     `Please write more about this.`,
//     `Tiếp tục đi bạn ơi! Mình muốn nghe phần còn lại.`,
//     `There's a book / article / resource on this that I think you'd love — DM me if interested.`,
//     `Bạn có plan viết thêm về chủ đề này không?`,

//     // Mixed / Thoughtful
//     `Tôi đã suy nghĩ về điều này từ góc độ khác: khi chúng ta nói [X], chúng ta thường bỏ qua [Y]. Tò mò muốn biết bạn nghĩ gì.`,
//     `What you said about the early stages really hits. I'm still in that phase and it's hard to see the light at the end.`,
//     `Cái insight này tưởng đơn giản nhưng thực ra rất khó để internalize. Cảm ơn bạn đã nhắc.`,
//     `I've been thinking about this all day since I first read it this morning. Can't shake it.`,
//     `Bạn có thể nói về cách bạn bắt đầu không? Phần đầu luôn là khó nhất với mình.`,
//     `There's research backing this up too — the empirical side is fascinating if you want to go deeper.`,
//     `Mình đồng ý với tinh thần chung nhưng cách thực hiện thì tôi làm khác một chút. Có lẽ context của mỗi người khác nhau.`,
//     `Beautifully put. I've tried to articulate this feeling for years and you just did it in two sentences.`,
// ];

// const quoteCommentaries: string[] = [
//     `Bài này quan trọng. Mọi người nên đọc. 👇`,
//     `Cái này cần nhiều người thấy hơn. Reposting với bình luận của tôi:`,
//     `Adding to this: từ kinh nghiệm cá nhân, tôi có thể xác nhận điều này là đúng.`,
//     `This deserves more attention. My two cents below 👇`,
//     `Been sitting on this for a week. Time to add my perspective.`,
//     `Context from my own experience that might help with this:`,
//     `Đồng ý và muốn thêm một góc nhìn nữa từ phía mình:`,
//     `Important thread. Amplifying because more people need to see this.`,
//     `Mình không thể đọc cái này mà không share kèm ý kiến của mình.`,
//     `The framing here is interesting. Here's how I think about it differently:`,
//     `Coming back to share this because it's more relevant now than when it was first posted.`,
//     `Đã chia sẻ và thêm vài dòng suy nghĩ. Cảm ơn OP vì bài viết này.`,
//     `Building on this excellent point with a real example from my work:`,
//     `Muốn share cái này cho community của mình và thêm một chút context:`,
//     `This aged well. Sharing with commentary because it's even more relevant today.`,
//     `My team and I discussed this exact thing last week. Here's where we landed:`,
//     `Đây là bài viết đã thay đổi cách mình nhìn nhận vấn đề. Recommend mọi người đọc.`,
//     `Couldn't agree more and wanted to add a practical angle to this.`,
//     `Saving this and amplifying it because the reply section deserves more visibility too.`,
//     `Resharing because this conversation is worth continuing. My take:`,
// ];

// // ---------------------------------------------------------------------------
// // Helpers
// // ---------------------------------------------------------------------------

// function pick<T>(arr: T[]): T {
//     return arr[Math.floor(Math.random() * arr.length)];
// }

// function pickN<T>(arr: T[], n: number): T[] {
//     const shuffled = [...arr].sort(() => Math.random() - 0.5);
//     return shuffled.slice(0, n);
// }

// function randInt(min: number, max: number) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function makeSnapshot(user: { id: string; username: string; name: string | null; avatar: string | null }) {
//     return {
//         id: user.id,
//         username: user.username,
//         name: user.name,
//         avatar: user.avatar,
//     };
// }

// // ---------------------------------------------------------------------------
// // Main seed
// // ---------------------------------------------------------------------------

// async function main() {
//     console.log('🌱 Seeding posts…\n');

//     // --- 1. Load users ---
//     const users = await prisma.user.findMany({
//         select: { id: true, username: true, name: true, avatar: true },
//     });

//     if (users.length === 0) {
//         throw new Error('No users found. Run user seed first.');
//     }

//     console.log(`👥 Found ${users.length} users`);

//     // --- 2. Create 50 root posts ---
//     console.log('📝 Creating 50 root posts…');

//     const contentPool = [...rootContents].sort(() => Math.random() - 0.5);
//     const rootPosts: Awaited<ReturnType<typeof prisma.post.create>>[] = [];

//     for (let i = 0; i < 50; i++) {
//         const author = pick(users);
//         const content = contentPool[i % contentPool.length];

//         const post = await prisma.post.create({
//             data: {
//                 userId: author.id,
//                 content,
//                 type: PostType.POST,
//                 userSnapshot: makeSnapshot(author),
//                 replyPermission: pick(['everyone', 'everyone', 'everyone', 'followers', 'mentioned']),
//                 likesCount: randInt(5, 2400),
//                 repliesCount: 0, // will update after
//                 repostsCountAndQuoteCount: randInt(0, 180),
//                 viewsCount: randInt(200, 45000),
//             },
//         });

//         rootPosts.push(post);
//         process.stdout.write(`\r  ✅ Root posts: ${i + 1} / 50`);
//     }

//     console.log('\n');

//     // --- 3. Create ~30 replies per root post ---
//     console.log('💬 Creating replies…');

//     let totalReplies = 0;

//     for (const rootPost of rootPosts) {
//         const replyCount = randInt(25, 35);
//         const replyAuthors = pickN(users, Math.min(replyCount, users.length));

//         const firstLevelReplies: Awaited<ReturnType<typeof prisma.post.create>>[] = [];

//         for (let r = 0; r < replyCount; r++) {
//             const author = replyAuthors[r % replyAuthors.length];

//             // 70% direct reply to root, 30% nested reply to a previous reply
//             const isNested = r > 3 && Math.random() < 0.3 && firstLevelReplies.length > 0;
//             const parent = isNested ? pick(firstLevelReplies) : rootPost;

//             const reply = await prisma.post.create({
//                 data: {
//                     userId: author.id,
//                     content: pick(replyPools),
//                     type: PostType.REPLY,
//                     parentId: parent.id,
//                     parentPublicId: parent.publicId,
//                     rootPostId: rootPost.id,
//                     rootPublicId: rootPost.publicId,
//                     originPostId: null,
//                     userSnapshot: makeSnapshot(author),
//                     replyPermission: 'everyone',
//                     likesCount: randInt(0, 320),
//                     repliesCount: 0,
//                     repostsCountAndQuoteCount: randInt(0, 20),
//                     viewsCount: randInt(50, 5000),
//                 },
//             });

//             if (!isNested) firstLevelReplies.push(reply);
//             totalReplies++;
//         }

//         // Update repliesCount on root post
//         await prisma.post.update({
//             where: { id: rootPost.id },
//             data: { repliesCount: replyCount },
//         });

//         process.stdout.write(`\r  💬 Replies created: ${totalReplies}`);
//     }

//     console.log('\n');

//     // --- 4. Create ~25 quote posts ---
//     console.log('🔁 Creating quote posts…');

//     const quotePosts = pickN(rootPosts, 25);

//     for (let q = 0; q < quotePosts.length; q++) {
//         const origin = quotePosts[q];
//         const author = pick(users.filter((u) => u.id !== origin.userId));

//         await prisma.post.create({
//             data: {
//                 userId: author.id,
//                 content: pick(quoteCommentaries),
//                 type: PostType.QUOTE,
//                 isQuote: true,
//                 originPostId: origin.id,
//                 originPublicId: origin.publicId,
//                 userSnapshot: makeSnapshot(author),
//                 replyPermission: 'everyone',
//                 likesCount: randInt(2, 480),
//                 repliesCount: randInt(0, 15),
//                 repostsCountAndQuoteCount: randInt(0, 30),
//                 viewsCount: randInt(100, 8000),
//             },
//         });

//         // Update repostsCountAndQuoteCount on origin
//         await prisma.post.update({
//             where: { id: origin.id },
//             data: { repostsCountAndQuoteCount: { increment: 1 } },
//         });

//         process.stdout.write(`\r  🔁 Quote posts: ${q + 1} / ${quotePosts.length}`);
//     }

//     console.log('\n');

//     // --- Summary ---
//     const postCount = await prisma.post.count();
//     console.log(`\n🎉 Done!`);
//     console.log(`   📝 Root posts  : 50`);
//     console.log(`   💬 Replies     : ${totalReplies}`);
//     console.log(`   🔁 Quote posts : ${quotePosts.length}`);
//     console.log(`   📦 Total posts : ${postCount}`);
// }

// main()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(() => prisma.$disconnect());
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

// import * as bcrypt from 'bcrypt';

// const users = [
//     // --- Việt Nam ---
//     { email: 'nguyenvanminh@gmail.com', username: 'minhvn.photo', name: 'Nguyễn Văn Minh', bio: 'Nhiếp ảnh gia tự do | Hà Nội 📷', location: 'Hà Nội', website: 'https://minhphoto.vn' },
//     { email: 'tranthilan@gmail.com', username: 'lanthilan', name: 'Trần Thị Lan', bio: 'Coffee lover ☕ | Sống chậm thôi', location: 'TP. HCM', website: null },
//     { email: 'phamquochung99@gmail.com', username: 'quochung.dev', name: 'Phạm Quốc Hùng', bio: 'Backend dev 🛠 | Open source fan', location: 'Đà Nẵng', website: 'https://github.com/quochung' },
//     { email: 'lehuongtra@outlook.com', username: 'huongtrale', name: 'Lê Hương Trà', bio: 'Yêu bếp núc 🍜 | Foodie Saigon', location: 'TP. HCM', website: null },
//     { email: 'votienbao@gmail.com', username: 'bao.travels', name: 'Võ Tiến Bảo', bio: 'Du lịch bụi khắp Đông Nam Á 🌏', location: 'Cần Thơ', website: 'https://baotravels.blog' },
//     { email: 'dinhthanhmai@gmail.com', username: 'mai.designs', name: 'Đinh Thanh Mai', bio: 'UI/UX Designer | Figma addict 🎨', location: 'Hà Nội', website: 'https://maidsgn.com' },
//     { email: 'buiminhtuan2k@gmail.com', username: 'tuanbikelife', name: 'Bùi Minh Tuấn', bio: 'Xe đạp, núi rừng & tự do 🚴', location: 'Đà Lạt', website: null },
//     { email: 'ngothihuyen.hn@gmail.com', username: 'huyenngo.life', name: 'Ngô Thị Huyền', bio: 'Giáo viên tiếng Anh | Sách & cà phê 📚', location: 'Hà Nội', website: null },
//     { email: 'hoangduchuy@gmail.com', username: 'duchuy_fit', name: 'Hoàng Đức Huy', bio: 'PT cá nhân 💪 | Healthy lifestyle', location: 'TP. HCM', website: 'https://duchuyfit.com' },
//     { email: 'caothianhthu@gmail.com', username: 'anhthu.crochet', name: 'Cao Thị Anh Thư', bio: 'Handmade lover 🧶 | Mèo & len sợi', location: 'Huế', website: null },

//     // --- International mix ---
//     { email: 'james.wright@gmail.com', username: 'jwright.creates', name: 'James Wright', bio: 'Filmmaker & storyteller 🎬 | LA based', location: 'Los Angeles, CA', website: 'https://jwrightfilm.com' },
//     { email: 'sofia.reyes93@gmail.com', username: 'sofiareyes', name: 'Sofía Reyes', bio: 'Bailarina 💃 | Madrid | Tacos > everything', location: 'Madrid, Spain', website: null },
//     { email: 'luca.ferretti@icloud.com', username: 'lucaf.archi', name: 'Luca Ferretti', bio: 'Architecture student 🏛 | Milan | Coffee snob', location: 'Milan, Italy', website: null },
//     { email: 'priya.sharma.in@gmail.com', username: 'priya.codes', name: 'Priya Sharma', bio: 'Full-stack dev 👩‍💻 | Chai > coffee always', location: 'Bangalore, India', website: 'https://priyasharma.dev' },
//     { email: 'tommy.nguyen.sg@gmail.com', username: 'tommyngsg', name: 'Tommy Nguyen', bio: 'Finance by day, DJ by night 🎧 | Singapore', location: 'Singapore', website: null },
//     { email: 'emily.chen.nyc@gmail.com', username: 'emchen.art', name: 'Emily Chen', bio: 'Illustrator & zine maker ✏️ | Brooklyn', location: 'New York, NY', website: 'https://emchen.art' },
//     { email: 'carlos.mendoza.mx@gmail.com', username: 'carlitos.mxfit', name: 'Carlos Mendoza', bio: 'Crossfit coach 🏋️ | CDMX | Dog dad 🐕', location: 'Mexico City', website: null },
//     { email: 'aisha.okonkwo@gmail.com', username: 'aisha.writes', name: 'Aisha Okonkwo', bio: 'Journalist & poet ✍️ | Lagos → London', location: 'London, UK', website: 'https://aishaink.com' },
//     { email: 'henrik.larsson@outlook.com', username: 'henrikl.outdoors', name: 'Henrik Larsson', bio: 'Hiking, kayaking & fika ☕ | Göteborg', location: 'Gothenburg, SE', website: null },
//     { email: 'yuki.tanaka.jp@gmail.com', username: 'yukitanaka_art', name: 'Yuki Tanaka', bio: '漫画家 🎌 | Tokyo | Ramen enthusiast', location: 'Tokyo, Japan', website: 'https://yukitanaka.jp' },

//     { email: 'alex.morrison.ca@gmail.com', username: 'alexm.photo', name: 'Alex Morrison', bio: 'Landscape photography 🏔 | Vancouver', location: 'Vancouver, CA', website: 'https://alexmphotos.ca' },
//     { email: 'nina.petrova.ru@gmail.com', username: 'ninaptrv', name: 'Nina Petrova', bio: 'Book translator 📖 | St. Petersburg | Cats 🐈', location: 'St. Petersburg', website: null },
//     { email: 'kwame.asante.gh@gmail.com', username: 'kwame.builds', name: 'Kwame Asante', bio: 'Civil engineer 🏗 | Accra | Afrobeats fan', location: 'Accra, Ghana', website: null },
//     { email: 'isabelle.martin@gmail.com', username: 'isa.patisserie', name: 'Isabelle Martin', bio: 'Pâtissière 🥐 | Lyon | Sucrée et salée', location: 'Lyon, France', website: 'https://isapatisserie.fr' },
//     { email: 'rajan.patel.uk@gmail.com', username: 'rajanpatel_dev', name: 'Rajan Patel', bio: 'DevOps @ fintech 🚀 | London | Chess ♟', location: 'London, UK', website: null },
//     { email: 'mia.hoffmann.de@gmail.com', username: 'miahoff.design', name: 'Mia Hoffmann', bio: 'Graphic designer 🎨 | Berlin | Vegan life 🌱', location: 'Berlin, Germany', website: 'https://miahoff.de' },
//     { email: 'omar.hassan.eg@gmail.com', username: 'omar.h.writes', name: 'Omar Hassan', bio: 'Screenwriter ✍️ | Cairo → Dubai | Film buff', location: 'Dubai, UAE', website: null },
//     { email: 'sarah.kim.kr@gmail.com', username: 'sarahkim.seoul', name: 'Sarah Kim', bio: 'K-beauty blogger 💄 | Seoul | Skincare junkie', location: 'Seoul, Korea', website: 'https://sarahkimbeauty.com' },
//     { email: 'marco.esposito.it@gmail.com', username: 'marcoespo.run', name: 'Marco Esposito', bio: 'Marathon runner 🏃 | Naples | Pizza scout 🍕', location: 'Naples, Italy', website: null },
//     { email: 'fatima.ali.pk@gmail.com', username: 'fatimaali.style', name: 'Fatima Ali', bio: 'Fashion designer 👗 | Lahore | Sustainable', location: 'Lahore, Pakistan', website: 'https://fatimaalifashion.com' },

//     { email: 'daniel.osei.gh@gmail.com', username: 'danosei.tech', name: 'Daniel Osei', bio: 'iOS dev 📱 | Kumasi | Afrofusion cooking 🍲', location: 'Kumasi, Ghana', website: 'https://github.com/danosei' },
//     { email: 'liu.yang.sh@gmail.com', username: 'liuyang_sh', name: 'Liu Yang', bio: '上海 | 咖啡 & 爵士乐 🎷 | Startup founder', location: 'Shanghai, China', website: null },
//     { email: 'anna.kowalska@gmail.com', username: 'annakowalska.art', name: 'Anna Kowalska', bio: 'Ceramicist 🏺 | Kraków | Slow living advocate', location: 'Kraków, Poland', website: 'https://annakowalska.pl' },
//     { email: 'jose.ruiz.es@gmail.com', username: 'joseruiz.chef', name: 'José Ruiz', bio: 'Chef & food critic 🍽 | Barcelona | Pintxos fan', location: 'Barcelona, Spain', website: null },
//     { email: 'amara.diallo.sn@gmail.com', username: 'amaradiallo', name: 'Amara Diallo', bio: 'NGO worker 🌍 | Dakar | Music & community', location: 'Dakar, Senegal', website: null },
//     { email: 'elena.ivanova.bg@gmail.com', username: 'elena.ivanova', name: 'Elena Ivanova', bio: 'Data scientist 📊 | Sofia | Hiking & jazz', location: 'Sofia, Bulgaria', website: 'https://elenaivanova.io' },
//     { email: 'jake.thompson@gmail.com', username: 'jakethompson.fit', name: 'Jake Thompson', bio: 'Personal trainer 💪 | Austin TX | BBQ king 🔥', location: 'Austin, TX', website: null },
//     { email: 'yuna.park.kr@gmail.com', username: 'yunapark.art', name: 'Yuna Park', bio: 'Webtoon artist 🎨 | Busan | Matcha addict 🍵', location: 'Busan, Korea', website: 'https://yunapark.krcomic' },
//     { email: 'victor.obi.ng@gmail.com', username: 'victor.obi', name: 'Victor Obi', bio: 'Software architect ⚙️ | Lagos | Afrobeats 🎵', location: 'Lagos, Nigeria', website: 'https://victorobi.dev' },
//     { email: 'rachel.green.uk@gmail.com', username: 'rachelg.books', name: 'Rachel Green', bio: 'Librarian & book blogger 📚 | Oxford | Tea ☕', location: 'Oxford, UK', website: 'https://rachelreads.co.uk' },

//     { email: 'mikael.bjorn@gmail.com', username: 'mikaelbjorn', name: 'Mikael Björn', bio: 'Sound engineer 🎚 | Stockholm | Metal & nature', location: 'Stockholm, SE', website: null },
//     { email: 'deepika.nair@gmail.com', username: 'deepika.nair', name: 'Deepika Nair', bio: 'UX researcher 🔍 | Chennai | Dance & coffee', location: 'Chennai, India', website: null },
//     { email: 'gabriel.silva.br@gmail.com', username: 'gabsilva.foto', name: 'Gabriel Silva', bio: 'Fotógrafo 📸 | São Paulo | Samba & futebol ⚽', location: 'São Paulo, Brazil', website: 'https://gabsilva.com.br' },
//     { email: 'nour.el.said.eg@gmail.com', username: 'nourels', name: 'Nour El-Said', bio: 'Architect 🏛 | Cairo | Street photography', location: 'Cairo, Egypt', website: null },
//     { email: 'sophie.dumont@gmail.com', username: 'sophiedumont', name: 'Sophie Dumont', bio: 'Marketing manager 📣 | Paris | Yoga & wine 🍷', location: 'Paris, France', website: null },
//     { email: 'arjun.mehta.in@gmail.com', username: 'arjunmehta.dev', name: 'Arjun Mehta', bio: 'ML engineer 🤖 | Mumbai | Chess & cricket 🏏', location: 'Mumbai, India', website: 'https://arjunmehta.dev' },
//     { email: 'chloe.evans.au@gmail.com', username: 'chloeevans.au', name: 'Chloe Evans', bio: 'Marine biologist 🐠 | Sydney | Surf & science', location: 'Sydney, Australia', website: null },
//     { email: 'igor.smirnov.ru@gmail.com', username: 'igorsmirnov', name: 'Igor Smirnov', bio: 'Game dev 🕹 | Moscow | Indie games & vodka', location: 'Moscow, Russia', website: 'https://igorgames.itch.io' },
//     { email: 'amelia.jones.us@gmail.com', username: 'ameliaj.wellness', name: 'Amelia Jones', bio: 'Nutritionist 🥑 | Portland OR | Plant-based', location: 'Portland, OR', website: 'https://ameliawellness.com' },
//     { email: 'tariq.hassan.ae@gmail.com', username: 'tariqh.biz', name: 'Tariq Hassan', bio: 'Entrepreneur 💼 | Dubai | Falcon & falcon 🦅', location: 'Dubai, UAE', website: 'https://tariqhassan.ae' },

//     { email: 'zara.ahmed.uk@gmail.com', username: 'zaraahmed', name: 'Zara Ahmed', bio: 'Journalist 📰 | Manchester | Poetry & tea ☕', location: 'Manchester, UK', website: null },
//     { email: 'paulo.lima.br@gmail.com', username: 'paulolima.beats', name: 'Paulo Lima', bio: 'Músico & produtor 🎹 | Rio | Bossa nova lover', location: 'Rio de Janeiro', website: 'https://paulolima.music' },
//     { email: 'han.jiyeon.kr@gmail.com', username: 'jiyeonhan', name: 'Han Ji-yeon', bio: '여행 & 필름 카메라 📷 | 서울 | 커피 홀릭', location: 'Seoul, Korea', website: null },
//     { email: 'tobias.muller.de@gmail.com', username: 'tobias.muller', name: 'Tobias Müller', bio: 'Physicist 🔬 | Hamburg | Cycling & sci-fi 📚', location: 'Hamburg, Germany', website: null },
//     { email: 'grace.otieno.ke@gmail.com', username: 'graceotieno', name: 'Grace Otieno', bio: 'Nurse & advocate 💙 | Nairobi | Faith & family', location: 'Nairobi, Kenya', website: null },
//     { email: 'rafael.moreno.co@gmail.com', username: 'rafamoreno.arq', name: 'Rafael Moreno', bio: 'Arquitecto 🏠 | Medellín | Café & cumbia ☕', location: 'Medellín, Colombia', website: null },
//     { email: 'mei.lin.tw@gmail.com', username: 'meilin.tw', name: 'Mei Lin', bio: '台灣 🇹🇼 | 烘焙控 🍞 | 貓 & 茶 | Slow living', location: 'Taipei, Taiwan', website: 'https://meilinbakes.com' },
//     { email: 'liam.obrien.ie@gmail.com', username: 'liamobrien.ie', name: 'Liam O\'Brien', bio: 'Pub quiz champion 🍺 | Dublin | Rugby & code', location: 'Dublin, Ireland', website: null },
//     { email: 'sana.malik.pk@gmail.com', username: 'sana.malik.art', name: 'Sana Malik', bio: 'Digital artist 🎨 | Karachi | Inspired by chaos', location: 'Karachi, Pakistan', website: 'https://sanamalikart.com' },

//     { email: 'elias.berg.no@gmail.com', username: 'eliasbergno', name: 'Elias Berg', bio: 'Fisherman & writer ✍️ | Bergen | Cold waters 🐟', location: 'Bergen, Norway', website: null },
//     { email: 'camille.rousseau@gmail.com', username: 'camillerou', name: 'Camille Rousseau', bio: 'Photographe 📷 | Bordeaux | Vin & voyages 🍷', location: 'Bordeaux, France', website: 'https://camillerousseau.fr' },
//     { email: 'adebayo.adeleke@gmail.com', username: 'bayo.codes', name: 'Adebayo Adeleke', bio: 'Frontend dev ⚡ | Abuja | Music & Manchester Utd', location: 'Abuja, Nigeria', website: 'https://github.com/bayocodes' },
//     { email: 'natasha.brown.us@gmail.com', username: 'natasha.b.writes', name: 'Natasha Brown', bio: 'Copywriter & brand strategist ✏️ | Chicago', location: 'Chicago, IL', website: 'https://natashab.com' },
//     { email: 'hyun.woo.kr@gmail.com', username: 'hyunwoo.music', name: 'Hyun-woo Choi', bio: '밴드 기타리스트 🎸 | 홍대 | 인디음악 & 고양이', location: 'Seoul, Korea', website: null },
//     { email: 'giovanni.russo.it@gmail.com', username: 'gio.russo', name: 'Giovanni Russo', bio: 'Chef 👨‍🍳 | Roma | Pasta is religion 🍝', location: 'Rome, Italy', website: null },
//     { email: 'astrid.h@gmail.com', username: 'astridh.dk', name: 'Astrid Hansen', bio: 'Interior designer 🛋 | Copenhagen | Hygge life', location: 'Copenhagen, DK', website: 'https://astridhansen.dk' },
//     { email: 'jerome.nkosi.za@gmail.com', username: 'jerome.nkosi', name: 'Jerome Nkosi', bio: 'Entrepreneur & DJ 🎧 | Cape Town | Waves 🌊', location: 'Cape Town, SA', website: null },
//     { email: 'valentina.cruz.ar@gmail.com', username: 'vale.cruz.ba', name: 'Valentina Cruz', bio: 'Psicóloga 🧠 | Buenos Aires | Mate & tango 💃', location: 'Buenos Aires, AR', website: null },
//     { email: 'samuel.chen.us@gmail.com', username: 'samchen.product', name: 'Samuel Chen', bio: 'Product manager 📋 | San Francisco | VC curious', location: 'San Francisco, CA', website: 'https://samuelchen.xyz' },

//     { email: 'ines.ferreira.pt@gmail.com', username: 'inesferreira.pt', name: 'Inês Ferreira', bio: 'Fadista & professora 🎵 | Lisboa | Mar & saudade', location: 'Lisbon, Portugal', website: null },
//     { email: 'dmitri.volkov.ru@gmail.com', username: 'dmitrivolkov', name: 'Dmitri Volkov', bio: 'Cybersec researcher 🔐 | Novosibirsk | CTF ⚡', location: 'Novosibirsk, RU', website: 'https://github.com/dvolkov' },
//     { email: 'akosua.boateng.gh@gmail.com', username: 'akosua.boateng', name: 'Akosua Boateng', bio: 'Fashion blogger 👗 | Accra | Kente & culture', location: 'Accra, Ghana', website: 'https://akosuastyle.com' },
//     { email: 'finn.mccarthy.au@gmail.com', username: 'finnmccarthy.au', name: 'Finn McCarthy', bio: 'Surfer & barista ☀️ | Gold Coast | Saltwater', location: 'Gold Coast, AU', website: null },
//     { email: 'lena.vogel.de@gmail.com', username: 'lenavogel.berlin', name: 'Lena Vogel', bio: 'Startup founder 🚀 | Berlin | Oat milk flat white', location: 'Berlin, Germany', website: 'https://lenavogel.com' },
//     { email: 'kwabena.owusu.gh@gmail.com', username: 'kwabena.owusu', name: 'Kwabena Owusu', bio: 'Law student ⚖️ | Kumasi | Football & hip-hop', location: 'Kumasi, Ghana', website: null },
//     { email: 'hana.suzuki.jp@gmail.com', username: 'hana.suzuki.jp', name: 'Hana Suzuki', bio: 'Florist & content creator 🌸 | Kyoto | Ikebana', location: 'Kyoto, Japan', website: 'https://hanasuzuki.jp' },
//     { email: 'pedro.alves.br@gmail.com', username: 'pedroalves.br', name: 'Pedro Alves', bio: 'Dev & gamer 🎮 | Brasília | Pixel art lover', location: 'Brasília, Brazil', website: 'https://github.com/pedroalvesbr' },
//     { email: 'nadia.el.amrani@gmail.com', username: 'nadia.elamrani', name: 'Nadia El Amrani', bio: 'Architect & artist 🏛 | Casablanca | Zellige 🕌', location: 'Casablanca, MA', website: null },
//     { email: 'oscar.lindqvist@gmail.com', username: 'oscar.lq', name: 'Oscar Lindqvist', bio: 'Economist 📈 | Malmö | Running & podcast 🎙', location: 'Malmö, Sweden', website: null },

//     { email: 'tiffany.wu.us@gmail.com', username: 'tiffanywu.eats', name: 'Tiffany Wu', bio: 'Food content creator 🍜 | LA | Dim sum always', location: 'Los Angeles, CA', website: 'https://tiffanywueats.com' },
//     { email: 'esteban.vargas.cr@gmail.com', username: 'esteban.vargas', name: 'Esteban Vargas', bio: 'Biólogo 🌿 | San José | Bosques & pura vida 🦜', location: 'San José, CR', website: null },
//     { email: 'layla.ibrahim.eg@gmail.com', username: 'layla.ibrahim', name: 'Layla Ibrahim', bio: 'UX designer 💡 | Cairo | Arabic calligraphy ✒️', location: 'Cairo, Egypt', website: 'https://layla.design' },
//     { email: 'max.schneider.at@gmail.com', username: 'maxschneider.at', name: 'Max Schneider', bio: 'Ski instructor ⛷ | Innsbruck | Alps & espresso', location: 'Innsbruck, AT', website: null },
//     { email: 'amina.touré.ml@gmail.com', username: 'amina.toure', name: 'Amina Touré', bio: 'Journalist & activist 📰 | Bamako | Words matter', location: 'Bamako, Mali', website: null },
//     { email: 'oliver.james.uk@gmail.com', username: 'oliverjames.uk', name: 'Oliver James', bio: 'Economist → Podcaster 🎙 | London | Long-form', location: 'London, UK', website: 'https://oliverjamespod.com' },
//     { email: 'zanele.dlamini.za@gmail.com', username: 'zanele.dlamini', name: 'Zanele Dlamini', bio: 'Artist & activist 🎨 | Joburg | Ubuntu spirit', location: 'Johannesburg, SA', website: 'https://zaneledlamini.art' },
//     { email: 'takumi.ito.jp@gmail.com', username: 'takumi.ito', name: 'Takumi Itō', bio: 'バリスタ & カメラマン ☕📷 | 大阪 | Film only', location: 'Osaka, Japan', website: null },
//     { email: 'beatriz.santos.pt@gmail.com', username: 'beabeatriz.pt', name: 'Beatriz Santos', bio: 'Enfermeira 💙 | Porto | Praia & vinho verde 🍃', location: 'Porto, Portugal', website: null },
//     { email: 'keanu.makoa@gmail.com', username: 'keanumakoa', name: 'Keanu Makoa', bio: 'Canoe paddler & chef 🌺 | Honolulu | Aloha vibes', location: 'Honolulu, HI', website: null },
// ];

// async function main() {
//     console.log('🌱 Seeding users...');

//     const hashedPassword = await bcrypt.hash('12345678', 10);

//     let created = 0;
//     let skipped = 0;

//     for (const u of users) {
//         try {
//             await prisma.user.upsert({
//                 where: { email: u.email },
//                 update: {},
//                 create: {
//                     email: u.email,
//                     username: u.username,
//                     password: hashedPassword,
//                     name: u.name,
//                     bio: u.bio,
//                     location: u.location,
//                     website: u.website ?? undefined,
//                     role: UserRole.USER,
//                     status: UserStatus.ACTIVE,
//                     verifiedAt: new Date(),
//                 },
//             });
//             created++;
//             process.stdout.write(`\r  ✅ ${created + skipped} / ${users.length}`);
//         } catch (e: any) {
//             // Unique constraint → already exists
//             if (e.code === 'P2002') {
//                 skipped++;
//             } else {
//                 console.error(`\n  ❌ Failed for ${u.email}:`, e.message);
//             }
//         }
//     }

//     console.log(`\n\n🎉 Done! Created: ${created} | Skipped (already exist): ${skipped}`);
// }

// main()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(() => prisma.$disconnect());