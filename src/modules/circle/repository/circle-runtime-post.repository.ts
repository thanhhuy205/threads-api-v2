import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

interface CreateCirclePostInput {
    circleId: number;
    userId: string;
    content: string;
    parentId?: number | null;
    userSnapshot?: Prisma.InputJsonValue;
}

interface CirclePostRecord {
    postId: number;
    publicId: string;
    circleId: number;
    userId: string;
    content: string;
    judgeStatus: string;
    qualityScore: number | null;
    createdAt: string;
}

class CircleRuntimePostRepository {
    async create(
        data: CreateCirclePostInput,
        tx: Prisma.TransactionClient = prisma,
    ): Promise<CirclePostRecord> {
        // Create post
        const post = await tx.post.create({
            data: {
                content: data.content,
                userId: data.userId,
                parentId: data.parentId ?? null,
                userSnapshot: data.userSnapshot ?? undefined,
            },
            select: {
                id: true,
                publicId: true,
                createdAt: true,
            },
        });

        // Create quality log entry with pending status (score: 0)
        const qualityLog = await tx.circlePostQualityLog.create({
            data: {
                circleId: data.circleId,
                postId: post.id,
                score: 0, // Pending evaluation
                hpDelta: 0,
            },
        });

        return {
            postId: post.id,
            publicId: post.publicId,
            circleId: data.circleId,
            userId: data.userId,
            content: data.content,
            judgeStatus: "pending",
            qualityScore: null,
            createdAt: post.createdAt.toISOString(),
        };
    }
}

export const circleRuntimePostRepository = new CircleRuntimePostRepository();
