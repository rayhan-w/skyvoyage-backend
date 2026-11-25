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

export class CreateFlightDto {
  @IsString()
  @IsNotEmpty({ message: 'airline is required' })
  airline: string;

  @IsString()
  @IsNotEmpty({ message: 'fromCity is required' })
  fromCity: string;

  @IsString()
  @IsNotEmpty({ message: 'toCity is required' })
  toCity: string;

  @IsString()
  @IsNotEmpty({ message: 'departTime is required' })
  departTime: string;

  @IsString()
  @IsNotEmpty({ message: 'arriveTime is required' })
  arriveTime: string;

  @IsString()
  @IsNotEmpty({ message: 'duration is required' })
  duration: string;

  @IsEnum(FlightStops, { message: 'stops must be DIRECT or ONE_STOP' })
  stops: FlightStops;

  @Type(() => Number)
  @IsInt({ message: 'price must be an integer' })
  @Min(0, { message: 'price must be at least 0' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'date is required' })
  date: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
