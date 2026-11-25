import { Controller, Get, Query } from '@nestjs/common';
import { FlightsService } from './flights.service.js';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('date') date?: string,
    @Query('stops') stops?: string,
    @Query('airline') airline?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sort') sort?: string,
  ) {
    return this.flightsService.findPublicAll({
      from,
      to,
      date,
      stops,
      airline,
      maxPrice,
      sort,
    });
  }
}
