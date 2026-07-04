import { useState } from 'react'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'

const IOS_DISMISSED_KEY = 'fishermate:ios-install-dismissed'

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

export function InstallBanner() {
  const { canInstall, promptInstall, installed } = useInstallPrompt()
  const [iosDismissed, setIosDismissed] = useState(
    () => localStorage.getItem(IOS_DISMISSED_KEY) === '1',
  )

  if (installed) return null

  if (canInstall) {
    return (
      <button
        type="button"
        onClick={promptInstall}
        className="text-sm font-medium text-blue-600 dark:text-blue-400"
      >
        Installer l'application
      </button>
    )
  }

  if (isIOS() && !iosDismissed) {
    return (
      <div className="fixed bottom-16 inset-x-2 rounded-md bg-neutral-900 text-white text-sm p-3 flex items-start justify-between gap-3 shadow-lg">
        <p>
          Pour installer FisherMate : appuie sur{' '}
          <span aria-label="Partager" className="font-medium">
            Partager
          </span>{' '}
          puis « Sur l'écran d'accueil ».
        </p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(IOS_DISMISSED_KEY, '1')
            setIosDismissed(true)
          }}
          className="shrink-0 font-medium"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>
    )
  }

  return null
}
