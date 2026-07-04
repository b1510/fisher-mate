import type { VercelRequest, VercelResponse } from '@vercel/node'
import { get } from '@vercel/blob'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ error: 'Méthode non autorisée' })
    return
  }

  const pathname = req.query.pathname
  if (typeof pathname !== 'string') {
    res.status(400).json({ error: 'pathname requis' })
    return
  }

  const result = await get(pathname, { access: 'private' })
  if (!result || result.statusCode !== 200 || !result.stream) {
    res.status(404).json({ error: 'Photo introuvable' })
    return
  }

  res.setHeader('Content-Type', result.blob.contentType)
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', 'private, no-cache')

  const reader = result.stream.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    res.write(value)
  }
  res.end()
}
