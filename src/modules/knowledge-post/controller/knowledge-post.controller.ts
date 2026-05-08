import { getPagination } from '@/shared/pagination/cursor-pagination';
import { Request, Response } from 'express';
import type { CreateKnowledgePostRequestDto, GetKnowledgePostQueryDto, KnowledgePostIdParamsDto } from '../dto/request/knowledge-post.request';
import { knowledgePostService } from '../service/knowledge-post.service';

class KnowledgePostController {
    async getAll(req: Request<{}, {}, {}, GetKnowledgePostQueryDto>, res: Response) {
        const { after, take } = getPagination(req);
        const result = await knowledgePostService.findAll({ after: after ?? undefined, take });
        return res.paginate({
            rows: result.rows,
            pagination: result.pagination
        });
    }

    async create(req: Request<{}, {}, CreateKnowledgePostRequestDto>, res: Response) {
        const knowledgePost = await knowledgePostService.create(req.body);
        return res.success(201, 'Knowledge post created', knowledgePost);
    }

    async delete(req: Request<KnowledgePostIdParamsDto>, res: Response) {
        await knowledgePostService.delete(req.params.id);
        return res.success(200, 'Knowledge post deleted');
    }

    async getById(req: Request<KnowledgePostIdParamsDto>, res: Response) {
        const knowledgePost = await knowledgePostService.findById(req.params.id);
        if (!knowledgePost) {
            return res.error(404, 'Knowledge post not found');
        }
        return res.success(200, 'Knowledge post fetched', knowledgePost);
    }
}

export const knowledgePostController = new KnowledgePostController();
