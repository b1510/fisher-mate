import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold mb-2">Page introuvable</h2>
      <p className="text-neutral-500 dark:text-neutral-400 mb-4">
        Cette page n'existe pas ou plus.
      </p>
      <Link to="/" className="text-blue-600 dark:text-blue-400 font-medium">
        Retour à l'accueil
      </Link>
    </div>
  )
}
