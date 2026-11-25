import { Injectable, NotFoundException } from '@nestjs/common';
import { Hotel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateHotelDto } from './dto/create-hotel.dto.js';
import { UpdateHotelDto } from './dto/update-hotel.dto.js';

@Injectable()
export class HotelsService {
  constructor(private readonly prisma: PrismaService) {}

  private toPublicResponse(hotel: Hotel) {
    return {
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      stars: hotel.stars,
      price: hotel.pricePerNight,
      img: hotel.imageUrl,
    };
  }

  async findPublicAll() {
    const hotels = await this.prisma.hotel.findMany({
      where: { active: true },
      orderBy: { id: 'asc' },
    });
    return hotels.map((hotel) => this.toPublicResponse(hotel));
  }

  async findAdminAll() {
    return this.prisma.hotel.findMany({ orderBy: { id: 'asc' } });
  }

  async create(dto: CreateHotelDto) {
    return this.prisma.hotel.create({
      data: {
        name: dto.name.trim(),
        city: dto.city.trim(),
        stars: dto.stars,
        pricePerNight: dto.pricePerNight,
        imageUrl: dto.imageUrl.trim(),
        active: dto.active ?? true,
      },
    });
  }

  async update(id: number, dto: UpdateHotelDto) {
    const existing = await this.prisma.hotel.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Hotel #${id} not found`);
    }

    return this.prisma.hotel.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.city !== undefined ? { city: dto.city.trim() } : {}),
        ...(dto.stars !== undefined ? { stars: dto.stars } : {}),
        ...(dto.pricePerNight !== undefined ? { pricePerNight: dto.pricePerNight } : {}),
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl.trim() } : {}),
        ...(dto.active !== undefined ? { active: dto.active } : {}),
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.hotel.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Hotel #${id} not found`);
    }
    await this.prisma.hotel.delete({ where: { id } });
    return { message: `Hotel #${id} deleted` };
  }
}
