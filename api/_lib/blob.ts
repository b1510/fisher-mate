import { put, del } from '@vercel/blob'

export async function uploadCatchPhoto(base64: string): Promise<{ url: string; pathname: string }> {
  const buffer = Buffer.from(base64, 'base64')
  const blob = await put(`catches/${crypto.randomUUID()}.jpg`, buffer, {
    access: 'public',
    contentType: 'image/jpeg',
  })
  return { url: blob.url, pathname: blob.pathname }
}

export async function deleteCatchPhoto(pathname: string): Promise<void> {
  await del(pathname)
}
