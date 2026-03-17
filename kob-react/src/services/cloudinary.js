/**
 * Cloudinary upload helper (unsigned upload preset)
 * Updated for KOB Marketplace "Pro-Update" branch
 */

export async function uploadImage(file, timeoutMs = 15000) { // Increased timeout for better stability
  if (!file) throw new Error('No file provided')

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing. Check your .env file.')
  }
  
  try {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)
    // Optional: Add folder tag for organization in Cloudinary
    form.append('folder', 'kob_marketplace_products')

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
      throw new Error(errorMsg)
    }
    
    if (!data.secure_url) {
      throw new Error('Upload succeeded but no URL returned')
    }

    /**
     * OPTIMIZATION STEP:
     * We modify the URL to include auto-format and auto-quality.
     * This saves up to 70% bandwidth for your users in Katsina.
     */
    const optimizedUrl = data.secure_url.replace(
      '/upload/',
      '/upload/f_auto,q_auto/'
    )
    
    return optimizedUrl

  } catch (err) {
    // Timeout Handling
    if (err.name === 'AbortError') {
      throw new Error('Upload took too long. Please check your internet connection.')
    }
    
    // Network Connectivity Handling
    if (err instanceof TypeError) {
      throw new Error('Network error: Could not reach the image server.')
    }
    
    if (import.meta.env.DEV) {
      console.error(err)
    }
    throw err
  }
}

/**
 * Helper to delete/transform images if needed (Requires Admin API or Signed Uploads)
 * For unsigned uploads, deletion is usually handled via Cloudinary Dashboard.
 */
