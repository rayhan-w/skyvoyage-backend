-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('READY', 'UPCOMING');

-- CreateEnum
CREATE TYPE "FlightStops" AS ENUM ('DIRECT', 'ONE_STOP');

-- CreateTable
CREATE TABLE "Package" (
    "id" SERIAL NOT NULL,
    "type" "PackageType" NOT NULL,
    "name" TEXT NOT NULL,
    "badge" TEXT,
    "days" TEXT NOT NULL,
    "persons" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "reviews" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "startDate" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" SERIAL NOT NULL,
    "airline" TEXT NOT NULL,
    "fromCity" TEXT NOT NULL,
    "toCity" TEXT NOT NULL,
    "departTime" TEXT NOT NULL,
    "arriveTime" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "stops" "FlightStops" NOT NULL,
    "price" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hotel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "pricePerNight" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);
