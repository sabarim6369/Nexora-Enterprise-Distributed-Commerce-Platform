import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    const { code, ...warehouseData } = createWarehouseDto;

    // Check if code already exists
    const existingCode = await this.prisma.warehouse.findUnique({
      where: { code },
    });

    if (existingCode) {
      throw new BadRequestException('Warehouse with this code already exists');
    }

    return this.prisma.warehouse.create({
      data: {
        ...warehouseData,
        code,
      },
      include: {
        inventories: true,
      },
    });
  }

  async findAll() {
    return this.prisma.warehouse.findMany({
      include: {
        inventories: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        inventories: true,
      },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async findByCode(code: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { code },
      include: {
        inventories: true,
      },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
    const { code, ...warehouseData } = updateWarehouseDto;

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    if (code && code !== warehouse.code) {
      const existingCode = await this.prisma.warehouse.findUnique({
        where: { code },
      });

      if (existingCode) {
        throw new BadRequestException('Warehouse with this code already exists');
      }
    }

    return this.prisma.warehouse.update({
      where: { id },
      data: {
        ...warehouseData,
        code,
      },
      include: {
        inventories: true,
      },
    });
  }

  async remove(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    await this.prisma.warehouse.delete({
      where: { id },
    });

    return { message: 'Warehouse deleted successfully' };
  }
}
