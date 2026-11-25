import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryStatus } from '@prisma/client';
import { MailService } from '../mail/mail.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateQueryDto } from './dto/create-query.dto.js';
import { ReplyQueryDto } from './dto/reply-query.dto.js';

@Injectable()
export class QueriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  private async generateQueryCode(): Promise<string> {
    const count = await this.prisma.query.count();
    const candidate = `Q-${501 + count}`;
    const existing = await this.prisma.query.findUnique({ where: { queryCode: candidate } });
    if (!existing) {
      return candidate;
    }
    return `Q-${Date.now().toString().slice(-5)}`;
  }

  async create(dto: CreateQueryDto, forcedType?: string) {
    const queryCode = await this.generateQueryCode();
    const type = forcedType || dto.type?.trim() || 'General';

    const query = await this.prisma.query.create({
      data: {
        queryCode,
        name: dto.name.trim(),
        mobile: dto.mobile.trim(),
        email: dto.email.trim().toLowerCase(),
        type,
        service: dto.service?.trim() || null,
        message: dto.message.trim(),
        status: QueryStatus.NEW,
      },
    });

    const adminEmail = this.configService.get<string>('ADMIN_EMAIL')?.trim();
    if (adminEmail) {
      await this.mailService.sendMail({
        to: adminEmail,
        subject: `New ${type} Query (${query.queryCode}) from ${query.name}`,
        text: `Name: ${query.name}\nMobile: ${query.mobile}\nEmail: ${query.email}\nType: ${type}\nService: ${query.service ?? '-'}\nMessage: ${query.message}`,
      });
    }

    await this.mailService.sendMail({
      to: query.email,
      subject: `SkyVoyage received your query (${query.queryCode})`,
      text: `Dear ${query.name},\n\nThank you for contacting SkyVoyage. We received your ${type} query (${query.queryCode}) and our team will reply shortly.\n\nRegards,\nSkyVoyage`,
    });

    return query;
  }

  async findAdminAll() {
    return this.prisma.query.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async reply(id: number, dto: ReplyQueryDto) {
    const existing = await this.prisma.query.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Query #${id} not found`);
    }

    const updated = await this.prisma.query.update({
      where: { id },
      data: {
        adminReply: dto.reply.trim(),
        status: dto.status ?? QueryStatus.REPLIED,
        repliedAt: new Date(),
      },
    });

    await this.mailService.sendMail({
      to: updated.email,
      subject: `Reply to your SkyVoyage query (${updated.queryCode})`,
      text: `Dear ${updated.name},\n\n${updated.adminReply}\n\nRegards,\nSkyVoyage`,
    });

    return updated;
  }
}
