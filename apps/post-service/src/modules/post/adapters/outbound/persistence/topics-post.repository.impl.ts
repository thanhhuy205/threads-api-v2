// import { PrismaService } from '../../../../../prisma/prisma.service';
// import { Injectable } from '@nestjs/common';
// import { Prisma } from '../../../../../generated/prisma/client';
// import type { CreateTopicsPostInput, TopicsPostRepository } from '../../../application/ports/outbound/persistence/topic.repository.port';

// @Injectable()
// export class TopicsPostRepositoryImpl implements TopicsPostRepository {
//   constructor(private readonly prisma: PrismaService) { }


//   async upsert(payload: CreateTopicsPostInput, tx: Prisma.TransactionClient = this.prisma): Promise<void> {
//     await tx.topic.upsert({
//       where: {
//         name: payload.topicName,
//       },
//       create: {
//         name: payload.topicName,
//       },
//       update: {
//         count: {
//           increment: 1,
//         },
//       },
//       select: {
//         id: true,
//       },
//     });
//   }

//   async findByPostId(postId: number): Promise<{ topicName: string | null }[]> {
//     const result = await this.prisma.topicsPost.findMany({
//       where: {
//         postId,
//       },
//       select: {
//         topic: {
//           select: {
//             name: true,
//           },
//         },
//       },
//     });
//     return result.map((item) => ({ topicName: item.topic?.name || null }));

//   }

//   async create(
//     payload: CreateTopicsPostInput,
//     tx: Prisma.TransactionClient = this.prisma,
//   ) {
//     return tx.topicsPost.create({
//       data: {
//         post: {
//           connect: {
//             id: payload.postId,
//           },
//         },

//         topic: {
//           connectOrCreate: {
//             where: {
//               name: payload.topicName,
//             },
//             create: {
//               name: payload.topicName,
//             },
//           },
//         },
//       },
//     });
//   }

//   async findExistingTopicsAndIncreaseCount(
//     topicNames: string[],
//     tx: Prisma.TransactionClient = this.prisma,
//   ): Promise<void> {
//     await tx.topic.updateMany({
//       where: {
//         name: {
//           in: topicNames,
//         },
//       },
//       data: {
//         count: {
//           increment: 1,
//         },
//       },
//     });
//   }

//   async createManyAndConnectOrIncreaseCount(
//     payloads: CreateTopicsPostInput[],
//     tx: Prisma.TransactionClient = this.prisma,
//   ): Promise<void> {

//     await Promise.all([
//       await tx.topic.updateMany({
//         where: {
//           name: {
//             in: payloads.map((payload) => payload.topicName),
//           },
//         },
//         data: {
//           count: {
//             increment: 1,
//           },
//         },
//       }),

//       await tx.topic.createMany({
//         data: payloads.map((payload) => ({
//           name: payload.topicName,
//         })),
//         skipDuplicates: true,
//       })
//     ])

//     const topics = await tx.topic.findMany({
//       where: {
//         name: {
//           in: payloads.map((payload) => payload.topicName),
//         },
//       },
//       select: {
//         id: true,
//         name: true,
//       },
//     });

//     const topicMap = new Map(
//       topics.map((topic) => [topic.name, topic.id]),
//     );

//     await tx.topicsPost.createMany({
//       data: payloads.map((payload) => ({
//         postId: payload.postId,
//         topicId: topicMap.get(payload.topicName)!,
//       })),
//       skipDuplicates: true,
//     });
//   }
// }
