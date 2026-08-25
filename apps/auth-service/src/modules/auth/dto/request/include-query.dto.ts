import { Transform } from "class-transformer";
import { IsArray, IsEnum, IsOptional } from "class-validator";


export enum UserInclude {
    PERMISSIONS_POSITION = 'permissions_position',
    PERMISSION_ROLE = 'permission_role',
}


export class UserQueryDto {
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.split(',').map((item) => item.trim())
            : value,
    )
    @IsArray()
    @IsEnum(UserInclude, { each: true })
    include?: UserInclude[];
}