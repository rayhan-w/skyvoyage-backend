import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminQueriesController } from './admin-queries.controller.js';
import { QueriesController } from './queries.controller.js';
import { QueriesService } from './queries.service.js';

@Module({
  imports: [AuthModule],
  controllers: [QueriesController, AdminQueriesController],
  providers: [QueriesService],
})
export class QueriesModule {}
