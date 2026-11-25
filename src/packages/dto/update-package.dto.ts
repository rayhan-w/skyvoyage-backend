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

export class UpdatePackageDto {
  @IsOptional()
  @IsEnum(PackageType, { message: 'type must be READY or UPCOMING' })
  type?: PackageType;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'name cannot be empty' })
  name?: string;

  @IsOptional()
  @IsString()
  badge?: string | null;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'days cannot be empty' })
  days?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'persons cannot be empty' })
  persons?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'place cannot be empty' })
  place?: string;

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
