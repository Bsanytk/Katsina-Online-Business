import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../firebase/auth'
import { getUserProfile, updateUserProfile, formatWhatsAppNumber } from '../../services/users'
import { Card, Input, ButtonLoader, Alert, Select } from '../ui'

/**
 * SellerProfileEdit Component
 * Allows sellers to update their WhatsApp number and other profile info
 * 
 * Features:
 * - WhatsApp number input with inline validation
 * - Loading state with ButtonLoader
 * - Success/error alerts
 * - Prevents double submission
 * - Format validation (Nigerian phone numbers)
 */
export default function SellerProfileEdit() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState({
    displayName: '',
    username: '',
    phoneNumber: '',
    countryCode: '+234',
    whatsappNumber: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [whatsappError, setWhatsappError] = useState(null)

  const loadProfile = useCallback(async () => {
    if (!user?.uid) return

    setLoading(true)
    try {
      const profile = await getUserProfile(user.uid)
      setProfileData({
        displayName: profile.displayName || '',
        username: profile.username || '',
        phoneNumber: profile.phoneNumber ? profile.phoneNumber.replace(/^\+?\d{3}/, '') : '',
        countryCode: profile.phoneNumber ? profile.phoneNumber.match(/^\+?\d{3}/)?.[0] || '+234' : '+234',
        whatsappNumber: profile.whatsappNumber || '',
      })
      setError(null)
    } catch (err) {
      setError(err.message)
      if (import.meta.env.DEV) console.error('Failed to load profile:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  // Load current profile
  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  function handleWhatsAppChange(e) {
    const value = e.target.value
    setProfileData((prev) => ({
      ...prev,
      whatsappNumber: value,
    }))

    // Validate as user types
    if (value.trim()) {
      const validation = formatWhatsAppNumber(value)
      setWhatsappError(validation.error)
    } else {
      setWhatsappError(null)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSuccess(false)
    setError(null)
    setSaving(true)

    try {
      // Validate WhatsApp number if provided
      if (profileData.whatsappNumber.trim()) {
        const validation = formatWhatsAppNumber(profileData.whatsappNumber)
        if (!validation.isValid) {
          setWhatsappError(validation.error)
          setSaving(false)
          return
        }
      }

      // Update profile with all fields
      const fullPhoneNumber = profileData.phoneNumber.trim() ? profileData.countryCode + profileData.phoneNumber.replace(/^\+/, '') : null
      
      await updateUserProfile(user.uid, {
        displayName: profileData.displayName.trim() || null,
        username: profileData.username.trim() || null,
        phoneNumber: fullPhoneNumber,
        whatsappNumber: profileData.whatsappNumber.trim() || null,
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)

      // Reload profile to confirm save
      await loadProfile()
    } catch (err) {
      setError(err.message)
      if (import.meta.env.DEV) console.error('Failed to save profile:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card variant="elevated" className="p-8 rounded-xl">
        <div className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-5 w-5 text-kob-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-gray-600 font-medium">Loading profile...</span>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-kob-dark mb-2 flex items-center gap-3">
          <span className="text-4xl">👤</span> Your Seller Profile
        </h2>
        <p className="text-gray-600">Update your contact information so buyers can reach you</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          title="Error"
          onDismiss={() => setError(null)}
          className="animate-fade-in"
        >
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert
          type="success"
          title="Success!"
          onDismiss={() => setSuccess(false)}
          className="animate-fade-in"
        >
          Your profile has been updated successfully.
        </Alert>
      )}

      {/* Profile Form */}
      <Card variant="elevated" className="p-8 rounded-xl">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-semibold text-kob-dark mb-2">Email Address</label>
            <div className="p-3 bg-gray-100 rounded-lg text-gray-700 border border-gray-200 font-medium">
              {user?.email}
            </div>
            <p className="text-xs text-gray-500 mt-2">Can only be changed through Firebase console</p>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-kob-dark mb-2 flex items-center gap-2">
              <span className="text-xl">👤</span>
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={profileData.username}
              onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
              disabled={saving}
              className="border-gray-300 focus:ring-kob-primary"
            />
            <p className="text-xs text-gray-600 mt-2">
              Your username will be displayed on your product listings.
            </p>
          </div>

          {/* Phone Number with Country Code */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-kob-dark mb-2 flex items-center gap-2">
              <span className="text-xl">📱</span>
              Phone Number
            </label>
            <div className="flex gap-2">
              <Select
                value={profileData.countryCode}
                onChange={(e) => setProfileData(prev => ({ ...prev, countryCode: e.target.value }))}
                disabled={saving}
                className="w-32 border-gray-300 focus:ring-kob-primary"
              >
                <option value="+234">+234 Nigeria</option>
                <option value="+233">+233 Ghana</option>
                <option value="+44">+44 UK</option>
                <option value="+1">+1 USA</option>
              </Select>
              <Input
                id="phone"
                type="tel"
                placeholder="7068397191"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                disabled={saving}
                className="flex-1 border-gray-300 focus:ring-kob-primary"
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Your phone number will be stored as {profileData.countryCode}{profileData.phoneNumber} and used for WhatsApp contact.
            </p>
          </div>

          {/* WhatsApp Number */}
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-semibold text-kob-dark mb-2 flex items-center gap-2">
              <span className="text-xl">💬</span>
              WhatsApp Number
            </label>
            <div className="space-y-2">
              <Input
                id="whatsapp"
                type="tel"
                placeholder="e.g., 08012345678 or +2348012345678"
                value={profileData.whatsappNumber}
                onChange={handleWhatsAppChange}
                disabled={saving}
                className={`${
                  whatsappError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-kob-primary'
                }`}
              />
              {whatsappError && (
                <p className="text-red-600 text-sm font-medium animate-fade-in">
                  ❌ {whatsappError}
                </p>
              )}
              {profileData.whatsappNumber && !whatsappError && (
                <p className="text-green-600 text-sm font-medium animate-fade-in">
                  ✓ Valid WhatsApp number
                </p>
              )}
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>ℹ️ Why WhatsApp?</strong> Buyers will use this number to contact you directly about your products. Your number is stored securely and never displayed publicly.
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-sm text-blue-900 font-medium">
              🔒 <strong>Your privacy is protected:</strong>
            </p>
            <ul className="text-xs text-blue-800 mt-2 space-y-1 ml-4">
              <li>✓ WhatsApp number is only stored in Firestore</li>
              <li>✓ NOT displayed on product listings</li>
              <li>✓ Shared only when buyers click "Contact Seller"</li>
              <li>✓ Private link - no user tracking</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <ButtonLoader
              type="submit"
              size="lg"
              variant="primary"
              loading={saving}
              loadingText="Saving..."
              className="flex-1 shadow-md hover:shadow-lg transition-all"
            >
              💾 Save Changes
            </ButtonLoader>
            <button
              type="button"
              onClick={() => loadProfile()}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              ↻ Reset
            </button>
          </div>
        </form>
      </Card>

      {/* Info Card */}
      <Card variant="outlined" className="p-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
        <p className="text-sm text-amber-900 font-semibold mb-2">💡 Pro Tip</p>
        <p className="text-sm text-amber-800 leading-relaxed">
          Setting your WhatsApp number increases trust and response rates. Buyers appreciate quick replies on WhatsApp!
        </p>
      </Card>
    </div>
  )
}
