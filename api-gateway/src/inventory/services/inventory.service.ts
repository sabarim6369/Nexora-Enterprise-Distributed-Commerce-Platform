import { Injectable } from '@nestjs/common';
import { InventoryClientService } from './inventory-client.service';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryClientService: InventoryClientService) {}

  async createWarehouse(data: any, accessToken?: string) {
    return this.inventoryClientService.createWarehouse(data, accessToken);
  }

  async getAllWarehouses() {
    return this.inventoryClientService.getAllWarehouses();
  }

  async getWarehouseById(id: string) {
    return this.inventoryClientService.getWarehouseById(id);
  }

  async getWarehouseByCode(code: string) {
    return this.inventoryClientService.getWarehouseByCode(code);
  }

  async updateWarehouse(id: string, data: any, accessToken?: string) {
    return this.inventoryClientService.updateWarehouse(id, data, accessToken);
  }

  async deleteWarehouse(id: string, accessToken?: string) {
    return this.inventoryClientService.deleteWarehouse(id, accessToken);
  }

  async createInventory(data: any, accessToken?: string) {
    return this.inventoryClientService.createInventory(data, accessToken);
  }

  async getAllInventory(filters?: any) {
    return this.inventoryClientService.getAllInventory(filters);
  }

  async getInventoryById(id: string) {
    return this.inventoryClientService.getInventoryById(id);
  }

  async getInventoryByProductAndWarehouse(productId: string, warehouseId: string) {
    return this.inventoryClientService.getInventoryByProductAndWarehouse(productId, warehouseId);
  }

  async getStockSummary(productId: string) {
    return this.inventoryClientService.getStockSummary(productId);
  }

  async updateInventory(id: string, data: any, accessToken?: string) {
    return this.inventoryClientService.updateInventory(id, data, accessToken);
  }

  async deleteInventory(id: string, accessToken?: string) {
    return this.inventoryClientService.deleteInventory(id, accessToken);
  }

  async createMovement(data: any, accessToken?: string) {
    return this.inventoryClientService.createMovement(data, accessToken);
  }

  async getMovements(inventoryId?: string) {
    return this.inventoryClientService.getMovements(inventoryId);
  }
}
