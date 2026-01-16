import { ConfigService } from '@nestjs/config';
declare class LoginDto {
    username: string;
    password: string;
}
export declare class AuthController {
    private configService;
    private readonly users;
    constructor(configService: ConfigService);
    login(loginDto: LoginDto): {
        success: boolean;
        token: string;
        message: string;
    };
}
export {};
