import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateDestinationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'name cannot be empty' })
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'country cannot be empty' })
  country?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'price must be an integer' })
  @Min(0, { message: 'price must be at least 0' })
  price?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'imageUrl cannot be empty' })
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'sortOrder must be an integer' })
  sortOrder?: number;
}
