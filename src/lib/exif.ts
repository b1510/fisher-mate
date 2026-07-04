import { parse } from 'exifr'

export interface PhotoExifData {
  latitude: number | null
  longitude: number | null
  capturedAt: Date | null
}

/** Extracts GPS coordinates and capture date from a photo's EXIF metadata, entirely client-side. */
export async function extractPhotoExif(file: File): Promise<PhotoExifData> {
  try {
    const data = await parse(file, { gps: true, pick: ['DateTimeOriginal', 'CreateDate'] })
    const latitude = typeof data?.latitude === 'number' ? data.latitude : null
    const longitude = typeof data?.longitude === 'number' ? data.longitude : null
    const rawDate = data?.DateTimeOriginal ?? data?.CreateDate ?? null
    const capturedAt = rawDate instanceof Date ? rawDate : null

    return { latitude, longitude, capturedAt }
  } catch {
    return { latitude: null, longitude: null, capturedAt: null }
  }
}
