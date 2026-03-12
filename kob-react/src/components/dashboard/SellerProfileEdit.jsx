import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../firebase/auth'
import { getUserProfile, updateUserProfile } from '../../services/users'
// Removed: firebase/storage and storage imports to fix Vercel build error
import { Card, Input, Alert, Button } from '../ui'

const COUNTRIES = [
  { code: '+234', label: 'Nigeria', flag: '🇳🇬', id: 'ng' },
  { code: '+227', label: 'Niger', flag: '🇳🇪', id: 'ne' },
  { code: '+233', label: 'Ghana', flag: '🇬🇭', id: 'gh' },
  { code: '+237', label: 'Cameroon', flag: '🇨🇲', id: 'cm' },
  { code: '+27', label: 'South Africa', flag: '🇿🇦', id: 'za' },
  { code: '+221', label: 'Senegal', flag: '🇸🇳', id: 'sn' },
  { code: '+225', label: 'Ivory Coast', flag: '🇨🇮', id: 'ci' },
  { code: '+254', label: 'Kenya', flag: '🇰🇪', id: 'ke' },
  { code: '+249', label: 'Sudan', flag: '🇸🇩', id: 'sd' },
  { code: '+20', label: 'Egypt', flag: '🇪🇬', id: 'eg' },
]

export default function SellerProfileEdit() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [profileData, setProfileData] = useState({
    displayName: '',
    photoURL: '',
    phoneNumber: '',
    countryCode: '+234',
    whatsappNumber: '',
  })

  // Load Profile Logic
  const loadProfile = useCallback(async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const profile = await getUserProfile(user.uid)
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
        photoURL: profile.photoURL || '',
        phoneNumber: detectedNumber.replace(/\s+/g, ''), 
        countryCode: detectedCode,
        whatsappNumber: profile.whatsappNumber || profile.whatsapp || '',
      })
    } catch (err) {
      setError("Unable to load profile settings. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  useEffect(() => { loadProfile() }, [loadProfile])

  // Final Save Handler
  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const cleanNumber = profileData.phoneNumber.replace(/\D/g, '')
      const fullPhoneNumber = profileData.countryCode + cleanNumber

      await updateUserProfile(user.uid, {
        displayName: profileData.displayName.trim(),
        photoURL: profileData.photoURL.trim(), // Saves the Cloudinary link as text
        phoneNumber: fullPhoneNumber,
        phone: fullPhoneNumber,
        whatsappNumber: profileData.whatsappNumber.trim() || fullPhoneNumber,
        whatsapp: profileData.whatsappNumber.trim() || fullPhoneNumber,
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError("Permission denied or connection error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 animate-pulse">
      <div className="w-12 h-12 border-4 border-[#4B3621] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-bold uppercase tracking-widest">Loading Profile...</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in p-4 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-[#4B3621] tracking-tighter uppercase">Business Identity</h1>
        <p className="text-gray-500">Update your B-SANI brand details using Cloudinary links.</p>
      </div>

      {success && <Alert type="success">Profile updated successfully! ✅</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <Card className="p-8 md:p-12 rounded-[2rem] shadow-2xl border-b-[12px] border-[#4B3621] bg-white relative overflow-hidden">
        <form onSubmit={handleSave} className="space-y-10">
          
          {/* Circular Photo Preview */}
          <div className="flex flex-col items-center group">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-[6px] border-[#4B3621] p-1 transition-all duration-500 shadow-2xl hover:scale-105">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                  {profileData.photoURL ? (
                    <img src={profileData.photoURL} alt="Brand" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 font-black text-2xl uppercase">KOB</div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full mt-6">
              <Input
                label="Profile Photo URL (Cloudinary)"
                value={profileData.photoURL}
                onChange={(e) => setProfileData(p => ({ ...p, photoURL: e.target.value }))}
                placeholder="Paste your https://res.cloudinary.com/... link here"
              />
            </div>
          </div>

          <Input
            label="Business Name"
            value={profileData.displayName}
            onChange={(e) => setProfileData(p => ({ ...p, displayName: e.target.value }))}
            placeholder="e.g. B-SANI BIO-CARE MED"
            required
          />

          {/* Country Selection */}
          <div className="space-y-4">
            <label className="text-xs font-black text-[#4B3621] uppercase tracking-[0.2em] block">Select Business Location</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setProfileData(p => ({ ...p, countryCode: c.code }))}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                    profileData.countryCode === c.code 
                    ? 'border-[#4B3621] bg-[#4B3621]/10 scale-105 shadow-lg' 
                    : 'border-gray-100 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <span className="text-sm font-black text-[#4B3621]">{c.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-2">
            <label className="text-xs font-black text-[#4B3621] uppercase tracking-[0.2em]">Phone Number (Mobile)</label>
            <div className="flex items-center bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-[#4B3621] focus-within:bg-white transition-all overflow-hidden shadow-inner">
              <div className="px-6 py-4 bg-gray-200 text-[#4B3621] font-black text-lg">
                {profileData.countryCode}
              </div>
              <input 
                type="tel"
                className="flex-1 p-4 bg-transparent focus:outline-none font-black text-xl tracking-widest"
                placeholder="7068397191"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData(p => ({ ...p, phoneNumber: e.target.value }))}
                required
              />
            </div>
          </div>

          <Input
            label="Direct WhatsApp Link Number"
            value={profileData.whatsappNumber}
            onChange={(e) => setProfileData(p => ({ ...p, whatsappNumber: e.target.value }))}
            placeholder="e.g. 2349131523336"
          />

          <Button 
            type="submit" 
            className="w-full py-6 text-xl font-black uppercase tracking-[0.3em] shadow-2xl bg-[#4B3621] text-white hover:opacity-90 transition-all active:scale-95"
            loading={saving}
          >
            {saving ? 'Synchronizing...' : 'Update Merchant Profile'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
