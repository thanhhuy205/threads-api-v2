import configService from '@/config/config';
import { UnauthorizedException } from '@/errors/error';
import { PayloadSignTokenDto, SignTokenDto, VerifyTokenDto } from '@/modules/jwt/dto';
import { TokenPairResponse } from '@/modules/jwt/dto/response/token-pair.response';
import crypto from 'crypto';
import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ms from 'ms';
import { v4 as uuidv4 } from 'uuid';
class JwtService {
    private readonly JWT_SECRET: string = configService.JWT_SECRET;
    private readonly ACCESS_EXPIRES: string = configService.ACCESS_EXPIRES;
    async signAccessToken({ userId, status, sessionId }: PayloadSignTokenDto) {
        return this.signToken({
            payload: { sub: userId, status, sid: sessionId },
            options: { expiresIn: ms(this.ACCESS_EXPIRES as ms.StringValue) / 1000 }
        });
    }

    async signRefreshToken() {
        return crypto.randomBytes(64).toString('hex');
    }

    async generateTokenPair({ userId, status, sessionId = uuidv4() }: PayloadSignTokenDto): Promise<TokenPairResponse> {
        const [accessToken, refreshToken] = await Promise.all([
            this.signAccessToken({ userId, status, sessionId }),
            this.signRefreshToken()
        ]);

        return { accessToken, refreshToken, sessionId };
    }

    signToken = ({
        payload,
        options = {
            algorithm: 'HS256'
        },
        privateKey = this.JWT_SECRET as string
    }: SignTokenDto) => {
        return new Promise<string>((resolve, reject) => {
            jwt.sign(payload, privateKey, options || {}, (error: Error | null, token: string | undefined) => {
                if (error || !token) {
                    return reject(error);
                }
                resolve(token);
            });
        });
    };

    verifyToken = ({
        token,
        privateKey = this.JWT_SECRET as string
    }: VerifyTokenDto): Promise<JwtPayload> => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, privateKey, (err: Error | null, decoded: unknown) => {
                if (err) reject(err);
                else resolve(decoded as JwtPayload);
            });
        });
    };


    generateRandomToken() {
        const token = crypto.randomBytes(32).toString('hex');
        return token;
    }

    generateOTP() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }


    async requestAuthToken(req: Request<any, any, any, any>) {
        const token = req.headers.authorization?.split(' ')[1];
        let userId = null;
        if (token) {
            try {
                const verify = await jwtService.verifyToken({ token });
                userId = verify.sub ?? null;
            } catch {
                throw new UnauthorizedException('Invalid token');
            }
        }
        return userId;
    }
}

export const jwtService = new JwtService();