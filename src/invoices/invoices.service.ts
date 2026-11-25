import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByIdOrCode(identifier: string) {
    const clean = identifier.trim();
    const numericId = /^\d+$/.test(clean) ? Number(clean) : null;

    const invoice = await this.prisma.invoice.findFirst({
      where: {
        OR: [
          ...(numericId !== null ? [{ id: numericId }] : []),
          { invoiceNo: clean },
          { booking: { bookingCode: clean } },
        ],
      },
      include: { booking: true },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice '${identifier}' not found`);
    }

    return invoice;
  }

  async findAdminAll() {
    return this.prisma.invoice.findMany({
      include: { booking: true },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async generatePdf(identifier: string): Promise<{ filename: string; buffer: Buffer }> {
    const invoice = await this.findByIdOrCode(identifier);

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(22).fillColor('#c2410c').text('SkyVoyage — Booking Summary Invoice');
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#111827');
      doc.text(`Invoice No: ${invoice.invoiceNo}`);
      doc.text(`Booking ID: ${invoice.booking.bookingCode}`);
      doc.text(`Status: ${invoice.status}`);
      doc.text(`Issued At: ${invoice.issuedAt.toISOString().split('T')[0]}`);
      doc.moveDown(1);

      doc.fontSize(13).text('Customer Details', { underline: true });
      doc.fontSize(11);
      doc.text(`Name: ${invoice.customerName}`);
      doc.text(`Email: ${invoice.customerEmail}`);
      doc.text(`Mobile: ${invoice.customerMobile}`);
      if (invoice.booking.passportNo) {
        doc.text(`Passport / NID: ${invoice.booking.passportNo}`);
      }
      doc.moveDown(1);

      doc.fontSize(13).text('Booking Summary', { underline: true });
      doc.fontSize(11);
      doc.text(`Item: ${invoice.itemDescription}`);
      doc.text(`Travel Date: ${invoice.booking.travelDate}`);
      doc.text(`Total (BDT): BDT ${invoice.totalAmount.toLocaleString('en-IN')}`);
      doc.moveDown(1.5);

      doc
        .fontSize(10)
        .fillColor('#6b7280')
        .text(
          'Note: Booking summary only — there is no online payment on this website. All bookings are confirmed directly by phone or WhatsApp.',
        );

      doc.end();
    });

    return {
      filename: `${invoice.invoiceNo}.pdf`,
      buffer,
    };
  }
}
