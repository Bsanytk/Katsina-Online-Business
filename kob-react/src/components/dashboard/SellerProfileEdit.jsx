import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../firebase/auth";
import { getUserProfile, updateUserProfile } from "../../services/users";
import { Card, Input, Alert, Button } from "../ui";

// KOB Brand Palette
const KOB_BROWN = "#4B3621";
const KOB_GOLD = "#D4AF37";

const LOCATIONS = [
  "Katsina Central",
  "Daura",
  "Funtua",
  "Malumfashi",
  "Dutsin-Ma",
  "Kankia",
  "Mani",
  "Jibia",
  "Bakori",
  "Other",
];

const COUNTRIES = [
  { code: "+234", label: "Nigeria 🇳🇬", id: "ng" },
  { code: "+227", label: "Niger 🇳🇪", id: "ne" },
  { code: "+233", label: "Ghana 🇬🇭", id: "gh" },
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
    phoneNumber: "",
    countryCode: "+234",
    whatsappNumber: "",
    kobNumber: "",
    location: "",
    photoURL:
      "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png",
  });

  const loadProfile = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const profile = await getUserProfile(user.uid);
      let rawPhone = profile.phoneNumber || profile.phone || "";
      let detectedCode = "+234";
      let detectedNumber = rawPhone;

      COUNTRIES.forEach((c) => {
        if (rawPhone.startsWith(c.code)) {
          detectedCode = c.code;
          detectedNumber = rawPhone.replace(c.code, "");
        }
      });

      setProfileData((prev) => ({
        ...prev,
        displayName: profile.displayName || user.displayName || "",
        businessName: profile.businessName || "",
        phoneNumber: detectedNumber.replace(/\s+/g, ""),
        countryCode: detectedCode,
        whatsappNumber: profile.whatsappNumber || "",
        // MUHIMMI: Duba database, idan babu, duba cikin Auth (user.kobNumber)
        kobNumber: profile.kobNumber || user.kobNumber || "",
        location: profile.location || "",
      }));
    } catch (err) {
      setError("Failed to synchronize merchant data.");
    } finally {
      setLoading(false);
    }
  }, [user]); // Mun sanya 'user' baki daya don gudun lag

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const cleanCountryCode = profileData.countryCode.replace("+", "");
      const cleanPhone = profileData.phoneNumber.replace(/\D/g, "");
      const fullNumber = cleanCountryCode + cleanPhone;

      await updateUserProfile(user.uid, {
        displayName: profileData.displayName.trim(),
        businessName: profileData.businessName.trim(),
        phoneNumber: fullNumber,
        whatsappNumber: fullNumber, // Kamar yadda kace su zama daya
        location: profileData.location,
        photoURL: profileData.photoURL,
        kobNumber: profileData.kobNumber, // Tabbatar an sake adana shi
        role: "seller",
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Update failed. Please check your network.");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-[#4B3621] border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6 font-['Inter']">
      <div className="text-center">
        <h1 className="text-4xl font-black text-[#4B3621] uppercase tracking-tighter italic font-['Montserrat']">
          Brand Identity
        </h1>
        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-[0.5em] mt-2">
          Katsina Online Business Portal
        </p>
      </div>

      {success && (
        <Alert type="success" className="rounded-2xl border-2 border-green-200">
          Brand Profile Updated Successfully! ✅
        </Alert>
      )}
      {error && (
        <Alert type="error" className="rounded-2xl border-2 border-red-200">
          {error}
        </Alert>
      )}

      <Card className="p-8 md:p-12 rounded-[2.5rem] shadow-2xl bg-white border-b-[10px] border-[#4B3621] overflow-hidden">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-[6px] border-[#D4AF37] p-1 shadow-2xl overflow-hidden bg-gray-50">
                <img
                  src={profileData.photoURL}
                  alt="Merchant"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute -bottom-2 bg-[#4B3621] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border-2 border-white">
                Official
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-2">
                Profile Name
              </label>
              <Input
                value={profileData.displayName}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, displayName: e.target.value }))
                }
                placeholder="e.g. Suleiman Baba"
                className="rounded-2xl border-2 border-gray-100 focus:border-[#4B3621] font-semibold"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-2">
                Business Name
              </label>
              <Input
                value={profileData.businessName}
                onChange={(e) =>
                  setProfileData((p) => ({
                    ...p,
                    businessName: e.target.value,
                  }))
                }
                placeholder="e.g. B-SANI BIO-CARE MED"
                className="rounded-2xl border-2 border-gray-100 focus:border-[#4B3621] font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-2">
                Verified KOB ID
              </label>
              <div className="w-full p-4 bg-gray-100 border-2 border-dashed border-gray-200 rounded-2xl font-black text-[#4B3621] flex items-center gap-2">
                <span className="text-lg">🆔</span>{" "}
                {profileData.kobNumber || "PENDING..."}
              </div>
              <p className="text-[9px] text-gray-400 italic ml-2">
                * This ID is locked and verified by Admin.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-2">
                Marketplace Location
              </label>
              <select
                value={profileData.location}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, location: e.target.value }))
                }
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#4B3621] outline-none font-bold text-[#4B3621] appearance-none transition-all"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234B3621' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1.2rem center",
                  backgroundSize: "1em",
                }}
              >
                <option value="">Select Region</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-2">
                Official Phone
              </label>
              <div className="flex bg-gray-50 rounded-2xl border-2 border-gray-100 overflow-hidden focus-within:border-[#4B3621] transition-all">
                <select
                  value={profileData.countryCode}
                  onChange={(e) =>
                    setProfileData((p) => ({
                      ...p,
                      countryCode: e.target.value,
                    }))
                  }
                  className="bg-gray-100 px-3 font-bold text-[12px] text-[#4B3621] border-r border-gray-200 outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  className="flex-1 p-4 bg-transparent focus:outline-none font-bold text-[#4B3621] placeholder:text-gray-300"
                  value={profileData.phoneNumber}
                  onChange={(e) =>
                    setProfileData((p) => ({
                      ...p,
                      phoneNumber: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-2">
                WhatsApp Contact
              </label>
              <Input
                value={profileData.whatsappNumber}
                onChange={(e) =>
                  setProfileData((p) => ({
                    ...p,
                    whatsappNumber: e.target.value,
                  }))
                }
                placeholder="e.g. 234913..."
                className="rounded-2xl border-2 border-gray-100 focus:border-[#4B3621] font-semibold"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-5 text-lg font-black bg-[#4B3621] text-white uppercase tracking-widest shadow-2xl hover:bg-[#362618] active:scale-95 transition-all rounded-2xl mt-4"
            disabled={saving}
          >
            {saving ? "Synchronizing Data..." : "Confirm Brand Identity"}
          </Button>
        </form>
      </Card>

      <p className="text-center text-[10px] text-gray-400 font-medium">
        KOB Market Place • Secure Merchant Portal
      </p>
    </div>
  );
}
