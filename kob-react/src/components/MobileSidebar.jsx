import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, logoutUser } from "../firebase/auth";
import {
  X,
  ShoppingBag,
  LogIn,
  UserPlus,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  Store,
  Facebook,
  Twitter,
  Instagram,
  HelpCircle,
  FileText,
  Shield,
  Users,
  MessageCircle,
} from "lucide-react";

const MERCHANT_AVATAR =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png";

const KOB_LOGO =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png";

export default function MobileSidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Highlight active link
  const isActive = (path) => location.pathname === path;

  const navLink = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-xl
    font-bold text-[11px] uppercase tracking-widest
    transition-all duration-200
    ${
      isActive(path)
        ? "bg-[#4B3621] text-white shadow-md"
        : "text-[#4B3621] hover:bg-[#4B3621]/5"
    }
  `;

  async function handleLogout() {
    try {
      await logoutUser();
      onClose();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm
            z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        aria-label="Navigation menu"
        className={`
          fixed top-0 right-0 h-full z-50
          w-[85%] max-w-[320px]
          bg-white border-l-4 border-[#4B3621]
          shadow-2xl flex flex-col
          transform transition-transform duration-300
          ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* ======================== */}
        {/* HEADER                  */}
        {/* ======================== */}
        <div
          className="flex-shrink-0 px-6 py-5
          border-b border-gray-100 bg-[#FAFAFA]"
        >
          {/* Logo + Close */}
          <div className="flex items-center justify-between mb-5">
            <Link to="/" onClick={onClose} className="flex items-center gap-2">
              <img src={KOB_LOGO} alt="KOB" className="h-8 w-auto" />
              <div>
                <p
                  className="font-black text-[#4B3621] text-base
                  tracking-tighter leading-none"
                >
                  KOB
                </p>
                <p
                  className="text-[8px] text-[#D4AF37] font-bold
                  tracking-[0.2em] uppercase leading-none"
                >
                  Marketplace
                </p>
              </div>
            </Link>

            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 rounded-xl bg-gray-100
                hover:bg-[#4B3621] hover:text-white
                text-[#4B3621] transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full
                  border-2 border-[#D4AF37] overflow-hidden
                  bg-gray-100 shadow-md"
                >
                  <img
                    src={user.photoURL || MERCHANT_AVATAR}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online dot */}
                <div
                  className="absolute bottom-0 right-0
                  w-3 h-3 bg-green-500 rounded-full
                  border-2 border-white"
                />
              </div>

              {/* Name + Role */}
              <div className="overflow-hidden">
                <p
                  className="text-[9px] text-gray-400 font-bold
                  uppercase tracking-[0.2em]"
                >
                  {user.role === "seller" ? "🏪 Seller" : "🛒 Buyer"}
                </p>
                <p
                  className="font-black text-[#4B3621] text-sm
                  truncate uppercase tracking-tight"
                >
                  {user.displayName || user.email?.split("@")[0]}
                </p>
                {user.kobNumber && (
                  <p className="text-[9px] text-[#D4AF37] font-bold">
                    {user.kobNumber}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Guest — CTA buttons */
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="flex-1 flex items-center justify-center
                  gap-2 py-2.5 rounded-xl border-2 border-[#4B3621]
                  text-[#4B3621] font-bold text-[10px]
                  uppercase tracking-widest
                  hover:bg-[#4B3621] hover:text-white
                  transition-all duration-200"
              >
                <LogIn className="w-3.5 h-3.5" /> Login
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex-1 flex items-center justify-center
                  gap-2 py-2.5 rounded-xl bg-[#4B3621] text-white
                  font-bold text-[10px] uppercase tracking-widest
                  hover:bg-[#362818] transition-all duration-200
                  shadow-md"
              >
                <UserPlus className="w-3.5 h-3.5" /> Join
              </Link>
            </div>
          )}
        </div>

        {/* ======================== */}
        {/* NAVIGATION               */}
        {/* ======================== */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Account Links */}
          {user && (
            <div className="space-y-1">
              <p
                className="text-[9px] font-black text-gray-300
                uppercase tracking-[0.3em] px-2 mb-2"
              >
                Account
              </p>
              <Link
                to="/dashboard"
                onClick={onClose}
                className={navLink("/dashboard")}
              >
                <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                Dashboard
              </Link>
              <Link
                to="/dashboard"
                onClick={onClose}
                className={navLink("/dashboard/messages")}
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                Messages
              </Link>
              {user.role === "seller" && (
                <Link
                  to="/dashboard"
                  onClick={onClose}
                  className={navLink("/dashboard/profile")}
                >
                  <Store className="w-4 h-4 flex-shrink-0" />
                  Shop Settings
                </Link>
              )}
            </div>
          )}

          {/* Marketplace Links */}
          <div className="space-y-1">
            <p
              className="text-[9px] font-black text-gray-300
              uppercase tracking-[0.3em] px-2 mb-2"
            >
              Marketplace
            </p>
            <Link
              to="/marketplace"
              onClick={onClose}
              className={navLink("/marketplace")}
            >
              <ShoppingBag className="w-4 h-4 flex-shrink-0" />
              Browse Catalog
            </Link>
            {user?.role === "seller" && (
              <Link
                to="/marketplace"
                onClick={onClose}
                className={navLink("/marketplace?add=true")}
              >
                <PlusCircle className="w-4 h-4 flex-shrink-0" />
                Add Product
              </Link>
            )}
          </div>

          {/* Company Links */}
          <div className="space-y-1">
            <p
              className="text-[9px] font-black text-gray-300
              uppercase tracking-[0.3em] px-2 mb-2"
            >
              Company
            </p>
            <Link to="/teams" onClick={onClose} className={navLink("/teams")}>
              <Users className="w-4 h-4 flex-shrink-0" />
              Our Team
            </Link>
            <Link to="/faq" onClick={onClose} className={navLink("/faq")}>
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              FAQ
            </Link>
            <Link to="/terms" onClick={onClose} className={navLink("/terms")}>
              <FileText className="w-4 h-4 flex-shrink-0" />
              Terms
            </Link>
            <Link
              to="/privacy"
              onClick={onClose}
              className={navLink("/privacy")}
            >
              <Shield className="w-4 h-4 flex-shrink-0" />
              Privacy Policy
            </Link>
          </div>
        </nav>

        {/* ======================== */}
        {/* FOOTER                  */}
        {/* ======================== */}
        <div
          className="flex-shrink-0 px-6 py-5
          border-t border-gray-100 bg-[#FAFAFA] space-y-4"
        >
          {/* Social Icons */}
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://web.facebook.com/profile.php?id=61582479357494"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="p-2 rounded-full text-gray-400
                hover:text-[#4B3621] hover:bg-gray-100
                transition-all duration-200"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="p-2 rounded-full text-gray-400
                hover:text-[#4B3621] hover:bg-gray-100
                transition-all duration-200"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="p-2 rounded-full text-gray-400
                hover:text-[#4B3621] hover:bg-gray-100
                transition-all duration-200"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          {/* Logout Button */}
          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center
                gap-2 py-3 rounded-xl bg-red-50 text-red-600
                font-bold text-[10px] uppercase tracking-widest
                hover:bg-red-600 hover:text-white
                border border-red-100
                transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout Session
            </button>
          )}

          {/* Version */}
          <p
            className="text-center text-[9px] text-gray-300
            font-bold tracking-widest uppercase"
          >
            KOB © {new Date().getFullYear()} · v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
