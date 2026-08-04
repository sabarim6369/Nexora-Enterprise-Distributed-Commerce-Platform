import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductController, CategoryController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductClientService } from './services/product-client.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [ConfigModule, CommonModule],
  controllers: [ProductController, CategoryController],
  providers: [ProductService, ProductClientService],
  exports: [ProductService],
})
export class ProductModule {}
