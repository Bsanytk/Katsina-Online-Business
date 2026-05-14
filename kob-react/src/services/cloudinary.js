/**
 * cloudinary.js — KOB Marketplace Cloudinary Service
 *
 * PRESERVED:
 * ✅ uploadImage() — existing logic fully intact
 * ✅ timeout handling
 * ✅ f_auto,q_auto optimization
 * ✅ AbortController pattern
 *
 * ADDED:
 * ✅ buildUrl() — transform helper
 * ✅ avatarUrl() — team member photos
 * ✅ productUrl() — product thumbnails
 * ✅ fallbackAvatar() — initials fallback
 * ✅ All new helpers use same env vars
 */

// ================================
// EXISTING — preserved exactly
// ================================
export async function uploadImage(file, timeoutMs = 15000) {
  if (!file) throw new Error('No file provided')

  const cloudName    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary configuration is missing. Check your .env file.'
    )
  }

  try {
    const url  = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const form = new FormData()
    form.append('file',          file)
    form.append('upload_preset', uploadPreset)
    form.append('folder',        'kob_marketplace_products')

    const controller = new AbortController()
    const timeoutId  = setTimeout(() => controller.abort(), timeoutMs)

    const res = await fetch(url, {
      method: 'POST',
      body:   form,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error?.message || 'Upload failed')
    }
    if (!data.secure_url) {
      throw new Error('Upload succeeded but no URL returned')
    }

    // f_auto,q_auto — saves up to 70% bandwidth
    const optimizedUrl = data.secure_url.replace(
      '/upload/',
      '/upload/f_auto,q_auto/'
    )

    return optimizedUrl

  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(
        'Upload took too long. Please check your internet connection.'
      )
    }
    if (err instanceof TypeError) {
      throw new Error(
        'Network error: Could not reach the image server.'
      )
    }
    if (import.meta.env.DEV) console.error(err)
    throw err
  }
}

// ================================
// NEW — buildUrl()
// Core transform helper for all
// image types in KOB platform
// ================================
export function buildUrl(publicIdOrUrl, transforms = {}) {
  if (!publicIdOrUrl) return null

  // If it's already a full Cloudinary URL — inject transforms
  if (publicIdOrUrl.includes('cloudinary.com')) {
    const {
      width   = 'auto',
      height  = 'auto',
      crop    = 'fill',
      quality = 'auto',
      format  = 'auto',
    } = transforms

    const t = [
      width  !== 'auto' ? `w_${width}`   : null,
      height !== 'auto' ? `h_${height}`  : null,
      `c_${crop}`,
      `q_${quality}`,
      `f_${format}`,
    ].filter(Boolean).join(',')

    return publicIdOrUrl.replace('/upload/', `/upload/${t}/`)
  }

  // If it's a publicId — build from env
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  if (!cloudName) return null

  const {
    width   = 400,
    height  = 400,
    crop    = 'fill',
    gravity = 'auto',
    quality = 'auto',
    format  = 'auto',
  } = transforms

  const t = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `g_${gravity}`,
    `q_${quality}`,
    `f_${format}`,
  ].join(',')

  return `https://res.cloudinary.com/${cloudName}/image/upload/${t}/${publicIdOrUrl}`
}

// ================================
// NEW — avatarUrl()
// Optimized for team member photos
// Face-gravity + square crop
// ================================
export function avatarUrl(src, size = 300) {
  if (!src) return null

  // Full URL with gravity=face
  if (src.includes('cloudinary.com')) {
    const t = `w_${size},h_${size},c_fill,g_face,q_auto,f_auto`
    // Replace existing upload transform or insert new
    return src.includes('/upload/f_auto')
      ? src.replace('/upload/f_auto,q_auto/', `/upload/${t}/`)
      : src.replace('/upload/', `/upload/${t}/`)
  }

  return buildUrl(src, {
    width: size, height: size,
    crop: 'fill', gravity: 'face',
    quality: 'auto', format: 'auto',
  })
}

// ================================
// NEW — productUrl()
// Optimized for product thumbnails
// Different sizes per context
// ================================
export function productUrl(src, { width = 400, height = 400 } = {}) {
  if (!src) return null
  return buildUrl(src, {
    width, height,
    crop: 'fill', gravity: 'auto',
    quality: 'auto', format: 'auto',
  })
}

// ================================
// NEW — fallbackAvatar()
// Generates initials-based fallback
// Used when Cloudinary image fails
// ================================
export function fallbackAvatar(name = '', size = 300) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=4B3621&color=D4AF37&size=${size}&bold=true&rounded=true`
}
