import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, logoutUser } from '../firebase/auth'
import { X, Home, ShoppingBag, User, FileText, Shield, Twitter, Facebook, Instagram, LogIn, UserPlus, LogOut, PlusCircle, LayoutDashboard, Store } from 'lucide-react'

export default function MobileSidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  // KOB BRAND COLORS
  const KOB_BROWN = "#4B3621";
  const KOB_GOLD = "#D4AF37";
  
  // Constant Cloudinary Merchant Avatar
  const MERCHANT_AVATAR = "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png";

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
      {/* Overlay with high-end blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 backdrop-blur-md"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.2)] z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-l-[6px] border-[#4B3621] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Header Section - Modern Classic Aesthetic */}
          <div className="p-8 border-b border-gray-100 bg-[#FDFDFD]">
            <div className="flex items-center justify-between mb-8">
               <button 
                 onClick={onClose} 
                 className="p-2.5 bg-gray-50 hover:bg-[#4B3621] text-[#4B3621] hover:text-white rounded-2xl transition-all shadow-sm"
               >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl text-[#4B3621] tracking-tighter italic">KOB</span>
                <img
                  src="https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png"
                  alt="KOB Logo"
                  className="h-7 w-auto"
                />
              </div>
            </div>

            {/* Profile Section */}
            {user ? (
              <div className="flex items-center gap-4 animate-fade-in group">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] p-1 overflow-hidden shadow-lg bg-white">
                    <img 
                      src={user.role === 'seller' ? MERCHANT_AVATAR : (user.photoURL || MERCHANT_AVATAR)} 
                      alt="Merchant Profile" 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Welcome,</p>
                  <h4 className="font-black text-[#4B3621] text-sm leading-tight uppercase truncate">
                    {user.displayName || user.email.split('@')[0]}
                  </h4>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em]">Global Marketplace</p>
                <h4 className="font-black text-[#4B3621] text-lg tracking-tighter uppercase italic">Katsina Online</h4>
              </div>
            )}
          </div>

          {/* Navigation - Strategic Sections */}
          <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
            
            {/* Main Access */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] px-2">Account Access</h3>
              <div className="space-y-2">
                {!user ? (
                  <>
                    <Link to="/login" onClick={onClose} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-gray-50 text-[#4B3621] font-black text-xs uppercase tracking-widest transition-all">
                      <LogIn className="w-5 h-5 text-gray-400" /> Login
                    </Link>
                    <Link to="/register" onClick={onClose} className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-[#4B3621] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#4B3621]/20">
                      <UserPlus className="w-5 h-5" /> Join KOB
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={onClose} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-gray-50 text-[#4B3621] font-black text-xs uppercase tracking-widest transition-all">
                      <LayoutDashboard className="w-5 h-5 text-gray-400" /> Dashboard
                    </Link>
                    <Link to="/dashboard/profile" onClick={onClose} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-gray-50 text-[#4B3621] font-black text-xs uppercase tracking-widest transition-all">
                      <Store className="w-5 h-5 text-gray-400" /> My Shop Settings
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Marketplace */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] px-2">Marketplace</h3>
              <div className="space-y-2">
                <Link to="/marketplace" onClick={onClose} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-gray-50 text-[#4B3621] font-black text-xs uppercase tracking-widest transition-all">
                  <ShoppingBag className="w-5 h-5 text-gray-400" /> Browse Catalog
                </Link>
                {user?.role === 'seller' && (
                  <Link to="/marketplace?add=true" onClick={onClose} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-gray-50 text-[#4B3621] font-black text-xs uppercase tracking-widest transition-all">
                    <PlusCircle className="w-5 h-5 text-gray-400" /> Post New Product
                  </Link>
                )}
              </div>
            </div>

            {/* Legal Links */}
            <div className="pt-6 border-t border-gray-50 space-y-2">
              <Link to="/terms" onClick={onClose} className="flex items-center gap-4 px-4 py-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#4B3621] transition-all">
                <FileText className="w-4 h-4" /> Terms of Service
              </Link>
              <Link to="/privacy" onClick={onClose} className="flex items-center gap-4 px-4 py-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#4B3621] transition-all">
                <Shield className="w-4 h-4" /> Privacy Policy
              </Link>
            </div>
          </div>

          {/* Footer Section */}
          <div className="p-8 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-8 px-4">
              <a href="https://facebook.com/B-SANI-BIO-CARE-MED" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-[#4B3621] transition-all"><Facebook className="w-5 h-5"/></a>
              <a href="#" className="text-gray-300 hover:text-[#4B3621] transition-all"><Twitter className="w-5 h-5"/></a>
              <a href="#" className="text-gray-300 hover:text-[#4B3621] transition-all"><Instagram className="w-5 h-5"/></a>
            </div>
            
            {user && (
              <button
                onClick={handleLogout}
                className="group flex items-center justify-center gap-3 w-full py-5 bg-[#F9F9F9] text-[#4B3621] rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-[#4B3621] hover:text-white transition-all duration-300 shadow-sm border border-gray-100"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Logout Session
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
