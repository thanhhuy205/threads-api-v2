import prisma from "@/config/prisma";
import { PostScoreLabel, PostType, Prisma } from '@prisma/client';

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
    qualityLog: {
        score: number;
        label: PostScoreLabel;
        hpDelta: number;
        expDelta: number;
        reason: string | null;
        confidence: Prisma.Decimal | null;
        isToxic: boolean;
        isSpam: boolean;
        createdAt: Date;
    };
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
                PostType: PostType.CIRCLE,
            },
            select: {
                id: true,
                publicId: true,
                createdAt: true,
            },
        });

        // Create quality log entry with pending status (score: 0) 
        // Pending
        const qualityLog = await tx.circlePostQualityLog.create({
            data: {
                circleId: data.circleId,
                postId: post.id,
                score: 0,
                hpDelta: 0,
            },
        });

        return {
            postId: post.id,
            publicId: post.publicId,
            circleId: data.circleId,
            userId: data.userId,
            content: data.content,
            qualityLog: {
                score: qualityLog.score,
                label: PostScoreLabel.PENDING,
                hpDelta: qualityLog.hpDelta,
                expDelta: 0,
                reason: null,
                confidence: null,
                isToxic: false,
                isSpam: false,
                createdAt: qualityLog.createdAt,
            },
            createdAt: post.createdAt.toISOString(),
        };
    }
}

export const circleRuntimePostRepository = new CircleRuntimePostRepository();
