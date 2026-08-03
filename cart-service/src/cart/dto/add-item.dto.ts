import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class AddItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unitPrice!: number;
}
