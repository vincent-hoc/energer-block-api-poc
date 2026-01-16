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
exports.SummarizeController = void 0;
const common_1 = require("@nestjs/common");
const summarize_service_1 = require("./summarize.service");
const summarize_dto_1 = require("./summarize.dto");
const basic_auth_guard_1 = require("../common/guards/basic-auth.guard");
let SummarizeController = class SummarizeController {
    summarizeService;
    constructor(summarizeService) {
        this.summarizeService = summarizeService;
    }
    async summarize(summarizeDto) {
        try {
            return await this.summarizeService.processSummarize(summarizeDto);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new common_1.HttpException({ error: message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.SummarizeController = SummarizeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [summarize_dto_1.SummarizeDto]),
    __metadata("design:returntype", Promise)
], SummarizeController.prototype, "summarize", null);
exports.SummarizeController = SummarizeController = __decorate([
    (0, common_1.Controller)('api/summarize'),
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    __metadata("design:paramtypes", [summarize_service_1.SummarizeService])
], SummarizeController);
//# sourceMappingURL=summarize.controller.js.map