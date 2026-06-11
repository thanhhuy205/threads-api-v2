import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { NotificationType, PostType, PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();
const adapter = new PrismaMariaDb({
    port: Number(process.env.DB_PORT) || 3306,
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    allowPublicKeyRetrieval: true,
});
const prisma = new PrismaClient({ adapter } as any);


const ago = (min: number) => new Date(Date.now() - min * 60 * 1000);
const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickN = <T>(arr: T[], n: number): T[] =>
    [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));
const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const REPLY_CONTENTS = [
    "Bài này hay quá, đồng ý với bạn!",
    "Mình cũng nghĩ vậy, cảm ơn đã chia sẻ.",
    "Thú vị thật, cho mình hỏi thêm một chút nhé?",
    "Ừ đúng rồi, trải nghiệm của mình cũng tương tự.",
    "Ý kiến hay đó bạn ơi 👍",
    "Bạn có thể giải thích thêm không?",
    "Mình không đồng ý lắm, theo mình thì...",
    "Haha chuẩn luôn!",
    "Cảm ơn bạn đã chia sẻ góc nhìn này.",
    "Bài viết rất có ý nghĩa, tiếp tục nhé!",
    "Mình đã trải qua điều tương tự, cảm giác đó thật khó tả.",
    "Đây là một trong những bài mình thích nhất hôm nay.",
    "Quan điểm của bạn rất thú vị, mình sẽ suy nghĩ thêm.",
    "Ủa thật không? Mình không biết điều này.",
    "Bạn nói đúng quá đi, đồng ý 100%!",
    "Hay thế, lưu lại đọc sau.",
    "Mình cũng có suy nghĩ tương tự từ lâu rồi.",
    "Cảm ơn vì đã đặt câu hỏi này, mình cũng đang tìm hiểu.",
    "Nội dung rất chất lượng, keep it up!",
    "Bạn có nguồn tham khảo không?",
    "Mình chia sẻ cho bạn bè xem luôn nhé!",
    "Thật ra mình cũng đang băn khoăn về điều này.",
    "Bài này nên được nhiều người đọc hơn.",
    "Góc nhìn mới lạ, chưa bao giờ nghĩ theo hướng này.",
    "Chuẩn bài! 🔥",
    "Mình đồng ý một phần, nhưng...",
    "Có thêm ví dụ thực tế không bạn?",
    "Viết tiếp đi, đang hay lắm!",
    "Bạn có kinh nghiệm thực tế về vấn đề này không?",
    "Mình bookmark bài này rồi, cảm ơn!",
];

const QUOTE_CONTENTS = [
    "Đây là bài viết đáng đọc, chia sẻ thêm góc nhìn của mình:",
    "Đồng ý với quan điểm này, thêm vào đó...",
    "Mình đã nghĩ đến điều này từ lâu, và bài này nói đúng ý.",
    "Quan điểm thú vị! Nhưng mình có một góc nhìn khác:",
    "Repost vì nội dung này quá hay, ai chưa đọc thì đọc đi!",
    "Bài này nhắc mình nhớ đến một câu chuyện tương tự...",
    "Đây chính xác là những gì mình đang trải qua.",
    "Chia sẻ để mọi người cùng suy nghĩ về điều này.",
    "Không thể đồng ý hơn. Đây là lý do tại sao mình follow tác giả.",
    "Cần nhiều bài như thế này hơn trên mạng xã hội.",
    "Mình đã chia sẻ điều này với bạn bè và ai cũng gật đầu.",
    "Nhắc mình một câu nói hay: những điều nhỏ tạo nên sự khác biệt lớn.",
    "Bài này làm mình thay đổi cách nhìn về vấn đề đó.",
    "Quote lại vì quá đúng, không thể không chia sẻ!",
    "Ai cần đọc điều này thì đọc ngay đi.",
];

// Type cho user đã load đầy đủ fields
type SeedUser = {
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
    bio: string | null;
};

// Build userSnapshot đúng format như seed gốc
const buildSnapshot = (u: SeedUser) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    avatar: u.avatar,
    bio: u.bio,
});

async function main() {
    console.log("🚀 Seeding likes + replies + quotes + reposts + notifications...\n");

    // ─── Load data thực tế ────────────────────────────────────────────────────────
    const users = await prisma.user.findMany({
        where: { deletedAt: null, status: "ACTIVE" },
        select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            bio: true,
        },
    });
    if (users.length < 3) throw new Error("Cần ít nhất 3 users");

    // Map nhanh userId → user để lookup O(1)
    const userMap = new Map<string, SeedUser>(users.map((u) => [u.id, u]));

    const posts = await prisma.post.findMany({
        where: { isDeleted: false, type: PostType.POST },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            publicId: true,
            userId: true,
            likesCount: true,
        },
    });
    if (posts.length < 3) throw new Error("Cần ít nhất 3 posts");

    console.log(`📦 Loaded: ${users.length} users, ${posts.length} posts\n`);

    let totalLikes = 0;
    let totalReplies = 0;
    let totalQuotes = 0;
    let totalReposts = 0;
    let totalNotifs = 0;

    // ═══════════════════════════════════════════════════════════════════════════════
    // PHASE 1 — LIKES
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log("❤️  Phase 1: Creating likes...");

    for (const post of posts) {
        const otherUsers = users.filter((u) => u.id !== post.userId);
        const likers = pickN(otherUsers, randInt(3, Math.min(12, otherUsers.length)));

        const newLikerIds: string[] = [];

        for (const liker of likers) {
            const existing = await prisma.like.findUnique({
                where: { userId_postId: { userId: liker.id, postId: post.publicId } },
                select: { id: true, isLike: true },
            });

            if (existing) {
                if (!existing.isLike) {
                    await prisma.like.update({
                        where: { id: existing.id },
                        data: { isLike: true, updatedAt: ago(randInt(1, 600)) },
                    });
                    newLikerIds.push(liker.id);
                }
            } else {
                await prisma.like.create({
                    data: {
                        userId: liker.id,
                        postId: post.publicId,
                        isLike: true,
                        createdAt: ago(randInt(1, 600)),
                        updatedAt: ago(randInt(1, 30)),
                    },
                });
                newLikerIds.push(liker.id);
            }
        }

        if (!newLikerIds.length) continue;

        await prisma.post.update({
            where: { id: post.id },
            data: { likesCount: { increment: newLikerIds.length } },
        });
        totalLikes += newLikerIds.length;

        const lastLiker = newLikerIds[newLikerIds.length - 1];
        await prisma.notificationGroup.create({
            data: {
                recipientId: post.userId,
                type: NotificationType.LIKE,
                targetType: "POST",
                targetId: post.publicId,
                actorIds: newLikerIds,
                count: newLikerIds.length,
                isRead: Math.random() > 0.5,
                lastActorId: lastLiker,
                lastEventAt: ago(randInt(1, 60)),
                originPostId: post.publicId,
            },
        });
        totalNotifs++;

        console.log(`   ✓ Post ${post.publicId}: +${newLikerIds.length} likes`);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PHASE 2 — REPLIES
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log("\n💬 Phase 2: Creating replies...");

    for (const post of posts) {
        const otherUsers = users.filter((u) => u.id !== post.userId);
        const repliers = pickN(otherUsers, randInt(2, Math.min(8, otherUsers.length)));

        for (const replier of repliers) {
            const content = rand(REPLY_CONTENTS);
            const createdAt = ago(randInt(1, 500));
            const snap = buildSnapshot(replier);

            const reply = await prisma.post.create({
                data: {
                    userId: replier.id,
                    content,
                    type: PostType.REPLY,
                    parentId: post.id,
                    parentPublicId: post.publicId,
                    rootPostId: post.id,
                    rootPublicId: post.publicId,
                    userSnapshot: snap,
                    createdAt,
                    updatedAt: createdAt,
                },
            });

            totalReplies++;

            if (replier.id !== post.userId) {
                await prisma.notificationGroup.create({
                    data: {
                        recipientId: post.userId,
                        type: NotificationType.REPLY,
                        targetType: "POST",
                        targetId: reply.publicId,
                        actorIds: [replier.id],
                        count: 1,
                        isRead: Math.random() > 0.5,
                        lastActorId: replier.id,
                        lastEventAt: createdAt,
                        originPostId: post.publicId,
                    },
                });
                totalNotifs++;
            }
        }

        console.log(`   ✓ Post ${post.publicId}: +${repliers.length} replies`);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PHASE 3 — QUOTES
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log("\n🔁 Phase 3: Creating quotes...");

    for (const post of posts) {
        const otherUsers = users.filter((u) => u.id !== post.userId);
        const quoters = pickN(otherUsers, randInt(1, Math.min(4, otherUsers.length)));

        for (const quoter of quoters) {
            const content = rand(QUOTE_CONTENTS);
            const createdAt = ago(randInt(1, 400));
            const snap = buildSnapshot(quoter);

            const quote = await prisma.post.create({
                data: {
                    userId: quoter.id,
                    content,
                    type: PostType.QUOTE,
                    isQuote: true,
                    originPostId: post.id,
                    originPublicId: post.publicId,
                    userSnapshot: snap,
                    createdAt,
                    updatedAt: createdAt,
                },
            });

            totalQuotes++;

            if (quoter.id !== post.userId) {
                await prisma.notificationGroup.create({
                    data: {
                        recipientId: post.userId,
                        type: NotificationType.QUOTE,
                        targetType: "POST",
                        targetId: quote.publicId,
                        actorIds: [quoter.id],
                        count: 1,
                        isRead: Math.random() > 0.5,
                        lastActorId: quoter.id,
                        lastEventAt: createdAt,
                        originPostId: post.publicId,
                    },
                });
                totalNotifs++;
            }
        }

        console.log(`   ✓ Post ${post.publicId}: +${quoters.length} quotes`);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // PHASE 4 — REPOSTS (không có content, không có userSnapshot)
    // ═══════════════════════════════════════════════════════════════════════════════
    console.log("\n🔄 Phase 4: Creating reposts...");

    for (const post of posts) {
        const otherUsers = users.filter((u) => u.id !== post.userId);
        const reposters = pickN(otherUsers, randInt(1, Math.min(5, otherUsers.length)));

        for (const reposter of reposters) {
            const createdAt = ago(randInt(1, 350));

            const repost = await prisma.post.create({
                data: {
                    userId: reposter.id,
                    content: "",
                    type: PostType.REPOST,
                    isQuote: false,
                    originPostId: post.id,
                    originPublicId: post.publicId,
                    userSnapshot: buildSnapshot(reposter),
                    createdAt,
                    updatedAt: createdAt,
                },
            });

            totalReposts++;

            if (reposter.id !== post.userId) {
                await prisma.notificationGroup.create({
                    data: {
                        recipientId: post.userId,
                        type: NotificationType.SHARE,
                        targetType: "POST",
                        targetId: repost.publicId,
                        actorIds: [reposter.id],
                        count: 1,
                        isRead: Math.random() > 0.6,
                        lastActorId: reposter.id,
                        lastEventAt: createdAt,
                        originPostId: post.publicId,
                    },
                });
                totalNotifs++;
            }
        }

        console.log(`   ✓ Post ${post.publicId}: +${reposters.length} reposts`);
    }

    // ─── Summary ──────────────────────────────────────────────────────────────────
    const dbNotifs = await prisma.notificationGroup.count();
    const dbLikes = await prisma.like.count({ where: { isLike: true } });
    const dbReplies = await prisma.post.count({ where: { type: PostType.REPLY } });
    const dbQuotes = await prisma.post.count({ where: { type: PostType.QUOTE } });
    const dbReposts = await prisma.post.count({ where: { type: PostType.REPOST } });

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Done!
   Likes created  : ${totalLikes}
   Replies created: ${totalReplies}
   Quotes created : ${totalQuotes}
   Reposts created: ${totalReposts}
   Notifs created : ${totalNotifs}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DB totals:
   likes (isLike=true)      : ${dbLikes}
   posts (REPLY)            : ${dbReplies}
   posts (QUOTE)            : ${dbQuotes}
   posts (REPOST)           : ${dbReposts}
   notification_groups      : ${dbNotifs}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
    })
    .finally(() => prisma.$disconnect());
