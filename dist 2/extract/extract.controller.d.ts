import { ExtractService } from './extract.service';
declare class ExtractDto {
    document_uuid: string;
    ocr_text: string;
}
export declare class ExtractController {
    private readonly extractService;
    constructor(extractService: ExtractService);
    extractFields(extractDto: ExtractDto): Promise<{
        document_uuid: string;
        fields: any;
        status: string;
    }>;
}
export {};
