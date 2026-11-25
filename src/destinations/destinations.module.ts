import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminDestinationsController } from './admin-destinations.controller.js';
import { DestinationsController } from './destinations.controller.js';
import { DestinationsService } from './destinations.service.js';

@Module({
  imports: [AuthModule],
  controllers: [DestinationsController, AdminDestinationsController],
  providers: [DestinationsService],
})
export class DestinationsModule {}
