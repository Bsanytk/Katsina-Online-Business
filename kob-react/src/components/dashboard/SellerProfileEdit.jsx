import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../firebase/auth'
import { getUserProfile, updateUserProfile } from '../../services/users'
import { Card, Input, Alert } from '../ui' // Added Button as it was missing in imports

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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [profileData, setProfileData] = useState({
    displayName: '',
    username: '',
    phoneNumber: '',
    countryCode: '+234',
    whatsappNumber: '',
  })

  const loadProfile = useCallback(async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const profile = await getUserProfile(user.uid)
      
      // CORRECTION: Handle both "phone" and "phoneNumber" fields
      let rawPhone = profile.phoneNumber || profile.phone || ''
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
        phoneNumber: detectedNumber.replace(/\s+/g, ''), // remove spaces
        countryCode: detectedCode,
        // CORRECTION: Handle both "whatsapp" and "whatsappNumber"
        whatsappNumber: profile.whatsappNumber || profile.whatsapp || '',
      })
    } catch (err) {
      setError("Ba a iya buɗe bayanan profile ba.")
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
    setError(null)

    try {
      let cleanNumber = profileData.phoneNumber.trim().replace(/^0+/, '').replace(/\D/g, '')
      const fullPhoneNumber = profileData.countryCode + cleanNumber

      // CORRECTION: Save to both field styles to ensure Marketplace components can see it
      await updateUserProfile(user.uid, {
        displayName: profileData.displayName.trim() || null,
        username: profileData.username.trim() || null,
        phoneNumber: fullPhoneNumber,
        phone: fullPhoneNumber, // Legacy support
        whatsappNumber: profileData.whatsappNumber.trim() || null,
        whatsapp: profileData.whatsappNumber.trim() || null, // Legacy support
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError("An samu matsala wurin adana bayanan.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500 italic">Ana buɗe bayanan...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black text-kob-dark">Saitin Bayanai (Profile)</h1>
        <p className="text-sm text-gray-500">Gyara yadda kake bayyana ga masu siyan kaya.</p>
      </div>

      {success && <Alert type="success">An adana bayanan profile ɗinka cikin nasara! ✅</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <Card variant="elevated" className="p-8 rounded-xl shadow-lg border-t-4 border-kob-primary">
        <form onSubmit={handleSave} className="space-y-6">
          
          <Input
            label="Sunan Kasuwanci (Display Name)"
            value={profileData.displayName}
            onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
            placeholder="Misali: B-Sani Bio-Care"
            disabled={saving}
          />

          <div>
            <label className="block text-sm font-semibold text-kob-dark mb-2">
              📱 Lambar Waya (Business Phone)
            </label>
            <div className="flex gap-0 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-kob-primary transition-all">
              <select
                value={profileData.countryCode}
                onChange={(e) => setProfileData(prev => ({ ...prev, countryCode: e.target.value }))}
                disabled={saving}
                className="bg-gray-100 border-r border-gray-300 px-3 py-2 text-sm font-bold text-kob-dark focus:outline-none"
              >
                {COUNTRIES.map(country => (
                  <option key={country.id} value={country.code}>
                    {country.label}
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
          </div>

          <Input
            label="Lambar WhatsApp"
            value={profileData.whatsappNumber}
            onChange={(e) => setProfileData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
            placeholder="Misali: 2348012345678"
            disabled={saving}
          />

          <button
            type="submit"
            disabled={saving}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
              saving ? 'bg-gray-400' : 'bg-kob-primary hover:bg-kob-primary-dark shadow-lg shadow-kob-primary/20'
            }`}
          >
            {saving ? 'Ana adanawa...' : 'Adana Bayanai'}
          </button>
        </form>
      </Card>
    </div>
  )
}

