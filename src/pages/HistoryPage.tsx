import { useEffect, useState } from 'react'
import type { Catch } from '@shared/types'
import { listCatches } from '@/lib/api-client'
import { CatchList } from '@/components/history/CatchList'
import { CatchMap } from '@/components/history/CatchMap'

type ViewMode = 'liste' | 'carte'

export function HistoryPage() {
  const [catches, setCatches] = useState<Catch[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<ViewMode>('liste')

  useEffect(() => {
    listCatches()
      .then(setCatches)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Historique</h2>
        <div className="flex rounded-md border border-neutral-300 dark:border-neutral-700 overflow-hidden text-sm">
          {(['liste', 'carte'] as const).map((mode, i) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              className={`px-3 py-1.5 font-medium capitalize ${
                i > 0 ? 'border-l border-neutral-300 dark:border-neutral-700' : ''
              } ${
                view === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {!error && catches === null && (
        <p className="text-neutral-500 dark:text-neutral-400">Chargement…</p>
      )}

      {catches &&
        (view === 'liste' ? <CatchList catches={catches} /> : <CatchMap catches={catches} />)}
    </div>
  )
}
