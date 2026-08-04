import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../../authentication/guards/roles.guard';
import { Roles } from '../../authentication/decorators/roles.decorator';
import { Public } from '../../authentication/decorators/public.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createProduct(@Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.createProduct(data, token);
  }

  @Public()
  @Get()
  async getAllProducts(@Query() filters?: any) {
    return this.productService.getAllProducts(filters);
  }

  @Public()
  @Get('slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productService.getProductBySlug(slug);
  }

  @Public()
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateProduct(@Param('id') id: string, @Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.updateProduct(id, data, token);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteProduct(@Param('id') id: string, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.deleteProduct(id, token);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async addProductImage(@Param('id') id: string, @Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.addProductImage(id, data, token);
  }

  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removeProductImage(@Param('imageId') imageId: string, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.removeProductImage(imageId, token);
  }

  @Put('images/:imageId/primary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async setPrimaryImage(@Param('imageId') imageId: string, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.setPrimaryImage(imageId, token);
  }

  @Put('images/:imageId/order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateImageOrder(@Param('imageId') imageId: string, @Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.updateImageOrder(imageId, data, token);
  }
}

@Controller('categories')
export class CategoryController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createCategory(@Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.createCategory(data, token);
  }

  @Public()
  @Get()
  async getAllCategories() {
    return this.productService.getAllCategories();
  }

  @Public()
  @Get('slug/:slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.productService.getCategoryBySlug(slug);
  }

  @Public()
  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.productService.getCategoryById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateCategory(@Param('id') id: string, @Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.updateCategory(id, data, token);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteCategory(@Param('id') id: string, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.deleteCategory(id, token);
  }
}
