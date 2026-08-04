import { Controller, Post, Body, Param, Headers, Get, UseGuards } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AuthClientService } from '../services/auth-client.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authClientService: AuthClientService) {}

  @Public()
  @Post('register')
  async register(@Body() data: any) {
    return this.authClientService.register(data);
  }

  @Public()
  @Post('login')
  async login(@Body() data: any) {
    return this.authClientService.login(data);
  }

  @Public()
  @Post('refresh')
  async refreshToken(@Body() data: any) {
    return this.authClientService.refreshToken(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body() data: any) {
    return this.authClientService.logout(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(@Body() data: any) {
    return this.authClientService.logoutAll(data);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() data: any) {
    return this.authClientService.forgotPassword(data);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() data: any) {
    return this.authClientService.resetPassword(data);
  }

  @Public()
  @Post('verify-email/:userId')
  async verifyEmail(@Param('userId') userId: string) {
    return this.authClientService.verifyEmail(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.authClientService.getMe(token);
  }
}
