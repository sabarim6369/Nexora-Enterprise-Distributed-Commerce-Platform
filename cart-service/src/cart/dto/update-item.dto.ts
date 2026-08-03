import { IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateItemDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  unitPrice?: number;
}
