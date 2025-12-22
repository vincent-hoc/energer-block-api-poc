import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BatchDto } from '../dto/batch.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('batch')
@UseGuards(AuthGuard)
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  processBatch(@Body() batchDto: BatchDto) {
    return this.batchService.processBatch(batchDto);
  }
}
