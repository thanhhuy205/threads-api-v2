import { Message } from '@/common/decorators/message.decorator';
import { Controller, Get, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SKILL_SERVICE, type SkillService } from '../service/skill.service';

@ApiTags('Skill')
@ApiBearerAuth('bearer')
@Controller('skills')
export class SkillController {
  constructor(
    @Inject(SKILL_SERVICE)
    private readonly skillService: SkillService,
  ) {}

  @Get()
  @Message('Skills retrieved successfully')
  @ApiOperation({ summary: 'Get all skills' })
  findAll() {
    return this.skillService.findAll();
  }
}
