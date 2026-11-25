import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminDashboardController } from './admin-dashboard.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [AdminDashboardController],
})
export class DashboardModule {}
