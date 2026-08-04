import { Controller, Get, Post, Patch, Delete, Body, Param, Headers } from '@nestjs/common';
import { CartService } from '../services/cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Headers('x-user-id') userId?: string) {
    return this.cartService.getCart(userId);
  }

  @Get('summary')
  async getCartSummary(@Headers('x-user-id') userId?: string) {
    return this.cartService.getCartSummary(userId);
  }

  @Post('items')
  async addItem(@Body() data: any, @Headers('x-user-id') userId?: string) {
    return this.cartService.addItem(data, userId);
  }

  @Patch('items/:productId')
  async updateItem(
    @Param('productId') productId: string,
    @Body() data: any,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.cartService.updateItem(productId, data, userId);
  }

  @Delete('items/:productId')
  async removeItem(@Param('productId') productId: string, @Headers('x-user-id') userId?: string) {
    return this.cartService.removeItem(productId, userId);
  }

  @Delete()
  async clearCart(@Headers('x-user-id') userId?: string) {
    return this.cartService.clearCart(userId);
  }
}
