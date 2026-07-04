import type { CapturedAtSource, LocationSource, WaterClarity } from '@prisma/client'

export class ValidationError extends Error {}

const LOCATION_SOURCES: LocationSource[] = ['EXIF_GPS', 'DEVICE_GPS', 'MANUAL_PIN']
const CAPTURED_AT_SOURCES: CapturedAtSource[] = ['EXIF', 'USER_INPUT', 'DEVICE_CLOCK']
const WATER_CLARITIES: WaterClarity[] = ['CLAIRE', 'TROUBLE', 'BOUEUSE']

export interface CreateCatchBody {
  clientId?: string
  latitude: number
  longitude: number
  locationSource: LocationSource
  capturedAt: string
  capturedAtSource: CapturedAtSource
  waterClarity: WaterClarity
  waterClarityConfidence?: number
  waterClarityUserSet?: boolean
  photoUrl?: string
  photoPathname?: string
  photoBase64?: string
  species?: string
  speciesConfidence?: number
  estimatedSizeCm?: number
  sizeConfidence?: number
  lureName?: string
  lureTypeRaw?: string
  lureConfidence?: number
  rawPrompt?: string
  aiNotes?: string
  weather?: {
    temperatureC?: number | null
    windSpeedKmh?: number | null
    windDirectionDeg?: number | null
    pressureHpa?: number | null
    cloudCoverPct?: number | null
    precipitationMm?: number | null
    fetchedAt?: string | null
  }
}

/** Validates the mandatory fields for creating a Catch: capturedAt, location, water clarity. */
export function validateCreateCatchBody(body: unknown): CreateCatchBody {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('Corps de requête invalide')
  }
  const b = body as Record<string, unknown>

  if (typeof b.latitude !== 'number' || typeof b.longitude !== 'number') {
    throw new ValidationError('La position (latitude/longitude) est obligatoire')
  }
  if (typeof b.locationSource !== 'string' || !LOCATION_SOURCES.includes(b.locationSource as LocationSource)) {
    throw new ValidationError('locationSource invalide')
  }
  if (typeof b.capturedAt !== 'string' || Number.isNaN(Date.parse(b.capturedAt))) {
    throw new ValidationError("La date/heure de capture est obligatoire")
  }
  if (typeof b.capturedAtSource !== 'string' || !CAPTURED_AT_SOURCES.includes(b.capturedAtSource as CapturedAtSource)) {
    throw new ValidationError('capturedAtSource invalide')
  }
  if (typeof b.waterClarity !== 'string' || !WATER_CLARITIES.includes(b.waterClarity as WaterClarity)) {
    throw new ValidationError('La clarté de l\'eau est obligatoire')
  }

  return b as unknown as CreateCatchBody
}
