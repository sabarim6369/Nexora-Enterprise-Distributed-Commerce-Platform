import { Injectable } from '@nestjs/common';
import { OrderClientService } from './order-client.service';

@Injectable()
export class OrderService {
  constructor(private readonly orderClientService: OrderClientService) {}

  async createOrder(data: any) {
    return this.orderClientService.createOrder(data);
  }

  async getAllOrders(filters?: any) {
    return this.orderClientService.getAllOrders(filters);
  }

  async getOrderById(id: string) {
    return this.orderClientService.getOrderById(id);
  }

  async getOrderByOrderNumber(orderNumber: string) {
    return this.orderClientService.getOrderByOrderNumber(orderNumber);
  }

  async getOrdersByUserId(userId: string) {
    return this.orderClientService.getOrdersByUserId(userId);
  }

  async updateOrder(id: string, data: any) {
    return this.orderClientService.updateOrder(id, data);
  }

  async deleteOrder(id: string) {
    return this.orderClientService.deleteOrder(id);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.orderClientService.updateOrderStatus(id, status);
  }

  async updatePaymentStatus(id: string, paymentStatus: string) {
    return this.orderClientService.updatePaymentStatus(id, paymentStatus);
  }

  async getOrderStatistics(userId?: string) {
    return this.orderClientService.getOrderStatistics(userId);
  }
}
