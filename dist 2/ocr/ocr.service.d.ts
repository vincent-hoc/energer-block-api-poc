import { ConfigService } from '@nestjs/config';
export declare class OcrService {
    private configService;
    private textractClient;
    private bucketName;
    private readonly POLLING_INTERVAL;
    constructor(configService: ConfigService);
    analyzeWithTextract(s3Key: string, documentUuid: string): Promise<{
        document_uuid: string;
        text: string;
        status: string;
    }>;
    private waitForTextractCompletion;
    private extractTextFromBlocks;
}
