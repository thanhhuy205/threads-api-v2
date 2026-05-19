import configService from '@/config/config';
import { OpenRouter } from '@openrouter/sdk';
export const openrouter = new OpenRouter({
    apiKey: configService.OPEN_ROUTER_API_KEY,
});