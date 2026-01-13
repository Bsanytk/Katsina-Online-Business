// Cloudinary upload helper (unsigned upload preset)
// Required env vars (vite):
// VITE_CLOUDINARY_CLOUD_NAME
// VITE_CLOUDINARY_UPLOAD_PRESET

// Usage: import { uploadImage } from '../services/cloudinary'
// const url = await uploadImage(file)

export async function uploadImage(file) {
  if (!file) throw new Error('No file provided')
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !preset) throw new Error('Missing Cloudinary config env vars')

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', preset)

  const res = await fetch(url, { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed')
  // secure_url contains the uploaded image URL
  return data.secure_url
}
