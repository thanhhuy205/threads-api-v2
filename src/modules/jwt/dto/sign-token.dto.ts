import type { SignOptions } from 'jsonwebtoken';

export interface SignTokenDto {
    payload: object;
    options?: SignOptions;
    privateKey?: string;
}