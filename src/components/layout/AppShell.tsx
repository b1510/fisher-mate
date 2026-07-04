import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { InstallBanner } from './InstallBanner'

export function AppShell() {
  return (
    <div className="min-h-svh flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <header className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
        <h1 className="text-lg font-semibold">FisherMate</h1>
        <InstallBanner />
      </header>

      <main className="flex-1 px-4 py-4 pb-20">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
