import React from 'react'

export default function Loading({ message = 'Loading...', fullScreen = false }) {
  const baseClasses = 'flex flex-col items-center justify-center gap-3'
  const containerClasses = fullScreen
    ? `${baseClasses} min-h-screen bg-white`
    : `${baseClasses} p-4`

  return (
    <div className={containerClasses}>
      {/* Minimal loader: neutral ring with a tiny brand dot */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
          <span
            className="block w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--kob-primary)' }}
            aria-hidden="true"
          />
        </div>
        <span className="text-sm font-medium text-gray-600">{message}</span>
      </div>
    </div>
  )
}
