import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { OcrService } from './ocr.service';

class OcrDto {
  document_uuid: string;
  document_url: string;
  s3_key: string;
}

@Controller('api/ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post()
  async processOcr(@Body() ocrDto: OcrDto) {
    try {
      const result = await this.ocrService.analyzeWithTextract(ocrDto.s3_key, ocrDto.document_uuid);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur OCR';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
