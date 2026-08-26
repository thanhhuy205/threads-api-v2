import type { UserProfile } from '@user-service/modules/user/repository/user.repository';
import { TokenPairResponse } from '@api/shared/jwt/dto/response/token-pair.response';
import type { AuthSessionUser } from '@user-service/modules/auth/repository/auth.repository';

export type AuthSessionResponseDto = {
    user: Pick<AuthSessionUser, 'email' | 'username' | 'name' | 'bio' | 'avatar'>
} &
    TokenPairResponse & { positionPermission?: string[] }

export type AuthMeResponseDto = { user: UserProfile, positionPermission?: string[] };

type AuthSessionResponseMap = {
    type: 'auth';
    user: AuthSessionUser;
} & TokenPairResponse;

type AuthMeResponseMap = {
    type: 'me';
    user: UserProfile;
};

type AuthResponseMap = AuthSessionResponseMap | AuthMeResponseMap;

class AuthResponse {
    toResponse(
        map: AuthSessionResponseMap,
        positionPermission?: string[] | null,
    ): AuthSessionResponseDto;

    toResponse(
        map: AuthMeResponseMap,
        positionPermission?: string[] | null,
    ): AuthMeResponseDto;

    toResponse(map: AuthResponseMap, positionPermission?: string[] | null): AuthSessionResponseDto | AuthMeResponseDto {
        if (map.type === 'auth') {
            const { user, accessToken, refreshToken, sessionId } = map;

            return {
                user: {
                    email: user.email,
                    username: user.username,
                    name: user.name,
                    bio: user.bio,
                    avatar: user.avatar,
                },
                positionPermission: positionPermission || [],
                accessToken,
                refreshToken,
                sessionId,
            };
        }

        return {
            user: map.user,
            positionPermission: positionPermission || [],
        };
    }
}

export const authResponse = new AuthResponse();
