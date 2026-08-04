import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { CartClientService } from './services/cart-client.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [ConfigModule, CommonModule],
  controllers: [CartController],
  providers: [CartService, CartClientService],
  exports: [CartService],
})
export class CartModule {}
