import { Controller, Get, UseGuards } from '@nestjs/common';
import { BookingStatus, QueryStatus, Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminDashboardController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getSummary() {
    const [
      totalBookings,
      pendingQueries,
      totalPackages,
      totalInvoices,
      totalCustomers,
      confirmedSum,
      latestBookings,
    ] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.query.count({ where: { status: QueryStatus.NEW } }),
      this.prisma.package.count({ where: { active: true } }),
      this.prisma.invoice.count(),
      this.prisma.user.count({ where: { role: Role.CUSTOMER } }),
      this.prisma.booking.aggregate({
        where: { status: BookingStatus.CONFIRMED },
        _sum: { totalAmount: true },
      }),
      this.prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { invoice: true },
      }),
    ]);

    return {
      totalBookings,
      pendingQueries,
      totalPackages,
      totalInvoices,
      totalCustomers,
      confirmedTotalAmount: confirmedSum._sum.totalAmount ?? 0,
      latestBookings,
    };
  }
}
