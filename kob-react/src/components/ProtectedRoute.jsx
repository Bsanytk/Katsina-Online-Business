import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../firebase/auth'
import Loading from './Loading'

export default function ProtectedRoute({ 
  children, 
  // ✅ FIX: buyer ƙara cikin default roles
  allowedRoles = ['buyer', 'seller', 'admin'] 
}) {
  const { user, loading, error } = useAuth()

  if (loading) {
    return <Loading fullScreen message="Loading..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex
        items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl
          shadow-sm border border-gray-100 text-center
          max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-lg font-semibold
            text-[#2C1F0E] mb-2">
            Authentication Error
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {error}
          </p>
          <a href="/login"
            className="inline-flex px-6 py-2.5
              bg-[#4B3621] text-white rounded-xl
              text-sm font-semibold hover:bg-[#362818]
              transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // ✅ Role check — buyer, seller, admin duka suna shiga
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex
        items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl
          shadow-sm border border-gray-100 text-center
          max-w-md">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-lg font-semibold
            text-[#2C1F0E] mb-2">
            Access Denied
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            You don't have permission to access this page.
          </p>
          <a href="/"
            className="inline-flex px-6 py-2.5
              bg-[#4B3621] text-white rounded-xl
              text-sm font-semibold hover:bg-[#362818]
              transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return children
}
