import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../firebase/auth'
import { getUserProfile, updateUserProfile, formatWhatsAppNumber } from '../../services/users'
import { Card, Input, ButtonLoader, Alert, Select } from '../ui'

// Production-ready country list
const COUNTRIES = [
  { code: '+234', label: '🇳🇬 Nigeria', id: 'ng' },
  { code: '+227', label: '🇳🇪 Niger', id: 'ne' },
  { code: '+233', label: '🇬🇭 Ghana', id: 'gh' },
  { code: '+221', label: '🇸🇳 Senegal', id: 'sn' },
  { code: '+225', label: '🇨🇮 Ivory Coast', id: 'ci' },
  { code: '+44', label: '🇬🇧 UK', id: 'uk' },
  { code: '+1', label: '🇺🇸 USA', id: 'us' },
]

export default function SellerProfileEdit() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState({
    displayName: '',
    username: '',
    phoneNumber: '',
    countryCode: '+234',
    whatsappNumber: '',
  })
  
  // ... (keeping loading, saving, error states as per your original file)

  const loadProfile = useCallback(async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const profile = await getUserProfile(user.uid)
      
      // Logic to split combined phone number back into Code and Number
      let rawPhone = profile.phoneNumber || ''
      let detectedCode = '+234'
      let detectedNumber = rawPhone

      COUNTRIES.forEach(c => {
        if (rawPhone.startsWith(c.code)) {
          detectedCode = c.code
          detectedNumber = rawPhone.replace(c.code, '')
        }
      })

      setProfileData({
        displayName: profile.displayName || '',
        username: profile.username || '',
        phoneNumber: detectedNumber,
        countryCode: detectedCode,
        whatsappNumber: profile.whatsappNumber || '',
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    try {
      // 1. Clean the phone number (remove leading zero if user adds it)
      let cleanNumber = profileData.phoneNumber.trim().replace(/^0+/, '')
      
      // 2. Combine for Firestore: +234 + 7068397191 = +2347068397191
      const fullPhoneNumber = profileData.countryCode + cleanNumber

      await updateUserProfile(user.uid, {
        displayName: profileData.displayName.trim() || null,
        username: profileData.username.trim() || null,
        phoneNumber: fullPhoneNumber,
        whatsappNumber: profileData.whatsappNumber.trim() || null,
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* ... (keeping header and alerts) */}

      <Card variant="elevated" className="p-8 rounded-xl">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* ... (keeping username input) */}

          {/* Improved Phone Number with Country Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-kob-dark mb-2">
              📱 Business Phone Number
            </label>
            <div className="flex gap-0 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-kob-primary">
              <select
                value={profileData.countryCode}
                onChange={(e) => setProfileData(prev => ({ ...prev, countryCode: e.target.value }))}
                disabled={saving}
                className="bg-gray-50 border-r border-gray-300 px-3 py-2 text-sm font-bold text-kob-dark focus:outline-none"
              >
                {COUNTRIES.map(country => (
                  <option key={country.id} value={country.code}>
                    {country.label} ({country.code})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="7068397191"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                disabled={saving}
                className="flex-1 px-4 py-2 text-kob-dark placeholder-gray-400 focus:outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">
              Selected: <span className="font-bold text-kob-primary">{profileData.countryCode} {profileData.phoneNumber}</span>
            </p>
          </div>

          {/* ... (keeping WhatsApp and Action buttons) */}
        </form>
      </Card>
    </div>
  )
        }
                  
