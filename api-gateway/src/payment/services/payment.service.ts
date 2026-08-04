import { Injectable } from '@nestjs/common';
import { PaymentClientService } from './payment-client.service';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentClientService: PaymentClientService) {}

  async createPayment(data: any) {
    return this.paymentClientService.createPayment(data);
  }

  async getPaymentById(id: string) {
    return this.paymentClientService.getPaymentById(id);
  }

  async updatePayment(id: string, data: any) {
    return this.paymentClientService.updatePayment(id, data);
  }

  async deletePayment(id: string) {
    return this.paymentClientService.deletePayment(id);
  }

  async processPayment(id: string) {
    return this.paymentClientService.processPayment(id);
  }

  async refundPayment(id: string, data?: any) {
    return this.paymentClientService.refundPayment(id, data);
  }

  async getPaymentStatus(id: string) {
    return this.paymentClientService.getPaymentStatus(id);
  }
}
