import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  async create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehousesService.create(createWarehouseDto);
  }

  @Get()
  async findAll() {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return this.warehousesService.findByCode(code);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateWarehouseDto: UpdateWarehouseDto) {
    return this.warehousesService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.warehousesService.remove(id);
  }
}
