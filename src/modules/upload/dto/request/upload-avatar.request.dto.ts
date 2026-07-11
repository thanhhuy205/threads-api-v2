import { z } from 'zod';

export const uploadAvatarSchema = z.object({}).passthrough();

export type UploadAvatarDto = z.infer<typeof uploadAvatarSchema>;