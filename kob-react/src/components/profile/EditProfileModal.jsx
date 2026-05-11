/**
 * EditProfileModal.jsx
 *
 * MOBILE FIXES:
 * ✅ Modal body scrollable — max-h-[80vh] overflow-y-auto
 * ✅ Save/Cancel buttons fixed at bottom — always visible
 * ✅ Bottom nav clearance — pb-safe
 * ✅ Slides up from bottom on mobile (natural UX)
 * ✅ Avatar section compact — no excess padding
 * ✅ Cloudinary upload via env-based service
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "../../contexts/ProfileContext";
import { updateProfile } from "../../services/profile";
import AvatarUpload from "./AvatarUpload";
import SuccessModal from "./SuccessModal";

const COUNTRY_CODES = [
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
  "Kaita",
  "Baure",
  "Charanchi",
  "Other",
];

// ================================
// Form field component
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
// Main Modal
// ================================
export default function EditProfileModal({ show, onClose }) {
  const { profile, updateLocalProfile } = useProfile();

  const [form, setForm] = useState({});
  const [countryCode, setCode] = useState("+234");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setSuccess] = useState(false);

  // Pre-fill from ProfileContext
  useEffect(() => {
    if (!profile || !show) return;

    // Detect country code from stored number
    const raw = profile.phone || profile.whatsappNumber || "";
    let detectedCode = "+234";
    let detectedNumber = raw;

    COUNTRY_CODES.forEach((c) => {
      const clean = c.code.replace("+", "");
      if (raw.startsWith(clean)) {
        detectedCode = c.code;
        detectedNumber = raw.slice(clean.length);
      }
    });

    setCode(detectedCode);
    setForm({
      displayName: profile.displayName || "",
      businessName: profile.businessName || "",
      bio: profile.bio || "",
      location: profile.location || "",
      fullAddress: profile.fullAddress || "",
      phone: detectedNumber,
      whatsappNumber: detectedNumber,
      photoURL: profile.photoURL || "",
    });
    setErrors({});
  }, [profile?.uid, show]);

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
      const clean = (n) => (n ? `${countryCode}${n.replace(/^0+/, "")}` : "");

      const payload = {
        ...form,
        phone: form.phone ? clean(form.phone) : profile?.phone || "",
        whatsappNumber: form.phone
          ? clean(form.phone)
          : profile?.whatsappNumber || "",
      };

      await updateProfile(profile.uid, payload);
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
      <SuccessModal
        show={showSuccess}
        onClose={handleSuccessClose}
        title="Profile Updated!"
        subtitle="Your shop info is live and up to date."
      />

      <AnimatePresence>
        {show && !showSuccess && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50
                bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* ✅ MOBILE-FIRST MODAL
                - Slides up from bottom
                - Fixed max height with scrollable body
                - Footer always visible
            */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 28,
              }}
              className="fixed bottom-0 left-0 right-0 z-50
                bg-white rounded-t-3xl shadow-2xl
                flex flex-col
                md:relative md:bottom-auto md:left-auto
                md:right-auto md:rounded-3xl
                md:max-w-lg md:mx-auto md:my-auto
                md:inset-0 md:m-auto"
              style={{ maxHeight: "90vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ---- HEADER (fixed) ---- */}
              <div
                className="flex items-center
                justify-between px-5 py-4 border-b
                border-gray-100 flex-shrink-0"
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
                    text-gray-500 hover:bg-gray-200
                    transition-colors touch-manipulation"
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

              {/* ---- SCROLLABLE BODY ---- */}
              {/* ✅ KEY FIX: overflow-y-auto makes body scroll */}
              {/* Save button stays fixed at bottom */}
              <div
                className="flex-1 overflow-y-auto
                px-5 py-4 space-y-5
                overscroll-contain"
              >
                {/* Avatar — compact on mobile */}
                <div className="flex justify-center py-2">
                  <div className="flex flex-col items-center gap-2">
                    <AvatarUpload
                      photoURL={form.photoURL}
                      displayName={form.displayName}
                      uid={profile?.uid}
                      size="lg"
                      onSuccess={(url) => {
                        set("photoURL")(url);
                        updateLocalProfile({ photoURL: url });
                      }}
                    />
                    <p className="text-[10px] text-gray-400">
                      Tap icon to change photo
                    </p>
                  </div>
                </div>

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

                {/* Region */}
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

                {/* Shop Address */}
                <Field
                  label="Shop Address"
                  value={form.fullAddress}
                  onChange={set("fullAddress")}
                  placeholder="e.g. Shop 3, Kofar Kaura Market"
                  maxLength={120}
                  hint="Shown to buyers on your listings"
                />

                {/* Phone / WhatsApp */}
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
                        bg-white cursor-pointer flex-shrink-0
                        w-28"
                    >
                      {COUNTRY_CODES.map((c) => (
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
                        set("whatsappNumber")(v);
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

                {/* Bottom spacing — prevents content hiding behind footer */}
                <div className="h-2" />
              </div>

              {/* ---- FOOTER (always visible) ---- */}
              {/* ✅ KEY FIX: flex-shrink-0 keeps footer fixed */}
              <div
                className="flex gap-3 px-5 py-4
                border-t border-gray-100 flex-shrink-0
                bg-white
                pb-[max(1rem,env(safe-area-inset-bottom))]"
              >
                <button
                  onClick={onClose}
                  disabled={saving}
                  className="flex-1 py-3.5 border-2
                    border-gray-200 text-gray-500 rounded-2xl
                    text-sm font-semibold hover:border-gray-300
                    transition-all disabled:opacity-50
                    touch-manipulation"
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
                    flex items-center justify-center gap-2
                    touch-manipulation"
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
          </>
        )}
      </AnimatePresence>
    </>
  );
}
