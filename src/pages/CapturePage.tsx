import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CapturedAtSource, LocationSource } from '@shared/types'
import { extractPhotoExif } from '@/lib/exif'
import { compressImage } from '@/lib/imageCompress'
import { requestDeviceLocation } from '@/hooks/useGeolocation'
import { putPendingCatch } from '@/lib/db'
import { runSync } from '@/lib/syncEngine'
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
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [promptText, setPromptText] = useState('')
  const [capturedAt, setCapturedAt] = useState(toDatetimeLocalValue(new Date()))
  const [capturedAtSource, setCapturedAtSource] = useState<CapturedAtSource>('USER_INPUT')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [locationSource, setLocationSource] = useState<LocationSource | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const hasInput = photoFile !== null || promptText.trim().length > 0
  const canContinue = hasInput && latitude !== null && longitude !== null && capturedAt

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
    setPhotoFile(await compressImage(file))
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

  async function handleContinue() {
    if (!canContinue || latitude === null || longitude === null || !locationSource) return
    setSaving(true)

    const now = new Date().toISOString()
    await putPendingCatch({
      clientId: crypto.randomUUID(),
      status: 'pending_sync',
      photoFile,
      latitude,
      longitude,
      locationSource,
      capturedAt: new Date(capturedAt).toISOString(),
      capturedAtSource,
      promptText: promptText.trim() || null,
      ai: null,
      analyzeError: null,
      weather: null,
      weatherError: null,
      syncError: null,
      retryCount: 0,
      createdAt: now,
      updatedAt: now,
    })

    void runSync()
    setSaving(false)
    navigate('/historique')
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Nouvelle prise</h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        Ajoute une photo et/ou décris ta prise, l'IA se charge de pré-remplir les détails — ça
        fonctionne même sans réseau, la synchronisation se fera automatiquement.
      </p>

      <div className="flex flex-col gap-4">
        <PhotoPicker onPhotoSelected={handlePhotoSelected} />

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Description (optionnel)</span>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={3}
            placeholder="Ex : brochet d'environ 60cm pris au spinnerbait, eau trouble"
            className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

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

        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue || saving}
          className="rounded-md bg-blue-600 text-white font-medium py-2 disabled:opacity-50"
        >
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
