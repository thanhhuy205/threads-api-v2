import { ConflictException, NotFoundException } from '@/errors/error';
import { USER_SERVICE, type UserService } from '@user-service/modules/user/service/user.service';
import { Inject, Injectable } from '@nestjs/common';
import type { Position, Prisma } from 'apps/user-service/generated/prisma';
import {
  USER_TEAM_REPOSITORY,
  type UserTeamRepository,
} from '../../repository/user-team.repository';
import type { UserTeamService } from '../user-team.service';

export type AddUserToTeamPayload = {
  userId: string;
  teamId: number;
  position?: Position;
};

@Injectable()
export class UserTeamServiceImpl implements UserTeamService {
  constructor(
    @Inject(USER_TEAM_REPOSITORY)
    private readonly userTeamRepository: UserTeamRepository,
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) {}

  async addUser(payload: AddUserToTeamPayload, tx?: Prisma.TransactionClient) {
    const [user, existingMembership] = await Promise.all([
      this.userService.findByUserId(payload.userId),
      this.userTeamRepository.findByUserAndTeam(
        payload.userId,
        payload.teamId,
        tx,
      ),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (existingMembership) {
      throw new ConflictException('User is already a member of this team');
    }

    try {
      return await this.userTeamRepository.create(payload, tx);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('User is already a member of this team');
      }
      throw error;
    }
  }

  async isMember(
    userId: string,
    teamId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<boolean> {
    return Boolean(
      await this.userTeamRepository.findByUserAndTeam(userId, teamId, tx),
    );
  }

  private isUniqueConstraintError(error: unknown): error is { code: 'P2002' } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    );
  }
}
