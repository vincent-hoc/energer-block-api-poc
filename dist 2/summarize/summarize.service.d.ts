import { ConfigService } from '@nestjs/config';
import { SummarizeDto } from './summarize.dto';
export declare class SummarizeService {
    private configService;
    private ocrApiKey;
    private ocrUrl;
    private chatbaseApiUrl;
    private chatbaseBearerToken;
    private chatbaseSummarizeChatbotId;
    private chatbaseFostIdentificationId;
    private chatbaseOcodeChatbotId;
    constructor(configService: ConfigService);
    processSummarize(dto: SummarizeDto): Promise<any>;
    private extractTextWithOCR;
    private generateChatbaseMessage;
    private callChatbase;
}
