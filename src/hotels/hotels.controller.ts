import { Controller, Get } from '@nestjs/common';
import { HotelsService } from './hotels.service.js';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get()
  findAll() {
    return this.hotelsService.findPublicAll();
  }
}
