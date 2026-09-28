import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';

@ApiTags('Billing')
@ApiBearerAuth('bearer')
@Controller('billings')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  @ApiOperation({ summary: 'List billing plans' })
  findAll() {
    return this.billingService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a billing plan' })
  create(@Body() payload: CreateBillingDto) {
    return this.billingService.create(payload);
  }
}
