import { useEffect, useState } from 'react'
import type { Catch } from '@shared/types'
import { listCatches } from '@/lib/api-client'

export function HistoryPage() {
  const [catches, setCatches] = useState<Catch[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listCatches()
      .then(setCatches)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
  }, [])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Historique</h2>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {!error && catches === null && (
        <p className="text-neutral-500 dark:text-neutral-400">Chargement…</p>
      )}
      {catches?.length === 0 && (
        <p className="text-neutral-500 dark:text-neutral-400">
          Aucune prise enregistrée pour l'instant.
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {catches?.map((c) => (
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
    </div>
  )
}
