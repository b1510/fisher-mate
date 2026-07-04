import type { WeatherSnapshot } from '@shared/types'

interface WeatherSummaryProps {
  weather: WeatherSnapshot | null
  error: string | null
}

export function WeatherSummary({ weather, error }: WeatherSummaryProps) {
  if (error) {
    return (
      <p className="text-sm text-amber-600 dark:text-amber-400">
        Météo indisponible ({error})
      </p>
    )
  }
  if (!weather) return null

  return (
    <div className="rounded-md border border-neutral-200 dark:border-neutral-800 p-3 text-sm">
      <div className="font-medium mb-1">Météo au moment de la prise</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-neutral-600 dark:text-neutral-400">
        {weather.temperatureC !== null && <div>🌡️ {weather.temperatureC}°C</div>}
        {weather.windSpeedKmh !== null && <div>💨 {weather.windSpeedKmh} km/h</div>}
        {weather.pressureHpa !== null && <div>📊 {weather.pressureHpa} hPa</div>}
        {weather.cloudCoverPct !== null && <div>☁️ {weather.cloudCoverPct}%</div>}
        {weather.precipitationMm !== null && <div>🌧️ {weather.precipitationMm} mm</div>}
      </div>
      <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">Source : Open-Meteo</p>
    </div>
  )
}
