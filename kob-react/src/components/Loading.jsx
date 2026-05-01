import React from "react";

/**
 * Professional Loading Component - KOB Design System
 * Simple, clean, globally standard
 * @param {string} message - Loading message
 * @param {boolean} fullScreen - Full screen mode
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export default function Loading({
  message = "Welcome to KOB Marketplace",
  fullScreen = false,
  size = "md",
}) {
  const sizes = {
    sm: { logo: "w-8 h-8", bar: "w-24", text: "text-xs" },
    md: { logo: "w-14 h-14", bar: "w-40", text: "text-sm" },
    lg: { logo: "w-20 h-20", bar: "w-56", text: "text-base" },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div
      className={`
      flex flex-col items-center justify-center gap-6
      ${fullScreen ? "min-h-screen bg-white" : "py-12"}
    `}
    >
      {/* KOB Logo */}
      <img
        src="https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png"
        alt="KOB"
        className={`${s.logo} object-contain`}
      />

      {/* Skeleton Loading Bar — Global Standard */}
      <div className={`${s.bar} flex flex-col gap-2`}>
        {/* Main progress bar */}
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4B3621] rounded-full"
            style={{ animation: "kob-slide 1.5s ease-in-out infinite" }}
          />
        </div>

        {/* Secondary bar — offset */}
        <div className="w-full h-0.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4AF37] rounded-full"
            style={{ animation: "kob-slide 1.5s ease-in-out infinite 0.4s" }}
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <p
          className={`
          ${s.text} font-medium text-gray-400 
          tracking-wide text-center max-w-xs
        `}
        >
          {message}
        </p>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes kob-slide {
          0%   { width: 0%;  margin-left: 0%; }
          50%  { width: 60%; margin-left: 20%; }
          100% { width: 0%;  margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
