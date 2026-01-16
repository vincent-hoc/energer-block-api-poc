import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicAuthGuard implements CanActivate {
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

      // Verify credentials
      const expectedPassword = this.users.get(username);
      if (expectedPassword && password === expectedPassword) {
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
