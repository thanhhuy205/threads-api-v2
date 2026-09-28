import { Injectable } from '@nestjs/common';
import type { BillingType } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateBillingDto } from './dto/create-billing.dto';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.billing.findMany({ orderBy: { price: 'asc' } });
  }

  create(payload: CreateBillingDto) {
    return this.prisma.billing.create({
      data: {
        type: payload.type as BillingType,
        price: payload.price,
        detail: payload.detail,
      },
    });
  }
}
