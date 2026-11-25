import { PackageType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePackageDto {
  @IsEnum(PackageType, { message: 'type must be READY or UPCOMING' })
  type: PackageType;

  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsOptional()
  @IsString()
  badge?: string | null;

  @IsString()
  @IsNotEmpty({ message: 'days is required' })
  days: string;

  @IsString()
  @IsNotEmpty({ message: 'persons is required' })
  persons: string;

  @IsString()
  @IsNotEmpty({ message: 'place is required' })
  place: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'rating must be a number' })
  @Min(0, { message: 'rating must be at least 0' })
  @Max(5, { message: 'rating must be at most 5' })
  rating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'reviews must be an integer' })
  @Min(0, { message: 'reviews must be at least 0' })
  reviews?: number;

  @Type(() => Number)
  @IsInt({ message: 'price must be an integer' })
  @Min(0, { message: 'price must be at least 0' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'imageUrl is required' })
  imageUrl: string;

  @IsOptional()
  @IsString()
  startDate?: string | null;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'sortOrder must be an integer' })
  sortOrder?: number;
}
