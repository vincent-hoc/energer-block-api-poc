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
exports.ExtractService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ExtractService = class ExtractService {
    configService;
    chatbaseApiUrl;
    chatbaseBearerToken;
    chatbaseFieldExtractionId;
    constructor(configService) {
        this.configService = configService;
        this.chatbaseApiUrl = this.configService.get('CHATBASE_API_URL') || '';
        this.chatbaseBearerToken = this.configService.get('CHATBASE_BEARER_TOKEN') || '';
        this.chatbaseFieldExtractionId = this.configService.get('CHATBASE_FIELD_EXTRACTION_CHATBOT_ID') || '';
        if (!this.chatbaseApiUrl || !this.chatbaseBearerToken || !this.chatbaseFieldExtractionId) {
            console.warn('[Extract] Missing Chatbase configuration');
        }
    }
    async extractFieldsWithChatbase(ocrText, documentUuid) {
        try {
            console.log(`[Extract] Starting field extraction for ${documentUuid}`);
            const requestBody = this.generateChatbaseMessage(ocrText, this.chatbaseFieldExtractionId);
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
            let fields = result;
            if (result && result.text) {
                try {
                    fields = JSON.parse(result.text);
                }
                catch (e) {
                    fields = { raw: result.text };
                }
            }
            console.log(`[Extract] Field extraction completed for ${documentUuid}`);
            return {
                document_uuid: documentUuid,
                fields: fields,
                status: 'completed',
            };
        }
        catch (error) {
            console.error(`[Extract Error] Failed to extract fields for ${documentUuid}:`, error);
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
        console.log(`[Extract] Sending ${chunks.length} chunk(s) (${data.length} total characters)`);
        return {
            messages: messages,
            chatbotId: chatbotId,
            stream: false,
        };
    }
};
exports.ExtractService = ExtractService;
exports.ExtractService = ExtractService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ExtractService);
//# sourceMappingURL=extract.service.js.map