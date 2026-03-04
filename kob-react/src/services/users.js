import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

/**
 * Fetch user profile by UID
 * @param {string} uid - Firebase user ID
 * @returns {Promise<Object>} User profile data
 */
export async function getUserProfile(uid) {
  if (!uid) throw new Error('User ID is required')
  
  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    
    if (!snap.exists()) {
      throw new Error('User profile not found')
    }
    
    return {
      uid,
      ...snap.data(),
    }
  } catch (err) {
    throw new Error(`Failed to fetch user profile: ${err.message}`)
  }
}

/**
 * Format WhatsApp number: remove non-digits, validate Nigerian format
 * @param {string} input - Raw phone number input
 * @returns {Object} { isValid: boolean, formatted: string, error: string }
 */
export function formatWhatsAppNumber(input) {
  if (!input) {
    return { isValid: false, formatted: '', error: 'Phone number is required' }
  }

  // Remove all non-digits
  const cleaned = input.replace(/\D/g, '')

  // Nigerian number must be 13 digits starting with 234
  if (cleaned.length === 13 && cleaned.startsWith('234')) {
    return { isValid: true, formatted: cleaned, error: null }
  }

  // If it's 11 digits (Nigerian format without country code), prepend 234
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    const formatted = '234' + cleaned.slice(1)
    return { isValid: true, formatted, error: null }
  }

  if (cleaned.length === 10) {
    const formatted = '234' + cleaned
    return { isValid: true, formatted, error: null }
  }

  return {
    isValid: false,
    formatted: '',
    error: 'Please enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)',
  }
}

/**
 * Update user profile with WhatsApp number
 * @param {string} uid - Firebase user ID
 * @param {string} whatsappNumber - WhatsApp number (formatted)
 * @returns {Promise<Object>} Updated user data
 */
export async function updateUserWhatsApp(uid, whatsappNumber) {
  if (!uid) throw new Error('User ID is required')

  // Validate format
  const validation = formatWhatsAppNumber(whatsappNumber)
  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  try {
    const ref = doc(db, 'users', uid)
    
    const updateData = {
      whatsappNumber: validation.formatted,
      updatedAt: new Date().toISOString(),
    }

    await updateDoc(ref, updateData)

    return {
      uid,
      whatsappNumber: validation.formatted,
      updatedAt: updateData.updatedAt,
    }
  } catch (err) {
    throw new Error(`Failed to update WhatsApp number: ${err.message}`)
  }
}

/**
 * Generate safe WhatsApp link for contacting seller
 * @param {string} whatsappNumber - Seller's WhatsApp number (without +)
 * @param {Object} product - Product object with name field
 * @returns {string} WhatsApp direct message link
 */
export function generateWhatsAppLink(whatsappNumber, product) {
  if (!whatsappNumber || !product?.name) {
    throw new Error('WhatsApp number and product name are required')
  }

  // Message template
  const message = `Hello 👋\nI saw your product "${product.name}" on Katsina Online Business.\nIs it still available?`

  // Encode message properly for URL
  const encodedMessage = encodeURIComponent(message)

  // Generate WhatsApp Web link (works on mobile and desktop)
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
}

/**
 * Get seller WhatsApp for contacting from product
 * @param {string} sellerUid - Seller's Firebase UID
 * @returns {Promise<string|null>} WhatsApp number or null
 */
export async function getSellerWhatsApp(sellerUid) {
  if (!sellerUid) return null
  
  try {
    const profile = await getUserProfile(sellerUid)
    return profile.whatsappNumber || null
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('Error fetching seller WhatsApp:', err)
    }
    return null
  }
}

/**
 * Remove/clear WhatsApp number from user profile
 * @param {string} uid - Firebase user ID
 * @returns {Promise<void>}
 */
export async function clearUserWhatsApp(uid) {
  if (!uid) throw new Error('User ID is required')

  try {
    const ref = doc(db, 'users', uid)
    
    await updateDoc(ref, {
      whatsappNumber: '',
      updatedAt: new Date().toISOString(),
    })
  } catch (err) {
    throw new Error(`Failed to clear WhatsApp number: ${err.message}`)
  }
}
