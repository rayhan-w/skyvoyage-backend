import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingItemType, BookingStatus } from '@prisma/client';
import { type AuthUser } from '../auth/decorators/current-user.decorator.js';
import { MailService } from '../mail/mail.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  private async generateBookingCode(): Promise<string> {
    const count = await this.prisma.booking.count();
    const num = 1001 + count;
    const candidate = `SV-${num}`;
    const existing = await this.prisma.booking.findUnique({ where: { bookingCode: candidate } });
    if (!existing) {
      return candidate;
    }
    return `SV-${Date.now().toString().slice(-6)}`;
  }

  async create(dto: CreateBookingDto, user: AuthUser | null) {
    const bookingCode = await this.generateBookingCode();
    const invoiceNo = `INV-${bookingCode}`;

    const result = await this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          bookingCode,
          userId: user?.id ?? null,
          customerName: dto.customerName.trim(),
          customerMobile: dto.customerMobile.trim(),
          customerEmail: dto.customerEmail.trim().toLowerCase(),
          passportNo: dto.passportNo?.trim() || null,
          itemTitle: dto.itemTitle.trim(),
          itemType: dto.itemType ?? BookingItemType.PACKAGE,
          packageId: dto.packageId ?? null,
          flightId: dto.flightId ?? null,
          travelDate: dto.travelDate.trim(),
          note: dto.note?.trim() || null,
          totalAmount: dto.totalAmount,
          status: BookingStatus.REQUESTED,
        },
      });

      const invoice = await tx.invoice.create({
        data: {
          invoiceNo,
          bookingId: booking.id,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          customerMobile: booking.customerMobile,
          itemDescription: booking.itemTitle,
          totalAmount: booking.totalAmount,
          status: BookingStatus.REQUESTED,
        },
      });

      return { booking, invoice };
    });

    await this.mailService.sendMail({
      to: result.booking.customerEmail,
      subject: `SkyVoyage Booking Request Received (${result.booking.bookingCode})`,
      text: `Dear ${result.booking.customerName},\n\nWe received your booking request ${result.booking.bookingCode} for ${result.booking.itemTitle} (${result.booking.travelDate}).\nEstimated Total: BDT ${result.booking.totalAmount}\n\nNote: There is no online payment. Our team will confirm your booking by phone or WhatsApp.\n\nRegards,\nSkyVoyage`,
    });

    return result;
  }

  async findMine(user: AuthUser) {
    return this.prisma.booking.findMany({
      where: {
        OR: [{ userId: user.id }, { customerEmail: user.email.toLowerCase() }],
      },
      include: { invoice: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAdminAll() {
    return this.prisma.booking.findMany({
      include: { invoice: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, status: BookingStatus) {
    const existing = await this.prisma.booking.findUnique({
      where: { id },
      include: { invoice: true },
    });
    if (!existing) {
      throw new NotFoundException(`Booking #${id} not found`);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id },
        data: { status },
      });

      const invoice = existing.invoice
        ? await tx.invoice.update({
            where: { bookingId: id },
            data: { status },
          })
        : null;

      return { booking, invoice };
    });

    if (status === BookingStatus.CONFIRMED) {
      await this.mailService.sendMail({
        to: updated.booking.customerEmail,
        subject: `SkyVoyage Booking Confirmed (${updated.booking.bookingCode})`,
        text: `Dear ${updated.booking.customerName},\n\nYour booking ${updated.booking.bookingCode} for ${updated.booking.itemTitle} is now CONFIRMED.\nInvoice No: ${updated.invoice?.invoiceNo ?? 'N/A'}\nTotal: BDT ${updated.booking.totalAmount}\n\nRegards,\nSkyVoyage`,
      });
    }

    return updated;
  }
}
