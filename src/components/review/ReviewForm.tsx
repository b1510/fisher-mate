import { useState } from 'react'
import { LURE_TYPE_OPTIONS } from '@shared/constants'
import { normalizeLureType } from '@shared/lureType'
import type { WaterClarity } from '@shared/types'
import type { CatchDraft } from '@/lib/draftStore'
import { createCatch } from '@/lib/api-client'
import { WaterClarityPicker } from './WaterClarityPicker'
import { WeatherSummary } from './WeatherSummary'

interface ReviewFormProps {
  draft: CatchDraft
  onSaved: () => void
}

function confidenceHint(confidence: number, needsReview: boolean) {
  if (!needsReview) return null
  return `Suggestion IA peu sûre (${Math.round(confidence * 100)}%) — vérifie cette valeur`
}

export function ReviewForm({ draft, onSaved }: ReviewFormProps) {
  const ai = draft.ai

  const [species, setSpecies] = useState(ai?.species.value ?? '')
  const [estimatedSizeCm, setEstimatedSizeCm] = useState(
    ai?.estimatedSizeCm.value != null ? String(ai.estimatedSizeCm.value) : '',
  )
  const [lureName, setLureName] = useState(ai?.lureName.value ?? '')
  const [lureTypeRaw, setLureTypeRaw] = useState(() => {
    if (!ai?.lureTypeRaw.value) return ''
    const matched = normalizeLureType(ai.lureTypeRaw.value)
    return LURE_TYPE_OPTIONS.find((opt) => opt.value === matched)?.label ?? ai.lureTypeRaw.value
  })
  const [waterClarity, setWaterClarity] = useState<WaterClarity | null>(
    ai && !ai.waterClarity.needsReview ? ai.waterClarity.value : null,
  )
  const [waterClarityTouched, setWaterClarityTouched] = useState(false)
  const [notes, setNotes] = useState(ai?.notes ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const waterClarityNeedsReview = !ai || ai.waterClarity.needsReview
  const canSubmit = waterClarity !== null

  function handleWaterClarityChange(value: WaterClarity) {
    setWaterClarity(value)
    setWaterClarityTouched(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!waterClarity) return

    setSubmitting(true)
    setError(null)
    try {
      await createCatch({
        clientId: crypto.randomUUID(),
        latitude: draft.latitude,
        longitude: draft.longitude,
        locationSource: draft.locationSource,
        capturedAt: draft.capturedAt,
        capturedAtSource: draft.capturedAtSource,
        photoUrl: null,
        photoPathname: null,
        species: species || null,
        speciesConfidence: ai?.species.confidence ?? null,
        estimatedSizeCm: estimatedSizeCm ? Number(estimatedSizeCm) : null,
        sizeConfidence: ai?.estimatedSizeCm.confidence ?? null,
        lureName: lureName || null,
        lureType: null,
        lureTypeRaw: lureTypeRaw || null,
        lureConfidence: ai?.lureTypeRaw.confidence ?? null,
        waterClarity,
        waterClarityConfidence: ai?.waterClarity.confidence ?? null,
        waterClarityUserSet: waterClarityTouched || waterClarityNeedsReview,
        rawPrompt: draft.promptText,
        aiNotes: notes || null,
        weather: draft.weather ?? undefined,
      })
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {draft.analyzeError && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          L'analyse automatique a échoué ({draft.analyzeError}) — remplis les champs manuellement.
        </p>
      )}

      {draft.photoPreviewUrl && (
        <img
          src={draft.photoPreviewUrl}
          alt="Prise"
          className="rounded-md max-h-64 w-full object-cover"
        />
      )}

      <WeatherSummary weather={draft.weather} error={draft.weatherError} />

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Espèce</span>
        <input
          type="text"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
        />
        {ai && confidenceHint(ai.species.confidence, ai.species.needsReview) && (
          <span className="text-xs text-amber-600 dark:text-amber-400">
            {confidenceHint(ai.species.confidence, ai.species.needsReview)}
          </span>
        )}
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
        {ai && confidenceHint(ai.estimatedSizeCm.confidence, ai.estimatedSizeCm.needsReview) && (
          <span className="text-xs text-amber-600 dark:text-amber-400">
            {confidenceHint(ai.estimatedSizeCm.confidence, ai.estimatedSizeCm.needsReview)}
          </span>
        )}
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
          <WaterClarityPicker
            value={waterClarity}
            onChange={handleWaterClarityChange}
            helperText={
              waterClarityNeedsReview && !waterClarity
                ? "L'IA n'a pas pu déterminer la clarté de l'eau, merci de préciser"
                : undefined
            }
          />
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
  )
}
