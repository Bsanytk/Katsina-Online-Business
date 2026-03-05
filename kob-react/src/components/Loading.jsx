import React from 'react'

export default function Loading({ message = 'Welcome to KOB Marketplace', fullScreen = false }) {
  const baseClasses = 'flex flex-col items-center justify-center gap-4'
  const containerClasses = fullScreen
    ? `${baseClasses} min-h-screen bg-white`
    : `${baseClasses} p-4`

  return (
    <div className={containerClasses}>
      {/* KOB Logo with animation */}
      <div className="animate-pulse">
        <img
          src="https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png"
          alt="KOB Logo"
          className="w-16 h-16 object-contain"
        />
      </div>

      {/* Loading spinner */}
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>

      {/* Welcome message */}
      <span className="text-lg font-medium text-gray-700 transition-opacity duration-500">
        {message}
      </span>
    </div>
  )
}
