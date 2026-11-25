import { FlightStops } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateFlightDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'airline cannot be empty' })
  airline?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'fromCity cannot be empty' })
  fromCity?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'toCity cannot be empty' })
  toCity?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'departTime cannot be empty' })
  departTime?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'arriveTime cannot be empty' })
  arriveTime?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'duration cannot be empty' })
  duration?: string;

  @IsOptional()
  @IsEnum(FlightStops, { message: 'stops must be DIRECT or ONE_STOP' })
  stops?: FlightStops;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'price must be an integer' })
  @Min(0, { message: 'price must be at least 0' })
  price?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'date cannot be empty' })
  date?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
