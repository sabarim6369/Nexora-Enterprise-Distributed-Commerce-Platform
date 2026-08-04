import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseHttpClient } from '../../common/services/base-http-client.service';

@Injectable()
export class AuthClientService {
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly baseHttpClient: BaseHttpClient,
  ) {
    this.baseUrl = this.configService.get<string>('IDENTITY_SERVICE_URL') || 'http://localhost:3001';
  }

  async register(data: any) {
    return this.baseHttpClient.post(`${this.baseUrl}/auth/register`, data);
  }

  async login(data: any) {
    return this.baseHttpClient.post(`${this.baseUrl}/auth/login`, data);
  }

  async refreshToken(data: any) {
    return this.baseHttpClient.post(`${this.baseUrl}/auth/refresh`, data);
  }

  async logout(data: any) {
    return this.baseHttpClient.post(`${this.baseUrl}/auth/logout`, data);
  }

  async logoutAll(data: any) {
    return this.baseHttpClient.post(`${this.baseUrl}/auth/logout-all`, data);
  }

  async forgotPassword(data: any) {
    return this.baseHttpClient.post(`${this.baseUrl}/auth/forgot-password`, data);
  }

  async resetPassword(data: any) {
    return this.baseHttpClient.post(`${this.baseUrl}/auth/reset-password`, data);
  }

  async verifyEmail(userId: string) {
    return this.baseHttpClient.post(`${this.baseUrl}/auth/verify-email/${userId}`);
  }

  async getMe(accessToken: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
}
