export type RegisterPayload = {
    email: string;
    password: string;
    name?: string;
};

export type AuthUser = {
    id: string;
    email: string;
    name: string | null;
};

class AuthRepository {
    async createUser(payload: RegisterPayload): Promise<AuthUser> {
        return {
            id: 'temp-user-id',
            email: payload.email,
            name: payload.name ?? null,
        };
    }

    async findUserByEmail(_email: string): Promise<AuthUser | null> {
        return null;
    }
}

export const authRepository = new AuthRepository();
