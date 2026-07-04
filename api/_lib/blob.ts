import { put, del } from '@vercel/blob'

export async function uploadCatchPhoto(base64: string): Promise<{ url: string; pathname: string }> {
  const buffer = Buffer.from(base64, 'base64')
  const pathname = `catches/${crypto.randomUUID()}.jpg`
  await put(pathname, buffer, {
    access: 'private',
    contentType: 'image/jpeg',
  })
  return { url: `/api/photo?pathname=${encodeURIComponent(pathname)}`, pathname }
}

export async function deleteCatchPhoto(pathname: string): Promise<void> {
  await del(pathname)
}
