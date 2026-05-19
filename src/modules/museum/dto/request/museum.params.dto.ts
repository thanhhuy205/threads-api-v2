import { z } from 'zod';

export const museumPublicIdParamsSchema = z.object({
    publicId: z.string().min(1, 'Circle public ID is required'),
});

export type MuseumPublicIdParamsDto = z.infer<typeof museumPublicIdParamsSchema>;
