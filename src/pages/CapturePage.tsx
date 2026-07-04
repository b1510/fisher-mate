import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LURE_TYPE_OPTIONS } from '@shared/constants'
import type { WaterClarity } from '@shared/types'
import { createCatch } from '@/lib/api-client'
import { WaterClarityPicker } from '@/components/review/WaterClarityPicker'

function nowForDatetimeLocal() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export function CapturePage() {
  const navigate = useNavigate()
  const [capturedAt, setCapturedAt] = useState(nowForDatetimeLocal())
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [species, setSpecies] = useState('')
  const [estimatedSizeCm, setEstimatedSizeCm] = useState('')
  const [lureName, setLureName] = useState('')
  const [lureTypeRaw, setLureTypeRaw] = useState('')
  const [waterClarity, setWaterClarity] = useState<WaterClarity | null>(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = capturedAt && latitude !== '' && longitude !== '' && waterClarity !== null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !waterClarity) return

    setSubmitting(true)
    setError(null)
    try {
      await createCatch({
        clientId: crypto.randomUUID(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        locationSource: 'MANUAL_PIN',
        capturedAt: new Date(capturedAt).toISOString(),
        capturedAtSource: 'USER_INPUT',
        photoUrl: null,
        photoPathname: null,
        species: species || null,
        speciesConfidence: null,
        estimatedSizeCm: estimatedSizeCm ? Number(estimatedSizeCm) : null,
        sizeConfidence: null,
        lureName: lureName || null,
        lureType: null,
        lureTypeRaw: lureTypeRaw || null,
        lureConfidence: null,
        waterClarity,
        waterClarityConfidence: null,
        waterClarityUserSet: true,
        rawPrompt: notes || null,
        aiNotes: null,
      })
      navigate('/historique')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Nouvelle prise</h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        Saisie manuelle pour l'instant — la photo et l'analyse automatique arrivent bientôt.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Date et heure *</span>
          <input
            type="datetime-local"
            required
            value={capturedAt}
            onChange={(e) => setCapturedAt(e.target.value)}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Latitude *</span>
            <input
              type="number"
              step="any"
              required
              placeholder="45.7640"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Longitude *</span>
            <input
              type="number"
              step="any"
              required
              placeholder="4.8357"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Espèce</span>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Taille estimée (cm)</span>
          <input
            type="number"
            step="any"
            value={estimatedSizeCm}
            onChange={(e) => setEstimatedSizeCm(e.target.value)}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Nom du leurre</span>
          <input
            type="text"
            value={lureName}
            onChange={(e) => setLureName(e.target.value)}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Type de leurre</span>
          <select
            value={lureTypeRaw}
            onChange={(e) => setLureTypeRaw(e.target.value)}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
          >
            <option value="">—</option>
            {LURE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="text-sm font-medium">Clarté de l'eau *</span>
          <div className="mt-1">
            <WaterClarityPicker value={waterClarity} onChange={setWaterClarity} />
          </div>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="rounded-md bg-blue-600 text-white font-medium py-2 disabled:opacity-50"
        >
          {submitting ? 'Enregistrement…' : 'Enregistrer la prise'}
        </button>
      </form>
    </div>
  )
}
