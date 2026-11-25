import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminSettingsController } from './admin-settings.controller.js';
import { SettingsController } from './settings.controller.js';
import { SettingsService } from './settings.service.js';

@Module({
  imports: [AuthModule],
  controllers: [SettingsController, AdminSettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
