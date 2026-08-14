import { ConflictException, NotFoundException } from '@/errors/error';
import { UserService } from '@/modules/user/service/user.service';
import { Injectable } from '@nestjs/common';
import type { Position, Prisma } from '@prisma/client';
import { UserTeamRepository } from '../repository/user-team.repository';

export type AddUserToTeamPayload = {
  userId: string;
  teamId: number;
  position?: Position;
};

@Injectable()
export class UserTeamService {
  constructor(
    private readonly userTeamRepository: UserTeamRepository,
    private readonly userService: UserService,
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
