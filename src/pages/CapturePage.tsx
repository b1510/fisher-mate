import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LURE_TYPE_OPTIONS } from '@shared/constants'
import type { CapturedAtSource, LocationSource, WaterClarity } from '@shared/types'
import { createCatch } from '@/lib/api-client'
import { extractPhotoExif } from '@/lib/exif'
import { requestDeviceLocation } from '@/hooks/useGeolocation'
import { WaterClarityPicker } from '@/components/review/WaterClarityPicker'
import { PhotoPicker } from '@/components/capture/PhotoPicker'
import { LocationFallback } from '@/components/capture/LocationFallback'

function toDatetimeLocalValue(date: Date) {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

const LOCATION_SOURCE_LABEL: Record<LocationSource, string> = {
  EXIF_GPS: 'Position issue de la photo',
  DEVICE_GPS: "Position de l'appareil",
  MANUAL_PIN: 'Position placée manuellement',
}

export function CapturePage() {
  const navigate = useNavigate()
  const [capturedAt, setCapturedAt] = useState(toDatetimeLocalValue(new Date()))
  const [capturedAtSource, setCapturedAtSource] = useState<CapturedAtSource>('USER_INPUT')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [locationSource, setLocationSource] = useState<LocationSource | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [species, setSpecies] = useState('')
  const [estimatedSizeCm, setEstimatedSizeCm] = useState('')
  const [lureName, setLureName] = useState('')
  const [lureTypeRaw, setLureTypeRaw] = useState('')
  const [waterClarity, setWaterClarity] = useState<WaterClarity | null>(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = capturedAt && latitude !== null && longitude !== null && waterClarity !== null

  async function handlePhotoSelected(file: File) {
    const exif = await extractPhotoExif(file)
    if (exif.latitude !== null && exif.longitude !== null) {
      setLatitude(exif.latitude)
      setLongitude(exif.longitude)
      setLocationSource('EXIF_GPS')
      setLocationError(null)
    }
    if (exif.capturedAt) {
      setCapturedAt(toDatetimeLocalValue(exif.capturedAt))
      setCapturedAtSource('EXIF')
    }
  }

  async function handleUseDeviceLocation() {
    setLocationError(null)
    try {
      const loc = await requestDeviceLocation()
      setLatitude(loc.latitude)
      setLongitude(loc.longitude)
      setLocationSource('DEVICE_GPS')
    } catch (err) {
      setLocationError(err instanceof Error ? err.message : 'Position indisponible')
    }
  }

  function handleManualLocationChange(lat: number, lng: number) {
    setLatitude(lat)
    setLongitude(lng)
    setLocationSource('MANUAL_PIN')
    setLocationError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !waterClarity || latitude === null || longitude === null || !locationSource) return

    setSubmitting(true)
    setError(null)
    try {
      await createCatch({
        clientId: crypto.randomUUID(),
        latitude,
        longitude,
        locationSource,
        capturedAt: new Date(capturedAt).toISOString(),
        capturedAtSource,
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
        Ajoute une photo pour pré-remplir le lieu et la date — l'analyse automatique (espèce, taille, leurre) arrive bientôt.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PhotoPicker onPhotoSelected={handlePhotoSelected} />

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Date et heure *</span>
          <input
            type="datetime-local"
            required
            value={capturedAt}
            onChange={(e) => {
              setCapturedAt(e.target.value)
              setCapturedAtSource('USER_INPUT')
            }}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Position *</span>
            <button
              type="button"
              onClick={handleUseDeviceLocation}
              className="text-sm text-blue-600 dark:text-blue-400 font-medium"
            >
              Utiliser ma position
            </button>
          </div>
          <LocationFallback
            latitude={latitude}
            longitude={longitude}
            onChange={handleManualLocationChange}
          />
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {locationSource
              ? LOCATION_SOURCE_LABEL[locationSource]
              : 'Touche la carte pour placer le lieu de la prise'}
          </p>
          {locationError && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">{locationError}</p>
          )}
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
