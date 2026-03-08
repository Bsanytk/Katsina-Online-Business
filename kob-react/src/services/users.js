import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/firebase'

/**
 * Fetch user profile by UID
 * @param {string} uid - Firebase user ID
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
 * Format WhatsApp number: 
 * Wannan sabon version din yana cire 0 na farko kuma yana barin lambobi kawai.
 * Ba a takaita shi ga Najeriya kadai ba domin ba da damar wasu kasashen.
 */
export function formatWhatsAppNumber(input) {
  if (!input) {
    return { isValid: false, formatted: '', error: 'Phone number is required' }
  }

  // Cire komai banda lambobi
  let cleaned = input.replace(/\D/g, '')

  // Idan lambar ta fara da 0 (kamar 080...), cire 0 din
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1)
  }

  // Tabbatar da tsawon lamba (yawancin kasashe tsakanin 7 zuwa 15)
  if (cleaned.length < 7 || cleaned.length > 15) {
    return {
      isValid: false,
      formatted: '',
      error: 'Please enter a valid phone number with country code (e.g., 2348012345678)',
    }
  }

  return { 
    isValid: true, 
    formatted: cleaned, 
    error: null 
  }
}

/**
 * Update user profile with WhatsApp number
 */
export async function updateUserWhatsApp(uid, whatsappNumber) {
  if (!uid) throw new Error('User ID is required')

  const validation = formatWhatsAppNumber(whatsappNumber)
  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  try {
    const ref = doc(db, 'users', uid)
    
    const updateData = {
      whatsappNumber: validation.formatted,
      updatedAt: serverTimestamp(), // Amfani da lokacin server
    }

    await updateDoc(ref, updateData)

    return {
      uid,
      whatsappNumber: validation.formatted,
      updatedAt: new Date().toISOString(), // Domin UI ta nuna nan take
    }
  } catch (err) {
    throw new Error(`Failed to update WhatsApp number: ${err.message}`)
  }
}

/**
 * Update user profile with multiple fields
 */
export async function updateUserProfile(uid, updates) {
  if (!uid) throw new Error('User ID is required')

  try {
    const ref = doc(db, 'users', uid)
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    }

    await updateDoc(ref, updateData)

    return {
      uid,
      ...updateData,
    }
  } catch (err) {
    throw new Error(`Failed to update user profile: ${err.message}`)
  }
}

/**
 * Generate WhatsApp Link for contacting sellers
 */
export function generateWhatsAppLink(whatsappNumber, productTitle) {
  if (!whatsappNumber) return '#'
  
  // Sako na musamman don B-SANI BIO-CARE MED
  const message = `Hello 👋, I am interested in your product: "${productTitle}" on Katsina Online Business. Is it available?`
  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
}

/**
 * Get seller WhatsApp number
 */
export async function getSellerWhatsApp(sellerUid) {
  if (!sellerUid) return null
  
  try {
    const profile = await getUserProfile(sellerUid)
    return profile.whatsappNumber || null
  } catch (err) {
    console.error('Error fetching seller WhatsApp:', err)
    return null
  }
}

/**
 * Clear WhatsApp number from profile
 */
export async function clearUserWhatsApp(uid) {
  if (!uid) throw new Error('User ID is required')

  try {
    const ref = doc(db, 'users', uid)
    await updateDoc(ref, {
      whatsappNumber: null,
      updatedAt: serverTimestamp(),
    })
  } catch (err) {
    throw new Error(`Failed to clear WhatsApp number: ${err.message}`)
  }
}
