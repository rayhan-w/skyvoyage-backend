import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Package, PackageType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePackageDto } from './dto/create-package.dto.js';
import { UpdatePackageDto } from './dto/update-package.dto.js';

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  private toPublicResponse(pkg: Package) {
    const base = {
      id: pkg.id,
      type: pkg.type,
      name: pkg.name,
      badge: pkg.badge,
      days: pkg.days,
      persons: pkg.persons,
      place: pkg.place,
      rating: pkg.rating,
      reviews: pkg.reviews,
      price: pkg.price,
      img: pkg.imageUrl,
    };

    if (pkg.type === PackageType.UPCOMING || pkg.startDate) {
      return { ...base, date: pkg.startDate };
    }

    return base;
  }

  async findPublicAll(type?: string) {
    let parsedType: PackageType | undefined;
    if (type !== undefined && type !== '') {
      const upper = type.toUpperCase();
      if (upper !== PackageType.READY && upper !== PackageType.UPCOMING) {
        throw new BadRequestException('type must be READY or UPCOMING');
      }
      parsedType = upper as PackageType;
    }

    const items = await this.prisma.package.findMany({
      where: {
        active: true,
        ...(parsedType ? { type: parsedType } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    return items.map((pkg) => this.toPublicResponse(pkg));
  }

  async findPublicOne(id: number) {
    const pkg = await this.prisma.package.findFirst({
      where: { id, active: true },
    });
    if (!pkg) {
      throw new NotFoundException(`Package #${id} not found`);
    }
    return this.toPublicResponse(pkg);
  }

  async findAdminAll() {
    return this.prisma.package.findMany({
      orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  async create(dto: CreatePackageDto) {
    return this.prisma.package.create({
      data: {
        type: dto.type,
        name: dto.name.trim(),
        badge: dto.badge ?? null,
        days: dto.days.trim(),
        persons: dto.persons.trim(),
        place: dto.place.trim(),
        rating: dto.rating ?? 5.0,
        reviews: dto.reviews ?? 0,
        price: dto.price,
        imageUrl: dto.imageUrl.trim(),
        startDate: dto.startDate ?? null,
        active: dto.active ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(id: number, dto: UpdatePackageDto) {
    const existing = await this.prisma.package.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Package #${id} not found`);
    }

    return this.prisma.package.update({
      where: { id },
      data: {
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.badge !== undefined ? { badge: dto.badge } : {}),
        ...(dto.days !== undefined ? { days: dto.days.trim() } : {}),
        ...(dto.persons !== undefined ? { persons: dto.persons.trim() } : {}),
        ...(dto.place !== undefined ? { place: dto.place.trim() } : {}),
        ...(dto.rating !== undefined ? { rating: dto.rating } : {}),
        ...(dto.reviews !== undefined ? { reviews: dto.reviews } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl.trim() } : {}),
        ...(dto.startDate !== undefined ? { startDate: dto.startDate } : {}),
        ...(dto.active !== undefined ? { active: dto.active } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.package.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Package #${id} not found`);
    }
    await this.prisma.package.delete({ where: { id } });
    return { message: `Package #${id} deleted` };
  }
}
