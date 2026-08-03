import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  fullName!: string;

  @IsString()
  phone!: string;

  @IsString()
  @MinLength(5)
  addressLine1!: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsString()
  country!: string;

  @IsString()
  @MinLength(3)
  postalCode!: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
