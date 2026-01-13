import React from 'react'

export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="p-5 text-center">
      <div
        className="w-8 h-8 rounded-full mx-auto animate-spin"
        style={{ border: '4px solid #e5e7eb', borderTopColor: 'var(--kob-primary)' }}
        role="status"
      />
      <div className="mt-2 text-sm text-gray-600">{message}</div>
    </div>
  )
}
