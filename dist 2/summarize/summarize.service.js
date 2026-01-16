"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummarizeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ocr_space_api_wrapper_1 = require("ocr-space-api-wrapper");
let SummarizeService = class SummarizeService {
    configService;
    ocrApiKey;
    ocrUrl;
    chatbaseApiUrl;
    chatbaseBearerToken;
    chatbaseSummarizeChatbotId;
    chatbaseFostIdentificationId;
    chatbaseOcodeChatbotId;
    constructor(configService) {
        this.configService = configService;
        const ocrApiKey = this.configService.get('OCR_SPACE_API_KEY');
        const ocrUrl = this.configService.get('OCR_SPACE_URL');
        const chatbaseApiUrl = this.configService.get('CHATBASE_API_URL');
        const chatbaseBearerToken = this.configService.get('CHATBASE_BEARER_TOKEN');
        const chatbaseSummarizeChatbotId = this.configService.get('CHATBASE_SUMMARIZE_CHATBOT_ID');
        const chatbaseFostIdentificationId = this.configService.get('CHATBASE_FOST_IDENTIFICATION_CHATBOT_ID');
        const chatbaseOcodeChatbotId = this.configService.get('CHATBASE_OCODE_CHATBOT_ID');
        if (!ocrApiKey || !ocrUrl) {
            throw new Error('Missing OCR.space configuration in environment variables');
        }
        if (!chatbaseApiUrl || !chatbaseBearerToken || !chatbaseSummarizeChatbotId || !chatbaseFostIdentificationId || !chatbaseOcodeChatbotId) {
            throw new Error('Missing Chatbase configuration in environment variables');
        }
        this.ocrApiKey = ocrApiKey;
        this.ocrUrl = ocrUrl;
        this.chatbaseApiUrl = chatbaseApiUrl;
        this.chatbaseBearerToken = chatbaseBearerToken;
        this.chatbaseSummarizeChatbotId = chatbaseSummarizeChatbotId;
        this.chatbaseFostIdentificationId = chatbaseFostIdentificationId;
        this.chatbaseOcodeChatbotId = chatbaseOcodeChatbotId;
    }
    async processSummarize(dto) {
        console.log('Processing summarize request:', {
            vault_uuid: dto.vault_uuid,
            document_uuid: dto.document_uuid,
            document_url: dto.document_url,
            async: dto.async ?? true,
            debug_ocr: dto.debug_ocr ?? false,
            fost_key: dto.fost_key,
        });
        try {
            console.log('[Step 1] Starting OCR.space text extraction...');
            const extractedText = await this.extractTextWithOCR(dto.document_url, dto.debug_ocr ?? false);
            console.log(`[Step 1 - OCR.space] Completed - Extracted ${extractedText.length} characters`);
            console.log('[Step 2] Sending OCR text to Chatbase (Step 1)...');
            const chatbaseResponse = await this.callChatbase(extractedText, 'Summarize Analysis', this.chatbaseSummarizeChatbotId);
            console.log('[Step 2 - Chatbase] Completed');
            let analysisResult = chatbaseResponse;
            if (chatbaseResponse && chatbaseResponse.text) {
                try {
                    analysisResult = JSON.parse(chatbaseResponse.text);
                    console.log('[Step 2] Analysis result:', analysisResult);
                }
                catch (error) {
                    console.warn('[Warning] Could not parse Chatbase text field as JSON, using raw response');
                    analysisResult = chatbaseResponse;
                }
            }
            if (dto.document_uuid) {
                analysisResult.document_uuid = dto.document_uuid;
                console.log('[Step 2] Injected document_uuid:', dto.document_uuid);
            }
            console.log('[Step 3] Sending analysis result to Chatbase (Step 2)...');
            const step2Response = await this.callChatbase(JSON.stringify(analysisResult), 'Summarize Step 2', this.chatbaseFostIdentificationId);
            console.log('[Step 3 - Chatbase] Completed');
            let finalResult = step2Response;
            if (step2Response && step2Response.text) {
                try {
                    finalResult = JSON.parse(step2Response.text);
                    console.log('[Step 3] Final result:', finalResult);
                }
                catch (error) {
                    console.warn('[Warning] Could not parse Step 2 Chatbase text field as JSON, using raw response');
                    finalResult = step2Response;
                }
            }
            const fostsValue = dto.fost_key ? [dto.fost_key] : finalResult;
            let analyseResult = [];
            const isAsync = dto.async ?? true;
            if (!isAsync) {
                console.log('[Step 4] Sending fosts and documents to OCODE chatbot...');
                const ocodeInput = {
                    fosts: fostsValue,
                    documents: [analysisResult]
                };
                const ocodeResponse = await this.callChatbase(JSON.stringify(ocodeInput), 'OCODE Analysis', this.chatbaseOcodeChatbotId);
                console.log('[Step 4 - OCODE] Completed');
                if (ocodeResponse && ocodeResponse.text) {
                    try {
                        analyseResult = JSON.parse(ocodeResponse.text);
                        console.log('[Step 4] OCODE analysis result:', analyseResult);
                    }
                    catch (error) {
                        console.warn('[Warning] Could not parse OCODE text field as JSON, using raw response');
                        analyseResult = ocodeResponse;
                    }
                }
                else {
                    analyseResult = ocodeResponse;
                }
            }
            else {
                console.log('[Step 4] Skipped - async mode enabled');
            }
            return {
                documents: [analysisResult],
                fosts: fostsValue,
                analyse: analyseResult
            };
        }
        catch (error) {
            console.error('[Error] Failed to process summarize:', error);
            throw error;
        }
    }
    async extractTextWithOCR(documentUrl, debugOcr) {
        try {
            console.log('  Sending file URL to OCR.space...');
            const ocrResult = await (0, ocr_space_api_wrapper_1.ocrSpace)(documentUrl, {
                apiKey: this.ocrApiKey,
                language: 'fre',
                OCREngine: "1",
                isTable: false,
                isSearchablePdfHideTextLayer: true,
                scale: true,
                filetype: 'PDF',
                ocrUrl: this.ocrUrl,
            });
            if (debugOcr) {
                console.log('[DEBUG OCR] Full OCR response:', JSON.stringify(ocrResult, null, 2));
            }
            if (ocrResult && ocrResult.ParsedResults) {
                const allText = ocrResult.ParsedResults.map((result) => result.ParsedText || '').join('\n');
                return allText;
            }
            throw new Error('No text extracted from OCR.space');
        }
        catch (error) {
            console.error('[OCR Error] Failed to extract text:', error);
            throw error;
        }
    }
    generateChatbaseMessage(data, chatbotId) {
        const MAX_CHUNK_SIZE = 3000;
        const chunks = [];
        for (let i = 0; i < data.length; i += MAX_CHUNK_SIZE) {
            chunks.push(data.slice(i, i + MAX_CHUNK_SIZE));
        }
        const messages = [
            {
                role: 'user',
                content: `
          Tu vas recevoir un message en plusieurs parties.
          Ne réponds rien avant d'avoir reçu toutes les parties.
          Quand tu verras le message "FIN_DE_TRANSMISSION", tu devras :
          1. Considérer toutes les parties précédentes comme un seul document complet,
          2. Produire un unique message de sortie`,
            },
            ...chunks.map((chunk) => ({
                role: 'user',
                content: chunk,
            })),
            {
                role: 'user',
                content: 'FIN_DE_TRANSMISSION',
            },
        ];
        console.log(`  Sending ${chunks.length} chunk(s) (${data.length} total characters)`);
        return {
            messages: messages,
            chatbotId: chatbotId,
            stream: false,
        };
    }
    async callChatbase(textData, chatbotName, chatbotId) {
        try {
            const requestBody = this.generateChatbaseMessage(textData, chatbotId);
            const response = await fetch(this.chatbaseApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.chatbaseBearerToken}`,
                },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) {
                throw new Error(`Chatbase API error: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            return result;
        }
        catch (error) {
            console.error(`[Chatbase ${chatbotName} Error]:`, error);
            throw error;
        }
    }
};
exports.SummarizeService = SummarizeService;
exports.SummarizeService = SummarizeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SummarizeService);
//# sourceMappingURL=summarize.service.js.map