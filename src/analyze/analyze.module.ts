import { Module } from '@nestjs/common';
import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';
import { BasicAuthGuard } from '../common/guards/basic-auth.guard';

@Module({
  controllers: [AnalyzeController],
  providers: [AnalyzeService, BasicAuthGuard],
})
export class AnalyzeModule {}
