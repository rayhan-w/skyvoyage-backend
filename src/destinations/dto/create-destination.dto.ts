import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateDestinationDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'country is required' })
  country: string;

  @Type(() => Number)
  @IsInt({ message: 'price must be an integer' })
  @Min(0, { message: 'price must be at least 0' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'imageUrl is required' })
  imageUrl: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'sortOrder must be an integer' })
  sortOrder?: number;
}
