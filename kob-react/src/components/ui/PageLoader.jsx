import React from 'react'

/**
 * PageLoader Component
 * Full-screen branded loader for app initialization and page transitions
 * 
 * Props:
 * - message (string): Optional loading message
 * - show (bool): Whether to render the loader
 */
export default function PageLoader({ message = 'Loading...', show = true }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      {/* Gradient background accent */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-kob-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-kob-gold rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo/Brand */}
        <div className="animate-pulse">
          <img
            src="https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png"
            alt="KOB Logo"
            className="w-20 h-20 object-contain"
          />
        </div>

        {/* Spinner */}
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <svg
            className="absolute inset-0 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            style={{ animationDuration: '3s' }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="#C5A059"
              strokeWidth="2"
            />
            <circle
              className="opacity-75"
              cx="12"
              cy="12"
              r="10"
              stroke="#C5A059"
              strokeWidth="2"
              strokeDasharray="15.7 47.1"
            />
          </svg>

          {/* Center dot */}
          <div className="absolute inset-2 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-kob-primary" />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-kob-dark mb-2">
            Katsina Online Business
          </h2>
          <p className="text-gray-600 text-sm font-medium">{message}</p>
        </div>

        {/* Progress indicator */}
        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-kob-primary to-kob-gold rounded-full"
            style={{
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Subtle animation styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { width: 0%; }
          50% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
