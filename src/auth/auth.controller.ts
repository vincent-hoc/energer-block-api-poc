import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

class LoginDto {
  username: string;
  password: string;
}

@Controller('api/auth')
export class AuthController {
  private readonly users: Map<string, string>;

  constructor(private configService: ConfigService) {
    this.users = new Map();

    // Add demo user
    this.users.set('demo', 'demo2026');

    // Add configured user from environment
    const envUsername = this.configService.get<string>('API_AUTH_USERNAME');
    const envPassword = this.configService.get<string>('API_AUTH_PASSWORD');
    if (envUsername && envPassword) {
      this.users.set(envUsername, envPassword);
    }
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const expectedPassword = this.users.get(loginDto.username);

    if (expectedPassword && loginDto.password === expectedPassword) {
      // Generate Basic Auth token
      const token = Buffer.from(`${loginDto.username}:${loginDto.password}`).toString('base64');

      return {
        success: true,
        token: token,
        message: 'Authentification réussie'
      };
    }

    throw new HttpException('Identifiants incorrects', HttpStatus.UNAUTHORIZED);
  }
}
