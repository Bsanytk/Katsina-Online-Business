import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../firebase/auth'
import { getUserProfile, updateUserProfile } from '../../services/users'
// No storage imports - purely text and data driven for Vercel stability
import { Card, Input, Alert, Button } from '../ui'

const COUNTRIES = [
  { code: '+234', label: 'Nigeria', flag: '🇳🇬', id: 'ng' },
  { code: '+227', label: 'Niger', flag: '🇳🇪', id: 'ne' },
  { code: '+233', label: 'Ghana', flag: '🇬🇭', id: 'gh' },
  { code: '+237', label: 'Cameroon', flag: '🇨🇲', id: 'cm' },
  { code: '+254', label: 'Kenya', flag: '🇰🇪', id: 'ke' },
]

export default function SellerProfileEdit() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [profileData, setProfileData] = useState({
    displayName: '', // Personal Name
    businessName: '', // e.g. B-SANI BIO-CARE MED
    photoURL: '', // Display only
    phoneNumber: '',
    countryCode: '+234',
    whatsappNumber: '',
    kobNumber: '', // Manual Input (KOB - XXX)
  })

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
        businessName: profile.businessName || '',
        photoURL: profile.photoURL || '',
        phoneNumber: detectedNumber.replace(/\s+/g, ''), 
        countryCode: detectedCode,
        whatsappNumber: profile.whatsappNumber || '',
        kobNumber: profile.kobNumber || 'KOB - ',
      })
    } catch (err) {
      setError("Failed to load merchant data.")
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  useEffect(() => { loadProfile() }, [loadProfile])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const cleanNumber = profileData.phoneNumber.replace(/\D/g, '')
      const fullPhoneNumber = profileData.countryCode + cleanNumber

      await updateUserProfile(user.uid, {
        displayName: profileData.displayName.trim(),
        businessName: profileData.businessName.trim(),
        phoneNumber: fullPhoneNumber,
        whatsappNumber: profileData.whatsappNumber.trim() || fullPhoneNumber,
        kobNumber: profileData.kobNumber.trim(), // Saving the manual KOB ID
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError("Save failed. Please check your connection.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="w-10 h-10 border-4 border-[#4B3621] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[#4B3621] font-black uppercase tracking-widest text-[10px]">Merchant Sync...</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4 pb-20">
      <div className="text-center">
        <h1 className="text-4xl font-black text-[#4B3621] uppercase tracking-tighter">Merchant Identity</h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Marketplace Presence</p>
      </div>

      {success && <Alert type="success">Identity Updated Successfully! ✅</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <Card className="p-8 md:p-12 rounded-[3rem] shadow-2xl border-b-[12px] border-[#4B3621] bg-white">
        <form onSubmit={handleSave} className="space-y-10">
          
          {/* Brand Visual - Profile Image Display Only */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-[#4B3621] p-1 shadow-xl bg-gray-50">
              {profileData.photoURL ? (
                <img src={profileData.photoURL} alt="Brand" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-[#4B3621]/20 text-2xl uppercase">KOB</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Merchant Full Name"
              value={profileData.displayName}
              onChange={(e) => setProfileData(p => ({ ...p, displayName: e.target.value }))}
              placeholder="Suleiman Baba"
              required
            />
            <Input
              label="Business/Brand Name"
              value={profileData.businessName}
              onChange={(e) => setProfileData(p => ({ ...p, businessName: e.target.value }))}
              placeholder="B-SANI BIO-CARE MED"
              required
            />
          </div>

          {/* KOB Number Manual Input */}
          <div className="space-y-2">
            <Input
              label="KOB ID Number"
              value={profileData.kobNumber}
              onChange={(e) => setProfileData(p => ({ ...p, kobNumber: e.target.value }))}
              placeholder="e.g. KOB - 123"
              className="font-black text-xl text-[#4B3621]"
              required
            />
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest px-2 italic">Enter your assigned ID (e.g., KOB - 001)</p>
          </div>

          {/* Country Selection (Radio Grid) */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Select Business Region</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setProfileData(p => ({ ...p, countryCode: c.code }))}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                    profileData.countryCode === c.code 
                    ? 'border-[#4B3621] bg-[#4B3621]/5 scale-105 shadow-md' 
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <span className="text-xl">{c.flag}</span>
                  <span className="text-[10px] font-black text-[#4B3621] mt-1">{c.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Phone Number</label>
              <div className="flex bg-gray-50 rounded-2xl border-2 border-gray-100 overflow-hidden focus-within:border-[#4B3621] transition-all shadow-inner">
                <div className="px-5 py-4 bg-gray-200 text-[#4B3621] font-black text-sm">{profileData.countryCode}</div>
                <input 
                  type="tel"
                  className="flex-1 p-4 bg-transparent focus:outline-none font-bold text-[#4B3621]"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData(p => ({ ...p, phoneNumber: e.target.value }))}
                />
              </div>
            </div>
            <Input
              label="Direct WhatsApp Number"
              value={profileData.whatsappNumber}
              onChange={(e) => setProfileData(p => ({ ...p, whatsappNumber: e.target.value }))}
              placeholder="2349131523336"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full py-6 text-xl font-black bg-[#4B3621] text-white uppercase tracking-[0.2em] shadow-xl hover:opacity-95 active:scale-95 transition-all rounded-3xl"
            loading={saving}
          >
            {saving ? 'Syncing...' : 'Update Merchant Identity'}
          </Button>
        </form>
      </Card>
    </div>
  )
                    }

