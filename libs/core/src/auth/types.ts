// import { Subjects } from '@casl/prisma';
// import type {
//     AnnouncementReceipt,
//     GroupTeam,
//     HistoryPosition,
//     Poll,
//     Post,
//     PostMedia,
//     Topic,
//     User,
//     Vote,
// } from '@prisma/client';

// export const Action = {
//     Manage: 'manage',
//     Create: 'create', Read: 'read', Update: 'update', Delete: 'delete',
//     // hành động nghiệp vụ — đây là phần quan trọng, đừng chỉ có CRUD
//     Publish: 'publish',        // đăng thông báo chính thức
//     Pin: 'pin',
//     Reply: 'reply',
//     Acknowledge: 'acknowledge', // "Cần bạn xác nhận"
//     Vote: 'vote',
//     Decide: 'decide',           // chốt quyết định (badge ✓ Quyết định)
//     Verify: 'verify',           // xác nhận HistoryPosition của người khác
//     Moderate: 'moderate',
// } as const
// export type Action = (typeof Action)[keyof typeof Action]

// export type AppSubjects =
//     | Subjects<{
//         Post: Post
//         User: User
//         Poll: Poll
//         Vote: Vote
//         GroupTeam: GroupTeam
//         Topic: Topic
//         HistoryPosition: HistoryPosition
//         AnnouncementReceipt: AnnouncementReceipt
//         PostMedia: PostMedia
//     }>
//     | 'all'

// export type AppAbility = Ability<[Action, AppSubjects], PrismaQuery>
