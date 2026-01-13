import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../firebase/auth'

// ProtectedRoute: restrict to allowedRoles (array). Default: ['admin','verified']
export default function ProtectedRoute({ children, allowedRoles = ['admin', 'verified'] }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="p-6"><div className="w-8 h-8 rounded-full mx-auto animate-spin" style={{ border: '4px solid #e5e7eb', borderTopColor: 'var(--kob-primary)' }} /></div>

  if (!user) return <Navigate to="/login" replace />

  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />

  return children
}
