import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ExtractService } from './extract.service';

class ExtractDto {
  document_uuid: string;
  ocr_text: string;
}

@Controller('api/extract')
export class ExtractController {
  constructor(private readonly extractService: ExtractService) {}

  @Post()
  async extractFields(@Body() extractDto: ExtractDto) {
    try {
      const result = await this.extractService.extractFieldsWithChatbase(
        extractDto.ocr_text,
        extractDto.document_uuid
      );
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur extraction';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
