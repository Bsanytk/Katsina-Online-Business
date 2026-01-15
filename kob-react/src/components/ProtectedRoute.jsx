import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../firebase/auth'
import Loading from './Loading'

// ProtectedRoute: restrict to allowedRoles (array). Default: ['seller', 'admin']
export default function ProtectedRoute({ children, allowedRoles = ['seller', 'admin'] }) {
  const { user, loading, error } = useAuth()

  // Show loading spinner while checking auth state
  if (loading) {
    return <Loading fullScreen message="Loading..." />
  }

  // If auth error, show error and redirect
  if (error) {
    return (
      <div className="min-h-screen bg-kob-light flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-kob-dark mb-2">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a href="/login" className="inline-block px-6 py-2 bg-kob-primary text-white rounded-lg hover:opacity-90">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Not authorized for this route - redirect to home
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-kob-light flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-kob-dark mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <a href="/" className="inline-block px-6 py-2 bg-kob-primary text-white rounded-lg hover:opacity-90">
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  // User is authorized - render children
  return children
}
