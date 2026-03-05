import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/auth'
import { logoutUser } from '../firebase/auth'
import { X, Menu, Home, ShoppingBag, User, FileText, Shield, Cookie, Twitter, Facebook, Instagram } from 'lucide-react'

export default function MobileSidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logoutUser()
      onClose()
      navigate('/')
    } catch (err) {
      console.error('Logout error', { message: err?.message })
    }
  }

  const handleLinkClick = () => {
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src="https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png"
                alt="KOB"
                className="h-8 w-auto object-contain"
              />
              <span className="font-bold text-lg">KOB</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* User Section */}
            {user && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Welcome {user.displayName || user.email?.split('@')[0] || 'User'}
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/add-product"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    My Shop
                  </Link>
                </div>
              </div>
            )}

            {/* Market Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Market
              </h3>
              <div className="space-y-2">
                <Link
                  to="/marketplace"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Browse Products
                </Link>
                <Link
                  to="/marketplace?filter=category"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                  Categories
                </Link>
                <Link
                  to="/marketplace?filter=new"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  New Arrivals
                </Link>
              </div>
            </div>

            {/* Legal Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Legal
              </h3>
              <div className="space-y-2">
                <Link
                  to="/terms"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  Terms of Service
                </Link>
                <Link
                  to="/privacy"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Shield className="w-5 h-5" />
                  Privacy Policy
                </Link>
                <Link
                  to="/cookies"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Cookie className="w-5 h-5" />
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {/* Social Icons */}
            <div className="flex justify-center gap-4 mb-4">
              <a
                href="https://twitter.com/kobmarketplace"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/kobmarketplace"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/kobmarketplace"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}