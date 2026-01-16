"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractModule = void 0;
const common_1 = require("@nestjs/common");
const extract_controller_1 = require("./extract.controller");
const extract_service_1 = require("./extract.service");
let ExtractModule = class ExtractModule {
};
exports.ExtractModule = ExtractModule;
exports.ExtractModule = ExtractModule = __decorate([
    (0, common_1.Module)({
        controllers: [extract_controller_1.ExtractController],
        providers: [extract_service_1.ExtractService],
    })
], ExtractModule);
//# sourceMappingURL=extract.module.js.map