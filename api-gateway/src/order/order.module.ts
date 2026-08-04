import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { OrderClientService } from './services/order-client.service';
import { CommonModule } from '../common/common.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [ConfigModule, CommonModule, AuthenticationModule],
  controllers: [OrderController],
  providers: [OrderService, OrderClientService],
  exports: [OrderService],
})
export class OrderModule {}
