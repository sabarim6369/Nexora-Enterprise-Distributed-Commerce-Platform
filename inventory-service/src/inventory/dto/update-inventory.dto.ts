import { IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export class UpdateInventoryDto {
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
