import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma.js'
import { normalizeLureType } from '../../shared/lureType.js'
import { serializeCatch } from '../_lib/serialize.js'
import { uploadCatchPhoto } from '../_lib/blob.js'
import { ValidationError, validateCreateCatchBody } from '../_lib/validate.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const catches = await prisma.catch.findMany({ orderBy: { capturedAt: 'desc' } })
    res.status(200).json(catches.map(serializeCatch))
    return
  }

  if (req.method === 'POST') {
    try {
      const body = validateCreateCatchBody(req.body)

      const photo = body.photoBase64 ? await uploadCatchPhoto(body.photoBase64) : null

      const created = await prisma.catch.create({
        data: {
          clientId: body.clientId,
          latitude: body.latitude,
          longitude: body.longitude,
          locationSource: body.locationSource,
          capturedAt: new Date(body.capturedAt),
          capturedAtSource: body.capturedAtSource,
          waterClarity: body.waterClarity,
          waterClarityConfidence: body.waterClarityConfidence,
          waterClarityUserSet: body.waterClarityUserSet ?? true,
          photoUrl: photo?.url,
          photoPathname: photo?.pathname,
          species: body.species,
          speciesConfidence: body.speciesConfidence,
          estimatedSizeCm: body.estimatedSizeCm,
          sizeConfidence: body.sizeConfidence,
          lureName: body.lureName,
          lureTypeRaw: body.lureTypeRaw,
          lureType: body.lureTypeRaw ? normalizeLureType(body.lureTypeRaw) : undefined,
          lureConfidence: body.lureConfidence,
          rawPrompt: body.rawPrompt,
          aiNotes: body.aiNotes,
          weatherTemperatureC: body.weather?.temperatureC,
          weatherWindSpeedKmh: body.weather?.windSpeedKmh,
          weatherWindDirectionDeg: body.weather?.windDirectionDeg,
          weatherPressureHpa: body.weather?.pressureHpa,
          weatherCloudCoverPct: body.weather?.cloudCoverPct,
          weatherPrecipitationMm: body.weather?.precipitationMm,
          weatherFetchedAt: body.weather?.fetchedAt ? new Date(body.weather.fetchedAt) : undefined,
        },
      })

      res.status(201).json(serializeCatch(created))
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ error: err.message })
        return
      }
      throw err
    }
    return
  }

  res.setHeader('Allow', 'GET, POST')
  res.status(405).json({ error: 'Méthode non autorisée' })
}
