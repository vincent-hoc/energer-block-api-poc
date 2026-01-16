import { OcrService } from './ocr.service';
declare class OcrDto {
    document_uuid: string;
    document_url: string;
    s3_key: string;
}
export declare class OcrController {
    private readonly ocrService;
    constructor(ocrService: OcrService);
    processOcr(ocrDto: OcrDto): Promise<{
        document_uuid: string;
        text: string;
        status: string;
    }>;
}
export {};
