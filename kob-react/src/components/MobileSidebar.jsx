import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, logoutUser } from '../firebase/auth'
import { X, Menu, Home, ShoppingBag, User, FileText, Shield, Cookie, Twitter, Facebook, Instagram, LogIn, UserPlus } from 'lucide-react'

export default function MobileSidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const brandColor = "#4B3621"; // KOB Dark Brown

  const handleLogout = async () => {
    try {
      await logoutUser()
      onClose()
      navigate('/')
    } catch (err) {
      console.error('Logout error', err)
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer - Sliding from LEFT to RIGHT */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header with KOB Logo */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src="https://collection.cloudinary.com/dn5crslee/6aca0ae6e8cafa5b6a8ea03258efdc5c"
                alt="KOB Logo"
                className="h-10 w-auto"
              />
              <span className="font-bold text-xl text-[#4B3621]">KOB</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-[#4B3621]" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5">
            
            {/* 1. AUTH SECTION: Login/Register if Signed Out, Profile if Signed In */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                {user ? `Welcome, ${user.displayName || 'User'}` : 'Account Access'}
              </h3>
              <div className="space-y-2">
                {!user ? (
                  <>
                    <Link to="/login" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 text-[#4B3621] font-semibold">
                      <LogIn className="w-5 h-5" /> Login
                    </Link>
                    <Link to="/register" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 text-[#4B3621] font-semibold">
                      <UserPlus className="w-5 h-5" /> Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 text-[#4B3621] font-semibold">
                      <User className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link to="/dashboard/add-product" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 text-[#4B3621] font-semibold">
                      <ShoppingBag className="w-5 h-5" /> My Shop
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* 2. MARKET SECTION */}
            <div className="mb-8 border-t pt-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Marketplace</h3>
              <div className="space-y-2">
                <Link to="/marketplace" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 text-[#4B3621] font-semibold">
                  <Menu className="w-5 h-5" /> Browse Products
                </Link>
                <Link to="/marketplace?filter=new" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 text-[#4B3621] font-semibold">
                  <Home className="w-5 h-5" /> New Arrivals
                </Link>
              </div>
            </div>

            {/* 3. LEGAL SECTION */}
            <div className="mb-8 border-t pt-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Support & Legal</h3>
              <div className="space-y-2">
                <Link to="/terms" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 text-[#4B3621] font-medium">
                  <FileText className="w-5 h-5" /> Terms of Service
                </Link>
                <Link to="/privacy" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 text-[#4B3621] font-medium">
                  <Shield className="w-5 h-5" /> Privacy Policy
                </Link>
                <Link to="/cookies" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 text-[#4B3621] font-medium">
                  <Cookie className="w-5 h-5" /> Cookie Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-around mb-6">
              <a href="#" className="p-2 text-[#4B3621] hover:scale-110 transition-transform"><Twitter /></a>
              <a href="#" className="p-2 text-[#4B3621] hover:scale-110 transition-transform"><Facebook /></a>
              <a href="#" className="p-2 text-[#4B3621] hover:scale-110 transition-transform"><Instagram /></a>
            </div>
            {user && (
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-[#4B3621] text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md"
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
