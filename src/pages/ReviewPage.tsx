import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getDraft, clearDraft, type CatchDraft } from '@/lib/draftStore'
import { ReviewForm } from '@/components/review/ReviewForm'

export function ReviewPage() {
  const navigate = useNavigate()
  const [draft] = useState<CatchDraft | null>(() => getDraft())

  useEffect(() => {
    return () => {
      if (draft?.photoPreviewUrl) URL.revokeObjectURL(draft.photoPreviewUrl)
    }
  }, [draft])

  if (!draft) {
    return <Navigate to="/" replace />
  }

  function handleSaved() {
    clearDraft()
    navigate('/historique')
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Vérifie ta prise</h2>
      <ReviewForm draft={draft} onSaved={handleSaved} />
    </div>
  )
}
