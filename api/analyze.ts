import type { VercelRequest, VercelResponse } from '@vercel/node'
import { runFishCatchAnalysis, type RawAIField } from './_lib/openai.js'
import { AI_CONFIDENCE_THRESHOLD } from '../shared/constants.js'

function toFieldResult<T>(field: RawAIField<T>) {
  return {
    value: field.value,
    confidence: field.confidence,
    needsReview: field.value === null || field.confidence < AI_CONFIDENCE_THRESHOLD,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Méthode non autorisée' })
    return
  }

  const body = (req.body ?? {}) as { photoBase64?: string; promptText?: string }
  if (!body.photoBase64 && !body.promptText) {
    res.status(400).json({ error: 'Photo ou description requise' })
    return
  }

  try {
    const raw = await runFishCatchAnalysis({
      photoBase64: body.photoBase64,
      promptText: body.promptText,
    })

    res.status(200).json({
      species: toFieldResult(raw.species),
      estimatedSizeCm: toFieldResult(raw.estimatedSizeCm),
      lureName: toFieldResult(raw.lureName),
      lureTypeRaw: toFieldResult(raw.lureTypeRaw),
      waterClarity: toFieldResult(raw.waterClarity),
      notes: raw.notes,
    })
  } catch (err) {
    res.status(502).json({ error: err instanceof Error ? err.message : "Échec de l'analyse IA" })
  }
}
