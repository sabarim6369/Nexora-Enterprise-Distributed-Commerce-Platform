import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        identity: this.configService.get('IDENTITY_SERVICE_URL'),
        cart: this.configService.get('CART_SERVICE_URL'),
        product: this.configService.get('PRODUCT_SERVICE_URL'),
        order: this.configService.get('ORDER_SERVICE_URL'),
        inventory: this.configService.get('INVENTORY_SERVICE_URL'),
        payment: this.configService.get('PAYMENT_SERVICE_URL'),
        notification: this.configService.get('NOTIFICATION_SERVICE_URL'),
      },
    };
  }
}
