import { IsString, IsNumber, IsEnum, Min, IsNotEmpty,IsOptional } from 'class-validator';

export class CreateMovementDto {
  @IsString()
  @IsNotEmpty()
  inventoryId!: string;

  @IsEnum(['STOCK_IN', 'STOCK_OUT', 'RESERVED', 'RELEASED', 'ADJUSTMENT'])
  @IsNotEmpty()
  type!: 'STOCK_IN' | 'STOCK_OUT' | 'RESERVED' | 'RELEASED' | 'ADJUSTMENT';

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity!: number;

  @IsString()
  @IsOptional()
  referenceId?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}
