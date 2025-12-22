import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SummarizeService } from './summarize.service';
import { SummarizeDto } from './summarize.dto';

@Controller('api/summarize')
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
