import { Link } from 'react-router-dom'
import type { HistoryItem } from '@/lib/historyItem'
import { SyncStatusBadge } from '@/components/sync/SyncStatusBadge'

interface CatchListProps {
  catches: HistoryItem[]
}

export function CatchList({ catches }: CatchListProps) {
  if (catches.length === 0) {
    return (
      <p className="text-neutral-500 dark:text-neutral-400">
        Aucune prise enregistrée pour l'instant.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {catches.map((c) => {
        const content = (
          <div className="rounded-md border border-neutral-200 dark:border-neutral-800 p-3">
            <div className="flex justify-between items-start gap-2">
              <span className="font-medium">{c.species ?? 'Espèce inconnue'}</span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400 text-right">
                {new Date(c.capturedAt).toLocaleString('fr-FR')}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {c.estimatedSizeCm ? `${c.estimatedSizeCm} cm · ` : ''}
                {c.lureName ?? ''}
              </span>
              <SyncStatusBadge status={c.syncStatus} />
            </div>
          </div>
        )
        return (
          <li key={c.key}>
            {c.reviewClientId ? <Link to={`/revue/${c.reviewClientId}`}>{content}</Link> : content}
          </li>
        )
      })}
    </ul>
  )
}
