import React from 'react'

export default function Loading({ message = 'Loading...', fullScreen = false }) {
  const baseClasses = 'flex flex-col items-center justify-center gap-3'
  const containerClasses = fullScreen 
    ? `${baseClasses} min-h-screen bg-kob-light` 
    : `${baseClasses} p-8`

  return (
    <div className={containerClasses}>
      {/* Spinner */}
      <div
        className="w-10 h-10 rounded-full animate-spin"
        style={{ 
          border: '3px solid rgba(197, 160, 89, 0.2)',
          borderTopColor: 'var(--kob-primary)'
        }}
        role="status"
        aria-label="Loading"
      />
      {/* Message */}
      <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
  )
}
