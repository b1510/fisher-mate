import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma.js'
import { normalizeLureType } from '../../shared/lureType.js'
import { serializeCatch } from '../_lib/serialize.js'
import { deleteCatchPhoto } from '../_lib/blob.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'id invalide' })
    return
  }

  if (req.method === 'GET') {
    const found = await prisma.catch.findUnique({ where: { id } })
    if (!found) {
      res.status(404).json({ error: 'Prise introuvable' })
      return
    }
    res.status(200).json(serializeCatch(found))
    return
  }

  if (req.method === 'PATCH') {
    interface WeatherPatch {
      temperatureC?: number | null
      windSpeedKmh?: number | null
      windDirectionDeg?: number | null
      pressureHpa?: number | null
      cloudCoverPct?: number | null
      precipitationMm?: number | null
      fetchedAt?: string | null
    }
    const body = (req.body ?? {}) as Record<string, unknown> & { weather?: WeatherPatch }
    const { capturedAt, lureTypeRaw, weather, ...rest } = body
    const w: WeatherPatch = weather ?? {}

    try {
      const updated = await prisma.catch.update({
        where: { id },
        data: {
          ...rest,
          ...(typeof capturedAt === 'string' ? { capturedAt: new Date(capturedAt) } : {}),
          ...(typeof lureTypeRaw === 'string'
            ? { lureTypeRaw, lureType: normalizeLureType(lureTypeRaw) }
            : {}),
          ...(weather
            ? {
                weatherTemperatureC: w.temperatureC,
                weatherWindSpeedKmh: w.windSpeedKmh,
                weatherWindDirectionDeg: w.windDirectionDeg,
                weatherPressureHpa: w.pressureHpa,
                weatherCloudCoverPct: w.cloudCoverPct,
                weatherPrecipitationMm: w.precipitationMm,
                weatherFetchedAt: w.fetchedAt ? new Date(w.fetchedAt) : undefined,
              }
            : {}),
        },
      })
      res.status(200).json(serializeCatch(updated))
    } catch {
      res.status(404).json({ error: 'Prise introuvable' })
    }
    return
  }

  if (req.method === 'DELETE') {
    try {
      const deleted = await prisma.catch.delete({ where: { id } })
      if (deleted.photoPathname) {
        await deleteCatchPhoto(deleted.photoPathname).catch(() => {})
      }
      res.status(204).end()
    } catch {
      res.status(404).json({ error: 'Prise introuvable' })
    }
    return
  }

  res.setHeader('Allow', 'GET, PATCH, DELETE')
  res.status(405).json({ error: 'Méthode non autorisée' })
}
