import React, { useRef, useState } from "react";
import { uploadProfilePicture } from "../../services/profile";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png";

export default function AvatarUpload({
  photoURL,
  displayName,
  uid,
  onSuccess,
  size = "lg",
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef();

  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const url = await uploadProfilePicture(file, uid);
      onSuccess?.(url);
    } catch (err) {
      alert(err.message);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="relative w-fit mx-auto">
      {/* Avatar */}
      <div
        className={`
        ${sizeMap[size]} rounded-3xl overflow-hidden
        border-4 border-white shadow-xl bg-[#4B3621]
        flex items-center justify-center
      `}
      >
        {preview || photoURL ? (
          <img
            src={preview || photoURL || DEFAULT_AVATAR}
            alt={displayName || "Avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-bold text-2xl">{initials}</span>
        )}

        {/* Uploading overlay */}
        {uploading && (
          <div
            className="absolute inset-0 bg-black/50
            flex items-center justify-center rounded-3xl"
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

      {/* Edit button */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1 -right-1
          w-8 h-8 bg-[#4B3621] text-white rounded-xl
          flex items-center justify-center
          shadow-lg border-2 border-white
          hover:bg-[#362818] transition-colors
          disabled:opacity-50"
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
            0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0
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
    </div>
  );
}
