import { Injectable } from '@nestjs/common';
import { ProductClientService } from './product-client.service';

@Injectable()
export class ProductService {
  constructor(private readonly productClientService: ProductClientService) {}

  async createProduct(data: any, accessToken?: string) {
    return this.productClientService.createProduct(data, accessToken);
  }

  async getAllProducts(filters?: any) {
    return this.productClientService.getAllProducts(filters);
  }

  async getProductById(id: string) {
    return this.productClientService.getProductById(id);
  }

  async getProductBySlug(slug: string) {
    return this.productClientService.getProductBySlug(slug);
  }

  async updateProduct(id: string, data: any, accessToken?: string) {
    return this.productClientService.updateProduct(id, data, accessToken);
  }

  async deleteProduct(id: string, accessToken?: string) {
    return this.productClientService.deleteProduct(id, accessToken);
  }

  async addProductImage(productId: string, data: any, accessToken?: string) {
    return this.productClientService.addProductImage(productId, data, accessToken);
  }

  async removeProductImage(imageId: string, accessToken?: string) {
    return this.productClientService.removeProductImage(imageId, accessToken);
  }

  async setPrimaryImage(imageId: string, accessToken?: string) {
    return this.productClientService.setPrimaryImage(imageId, accessToken);
  }

  async updateImageOrder(imageId: string, data: any, accessToken?: string) {
    return this.productClientService.updateImageOrder(imageId, data, accessToken);
  }

  async createCategory(data: any, accessToken?: string) {
    return this.productClientService.createCategory(data, accessToken);
  }

  async getAllCategories() {
    return this.productClientService.getAllCategories();
  }

  async getCategoryById(id: string) {
    return this.productClientService.getCategoryById(id);
  }

  async getCategoryBySlug(slug: string) {
    return this.productClientService.getCategoryBySlug(slug);
  }

  async updateCategory(id: string, data: any, accessToken?: string) {
    return this.productClientService.updateCategory(id, data, accessToken);
  }

  async deleteCategory(id: string, accessToken?: string) {
    return this.productClientService.deleteCategory(id, accessToken);
  }
}
