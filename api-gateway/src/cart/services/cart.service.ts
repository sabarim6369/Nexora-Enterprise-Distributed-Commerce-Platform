import { Injectable } from '@nestjs/common';
import { CartClientService } from './cart-client.service';

@Injectable()
export class CartService {
  constructor(private readonly cartClientService: CartClientService) {}

  async getCart(userId?: string) {
    return this.cartClientService.getCart(userId);
  }

  async getCartSummary(userId?: string) {
    return this.cartClientService.getCartSummary(userId);
  }

  async addItem(data: any, userId?: string) {
    return this.cartClientService.addItem(data, userId);
  }

  async updateItem(productId: string, data: any, userId?: string) {
    return this.cartClientService.updateItem(productId, data, userId);
  }

  async removeItem(productId: string, userId?: string) {
    return this.cartClientService.removeItem(productId, userId);
  }

  async clearCart(userId?: string) {
    return this.cartClientService.clearCart(userId);
  }
}
