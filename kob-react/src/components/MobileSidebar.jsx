/**
 * EditProfileModal.jsx — KOB Mobile Refactor
 *
 * FIXES:
 * ✅ fixed inset-0 items-end — stable all Android
 * ✅ max-h-[90vh] overflow-hidden
 * ✅ Scrollable body — flex-1 overflow-y-auto
 * ✅ Sticky footer — flex-shrink-0, always visible
 * ✅ Compact spacing — less scroll fatigue
 * ✅ text-xs — WCAG readable
 * ✅ safe-area-inset-bottom
 * ✅ All logic preserved
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence }     from 'framer-motion'
import { useProfile }                  from '../../contexts/ProfileContext'
import { updateProfile }               from '../../services/profile'
import AvatarUpload                    from './AvatarUpload'
import SuccessModal                    from './SuccessModal'

// ================================
// Constants
// ================================
const COUNTRY_CODES = [
  { code: '+234', flag: '🇳🇬' },
  { code: '+227', flag: '🇳🇪' },
  { code: '+233', flag: '🇬🇭' },
  { code: '+1',   flag: '🇺🇸' },
  { code: '+44',  flag: '🇬🇧' },
]

const LOCATIONS = [
  'Katsina Central', 'Daura',     'Funtua',
  'Dutsin-Ma',       'Kankia',    'Mani',
  'Malumfashi',      'Jibia',     'Kaita',
  'Baure',           'Charanchi', 'Other',
]

// ================================
// Spinner
// ================================
function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none"
      viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ================================
// Field — compact, accessible
// ================================
function Field({
  label, value, onChange,
  type = 'text', placeholder,
  maxLength, required, hint, error,
}) {
  return (
    <div className="space-y-1">

      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase
          tracking-wide text-gray-500">
          {label}
          {required && (
            <span className="text-red-400 ml-1">*</span>
          )}
        </label>
        {maxLength && (
          <span className="text-[10px] text-gray-300">
            {String(value || '').length}/{maxLength}
          </span>
        )}
      </div>

      {type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={3}
          className={`w-full px-4 py-2.5 border-2 rounded-xl
            text-sm outline-none resize-none transition-colors
            placeholder:text-gray-300 leading-relaxed
            ${error
              ? 'border-red-300 focus:border-red-400 bg-red-50/20'
              : 'border-gray-200 focus:border-[#4B3621] bg-white'
            }`}
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 py-2.5 border-2 rounded-xl
            text-sm outline-none transition-colors
            placeholder:text-gray-300
            ${error
              ? 'border-red-300 focus:border-red-400 bg-red-50/20'
              : 'border-gray-200 focus:border-[#4B3621] bg-white'
            }`}
        />
      )}

      {/* Error / hint */}
      {error && (
        <p className="text-xs text-red-500 font-medium
          flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="none"
            viewBox="0 0 24 24" stroke="currentColor"
            strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0
              001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2
              0 00-3.42 0z" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-[10px] text-gray-400">{hint}</p>
      )}
    </div>
  )
}

// ================================
// Main Modal
// ================================
export default function EditProfileModal({ show, onClose }) {
  const { profile, updateLocalProfile } = useProfile()

  const [form, setForm]           = useState({})
  const [countryCode, setCode]    = useState('+234')
  const [saving, setSaving]       = useState(false)
  const [errors, setErrors]       = useState({})
  const [showSuccess, setSuccess] = useState(false)

  // ✅ Pre-fill from ProfileContext
  useEffect(() => {
    if (!profile || !show) return

    const raw = profile.phone || profile.whatsappNumber || ''
    let detectedCode   = '+234'
    let detectedNumber = raw

    COUNTRY_CODES.forEach((c) => {
      const clean = c.code.replace('+', '')
      if (raw.startsWith(clean)) {
        detectedCode   = c.code
        detectedNumber = raw.slice(clean.length)
      }
    })

    setCode(detectedCode)
    setForm({
      displayName:    profile.displayName    || '',
      businessName:   profile.businessName   || '',
      bio:            profile.bio            || '',
      location:       profile.location       || '',
      fullAddress:    profile.fullAddress    || '',
      phone:          detectedNumber,
      whatsappNumber: detectedNumber,
      photoURL:       profile.photoURL       || '',
    })
    setErrors({})
  }, [profile?.uid, show])

  function set(key) {
    return (val) => {
      setForm((p) => ({ ...p, [key]: val }))
      if (errors[key]) {
        setErrors((p) => ({ ...p, [key]: null }))
      }
    }
  }

  function validate() {
    const errs = {}
    if (!form.displayName?.trim()) {
      errs.displayName = 'Full name is required'
    }
    return errs
  }

  // ✅ Save logic — fully preserved
  async function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSaving(true)
    try {
      const clean = (n) =>
        n ? `${countryCode}${n.replace(/^0+/, '')}` : ''

      const payload = {
        ...form,
        phone:
          form.phone ? clean(form.phone)
          : (profile?.phone || ''),
        whatsappNumber:
          form.phone ? clean(form.phone)
          : (profile?.whatsappNumber || ''),
      }
      await updateProfile(profile.uid, payload)
      updateLocalProfile(payload)
      setSuccess(true)
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setSaving(false)
    }
  }

  function handleSuccessClose() {
    setSuccess(false)
    onClose()
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

          // ================================
          // BACKDROP
          // ✅ fixed inset-0 — stable base
          // ✅ items-end mobile / center tablet
          // ================================
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50
              flex items-end md:items-center
              justify-center
              bg-black/50 backdrop-blur-[3px]"
            onClick={onClose}
          >
            {/* ================================
                PANEL
                ✅ max-h-[90vh] — no overflow
                ✅ flex flex-col — sticky footer
                ✅ overflow-hidden — clean clip
            ================================ */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0,      opacity: 1 }}
              exit={{    y: '100%', opacity: 0 }}
              transition={{
                type:      'spring',
                stiffness: 280,
                damping:   30,
              }}
              className="
                w-full max-w-lg
                bg-[#FAF7F2]
                rounded-t-3xl md:rounded-3xl
                shadow-2xl
                flex flex-col
                max-h-[90vh]
                overflow-hidden
              "
              onClick={(e) => e.stopPropagation()}
            >

              {/* ============================ */}
              {/* HEADER — fixed, never moves  */}
              {/* ============================ */}
              <div className="flex-shrink-0 flex items-center
                justify-between px-5 py-4
                bg-[#FAF7F2] border-b border-[#EDE8E0]">

                {/* Mobile drag handle */}
                <div className="absolute top-2.5 left-1/2
                  -translate-x-1/2 w-9 h-1 bg-gray-300
                  rounded-full md:hidden pointer-events-none" />

                <div className="pt-1.5 md:pt-0">
                  <h2 className="text-base font-bold
                    text-[#2C1F0E]">
                    Edit Profile
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Changes are saved securely
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center
                    justify-center rounded-xl
                    bg-[#4B3621]/8 text-[#4B3621]
                    hover:bg-[#4B3621]/15 transition-colors
                    touch-manipulation flex-shrink-0"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* ============================ */}
              {/* BODY — scrollable            */}
              {/* ✅ flex-1 overflow-y-auto    */}
              {/* ✅ compact space-y-4         */}
              {/* ============================ */}
              <div className="flex-1 overflow-y-auto
                overscroll-contain px-5 py-4 space-y-4
                scroll-smooth bg-white">

                {/* Avatar — compact */}
                <div className="flex flex-col items-center
                  gap-1.5 pt-1 pb-2">
                  <AvatarUpload
                    photoURL={form.photoURL}
                    displayName={form.displayName}
                    uid={profile?.uid}
                    size="lg"
                    onSuccess={(url) => {
                      set('photoURL')(url)
                      updateLocalProfile({ photoURL: url })
                    }}
                  />
                  <p className="text-xs text-gray-400">
                    Tap camera to change photo
                  </p>
                </div>

                {/* General error */}
                {errors.general && (
                  <div className="p-3 bg-red-50 border
                    border-red-100 rounded-xl">
                    <p className="text-sm text-red-700
                      font-medium">
                      ⚠ {errors.general}
                    </p>
                  </div>
                )}

                {/* Full Name */}
                <Field
                  label="Full Name"
                  value={form.displayName}
                  onChange={set('displayName')}
                  placeholder="Your full name"
                  maxLength={60}
                  required
                  error={errors.displayName}
                />

                {/* Business Name */}
                {(profile?.role === 'seller' ||
                  profile?.role === 'admin') && (
                  <Field
                    label="Business / Shop Name"
                    value={form.businessName}
                    onChange={set('businessName')}
                    placeholder="Your shop name"
                    maxLength={80}
                    hint="Shown on your public seller page"
                  />
                )}

                {/* Bio */}
                <Field
                  label="Bio"
                  value={form.bio}
                  onChange={set('bio')}
                  type="textarea"
                  placeholder="Tell buyers about yourself..."
                  maxLenggth={200}
                />

                {/* Region */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold
                    uppercase tracking-wide text-gray-500">
                    Region
                  </label>
                  <select
                    value={form.location || ''}
                    onChange={(e) =>
                      set('location')(e.target.value)
                    }
                    className="w-full px-4 py-2.5 border-2
                      border-gray-200 rounded-xl text-sm
                      outline-none focus:border-[#4B3621]
                      transition-colors bg-white cursor-pointer"
                  >
                    <option value="">Select region...</option>
                    {LOCATIONS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Shop Address */}
                <Field
                  label="Shop Address"
                  value={form.fullAddress}
                  onChange={set('fullAddress')}
                  placeholder="e.g. Shop 3, Kofar Kaura Market"
                  maxLength={120}
                  hint="Shown to buyers on your listings"
                />

                {/* Phone / WhatsApp */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold
                    uppercase tracking-wide text-gray-500">
                    Phone / WhatsApp
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCode(e.target.value)}
                      className="px-3 py-2.5 border-2
                        border-gray-200 rounded-xl text-sm
                        outline-none focus:border-[#4B3621]
                        transition-colors bg-white
                        cursor-pointer flex-shrink-0 w-28"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={form.phone || ''}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '')
                        set('phone')(v)
                        set('whatsappNumber')(v)
                      }}
                      placeholder="8012345678"
                      maxLength={11}
                      className="flex-1 px-4 py-2.5 border-2
                        border-gray-200 rounded-xl text-sm
                        outline-none focus:border-[#4B3621]
                        transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Same number used for WhatsApp contact
                  </p>
                </div>

                {/* Spacer — last field doesn't hide behind footer */}
                <div className="h-2" />
              </div>

              {/* ============================ */}
              {/* FOOTER — ALWAYS VISIBLE      */}
              {/* ✅ flex-shrink-0             */}
              {/* ✅ z-20 above scroll content */}
              {/* ✅ safe-area-inset-bottom    */}
              {/* ============================ */}
              <div className="
                flex-shrink-0 z-20
                flex gap-3 px-5 pt-3
                bg-[#FAF7F2] border-t border-[#EDE8E0]
                pb-[max(1rem,env(safe-area-inset-bottom))]
              ">
                <button
                  onClick={onClose}
                  disabled={saving}
                  className="flex-1 py-3 border-2
                    border-gray-200 text-gray-600
                    rounded-2xl text-sm font-semibold
                    hover:bg-gray-50 hover:border-gray-300
                    transition-all disabled:opacity-50
                    touch-manipulation active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-[#4B3621]
                    text-white rounded-2xl text-sm font-bold
                    hover:bg-[#362818] transition-colors
                    shadow-sm shadow-[#4B3621]/20
                    active:scale-[0.98] disabled:opacity-50
                    disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                    touch-manipulation"
                >
                  {saving ? (
                    <>
                      <Spinner />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
