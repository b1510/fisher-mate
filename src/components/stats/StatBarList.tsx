import type { RankedStat } from '@/lib/stats'

interface StatBarListProps {
  stats: RankedStat[]
  emptyLabel?: string
}

export function StatBarList({ stats, emptyLabel = 'Pas assez de données' }: StatBarListProps) {
  if (stats.length === 0) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">{emptyLabel}</p>
  }

  const max = stats[0].count

  return (
    <ul className="flex flex-col gap-2">
      {stats.map((s, i) => (
        <li key={s.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className={i === 0 ? 'font-semibold' : ''}>{s.label}</span>
            <span className="text-neutral-500 dark:text-neutral-400 tabular-nums">{s.count}</span>
          </div>
          <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-blue-400 dark:bg-blue-700'}`}
              style={{ width: `${(s.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
