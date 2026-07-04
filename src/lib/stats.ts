import { LURE_TYPE_OPTIONS, WATER_CLARITY_OPTIONS } from '@shared/constants'
import type { Catch } from '@shared/types'

export interface RankedStat {
  label: string
  count: number
}

function rankBy<T>(items: T[], keyOf: (item: T) => string | null): RankedStat[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    const key = keyOf(item)
    if (!key) continue
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

const LURE_LABELS = Object.fromEntries(LURE_TYPE_OPTIONS.map((o) => [o.value, o.label]))
const CLARITY_LABELS = Object.fromEntries(WATER_CLARITY_OPTIONS.map((o) => [o.value, o.label]))

export function lureStats(catches: Catch[]): RankedStat[] {
  return rankBy(catches, (c) => (c.lureType ? LURE_LABELS[c.lureType] : null))
}

export function waterClarityStats(catches: Catch[]): RankedStat[] {
  return rankBy(catches, (c) => (c.waterClarity ? CLARITY_LABELS[c.waterClarity] : null))
}

export function speciesStats(catches: Catch[]): RankedStat[] {
  return rankBy(catches, (c) => c.species)
}

const TIME_BUCKETS: { label: string; test: (hour: number) => boolean }[] = [
  { label: 'Aube (5h-8h)', test: (h) => h >= 5 && h < 8 },
  { label: 'Matin (8h-11h)', test: (h) => h >= 8 && h < 11 },
  { label: 'Midi (11h-14h)', test: (h) => h >= 11 && h < 14 },
  { label: 'Après-midi (14h-18h)', test: (h) => h >= 14 && h < 18 },
  { label: 'Soirée (18h-21h)', test: (h) => h >= 18 && h < 21 },
  { label: 'Nuit (21h-5h)', test: (h) => h >= 21 || h < 5 },
]

export function timeOfDayStats(catches: Catch[]): RankedStat[] {
  return rankBy(catches, (c) => {
    const hour = new Date(c.capturedAt).getHours()
    return TIME_BUCKETS.find((b) => b.test(hour))?.label ?? null
  })
}

const CLOUD_BUCKETS: { label: string; test: (pct: number) => boolean }[] = [
  { label: 'Ensoleillé (< 30% nuages)', test: (p) => p < 30 },
  { label: 'Partiellement nuageux (30-70%)', test: (p) => p >= 30 && p <= 70 },
  { label: 'Couvert (> 70% nuages)', test: (p) => p > 70 },
]

export function cloudCoverStats(catches: Catch[]): RankedStat[] {
  return rankBy(catches, (c) => {
    const pct = c.weather.cloudCoverPct
    if (pct === null) return null
    return CLOUD_BUCKETS.find((b) => b.test(pct))?.label ?? null
  })
}

const WIND_BUCKETS: { label: string; test: (kmh: number) => boolean }[] = [
  { label: 'Calme (< 10 km/h)', test: (w) => w < 10 },
  { label: 'Modéré (10-20 km/h)', test: (w) => w >= 10 && w <= 20 },
  { label: 'Fort (> 20 km/h)', test: (w) => w > 20 },
]

export function windStats(catches: Catch[]): RankedStat[] {
  return rankBy(catches, (c) => {
    const kmh = c.weather.windSpeedKmh
    if (kmh === null) return null
    return WIND_BUCKETS.find((b) => b.test(kmh))?.label ?? null
  })
}

export interface LocationHotspot {
  label: string
  latitude: number
  longitude: number
  count: number
}

/** Clusters catches onto a ~1.1km grid (2 decimal places) to surface productive spots without needing reverse geocoding. */
export function locationHotspots(catches: Catch[], limit = 5): LocationHotspot[] {
  const groups = new Map<string, { latSum: number; lonSum: number; count: number }>()
  for (const c of catches) {
    const key = `${c.latitude.toFixed(2)},${c.longitude.toFixed(2)}`
    const g = groups.get(key) ?? { latSum: 0, lonSum: 0, count: 0 }
    g.latSum += c.latitude
    g.lonSum += c.longitude
    g.count += 1
    groups.set(key, g)
  }
  return [...groups.values()]
    .map((g) => ({
      label: `${(g.latSum / g.count).toFixed(4)}, ${(g.lonSum / g.count).toFixed(4)}`,
      latitude: g.latSum / g.count,
      longitude: g.lonSum / g.count,
      count: g.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
