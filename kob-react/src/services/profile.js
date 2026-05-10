/**
 * services/profile.js — KOB Profile Service Layer
 *
 * MISSION: Only place that writes profile to Firestore.
 * - Centralized, safe, validated updates
 * - Never overwrites unrelated fields (uses merge)
 * - Backward compatible with old user documents
 * - Cloudinary image upload
 * - Password change
 * - Account deletion
 */

import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";

// ================================
// Cloudinary config
// ================================
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dn5crslee/image/upload";
const UPLOAD_PRESET = "kob_profiles";

// ================================
// Get profile — with safe fallback
// ================================
export async function getProfile(uid) {
  if (!uid) throw new Error("No user ID");
  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists()) return { id: snap.id, ...snap.data() };
  return { uid }; // Fallback for brand new users
}

// ================================
// Update profile — SAFE partial update
// Never touches: role, kobNumber,
//   isVerified, isAdmin, createdAt, email
// ================================
export async function updateProfile(uid, data) {
  if (!uid) throw new Error("Not authenticated");

  // Strict allowlist — protect critical fields
  const ALLOWED = [
    "displayName",
    "businessName",
    "bio",
    "photoURL",
    "location",
    "fullAddress",
    "phone",
    "phoneNumber",
    "whatsappNumber",
    "socialLinks",
    "kobExpress",
  ];

  const safe = {};
  ALLOWED.forEach((key) => {
    if (data[key] !== undefined) {
      safe[key] = data[key];
    }
  });

  // Keep phoneNumber + whatsappNumber in sync
  if (safe.phone && !safe.phoneNumber) {
    safe.phoneNumber = safe.phone;
  }
  if (safe.phoneNumber && !safe.phone) {
    safe.phone = safe.phoneNumber;
  }

  await updateDoc(doc(db, "users", uid), {
    ...safe,
    updatedAt: serverTimestamp(),
  });

  return safe;
}

// ================================
// Upload avatar — Cloudinary
// Returns new photoURL
// ================================
export async function uploadAvatar(file, uid) {
  // Validate
  if (!file) throw new Error("No file selected");
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be under 5MB");
  }
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    throw new Error("Only JPG, PNG, or WebP allowed");
  }

  // Upload to Cloudinary
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", `kob/profiles/${uid}`);
  form.append("public_id", `avatar_${uid}`);
  form.append("overwrite", "true");

  const res = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Upload failed");
  }

  const result = await res.json();
  const url = result.secure_url;

  // Save to Firestore — only photoURL
  await updateDoc(doc(db, "users", uid), {
    photoURL: url,
    updatedAt: serverTimestamp(),
  });

  return url;
}

// ================================
// Profile completion score
// 0–100 based on filled fields
// ================================
export function getCompletionScore(profile = {}) {
  const checks = [
    Boolean(profile.displayName?.trim()),
    Boolean(profile.photoURL),
    Boolean(profile.bio?.trim()),
    Boolean(profile.location?.trim()),
    Boolean(profile.whatsappNumber?.trim() || profile.phone?.trim()),
    Boolean(profile.businessName?.trim() || profile.role === "buyer"),
    Boolean(profile.fullAddress?.trim()),
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

// ================================
// Change password — requires re-auth
// ================================
export async function changePassword(currentPwd, newPwd) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  if (newPwd.length < 6) {
    throw new Error("New password must be at least 6 characters");
  }

  const cred = EmailAuthProvider.credential(user.email, currentPwd);
  await reauthenticateWithCredential(user, cred);
  await updatePassword(user, newPwd);
}

// ================================
// Delete account — requires re-auth
// Removes Firebase Auth user
// Note: Firestore data retained per KOB policy
// ================================
export async function deleteAccount(currentPwd) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const cred = EmailAuthProvider.credential(user.email, currentPwd);
  await reauthenticateWithCredential(user, cred);
  await deleteUser(user);
}
