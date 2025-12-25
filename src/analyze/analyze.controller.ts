import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AnalyzeDto } from './analyze.dto';

@Controller('api/analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  async analyze(@Body() analyzeDto: AnalyzeDto) {
    try {
      return await this.analyzeService.processAnalyze(analyzeDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        { error: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
