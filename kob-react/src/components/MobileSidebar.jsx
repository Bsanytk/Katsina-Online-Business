import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, logoutUser } from "../firebase/auth";
import {
  X,
  Home,
  ShoppingBag,
  User,
  FileText,
  Shield,
  Twitter,
  Facebook,
  Instagram,
  LogIn,
  UserPlus,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  Store,
} from "lucide-react";

export default function MobileSidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const MERCHANT_AVATAR =
    "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png";

  const handleLogout = async () => {
    try {
      await logoutUser();
      onClose();
      navigate("/");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <>
      {/* Overlay - Mobile Only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 backdrop-blur-md lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        style={{ fontFamily: "'Montserrat', sans-serif" }}
        className={`
          /* Mobile Styles */
          fixed top-0 right-0 h-full bg-white z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] 
          w-[85%] max-w-[320px] border-l-[6px] border-[#4B3621] shadow-[0_0_50px_rgba(0,0,0,0.1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}

          /* Desktop (PC) Styles */
          lg:static lg:translate-x-0 lg:z-30 lg:w-72 lg:h-screen lg:sticky lg:top-0 lg:border-l-0 lg:border-r lg:border-gray-100 lg:shadow-none
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header Section */}
          <div className="p-8 border-b border-gray-100 bg-[#FDFDFD]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl text-[#4B3621] tracking-tighter italic">
                  KOB
                </span>
                <img
                  src="https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png"
                  alt="KOB Logo"
                  className="h-7 w-auto"
                />
              </div>

              {/* Close Button - Hidden on Desktop */}
              <button
                onClick={onClose}
                className="p-2.5 bg-gray-50 hover:bg-[#4B3621] text-[#4B3621] hover:text-white rounded-2xl transition-all lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Section */}
            {user ? (
              <div className="flex items-center gap-4 animate-fade-in group">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37] p-1 overflow-hidden shadow-lg bg-white">
                    <img
                      src={
                        user.role === "seller"
                          ? MERCHANT_AVATAR
                          : user.photoURL || MERCHANT_AVATAR
                      }
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">
                    Welcome,
                  </p>
                  <h4 className="font-black text-[#4B3621] text-xs leading-tight uppercase truncate">
                    {user.displayName || user.email.split("@")[0]}
                  </h4>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em]">
                  KOB Marketplace
                </p>
                <h4 className="font-black text-[#4B3621] text-lg tracking-tighter uppercase italic">
                  Katsina Online Business
                </h4>
              </div>
            )}
          </div>

          {/* Navigation Section */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {/* Main Nav */}
            <div className="space-y-3">
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">
                Navigation
              </h3>
              <div className="space-y-1">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="nav-link-style"
                    >
                      <LogIn className="w-4 h-4 text-gray-400" /> Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={onClose}
                      className="nav-link-style bg-[#4B3621] text-white"
                    >
                      <UserPlus className="w-4 h-4" /> Join KOB
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={onClose}
                      className="nav-link-style"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-400" />{" "}
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      onClick={onClose}
                      className="nav-link-style"
                    >
                      <Store className="w-4 h-4 text-gray-400" /> Shop Settings
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Marketplace Section */}
            <div className="space-y-3">
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">
                Marketplace
              </h3>
              <div className="space-y-1">
                <Link
                  to="/marketplace"
                  onClick={onClose}
                  className="nav-link-style"
                >
                  <ShoppingBag className="w-4 h-4 text-gray-400" /> Catalog
                </Link>
                {user?.role === "seller" && (
                  <Link
                    to="/marketplace?add=true"
                    onClick={onClose}
                    className="nav-link-style"
                  >
                    <PlusCircle className="w-4 h-4 text-gray-400" /> Add Product
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="p-8 border-t border-gray-100 bg-white">
            <div className="flex justify-around items-center mb-6 px-2">
              <a
                href="https://web.facebook.com/profile.php?id=61582479357494"
                target="_blank"
                rel="noreferrer"
                className="social-icon"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="social-icon">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="social-icon">
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {user && (
              <button
                onClick={handleLogout}
                className="group flex items-center justify-center gap-3 w-full py-4 bg-[#F9F9F9] text-[#4B3621] rounded-xl font-bold uppercase text-[9px] tracking-[0.2em] hover:bg-red-50 hover:text-red-600 transition-all duration-300 border border-gray-100"
              >
                <LogOut className="w-4 h-4" /> Logout Session
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Karin bayani: Kayi amfani da wadannan tailwind classes a matsayin "nav-link-style" don rage yawan code
// "flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-gray-50 text-[#4B3621] font-bold text-[11px] uppercase tracking-widest transition-all"
