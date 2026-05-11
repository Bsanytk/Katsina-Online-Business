/**
 * profile.js — KOB Profile Service
 *
 * FIXES:
 * ✅ Cloudinary config from env vars
 * ✅ Removed public_id + overwrite (unsigned upload)
 * ✅ Firestore only updated after successful upload
 * ✅ Safe error handling throughout
 */

import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import {
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";

// ================================
// ✅ Cloudinary config from env
// Never hardcode secrets
// ================================
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// ================================
// Get profile
// ================================
export async function getProfile(uid) {
  if (!uid) throw new Error("No user ID");
  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists()) return { id: snap.id, ...snap.data() };
  return { uid };
}

// ================================
// Update profile — safe partial update
// Strict allowlist protects critical fields
// ================================
export async function updateProfile(uid, data) {
  if (!uid) throw new Error("Not authenticated");

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
  ];

  const safe = {};
  ALLOWED.forEach((key) => {
    if (data[key] !== undefined) safe[key] = data[key];
  });

  // Keep phone fields in sync
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
// Upload avatar — Cloudinary unsigned
//
// ✅ FIXES:
// - Config from env vars
// - Removed public_id (causes unsigned upload error)
// - Removed overwrite (not allowed unsigned)
// - Firestore updated ONLY after successful upload
// - Proper error propagation
// ================================
export async function uploadAvatar(file, uid) {
  // Validate file
  if (!file) throw new Error("No file selected");
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Image must be under 2MB");
  }
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    throw new Error("Only JPG, PNG or WebP allowed");
  }

  // Validate env
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary config missing. Check VITE_CLOUDINARY_* env vars."
    );
  }

  // Build form — unsigned upload only needs file + preset
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", `kob/avatars`);
  // ✅ NO public_id — causes unsigned upload rejection
  // ✅ NO overwrite — not allowed for unsigned presets

  // Upload to Cloudinary
  const res = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Upload failed (${res.status})`);
  }

  const result = await res.json();
  const url = result.secure_url;

  if (!url) throw new Error("Upload succeeded but no URL returned");

  // ✅ Only update Firestore AFTER successful upload
  await updateDoc(doc(db, "users", uid), {
    photoURL: url,
    updatedAt: serverTimestamp(),
  });

  return url;
}

// ================================
// Profile completion score 0–100
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
// ================================
export async function deleteAccount(currentPwd) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  const cred = EmailAuthProvider.credential(user.email, currentPwd);
  await reauthenticateWithCredential(user, cred);
  await deleteUser(user);
}
