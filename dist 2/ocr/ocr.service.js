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
exports.OcrService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_textract_1 = require("@aws-sdk/client-textract");
let OcrService = class OcrService {
    configService;
    textractClient;
    bucketName;
    POLLING_INTERVAL = 5000;
    constructor(configService) {
        this.configService = configService;
        const region = this.configService.get('AWS_REGION') || 'eu-west-3';
        this.bucketName = this.configService.get('S3_BUCKET_NAME') || 'enerver-api-assets';
        const credentials = {
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
        };
        this.textractClient = new client_textract_1.TextractClient({
            region,
            credentials,
        });
    }
    async analyzeWithTextract(s3Key, documentUuid) {
        try {
            console.log(`[OCR] Starting Textract analysis for ${s3Key}`);
            const startCommand = new client_textract_1.StartDocumentAnalysisCommand({
                DocumentLocation: {
                    S3Object: {
                        Bucket: this.bucketName,
                        Name: s3Key,
                    },
                },
                FeatureTypes: ['TABLES', 'FORMS', 'LAYOUT'],
            });
            const startResponse = await this.textractClient.send(startCommand);
            const jobId = startResponse.JobId;
            if (!jobId) {
                throw new Error('Failed to start Textract job');
            }
            console.log(`[OCR] Textract job started: ${jobId}`);
            const result = await this.waitForTextractCompletion(jobId);
            const extractedText = this.extractTextFromBlocks(result.Blocks);
            console.log(`[OCR] Textract completed for ${documentUuid}: ${extractedText.length} characters`);
            return {
                document_uuid: documentUuid,
                text: extractedText,
                status: 'completed',
            };
        }
        catch (error) {
            console.error(`[OCR Error] Failed to analyze ${s3Key}:`, error);
            throw error;
        }
    }
    async waitForTextractCompletion(jobId) {
        let status = 'IN_PROGRESS';
        let allBlocks = [];
        let nextToken;
        while (status === 'IN_PROGRESS') {
            await new Promise((resolve) => setTimeout(resolve, this.POLLING_INTERVAL));
            const getCommand = new client_textract_1.GetDocumentAnalysisCommand({
                JobId: jobId,
            });
            const response = await this.textractClient.send(getCommand);
            status = response.JobStatus || 'FAILED';
            if (status === 'SUCCEEDED') {
                allBlocks = response.Blocks || [];
                nextToken = response.NextToken;
                while (nextToken) {
                    const nextCommand = new client_textract_1.GetDocumentAnalysisCommand({
                        JobId: jobId,
                        NextToken: nextToken,
                    });
                    const nextResponse = await this.textractClient.send(nextCommand);
                    allBlocks = allBlocks.concat(nextResponse.Blocks || []);
                    nextToken = nextResponse.NextToken;
                }
                return {
                    JobId: jobId,
                    JobStatus: status,
                    Blocks: allBlocks,
                };
            }
            else if (status === 'FAILED') {
                throw new Error(`Textract job ${jobId} failed`);
            }
        }
    }
    extractTextFromBlocks(blocks) {
        if (!blocks || blocks.length === 0) {
            return '';
        }
        const lines = blocks
            .filter((block) => block.BlockType === 'LINE')
            .map((block) => block.Text || '')
            .filter((text) => text.length > 0);
        return lines.join('\n');
    }
};
exports.OcrService = OcrService;
exports.OcrService = OcrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OcrService);
//# sourceMappingURL=ocr.service.js.map