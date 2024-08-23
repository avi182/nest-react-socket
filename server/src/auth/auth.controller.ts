import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '../utils/types';
import { PublicResource } from '../middlewares/auth/token.guard.service';

@PublicResource()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<ApiResponse<{ accessToken: string }>> {
    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password,
      );
      if (!user) {
        throw new Error('Invalid credentials');
      }
      const accessToken = await this.authService.generateAccessToken(user);
      return {
        success: true,
        data: {
          accessToken,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('register')
  async register(
    @Body() body: { email: string; password: string },
  ): Promise<ApiResponse<{ accessToken: string }>> {
    try {
      const user = await this.authService.registerUser(
        body.email,
        body.password,
      );
      const accessToken = await this.authService.generateAccessToken(user);
      return {
        success: true,
        data: {
          accessToken,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
