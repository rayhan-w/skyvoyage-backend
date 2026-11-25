import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminInvoicesController } from './admin-invoices.controller.js';
import { InvoicesController } from './invoices.controller.js';
import { InvoicesService } from './invoices.service.js';

@Module({
  imports: [AuthModule],
  controllers: [InvoicesController, AdminInvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
