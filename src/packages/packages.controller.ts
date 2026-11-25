import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { PackagesService } from './packages.service.js';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  findAll(@Query('type') type?: string) {
    return this.packagesService.findPublicAll(type);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.packagesService.findPublicOne(id);
  }
}
