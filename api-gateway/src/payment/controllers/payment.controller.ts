import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../authentication/guards/roles.guard';
import { Roles } from '../../authentication/decorators/roles.decorator';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createPayment(@Body() data: any) {
    return this.paymentService.createPayment(data);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getPaymentById(@Param('id') id: string) {
    return this.paymentService.getPaymentById(id);
  }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Put(':id')
  async updatePayment(@Param('id') id: string, @Body() data: any) {
    return this.paymentService.updatePayment(id, data);
  }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deletePayment(@Param('id') id: string) {
    return this.paymentService.deletePayment(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/process')
  async processPayment(@Param('id') id: string) {
    return this.paymentService.processPayment(id);
  }

  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Post(':id/refund')
  async refundPayment(@Param('id') id: string, @Body() data?: any) {
    return this.paymentService.refundPayment(id, data);
  }

  @UseGuards(AuthGuard)
  @Get(':id/status')
  async getPaymentStatus(@Param('id') id: string) {
    return this.paymentService.getPaymentStatus(id);
  }
}
