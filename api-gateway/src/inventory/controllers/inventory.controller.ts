import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';

@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async createWarehouse(@Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.createWarehouse(data, token);
  }

  @Get()
  async getAllWarehouses() {
    return this.inventoryService.getAllWarehouses();
  }

  @Get('code/:code')
  async getWarehouseByCode(@Param('code') code: string) {
    return this.inventoryService.getWarehouseByCode(code);
  }

  @Get(':id')
  async getWarehouseById(@Param('id') id: string) {
    return this.inventoryService.getWarehouseById(id);
  }

  @Put(':id')
  async updateWarehouse(@Param('id') id: string, @Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.updateWarehouse(id, data, token);
  }

  @Delete(':id')
  async deleteWarehouse(@Param('id') id: string, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.deleteWarehouse(id, token);
  }
}

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async createInventory(@Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.createInventory(data, token);
  }

  @Get()
  async getAllInventory(@Query() filters?: any) {
    return this.inventoryService.getAllInventory(filters);
  }

  @Get('product/:productId/warehouse/:warehouseId')
  async getInventoryByProductAndWarehouse(
    @Param('productId') productId: string,
    @Param('warehouseId') warehouseId: string,
  ) {
    return this.inventoryService.getInventoryByProductAndWarehouse(productId, warehouseId);
  }

  @Get('summary/:productId')
  async getStockSummary(@Param('productId') productId: string) {
    return this.inventoryService.getStockSummary(productId);
  }

  @Get('movements/:inventoryId')
  async getMovements(@Param('inventoryId') inventoryId: string) {
    return this.inventoryService.getMovements(inventoryId);
  }

  @Get(':id')
  async getInventoryById(@Param('id') id: string) {
    return this.inventoryService.getInventoryById(id);
  }

  @Put(':id')
  async updateInventory(@Param('id') id: string, @Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.updateInventory(id, data, token);
  }

  @Delete(':id')
  async deleteInventory(@Param('id') id: string, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.deleteInventory(id, token);
  }

  @Post('movements')
  async createMovement(@Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.createMovement(data, token);
  }
}
