import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() data: any) {
    return this.paymentService.createPayment(data);
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string) {
    return this.paymentService.getPaymentById(id);
  }

  @Put(':id')
  async updatePayment(@Param('id') id: string, @Body() data: any) {
    return this.paymentService.updatePayment(id, data);
  }

  @Delete(':id')
  async deletePayment(@Param('id') id: string) {
    return this.paymentService.deletePayment(id);
  }

  @Post(':id/process')
  async processPayment(@Param('id') id: string) {
    return this.paymentService.processPayment(id);
  }

  @Post(':id/refund')
  async refundPayment(@Param('id') id: string, @Body() data?: any) {
    return this.paymentService.refundPayment(id, data);
  }

  @Get(':id/status')
  async getPaymentStatus(@Param('id') id: string) {
    return this.paymentService.getPaymentStatus(id);
  }
}
