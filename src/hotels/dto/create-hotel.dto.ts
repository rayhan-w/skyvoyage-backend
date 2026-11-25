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

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'city is required' })
  city: string;

  @Type(() => Number)
  @IsInt({ message: 'stars must be an integer' })
  @Min(1, { message: 'stars must be between 1 and 5' })
  @Max(5, { message: 'stars must be between 1 and 5' })
  stars: number;

  @Type(() => Number)
  @IsInt({ message: 'pricePerNight must be an integer' })
  @Min(0, { message: 'pricePerNight must be at least 0' })
  pricePerNight: number;

  @IsString()
  @IsNotEmpty({ message: 'imageUrl is required' })
  imageUrl: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
