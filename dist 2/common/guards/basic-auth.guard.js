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
exports.BasicAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let BasicAuthGuard = class BasicAuthGuard {
    configService;
    users;
    constructor(configService) {
        this.configService = configService;
        this.users = new Map();
        this.users.set('demo', 'demo2026');
        const envUsername = this.configService.get('API_AUTH_USERNAME');
        const envPassword = this.configService.get('API_AUTH_PASSWORD');
        if (envUsername && envPassword) {
            this.users.set(envUsername, envPassword);
        }
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new common_1.UnauthorizedException('Missing Authorization header');
        }
        const [authType, encodedCredentials] = authHeader.split(' ');
        if (authType !== 'Basic' || !encodedCredentials) {
            throw new common_1.UnauthorizedException('Invalid Authorization header format');
        }
        try {
            const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
            const [username, password] = credentials.split(':');
            const expectedPassword = this.users.get(username);
            if (expectedPassword && password === expectedPassword) {
                return true;
            }
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Invalid Authorization header');
        }
    }
};
exports.BasicAuthGuard = BasicAuthGuard;
exports.BasicAuthGuard = BasicAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BasicAuthGuard);
//# sourceMappingURL=basic-auth.guard.js.map