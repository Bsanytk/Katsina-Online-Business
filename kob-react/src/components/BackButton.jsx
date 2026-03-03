import React from 'react'
import { useNavigate } from 'react-router-dom'

// A simple back button that navigates to the previous page
export default function BackButton({ className = '' }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-2 text-kob-primary hover:underline ${className}`}
    >
      ← Back
    </button>
  )
}
