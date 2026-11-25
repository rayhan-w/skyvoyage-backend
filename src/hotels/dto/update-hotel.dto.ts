import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateHotelDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'name cannot be empty' })
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'city cannot be empty' })
  city?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'stars must be an integer' })
  @Min(1, { message: 'stars must be between 1 and 5' })
  @Max(5, { message: 'stars must be between 1 and 5' })
  stars?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'pricePerNight must be an integer' })
  @Min(0, { message: 'pricePerNight must be at least 0' })
  pricePerNight?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'imageUrl cannot be empty' })
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
