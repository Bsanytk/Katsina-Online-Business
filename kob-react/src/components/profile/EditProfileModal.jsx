/**
 * EditProfileModal.jsx
 *
 * - Consumes ProfileContext (no duplicate reads)
 * - Uses services/profile.js (safe writes)
 * - Optimistic UI update (instant feedback)
 * - Backward compatible with existing Firestore docs
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "../../contexts/ProfileContext";
import { updateProfile, uploadAvatar } from "../../services/profile";
import SuccessModal from "./SuccessModal";

// ================================
// Country codes
// ================================
const CODES = [
  { code: "+234", flag: "🇳🇬", name: "NG" },
  { code: "+227", flag: "🇳🇪", name: "NE" },
  { code: "+233", flag: "🇬🇭", name: "GH" },
  { code: "+1", flag: "🇺🇸", name: "US" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
];

const LOCATIONS = [
  "Katsina Central",
  "Daura",
  "Funtua",
  "Dutsin-Ma",
  "Kankia",
  "Mani",
  "Malumfashi",
  "Jibia",
  "Other",
];

// ================================
// Field component
// ================================
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
  required,
  hint,
  error,
}) {
  return (
    <div>
      <label
        className="block text-[10px] font-bold
        uppercase tracking-widest text-gray-400 mb-1.5"
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={3}
          className={`w-full px-4 py-3 border-2 rounded-xl
            text-sm outline-none resize-none transition-colors
            placeholder:text-gray-300
            ${
              error
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-[#4B3621]"
            }`}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 py-3 border-2 rounded-xl
            text-sm outline-none transition-colors
            placeholder:text-gray-300
            ${
              error
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-[#4B3621]"
            }`}
        />
      )}
      <div className="flex justify-between mt-1">
        {error ? (
          <p className="text-[10px] text-red-500">{error}</p>
        ) : hint ? (
          <p className="text-[10px] text-gray-400">{hint}</p>
        ) : (
          <span />
        )}
        {maxLength && (
          <p className="text-[10px] text-gray-300">
            {String(value || "").length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

// ================================
// Avatar section
// ================================
function AvatarSection({ profile, uid, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const initials =
    profile?.displayName
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase()
      ?.slice(0, 2) || "?";

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    setUploading(true);
    try {
      const url = await uploadAvatar(file, uid);
      onUpdate(url);
      setPreview(null);
    } catch (err) {
      alert(err.message);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center pb-4">
      <div className="relative">
        <div
          className="w-24 h-24 rounded-3xl overflow-hidden
          border-4 border-white shadow-xl bg-[#4B3621]
          flex items-center justify-center"
        >
          {preview || profile?.photoURL ? (
            <img
              src={preview || profile.photoURL}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-2xl font-bold">{initials}</span>
          )}
          {uploading && (
            <div
              className="absolute inset-0 bg-black/50
              flex items-center justify-center"
            >
              <svg
                className="animate-spin w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1 -right-1 w-8 h-8
            bg-[#4B3621] text-white rounded-xl
            flex items-center justify-center shadow-lg
            border-2 border-white hover:bg-[#362818]
            transition-colors disabled:opacity-50"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2
              2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0
              0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0
              01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          className="hidden"
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-2">Tap icon to change photo</p>
    </div>
  );
}

// ================================
// Main Modal
// ================================
export default function EditProfileModal({ show, onClose }) {
  const { profile, updateLocalProfile } = useProfile();

  const [form, setForm] = useState({});
  const [countryCode, setCode] = useState("+234");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setSuccess] = useState(false);

  // Pre-fill form from ProfileContext
  useEffect(() => {
    if (!profile || !show) return;
    setForm({
      displayName: profile.displayName || "",
      businessName: profile.businessName || "",
      bio: profile.bio || "",
      location: profile.location || "",
      fullAddress: profile.fullAddress || "",
      phone: profile.phone || "",
      whatsappNumber: profile.whatsappNumber || "",
      photoURL: profile.photoURL || "",
    });
    setErrors({});
  }, [profile, show]);

  function set(key) {
    return (val) => {
      setForm((p) => ({ ...p, [key]: val }));
      if (errors[key]) {
        setErrors((p) => ({ ...p, [key]: null }));
      }
    };
  }

  function validate() {
    const errs = {};
    if (!form.displayName?.trim()) {
      errs.displayName = "Full name is required";
    }
    return errs;
  }

  async function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      // Format phone numbers
      const clean = (n) => (n ? `${countryCode}${n.replace(/^0/, "")}` : "");

      const payload = {
        ...form,
        phone: form.phone ? clean(form.phone) : profile?.phone || "",
        whatsappNumber: form.whatsappNumber
          ? clean(form.whatsappNumber)
          : profile?.whatsappNumber || "",
      };

      // Write to Firestore safely
      await updateProfile(profile.uid, payload);

      // Optimistic update — instant UI refresh
      updateLocalProfile(payload);

      setSuccess(true);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setSaving(false);
    }
  }

  function handleSuccessClose() {
    setSuccess(false);
    onClose();
  }

  return (
    <>
      {/* Success modal on top */}
      <SuccessModal
        show={showSuccess}
        onClose={handleSuccessClose}
        title="Profile Updated!"
        subtitle="Your shop info is live and up to date."
      />

      <AnimatePresence>
        {show && !showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end
              md:items-center justify-center
              bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg
                rounded-t-3xl md:rounded-3xl shadow-2xl
                max-h-[92vh] flex flex-col"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between
                px-6 py-5 border-b border-gray-100 flex-shrink-0"
              >
                <div>
                  <h2
                    className="text-base font-bold
                    text-[#2C1F0E]"
                  >
                    Edit Profile
                  </h2>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Changes are saved securely
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center
                    justify-center rounded-xl bg-gray-100
                    text-gray-500 hover:bg-gray-200 transition"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Scrollable body */}
              <div
                className="flex-1 overflow-y-auto
                px-6 py-5 space-y-5"
              >
                {/* Avatar */}
                <AvatarSection
                  profile={{ ...profile, ...form }}
                  uid={profile?.uid}
                  onUpdate={(url) => {
                    set("photoURL")(url);
                    updateLocalProfile({ photoURL: url });
                  }}
                />

                {/* General error */}
                {errors.general && (
                  <div
                    className="p-3.5 bg-red-50 border
                    border-red-100 rounded-xl"
                  >
                    <p className="text-xs text-red-700 font-medium">
                      ⚠ {errors.general}
                    </p>
                  </div>
                )}

                {/* Full Name */}
                <Field
                  label="Full Name"
                  value={form.displayName}
                  onChange={set("displayName")}
                  placeholder="Your full name"
                  maxLength={60}
                  required
                  error={errors.displayName}
                />

                {/* Business Name */}
                {(profile?.role === "seller" || profile?.role === "admin") && (
                  <Field
                    label="Business / Shop Name"
                    value={form.businessName}
                    onChange={set("businessName")}
                    placeholder="Your shop name"
                    maxLength={80}
                    hint="Shown on your public seller page"
                  />
                )}

                {/* Bio */}
                <Field
                  label="Bio"
                  value={form.bio}
                  onChange={set("bio")}
                  type="textarea"
                  placeholder="Tell buyers about yourself..."
                  maxLength={200}
                />

                {/* Location */}
                <div>
                  <label
                    className="block text-[10px] font-bold
                    uppercase tracking-widest text-gray-400 mb-1.5"
                  >
                    Region
                  </label>
                  <select
                    value={form.location || ""}
                    onChange={(e) => set("location")(e.target.value)}
                    className="w-full px-4 py-3 border-2
                      border-gray-200 rounded-xl text-sm
                      outline-none focus:border-[#4B3621]
                      transition-colors bg-white cursor-pointer"
                  >
                    <option value="">Select region...</option>
                    {LOCATIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Full Address */}
                <Field
                  label="Shop Address"
                  value={form.fullAddress}
                  onChange={set("fullAddress")}
                  placeholder="e.g. Shop 3, Kofar Kaura Market"
                  maxLength={120}
                  hint="Shown to buyers on your listings"
                />

                {/* Phone */}
                <div>
                  <label
                    className="block text-[10px] font-bold
                    uppercase tracking-widest text-gray-400 mb-1.5"
                  >
                    Phone / WhatsApp
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCode(e.target.value)}
                      className="px-3 py-3 border-2 border-gray-200
                        rounded-xl text-sm outline-none
                        focus:border-[#4B3621] transition-colors
                        bg-white cursor-pointer flex-shrink-0"
                    >
                      {CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={form.phone || ""}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        set("phone")(v);
                        set("whatsappNumber")(v); // sync both
                      }}
                      placeholder="8012345678"
                      maxLength={11}
                      className="flex-1 px-4 py-3 border-2
                        border-gray-200 rounded-xl text-sm
                        outline-none focus:border-[#4B3621]
                        transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Same number used for WhatsApp contact
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex gap-3 px-6 py-5
                border-t border-gray-100 flex-shrink-0 bg-white"
              >
                <button
                  onClick={onClose}
                  disabled={saving}
                  className="flex-1 py-3.5 border-2
                    border-gray-200 text-gray-500 rounded-2xl
                    text-sm font-semibold hover:border-gray-300
                    transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3.5 bg-[#4B3621]
                    text-white rounded-2xl text-sm font-semibold
                    hover:bg-[#362818] transition-colors shadow-sm
                    active:scale-[0.98] disabled:opacity-50
                    disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
