import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export class OffsetPaginationMetaDto {
  @ApiProperty({ example: 1 }) currentPage!: number;
  @ApiProperty({ example: 10 }) perPage!: number;
  @ApiProperty({ example: 42 }) total!: number;
  @ApiProperty({ example: 5 }) lastPage!: number;
  @ApiProperty({ example: 1 }) from!: number;
  @ApiProperty({ example: 10 }) to!: number;
}

export class CursorPaginationMetaDto {
  @ApiProperty({ example: 10 }) take!: number;
  @ApiProperty({ nullable: true, example: 'post_01J...' }) after!: string | null;
  @ApiProperty({ example: true }) hasMore!: boolean;
}

type SwaggerResponseOptions = {
  description: string;
  status?: number;
  type?: Type<unknown>;
};

function dataSchema(type?: Type<unknown>, isArray = false) {
  if (!type) return isArray ? { type: 'array', items: { type: 'object' } } : { type: 'object' };
  const item = { $ref: getSchemaPath(type) };
  return isArray ? { type: 'array', items: item } : item;
}

function extraModels(type: Type<unknown> | undefined, paginationType: Type<unknown>) {
  return type ? ApiExtraModels(type, paginationType) : ApiExtraModels(paginationType);
}

/** Documents the response envelope produced by TransformInterceptor. */
export function ApiSuccessResponse({
  description,
  status = HttpStatus.OK,
  type,
}: SwaggerResponseOptions) {
  return applyDecorators(
    ...(type ? [ApiExtraModels(type)] : []),
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: description },
          data: dataSchema(type),
        },
        required: ['success', 'data'],
      },
    }),
  );
}

export function ApiOffsetPaginatedResponse({
  description,
  status = HttpStatus.OK,
  type,
}: SwaggerResponseOptions) {
  return applyDecorators(
    extraModels(type, OffsetPaginationMetaDto),
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: description },
          data: dataSchema(type, true),
          pagination: { $ref: getSchemaPath(OffsetPaginationMetaDto) },
        },
        required: ['success', 'data', 'pagination'],
      },
    }),
  );
}

export function ApiCursorPaginatedResponse({
  description,
  status = HttpStatus.OK,
  type,
}: SwaggerResponseOptions) {
  return applyDecorators(
    extraModels(type, CursorPaginationMetaDto),
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: description },
          data: dataSchema(type, true),
          pagination: { $ref: getSchemaPath(CursorPaginationMetaDto) },
        },
        required: ['success', 'data', 'pagination'],
      },
    }),
  );
}
