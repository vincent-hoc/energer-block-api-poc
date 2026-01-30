import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { SummarizeService } from './summarize.service';
import { SummarizeDto, OcrDto, AnalyzeTextDto, FostDto, OcodeDto } from './summarize.dto';
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

  // Step 1: OCR with Textract
  @Post('ocr')
  async ocr(@Body() ocrDto: OcrDto) {
    try {
      return await this.summarizeService.processOcr(ocrDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        { error: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Step 2: Analyze text
  @Post('analyze')
  async analyze(@Body() analyzeDto: AnalyzeTextDto) {
    try {
      return await this.summarizeService.processAnalyzeText(analyzeDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        { error: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Step 3: FOST identification
  @Post('fost')
  async fost(@Body() fostDto: FostDto) {
    try {
      return await this.summarizeService.processFost(fostDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        { error: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Step 4: OCODE analysis
  @Post('ocode')
  async ocode(@Body() ocodeDto: OcodeDto) {
    try {
      return await this.summarizeService.processOcode(ocodeDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(
        { error: message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
