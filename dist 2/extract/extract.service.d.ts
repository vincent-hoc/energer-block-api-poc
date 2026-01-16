import { ConfigService } from '@nestjs/config';
export declare class ExtractService {
    private configService;
    private chatbaseApiUrl;
    private chatbaseBearerToken;
    private chatbaseFieldExtractionId;
    constructor(configService: ConfigService);
    extractFieldsWithChatbase(ocrText: string, documentUuid: string): Promise<{
        document_uuid: string;
        fields: any;
        status: string;
    }>;
    private generateChatbaseMessage;
}
