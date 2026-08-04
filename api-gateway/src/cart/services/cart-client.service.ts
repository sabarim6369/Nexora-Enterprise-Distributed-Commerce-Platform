import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseHttpClient } from '../../common/services/base-http-client.service';

@Injectable()
export class CartClientService {
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly baseHttpClient: BaseHttpClient,
  ) {
    this.baseUrl = this.configService.get<string>('CART_SERVICE_URL') || 'http://localhost:3002';
  }

  async getCart(userId?: string) {
    const headers = userId ? { 'X-User-Id': userId } : {};
    return this.baseHttpClient.get(`${this.baseUrl}/cart`, { headers });
  }

  async getCartSummary(userId?: string) {
    const headers = userId ? { 'X-User-Id': userId } : {};
    return this.baseHttpClient.get(`${this.baseUrl}/cart/summary`, { headers });
  }

  async addItem(data: any, userId?: string) {
    const headers = userId ? { 'X-User-Id': userId } : {};
    return this.baseHttpClient.post(`${this.baseUrl}/cart/items`, data, { headers });
  }

  async updateItem(productId: string, data: any, userId?: string) {
    const headers = userId ? { 'X-User-Id': userId } : {};
    return this.baseHttpClient.patch(`${this.baseUrl}/cart/items/${productId}`, data, { headers });
  }

  async removeItem(productId: string, userId?: string) {
    const headers = userId ? { 'X-User-Id': userId } : {};
    return this.baseHttpClient.delete(`${this.baseUrl}/cart/items/${productId}`, { headers });
  }

  async clearCart(userId?: string) {
    const headers = userId ? { 'X-User-Id': userId } : {};
    return this.baseHttpClient.delete(`${this.baseUrl}/cart`, { headers });
  }
}
