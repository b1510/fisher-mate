import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getWeatherSnapshot } from './_lib/openMeteo'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Méthode non autorisée' })
    return
  }

  const body = (req.body ?? {}) as { latitude?: number; longitude?: number; capturedAt?: string }
  if (
    typeof body.latitude !== 'number' ||
    typeof body.longitude !== 'number' ||
    typeof body.capturedAt !== 'string' ||
    Number.isNaN(Date.parse(body.capturedAt))
  ) {
    res.status(400).json({ error: 'latitude, longitude et capturedAt sont requis' })
    return
  }

  try {
    const snapshot = await getWeatherSnapshot(body.latitude, body.longitude, new Date(body.capturedAt))
    res.status(200).json(snapshot)
  } catch (err) {
    res.status(502).json({ error: err instanceof Error ? err.message : 'Échec de la récupération météo' })
  }
}
