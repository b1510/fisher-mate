import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function SyncBanner() {
  const online = useOnlineStatus()
  if (online) return null

  return (
    <div className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs text-center py-1">
      Hors ligne — tes prises seront synchronisées à la reconnexion
    </div>
  )
}
