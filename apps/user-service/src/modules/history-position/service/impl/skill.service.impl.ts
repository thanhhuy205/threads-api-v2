import { BadRequestException } from '@/errors/error';
import { Inject, Injectable } from '@nestjs/common';
import type { Prisma } from 'apps/user-service/generated/prisma';
import {
  SKILL_REPOSITORY,
  type SkillRepository,
} from '../../repository/skill.repository';
import type { SkillService } from '../skill.service';

@Injectable()
export class SkillServiceImpl implements SkillService {
  constructor(
    @Inject(SKILL_REPOSITORY)
    private readonly skillRepository: SkillRepository,
  ) {}

  async assertAllExist(ids: number[], tx?: Prisma.TransactionClient) {
    const skills = await this.skillRepository.findIds(ids, tx);
    if (skills.length !== ids.length) {
      throw new BadRequestException('One or more skills do not exist');
    }
  }

  findAll(tx?: Prisma.TransactionClient) {
    return this.skillRepository.findAll(tx);
  }
}
