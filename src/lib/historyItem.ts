import type { Catch } from '@shared/types'
import type { PendingCatch, SyncStatus } from './db'

export interface HistoryItem {
  key: string
  capturedAt: string
  species: string | null
  estimatedSizeCm: number | null
  lureName: string | null
  latitude: number
  longitude: number
  syncStatus: SyncStatus
  reviewClientId: string | null
}

export function fromServerCatch(c: Catch): HistoryItem {
  return {
    key: c.id,
    capturedAt: c.capturedAt,
    species: c.species,
    estimatedSizeCm: c.estimatedSizeCm,
    lureName: c.lureName,
    latitude: c.latitude,
    longitude: c.longitude,
    syncStatus: 'synced',
    reviewClientId: null,
  }
}

export function fromPendingCatch(p: PendingCatch): HistoryItem {
  return {
    key: p.clientId,
    capturedAt: p.capturedAt,
    species: p.ai?.species.value ?? null,
    estimatedSizeCm: p.ai?.estimatedSizeCm.value ?? null,
    lureName: p.ai?.lureName.value ?? null,
    latitude: p.latitude,
    longitude: p.longitude,
    syncStatus: p.status,
    reviewClientId: p.clientId,
  }
}

export function mergeHistoryItems(serverCatches: Catch[], pending: PendingCatch[]): HistoryItem[] {
  const items = [...pending.map(fromPendingCatch), ...serverCatches.map(fromServerCatch)]
  return items.sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime())
}
