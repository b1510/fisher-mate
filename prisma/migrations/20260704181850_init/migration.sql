-- CreateEnum
CREATE TYPE "LocationSource" AS ENUM ('EXIF_GPS', 'DEVICE_GPS', 'MANUAL_PIN');

-- CreateEnum
CREATE TYPE "CapturedAtSource" AS ENUM ('EXIF', 'USER_INPUT', 'DEVICE_CLOCK');

-- CreateEnum
CREATE TYPE "WaterClarity" AS ENUM ('CLAIRE', 'TROUBLE', 'BOUEUSE');

-- CreateEnum
CREATE TYPE "LureType" AS ENUM ('SPINNERBAIT', 'JIG', 'CRANKBAIT', 'SOFT_PLASTIC', 'SPOON', 'TOPWATER', 'JERKBAIT', 'BUZZBAIT', 'CHATTERBAIT', 'SPINNER', 'NED_RIG', 'AUTRE');

-- CreateTable
CREATE TABLE "Catch" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "locationSource" "LocationSource" NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL,
    "capturedAtSource" "CapturedAtSource" NOT NULL,
    "photoUrl" TEXT,
    "photoPathname" TEXT,
    "species" TEXT,
    "speciesConfidence" DOUBLE PRECISION,
    "estimatedSizeCm" DOUBLE PRECISION,
    "sizeConfidence" DOUBLE PRECISION,
    "lureName" TEXT,
    "lureType" "LureType",
    "lureTypeRaw" TEXT,
    "lureConfidence" DOUBLE PRECISION,
    "waterClarity" "WaterClarity",
    "waterClarityConfidence" DOUBLE PRECISION,
    "waterClarityUserSet" BOOLEAN NOT NULL DEFAULT false,
    "weatherTemperatureC" DOUBLE PRECISION,
    "weatherWindSpeedKmh" DOUBLE PRECISION,
    "weatherWindDirectionDeg" DOUBLE PRECISION,
    "weatherPressureHpa" DOUBLE PRECISION,
    "weatherCloudCoverPct" DOUBLE PRECISION,
    "weatherPrecipitationMm" DOUBLE PRECISION,
    "weatherFetchedAt" TIMESTAMP(3),
    "rawPrompt" TEXT,
    "aiNotes" TEXT,
    "aiRawResponse" JSONB,

    CONSTRAINT "Catch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Catch_clientId_key" ON "Catch"("clientId");

-- CreateIndex
CREATE INDEX "Catch_capturedAt_idx" ON "Catch"("capturedAt");
