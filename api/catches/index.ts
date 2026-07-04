import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'
import { normalizeLureType } from '../_lib/lureType'
import { ValidationError, validateCreateCatchBody } from '../_lib/validate'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const catches = await prisma.catch.findMany({ orderBy: { capturedAt: 'desc' } })
    res.status(200).json(catches)
    return
  }

  if (req.method === 'POST') {
    try {
      const body = validateCreateCatchBody(req.body)

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
          photoUrl: body.photoUrl,
          photoPathname: body.photoPathname,
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
        },
      })

      res.status(201).json(created)
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
