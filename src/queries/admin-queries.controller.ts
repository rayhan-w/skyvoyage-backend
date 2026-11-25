import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ReplyQueryDto } from './dto/reply-query.dto.js';
import { QueriesService } from './queries.service.js';

@Controller('admin/queries')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminQueriesController {
  constructor(private readonly queriesService: QueriesService) {}

  @Get()
  findAll() {
    return this.queriesService.findAdminAll();
  }

  @Post(':id/reply')
  reply(@Param('id', ParseIntPipe) id: number, @Body() dto: ReplyQueryDto) {
    return this.queriesService.reply(id, dto);
  }
}
