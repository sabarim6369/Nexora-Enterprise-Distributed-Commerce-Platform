import { Injectable } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';

@Injectable()
export class AuthService {
  constructor(private readonly authClientService: AuthClientService) {}

  async register(data: any) {
    return this.authClientService.register(data);
  }

  async login(data: any) {
    return this.authClientService.login(data);
  }

  async refreshToken(data: any) {
    return this.authClientService.refreshToken(data);
  }

  async logout(data: any) {
    return this.authClientService.logout(data);
  }

  async logoutAll(data: any) {
    return this.authClientService.logoutAll(data);
  }

  async forgotPassword(data: any) {
    return this.authClientService.forgotPassword(data);
  }

  async resetPassword(data: any) {
    return this.authClientService.resetPassword(data);
  }

  async verifyEmail(userId: string) {
    return this.authClientService.verifyEmail(userId);
  }

  async getMe(accessToken: string) {
    return this.authClientService.getMe(accessToken);
  }
}
