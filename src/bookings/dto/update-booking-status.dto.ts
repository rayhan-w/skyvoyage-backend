import { BookingStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus, { message: 'status must be REQUESTED, CONFIRMED, or CANCELLED' })
  status: BookingStatus;
}
