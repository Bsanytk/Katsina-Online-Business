import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, logoutUser } from '../firebase/auth'
import { X, Home, ShoppingBag, User, FileText, Shield, Twitter, Facebook, Instagram, LogIn, UserPlus, LogOut, PlusCircle } from 'lucide-react'

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
          className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer - Sliding from Right to Left */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l-4 border-[#4B3621] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Header Section */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between mb-6">
               <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                <X className="w-6 h-6 text-[#4B3621]" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl text-[#4B3621] tracking-tighter">KOB</span>
                <img
                  src="https://collection.cloudinary.com/dn5crslee/6aca0ae6e8cafa5b6a8ea03258efdc5c"
                  alt="KOB Logo"
                  className="h-8 w-auto"
                />
              </div>
            </div>

            {/* Profile Integration */}
            {user ? (
              <div className="flex items-center gap-4 animate-fade-in">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-[#4B3621] p-0.5 overflow-hidden bg-gray-100">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="w-full h-full object-cover rounded-full" 
                        onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + (user.displayName || 'K') + '&background=4B3621&color=fff'; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#4B3621] text-white flex items-center justify-center font-bold text-xs uppercase">
                        {user.displayName?.charAt(0) || 'K'}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-black text-[#4B3621] leading-tight truncate w-40">
                    {user.displayName || 'KOB Merchant'}
                  </h4>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Welcome Back</p>
                </div>
              </div>
            ) : (
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">KOB Marketplace</p>
            )}
          </div>

          {/* Navigation Links - Simplified */}
          <div className="flex-1 overflow-y-auto p-5 space-y-8">
            
            {/* Account/Dashboard Section */}
            <div>
              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 px-4">Account Access</h3>
              <div className="space-y-1">
                {!user ? (
                  <>
                    <Link to="/login" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 text-[#4B3621] font-bold transition-all">
                      <LogIn className="w-5 h-5 text-gray-400" /> Login
                    </Link>
                    <Link to="/register" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[#4B3621] text-white font-bold shadow-md">
                      <UserPlus className="w-5 h-5" /> Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 text-[#4B3621] font-bold transition-all">
                      <Home className="w-5 h-5 text-gray-400" /> Dashboard
                    </Link>
                    <Link to="/dashboard/profile" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 text-[#4B3621] font-bold transition-all">
                      <User className="w-5 h-5 text-gray-400" /> My Shop
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Marketplace Section */}
            <div>
              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 px-4">Marketplace</h3>
              <div className="space-y-1">
                <Link to="/marketplace" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 text-[#4B3621] font-bold transition-all">
                  <ShoppingBag className="w-5 h-5 text-gray-400" /> Browse Products
                </Link>
                {user && (
                  <Link to="/dashboard/add-product" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 text-[#4B3621] font-bold transition-all">
                    <PlusCircle className="w-5 h-5 text-gray-400" /> New Arrivals
                  </Link>
                )}
              </div>
            </div>

            {/* Legal Section */}
            <div className="pt-4 border-t border-gray-50">
               <div className="space-y-1">
                <Link to="/terms" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-500 font-medium text-xs transition-all">
                  <FileText className="w-4 h-4" /> Terms of Service
                </Link>
                <Link to="/privacy" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-500 font-medium text-xs transition-all">
                  <Shield className="w-4 h-4" /> Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/30">
            <div className="flex justify-around mb-6 text-gray-400">
              <a href="https://facebook.com/B-SANI-BIO-CARE-MED" target="_blank" rel="noreferrer" className="p-2 hover:text-[#4B3621] hover:scale-110 transition-all"><Facebook className="w-5 h-5"/></a>
              <a href="#" className="p-2 hover:text-[#4B3621] hover:scale-110 transition-all"><Twitter className="w-5 h-5"/></a>
              <a href="#" className="p-2 hover:text-[#4B3621] hover:scale-110 transition-all"><Instagram className="w-5 h-5"/></a>
            </div>
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#4B3621] text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

