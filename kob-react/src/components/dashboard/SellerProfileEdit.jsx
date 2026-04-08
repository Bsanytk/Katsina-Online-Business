import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../firebase/auth";
import { getUserProfile, updateUserProfile } from "../../services/users";
import { Card, Input, Alert, Button } from "../ui";

const LOCATIONS = [
  "Katsina Central", "Daura", "Funtua", "Malumfashi", "Dutsin-Ma",
  "Dan-musa", "Kankara", "Batsari", "Kankia", "Mani", "Jibia",
  "Bakori", "Dandume", "Other",
];

const COUNTRIES = [
  { code: "+234", label: "NG 🇳🇬", placeholder: "803 123 4567" },
  { code: "+227", label: "NE 🇳🇪", placeholder: "90 123 456" },
  { code: "+233", label: "GH 🇬🇭", placeholder: "24 123 4567" },
];

export default function SellerProfileEdit() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    displayName: "",
    businessName: "",
    phoneNumber: "", // Wannan lambar da seller ke gani a box (misali: 803...)
    countryCode: "+234",
    kobNumber: "",
    location: "",
    fullAddress: "",
    photoURL: "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png",
  });

  const loadProfile = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const profile = await getUserProfile(user.uid);
      let rawPhone = profile.phoneNumber || "";
      let detectedCode = "+234";
      let detectedNumber = rawPhone;

      // Logic: Rabo lambar daga code din kasan (e.g. 234803... -> 803...)
      COUNTRIES.forEach((c) => {
        const cleanCode = c.code.replace("+", "");
        if (rawPhone.startsWith(cleanCode)) {
          detectedCode = c.code;
          detectedNumber = rawPhone.substring(cleanCode.length);
        }
      });

      setProfileData({
        displayName: profile.displayName || user.displayName || "",
        businessName: profile.businessName || "",
        phoneNumber: detectedNumber,
        countryCode: detectedCode,
        kobNumber: profile.kobNumber || "",
        location: profile.location || "",
        fullAddress: profile.fullAddress || "",
        photoURL: profile.photoURL || "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png",
      });
    } catch (err) {
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // 1. WhatsApp Standard: Cire komai banda lamba
      let cleanNumber = profileData.phoneNumber.replace(/\D/g, "");

      // 2. Remove Leading Zero: Idan ya rubuta 080... ya koma 80...
      if (cleanNumber.startsWith("0")) {
        cleanNumber = cleanNumber.substring(1);
      }

      // 3. Final Format: Code + Number (e.g. 234803...)
      const finalFullNumber = profileData.countryCode.replace("+", "") + cleanNumber;

      if (cleanNumber.length < 8) throw new Error("Phone number is too short.");

      await updateUserProfile(user.uid, {
        ...profileData,
        phoneNumber: finalFullNumber,
        whatsappNumber: finalFullNumber, // Standard format saved to profile
        role: "seller",
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-20 text-center font-bold">Loading Identity...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-[#4B3621] uppercase italic">Brand Identity</h1>
        <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold">KOB Merchant Portal</p>
      </div>

      {success && <Alert type="success" className="mb-6">Profile Updated Successfully! ✅</Alert>}
      {error && <Alert type="error" className="mb-6">{error}</Alert>}

      <Card className="p-8 rounded-[2rem] shadow-xl border-b-8 border-[#4B3621]">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section: Name & Business */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Full Name</label>
              <Input
                value={profileData.displayName}
                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Business Name</label>
              <Input
                value={profileData.businessName}
                onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Section: Standardized Phone Input */}
          <div>
            <label className="text-[10px] font-bold uppercase text-[#4B3621] ml-2">
              WhatsApp Number (No leading "0")
            </label>
            <div className="flex border-2 border-gray-100 rounded-2xl overflow-hidden focus-within:border-[#4B3621] transition-all bg-white">
              <select
                className="bg-gray-50 px-4 font-bold text-[#4B3621] outline-none border-r border-gray-100 cursor-pointer"
                value={profileData.countryCode}
                onChange={(e) => setProfileData({ ...profileData, countryCode: e.target.value })}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label} {c.code}</option>
                ))}
              </select>
              <input
                type="tel"
                placeholder={COUNTRIES.find(c => c.code === profileData.countryCode)?.placeholder}
                className="flex-1 p-4 outline-none font-black text-[#4B3621] text-lg"
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                required
              />
            </div>
            <p className="text-[9px] text-amber-600 mt-2 ml-2 font-medium italic">
              * Don't start with 0. Example: If your number is 0803, write 803 only.
            </p>
          </div>

          {/* Section: KOB ID & Region */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">KOB ID (Verified)</label>
              <div className="p-4 bg-gray-50 rounded-2xl font-black text-[#4B3621] border-2 border-dashed border-gray-200">
                {profileData.kobNumber || "NOT VERIFIED"}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Marketplace Region</label>
              <select
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold outline-none text-[#4B3621]"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                required
              >
                <option value="">Select Region</option>
                {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
          </div>

          {/* Section: Address */}
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Full Shop Address</label>
            <Input
              value={profileData.fullAddress}
              onChange={(e) => setProfileData({ ...profileData, fullAddress: e.target.value })}
              placeholder="e.g. Shop 12, Kofar Kaura, Katsina"
              required
            />
          </div>

          <Button
            disabled={saving}
            className="w-full py-5 bg-[#4B3621] text-white font-black rounded-2xl shadow-xl uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all"
          >
            {saving ? "Processing..." : "Save Identity"}
          </Button>
        </form>
      </Card>
    </div>
  );
}