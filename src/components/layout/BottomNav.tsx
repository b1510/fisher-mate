import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Capturer', end: true },
  { to: '/historique', label: 'Historique', end: false },
  { to: '/stats', label: 'Stats', end: false },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 border-t border-black/10 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <ul className="flex justify-around">
        {links.map(({ to, label, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 text-sm font-medium ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-neutral-500 dark:text-neutral-400'
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
