import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SummarizeDto } from './summarize.dto';

@Injectable()
export class SummarizeService {
  constructor(private configService: ConfigService) {}

  async processSummarize(dto: SummarizeDto): Promise<any> {
    // TODO: Implement processing logic
    console.log('Processing summarize request:', {
      vault_uuid: dto.vault_uuid,
      document_uuid: dto.document_uuid,
      document_url: dto.document_url,
      async: dto.async ?? true,
      debug_ocr: dto.debug_ocr ?? false,
      fost_key: dto.fost_key,
    });

    // Placeholder response
    return {
      documents: [],
      fosts: [],
      analyse: {
        meta_audit: { global_status: 'PENDING' },
        analysis_details: [],
      },
    };
  }
}
