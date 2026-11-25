import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminFlightsController } from './admin-flights.controller.js';
import { FlightsController } from './flights.controller.js';
import { FlightsService } from './flights.service.js';

@Module({
  imports: [AuthModule],
  controllers: [FlightsController, AdminFlightsController],
  providers: [FlightsService],
})
export class FlightsModule {}
