import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

const USERS_COL = 'users'

/**
 * Fetches the full profile for a specific user
 */
export async function getUserProfile(uid) {
  if (!uid) throw new Error('User UID is required')
  const ref = doc(db, USERS_COL, uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('User profile not found')
  return { uid: snap.id, ...snap.data() }
}

/**
 * Updates user profile fields in Firestore
 */
export async function updateUserProfile(uid, data) {
  if (!uid) throw new Error('User UID is required')
  const ref = doc(db, USERS_COL, uid)
  const payload = { 
    ...data, 
    updatedAt: new Date().toISOString() 
  }
  await updateDoc(ref, payload)
  return true
}

/**
 * Production-grade WhatsApp Validator
 * Handles multiple countries and strips formatting
 */
export function formatWhatsAppNumber(input) {
  if (!input) return { isValid: false, error: 'Number is required' }

  // 1. Remove all non-numeric characters (spaces, dashes, plus signs)
  let cleaned = input.replace(/\D/g, '')

  // 2. Handle leading zeros (e.g., 070... becomes 70...)
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1)
  }

  // 3. Validation Logic
  // Most African/International numbers (excluding country code) are 8-11 digits
  const minLength = 8
  const maxLength = 15 // Global max for E.164 standard

  if (cleaned.length < minLength) {
    return { 
      isValid: false, 
      error: `Number too short (min ${minLength} digits required)` 
    }
  }

  if (cleaned.length > maxLength) {
    return { 
      isValid: false, 
      error: 'Number too long. Please check for extra digits.' 
    }
  }

  // 4. Return the "Clean" version for the wa.me link
  return {
    isValid: true,
    formatted: cleaned, // This is what goes into the https://wa.me/XXXXXX link
    error: null
  }
}
