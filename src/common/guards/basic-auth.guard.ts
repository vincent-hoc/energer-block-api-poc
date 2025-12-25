import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    // Expected format: "Basic <base64(username:password)>"
    const [authType, encodedCredentials] = authHeader.split(' ');

    if (authType !== 'Basic' || !encodedCredentials) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    try {
      // Decode base64 credentials
      const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');

      // Get expected credentials from environment
      const expectedUsername = this.configService.get<string>('API_AUTH_USERNAME');
      const expectedPassword = this.configService.get<string>('API_AUTH_PASSWORD');

      if (!expectedUsername || !expectedPassword) {
        throw new Error('API authentication not configured');
      }

      // Verify credentials
      if (username === expectedUsername && password === expectedPassword) {
        return true;
      }

      throw new UnauthorizedException('Invalid credentials');
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Authorization header');
    }
  }
}
