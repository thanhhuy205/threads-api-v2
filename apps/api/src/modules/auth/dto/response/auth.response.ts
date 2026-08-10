import type { TokenPairResponse } from '@/modules/jwt/dto/response/token-pair.response';
import type { UserProfile } from '@/modules/user/repository/user.repository';
import type { AuthSessionUser } from '../../repository/auth.repository';

export type AuthSessionResponseDto = {
    user: Pick<AuthSessionUser, 'email' | 'username' | 'name' | 'bio' | 'avatar'>
} &
    TokenPairResponse;

export type AuthMeResponseDto = UserProfile;

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
    toResponse(map: AuthSessionResponseMap): AuthSessionResponseDto;
    toResponse(map: AuthMeResponseMap): AuthMeResponseDto;
    toResponse(map: AuthResponseMap): AuthSessionResponseDto | AuthMeResponseDto {
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
                accessToken,
                refreshToken,
                sessionId,
            };
        }

        return map.user;
    }
}

export const authResponse = new AuthResponse();
