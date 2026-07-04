import { analyzeCatch, fetchWeather } from './api-client'
import { fileToBase64 } from './file'
import { getAllPendingCatches, putPendingCatch, type PendingCatch } from './db'

export const SYNC_CHANGED_EVENT = 'fishermate:sync-changed'

function notifyChanged() {
  window.dispatchEvent(new Event(SYNC_CHANGED_EVENT))
}

let isSyncing = false

async function syncOne(record: PendingCatch) {
  await putPendingCatch({ ...record, status: 'syncing' })
  notifyChanged()

  try {
    const photoBase64 = record.photoFile ? await fileToBase64(record.photoFile) : undefined

    const [analyzeResult, weatherResult] = await Promise.allSettled([
      analyzeCatch({ photoBase64, promptText: record.promptText ?? undefined }),
      fetchWeather({
        latitude: record.latitude,
        longitude: record.longitude,
        capturedAt: record.capturedAt,
      }),
    ])

    await putPendingCatch({
      ...record,
      status: 'ready_for_review',
      ai: analyzeResult.status === 'fulfilled' ? analyzeResult.value : null,
      analyzeError: analyzeResult.status === 'rejected' ? String(analyzeResult.reason) : null,
      weather: weatherResult.status === 'fulfilled' ? weatherResult.value : null,
      weatherError: weatherResult.status === 'rejected' ? String(weatherResult.reason) : null,
      syncError: null,
      updatedAt: new Date().toISOString(),
    })
  } catch (err) {
    await putPendingCatch({
      ...record,
      status: 'error',
      syncError: err instanceof Error ? err.message : String(err),
      retryCount: record.retryCount + 1,
      updatedAt: new Date().toISOString(),
    })
  }
  notifyChanged()
}

/** Processes all queued catches sequentially (gentle on a just-restored connection). One failure never blocks the rest. */
export async function runSync() {
  if (isSyncing || !navigator.onLine) return
  isSyncing = true
  try {
    const pending = (await getAllPendingCatches()).filter(
      (r) => r.status === 'pending_sync' || r.status === 'error',
    )
    for (const record of pending) {
      await syncOne(record)
    }
  } finally {
    isSyncing = false
  }
}

let initialized = false

/** Registers triggers (online event, tab visibility, periodic fallback) that (re)run the sync queue. Call once at app startup. */
export function initSyncEngine() {
  if (initialized) return
  initialized = true

  window.addEventListener('online', () => void runSync())
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void runSync()
  })
  setInterval(() => void runSync(), 30_000)
  void runSync()
}
