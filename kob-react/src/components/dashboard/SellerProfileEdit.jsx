import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../firebase/auth'
import { getUserProfile, updateUserProfile } from '../../services/users'
import { storage } from '../../firebase/firebase' 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
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
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

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

  // Photo Upload Handler
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) return setError("Image size must be less than 2MB")
    
    setUploadingPhoto(true)
    try {
      const storageRef = ref(storage, `profiles/${user.uid}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      setProfileData(prev => ({ ...prev, photoURL: url }))
      // Update Firestore immediately for the photo
      await updateUserProfile(user.uid, { photoURL: url })
    } catch (err) {
      setError("Failed to upload profile picture.")
    } finally {
      setUploadingPhoto(false)
    }
  }

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
        photoURL: profileData.photoURL,
        phoneNumber: fullPhoneNumber,
        phone: fullPhoneNumber, // Sync for older components
        whatsappNumber: profileData.whatsappNumber.trim() || fullPhoneNumber,
        whatsapp: profileData.whatsappNumber.trim() || fullPhoneNumber, // Sync for older components
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
      <div className="w-12 h-12 border-4 border-kob-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-kob-neutral-500 font-bold uppercase tracking-widest">Loading Profile...</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in p-4 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-kob-dark tracking-tighter uppercase">Business Identity</h1>
        <p className="text-kob-neutral-500">Manage how your brand appears on KOB Marketplace.</p>
      </div>

      {success && <Alert type="success">Profile updated successfully! ✅</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <Card className="p-8 md:p-12 rounded-[2rem] shadow-2xl border-b-[12px] border-kob-primary bg-white relative overflow-hidden">
        <form onSubmit={handleSave} className="space-y-10">
          
          {/* Circular Photo with Pulse Animation */}
          <div className="flex flex-col items-center group">
            <div className="relative">
              <div className={`w-40 h-40 rounded-full border-[6px] border-kob-primary p-1 transition-all duration-500 shadow-2xl ${uploadingPhoto ? 'animate-pulse scale-95' : 'hover:scale-105'}`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-kob-neutral-100">
                  {profileData.photoURL ? (
                    <img src={profileData.photoURL} alt="Brand" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-kob-neutral-400 font-black text-2xl">B-SANI</div>
                  )}
                </div>
              </div>
              <label className="absolute bottom-1 right-1 bg-kob-dark text-white p-3 rounded-full cursor-pointer hover:bg-kob-primary border-4 border-white shadow-xl transition-all hover:rotate-12">
                <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                📸
              </label>
            </div>
            <p className="mt-3 text-xs font-bold text-kob-neutral-400 uppercase tracking-widest">Click icon to change photo</p>
          </div>

          <Input
            label="Business Name"
            value={profileData.displayName}
            onChange={(e) => setProfileData(p => ({ ...p, displayName: e.target.value }))}
            placeholder="e.g. B-SANI BIO-CARE MED"
            required
          />

          {/* Locked Country Code Radio Grid */}
          <div className="space-y-4">
            <label className="text-xs font-black text-kob-dark uppercase tracking-[0.2em] block">Select Business Location</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setProfileData(p => ({ ...p, countryCode: c.code }))}
                  className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                    profileData.countryCode === c.code 
                    ? 'border-kob-primary bg-kob-primary/10 scale-105 shadow-lg' 
                    : 'border-kob-neutral-100 bg-white hover:border-kob-neutral-300'
                  }`}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <span className="text-sm font-black text-kob-dark">{c.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Locked Prefix Phone Input */}
          <div className="space-y-2">
            <label className="text-xs font-black text-kob-dark uppercase tracking-[0.2em]">Phone Number (Mobile)</label>
            <div className="flex items-center bg-kob-neutral-50 rounded-2xl border-2 border-kob-neutral-200 focus-within:border-kob-primary focus-within:bg-white transition-all overflow-hidden shadow-inner">
              <div className="px-6 py-4 bg-kob-neutral-200 text-kob-dark font-black text-lg">
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
            className="w-full py-6 text-xl font-black uppercase tracking-[0.3em] shadow-2xl hover:shadow-kob-primary/50 transition-all active:scale-95"
            loading={saving || uploadingPhoto}
          >
            {saving ? 'Synchronizing...' : 'Update Merchant Profile'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
        
