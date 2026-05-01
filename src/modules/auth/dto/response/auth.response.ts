import type { AuthUser } from '../../repo/auth.repository';

export type AuthResponseMap = {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    sessionId: string;
};

export type AuthResponseDto = AuthResponseMap;

class AuthResponse {
    toResponse(map: AuthResponseMap): AuthResponseDto {
        return {
            user: map.user,
            accessToken: map.accessToken,
            refreshToken: map.refreshToken,
            sessionId: map.sessionId,
        };
    }
}

export const authResponse = new AuthResponse();
