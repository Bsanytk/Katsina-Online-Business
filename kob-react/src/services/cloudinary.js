  // Cloudinary upload helper (unsigned upload preset)
// Required env vars (vite):
// VITE_CLOUDINARY_CLOUD_NAME
// VITE_CLOUDINARY_UPLOAD_PRESET

// Usage: import { uploadImage } from '../services/cloudinary'
// const url = await uploadImage(file)

export async function uploadImage(file) {
  if (!file) throw new Error('No file provided')
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !uploadPreset) throw new Error('Missing Cloudinary config env vars')
  try {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)

    const res = await fetch(url, { method: 'POST', body: form })
    const data = await res.json()
    if (!res.ok) {
      console.error('Cloudinary upload error:', { status: res.status, body: data })
      throw new Error(data.error?.message || 'Upload failed')
    }
    // secure_url contains the uploaded image URL
    return data.secure_url
  } catch (err) {
    console.error('Cloudinary upload exception:', { message: err.message })
    throw err
  }
}
