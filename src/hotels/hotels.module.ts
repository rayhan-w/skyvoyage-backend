import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminHotelsController } from './admin-hotels.controller.js';
import { HotelsController } from './hotels.controller.js';
import { HotelsService } from './hotels.service.js';

@Module({
  imports: [AuthModule],
  controllers: [HotelsController, AdminHotelsController],
  providers: [HotelsService],
})
export class HotelsModule {}
