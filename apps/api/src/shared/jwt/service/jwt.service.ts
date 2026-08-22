import configService from '@/config/config';
import { PayloadSignTokenDto, SignTokenDto, VerifyTokenDto } from '@api/shared/jwt/dto';
import { TokenPairResponse } from '@api/shared/jwt/dto/response/token-pair.response';

import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import crypto from 'crypto';
import { JwtPayload } from 'jsonwebtoken';
import ms from 'ms';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JwtService {
  private readonly jwtSecret = configService.JWT_CONFIG.JWT_SECRET;
  private readonly accessExpires = configService.JWT_CONFIG.ACCESS_EXPIRES;

  constructor(private readonly nestJwtService: NestJwtService) { }

  async signAccessToken({ userId, status, sessionId, roles }: PayloadSignTokenDto) {
    return this.signToken({
      payload: { sub: userId, status, sid: sessionId, roles },
      options: { expiresIn: ms(this.accessExpires as ms.StringValue) / 1000 },
    });
  }

  async signRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  async generateTokenPair({
    userId,
    status,
    roles,
    sessionId = uuidv4(),
  }: PayloadSignTokenDto): Promise<TokenPairResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken({ userId, status, sessionId, roles }),
      this.signRefreshToken(),
    ]);

    return { accessToken, refreshToken, sessionId };
  }

  signToken({
    payload,
    options = { algorithm: 'HS256' },
    privateKey = this.jwtSecret,
  }: SignTokenDto): Promise<string> {
    return this.nestJwtService.signAsync(payload, {
      ...options,
      secret: privateKey,
    });
  }

  verifyToken({
    token,
    privateKey = this.jwtSecret,
  }: VerifyTokenDto): Promise<JwtPayload> {
    return this.nestJwtService.verifyAsync<JwtPayload>(token, {
      secret: privateKey,
    });
  }

  decodeToken(token: string): JwtPayload | null {
    const decoded = this.nestJwtService.decode(token);
    return typeof decoded === 'object' && decoded !== null
      ? (decoded as JwtPayload)
      : null;
  }

  generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  generateOTP() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  async requestAuthToken(req: { headers: { authorization?: string | string[] | undefined } }) {
    const authorization = req.headers.authorization;
    const token = typeof authorization === 'string' ? authorization.split(' ')[1] : undefined;
    if (!token) {
      return null;
    }

    try {
      const verify = await this.verifyToken({ token });
      return verify.sub ?? null;
    } catch {
      return null;
    }
  }
}

export const jwtService = new JwtService(
  new NestJwtService({ secret: configService.JWT_CONFIG.JWT_SECRET }),
);
