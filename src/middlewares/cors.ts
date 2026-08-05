import configService from "@/config/config";

export const corsOrigin =
    configService.APP_CONFIG.CORS_ORIGIN === '*'
        ? '*'
        : configService.APP_CONFIG.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
