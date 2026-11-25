import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminPackagesController } from './admin-packages.controller.js';
import { PackagesController } from './packages.controller.js';
import { PackagesService } from './packages.service.js';

@Module({
  imports: [AuthModule],
  controllers: [PackagesController, AdminPackagesController],
  providers: [PackagesService],
})
export class PackagesModule {}
