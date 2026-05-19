import type { JudgeCompleteBodyDto } from '../dto/request/judge-complete.dto';

class InternalService {
    async handleJudgeComplete(payload: JudgeCompleteBodyDto) {
        return {
            processed: true,
            postId: payload.postId,
            score: payload.score,
            category: payload.category,
            hpDelta: payload.hpDelta,
            expDelta: payload.expDelta,
            flags: payload.flags,
            syncedAt: new Date().toISOString(),
        };
    }
}

export const internalService = new InternalService();
