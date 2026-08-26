import { IsNotEmpty, IsString } from "class-validator"

export class TcpConfiguration {
    @IsNotEmpty()
    @IsString()
    USER_SERVICE_HOST!: string

    @IsNotEmpty()
    @IsString()
    USER_SERVICE_PORT!: string

    constructor(partial: Partial<TcpConfiguration>) {
        this.USER_SERVICE_HOST = partial.USER_SERVICE_HOST ?? ''
        this.USER_SERVICE_PORT = partial.USER_SERVICE_PORT ?? ''
    }

}