/**
 * AvatarUpload.jsx
 *
 * FIXES:
 * ✅ Avatar positioning — no excessive negative margin
 * ✅ Clean layering — no z-index clash with banner
 * ✅ Upload uses env-based service (no hardcoded config)
 * ✅ Error feedback to user
 * ✅ Accessible touch target
 */

import React, { useRef, useState } from "react";
import { uploadAvatar } from "../../services/profile";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png";

export default function AvatarUpload({
  photoURL,
  displayName,
  uid,
  onSuccess,
  // ✅ size controls used in profile card overlap fix
  size = "lg",
  // ✅ overlap mode — for profile hero card
  overlap = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const inputRef = useRef();

  // Size map
  const sizeMap = {
    sm: "w-14 h-14",
    md: "w-18 h-18",
    lg: "w-20 h-20",
    xl: "w-24 h-24",
  };

  const initials = (displayName || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Instant local preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      // ✅ uploadAvatar uses env vars internally
      const url = await uploadAvatar(file, uid);
      onSuccess?.(url);
      setPreview(null); // Firestore now has the real URL
    } catch (err) {
      setUploadError(err.message);
      setPreview(null); // Reset preview on error
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const imgSrc = preview || photoURL || DEFAULT_AVATAR;

  return (
    <div
      className={`
      relative w-fit
      ${overlap ? "mt-0" : ""}
    `}
    >
      {/* Avatar container */}
      <div
        className={`
        ${sizeMap[size]}
        rounded-2xl border-4 border-white shadow-lg
        overflow-hidden bg-[#4B3621]
        flex items-center justify-center
        flex-shrink-0
      `}
      >
        <img
          src={imgSrc}
          alt={displayName || "Avatar"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_AVATAR;
          }}
        />

        {/* Uploading overlay */}
        {uploading && (
          <div
            className="absolute inset-0 bg-black/50
            flex items-center justify-center rounded-2xl"
          >
            <svg
              className="animate-spin w-6 h-6 text-white"
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
          </div>
        )}
      </div>

      {/* Camera button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1.5 -right-1.5
          w-8 h-8 bg-[#4B3621] text-white rounded-xl
          flex items-center justify-center shadow-lg
          border-2 border-white hover:bg-[#362818]
          transition-colors disabled:opacity-50
          touch-manipulation"
        aria-label="Change profile photo"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2
            2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0
            0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0
            01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />

      {/* Upload error */}
      {uploadError && (
        <div
          className="absolute top-full left-0 right-0 mt-2
          px-3 py-2 bg-red-50 border border-red-200 rounded-xl
          text-[10px] text-red-600 font-medium text-center
          min-w-[160px] z-10"
        >
          {uploadError}
        </div>
      )}
    </div>
  );
}
