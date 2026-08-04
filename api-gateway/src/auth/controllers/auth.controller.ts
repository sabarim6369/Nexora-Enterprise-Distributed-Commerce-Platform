import { Controller, Post, Body, Param, Headers, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: any) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: any) {
    return this.authService.login(data);
  }

  @Post('refresh')
  async refreshToken(@Body() data: any) {
    return this.authService.refreshToken(data);
  }

  @Post('logout')
  async logout(@Body() data: any) {
    return this.authService.logout(data);
  }

  @Post('logout-all')
  async logoutAll(@Body() data: any) {
    return this.authService.logoutAll(data);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: any) {
    return this.authService.forgotPassword(data);
  }

  @Post('reset-password')
  async resetPassword(@Body() data: any) {
    return this.authService.resetPassword(data);
  }

  @Post('verify-email/:userId')
  async verifyEmail(@Param('userId') userId: string) {
    return this.authService.verifyEmail(userId);
  }

  @Get('me')
  async getMe(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.authService.getMe(token);
  }
}
