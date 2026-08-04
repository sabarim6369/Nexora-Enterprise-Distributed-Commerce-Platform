import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
  }

  async create(createOrderDto: CreateOrderDto) {
    const { userId, shippingAddressId, items, shippingCharge = 0, tax = 0, discount = 0 } = createOrderDto;

    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalAmount = subtotal + Number(shippingCharge) + Number(tax) - Number(discount);

    // Create order with items in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      let orderNumber: string;
      let attempts = 0;
      const maxAttempts = 10;

      // Generate unique order number
      do {
        orderNumber = this.generateOrderNumber();
        const existing = await tx.order.findUnique({
          where: { orderNumber },
        });
        if (!existing) break;
        attempts++;
      } while (attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        throw new BadRequestException('Failed to generate unique order number');
      }

      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          shippingAddressId,
          totalItems,
          subtotal,
          shippingCharge: Number(shippingCharge),
          tax: Number(tax),
          discount: Number(discount),
          totalAmount,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              productSku: item.productSku,
              quantity: item.quantity,
              unitPrice: Number(item.unitPrice),
              totalPrice: item.quantity * Number(item.unitPrice),
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });

    return this.prisma.order.findUnique({
      where: { id: result.id },
      include: {
        items: true,
      },
    });
  }

  async findAll(filters?: {
    userId?: string;
    status?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }) {
    const { userId, status, paymentStatus, page = 1, limit = 10 } = filters || {};

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findByUserId(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const { shippingCharge, tax, discount, ...updateData } = updateOrderDto;

    // Recalculate total if shipping, tax, or discount changed
    let data: any = { ...updateData };

    if (shippingCharge !== undefined || tax !== undefined || discount !== undefined) {
      const newShippingCharge = shippingCharge !== undefined ? shippingCharge : Number(order.shippingCharge);
      const newTax = tax !== undefined ? tax : Number(order.tax);
      const newDiscount = discount !== undefined ? discount : Number(order.discount);
      
      data.totalAmount = Number(order.subtotal) + newShippingCharge + newTax - newDiscount;
      data.shippingCharge = newShippingCharge;
      data.tax = newTax;
      data.discount = newDiscount;
    }

    return this.prisma.order.update({
      where: { id },
      data,
      include: {
        items: true,
      },
    });
  }

  async remove(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.prisma.order.delete({
      where: { id },
    });

    return { message: 'Order deleted successfully' };
  }

  async updateStatus(id: string, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid order status');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: {
        items: true,
      },
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const validPaymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      throw new BadRequestException('Invalid payment status');
    }

    return this.prisma.order.update({
      where: { id },
      data: { paymentStatus: paymentStatus as any },
      include: {
        items: true,
      },
    });
  }

  async getOrderStatistics(userId?: string) {
    const where = userId ? { userId } : {};

    const [totalOrders, pendingOrders, confirmedOrders, deliveredOrders, cancelledOrders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.count({ where: { ...where, status: 'PENDING' } }),
      this.prisma.order.count({ where: { ...where, status: 'CONFIRMED' } }),
      this.prisma.order.count({ where: { ...where, status: 'DELIVERED' } }),
      this.prisma.order.count({ where: { ...where, status: 'CANCELLED' } }),
    ]);

    const totalRevenue = await this.prisma.order.aggregate({
      where: { ...where, paymentStatus: 'PAID' },
      _sum: {
        totalAmount: true,
      },
    });

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: Number(totalRevenue._sum.totalAmount) || 0,
    };
  }
}
