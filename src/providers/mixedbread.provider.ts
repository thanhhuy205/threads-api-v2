import configService from '@/config/config';
import { createMixedbread } from 'mixedbread-ai-provider';


export const mixedbread = createMixedbread({
    apiKey: configService.MIXEDBREAD_API_KEY,
});

