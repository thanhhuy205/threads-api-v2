import { Request, Response } from 'express';
import type { CreateKnowledgePostRequestDto, KnowledgePostIdParamsDto } from '../dto/request/knowledge-post.request';
import { knowledgePostService } from '../service/knowledge-post.service';

class KnowledgePostController {
    async create(req: Request<{}, {}, CreateKnowledgePostRequestDto>, res: Response) {
        const knowledgePost = await knowledgePostService.create(req.body);
        return res.success(201, 'Knowledge post created', knowledgePost);
    }

    async delete(req: Request<KnowledgePostIdParamsDto>, res: Response) {
        await knowledgePostService.delete(req.params.id);
        return res.success(200, 'Knowledge post deleted');
    }
}

export const knowledgePostController = new KnowledgePostController();
