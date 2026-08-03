import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreateMovementDto } from './dto/create-movement.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInventoryDto: CreateInventoryDto) {
    const { productId, warehouseId, ...inventoryData } = createInventoryDto;

    // Check if warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    // Check if inventory already exists for this product in this warehouse
    const existingInventory = await this.prisma.inventory.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
    });

    if (existingInventory) {
      throw new BadRequestException('Inventory already exists for this product in this warehouse');
    }

    return this.prisma.inventory.create({
      data: {
        ...inventoryData,
        productId,
        warehouseId,
      },
      include: {
        warehouse: true,
        movements: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findAll(filters?: {
    productId?: string;
    warehouseId?: string;
    status?: string;
  }) {
    const { productId, warehouseId, status } = filters || {};

    const where: any = {};

    if (productId) {
      where.productId = productId;
    }

    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.inventory.findMany({
      where,
      include: {
        warehouse: true,
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: {
        warehouse: true,
        movements: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return inventory;
  }

  async findByProductAndWarehouse(productId: string, warehouseId: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
      include: {
        warehouse: true,
        movements: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return inventory;
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return this.prisma.inventory.update({
      where: { id },
      data: updateInventoryDto,
      include: {
        warehouse: true,
        movements: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async remove(id: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    await this.prisma.inventory.delete({
      where: { id },
    });

    return { message: 'Inventory deleted successfully' };
  }

  async createMovement(createMovementDto: CreateMovementDto) {
    const { inventoryId, type, quantity, referenceId, remarks } = createMovementDto;

    const inventory = await this.prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    // Validate movement based on type
    if (type === 'STOCK_OUT' && inventory.availableQuantity < quantity) {
      throw new BadRequestException('Insufficient available quantity for stock out');
    }

    if (type === 'RESERVED' && inventory.availableQuantity < quantity) {
      throw new BadRequestException('Insufficient available quantity for reservation');
    }

    if (type === 'RELEASED' && inventory.reservedQuantity < quantity) {
      throw new BadRequestException('Insufficient reserved quantity for release');
    }

    // Create movement and update inventory in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create movement record
      const movement = await tx.inventoryMovement.create({
        data: {
          inventoryId,
          type,
          quantity,
          referenceId,
          remarks,
        },
      });

      // Update inventory quantities based on movement type
      const updateData: any = {};

      switch (type) {
        case 'STOCK_IN':
          updateData.availableQuantity = {
            increment: quantity,
          };
          break;
        case 'STOCK_OUT':
          updateData.availableQuantity = {
            decrement: quantity,
          };
          break;
        case 'RESERVED':
          updateData.availableQuantity = {
            decrement: quantity,
          };
          updateData.reservedQuantity = {
            increment: quantity,
          };
          break;
        case 'RELEASED':
          updateData.reservedQuantity = {
            decrement: quantity,
          };
          break;
        case 'ADJUSTMENT':
          // For adjustments, we directly set the quantity
          updateData.availableQuantity = quantity;
          break;
      }

      await tx.inventory.update({
        where: { id: inventoryId },
        data: updateData,
      });

      return movement;
    });

    return this.prisma.inventoryMovement.findUnique({
      where: { id: result.id },
      include: {
        inventory: {
          include: {
            warehouse: true,
          },
        },
      },
    });
  }

  async getMovements(inventoryId?: string) {
    const where = inventoryId ? { inventoryId } : {};

    return this.prisma.inventoryMovement.findMany({
      where,
      include: {
        inventory: {
          include: {
            warehouse: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStockSummary(productId: string) {
    const inventories = await this.prisma.inventory.findMany({
      where: { productId },
      include: {
        warehouse: true,
      },
    });

    const totalAvailable = inventories.reduce(
      (sum, inv) => sum + inv.availableQuantity,
      0,
    );
    const totalReserved = inventories.reduce(
      (sum, inv) => sum + inv.reservedQuantity,
      0,
    );

    return {
      productId,
      totalAvailable,
      totalReserved,
      totalPhysical: totalAvailable + totalReserved,
      warehouses: inventories.map((inv) => ({
        warehouseId: inv.warehouseId,
        warehouseName: inv.warehouse.name,
        warehouseCode: inv.warehouse.code,
        availableQuantity: inv.availableQuantity,
        reservedQuantity: inv.reservedQuantity,
        status: inv.status,
      })),
    };
  }
}
