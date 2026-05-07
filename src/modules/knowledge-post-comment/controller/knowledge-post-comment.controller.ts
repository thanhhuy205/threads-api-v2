import { AUTH_MESSAGE } from '@/constants/message';
import type { Request, Response } from 'express';
import type {
    CreateKnowledgePostCommentRequestDto,
    GetKnowledgePostCommentQueryDto,
    KnowledgePostCommentIdParamsDto,
    KnowledgePostIdParamsDto,
} from '../dto/request/knowledge-post-comment.request';
import { knowledgePostCommentService } from '../service/knowledge-post-comment.service';

class KnowledgePostCommentController {
    async createReply(req: Request<KnowledgePostIdParamsDto, {}, CreateKnowledgePostCommentRequestDto>, res: Response) {
        const userId = req.user?.sub;
        if (!userId) {
            return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
        }

        const reply = await knowledgePostCommentService.createReply({
            content: req.body.content,
            knowledgePostId: req.params.knowledgePostId,
            userId,
        });

        return res.success(201, 'Reply created', reply);
    }

    async getReplyById(req: Request<KnowledgePostCommentIdParamsDto>, res: Response) {
        const reply = await knowledgePostCommentService.getReplyById(req.params.knowledgePostId, req.params.commentId);
        if (!reply) {
            return res.error(404, 'Reply not found');
        }

        return res.success(200, 'Reply retrieved', reply);
    }

    async getReplies(req: Request<KnowledgePostIdParamsDto, {}, {}, GetKnowledgePostCommentQueryDto>, res: Response) {
        const query = req.query_parsed as GetKnowledgePostCommentQueryDto;
        const replies = await knowledgePostCommentService.getReplies({
            knowledgePostId: req.params.knowledgePostId,
            after: query.after,
            take: query.take,
        });

        return res.success(200, 'Replies retrieved', replies);
    }
}

export const knowledgePostCommentController = new KnowledgePostCommentController();
