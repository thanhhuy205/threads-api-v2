import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ORGANIZATION_USE_CASE,
  type OrganizationUseCase,
} from '../../../application/port/inbound/organization.use-case';
import { CreateOrganizationRequestDto } from './dto/request';

@ApiTags('Organizations')
@ApiBearerAuth('bearer')
@Controller('organizations')
export class OrganizationHttpController {
  constructor(
    @Inject(ORGANIZATION_USE_CASE)
    private readonly organizationUseCase: OrganizationUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List organizations' })
  findAll() {
    return this.organizationUseCase.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an organization in Keycloak and the account database' })
  create(@Body() payload: CreateOrganizationRequestDto) {
    return this.organizationUseCase.create(payload);
  }
}
