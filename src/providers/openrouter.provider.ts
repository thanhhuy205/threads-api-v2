import configService from '@/config/config';
import { OpenRouter } from '@openrouter/sdk';
export const openrouter = new OpenRouter({
    apiKey: configService.OPENROUTER_CONFIG.OPEN_ROUTER_API_KEY,
});
