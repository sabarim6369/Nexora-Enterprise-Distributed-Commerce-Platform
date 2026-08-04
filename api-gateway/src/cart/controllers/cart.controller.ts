import { Controller, Get, Post, Patch, Delete, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../authentication/guards/roles.guard';
import { Roles } from '../../authentication/decorators/roles.decorator';
import { Public } from '../../authentication/decorators/public.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getCart(@Headers('x-user-id') userId?: string) {
    return this.cartService.getCart(userId);
  }

  @UseGuards(AuthGuard)
  @Get('summary')
  async getCartSummary(@Headers('x-user-id') userId?: string) {
    return this.cartService.getCartSummary(userId);
  }

  @UseGuards(AuthGuard)
  @Post('items')
  async addItem(@Body() data: any, @Headers('x-user-id') userId?: string) {
    return this.cartService.addItem(data, userId);
  }

  @UseGuards(AuthGuard)
  @Patch('items/:productId')
  async updateItem(
    @Param('productId') productId: string,
    @Body() data: any,
    @Headers('x-user-id') userId?: string,
  ) {
    return this.cartService.updateItem(productId, data, userId);
  }

  @UseGuards(AuthGuard)
  @Delete('items/:productId')
  async removeItem(@Param('productId') productId: string, @Headers('x-user-id') userId?: string) {
    return this.cartService.removeItem(productId, userId);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async clearCart(@Headers('x-user-id') userId?: string) {
    return this.cartService.clearCart(userId);
  }
}
