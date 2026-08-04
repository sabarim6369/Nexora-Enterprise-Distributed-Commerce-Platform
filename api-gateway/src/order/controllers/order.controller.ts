import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { OrderService } from '../services/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() data: any) {
    return this.orderService.createOrder(data);
  }

  @Get()
  async getAllOrders(@Query() filters?: any) {
    return this.orderService.getAllOrders(filters);
  }

  @Get('statistics/summary')
  async getOrderStatistics(@Query('userId') userId?: string) {
    return this.orderService.getOrderStatistics(userId);
  }

  @Get('number/:orderNumber')
  async getOrderByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.orderService.getOrderByOrderNumber(orderNumber);
  }

  @Get('user/:userId')
  async getOrdersByUserId(@Param('userId') userId: string) {
    return this.orderService.getOrdersByUserId(userId);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Put(':id')
  async updateOrder(@Param('id') id: string, @Body() data: any) {
    return this.orderService.updateOrder(id, data);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }

  @Put(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.orderService.updateOrderStatus(id, status);
  }

  @Put(':id/payment-status')
  async updatePaymentStatus(@Param('id') id: string, @Body('paymentStatus') paymentStatus: string) {
    return this.orderService.updatePaymentStatus(id, paymentStatus);
  }
}
