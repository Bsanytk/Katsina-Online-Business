import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../firebase/auth'
import { getUserProfile, updateUserProfile } from '../../services/users'
import { Card, Input, Alert, Button } from '../ui'

// KOB Brand Palette
const KOB_BROWN = "#4B3621";
const KOB_GOLD = "#D4AF37";

const LOCATIONS = [
  "Katsina Central", "Daura", "Funtua", "Malumfashi", "Dutsin-Ma", 
  "Kankia", "Mani", "Jibia", "Bakori", "Other"
];

const COUNTRIES = [
  { code: '+234', label: 'Nigeria 🇳🇬', id: 'ng' },
  { code: '+227', label: 'Niger 🇳🇪', id: 'ne' },
  { code: '+233', label: 'Ghana 🇬🇭', id: 'gh' },
];

export default function SellerProfileEdit() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [profileData, setProfileData] = useState({
    displayName: '',
    businessName: '',
    phoneNumber: '',
    countryCode: '+234',
    whatsappNumber: '',
    kobNumber: 'KOB - ',
    location: '',
    photoURL: 'https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png'
  })

  // --- Auto-generate KOB Number helper ---
  const generateKOBNumber = () => `KOB-${Math.floor(1000 + Math.random() * 9000)}`

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

      // --- Auto-generate KOB number if empty or default ---
      const kobNumber = profile.kobNumber && profile.kobNumber !== 'KOB - '
        ? profile.kobNumber
        : generateKOBNumber()

      setProfileData(prev => ({
        ...prev,
        displayName: profile.displayName || '',
        businessName: profile.businessName || '',
        phoneNumber: detectedNumber.replace(/\s+/g, ''),
        countryCode: detectedCode,
        whatsappNumber: profile.whatsappNumber || '',
        kobNumber,
        location: profile.location || '',
      }))
    } catch (err) {
      setError("Failed to synchronize merchant data.")
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
      const fullPhoneNumber = profileData.countryCode + profileData.phoneNumber.replace(/\D/g, '')

      await updateUserProfile(user.uid, {
        displayName: profileData.displayName.trim(),
        businessName: profileData.businessName.trim(),
        phoneNumber: fullPhoneNumber,
        whatsappNumber: profileData.whatsappNumber.trim(),
        kobNumber: profileData.kobNumber.trim(),
        location: profileData.location,
        photoURL: profileData.photoURL,
        role: 'seller'
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError("Update failed. Please check your network.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 animate-pulse">
      <div className="w-12 h-12 border-4 border-[#4B3621] border-t-[#D4AF37] rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-black text-[#4B3621] uppercase tracking-tighter italic">Brand Identity</h1>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">Katsina Online Business Portal</p>
      </div>

      {success && <Alert type="success">Brand Profile Updated Successfully! ✅</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <Card className="p-8 md:p-12 rounded-[3rem] shadow-2xl bg-white border-b-[12px] border-[#4B3621]">
        <form onSubmit={handleSave} className="space-y-8">

          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full border-4 border-[#D4AF37] p-1 shadow-xl overflow-hidden">
              <img src={profileData.photoURL} alt="Merchant" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="text-[10px] font-black text-[#4B3621] uppercase tracking-widest bg-gray-100 px-4 py-1 rounded-full">Official KOB Avatar</span>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Profile Name"
              value={profileData.displayName}
              onChange={(e) => setProfileData(p => ({ ...p, displayName: e.target.value }))}
              placeholder="e.g. Suleiman Baba"
              required
            />
            <Input
              label="Business Name"
              value={profileData.businessName}
              onChange={(e) => setProfileData(p => ({ ...p, businessName: e.target.value }))}
              placeholder="e.g. B-SANI BIO-CARE MED"
              required
            />
          </div>

          {/* KOB Number & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 relative">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">KOB Number</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={profileData.kobNumber}
                  onChange={(e) => setProfileData(p => ({ ...p, kobNumber: e.target.value }))}
                  className="flex-1 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#4B3621] font-black text-[#4B3621]"
                  placeholder="KOB - XXX"
                  required
                />
                <button
                  type="button"
                  onClick={() => setProfileData(p => ({ ...p, kobNumber: generateKOBNumber() }))}
                  className="px-3 py-2 bg-[#D4AF37] text-white rounded-xl font-bold text-[10px] hover:opacity-90 transition"
                  title="Regenerate KOB Number"
                >
                  Regenerate
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Marketplace Location</label>
              <select
                value={profileData.location}
                onChange={(e) => setProfileData(p => ({ ...p, location: e.target.value }))}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#4B3621] outline-none font-bold text-[#4B3621] appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%234B3621\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
              >
                <option value="">Select Region</option>
                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Phone Number</label>
              <div className="flex bg-gray-50 rounded-2xl border-2 border-gray-100 overflow-hidden focus-within:border-[#4B3621] transition-all">
                <select 
                  value={profileData.countryCode}
                  onChange={(e) => setProfileData(p => ({ ...p, countryCode: e.target.value }))}
                  className="bg-gray-200 px-4 py-4 font-black text-[10px] text-[#4B3621] outline-none"
                >
                  {COUNTRIES.map(c => <option key={c.id} value={c.code}>{c.code}</option>)}
                </select>
                <input 
                  type="tel"
                  className="flex-1 p-4 bg-transparent focus:outline-none font-bold text-[#4B3621]"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData(p => ({ ...p, phoneNumber: e.target.value }))}
                />
              </div>
            </div>
            <Input
              label="WhatsApp Number"
              value={profileData.whatsappNumber}
              onChange={(e) => setProfileData(p => ({ ...p, whatsappNumber: e.target.value }))}
              placeholder="e.g. 2349131523336"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full py-6 text-xl font-black bg-[#4B3621] text-white uppercase tracking-[0.2em] shadow-xl hover:opacity-95 active:scale-95 transition-all rounded-[2rem]"
            disabled={saving}
          >
            {saving ? 'Syncing...' : 'Update Identity'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
