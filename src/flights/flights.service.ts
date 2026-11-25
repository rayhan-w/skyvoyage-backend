import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Flight, FlightStops, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateFlightDto } from './dto/create-flight.dto.js';
import { UpdateFlightDto } from './dto/update-flight.dto.js';

export interface FlightQueryFilters {
  from?: string;
  to?: string;
  date?: string;
  stops?: string;
  airline?: string;
  maxPrice?: string;
  sort?: string;
}

@Injectable()
export class FlightsService {
  constructor(private readonly prisma: PrismaService) {}

  private toPublicResponse(flight: Flight) {
    return {
      id: flight.id,
      airline: flight.airline,
      from: flight.fromCity,
      to: flight.toCity,
      depart: flight.departTime,
      arrive: flight.arriveTime,
      duration: flight.duration,
      stops: flight.stops,
      price: flight.price,
      date: flight.date,
    };
  }

  async findPublicAll(filters: FlightQueryFilters) {
    const where: Prisma.FlightWhereInput = { active: true };

    if (filters.from?.trim()) {
      where.fromCity = { contains: filters.from.trim(), mode: 'insensitive' };
    }
    if (filters.to?.trim()) {
      where.toCity = { contains: filters.to.trim(), mode: 'insensitive' };
    }
    if (filters.date?.trim()) {
      where.date = { contains: filters.date.trim(), mode: 'insensitive' };
    }
    if (filters.airline?.trim()) {
      where.airline = { contains: filters.airline.trim(), mode: 'insensitive' };
    }
    if (filters.stops?.trim()) {
      const upper = filters.stops.trim().toUpperCase();
      if (upper !== FlightStops.DIRECT && upper !== FlightStops.ONE_STOP) {
        throw new BadRequestException('stops must be DIRECT or ONE_STOP');
      }
      where.stops = upper as FlightStops;
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      const parsedMax = Number(filters.maxPrice);
      if (Number.isNaN(parsedMax) || parsedMax < 0) {
        throw new BadRequestException('maxPrice must be a non-negative number');
      }
      where.price = { lte: Math.floor(parsedMax) };
    }

    let orderBy: Prisma.FlightOrderByWithRelationInput = { id: 'asc' };
    if (filters.sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (filters.sort === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    const flights = await this.prisma.flight.findMany({ where, orderBy });
    return flights.map((flight) => this.toPublicResponse(flight));
  }

  async findAdminAll() {
    return this.prisma.flight.findMany({ orderBy: { id: 'asc' } });
  }

  async create(dto: CreateFlightDto) {
    return this.prisma.flight.create({
      data: {
        airline: dto.airline.trim(),
        fromCity: dto.fromCity.trim(),
        toCity: dto.toCity.trim(),
        departTime: dto.departTime.trim(),
        arriveTime: dto.arriveTime.trim(),
        duration: dto.duration.trim(),
        stops: dto.stops,
        price: dto.price,
        date: dto.date.trim(),
        active: dto.active ?? true,
      },
    });
  }

  async update(id: number, dto: UpdateFlightDto) {
    const existing = await this.prisma.flight.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Flight #${id} not found`);
    }

    return this.prisma.flight.update({
      where: { id },
      data: {
        ...(dto.airline !== undefined ? { airline: dto.airline.trim() } : {}),
        ...(dto.fromCity !== undefined ? { fromCity: dto.fromCity.trim() } : {}),
        ...(dto.toCity !== undefined ? { toCity: dto.toCity.trim() } : {}),
        ...(dto.departTime !== undefined ? { departTime: dto.departTime.trim() } : {}),
        ...(dto.arriveTime !== undefined ? { arriveTime: dto.arriveTime.trim() } : {}),
        ...(dto.duration !== undefined ? { duration: dto.duration.trim() } : {}),
        ...(dto.stops !== undefined ? { stops: dto.stops } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.date !== undefined ? { date: dto.date.trim() } : {}),
        ...(dto.active !== undefined ? { active: dto.active } : {}),
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.flight.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Flight #${id} not found`);
    }
    await this.prisma.flight.delete({ where: { id } });
    return { message: `Flight #${id} deleted` };
  }
}
