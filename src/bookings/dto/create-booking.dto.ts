import { BookingItemType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty({ message: 'customerName is required' })
  customerName: string;

  @IsString()
  @IsNotEmpty({ message: 'customerMobile is required' })
  customerMobile: string;

  @IsEmail({}, { message: 'Valid customerEmail is required' })
  customerEmail: string;

  @IsOptional()
  @IsString()
  passportNo?: string;

  @IsString()
  @IsNotEmpty({ message: 'itemTitle is required' })
  itemTitle: string;

  @IsOptional()
  @IsEnum(BookingItemType, { message: 'itemType must be FLIGHT, PACKAGE, HOTEL, or CUSTOM' })
  itemType?: BookingItemType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  packageId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  flightId?: number;

  @IsString()
  @IsNotEmpty({ message: 'travelDate is required' })
  travelDate: string;

  @IsOptional()
  @IsString()
  note?: string;

  @Type(() => Number)
  @IsInt({ message: 'totalAmount must be an integer' })
  @Min(0, { message: 'totalAmount must be at least 0' })
  totalAmount: number;
}
