import { Module } from '@nestjs/common';
import { SummarizeController } from './summarize.controller';
import { SummarizeService } from './summarize.service';
import { BasicAuthGuard } from '../common/guards/basic-auth.guard';

@Module({
  controllers: [SummarizeController],
  providers: [SummarizeService, BasicAuthGuard],
})
export class SummarizeModule {}
