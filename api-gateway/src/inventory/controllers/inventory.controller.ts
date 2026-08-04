import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, UseGuards } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../../authentication/guards/roles.guard';
import { Roles } from '../../authentication/decorators/roles.decorator';
import { Public } from '../../authentication/decorators/public.decorator';

@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createWarehouse(@Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.createWarehouse(data, token);
  }

  @Public()
  @Get()
  async getAllWarehouses() {
    return this.inventoryService.getAllWarehouses();
  }

  @Public()
  @Get('code/:code')
  async getWarehouseByCode(@Param('code') code: string) {
    return this.inventoryService.getWarehouseByCode(code);
  }

  @Public()
  @Get(':id')
  async getWarehouseById(@Param('id') id: string) {
    return this.inventoryService.getWarehouseById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateWarehouse(@Param('id') id: string, @Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.updateWarehouse(id, data, token);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteWarehouse(@Param('id') id: string, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.deleteWarehouse(id, token);
  }
}

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createInventory(@Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.createInventory(data, token);
  }

  @Public()
  @Get()
  async getAllInventory(@Query() filters?: any) {
    return this.inventoryService.getAllInventory(filters);
  }

  @Public()
  @Get('product/:productId/warehouse/:warehouseId')
  async getInventoryByProductAndWarehouse(
    @Param('productId') productId: string,
    @Param('warehouseId') warehouseId: string,
  ) {
    return this.inventoryService.getInventoryByProductAndWarehouse(productId, warehouseId);
  }

  @Public()
  @Get('summary/:productId')
  async getStockSummary(@Param('productId') productId: string) {
    return this.inventoryService.getStockSummary(productId);
  }

  @Public()
  @Get('movements/:inventoryId')
  async getMovements(@Param('inventoryId') inventoryId: string) {
    return this.inventoryService.getMovements(inventoryId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateInventory(@Param('id') id: string, @Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.updateInventory(id, data, token);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteInventory(@Param('id') id: string, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.deleteInventory(id, token);
  }

  @Post('movements')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createMovement(@Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.inventoryService.createMovement(data, token);
  }
}
