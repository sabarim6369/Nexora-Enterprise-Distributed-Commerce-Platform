import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req) {
    const userId = req.user?.userId || req.user?.sub || 'default-user';
    return this.cartService.getCart(userId);
  }

  @Get('summary')
  async getCartSummary(@Request() req) {
    const userId = req.user?.userId || req.user?.sub || 'default-user';
    return this.cartService.getCartSummary(userId);
  }

  @Post('items')
  async addItem(@Request() req, @Body() addItemDto: AddItemDto) {
    const userId = req.user?.userId || req.user?.sub || 'default-user';
    return this.cartService.addItem(userId, addItemDto);
  }

  @Patch('items/:productId')
  async updateItem(
    @Param('productId') productId: string,
    @Request() req,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    const userId = req.user?.userId || req.user?.sub || 'default-user';
    return this.cartService.updateItem(userId, productId, updateItemDto);
  }

  @Delete('items/:productId')
  async removeItem(@Param('productId') productId: string, @Request() req) {
    const userId = req.user?.userId || req.user?.sub || 'default-user';
    return this.cartService.removeItem(userId, productId);
  }

  @Delete()
  async clearCart(@Request() req) {
    const userId = req.user?.userId || req.user?.sub || 'default-user';
    return this.cartService.clearCart(userId);
  }
}
