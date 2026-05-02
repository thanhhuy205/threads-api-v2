import { z } from 'zod';

export const uploadMediaSchema = z.object({}).passthrough();

export type UploadMediaDto = z.infer<typeof uploadMediaSchema>;