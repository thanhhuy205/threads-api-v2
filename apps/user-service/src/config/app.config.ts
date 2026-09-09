import { MicroserviceName } from "@libs/core/src/microservice/microservice.enum";
import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, validateSync } from "class-validator";

export class AppConfig {
    @IsString()
    MICROSERVICE_NAME: MicroserviceName;

    @IsString()
    @IsNotEmpty()
    USER_SERVICE_HOST: string;

    @IsNumber()
    @IsNotEmpty()
    USER_SERVICE_PORT: number;


    constructor() {
        this.MICROSERVICE_NAME = MicroserviceName.UserService;
        this.USER_SERVICE_HOST = process.env['USER_SERVICE_HOST'] ?? '0.0.0.0';
        this.USER_SERVICE_PORT = Number(process.env['USER_SERVICE_PORT'] ?? 3301);
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