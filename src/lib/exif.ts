import { parse } from 'exifr'

export interface PhotoExifData {
  latitude: number | null
  longitude: number | null
  capturedAt: Date | null
}

/** Extracts GPS coordinates and capture date from a photo's EXIF metadata, entirely client-side. */
export async function extractPhotoExif(file: File): Promise<PhotoExifData> {
  try {
    const data = await parse(file, { gps: true, exif: true })
    const latitude = Number.isFinite(data?.latitude) ? data.latitude : null
    const longitude = Number.isFinite(data?.longitude) ? data.longitude : null
    const rawDate = data?.DateTimeOriginal ?? data?.CreateDate ?? null
    const capturedAt = rawDate instanceof Date ? rawDate : null

    return { latitude, longitude, capturedAt }
  } catch {
    return { latitude: null, longitude: null, capturedAt: null }
  }
}
