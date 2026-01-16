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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrController = void 0;
const common_1 = require("@nestjs/common");
const ocr_service_1 = require("./ocr.service");
class OcrDto {
    document_uuid;
    document_url;
    s3_key;
}
let OcrController = class OcrController {
    ocrService;
    constructor(ocrService) {
        this.ocrService = ocrService;
    }
    async processOcr(ocrDto) {
        try {
            const result = await this.ocrService.analyzeWithTextract(ocrDto.s3_key, ocrDto.document_uuid);
            return result;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur OCR';
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.OcrController = OcrController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [OcrDto]),
    __metadata("design:returntype", Promise)
], OcrController.prototype, "processOcr", null);
exports.OcrController = OcrController = __decorate([
    (0, common_1.Controller)('api/ocr'),
    __metadata("design:paramtypes", [ocr_service_1.OcrService])
], OcrController);
//# sourceMappingURL=ocr.controller.js.map