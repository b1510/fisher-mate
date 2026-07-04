export type LocationSource = 'EXIF_GPS' | 'DEVICE_GPS' | 'MANUAL_PIN'

export type CapturedAtSource = 'EXIF' | 'USER_INPUT' | 'DEVICE_CLOCK'

export type WaterClarity = 'CLAIRE' | 'TROUBLE' | 'BOUEUSE'

export type LureType =
  | 'SPINNERBAIT'
  | 'JIG'
  | 'CRANKBAIT'
  | 'SOFT_PLASTIC'
  | 'SPOON'
  | 'TOPWATER'
  | 'JERKBAIT'
  | 'BUZZBAIT'
  | 'CHATTERBAIT'
  | 'SPINNER'
  | 'NED_RIG'
  | 'AUTRE'

export interface WeatherSnapshot {
  temperatureC: number | null
  windSpeedKmh: number | null
  windDirectionDeg: number | null
  pressureHpa: number | null
  cloudCoverPct: number | null
  precipitationMm: number | null
  fetchedAt: string | null
}

export interface Catch {
  id: string
  clientId: string | null
  createdAt: string
  updatedAt: string

  latitude: number
  longitude: number
  locationSource: LocationSource

  capturedAt: string
  capturedAtSource: CapturedAtSource

  photoUrl: string | null
  photoPathname: string | null

  species: string | null
  speciesConfidence: number | null
  estimatedSizeCm: number | null
  sizeConfidence: number | null

  lureName: string | null
  lureType: LureType | null
  lureTypeRaw: string | null
  lureConfidence: number | null

  waterClarity: WaterClarity | null
  waterClarityConfidence: number | null
  waterClarityUserSet: boolean

  weather: WeatherSnapshot

  rawPrompt: string | null
  aiNotes: string | null
}

/** Shape returned by POST /api/catches when creating a new catch. */
export type CatchInput = Omit<
  Catch,
  'id' | 'createdAt' | 'updatedAt' | 'weather'
> & {
  weather?: Partial<WeatherSnapshot>
}

export interface AIFieldResult<T> {
  value: T | null
  confidence: number
  needsReview: boolean
}

export interface AIExtractionResult {
  species: AIFieldResult<string>
  estimatedSizeCm: AIFieldResult<number>
  lureName: AIFieldResult<string>
  lureType: AIFieldResult<LureType>
  waterClarity: AIFieldResult<WaterClarity>
  notes: string | null
}
