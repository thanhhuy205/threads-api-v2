import { authRepository, AuthUser, RegisterPayload } from '../repo/auth.repository';

export type LoginPayload = {
    email: string;
    password: string;
};

class AuthService {
    async register(payload: RegisterPayload): Promise<AuthUser> {
        return authRepository.createUser(payload);
    }

    async login(payload: LoginPayload): Promise<AuthUser | null> {
        const user = await authRepository.findUserByEmail(payload.email);

        if (!user) {
            return null;
        }

        return user;
    }
}

export const authService = new AuthService();
