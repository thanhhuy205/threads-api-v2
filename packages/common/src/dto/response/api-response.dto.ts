import { CursorPaginationMetaDto, OffsetPaginationMetaDto } from "@/dto/response/pagination.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ApiResponse<T> {
    @ApiProperty()
    statusCode: number;
    @ApiProperty()
    data: T;

    pagination?: CursorPaginationMetaDto | OffsetPaginationMetaDto | null

    constructor(data: T, pagination: CursorPaginationMetaDto | OffsetPaginationMetaDto | null, statusCode: number) {
        this.data = data;
        this.statusCode = statusCode;
        this.pagination = pagination;
    }

    static ok<T>(data: T, statusCode: number = 200) {
        return new ApiResponse(data, null, statusCode);
    }

    static paginated<T>(data: T, pagination: CursorPaginationMetaDto | OffsetPaginationMetaDto, statusCode: number = 200) {
        return new ApiResponse(data, pagination, statusCode);
    }
}