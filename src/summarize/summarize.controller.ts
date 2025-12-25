import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { SummarizeService } from './summarize.service';
import { SummarizeDto } from './summarize.dto';
import { BasicAuthGuard } from '../common/guards/basic-auth.guard';

@Controller('api/summarize')
@UseGuards(BasicAuthGuard)
export class SummarizeController {
  constructor(private readonly summarizeService: SummarizeService) {}

  @Post()
  async summarize(@Body() summarizeDto: SummarizeDto) {
    try {
      return await this.summarizeService.processSummarize(summarizeDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        { error: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
