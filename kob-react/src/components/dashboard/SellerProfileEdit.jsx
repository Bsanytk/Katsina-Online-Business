import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../firebase/auth";
import { getUserProfile, updateUserProfile } from "../../services/users";
import { Card, Input, Alert, Button } from "../ui";

const LOCATIONS = [
  "Katsina Central",
  "Daura",
  "Funtua",
  "Malumfashi",
  "Dutsin-Ma",
  "Dan-musa",
  "Kankara",
  "Batsari",
  "Kankia",
  "Mani",
  "Jibia",
  "Bakori",
  "Dandume",
  "Other",
];
const COUNTRIES = [
  { code: "+234", label: "NG 🇳🇬" },
  { code: "+227", label: "NE 🇳🇪" },
  { code: "+233", label: "GH 🇬🇭" },
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
    kobNumber: "",
    location: "",
    fullAddress: "",
    photoURL:
      "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png",
  });

  const loadProfile = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const profile = await getUserProfile(user.uid);
      let rawPhone = profile.phoneNumber || "";
      let detectedCode = "+234";
      let detectedNumber = rawPhone;

      // Cire code din kasar don nuna sauran lambar a box
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
        kobNumber: profile.kobNumber || user.kobNumber || "",
        location: profile.location || "",
        fullAddress: profile.fullAddress || "",
        photoURL:
          profile.photoURL ||
          "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png",
      });
    } catch (err) {
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // 1. Gyara lambar waya (Cire duk abinda ba lamba ba)
      let cleanNumber = profileData.phoneNumber.replace(/\D/g, "");

      // 2. Idan ta fara da 0 (misali 080...), cire 0 din
      if (cleanNumber.startsWith("0")) {
        cleanNumber = cleanNumber.substring(1);
      }

      // 3. Hada lambar da code din kasar (ba tare da + ba don Database)
      const finalFullNumber =
        profileData.countryCode.replace("+", "") + cleanNumber;

      if (cleanNumber.length < 10) {
        throw new Error("Phone number is too short.");
      }

      await updateUserProfile(user.uid, {
        ...profileData,
        phoneNumber: finalFullNumber,
        whatsappNumber: finalFullNumber, // Duk daya yanzu
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

  if (loading)
    return <div className="p-20 text-center font-bold">Loading Profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-[#4B3621] uppercase italic">
          Brand Identity
        </h1>
        <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase font-bold">
          KOB Merchant Portal
        </p>
      </div>

      {success && (
        <Alert type="success" className="mb-6">
          Profile Updated Successfully! ✅
        </Alert>
      )}
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <Card className="p-8 rounded-[2rem] shadow-xl border-b-8 border-[#4B3621]">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">
                Full Name
              </label>
              <Input
                value={profileData.displayName}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    displayName: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">
                Business Name
              </label>
              <Input
                value={profileData.businessName}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    businessName: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">
              Official Phone / WhatsApp
            </label>
            <div className="flex border-2 border-gray-100 rounded-2xl overflow-hidden focus-within:border-[#4B3621] transition-all">
              <select
                className="bg-gray-100 px-4 font-bold text-[#4B3621] outline-none border-r"
                value={profileData.countryCode}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    countryCode: e.target.value,
                  })
                }
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label} {c.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="803 000 0000"
                className="flex-1 p-4 outline-none font-bold text-[#4B3621]"
                value={profileData.phoneNumber}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    phoneNumber: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">
                KOB ID (Verified)
              </label>
              <div className="p-4 bg-gray-50 rounded-2xl font-black text-[#4B3621] border-2 border-dashed">
                {profileData.kobNumber || "NOT VERIFIED"}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">
                Marketplace Region
              </label>
              <select
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold outline-none"
                value={profileData.location}
                onChange={(e) =>
                  setProfileData({ ...profileData, location: e.target.value })
                }
                required
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

          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">
              Full Shop Address
            </label>
            <Input
              value={profileData.fullAddress}
              onChange={(e) =>
                setProfileData({ ...profileData, fullAddress: e.target.value })
              }
              placeholder="House No, Street Name, Area..."
              required
            />
          </div>

          <Button
            disabled={saving}
            className="w-full py-5 bg-[#4B3621] text-white font-black rounded-2xl shadow-lg uppercase tracking-widest"
          >
            {saving ? "Updating..." : "Save Identity"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
