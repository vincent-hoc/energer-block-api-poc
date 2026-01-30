import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  private readonly users: Map<string, string>;

  constructor(private configService: ConfigService) {
    this.users = new Map();

    // Add demo user
    this.users.set('demo', 'demo2026');

    // Add configured user from environment (legacy single user)
    const envUsername = this.configService.get<string>('API_AUTH_USERNAME');
    const envPassword = this.configService.get<string>('API_AUTH_PASSWORD');
    if (envUsername && envPassword) {
      this.users.set(envUsername, envPassword);
    }

    // Add multiple users from JSON environment variable
    // Format: API_AUTH_USERS=[{"username":"user1","password":"pass1"},{"username":"user2","password":"pass2"}]
    const usersJson = this.configService.get<string>('API_AUTH_USERS');
    if (usersJson) {
      try {
        const usersList = JSON.parse(usersJson);
        if (Array.isArray(usersList)) {
          usersList.forEach((user: { username: string; password: string }) => {
            if (user.username && user.password) {
              this.users.set(user.username, user.password);
            }
          });
        }
      } catch {
        console.warn('[Auth] Failed to parse API_AUTH_USERS JSON');
      }
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
