import type { AIExtractionResult, CapturedAtSource, LocationSource, WeatherSnapshot } from '@shared/types'

export interface CatchDraft {
  photoFile: File | null
  photoPreviewUrl: string | null
  latitude: number
  longitude: number
  locationSource: LocationSource
  capturedAt: string
  capturedAtSource: CapturedAtSource
  promptText: string | null
  ai: AIExtractionResult | null
  analyzeError: string | null
  weather: WeatherSnapshot | null
  weatherError: string | null
}

let currentDraft: CatchDraft | null = null

export function setDraft(draft: CatchDraft) {
  currentDraft = draft
}

export function getDraft(): CatchDraft | null {
  return currentDraft
}

export function clearDraft() {
  currentDraft = null
}
