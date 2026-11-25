import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { DestinationsService } from './destinations.service.js';
import { CreateDestinationDto } from './dto/create-destination.dto.js';
import { UpdateDestinationDto } from './dto/update-destination.dto.js';

@Controller('admin/destinations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminDestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  findAll() {
    return this.destinationsService.findAdminAll();
  }

  @Post()
  create(@Body() dto: CreateDestinationDto) {
    return this.destinationsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDestinationDto) {
    return this.destinationsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.destinationsService.remove(id);
  }
}
