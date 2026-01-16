import { ConfigService } from '@nestjs/config';
import { AnalyzeDto } from './analyze.dto';
export declare class AnalyzeService {
    private configService;
    private ocrApiKey;
    private ocrUrl;
    private chatbaseApiUrl;
    private chatbaseBearerToken;
    private chatbaseSummarizeChatbotId;
    private chatbaseFostIdentificationId;
    private chatbaseOcodeChatbotId;
    constructor(configService: ConfigService);
    processAnalyze(dto: AnalyzeDto): Promise<any>;
    private extractTextWithOCR;
    private generateChatbaseMessage;
    private callChatbase;
}
