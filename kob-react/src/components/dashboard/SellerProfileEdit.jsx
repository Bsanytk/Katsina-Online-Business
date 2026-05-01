import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../firebase/auth";
import { getUserProfile, updateUserProfile } from "../../services/users";
import { Card, Input, Alert, Button } from "../ui";
import Loading from "../Loading";

// ================================
// Constants
// ================================
const LOCATIONS = [
  "Katsina Central",
  "Daura",
  "Funtua",
  "Dutsin-Ma",
  "Kankia",
  "Other",
];

const COUNTRIES = [
  { code: "+234", label: "NG 🇳🇬", placeholder: "803 123 4567" },
  { code: "+227", label: "NE 🇳🇪", placeholder: "90 123 456" },
  { code: "+233", label: "GH 🇬🇭", placeholder: "24 123 4567" },
];

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png";

// ================================
// Main Component
// ================================
export default function SellerProfileEdit() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    displayName: "",
    businessName: "",
    phoneNumber: "",
    countryCode: "+234",
    kobNumber: "",
    location: "",
    fullAddress: "",
    photoURL: DEFAULT_AVATAR,
  });

  // ================================
  // Load Profile
  // ================================
  const loadProfile = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const profile = await getUserProfile(user.uid);

      // Detect country code from saved number
      let rawPhone = profile.phoneNumber || "";
      let detectedCode = "+234";
      let detectedNumber = rawPhone;

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
        photoURL: profile.photoURL || DEFAULT_AVATAR,
      });
    } catch (err) {
      setError("Failed to load profile. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ================================
  // Field change handler
  // ================================
  function handleChange(field, value) {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  // ================================
  // Validation
  // ================================
  function validate() {
    const e = {};
    if (!profileData.displayName.trim())
      e.displayName = "Full name is required";
    if (!profileData.businessName.trim())
      e.businessName = "Business name is required";
    if (
      !profileData.phoneNumber.trim() ||
      profileData.phoneNumber.replace(/\D/g, "").length < 8
    )
      e.phoneNumber = "Enter a valid phone number (min 8 digits)";
    if (!profileData.location) e.location = "Please select your region";
    if (!profileData.fullAddress.trim())
      e.fullAddress = "Full shop address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ================================
  // Save Handler
  // ================================
  async function handleSave(e) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Clean phone number
      let cleanNumber = profileData.phoneNumber.replace(/\D/g, "");
      if (cleanNumber.startsWith("0")) {
        cleanNumber = cleanNumber.substring(1);
      }
      if (cleanNumber.length < 8) {
        throw new Error("Phone number is too short.");
      }

      const finalNumber =
        profileData.countryCode.replace("+", "") + cleanNumber;

      // Only send allowed fields to Firestore
      const updatedData = {
        displayName: profileData.displayName.trim(),
        businessName: profileData.businessName.trim(),
        phoneNumber: finalNumber,
        whatsappNumber: finalNumber,
        location: profileData.location,
        fullAddress: profileData.fullAddress.trim(),
        photoURL: profileData.photoURL,
        role: "seller",
      };

      await updateUserProfile(user.uid, updatedData);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Update failed. Please check your connection.");
    } finally {
      setSaving(false);
    }
  }

  // ================================
  // Loading State
  // ================================
  if (loading) {
    return <Loading size="md" message="Loading your profile..." />;
  }

  // ================================
  // Render
  // ================================
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1
          className="text-3xl font-black text-[#4B3621]
          uppercase tracking-tight"
        >
          Brand Identity
        </h1>
        <p
          className="text-[10px] tracking-[0.3em] text-[#D4AF37]
          uppercase font-bold mt-1"
        >
          KOB Merchant Portal
        </p>
      </div>

      {/* Alerts */}
      {success && (
        <Alert type="success" className="mb-6" autoDismiss={5000}>
          ✅ Profile updated successfully! Your shop is up to date.
        </Alert>
      )}
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Form Card */}
      <Card
        className="p-8 rounded-3xl shadow-xl
        border-b-4 border-[#4B3621] bg-white"
      >
        <form onSubmit={handleSave} className="space-y-6" noValidate>
          {/* ---- Row 1: Names ---- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Sulaiman Sani"
              value={profileData.displayName}
              onChange={(e) => handleChange("displayName", e.target.value)}
              error={errors.displayName}
            />
            <Input
              label="Business Name"
              required
              placeholder="e.g. B-SANI Store"
              value={profileData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              error={errors.businessName}
            />
          </div>

          {/* ---- Row 2: WhatsApp Number ---- */}
          <div>
            <label
              className="block text-xs font-bold uppercase
              tracking-widest text-gray-500 mb-2"
            >
              WhatsApp Number
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div
              className={`
              flex items-stretch border-2 rounded-xl overflow-hidden
              transition-all duration-200 bg-white
              ${
                errors.phoneNumber
                  ? "border-red-400"
                  : "border-gray-200 focus-within:border-[#4B3621] focus-within:shadow-md"
              }
            `}
            >
              {/* Country Code Selector */}
              <div
                className="flex-shrink-0 w-32 bg-gray-50
                border-r border-gray-200"
              >
                <select
                  value={profileData.countryCode}
                  onChange={(e) => handleChange("countryCode", e.target.value)}
                  className="w-full h-full px-3 py-3
                    bg-transparent font-bold text-[#4B3621]
                    text-sm outline-none cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label} {c.code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Number Input */}
              <input
                type="tel"
                placeholder={
                  COUNTRIES.find((c) => c.code === profileData.countryCode)
                    ?.placeholder || "803 123 4567"
                }
                value={profileData.phoneNumber}
                onChange={(e) =>
                  handleChange("phoneNumber", e.target.value.replace(/\D/g, ""))
                }
                className="flex-1 px-4 py-3 outline-none
                  font-bold text-[#4B3621] text-base
                  bg-transparent min-w-0"
                required
              />
            </div>

            {/* Phone hint or error */}
            {errors.phoneNumber ? (
              <p
                className="mt-1.5 text-xs text-red-500
                font-medium flex items-center gap-1"
              >
                <span>⚠</span> {errors.phoneNumber}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-gray-400">
                Without leading zero — e.g. 803 123 4567
              </p>
            )}
          </div>

          {/* ---- Row 3: KOB ID + Region ---- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* KOB ID — Read Only */}
            <div>
              <label
                className="block text-xs font-bold uppercase
                tracking-widest text-gray-500 mb-2"
              >
                KOB ID
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3
                bg-gray-50 rounded-xl border-2 border-dashed
                border-gray-200"
              >
                <span className="text-lg">🆔</span>
                <div>
                  <p className="font-black text-[#4B3621] text-base">
                    {profileData.kobNumber || "KOB-000"}
                  </p>
                  <p
                    className="text-[9px] text-gray-400
                    uppercase tracking-widest font-bold"
                  >
                    Verified ID — Read Only
                  </p>
                </div>
              </div>
            </div>

            {/* Region Selector */}
            <div>
              <label
                className="block text-xs font-bold uppercase
                tracking-widest text-gray-500 mb-2"
              >
                Marketplace Region
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div
                className={`
                border-2 rounded-xl overflow-hidden
                transition-all duration-200
                ${
                  errors.location
                    ? "border-red-400"
                    : "border-gray-200 focus-within:border-[#4B3621]"
                }
              `}
              >
                <select
                  value={profileData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full px-4 py-3 bg-white
                    font-bold text-sm text-[#4B3621]
                    outline-none cursor-pointer"
                  required
                >
                  <option value="">Select your region...</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
              {errors.location && (
                <p
                  className="mt-1.5 text-xs text-red-500
                  font-medium flex items-center gap-1"
                >
                  <span>⚠</span> {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* ---- Row 4: Full Address ---- */}
          <Input
            label="Full Shop Address"
            required
            placeholder="e.g. Shop 12, Kofar Kaura, Katsina"
            value={profileData.fullAddress}
            onChange={(e) => handleChange("fullAddress", e.target.value)}
            error={errors.fullAddress}
            hint="This address will appear on all your product listings"
          />

          {/* ---- Submit Button ---- */}
          <button
            type="submit"
            disabled={saving}
            className={`
              w-full py-4 rounded-2xl font-black text-sm
              uppercase tracking-widest transition-all duration-200
              ${
                saving
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#4B3621] text-white hover:bg-[#362818] shadow-lg active:scale-[0.98]"
              }
            `}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Identity"
            )}
          </button>
        </form>
      </Card>

      {/* Info Note */}
      <p
        className="text-center text-xs text-gray-400
        mt-6 font-medium leading-relaxed"
      >
        Your WhatsApp number will be used for buyer contact.
        <br />
        KOB ID is assigned by admin and cannot be changed.
      </p>
    </div>
  );
}
