export const USER_READER = Symbol('USER_READER');

export interface UserRef {
  publicId: string;
}

export interface UserReader {
  findByUsername(username: string): Promise<UserRef | null>;
}
