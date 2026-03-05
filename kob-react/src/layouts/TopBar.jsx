import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../firebase/auth'
import { logoutUser } from '../firebase/auth'
import MobileSidebar from '../components/MobileSidebar'
import { Menu, X } from 'lucide-react'

export default function TopBar() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  async function handleLogout() {
    try {
      await logoutUser()
    } catch (err) {
      console.error('Logout error', { message: err?.message })
    }
  }

  return (
    <header className="bg-gray-50 text-gray-800 sticky top-0 z-40 border-b border-gray-200">
      <div className="container flex items-center justify-between py-3">
        {/* KOB Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <img src="https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png" alt="KOB" className="h-9 w-auto object-contain" />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight">KOB</span>
              <span className="text-xs text-gray-600">Katsina Online Business</span>
            </div>
          </div>
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
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-md border border-transparent hover:border-gray-200 transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  )
}
