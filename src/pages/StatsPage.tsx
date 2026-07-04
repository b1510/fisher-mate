import { useEffect, useState } from 'react'
import type { Catch } from '@shared/types'
import { listCatches } from '@/lib/api-client'
import {
  cloudCoverStats,
  locationHotspots,
  lureStats,
  speciesStats,
  timeOfDayStats,
  waterClarityStats,
  windStats,
} from '@/lib/stats'
import { StatBarList } from '@/components/stats/StatBarList'

const MIN_CATCHES_FOR_STATS = 3

export function StatsPage() {
  const [catches, setCatches] = useState<Catch[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listCatches()
      .then(setCatches)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
  }, [])

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
  }
  if (catches === null) {
    return <p className="text-neutral-500 dark:text-neutral-400">Chargement…</p>
  }
  if (catches.length < MIN_CATCHES_FOR_STATS) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Statistiques</h2>
        <p className="text-neutral-500 dark:text-neutral-400">
          Enregistre au moins {MIN_CATCHES_FOR_STATS} prises pour voir apparaître tes statistiques
          (moment, lieu, leurre).
        </p>
      </div>
    )
  }

  const hotspots = locationHotspots(catches)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">Statistiques</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Basées sur {catches.length} prise{catches.length > 1 ? 's' : ''} enregistrée
          {catches.length > 1 ? 's' : ''}.
        </p>
      </div>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">
          Espèces les plus pêchées
        </h3>
        <StatBarList stats={speciesStats(catches)} />
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">
          Quand pêcher — créneau horaire
        </h3>
        <StatBarList stats={timeOfDayStats(catches)} />
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">
          Quand pêcher — couverture nuageuse
        </h3>
        <StatBarList stats={cloudCoverStats(catches)} emptyLabel="Pas de données météo disponibles" />
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">
          Quand pêcher — vent
        </h3>
        <StatBarList stats={windStats(catches)} emptyLabel="Pas de données météo disponibles" />
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">
          Quel leurre fonctionne le mieux
        </h3>
        <StatBarList stats={lureStats(catches)} emptyLabel="Aucun type de leurre renseigné" />
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">
          Clarté de l'eau la plus productive
        </h3>
        <StatBarList stats={waterClarityStats(catches)} />
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2">
          Où pêcher — zones les plus productives
        </h3>
        {hotspots.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Pas assez de données</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {hotspots.map((h, i) => (
              <li
                key={h.label}
                className="flex justify-between items-center rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-sm"
              >
                <span className={i === 0 ? 'font-semibold' : ''}>{h.label}</span>
                <span className="text-neutral-500 dark:text-neutral-400 tabular-nums">
                  {h.count} prise{h.count > 1 ? 's' : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
          Consulte l'onglet Carte de l'historique pour visualiser toutes tes prises.
        </p>
      </section>
    </div>
  )
}
