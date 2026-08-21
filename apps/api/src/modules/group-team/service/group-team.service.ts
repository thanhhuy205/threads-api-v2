import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@/errors/error';
import { TransactionService } from '@/shared/transaction/transaction.service';
import { PERMISSIONS } from '@/common/constants/permission.constant';
import { ABILITY_SERVICE, type AbilityService } from '@/modules/ability/service/ability.service';
import { Inject, Injectable } from '@nestjs/common';
import type { Position } from '@prisma/client';
import { GroupTeamRepository } from '../repository/group-team.repository';
import { UserTeamService } from './user-team.service';

type CreateGroupTeamPayload = {
  name: string;
  createdById: string;
};

type AddTeamMemberPayload = {
  teamPublicId: string;
  userId: string;
  position?: Position;
  requestedById: string;
};

@Injectable()
export class GroupTeamService {
  constructor(
    private readonly groupTeamRepository: GroupTeamRepository,
    private readonly userTeamService: UserTeamService,
    private readonly transactionService: TransactionService,
    @Inject(ABILITY_SERVICE) private readonly abilityService: AbilityService,
  ) {}

  async create(payload: CreateGroupTeamPayload) {
    await this.abilityService.assertCan(
      payload.createdById,
      PERMISSIONS.GROUP_CREATE,
    );

    const name = this.normalizeName(payload.name);

    if (!name) {
      throw new BadRequestException('Team name is required');
    }

    const existingTeam = await this.groupTeamRepository.findByName(name);

    if (existingTeam) {
      throw new ConflictException('Team name already exists');
    }

    try {
      return await this.transactionService.doInTransaction(async (tx) => {
        const team = await this.groupTeamRepository.create(
          { name, createdById: payload.createdById },
          tx,
        );

        await this.userTeamService.addUser(
          { userId: payload.createdById, teamId: team.id },
          tx,
        );

        return team;
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Team name already exists');
      }
      throw error;
    }
  }

  async addMember(payload: AddTeamMemberPayload) {
    const team = await this.groupTeamRepository.findByPublicId(
      payload.teamPublicId,
    );

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (team.createdById !== payload.requestedById) {
      throw new ForbiddenException('Only the team creator can add members');
    }

    return this.userTeamService.addUser({
      userId: payload.userId,
      teamId: team.id,
      position: payload.position,
    });
  }

  async resolveGroupForPost(groupPublicId: string, userId: string) {
    const team = await this.groupTeamRepository.findByPublicId(groupPublicId);

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (!(await this.userTeamService.isMember(userId, team.id))) {
      throw new ForbiddenException('User is not a member of this team');
    }

    return team;
  }

  private normalizeName(name: string) {
    return name.trim().replace(/\s+/g, ' ');
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
