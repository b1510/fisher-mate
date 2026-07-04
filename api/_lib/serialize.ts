import type { Catch as PrismaCatch } from '@prisma/client'

/** Converts a Prisma Catch row (flat weather* columns) into the nested API shape the frontend expects. */
export function serializeCatch(row: PrismaCatch) {
  const {
    weatherTemperatureC,
    weatherWindSpeedKmh,
    weatherWindDirectionDeg,
    weatherPressureHpa,
    weatherCloudCoverPct,
    weatherPrecipitationMm,
    weatherFetchedAt,
    ...rest
  } = row

  return {
    ...rest,
    weather: {
      temperatureC: weatherTemperatureC,
      windSpeedKmh: weatherWindSpeedKmh,
      windDirectionDeg: weatherWindDirectionDeg,
      pressureHpa: weatherPressureHpa,
      cloudCoverPct: weatherCloudCoverPct,
      precipitationMm: weatherPrecipitationMm,
      fetchedAt: weatherFetchedAt,
    },
  }
}
