import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class BasicAuthGuard implements CanActivate {
    private configService;
    private readonly users;
    constructor(configService: ConfigService);
    canActivate(context: ExecutionContext): boolean;
}
