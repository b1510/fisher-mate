import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'
import { normalizeLureType } from '../_lib/lureType'

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
    res.status(200).json(found)
    return
  }

  if (req.method === 'PATCH') {
    const body = (req.body ?? {}) as Record<string, unknown>
    const { capturedAt, lureTypeRaw, ...rest } = body

    try {
      const updated = await prisma.catch.update({
        where: { id },
        data: {
          ...rest,
          ...(typeof capturedAt === 'string' ? { capturedAt: new Date(capturedAt) } : {}),
          ...(typeof lureTypeRaw === 'string'
            ? { lureTypeRaw, lureType: normalizeLureType(lureTypeRaw) }
            : {}),
        },
      })
      res.status(200).json(updated)
    } catch {
      res.status(404).json({ error: 'Prise introuvable' })
    }
    return
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.catch.delete({ where: { id } })
      res.status(204).end()
    } catch {
      res.status(404).json({ error: 'Prise introuvable' })
    }
    return
  }

  res.setHeader('Allow', 'GET, PATCH, DELETE')
  res.status(405).json({ error: 'Méthode non autorisée' })
}
