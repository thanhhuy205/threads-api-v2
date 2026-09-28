import { MicroserviceName } from '@purse/core/microservice';
import { plainToInstance, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, validateSync } from "class-validator";

export class AppConfig {
    @IsString()
    MICROSERVICE_NAME: MicroserviceName;

    @IsString()
    @IsNotEmpty()
    ACCOUNT_SERVICE_HOST: string;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    ACCOUNT_SERVICE_PORT: number;


    constructor() {
        this.MICROSERVICE_NAME = MicroserviceName.AccountService;
        this.ACCOUNT_SERVICE_HOST = process.env['ACCOUNT_SERVICE_HOST'] ?? process.env['AUTH_SERVICE_HOST'] ?? '0.0.0.0';
        this.ACCOUNT_SERVICE_PORT = Number(process.env['ACCOUNT_SERVICE_PORT'] ?? process.env['AUTH_SERVICE_PORT'] ?? 3300);
    }
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(AppConfig, config, {
        enableImplicitConversion: true, // auto convert
    })

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    })

    if (errors.length > 0) {
        throw new Error(errors.toString())
    }
    return validatedConfig
}

export const APP_CONFIG = new AppConfig();
