export const USER_READER = Symbol('USER_READER');

export interface UserRef {
  id: string;
  username: string;
  email?: string;
  name?: string | null;
  bio?: string | null;
  avatar?: string | null;
  status?: string;
  verifiedAt?: Date | string | null;
}

export interface UserReader {
  findExistingIds(userIds: string[]): Promise<string[]>;
  getUser(userId: string): Promise<UserRef | null>;
  getUserByEmail(email: string): Promise<UserRef | null>;
  findByUsername(username: string): Promise<UserRef | null>;
  findByUserId(userId: string): Promise<UserRef | null>;
}
