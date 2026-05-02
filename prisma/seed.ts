// // prisma/seed.ts
// import { PrismaMariaDb } from '@prisma/adapter-mariadb';
// import { FollowStatus, JobStatus, PostType, PrismaClient, UserRole, UserStatus, VerificationCodeType } from '@prisma/client';
// import bcrypt from 'bcrypt';
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

// const now = new Date();

// const daysAgo = (days: number) => {
//     const d = new Date();
//     d.setDate(d.getDate() - days);
//     return d;
// };

// const hoursAgo = (hours: number) => {
//     const d = new Date();
//     d.setHours(d.getHours() - hours);
//     return d;
// };

// const daysFromNow = (days: number) => {
//     const d = new Date();
//     d.setDate(d.getDate() + days);
//     return d;
// };

// async function main() {
//     console.log('🌱 Seeding database...');

//     await prisma.failedJob.deleteMany();
//     await prisma.job.deleteMany();
//     await prisma.refreshToken.deleteMany();
//     await prisma.verificationCode.deleteMany();
//     await prisma.topicsPost.deleteMany();
//     await prisma.topic.deleteMany();
//     await prisma.like.deleteMany();
//     await prisma.postMention.deleteMany();
//     await prisma.postMedia.deleteMany();
//     await prisma.post.deleteMany();
//     await prisma.follow.deleteMany();
//     await prisma.user.deleteMany();

//     const password = await bcrypt.hash('12345678', 10);

//     const users = await prisma.user.createMany({
//         data: [
//             {
//                 id: 'user_admin',
//                 email: 'admin@threads.dev',
//                 username: 'admin',
//                 password,
//                 name: 'Admin Threads',
//                 bio: 'Quản trị hệ thống mini social app.',
//                 avatar: 'https://i.pravatar.cc/300?img=1',
//                 role: UserRole.ADMIN,
//                 verifiedAt: daysAgo(90),
//                 status: UserStatus.ACTIVE,
//                 location: 'Ho Chi Minh City',
//                 website: 'https://threads.dev',
//                 isPrivate: false,
//                 createdAt: daysAgo(120),
//             },
//             {
//                 id: 'user_linh',
//                 email: 'linh.dev@example.com',
//                 username: 'linhdev',
//                 password,
//                 name: 'Nguyễn Khánh Linh',
//                 bio: 'Backend developer. Thích Prisma, Redis, Docker và cà phê sữa đá.',
//                 avatar: 'https://i.pravatar.cc/300?img=5',
//                 verifiedAt: daysAgo(50),
//                 status: UserStatus.ACTIVE,
//                 location: 'Thủ Đức, TP.HCM',
//                 website: 'https://github.com/linhdev',
//                 isPrivate: false,
//                 createdAt: daysAgo(90),
//             },
//             {
//                 id: 'user_minh',
//                 email: 'minh.frontend@example.com',
//                 username: 'minhfrontend',
//                 password,
//                 name: 'Trần Nhật Minh',
//                 bio: 'Frontend engineer. React, Next.js, UI/UX, shadcn/ui.',
//                 avatar: 'https://i.pravatar.cc/300?img=11',
//                 verifiedAt: daysAgo(44),
//                 status: UserStatus.ACTIVE,
//                 location: 'Đà Nẵng',
//                 website: 'https://minh.design',
//                 isPrivate: false,
//                 createdAt: daysAgo(86),
//             },
//             {
//                 id: 'user_an',
//                 email: 'an.product@example.com',
//                 username: 'anpm',
//                 password,
//                 name: 'Phạm Hoài An',
//                 bio: 'Product manager. Quan tâm tới trải nghiệm người dùng và SaaS.',
//                 avatar: 'https://i.pravatar.cc/300?img=12',
//                 verifiedAt: daysAgo(35),
//                 status: UserStatus.ACTIVE,
//                 location: 'Hà Nội',
//                 isPrivate: false,
//                 createdAt: daysAgo(70),
//             },
//             {
//                 id: 'user_quan',
//                 email: 'quan.devops@example.com',
//                 username: 'quandevops',
//                 password,
//                 name: 'Lê Minh Quân',
//                 bio: 'DevOps. AWS, Docker, CI/CD, observability.',
//                 avatar: 'https://i.pravatar.cc/300?img=15',
//                 verifiedAt: daysAgo(30),
//                 status: UserStatus.ACTIVE,
//                 location: 'Bình Dương',
//                 website: 'https://quanops.dev',
//                 isPrivate: false,
//                 createdAt: daysAgo(65),
//             },
//             {
//                 id: 'user_hana',
//                 email: 'hana.qa@example.com',
//                 username: 'hanaqa',
//                 password,
//                 name: 'Hà My',
//                 bio: 'QA Engineer. Test case, automation và bug report tử tế.',
//                 avatar: 'https://i.pravatar.cc/300?img=20',
//                 verifiedAt: daysAgo(20),
//                 status: UserStatus.ACTIVE,
//                 location: 'Cần Thơ',
//                 isPrivate: false,
//                 createdAt: daysAgo(55),
//             },
//             {
//                 id: 'user_khoa',
//                 email: 'khoa.student@example.com',
//                 username: 'khoacode',
//                 password,
//                 name: 'Đặng Anh Khoa',
//                 bio: 'Sinh viên CNTT. Đang học DDD, ExpressJS, Prisma và system design.',
//                 avatar: 'https://i.pravatar.cc/300?img=24',
//                 verifiedAt: daysAgo(12),
//                 status: UserStatus.ACTIVE,
//                 location: 'IUH, TP.HCM',
//                 isPrivate: false,
//                 createdAt: daysAgo(40),
//             },
//             {
//                 id: 'user_nhi',
//                 email: 'nhi.design@example.com',
//                 username: 'nhidesign',
//                 password,
//                 name: 'Võ Bảo Nhi',
//                 bio: 'UI Designer. Yêu thích dashboard sạch, mobile-first và micro-interaction.',
//                 avatar: 'https://i.pravatar.cc/300?img=32',
//                 verifiedAt: daysAgo(10),
//                 status: UserStatus.ACTIVE,
//                 location: 'TP.HCM',
//                 website: 'https://dribbble.com/nhidesign',
//                 isPrivate: false,
//                 createdAt: daysAgo(38),
//             },
//             {
//                 id: 'user_bao',
//                 email: 'bao.security@example.com',
//                 username: 'baosec',
//                 password,
//                 name: 'Ngô Gia Bảo',
//                 bio: 'Security engineer. JWT, OAuth2, rate limit và audit log.',
//                 avatar: 'https://i.pravatar.cc/300?img=41',
//                 verifiedAt: daysAgo(8),
//                 status: UserStatus.ACTIVE,
//                 location: 'Nha Trang',
//                 isPrivate: true,
//                 createdAt: daysAgo(30),
//             },
//             {
//                 id: 'user_thao',
//                 email: 'thao.marketing@example.com',
//                 username: 'thaomarketing',
//                 password,
//                 name: 'Mai Phương Thảo',
//                 bio: 'Growth marketing. Viết content cho sản phẩm công nghệ.',
//                 avatar: 'https://i.pravatar.cc/300?img=45',
//                 verifiedAt: null,
//                 status: UserStatus.ACTIVE,
//                 location: 'Hà Nội',
//                 isPrivate: false,
//                 createdAt: daysAgo(20),
//             },
//         ],
//     });

//     console.log(`✅ Created ${users.count} users`);

//     await prisma.follow.createMany({
//         data: [
//             { userId: 'user_khoa', followingId: 'user_linh', status: FollowStatus.ACCEPTED, createdAt: daysAgo(20) },
//             { userId: 'user_khoa', followingId: 'user_minh', status: FollowStatus.ACCEPTED, createdAt: daysAgo(19) },
//             { userId: 'user_khoa', followingId: 'user_quan', status: FollowStatus.ACCEPTED, createdAt: daysAgo(18) },
//             { userId: 'user_linh', followingId: 'user_minh', status: FollowStatus.ACCEPTED, createdAt: daysAgo(17) },
//             { userId: 'user_minh', followingId: 'user_linh', status: FollowStatus.ACCEPTED, createdAt: daysAgo(17) },
//             { userId: 'user_an', followingId: 'user_linh', status: FollowStatus.ACCEPTED, createdAt: daysAgo(15) },
//             { userId: 'user_an', followingId: 'user_nhi', status: FollowStatus.ACCEPTED, createdAt: daysAgo(14) },
//             { userId: 'user_nhi', followingId: 'user_an', status: FollowStatus.ACCEPTED, createdAt: daysAgo(14) },
//             { userId: 'user_hana', followingId: 'user_khoa', status: FollowStatus.ACCEPTED, createdAt: daysAgo(12) },
//             { userId: 'user_thao', followingId: 'user_an', status: FollowStatus.ACCEPTED, createdAt: daysAgo(10) },
//             { userId: 'user_quan', followingId: 'user_bao', status: FollowStatus.PENDING, createdAt: daysAgo(8) },
//             { userId: 'user_khoa', followingId: 'user_bao', status: FollowStatus.PENDING, createdAt: daysAgo(6) },
//             { userId: 'user_bao', followingId: 'user_linh', status: FollowStatus.ACCEPTED, createdAt: daysAgo(5) },
//             { userId: 'user_admin', followingId: 'user_linh', status: FollowStatus.ACCEPTED, createdAt: daysAgo(5) },
//         ],
//     });

//     const topics = await Promise.all([
//         prisma.topic.create({ data: { name: 'Prisma', count: 0 } }),
//         prisma.topic.create({ data: { name: 'ExpressJS', count: 0 } }),
//         prisma.topic.create({ data: { name: 'DDD', count: 0 } }),
//         prisma.topic.create({ data: { name: 'Docker', count: 0 } }),
//         prisma.topic.create({ data: { name: 'Redis', count: 0 } }),
//         prisma.topic.create({ data: { name: 'UIUX', count: 0 } }),
//         prisma.topic.create({ data: { name: 'NextJS', count: 0 } }),
//         prisma.topic.create({ data: { name: 'Startup', count: 0 } }),
//         prisma.topic.create({ data: { name: 'SystemDesign', count: 0 } }),
//         prisma.topic.create({ data: { name: 'SinhVienIT', count: 0 } }),
//     ]);

//     const topicMap = Object.fromEntries(topics.map((topic) => [topic.name, topic]));

//     const post1 = await prisma.post.create({
//         data: {
//             userId: 'user_linh',
//             content:
//                 'Mình thấy khi dùng Prisma trong dự án ExpressJS, repository nên giữ nhiệm vụ query dữ liệu sạch, còn service xử lý nghiệp vụ. Đừng để repo biết quá nhiều business rule, sau này đổi rule sẽ rất mệt.',
//             type: PostType.POST,
//             replyPermission: 'everyone',
//             userSnapshot: {
//                 id: 'user_linh',
//                 username: 'linhdev',
//                 name: 'Nguyễn Khánh Linh',
//                 avatar: 'https://i.pravatar.cc/300?img=5',
//             },
//             likesCount: 6,
//             repliesCount: 3,
//             repostsCount: 1,
//             quotesCount: 1,
//             viewsCount: 420,
//             isPinned: true,
//             createdAt: daysAgo(7),
//         },
//     });

//     const post2 = await prisma.post.create({
//         data: {
//             userId: 'user_khoa',
//             content:
//                 'Học DDD lúc đầu hơi rối thật. Nhưng khi tách được domain, application service, infrastructure thì code bắt đầu dễ đọc hơn rất nhiều.',
//             type: PostType.POST,
//             replyPermission: 'everyone',
//             userSnapshot: {
//                 id: 'user_khoa',
//                 username: 'khoacode',
//                 name: 'Đặng Anh Khoa',
//                 avatar: 'https://i.pravatar.cc/300?img=24',
//             },
//             likesCount: 5,
//             repliesCount: 2,
//             repostsCount: 0,
//             quotesCount: 1,
//             viewsCount: 310,
//             createdAt: daysAgo(6),
//         },
//     });

//     const post3 = await prisma.post.create({
//         data: {
//             userId: 'user_minh',
//             content:
//                 'Một dashboard tốt không phải là nhét thật nhiều chart vào. Quan trọng là người dùng nhìn 5 giây là biết hôm nay cần làm gì.',
//             type: PostType.POST,
//             replyPermission: 'everyone',
//             userSnapshot: {
//                 id: 'user_minh',
//                 username: 'minhfrontend',
//                 name: 'Trần Nhật Minh',
//                 avatar: 'https://i.pravatar.cc/300?img=11',
//             },
//             likesCount: 7,
//             repliesCount: 3,
//             repostsCount: 2,
//             quotesCount: 0,
//             viewsCount: 680,
//             createdAt: daysAgo(5),
//         },
//     });

//     const post4 = await prisma.post.create({
//         data: {
//             userId: 'user_quan',
//             content:
//                 'Docker compose cho local dev rất tiện, nhưng production thì nên cẩn thận volume, backup, network và secrets. Đừng để dữ liệu database nằm lạc trong container rồi xoá nhầm.',
//             type: PostType.POST,
//             replyPermission: 'everyone',
//             userSnapshot: {
//                 id: 'user_quan',
//                 username: 'quandevops',
//                 name: 'Lê Minh Quân',
//                 avatar: 'https://i.pravatar.cc/300?img=15',
//             },
//             likesCount: 8,
//             repliesCount: 4,
//             repostsCount: 2,
//             quotesCount: 1,
//             viewsCount: 910,
//             createdAt: daysAgo(4),
//         },
//     });

//     const post5 = await prisma.post.create({
//         data: {
//             userId: 'user_an',
//             content:
//                 'Feature hay chưa chắc đã là feature nên làm. Với sản phẩm SaaS nhỏ, cái cần ưu tiên là luồng chính chạy mượt, dễ hiểu và ít lỗi.',
//             type: PostType.POST,
//             replyPermission: 'everyone',
//             userSnapshot: {
//                 id: 'user_an',
//                 username: 'anpm',
//                 name: 'Phạm Hoài An',
//                 avatar: 'https://i.pravatar.cc/300?img=12',
//             },
//             likesCount: 4,
//             repliesCount: 2,
//             repostsCount: 1,
//             quotesCount: 0,
//             viewsCount: 370,
//             createdAt: daysAgo(3),
//         },
//     });

//     const post6 = await prisma.post.create({
//         data: {
//             userId: 'user_nhi',
//             content:
//                 'Mobile UI nên ưu tiên thao tác bằng một tay. Nút quan trọng nên nằm vùng ngón cái dễ chạm, còn form dài thì chia thành từng bước nhỏ.',
//             type: PostType.POST,
//             replyPermission: 'everyone',
//             userSnapshot: {
//                 id: 'user_nhi',
//                 username: 'nhidesign',
//                 name: 'Võ Bảo Nhi',
//                 avatar: 'https://i.pravatar.cc/300?img=32',
//             },
//             likesCount: 9,
//             repliesCount: 3,
//             repostsCount: 1,
//             quotesCount: 2,
//             viewsCount: 760,
//             createdAt: daysAgo(2),
//         },
//     });

//     const post7 = await prisma.post.create({
//         data: {
//             userId: 'user_bao',
//             content:
//                 'JWT không sai. Sai là lưu token bừa bãi, không rotate refresh token, không revoke session, không rate limit endpoint nhạy cảm.',
//             type: PostType.POST,
//             replyPermission: 'following',
//             userSnapshot: {
//                 id: 'user_bao',
//                 username: 'baosec',
//                 name: 'Ngô Gia Bảo',
//                 avatar: 'https://i.pravatar.cc/300?img=41',
//             },
//             likesCount: 6,
//             repliesCount: 1,
//             repostsCount: 2,
//             quotesCount: 1,
//             viewsCount: 500,
//             createdAt: hoursAgo(30),
//         },
//     });

//     const post8 = await prisma.post.create({
//         data: {
//             userId: 'user_thao',
//             content:
//                 'Viết landing page cho sản phẩm công nghệ nên nói rõ: khách hàng là ai, họ đau ở đâu, sản phẩm giúp gì, và vì sao nên tin bạn.',
//             type: PostType.POST,
//             replyPermission: 'everyone',
//             userSnapshot: {
//                 id: 'user_thao',
//                 username: 'thaomarketing',
//                 name: 'Mai Phương Thảo',
//                 avatar: 'https://i.pravatar.cc/300?img=45',
//             },
//             likesCount: 3,
//             repliesCount: 1,
//             repostsCount: 0,
//             quotesCount: 0,
//             viewsCount: 210,
//             createdAt: hoursAgo(18),
//         },
//     });

//     const reply1 = await prisma.post.create({
//         data: {
//             userId: 'user_khoa',
//             content:
//                 'Em đang bị đúng đoạn này. Lúc đầu em bỏ hết logic vào repository, xong càng viết càng thấy repo phình to quá.',
//             type: PostType.REPLY,
//             parentId: post1.id,
//             rootPostId: post1.id,
//             userSnapshot: {
//                 id: 'user_khoa',
//                 username: 'khoacode',
//                 name: 'Đặng Anh Khoa',
//                 avatar: 'https://i.pravatar.cc/300?img=24',
//             },
//             likesCount: 3,
//             repliesCount: 1,
//             viewsCount: 120,
//             createdAt: daysAgo(7),
//         },
//     });

//     const reply2 = await prisma.post.create({
//         data: {
//             userId: 'user_linh',
//             content:
//                 'Đúng rồi. Repo nên là nơi nói chuyện với DB. Còn câu hỏi “user này có quyền làm việc này không” thường nên nằm ở service hoặc domain policy.',
//             type: PostType.REPLY,
//             parentId: reply1.id,
//             rootPostId: post1.id,
//             userSnapshot: {
//                 id: 'user_linh',
//                 username: 'linhdev',
//                 name: 'Nguyễn Khánh Linh',
//                 avatar: 'https://i.pravatar.cc/300?img=5',
//             },
//             likesCount: 4,
//             repliesCount: 0,
//             viewsCount: 140,
//             createdAt: daysAgo(7),
//         },
//     });

//     const reply3 = await prisma.post.create({
//         data: {
//             userId: 'user_an',
//             content:
//                 'Tách rõ vậy sau này đổi rule quyền truy cập cũng đỡ ảnh hưởng query cũ.',
//             type: PostType.REPLY,
//             parentId: post1.id,
//             rootPostId: post1.id,
//             userSnapshot: {
//                 id: 'user_an',
//                 username: 'anpm',
//                 name: 'Phạm Hoài An',
//                 avatar: 'https://i.pravatar.cc/300?img=12',
//             },
//             likesCount: 2,
//             repliesCount: 0,
//             viewsCount: 90,
//             createdAt: daysAgo(6),
//         },
//     });

//     const reply4 = await prisma.post.create({
//         data: {
//             userId: 'user_hana',
//             content:
//                 'QA nhìn vào cũng thích kiểu này hơn. Test nghiệp vụ sẽ rõ case hơn, không bị trộn với query.',
//             type: PostType.REPLY,
//             parentId: post2.id,
//             rootPostId: post2.id,
//             userSnapshot: {
//                 id: 'user_hana',
//                 username: 'hanaqa',
//                 name: 'Hà My',
//                 avatar: 'https://i.pravatar.cc/300?img=20',
//             },
//             likesCount: 2,
//             repliesCount: 0,
//             viewsCount: 70,
//             createdAt: daysAgo(5),
//         },
//     });

//     const quote1 = await prisma.post.create({
//         data: {
//             userId: 'user_minh',
//             content:
//                 'Câu này đúng với cả frontend. Component chỉ nên render UI, còn rule phức tạp nên đẩy ra hook/service riêng.',
//             type: PostType.QUOTE,
//             originPostId: post1.id,
//             userSnapshot: {
//                 id: 'user_minh',
//                 username: 'minhfrontend',
//                 name: 'Trần Nhật Minh',
//                 avatar: 'https://i.pravatar.cc/300?img=11',
//             },
//             likesCount: 5,
//             repliesCount: 1,
//             quotesCount: 0,
//             repostsCount: 0,
//             viewsCount: 260,
//             createdAt: daysAgo(4),
//         },
//     });

//     const repost1 = await prisma.post.create({
//         data: {
//             userId: 'user_khoa',
//             content: '',
//             type: PostType.REPOST,
//             originPostId: post4.id,
//             userSnapshot: {
//                 id: 'user_khoa',
//                 username: 'khoacode',
//                 name: 'Đặng Anh Khoa',
//                 avatar: 'https://i.pravatar.cc/300?img=24',
//             },
//             likesCount: 0,
//             repliesCount: 0,
//             repostsCount: 0,
//             quotesCount: 0,
//             viewsCount: 80,
//             createdAt: daysAgo(3),
//         },
//     });

//     const allPosts = [
//         post1,
//         post2,
//         post3,
//         post4,
//         post5,
//         post6,
//         post7,
//         post8,
//         reply1,
//         reply2,
//         reply3,
//         reply4,
//         quote1,
//         repost1,
//     ];

//     await prisma.postMedia.createMany({
//         data: [
//             {
//                 postId: post3.id,
//                 url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
//                 type: 'image',
//                 width: 1200,
//                 height: 800,
//             },
//             {
//                 postId: post4.id,
//                 url: 'https://images.unsplash.com/photo-1605745341112-85968b19335b',
//                 type: 'image',
//                 width: 1200,
//                 height: 800,
//             },
//             {
//                 postId: post6.id,
//                 url: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f',
//                 type: 'image',
//                 width: 1200,
//                 height: 800,
//             },
//         ],
//     });

//     await prisma.postMention.createMany({
//         data: [
//             {
//                 postId: post1.id,
//                 userId: 1,
//             },
//             {
//                 postId: post2.id,
//                 userId: 2,
//             },
//             {
//                 postId: post6.id,
//                 userId: 3,
//             },
//         ],
//     });

//     await prisma.topicsPost.createMany({
//         data: [
//             { postId: post1.id, topicId: topicMap.Prisma.id, isPublic: true },
//             { postId: post1.id, topicId: topicMap.ExpressJS.id, isPublic: true },
//             { postId: post1.id, topicId: topicMap.DDD.id, isPublic: true },

//             { postId: post2.id, topicId: topicMap.DDD.id, isPublic: true },
//             { postId: post2.id, topicId: topicMap.SinhVienIT.id, isPublic: true },

//             { postId: post3.id, topicId: topicMap.UIUX.id, isPublic: true },
//             { postId: post3.id, topicId: topicMap.NextJS.id, isPublic: true },

//             { postId: post4.id, topicId: topicMap.Docker.id, isPublic: true },
//             { postId: post4.id, topicId: topicMap.SystemDesign.id, isPublic: true },

//             { postId: post5.id, topicId: topicMap.Startup.id, isPublic: true },
//             { postId: post6.id, topicId: topicMap.UIUX.id, isPublic: true },
//             { postId: post7.id, topicId: topicMap.SystemDesign.id, isPublic: true },
//             { postId: post8.id, topicId: topicMap.Startup.id, isPublic: true },
//         ],
//     });

//     const likePairs = [
//         ['user_khoa', post1.id],
//         ['user_minh', post1.id],
//         ['user_an', post1.id],
//         ['user_quan', post1.id],
//         ['user_hana', post1.id],
//         ['user_nhi', post1.id],

//         ['user_linh', post2.id],
//         ['user_minh', post2.id],
//         ['user_hana', post2.id],
//         ['user_nhi', post2.id],
//         ['user_quan', post2.id],

//         ['user_linh', post3.id],
//         ['user_khoa', post3.id],
//         ['user_an', post3.id],
//         ['user_nhi', post3.id],
//         ['user_thao', post3.id],
//         ['user_hana', post3.id],
//         ['user_quan', post3.id],

//         ['user_linh', post4.id],
//         ['user_khoa', post4.id],
//         ['user_minh', post4.id],
//         ['user_an', post4.id],
//         ['user_hana', post4.id],
//         ['user_bao', post4.id],
//         ['user_thao', post4.id],
//         ['user_nhi', post4.id],

//         ['user_linh', post6.id],
//         ['user_minh', post6.id],
//         ['user_an', post6.id],
//         ['user_khoa', post6.id],
//         ['user_hana', post6.id],
//         ['user_quan', post6.id],
//         ['user_bao', post6.id],
//         ['user_thao', post6.id],
//         ['user_admin', post6.id],

//         ['user_khoa', reply2.id],
//         ['user_an', reply2.id],
//         ['user_minh', quote1.id],
//     ] as const;

//     await prisma.like.createMany({
//         data: likePairs.map(([userId, postId], index) => ({
//             userId,
//             postId,
//             createdAt: hoursAgo(80 - index),
//         })),
//         skipDuplicates: true,
//     });

//     await prisma.verificationCode.createMany({
//         data: [
//             {
//                 userId: 'user_thao',
//                 type: VerificationCodeType.VERIFY_ACCOUNT,
//                 code: '248913',
//                 expiresAt: daysFromNow(1),
//                 createdAt: hoursAgo(2),
//             },
//             {
//                 userId: 'user_khoa',
//                 type: VerificationCodeType.FORGOT_PASSWORD,
//                 code: '889201',
//                 expiresAt: daysFromNow(1),
//                 usedAt: hoursAgo(1),
//                 createdAt: hoursAgo(3),
//             },
//             {
//                 userId: 'user_bao',
//                 type: VerificationCodeType.RESET_PASSWORD,
//                 code: 'SECURE-RESET-2026',
//                 expiresAt: daysFromNow(2),
//                 createdAt: hoursAgo(4),
//             },
//         ],
//     });

//     await prisma.refreshToken.createMany({
//         data: [
//             {
//                 userId: 'user_linh',
//                 token: 'refresh_linh_desktop_token_demo',
//                 expireAt: daysFromNow(30),
//                 sessionId: 'sess_linh_chrome_windows',
//                 userAgent: 'Chrome on Windows',
//                 ip: '192.168.1.10',
//             },
//             {
//                 userId: 'user_khoa',
//                 token: 'refresh_khoa_laptop_token_demo',
//                 expireAt: daysFromNow(30),
//                 sessionId: 'sess_khoa_edge_windows',
//                 userAgent: 'Edge on Windows',
//                 ip: '192.168.1.22',
//             },
//             {
//                 userId: 'user_an',
//                 token: 'refresh_an_mobile_token_demo',
//                 expireAt: daysFromNow(20),
//                 sessionId: 'sess_an_safari_ios',
//                 userAgent: 'Safari on iPhone',
//                 ip: '10.0.0.8',
//             },
//             {
//                 userId: 'user_bao',
//                 token: 'refresh_bao_revoked_token_demo',
//                 expireAt: daysFromNow(10),
//                 sessionId: 'sess_bao_old_device',
//                 revoked: true,
//                 revokedAt: daysAgo(1),
//                 userAgent: 'Chrome on Android',
//                 ip: '172.16.0.4',
//             },
//         ],
//     });

//     await prisma.job.createMany({
//         data: [
//             {
//                 uuid: 'job_send_verify_email_thao',
//                 queue: 'email',
//                 payload: JSON.stringify({
//                     template: 'verify-account',
//                     userId: 'user_thao',
//                     code: '248913',
//                 }),
//                 recipientEmail: 'thao.marketing@example.com',
//                 hashToken: 'hash_verify_thao_001',
//                 status: JobStatus.PENDING,
//                 createdAt: hoursAgo(2),
//                 availableAt: now,
//                 expiresAt: daysFromNow(1),
//             },
//             {
//                 uuid: 'job_send_reset_password_khoa',
//                 queue: 'email',
//                 payload: JSON.stringify({
//                     template: 'reset-password',
//                     userId: 'user_khoa',
//                     code: '889201',
//                 }),
//                 recipientEmail: 'khoa.student@example.com',
//                 hashToken: 'hash_reset_khoa_001',
//                 status: JobStatus.SUCCESS,
//                 createdAt: hoursAgo(3),
//                 availableAt: hoursAgo(3),
//                 expiresAt: daysFromNow(1),
//             },
//             {
//                 uuid: 'job_generate_user_analytics',
//                 queue: 'analytics',
//                 payload: JSON.stringify({
//                     type: 'daily-user-summary',
//                     date: now.toISOString().slice(0, 10),
//                 }),
//                 status: JobStatus.PROCESSING,
//                 createdAt: hoursAgo(1),
//                 availableAt: now,
//             },
//             {
//                 uuid: 'job_cleanup_expired_tokens',
//                 queue: 'system',
//                 payload: JSON.stringify({
//                     task: 'cleanup-expired-refresh-tokens',
//                 }),
//                 status: JobStatus.PENDING,
//                 createdAt: hoursAgo(5),
//                 availableAt: daysFromNow(1),
//             },
//         ],
//     });

//     await prisma.failedJob.create({
//         data: {
//             uuid: 'failed_job_email_timeout_001',
//             connection: 'rabbitmq',
//             queue: 'email',
//             payload: JSON.stringify({
//                 template: 'welcome',
//                 recipientEmail: 'old-user@example.com',
//             }),
//             exception: 'SMTP timeout after 10000ms while sending welcome email',
//             failedAt: daysAgo(2),
//         },
//     });

//     await Promise.all(
//         topics.map(async (topic) => {
//             const count = await prisma.topicsPost.count({
//                 where: {
//                     OR: [{ topicId: topic.id }, { privateTopicId: topic.id }],
//                 },
//             });

//             return prisma.topic.update({
//                 where: { id: topic.id },
//                 data: { count },
//             });
//         }),
//     );

//     const userIds = [
//         'user_admin',
//         'user_linh',
//         'user_minh',
//         'user_an',
//         'user_quan',
//         'user_hana',
//         'user_khoa',
//         'user_nhi',
//         'user_bao',
//         'user_thao',
//     ];

//     await Promise.all(
//         userIds.map(async (userId) => {
//             const [followersCount, followingCount, postsCount] = await Promise.all([
//                 prisma.follow.count({
//                     where: {
//                         followingId: userId,
//                         status: FollowStatus.ACCEPTED,
//                     },
//                 }),
//                 prisma.follow.count({
//                     where: {
//                         userId,
//                         status: FollowStatus.ACCEPTED,
//                     },
//                 }),
//                 prisma.post.count({
//                     where: {
//                         userId,
//                         isDeleted: false,
//                     },
//                 }),
//             ]);

//             return prisma.user.update({
//                 where: { id: userId },
//                 data: {
//                     followersCount,
//                     followingCount,
//                     postsCount,
//                 },
//             });
//         }),
//     );

//     console.log(`✅ Created ${allPosts.length} posts/replies/reposts/quotes`);
//     console.log('🎉 Seed completed!');
// }

// main()
//     .catch((error) => {
//         console.error('❌ Seed failed:', error);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });