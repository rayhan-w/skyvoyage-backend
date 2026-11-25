import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard.js';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(@Body() dto: CreateBookingDto, @CurrentUser() user: AuthUser | null) {
    return this.bookingsService.create(dto, user);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  findMine(@CurrentUser() user: AuthUser) {
    return this.bookingsService.findMine(user);
  }
}
