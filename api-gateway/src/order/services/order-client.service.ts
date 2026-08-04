import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseHttpClient } from '../../common/services/base-http-client.service';

@Injectable()
export class OrderClientService {
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly baseHttpClient: BaseHttpClient,
  ) {
    this.baseUrl = this.configService.get<string>('ORDER_SERVICE_URL') || 'http://localhost:3004';
  }

  async createOrder(data: any) {
    return this.baseHttpClient.post(`${this.baseUrl}/orders`, data);
  }

  async getAllOrders(filters?: any) {
    return this.baseHttpClient.get(`${this.baseUrl}/orders`, { params: filters });
  }

  async getOrderById(id: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/orders/${id}`);
  }

  async getOrderByOrderNumber(orderNumber: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/orders/number/${orderNumber}`);
  }

  async getOrdersByUserId(userId: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/orders/user/${userId}`);
  }

  async updateOrder(id: string, data: any) {
    return this.baseHttpClient.put(`${this.baseUrl}/orders/${id}`, data);
  }

  async deleteOrder(id: string) {
    return this.baseHttpClient.delete(`${this.baseUrl}/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.baseHttpClient.put(`${this.baseUrl}/orders/${id}/status`, { status });
  }

  async updatePaymentStatus(id: string, paymentStatus: string) {
    return this.baseHttpClient.put(`${this.baseUrl}/orders/${id}/payment-status`, { paymentStatus });
  }

  async getOrderStatistics(userId?: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/orders/statistics/summary`, {
      params: userId ? { userId } : {},
    });
  }
}
