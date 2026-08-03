
import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { ProductStatus } from '@prisma/client';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;
}
