import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const USERS_COL = "users";

/**
 * Fetches the full profile for a specific user
 */
export async function getUserProfile(uid) {
  if (!uid) throw new Error("User UID is required");
  const ref = doc(db, USERS_COL, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("User profile not found");
  return { uid: snap.id, ...snap.data() };
}

/**
 * Updates user profile fields in Firestore
 */
export async function updateUserProfile(uid, data) {
  if (!uid) throw new Error("User UID is required");
  const ref = doc(db, USERS_COL, uid);
  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await updateDoc(ref, payload);
  return true;
}

/**
 * NEW: Fetches the seller's WhatsApp number specifically for the Contact Button
 * This resolves the Vercel build error ya gyaru.
 */
export async function getSellerWhatsApp(sellerUid) {
  if (!sellerUid) return null;
  try {
    const profile = await getUserProfile(sellerUid);
    // Canza 'whatsapp' zuwa 'whatsappNumber' don ya dace da Form dinmu
    return profile.whatsappNumber || profile.whatsapp || profile.phone || null;
  } catch (err) {
    console.error("Error fetching seller WhatsApp:", err);
    return null;
  }
}

/**
 * Production-grade WhatsApp Validator
 * Handles multiple countries and strips formatting
 */
export function formatWhatsAppNumber(input) {
  if (!input) return { isValid: false, error: "Number is required" };

  // 1. Remove all non-numeric characters (spaces, dashes, plus signs)
  let cleaned = input.replace(/\D/g, "");

  // 2. Handle leading zeros (e.g., 070... becomes 70...)
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }

  // 3. Validation Logic
  const minLength = 8;
  const maxLength = 15;

  if (cleaned.length < minLength) {
    return {
      isValid: false,
      error: `Number too short (min ${minLength} digits required)`,
    };
  }

  if (cleaned.length > maxLength) {
    return {
      isValid: false,
      error: "Number too long. Please check for extra digits.",
    };
  }

  return {
    isValid: true,
    formatted: cleaned,
    error: null,
  };
}

/**
 * NEW: Generates the safe WhatsApp link used by the Marketplace
 * This resolves the second missing export error.
 */
export function generateWhatsAppLink(number, product) {
  // 1. Gyara lambar (cire tsofaffin haruffa, bar lambobi kawai)
  const validation = formatWhatsAppNumber(number);
  if (!validation.isValid) return "#";

  const finalNumber = validation.formatted;

  // Idan lambar ba ta da 'plus' ko 'country code' a gaba,
  // kuma ka san yawancin masu amfani da kai daga Nigeria suke,
  // zaka iya barin 234 a matsayin fallback.
  // Amma idan mai kanti ya riga ya adana lambarsa da +227 ko +233,
  // 'formatWhatsAppNumber' zai riga ya bar lambobin a ciki.

  const message = `Hello, I'm interested in your product: ${
    product?.title || product?.name || "this item"
  } on KOB Marketplace.`;

  return `https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`;
}
