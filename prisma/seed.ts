import 'dotenv/config';
import { FlightStops, PackageType, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || 'SkyVoyage Admin';
  const mobile = process.env.ADMIN_MOBILE?.trim() || '+8801000000000';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env to seed admin user');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, mobile, passwordHash, role: Role.ADMIN },
    create: { name, mobile, email, passwordHash, role: Role.ADMIN },
  });

  console.log(`Seeded admin user: ${admin.email} (id=${admin.id}, role=${admin.role})`);
}

async function seedPackages() {
  const count = await prisma.package.count();
  if (count > 0) {
    console.log(`Packages already seeded (${count} rows), skipping.`);
    return;
  }

  const packages = [
    // Ready packages (from frontend lib/data.js readyPackages)
    {
      type: PackageType.READY,
      name: 'Bangkok & Pattaya Tour',
      badge: 'Popular',
      days: '5 Days',
      persons: '2-6 Person',
      place: 'Thailand',
      rating: 4.9,
      reviews: 120,
      price: 25000,
      imageUrl: '/images/thailand.jpg',
      startDate: null,
      active: true,
      sortOrder: 1,
    },
    {
      type: PackageType.READY,
      name: 'Maldives Luxury Escape',
      badge: 'Trending',
      days: '4 Days',
      persons: '2 Person',
      place: 'Maldives',
      rating: 4.8,
      reviews: 86,
      price: 65000,
      imageUrl: '/images/maldives.jpg',
      startDate: null,
      active: true,
      sortOrder: 2,
    },
    {
      type: PackageType.READY,
      name: 'Dubai Explorer',
      badge: 'Best Seller',
      days: '5 Days',
      persons: '2-4 Person',
      place: 'UAE',
      rating: 4.9,
      reviews: 210,
      price: 68500,
      imageUrl: '/images/dubai.jpg',
      startDate: null,
      active: true,
      sortOrder: 3,
    },
    // Upcoming packages (from frontend lib/data.js upcomingPackages)
    {
      type: PackageType.UPCOMING,
      name: 'Japan Cherry Blossom Tour',
      badge: 'Upcoming',
      days: '7 Days',
      persons: '2-8 Person',
      place: 'Japan',
      rating: 5.0,
      reviews: 85,
      price: 32000,
      imageUrl: '/images/japan.jpg',
      startDate: 'Apr 15, 2026',
      active: true,
      sortOrder: 1,
    },
    {
      type: PackageType.UPCOMING,
      name: 'Europe Highlights',
      badge: 'Upcoming',
      days: '10 Days',
      persons: '2-10 Person',
      place: 'Switzerland',
      rating: 4.9,
      reviews: 64,
      price: 149500,
      imageUrl: '/images/switzerland.jpg',
      startDate: 'May 20, 2026',
      active: true,
      sortOrder: 2,
    },
    {
      type: PackageType.UPCOMING,
      name: 'Bali Adventure',
      badge: 'Upcoming',
      days: '6 Days',
      persons: '2-6 Person',
      place: 'Indonesia',
      rating: 4.8,
      reviews: 92,
      price: 55000,
      imageUrl: '/images/bali.jpg',
      startDate: 'Jun 12, 2026',
      active: true,
      sortOrder: 3,
    },
  ];

  await prisma.package.createMany({ data: packages });
  console.log(`Seeded ${packages.length} packages.`);
}

async function seedFlights() {
  const count = await prisma.flight.count();
  if (count > 0) {
    console.log(`Flights already seeded (${count} rows), skipping.`);
    return;
  }

  const flights = [
    {
      airline: 'Biman Bangladesh Airlines',
      fromCity: 'DAC',
      toCity: 'DXB',
      departTime: '10:20',
      arriveTime: '14:30',
      duration: '4h 10m',
      stops: FlightStops.DIRECT,
      price: 32500,
      date: 'Fri, 12 Nov',
      active: true,
    },
    {
      airline: 'Emirates',
      fromCity: 'DAC',
      toCity: 'DXB',
      departTime: '23:15',
      arriveTime: '06:35',
      duration: '2h 20m',
      stops: FlightStops.ONE_STOP,
      price: 41200,
      date: 'Sat, 13 Nov',
      active: true,
    },
    {
      airline: 'Qatar Airways',
      fromCity: 'DAC',
      toCity: 'DXB',
      departTime: '17:40',
      arriveTime: '01:30',
      duration: '5h 50m',
      stops: FlightStops.ONE_STOP,
      price: 45600,
      date: 'Sat, 13 Nov',
      active: true,
    },
    {
      airline: 'Turkish Airlines',
      fromCity: 'DAC',
      toCity: 'DXB',
      departTime: '08:55',
      arriveTime: '16:30',
      duration: '6h 35m',
      stops: FlightStops.ONE_STOP,
      price: 44800,
      date: 'Fri, 12 Nov',
      active: true,
    },
    {
      airline: 'AirAsia',
      fromCity: 'DAC',
      toCity: 'KUL',
      departTime: '09:30',
      arriveTime: '15:20',
      duration: '3h 50m',
      stops: FlightStops.DIRECT,
      price: 28900,
      date: 'Fri, 12 Nov',
      active: true,
    },
    {
      airline: 'Singapore Airlines',
      fromCity: 'DAC',
      toCity: 'SIN',
      departTime: '13:05',
      arriveTime: '21:40',
      duration: '6h 35m',
      stops: FlightStops.ONE_STOP,
      price: 39400,
      date: 'Fri, 12 Nov',
      active: true,
    },
    {
      airline: 'Saudia',
      fromCity: 'DAC',
      toCity: 'DXB',
      departTime: '19:25',
      arriveTime: '04:10',
      duration: '7h 45m',
      stops: FlightStops.ONE_STOP,
      price: 38900,
      date: 'Sat, 13 Nov',
      active: true,
    },
    {
      airline: 'US-Bangla Airlines',
      fromCity: 'DAC',
      toCity: 'BKK',
      departTime: '11:15',
      arriveTime: '14:45',
      duration: '2h 30m',
      stops: FlightStops.DIRECT,
      price: 26500,
      date: 'Fri, 12 Nov',
      active: true,
    },
  ];

  await prisma.flight.createMany({ data: flights });
  console.log(`Seeded ${flights.length} flights.`);
}

async function seedHotels() {
  const count = await prisma.hotel.count();
  if (count > 0) {
    console.log(`Hotels already seeded (${count} rows), skipping.`);
    return;
  }

  const hotels = [
    {
      name: 'Burj Al Arab Jumeirah',
      city: 'Dubai, UAE',
      stars: 5,
      pricePerNight: 18500,
      imageUrl: '/images/hotel1.jpg',
      active: true,
    },
    {
      name: 'Marina Bay Sands',
      city: 'Singapore',
      stars: 5,
      pricePerNight: 22000,
      imageUrl: '/images/hotel2.jpg',
      active: true,
    },
    {
      name: 'Grand Palace Hotel',
      city: 'Bangkok, Thailand',
      stars: 4,
      pricePerNight: 8500,
      imageUrl: '/images/hotel3.jpg',
      active: true,
    },
    {
      name: 'The Ritz London',
      city: 'London, UK',
      stars: 5,
      pricePerNight: 25000,
      imageUrl: '/images/hotel4.jpg',
      active: true,
    },
  ];

  await prisma.hotel.createMany({ data: hotels });
  console.log(`Seeded ${hotels.length} hotels.`);
}

async function main() {
  await seedAdmin();
  await seedPackages();
  await seedFlights();
  await seedHotels();
}

main()
  .catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
