import { SetMetadata } from '@nestjs/common';

export const PAGINATION_METADATA_KEY = 'pagination';

export const Pagination = () => SetMetadata(PAGINATION_METADATA_KEY, true);
