import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseHttpClient } from '../../common/services/base-http-client.service';

@Injectable()
export class ProductClientService {
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly baseHttpClient: BaseHttpClient,
  ) {
    this.baseUrl = this.configService.get<string>('PRODUCT_SERVICE_URL') || 'http://localhost:3003';
  }

  async createProduct(data: any, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.post(`${this.baseUrl}/products`, data, { headers });
  }

  async getAllProducts(filters?: any) {
    return this.baseHttpClient.get(`${this.baseUrl}/products`, { params: filters });
  }

  async getProductById(id: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/products/${id}`);
  }

  async getProductBySlug(slug: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/products/slug/${slug}`);
  }

  async updateProduct(id: string, data: any, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.put(`${this.baseUrl}/products/${id}`, data, { headers });
  }

  async deleteProduct(id: string, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.delete(`${this.baseUrl}/products/${id}`, { headers });
  }

  async addProductImage(productId: string, data: any, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.post(`${this.baseUrl}/products/${productId}/images`, data, { headers });
  }

  async removeProductImage(imageId: string, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.delete(`${this.baseUrl}/products/images/${imageId}`, { headers });
  }

  async setPrimaryImage(imageId: string, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.put(`${this.baseUrl}/products/images/${imageId}/primary`, {}, { headers });
  }

  async updateImageOrder(imageId: string, data: any, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.put(`${this.baseUrl}/products/images/${imageId}/order`, data, { headers });
  }

  // Category methods
  async createCategory(data: any, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.post(`${this.baseUrl}/categories`, data, { headers });
  }

  async getAllCategories() {
    return this.baseHttpClient.get(`${this.baseUrl}/categories`);
  }

  async getCategoryById(id: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/categories/${id}`);
  }

  async getCategoryBySlug(slug: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/categories/slug/${slug}`);
  }

  async updateCategory(id: string, data: any, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.put(`${this.baseUrl}/categories/${id}`, data, { headers });
  }

  async deleteCategory(id: string, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.delete(`${this.baseUrl}/categories/${id}`, { headers });
  }
}
