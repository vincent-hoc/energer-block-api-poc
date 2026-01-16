"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummarizeModule = void 0;
const common_1 = require("@nestjs/common");
const summarize_controller_1 = require("./summarize.controller");
const summarize_service_1 = require("./summarize.service");
const basic_auth_guard_1 = require("../common/guards/basic-auth.guard");
let SummarizeModule = class SummarizeModule {
};
exports.SummarizeModule = SummarizeModule;
exports.SummarizeModule = SummarizeModule = __decorate([
    (0, common_1.Module)({
        controllers: [summarize_controller_1.SummarizeController],
        providers: [summarize_service_1.SummarizeService, basic_auth_guard_1.BasicAuthGuard],
    })
], SummarizeModule);
//# sourceMappingURL=summarize.module.js.map