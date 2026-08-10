import { Module } from '@nestjs/common';
import { ReportRepository } from './repository/report.repository';
import { ReportService } from './service/report.service';

@Module({
  providers: [ReportRepository, ReportService],
  exports: [ReportService],
})
export class ReportModule {}
