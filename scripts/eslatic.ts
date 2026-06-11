// scripts/seed-elasticsearch.ts
// Chạy: npm run elastic:seed

import dotenv from "dotenv";
dotenv.config();

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PostType, PrismaClient, VisibilityPost } from "@prisma/client";
import { elasticSearchClient } from '../src/providers/elastic-search.provider';

// ─── Prisma ───────────────────────────────────────────────────────────────────
const adapter = new PrismaMariaDb({
    port: Number(process.env.DB_PORT) || 3306,
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "threads_api",
});
const prisma = new PrismaClient({ adapter } as any);

const INDEX = "search"; // 1 index, phân biệt bằng field type

// ─── Tạo index ────────────────────────────────────────────────────────────────
async function createIndex() {
    console.log("\n🗂️  Kiểm tra index...");
    await elasticSearchClient.indices.delete({
        index: INDEX,
        ignore_unavailable: true,
    });
    const { body: exists } = await elasticSearchClient.indices.exists({ index: INDEX });
    if (exists) {
        console.log(`   ⏭️  Index "${INDEX}" đã tồn tại`);
        return;
    }

    await elasticSearchClient.indices.create({
        index: INDEX,
        body: {
            settings: {
                analysis: {
                    normalizer: {
                        lowercase_normalizer: {
                            type: "custom",
                            filter: ["lowercase"],
                        },
                    },
                    tokenizer: {
                        username_edge_tokenizer: {
                            type: "edge_ngram",
                            min_gram: 1,
                            max_gram: 30,
                            token_chars: ["letter", "digit"],
                        },
                        topic_edge_tokenizer: {
                            type: "edge_ngram",
                            min_gram: 1,
                            max_gram: 50,
                            token_chars: ["letter", "digit"],
                        },
                    },
                    analyzer: {
                        username_prefix_analyzer: {
                            type: "custom",
                            tokenizer: "username_edge_tokenizer",
                            filter: ["lowercase"],
                        },
                        username_search_analyzer: {
                            type: "custom",
                            tokenizer: "keyword",
                            filter: ["lowercase"],
                        },
                        topic_prefix_analyzer: {
                            type: "custom",
                            tokenizer: "topic_edge_tokenizer",
                            filter: ["lowercase"],
                        },
                    },
                },
            },

            mappings: {
                properties: {
                    type: { type: "keyword" }, // "user" | "post" | "topic"
                    createdAt: { type: "date" },

                    // ── user ──
                    username: {
                        type: "text",
                        analyzer: "username_search_analyzer",
                        fields: {
                            keyword: {
                                type: "keyword",
                                normalizer: "lowercase_normalizer",
                            },
                            prefix: {
                                type: "text",
                                analyzer: "username_prefix_analyzer",
                                search_analyzer: "username_search_analyzer",
                            },
                        },
                    },

                    name: {
                        type: "text",
                        fields: {
                            keyword: {
                                type: "keyword",
                                normalizer: "lowercase_normalizer",
                            },
                        },
                    },

                    bio: { type: "text" },
                    avatar: { type: "keyword" },
                    isVerified: { type: "boolean" },

                    followersCount: { type: "integer" },
                    followingCount: { type: "integer" },
                    postsCount: { type: "integer" },

                    // ── post ──
                    publicId: { type: "keyword" },
                    userId: { type: "keyword" },
                    content: { type: "text" },

                    authorUsername: {
                        type: "text",
                        analyzer: "username_search_analyzer",
                        fields: {
                            keyword: {
                                type: "keyword",
                                normalizer: "lowercase_normalizer",
                            },
                            prefix: {
                                type: "text",
                                analyzer: "username_prefix_analyzer",
                                search_analyzer: "username_search_analyzer",
                            },
                        },
                    },

                    authorName: { type: "text" },
                    authorAvatar: { type: "keyword" },

                    // ── topic ──
                    topicName: {
                        type: "text",
                        fields: {
                            keyword: {
                                type: "keyword",
                                normalizer: "lowercase_normalizer",
                            },
                            prefix: {
                                type: "text",
                                analyzer: "topic_prefix_analyzer",
                                search_analyzer: "standard",
                            },
                        },
                    },

                    postCount: { type: "integer" },
                },
            },
        },
    });

    console.log(`   ✅ Đã tạo index "${INDEX}"`);
}

// ─── Seed users ───────────────────────────────────────────────────────────────
async function seedUsers() {
    console.log("\n👤 Fetching all users...");

    const users = await prisma.user.findMany({
        where: { deletedAt: null },
        select: {
            id: true,
            username: true,
            name: true,
            bio: true,
            avatar: true,
            verifiedAt: true,
            createdAt: true,
        },
        orderBy: { createdAt: "asc" },
    });

    console.log(`   → ${users.length} users, bắt đầu sync...`);

    let success = 0, failed = 0;

    for (const user of users) {
        try {
            await elasticSearchClient.index({
                index: INDEX,
                id: `user_${user.id}`,
                body: {
                    type: "user",
                    username: user.username,
                    name: user.name,
                    bio: user.bio ?? "",
                    avatar: user.avatar ?? null,
                    isVerified: user.verifiedAt !== null,
                    createdAt: user.createdAt,
                },
            });
            success++;
        } catch (err: any) {
            console.error(`   ❌ user ${user.username}:`, err?.meta?.body?.error ?? err.message);
            failed++;
        }

        if (success % 20 === 0 && success > 0) {
            console.log(`   → ${success}/${users.length}`);
        }
    }

    console.log(`   ✅ Users: ${success} OK | ${failed} lỗi`);
    return success;
}

// ─── Seed posts ───────────────────────────────────────────────────────────────
async function seedPosts() {
    console.log("\n📝 Fetching 200 posts...");

    const posts = await prisma.post.findMany({
        where: {
            type: PostType.POST,
            visibility: VisibilityPost.PUBLIC,
            deletedAt: null,
        },
        select: {
            id: true,
            publicId: true,
            userId: true,
            content: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });

    console.log(`   → ${posts.length} posts, bắt đầu sync...`);

    let success = 0, failed = 0;

    for (const post of posts) {
        try {
            await elasticSearchClient.index({
                index: INDEX,
                id: `post_${post.id}`,
                body: {
                    type: "post",
                    publicId: post.publicId,
                    userId: post.userId,
                    content: post.content ?? "",
                    createdAt: post.createdAt,
                },
            });
            success++;
        } catch (err: any) {
            console.error(`   ❌ post ${post.id}:`, err?.meta?.body?.error ?? err.message);
            failed++;
        }

        if (success % 50 === 0 && success > 0) {
            console.log(`   → ${success}/${posts.length}`);
        }
    }

    console.log(`   ✅ Posts: ${success} OK | ${failed} lỗi`);
    return success;
}

// ─── Seed topics ──────────────────────────────────────────────────────────────
async function seedTopics() {
    console.log("\n🏷️  Fetching all topics...");

    const topics = await prisma.topic.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true,
        },
        orderBy: { createdAt: "asc" },
    });

    console.log(`   → ${topics.length} topics, bắt đầu sync...`);

    let success = 0, failed = 0;

    for (const topic of topics) {
        try {
            await elasticSearchClient.index({
                index: INDEX,
                id: `topic_${topic.id}`,
                body: {
                    type: "topic",
                    topicName: topic.name,
                    createdAt: topic.createdAt,
                },
            });
            success++;
        } catch (err: any) {
            console.error(`   ❌ topic ${topic.name}:`, err?.meta?.body?.error ?? err.message);
            failed++;
        }
    }

    console.log(`   ✅ Topics: ${success} OK | ${failed} lỗi`);
    return success;
}

// ─── Verify ───────────────────────────────────────────────────────────────────
async function verify() {
    console.log("\n🔍 Kiểm tra...");

    const { body } = await elasticSearchClient.search({
        index: INDEX,
        body: {
            size: 0,
            aggs: {
                by_type: { terms: { field: "type" } },
            },
        },
    });

    const icons: Record<string, string> = { user: "👤", post: "📝", topic: "🏷️" };
    const aggregation = body.aggregations?.by_type as
        | { buckets?: Array<{ key: string; doc_count: number }> }
        | undefined;
    const buckets = aggregation?.buckets ?? [];

    buckets.forEach(b => {
        console.log(`   ${icons[b.key] ?? "•"} ${b.key}: ${b.doc_count} documents`);
    });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log("🚀 ===== SYNC ELASTICSEARCH =====");

    await createIndex();

    const [users, posts, topics] = await Promise.all([
        seedUsers(),
        seedPosts(),
        seedTopics(),
    ]);

    await verify();

    console.log(`
🎉 ===== HOÀN THÀNH =====
   👤 Users  : ${users}
   📝 Posts  : ${posts}
   🏷️  Topics : ${topics}
=========================`);
}

main()
    .catch((e) => {
        console.error("❌ Thất bại:", e?.meta?.body ?? e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
