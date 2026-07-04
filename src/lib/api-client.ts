import type { AIExtractionResult, Catch, CatchInput, WeatherSnapshot } from '@shared/types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? `Erreur ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export function listCatches() {
  return request<Catch[]>('/api/catches')
}

export function createCatch(input: CatchInput) {
  return request<Catch>('/api/catches', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function getCatch(id: string) {
  return request<Catch>(`/api/catches/${id}`)
}

export function deleteCatch(id: string) {
  return request<void>(`/api/catches/${id}`, { method: 'DELETE' })
}

export function analyzeCatch(input: { photoBase64?: string; promptText?: string }) {
  return request<AIExtractionResult>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function fetchWeather(input: { latitude: number; longitude: number; capturedAt: string }) {
  return request<WeatherSnapshot>('/api/weather', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
