import React, { useEffect, useState } from "react";

/**
 * Professional PageLoader Component - KOB Design System
 * @param {string} message - Loading message (default: 'Loading...')
 * @param {boolean} show - Whether to render the loader
 * @param {boolean} fullScreen - Full screen or inline (default: true)
 * @param {number} timeout - Auto-hide after N ms (optional)
 */
export default function PageLoader({
  message = "Loading...",
  show = true,
  fullScreen = true,
  timeout,
}) {
  const [isVisible, setIsVisible] = useState(show);
  const [isLeaving, setIsLeaving] = useState(false);
  const [dots, setDots] = useState("");

  // Animated dots — "Loading..." → "Loading...." → "Loading....."
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-hide after timeout
  useEffect(() => {
    if (!timeout) return;
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => setIsVisible(false), 400);
    }, timeout);
    return () => clearTimeout(timer);
  }, [timeout]);

  // Handle show prop changes
  useEffect(() => {
    if (!show) {
      setIsLeaving(true);
      setTimeout(() => setIsVisible(false), 400);
    } else {
      setIsVisible(true);
      setIsLeaving(false);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div
      className={`
      ${fullScreen ? "fixed inset-0 z-50" : "relative w-full min-h-64"}
      flex flex-col items-center justify-center
      bg-white transition-all duration-400
      ${isLeaving ? "opacity-0 scale-105" : "opacity-100 scale-100"}
    `}
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -right-20 w-96 h-96 
          bg-[#4B3621] opacity-5 rounded-full blur-3xl"
        />
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 
          bg-[#D4AF37] opacity-5 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo + Pulse Ring */}
        <div className="relative">
          {/* Outer pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-28 h-28 rounded-full border-2 
              border-[#D4AF37]/30 animate-ping"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-24 h-24 rounded-full border-2 
              border-[#4B3621]/20 animate-ping"
              style={{ animationDelay: "0.3s" }}
            />
          </div>

          {/* Logo */}
          <div
            className="relative w-20 h-20 rounded-full 
            bg-white shadow-xl border-4 border-[#D4AF37]/30
            flex items-center justify-center overflow-hidden"
          >
            <img
              src="https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png"
              alt="KOB Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-1">
          <h2
            className="text-2xl font-black text-[#4B3621] 
            tracking-tight uppercase"
          >
            Katsina Online Business
          </h2>
          <p
            className="text-[10px] font-bold tracking-[0.3em] 
            text-[#D4AF37] uppercase"
          >
            KOB Marketplace
          </p>
        </div>

        {/* Spinner */}
        <div className="relative w-12 h-12">
          {/* Outer spinning ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            viewBox="0 0 50 50"
            style={{ animationDuration: "1.2s" }}
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="4"
            />
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#4B3621"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="31.4 94.2"
            />
          </svg>

          {/* Inner gold dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-3 h-3 rounded-full bg-[#D4AF37] 
              animate-pulse"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-48 space-y-2">
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full
              bg-gradient-to-r from-[#4B3621] to-[#D4AF37]"
              style={{ animation: "kob-progress 2s ease-in-out infinite" }}
            />
          </div>

          {/* Message with animated dots */}
          <p
            className="text-center text-xs font-bold 
            text-gray-500 tracking-widest uppercase"
          >
            {message.replace(/\.+$/, "")}
            {dots}
          </p>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes kob-progress {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 70%;  margin-left: 15%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
