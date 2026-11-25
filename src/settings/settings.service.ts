import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateSettingsDto } from './dto/update-settings.dto.js';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateSettings() {
    const existing = await this.prisma.siteSetting.findUnique({ where: { id: 1 } });
    if (existing) {
      return existing;
    }

    return this.prisma.siteSetting.create({
      data: {
        id: 1,
        officeAddress: 'SkyVoyage, Dhaka, Bangladesh',
        phoneHotline: '+880 1234 567890',
        supportEmail: 'info@skyvoyage.com',
        bookingPhone: '+880 1234 567890',
        whatsappNumber: '+880 1234 567890',
        privacyPolicy: 'Draft privacy policy.',
        termsConditions: 'Draft terms & conditions.',
        refundPolicy: 'Draft refund policy.',
      },
    });
  }

  async getPublicSettings() {
    const s = await this.getOrCreateSettings();
    return {
      officeAddress: s.officeAddress,
      phoneHotline: s.phoneHotline,
      supportEmail: s.supportEmail,
      bookingPhone: s.bookingPhone,
      whatsappNumber: s.whatsappNumber,
    };
  }

  async getLegalPage(slug: string) {
    const s = await this.getOrCreateSettings();
    const map: Record<string, { title: string; content: string }> = {
      privacy: { title: 'Privacy Policy', content: s.privacyPolicy },
      terms: { title: 'Terms & Conditions', content: s.termsConditions },
      refund: { title: 'Refund Policy', content: s.refundPolicy },
    };

    const page = map[slug.toLowerCase()];
    if (!page) {
      throw new NotFoundException(`Legal page '${slug}' not found`);
    }

    return { slug: slug.toLowerCase(), ...page };
  }

  async getAdminSettings() {
    return this.getOrCreateSettings();
  }

  async updateSettings(dto: UpdateSettingsDto) {
    await this.getOrCreateSettings();
    return this.prisma.siteSetting.update({
      where: { id: 1 },
      data: {
        ...(dto.officeAddress !== undefined ? { officeAddress: dto.officeAddress.trim() } : {}),
        ...(dto.phoneHotline !== undefined ? { phoneHotline: dto.phoneHotline.trim() } : {}),
        ...(dto.supportEmail !== undefined ? { supportEmail: dto.supportEmail.trim() } : {}),
        ...(dto.bookingPhone !== undefined ? { bookingPhone: dto.bookingPhone.trim() } : {}),
        ...(dto.whatsappNumber !== undefined ? { whatsappNumber: dto.whatsappNumber.trim() } : {}),
        ...(dto.privacyPolicy !== undefined ? { privacyPolicy: dto.privacyPolicy.trim() } : {}),
        ...(dto.termsConditions !== undefined
          ? { termsConditions: dto.termsConditions.trim() }
          : {}),
        ...(dto.refundPolicy !== undefined ? { refundPolicy: dto.refundPolicy.trim() } : {}),
      },
    });
  }
}
