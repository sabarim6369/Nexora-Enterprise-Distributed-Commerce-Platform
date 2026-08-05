import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddImageDto } from './dto/add-image.dto';
import { ProductStatus } from '@prisma/client';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId, slug, sku, ...productData } = createProductDto;

    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if slug already exists
    const existingSlug = await this.prisma.product.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new BadRequestException('Product with this slug already exists');
    }

    // Check if SKU already exists
    const existingSku = await this.prisma.product.findUnique({
      where: { sku },
    });

    if (existingSku) {
      throw new BadRequestException('Product with this SKU already exists');
    }

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        categoryId,
        slug,
        sku,
      },
      include: {
        category: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    // Invalidate products list cache
    await this.cacheService.delPattern('products:list:*');

    return product;
  }

  async findAll(filters?: {
    categoryId?: string;
    status?: ProductStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { categoryId, status, search, page = 1, limit = 10 } = filters || {};

    const cacheKey = this.cacheService.generateProductsListKey({ categoryId, status, search, page, limit });
    
    // Try to get from cache first
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { displayOrder: 'asc' },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    const result = {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache the result for 30 minutes
    await this.cacheService.set(cacheKey, result, 1800);

    return result;
  }

  async findOne(id: string) {
    const cacheKey = this.cacheService.generateProductKey(id);
    
    // Try to get from cache first
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Cache the product for 1 hour
    await this.cacheService.set(cacheKey, product, 3600);

    return product;
  }

  async findBySlug(slug: string) {
    const cacheKey = `product:slug:${slug}`;
    
    // Try to get from cache first
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Cache the product for 1 hour
    await this.cacheService.set(cacheKey, product, 3600);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { categoryId, slug, sku, ...productData } = updateProductDto;

    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    if (slug && slug !== product.slug) {
      const existingSlug = await this.prisma.product.findUnique({
        where: { slug },
      });

      if (existingSlug) {
        throw new BadRequestException('Product with this slug already exists');
      }
    }

    if (sku && sku !== product.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku },
      });

      if (existingSku) {
        throw new BadRequestException('Product with this SKU already exists');
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        categoryId,
        slug,
        sku,
      },
      include: {
        category: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    // Invalidate cache for this product
    await this.cacheService.del(this.cacheService.generateProductKey(id));
    await this.cacheService.del(`product:slug:${product.slug}`);
    if (slug && slug !== product.slug) {
      await this.cacheService.del(`product:slug:${slug}`);
    }
    
    // Invalidate products list cache
    await this.cacheService.delPattern('products:list:*');

    return updatedProduct;
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    // Invalidate cache for this product
    await this.cacheService.del(this.cacheService.generateProductKey(id));
    await this.cacheService.del(`product:slug:${product.slug}`);
    
    // Invalidate products list cache
    await this.cacheService.delPattern('products:list:*');

    return { message: 'Product deleted successfully' };
  }

  async addImage(productId: string, addImageDto: AddImageDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { isPrimary, displayOrder, imageUrl } = addImageDto;

    if (isPrimary) {
      // Set all other images to non-primary
      await this.prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    const image = await this.prisma.productImage.create({
      data: {
        productId,
        imageUrl,
        isPrimary: isPrimary || false,
        displayOrder: displayOrder || 0,
      },
    });

    // Invalidate cache for this product
    await this.cacheService.del(this.cacheService.generateProductKey(productId));
    await this.cacheService.del(`product:slug:${product.slug}`);

    return image;
  }

  async removeImage(imageId: string) {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    await this.prisma.productImage.delete({
      where: { id: imageId },
    });

    // Invalidate cache for this product
    await this.cacheService.del(this.cacheService.generateProductKey(image.productId));

    return { message: 'Image removed successfully' };
  }

  async setPrimaryImage(imageId: string) {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    // Set all other images to non-primary
    await this.prisma.productImage.updateMany({
      where: { productId: image.productId },
      data: { isPrimary: false },
    });

    // Set this image as primary
    await this.prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });

    // Invalidate cache for this product
    await this.cacheService.del(this.cacheService.generateProductKey(image.productId));

    return this.prisma.productImage.findUnique({
      where: { id: imageId },
    });
  }

  async updateImageOrder(imageId: string, displayOrder: number) {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const updatedImage = await this.prisma.productImage.update({
      where: { id: imageId },
      data: { displayOrder },
    });

    // Invalidate cache for this product
    await this.cacheService.del(this.cacheService.generateProductKey(image.productId));

    return updatedImage;
  }
}
