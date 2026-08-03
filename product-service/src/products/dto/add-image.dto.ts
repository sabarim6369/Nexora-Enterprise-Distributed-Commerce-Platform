import { IsString, IsBoolean, IsNumber, Min, IsNotEmpty,IsOptional} from 'class-validator';

export class AddImageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  displayOrder?: number;
}
