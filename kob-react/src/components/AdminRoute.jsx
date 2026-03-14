import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../firebase/auth'

// Your actual Firebase UID from the console
const ADMIN_UID = "faAlHUtsZ2MVQRN4Apc3itIoeGf2" 

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-10 text-center font-bold text-kob-primary">Checking Admin Access...</div>
  }

  // If not logged in OR the UID does not match yours, kick them out
  if (!user || user.uid !== ADMIN_UID) {
    return <Navigate to="/" replace />
  }

  return children
}
