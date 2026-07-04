import type { SyncStatus } from '@/lib/db'

const LABELS: Record<SyncStatus, string> = {
  pending_sync: 'En attente de connexion',
  syncing: 'Analyse en cours…',
  ready_for_review: 'À vérifier',
  error: 'Échec, nouvelle tentative',
  synced: '',
}

const STYLES: Record<SyncStatus, string> = {
  pending_sync: 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  syncing: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  ready_for_review: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  synced: '',
}

export function SyncStatusBadge({ status }: { status: SyncStatus }) {
  if (status === 'synced') return null
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  )
}
