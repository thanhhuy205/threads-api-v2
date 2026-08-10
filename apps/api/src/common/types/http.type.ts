import type { JwtPayload } from 'jsonwebtoken';

export type HttpHeaders = Record<string, string | string[] | undefined>;

export type HttpQuery = Record<string, string | number | undefined>;

export interface HttpRequest {
  headers: HttpHeaders;
  query: HttpQuery;
  ip?: string;
  user?: JwtPayload;
  accessToken?: string;
  refreshToken?: string;
}

export interface HttpResponse {
  status(statusCode: number): HttpResponse;
  json(body: unknown): unknown;
}

export interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  resizedBuffer?: Buffer;
  width?: number;
  height?: number;
}
