import { PostScoreLabel, Prisma } from '@prisma/client';

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
    contentJson: Prisma.JsonValue | null;
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

}

export const circleRuntimePostRepository = new CircleRuntimePostRepository();
