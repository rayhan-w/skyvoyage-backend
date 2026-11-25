import { Injectable, NotFoundException } from '@nestjs/common';
import { Destination } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDestinationDto } from './dto/create-destination.dto.js';
import { UpdateDestinationDto } from './dto/update-destination.dto.js';

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  private toPublicResponse(dest: Destination) {
    return {
      id: dest.id,
      name: dest.name,
      country: dest.country,
      price: dest.price,
      img: dest.imageUrl,
    };
  }

  async findPublicAll() {
    const items = await this.prisma.destination.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
    return items.map((d) => this.toPublicResponse(d));
  }

  async findAdminAll() {
    return this.prisma.destination.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  async create(dto: CreateDestinationDto) {
    return this.prisma.destination.create({
      data: {
        name: dto.name.trim(),
        country: dto.country.trim(),
        price: dto.price,
        imageUrl: dto.imageUrl.trim(),
        active: dto.active ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(id: number, dto: UpdateDestinationDto) {
    const existing = await this.prisma.destination.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Destination #${id} not found`);
    }

    return this.prisma.destination.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.country !== undefined ? { country: dto.country.trim() } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl.trim() } : {}),
        ...(dto.active !== undefined ? { active: dto.active } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.destination.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Destination #${id} not found`);
    }
    await this.prisma.destination.delete({ where: { id } });
    return { message: `Destination #${id} deleted` };
  }
}
