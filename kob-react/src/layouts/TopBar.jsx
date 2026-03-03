import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../firebase/auth'
import { logoutUser } from '../firebase/auth'

export default function TopBar() {
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  async function handleLogout() {
    try {
      await logoutUser()
      setIsMenuOpen(false)
    } catch (err) {
      console.error('Logout error', { message: err?.message })
    }
  }

  return (
    <header className="bg-gray-50 text-gray-800 sticky top-0 z-40 border-b border-gray-200">
      <div className="container flex items-center justify-between py-3">
        {/* KOB Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png" alt="KOB" className="h-9 w-auto object-contain" />
          <span className="hidden sm:inline text-lg font-semibold tracking-tight">KOB</span>
        </Link>

        {/* Temporary hidden element for translate feature (prevents console warning when missing) */}
        <div id="translate-page" style={{ display: 'none' }} />

        {/* Minimal Navigation */}
        <nav className="hidden lg:flex gap-6 items-center text-sm font-medium">
          <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
          <Link to="/marketplace" className="text-gray-700 hover:text-gray-900">Marketplace</Link>
          <Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden lg:flex items-center gap-3 text-sm">
              <span className="text-gray-700">{user.email.split('@')[0]}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-white border border-gray-200 text-gray-800 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex gap-2">
              <Link to="/login" className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-800">Login</Link>
              <Link to="/register" className="px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-800">Register</Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md border border-transparent hover:border-gray-200"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="container py-4 space-y-3">
            <Link to="/" className="block text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/marketplace" className="block text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
            <Link to="/contact" className="block text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <div className="pt-3 border-t border-gray-100">
              {user ? (
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-gray-800">Logout</button>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-sm text-gray-800" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="block px-3 py-2 text-sm text-gray-800" onClick={() => setIsMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
