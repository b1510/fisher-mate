export interface WeatherSnapshot {
  temperatureC: number | null
  windSpeedKmh: number | null
  windDirectionDeg: number | null
  pressureHpa: number | null
  cloudCoverPct: number | null
  precipitationMm: number | null
  fetchedAt: string
}

const HOURLY_VARS = 'temperature_2m,windspeed_10m,winddirection_10m,surface_pressure,cloudcover,precipitation'
const RECENT_THRESHOLD_MS = 5 * 24 * 60 * 60 * 1000

interface HourlyResponse {
  hourly?: {
    time: string[]
    temperature_2m?: (number | null)[]
    windspeed_10m?: (number | null)[]
    winddirection_10m?: (number | null)[]
    surface_pressure?: (number | null)[]
    cloudcover?: (number | null)[]
    precipitation?: (number | null)[]
  }
}

function closestHourIndex(times: string[], target: Date): number {
  let bestIndex = 0
  let bestDiff = Infinity
  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(new Date(times[i]).getTime() - target.getTime())
    if (diff < bestDiff) {
      bestDiff = diff
      bestIndex = i
    }
  }
  return bestIndex
}

function extractSnapshot(data: HourlyResponse, capturedAt: Date): WeatherSnapshot {
  const hourly = data.hourly
  if (!hourly || hourly.time.length === 0) {
    throw new Error('Aucune donnée météo disponible pour ce lieu/cette date')
  }

  const i = closestHourIndex(hourly.time, capturedAt)
  return {
    temperatureC: hourly.temperature_2m?.[i] ?? null,
    windSpeedKmh: hourly.windspeed_10m?.[i] ?? null,
    windDirectionDeg: hourly.winddirection_10m?.[i] ?? null,
    pressureHpa: hourly.surface_pressure?.[i] ?? null,
    cloudCoverPct: hourly.cloudcover?.[i] ?? null,
    precipitationMm: hourly.precipitation?.[i] ?? null,
    fetchedAt: new Date().toISOString(),
  }
}

export async function getWeatherSnapshot(
  latitude: number,
  longitude: number,
  capturedAt: Date,
): Promise<WeatherSnapshot> {
  const isRecent = Date.now() - capturedAt.getTime() < RECENT_THRESHOLD_MS

  const url = isRecent
    ? `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=${HOURLY_VARS}&past_days=7&timezone=UTC`
    : (() => {
        const dateStr = capturedAt.toISOString().slice(0, 10)
        return `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${dateStr}&end_date=${dateStr}&hourly=${HOURLY_VARS}&timezone=UTC`
      })()

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Open-Meteo a répondu avec le statut ${res.status}`)
  }

  const data = (await res.json()) as HourlyResponse
  return extractSnapshot(data, capturedAt)
}
