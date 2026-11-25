import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { BookingsModule } from './bookings/bookings.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { DestinationsModule } from './destinations/destinations.module.js';
import { FlightsModule } from './flights/flights.module.js';
import { HealthModule } from './health/health.module.js';
import { HotelsModule } from './hotels/hotels.module.js';
import { InvoicesModule } from './invoices/invoices.module.js';
import { MailModule } from './mail/mail.module.js';
import { PackagesModule } from './packages/packages.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { QueriesModule } from './queries/queries.module.js';
import { SettingsModule } from './settings/settings.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MailModule,
    HealthModule,
    AuthModule,
    PackagesModule,
    FlightsModule,
    HotelsModule,
    DestinationsModule,
    BookingsModule,
    InvoicesModule,
    QueriesModule,
    SettingsModule,
    DashboardModule,
  ],
})
export class AppModule {}
