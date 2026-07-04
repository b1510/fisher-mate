import { openDB, type DBSchema } from 'idb'
import type {
  AIExtractionResult,
  CapturedAtSource,
  LocationSource,
  WeatherSnapshot,
} from '@shared/types'

export type SyncStatus = 'pending_sync' | 'syncing' | 'ready_for_review' | 'error' | 'synced'

export interface PendingCatch {
  clientId: string
  status: SyncStatus
  photoFile: File | null
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
  syncError: string | null
  retryCount: number
  createdAt: string
  updatedAt: string
}

interface FisherMateDB extends DBSchema {
  pendingCatches: {
    key: string
    value: PendingCatch
    indexes: { 'by-status': string }
  }
}

const dbPromise = openDB<FisherMateDB>('fishermate-db', 1, {
  upgrade(db) {
    const store = db.createObjectStore('pendingCatches', { keyPath: 'clientId' })
    store.createIndex('by-status', 'status')
  },
})

export async function putPendingCatch(record: PendingCatch) {
  const db = await dbPromise
  await db.put('pendingCatches', record)
}

export async function getPendingCatch(clientId: string) {
  const db = await dbPromise
  return db.get('pendingCatches', clientId)
}

export async function getAllPendingCatches() {
  const db = await dbPromise
  return db.getAll('pendingCatches')
}

export async function deletePendingCatch(clientId: string) {
  const db = await dbPromise
  await db.delete('pendingCatches', clientId)
}
