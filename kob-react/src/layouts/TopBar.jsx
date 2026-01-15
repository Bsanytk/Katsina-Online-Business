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
      console.error('Logout error', err)
    }
  }

  return (
    <header className="bg-kob-primary text-white sticky top-0 z-50 shadow-md">
      <div className="container flex items-center justify-between py-4">
        {/* Logo & Brand */}
        <Link to="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
          KOB
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-6 items-center text-sm">
          <Link to="/" className="hover:opacity-90 transition-opacity">Home</Link>
          <Link to="/marketplace" className="hover:opacity-90 transition-opacity">Marketplace</Link>
          <Link to="/faq" className="hover:opacity-90 transition-opacity">FAQ</Link>
          <Link to="/help" className="hover:opacity-90 transition-opacity">Help</Link>
          <Link to="/teams" className="hover:opacity-90 transition-opacity">Team</Link>
          <Link to="/contact" className="hover:opacity-90 transition-opacity">Contact</Link>
          {(user && (user.role === 'admin' || user.role === 'verified')) && (
            <Link to="/dashboard" className="hover:opacity-90 transition-opacity font-semibold">Dashboard</Link>
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden lg:flex items-center gap-3 lg:flex-row">
              <span className="text-sm opacity-90">{user.email}</span>
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                {user.role === 'admin' ? '👑 Admin' : user.role === 'verified' ? '✓ Seller' : 'Member'}
              </span>
              <button 
                onClick={handleLogout} 
                className="px-3 py-2 bg-white text-kob-primary rounded-md hover:bg-opacity-90 transition-all font-medium text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex gap-2">
              <Link to="/login" className="px-3 py-2 bg-white text-kob-primary rounded-md hover:bg-opacity-90 transition-all font-medium text-sm">
                Login
              </Link>
              <Link to="/register" className="px-3 py-2 border border-white rounded-md hover:bg-white hover:text-kob-primary transition-all font-medium text-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-kob-dark bg-opacity-10 border-t border-white border-opacity-10">
          <div className="container py-4 space-y-3">
            <Link to="/" className="block hover:opacity-90" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/marketplace" className="block hover:opacity-90" onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
            <Link to="/faq" className="block hover:opacity-90" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
            <Link to="/help" className="block hover:opacity-90" onClick={() => setIsMenuOpen(false)}>Help Center</Link>
            <Link to="/teams" className="block hover:opacity-90" onClick={() => setIsMenuOpen(false)}>Team</Link>
            <Link to="/contact" className="block hover:opacity-90" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            {(user && (user.role === 'admin' || user.role === 'verified')) && (
              <Link to="/dashboard" className="block hover:opacity-90 font-semibold" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            )}
            <div className="pt-2 border-t border-white border-opacity-10 space-y-2">
              {user ? (
                <>
                  <div className="text-sm opacity-90 py-2">{user.email}</div>
                  <button 
                    onClick={handleLogout} 
                    className="w-full px-3 py-2 bg-white text-kob-primary rounded-md hover:bg-opacity-90 transition-all font-medium text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 bg-white text-kob-primary rounded-md hover:bg-opacity-90 transition-all font-medium text-sm text-center" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="block px-3 py-2 border border-white rounded-md hover:bg-white hover:text-kob-primary transition-all font-medium text-sm text-center" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
