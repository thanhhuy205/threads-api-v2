import type { Request } from 'express';

export type UploadMediaRequestDto = Request & {
    files: Express.Multer.File[];
};
