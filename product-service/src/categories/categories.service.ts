import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { slug, ...categoryData } = createCategoryDto;

    // Check if slug already exists
    const existingSlug = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      throw new BadRequestException('Category with this slug already exists');
    }

    return this.prisma.category.create({
      data: {
        ...categoryData,
        slug,
      },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        products: {
          where: { status: 'ACTIVE' },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { slug, ...categoryData } = updateCategoryDto;

    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (slug && slug !== category.slug) {
      const existingSlug = await this.prisma.category.findUnique({
        where: { slug },
      });

      if (existingSlug) {
        throw new BadRequestException('Category with this slug already exists');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...categoryData,
        slug,
      },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }
}
