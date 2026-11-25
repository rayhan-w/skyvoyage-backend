import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module.js';
import { FlightsModule } from './flights/flights.module.js';
import { HealthModule } from './health/health.module.js';
import { HotelsModule } from './hotels/hotels.module.js';
import { PackagesModule } from './packages/packages.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    PackagesModule,
    FlightsModule,
    HotelsModule,
  ],
})
export class AppModule {}
