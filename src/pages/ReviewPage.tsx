import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getPendingCatch, deletePendingCatch, type PendingCatch } from '@/lib/db'
import { ReviewForm } from '@/components/review/ReviewForm'

export function ReviewPage() {
  const navigate = useNavigate()
  const { clientId } = useParams<{ clientId: string }>()
  const [draft, setDraft] = useState<PendingCatch | null | 'loading'>('loading')

  useEffect(() => {
    if (!clientId) return
    getPendingCatch(clientId).then((record) => setDraft(record ?? null))
  }, [clientId])

  if (!clientId || draft === null) {
    return <Navigate to="/historique" replace />
  }

  if (draft === 'loading') {
    return <p className="text-neutral-500 dark:text-neutral-400">Chargement…</p>
  }

  async function handleSaved() {
    await deletePendingCatch(clientId!)
    navigate('/historique')
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Vérifie ta prise</h2>
      <ReviewForm draft={draft} onSaved={handleSaved} />
    </div>
  )
}
