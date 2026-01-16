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
    <header className="bg-gradient-to-r from-kob-primary to-kob-primary-dark text-white sticky top-0 z-50 shadow-lg border-b-2 border-kob-gold">
      <div className="container flex items-center justify-between py-4">
        {/* Logo & Brand */}
        <Link to="/" className="text-3xl font-extrabold hover:text-kob-gold transition-colors duration-300 flex items-center gap-2">
          <span className="text-2xl">🏪</span>
          <span>KOB</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8 items-center text-base font-semibold">
          <Link to="/" className="hover:text-kob-gold transition-colors duration-300 relative group">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-kob-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/marketplace" className="hover:text-kob-gold transition-colors duration-300 relative group">
            Marketplace
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-kob-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/faq" className="hover:text-kob-gold transition-colors duration-300 relative group">
            FAQ
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-kob-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/help" className="hover:text-kob-gold transition-colors duration-300 relative group">
            Help
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-kob-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/teams" className="hover:text-kob-gold transition-colors duration-300 relative group">
            Team
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-kob-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/contact" className="hover:text-kob-gold transition-colors duration-300 relative group">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-kob-gold group-hover:w-full transition-all duration-300"></span>
          </Link>
          {(user && (user.role === 'admin' || user.role === 'verified')) && (
            <Link to="/dashboard" className="hover:text-kob-gold transition-colors duration-300 relative group font-extrabold">
              Dashboard
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-kob-gold group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-sm opacity-90 font-medium">{user.email.split('@')[0]}</span>
              <span className="text-xs font-bold bg-white bg-opacity-20 px-3 py-1.5 rounded-full border border-white border-opacity-30">
                {user.role === 'admin' ? '👑 Admin' : user.role === 'verified' ? '✓ Seller' : '👤 Member'}
              </span>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-white text-kob-primary rounded-lg hover:bg-gray-100 transition-all font-bold text-sm shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex gap-3">
              <Link to="/login" className="px-4 py-2 bg-white text-kob-primary rounded-lg hover:bg-gray-100 transition-all font-bold text-sm shadow-md hover:shadow-lg transform hover:scale-105">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-kob-primary transition-all font-bold text-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-kob-dark bg-opacity-50 backdrop-blur-sm border-t border-white border-opacity-10 animate-fade-in">
          <div className="container py-5 space-y-3">
            <Link to="/" className="block hover:text-kob-gold transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>🏠 Home</Link>
            <Link to="/marketplace" className="block hover:text-kob-gold transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>🛍️ Marketplace</Link>
            <Link to="/faq" className="block hover:text-kob-gold transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>❓ FAQ</Link>
            <Link to="/help" className="block hover:text-kob-gold transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>ℹ️ Help Center</Link>
            <Link to="/teams" className="block hover:text-kob-gold transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>👥 Team</Link>
            <Link to="/contact" className="block hover:text-kob-gold transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>📞 Contact</Link>
            {(user && (user.role === 'admin' || user.role === 'verified')) && (
              <Link to="/dashboard" className="block hover:text-kob-gold transition-colors font-extrabold py-2 text-kob-gold" onClick={() => setIsMenuOpen(false)}>📊 Dashboard</Link>
            )}
            <div className="pt-4 border-t border-white border-opacity-10 space-y-2">
              {user ? (
                <>
                  <div className="text-sm opacity-90 py-2 font-semibold">{user.email}</div>
                  <button 
                    onClick={handleLogout} 
                    className="w-full px-4 py-2 bg-white text-kob-primary rounded-lg hover:bg-gray-100 transition-all font-bold text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 bg-white text-kob-primary rounded-lg hover:bg-gray-100 transition-all font-bold text-sm text-center" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="block px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-kob-primary transition-all font-bold text-sm text-center" onClick={() => setIsMenuOpen(false)}>
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
