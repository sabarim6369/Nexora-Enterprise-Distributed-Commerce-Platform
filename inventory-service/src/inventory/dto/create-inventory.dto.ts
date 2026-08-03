import { IsString, IsNumber, IsOptional, IsEnum, Min, IsNotEmpty } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsString()
  @IsNotEmpty()
  warehouseId!: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  availableQuantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  reservedQuantity?: number;

  @IsEnum(['ACTIVE', 'INACTIVE'])
  @IsOptional()
  status?: 'ACTIVE' | 'INACTIVE';
}
