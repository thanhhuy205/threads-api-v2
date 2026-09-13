import type { Prisma } from '../../../generated/prisma/client';
import type { UpdateProfileDto } from '../dto/request/update-profile.request.dto';

export const USER_SERVICE = Symbol('USER_SERVICE');

export type GetNetworkUsernamesInput = { query: string };
export type UserPermissionPosition = {
  userPositions: Array<{
    positionPermission: { permission: { code: string } };
  }>;
} | null;

export interface UserService {
  updateProfile(userId: string, payload: UpdateProfileDto): Promise<any>;
  getPermissionPositionByUserId(userId: string): Promise<UserPermissionPosition>;
  getMyStatusProfile(userId: string): Promise<any>;
  findByUserId(userId: string): Promise<any>;
  findByUsernameNotRelationShip(
    username: string,
    tx: Prisma.TransactionClient,
  ): Promise<any>;
  findByUsername(username: string, userId?: string): Promise<any>;
  findExistingIds(userIds: string[]): Promise<string[]>;
  findUsersByUsernames(usernames: string[]): Promise<any[]>;
  searchUsername(input: GetNetworkUsernamesInput): Promise<any[]>;
  findUserByEmail(email: string): Promise<any>;
  searchUsernameOneQuery(input: { query: string }): Promise<any[]>;
}
