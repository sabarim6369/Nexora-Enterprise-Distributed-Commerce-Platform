import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseHttpClient } from '../../common/services/base-http-client.service';

@Injectable()
export class InventoryClientService {
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly baseHttpClient: BaseHttpClient,
  ) {
    this.baseUrl = this.configService.get<string>('INVENTORY_SERVICE_URL') || 'http://localhost:3005';
  }

  // Warehouse methods
  async createWarehouse(data: any, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.post(`${this.baseUrl}/warehouses`, data, { headers });
  }

  async getAllWarehouses() {
    return this.baseHttpClient.get(`${this.baseUrl}/warehouses`);
  }

  async getWarehouseById(id: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/warehouses/${id}`);
  }

  async getWarehouseByCode(code: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/warehouses/code/${code}`);
  }

  async updateWarehouse(id: string, data: any, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.put(`${this.baseUrl}/warehouses/${id}`, data, { headers });
  }

  async deleteWarehouse(id: string, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.delete(`${this.baseUrl}/warehouses/${id}`, { headers });
  }

  // Inventory methods
  async createInventory(data: any, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.post(`${this.baseUrl}/inventory`, data, { headers });
  }

  async getAllInventory(filters?: any) {
    return this.baseHttpClient.get(`${this.baseUrl}/inventory`, { params: filters });
  }

  async getInventoryById(id: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/inventory/${id}`);
  }

  async getInventoryByProductAndWarehouse(productId: string, warehouseId: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/inventory/product/${productId}/warehouse/${warehouseId}`);
  }

  async getStockSummary(productId: string) {
    return this.baseHttpClient.get(`${this.baseUrl}/inventory/summary/${productId}`);
  }

  async updateInventory(id: string, data: any, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.put(`${this.baseUrl}/inventory/${id}`, data, { headers });
  }

  async deleteInventory(id: string, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.delete(`${this.baseUrl}/inventory/${id}`, { headers });
  }

  async createMovement(data: any, accessToken?: string) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    return this.baseHttpClient.post(`${this.baseUrl}/inventory/movements`, data, { headers });
  }

  async getMovements(inventoryId?: string) {
    const url = inventoryId ? `${this.baseUrl}/inventory/movements/${inventoryId}` : `${this.baseUrl}/inventory/movements`;
    return this.baseHttpClient.get(url);
  }
}
