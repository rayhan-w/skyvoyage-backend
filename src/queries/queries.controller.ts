import { Body, Controller, Post } from '@nestjs/common';
import { CreateQueryDto } from './dto/create-query.dto.js';
import { QueriesService } from './queries.service.js';

@Controller()
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) {}

  @Post('queries')
  createQuery(@Body() dto: CreateQueryDto) {
    return this.queriesService.create(dto);
  }

  @Post('packages/custom-request')
  createCustomPackageRequest(@Body() dto: CreateQueryDto) {
    return this.queriesService.create(dto, 'Custom Package');
  }
}
