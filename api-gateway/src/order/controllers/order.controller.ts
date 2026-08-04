import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../authentication/guards/roles.guard';
import { Roles } from '../../authentication/decorators/roles.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createOrder(@Body() data: any) {
    return this.orderService.createOrder(data);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllOrders(@Query() filters?: any) {
    return this.orderService.getAllOrders(filters);
  }

  @UseGuards(AuthGuard)
  @Get('statistics/summary')
  async getOrderStatistics(@Query('userId') userId?: string) {
    return this.orderService.getOrderStatistics(userId);
  }

  @UseGuards(AuthGuard)
  @Get('number/:orderNumber')
  async getOrderByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.orderService.getOrderByOrderNumber(orderNumber);
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async getOrdersByUserId(@Param('userId') userId: string) {
    return this.orderService.getOrdersByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Put(':id')
  async updateOrder(@Param('id') id: string, @Body() data: any) {
    return this.orderService.updateOrder(id, data);
  }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Put(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.orderService.updateOrderStatus(id, status);
  }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Put(':id/payment-status')
  async updatePaymentStatus(@Param('id') id: string, @Body('paymentStatus') paymentStatus: string) {
    return this.orderService.updatePaymentStatus(id, paymentStatus);
  }
}
