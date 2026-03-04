  // Cloudinary upload helper (unsigned upload preset)
// Required env vars (vite):
// VITE_CLOUDINARY_CLOUD_NAME
// VITE_CLOUDINARY_UPLOAD_PRESET

// Usage: import { uploadImage } from '../services/cloudinary'
// const url = await uploadImage(file)

export async function uploadImage(file, timeoutMs = 10000) {
  if (!file) throw new Error('No file provided')
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !uploadPreset) throw new Error('Missing Cloudinary config env vars')
  
  try {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const res = await fetch(url, { 
      method: 'POST', 
      body: form,
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    const data = await res.json()
    
    if (!res.ok) {
      const errorMsg = data.error?.message || 'Upload failed'
      if (import.meta.env.DEV) {
        console.error('Cloudinary upload error:', { 
          status: res.status, 
          error: errorMsg,
          fullResponse: data 
        })
      }
      throw new Error(errorMsg)
    }
    
    // Validate response contains secure_url
    if (!data.secure_url) {
      throw new Error('Upload succeeded but no URL returned')
    }
    
    return data.secure_url
  } catch (err) {
    // Handle abort/timeout error
    if (err.name === 'AbortError') {
      const timeoutError = new Error('Upload timeout: request took too long')
      if (import.meta.env.DEV) console.error('Cloudinary upload timeout:', { timeoutMs })
      throw timeoutError
    }
    
    // Handle network errors
    if (err instanceof TypeError && err.message.includes('fetch')) {
      const networkError = new Error('Network error: failed to reach upload service')
      if (import.meta.env.DEV) console.error('Cloudinary network error:', { message: err.message })
      throw networkError
    }
    
    // Log all other errors
    if (import.meta.env.DEV) {
      console.error('Cloudinary upload exception:', { 
        message: err.message,
        stack: err.stack
      })
    }
    throw err
  }
}
