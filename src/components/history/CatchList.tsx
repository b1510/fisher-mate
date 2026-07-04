import type { Catch } from '@shared/types'

interface CatchListProps {
  catches: Catch[]
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
      {catches.map((c) => (
        <li
          key={c.id}
          className="rounded-md border border-neutral-200 dark:border-neutral-800 p-3"
        >
          <div className="flex justify-between">
            <span className="font-medium">{c.species ?? 'Espèce inconnue'}</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {new Date(c.capturedAt).toLocaleString('fr-FR')}
            </span>
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            {c.estimatedSizeCm ? `${c.estimatedSizeCm} cm · ` : ''}
            {c.lureName ?? ''}
          </div>
        </li>
      ))}
    </ul>
  )
}
