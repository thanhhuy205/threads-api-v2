import configService from "@/config/config";

export const corsOrigin =
    configService.CORS_ORIGIN === '*'
        ? '*'
        : configService.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);