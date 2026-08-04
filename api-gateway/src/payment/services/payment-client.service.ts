import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseHttpClient } from '../../common/services/base-http-client.service';

@Injectable()
export class PaymentClientService {
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly baseHttpClient: BaseHttpClient,
  ) {
    this.baseUrl = this.configService.get<string>('PAYMENT_SERVICE_URL') || 'http://localhost:3006';
  }

  async createPayment(data: any) {
    return this.baseHttpClient.post(`${this.baseUrl}/payments`, data);
  }

  async getPaymentById(id: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/payments/${id}`);
  }

  async updatePayment(id: string, data: any) {
    return this.baseHttpClient.put(`${this.baseUrl}/payments/${id}`, data);
  }

  async deletePayment(id: string) {
    return this.baseHttpClient.delete(`${this.baseUrl}/payments/${id}`);
  }

  async processPayment(id: string) {
    return this.baseHttpClient.post(`${this.baseUrl}/payments/${id}/process`);
  }

  async refundPayment(id: string, data?: any) {
    return this.baseHttpClient.post(`${this.baseUrl}/payments/${id}/refund`, data);
  }

  async getPaymentStatus(id: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/payments/${id}/status`);
  }
}
