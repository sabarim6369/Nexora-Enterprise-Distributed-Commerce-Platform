import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @IsEnum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  @IsOptional()
  status?: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

  @IsEnum(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])
  @IsOptional()
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

  @IsString()
  @IsOptional()
  shippingAddressId?: string;

  @IsNumber()
  @IsOptional()
  shippingCharge?: number;

  @IsNumber()
  @IsOptional()
  tax?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;
}
