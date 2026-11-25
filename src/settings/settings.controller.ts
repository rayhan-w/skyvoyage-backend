import { Controller, Get, Param } from '@nestjs/common';
import { SettingsService } from './settings.service.js';

@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('settings')
  getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }

  @Get('legal/:slug')
  getLegal(@Param('slug') slug: string) {
    return this.settingsService.getLegalPage(slug);
  }
}
