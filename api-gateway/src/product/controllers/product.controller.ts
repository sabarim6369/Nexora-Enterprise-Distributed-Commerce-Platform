import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ProductService } from '../services/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.createProduct(data, token);
  }

  @Get()
  async getAllProducts(@Query() filters?: any) {
    return this.productService.getAllProducts(filters);
  }

  @Get('slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productService.getProductBySlug(slug);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.updateProduct(id, data, token);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.deleteProduct(id, token);
  }

  @Post(':id/images')
  async addProductImage(@Param('id') id: string, @Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.addProductImage(id, data, token);
  }

  @Delete('images/:imageId')
  async removeProductImage(@Param('imageId') imageId: string, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.removeProductImage(imageId, token);
  }

  @Put('images/:imageId/primary')
  async setPrimaryImage(@Param('imageId') imageId: string, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.setPrimaryImage(imageId, token);
  }

  @Put('images/:imageId/order')
  async updateImageOrder(@Param('imageId') imageId: string, @Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.updateImageOrder(imageId, data, token);
  }
}

@Controller('categories')
export class CategoryController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createCategory(@Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.createCategory(data, token);
  }

  @Get()
  async getAllCategories() {
    return this.productService.getAllCategories();
  }

  @Get('slug/:slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.productService.getCategoryBySlug(slug);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.productService.getCategoryById(id);
  }

  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() data: any, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.updateCategory(id, data, token);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string, @Headers('authorization') authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.productService.deleteCategory(id, token);
  }
}
