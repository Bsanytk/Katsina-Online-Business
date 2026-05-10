/**
 * MobileSidebar.jsx — KOB Mobile Navigation Drawer
 *
 * REFACTORED:
 * - Consumes ProfileContext (ZERO extra Firestore reads)
 * - Role-based nav links
 * - KOB brand design
 * - Smooth animations
 * - Backward compatible
 */

import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, logoutUser } from "../firebase/auth";
import { useProfile } from "../contexts/ProfileContext";

// ================================
// KOB Logo
// ================================
const KOB_LOGO =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png";

// ================================
// SVG Nav Icons
// ================================
const Icons = {
  Home: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2
        2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0
        011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  Marketplace: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2
        0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0
        01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0
        012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0
        012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0
        01-2-2v-2z"
      />
    </svg>
  ),
  Dashboard: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002
        2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6
        0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0
        012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  Shop: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3
        6h18M16 10a4 4 0 01-8 0"
      />
    </svg>
  ),
  Profile: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0
        00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Alerts: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118
        14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0
        10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0
        .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0
        11-6 0v-1m6 0H9"
      />
    </svg>
  ),
  Help: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343
        4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994
        1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Admin: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112
        2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003
        9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03
        9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  Add: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Logout: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3
        3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ),
  Team: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10
        0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0
        015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0
        0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0
        016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0
        11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  FAQ: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0
        002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0
        002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  Close: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
};

// ================================
// Single Nav Link
// ================================
function NavLink({ to, icon, label, active, onClick }) {
  const base = `
    flex items-center gap-3 px-4 py-3 rounded-2xl
    text-sm font-semibold transition-all duration-150
    active:scale-[0.98]
  `;
  const activeClass = `
    bg-[#4B3621] text-white shadow-sm
    shadow-[#4B3621]/20
  `;
  const inactiveClass = `
    text-gray-500 hover:bg-[#4B3621]/5
    hover:text-[#4B3621]
  `;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${base} ${
          active ? activeClass : inactiveClass
        } w-full text-left`}
      >
        <span className="flex-shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </button>
    );
  }

  return (
    <Link to={to} className={`${base} ${active ? activeClass : inactiveClass}`}>
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  );
}

// ================================
// Nav Section Header
// ================================
function SectionHeader({ label }) {
  return (
    <p
      className="text-[9px] font-bold uppercase tracking-[0.2em]
      text-gray-400 px-4 pt-4 pb-1"
    >
      {label}
    </p>
  );
}

// ================================
// Main MobileSidebar
// ================================
export default function MobileSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ ProfileContext — no duplicate Firestore read
  const { profile, isSeller, isAdmin } = useProfile();

  const path = location.pathname;

  // Close on route change
  useEffect(() => {
    onClose?.();
  }, [path]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function handleLogout() {
    onClose?.();
    try {
      await logoutUser();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  const isActive = (route) =>
    route === "/" ? path === "/" : path.startsWith(route);

  // ================================
  // Avatar initials
  // ================================
  const initials = (profile?.displayName || user?.email || "?")
    .charAt(0)
    .toUpperCase();

  // ================================
  // Role config
  // ================================
  const roleConfig = {
    admin: { label: "👑 Admin", cls: "bg-[#4B3621] text-white" },
    seller: { label: "🏪 Seller", cls: "bg-[#D4AF37]/20 text-[#4B3621]" },
    buyer: { label: "🛒 Buyer", cls: "bg-blue-50 text-blue-700" },
  }[profile?.role || "buyer"] || {
    label: "Member",
    cls: "bg-gray-100 text-gray-600",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50
              backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed top-0 right-0 bottom-0 z-50
              w-[min(320px,90vw)] bg-white shadow-2xl
              flex flex-col overflow-hidden"
          >
            {/* ============================== */}
            {/* HEADER                         */}
            {/* ============================== */}
            <div
              className="bg-[#4B3621] px-5 py-5
              flex-shrink-0"
            >
              {/* Close + Logo row */}
              <div
                className="flex items-center
                justify-between mb-5"
              >
                <div className="flex items-center gap-2.5">
                  <img src={KOB_LOGO} alt="KOB" className="h-8 w-auto" />
                  <div>
                    <p
                      className="text-white font-bold text-sm
                      leading-tight"
                    >
                      KOB
                    </p>
                    <p
                      className="text-[#D4AF37] text-[9px]
                      font-bold uppercase tracking-widest"
                    >
                      Marketplace
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center
                    justify-center rounded-xl bg-white/15
                    text-white hover:bg-white/25
                    transition-colors"
                >
                  <Icons.Close />
                </button>
              </div>

              {/* User Card */}
              {user ? (
                <div
                  className="flex items-center gap-3
                  p-3 bg-white/10 rounded-2xl"
                >
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-xl
                    bg-[#D4AF37]/30 border-2
                    border-[#D4AF37]/40 flex items-center
                    justify-center flex-shrink-0 overflow-hidden"
                  >
                    {profile?.photoURL ? (
                      <img
                        src={profile.photoURL}
                        alt={profile.displayName || "Avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="text-white text-lg
                        font-bold"
                      >
                        {initials}
                      </span>
                    )}
                  </div>

                  {/* Name + Role */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-white text-sm font-bold
                      truncate"
                    >
                      {profile?.displayName ||
                        user.email?.split("@")[0] ||
                        "KOB User"}
                    </p>
                    {profile?.businessName && (
                      <p
                        className="text-[#D4AF37] text-[10px]
                        font-semibold truncate"
                      >
                        {profile.businessName}
                      </p>
                    )}
                    <div
                      className="flex items-center gap-1.5
                      mt-1"
                    >
                      <span
                        className={`px-2 py-0.5 rounded-lg
                        text-[9px] font-bold uppercase
                        tracking-wider ${roleConfig.cls}`}
                      >
                        {roleConfig.label}
                      </span>
                      {profile?.kobNumber && (
                        <span
                          className="text-[9px]
                          text-white/40 font-mono"
                        >
                          {profile.kobNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Guest card */
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="flex-1 py-2.5 text-center
                      bg-white/15 text-white rounded-xl
                      text-xs font-bold hover:bg-white/25
                      transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="flex-1 py-2.5 text-center
                      bg-[#D4AF37] text-[#2C1F0E] rounded-xl
                      text-xs font-bold hover:bg-[#c49e30]
                      transition-colors"
                  >
                    Join KOB
                  </Link>
                </div>
              )}
            </div>

            {/* ============================== */}
            {/* NAV LINKS                      */}
            {/* ============================== */}
            <nav
              className="flex-1 overflow-y-auto
              px-3 py-3 space-y-0.5"
            >
              <SectionHeader label="Navigation" />

              <NavLink
                to="/"
                label="Home"
                icon={<Icons.Home />}
                active={isActive("/")}
              />

              <NavLink
                to="/marketplace"
                label="Catalogue"
                icon={<Icons.Marketplace />}
                active={isActive("/marketplace")}
              />

              <NavLink
                to="/alerts"
                label="Alerts"
                icon={<Icons.Alerts />}
                active={isActive("/alerts")}
              />

              {/* Logged-in links */}
              {user && (
                <>
                  <SectionHeader label="My Account" />

                  <NavLink
                    to="/dashboard"
                    label="Dashboard"
                    icon={<Icons.Dashboard />}
                    active={isActive("/dashboard")}
                  />

                  <NavLink
                    to="/profile"
                    label="My Profile"
                    icon={<Icons.Profile />}
                    active={isActive("/profile")}
                  />

                  {/* Seller-only */}
                  {(isSeller || isAdmin) && (
                    <>
                      <NavLink
                        to={`/shop/${user.uid}`}
                        label="My Shop"
                        icon={<Icons.Shop />}
                        active={isActive(`/shop/${user.uid}`)}
                      />
                      <NavLink
                        to="/marketplace"
                        label="Add Product"
                        icon={<Icons.Add />}
                        active={false}
                      />
                    </>
                  )}

                  {/* Admin-only */}
                  {isAdmin && (
                    <>
                      <SectionHeader label="Admin" />
                      <NavLink
                        to="/admin"
                        label="Admin Panel"
                        icon={<Icons.Admin />}
                        active={isActive("/admin")}
                      />
                    </>
                  )}
                </>
              )}

              {/* Company links */}
              <SectionHeader label="Company" />

              <NavLink
                to="/teams"
                label="Our Team"
                icon={<Icons.Team />}
                active={isActive("/teams")}
              />

              <NavLink
                to="/faq"
                label="FAQ"
                icon={<Icons.FAQ />}
                active={isActive("/faq")}
              />

              <NavLink
                to="/help"
                label="Help"
                icon={<Icons.Help />}
                active={isActive("/help")}
              />
            </nav>

            {/* ============================== */}
            {/* FOOTER                         */}
            {/* ============================== */}
            <div
              className="flex-shrink-0 px-3 py-4
              border-t border-gray-100 space-y-2"
            >
              {user ? (
                <NavLink
                  label="Sign Out"
                  icon={<Icons.Logout />}
                  active={false}
                  onClick={handleLogout}
                />
              ) : (
                <NavLink
                  to="/login"
                  label="Sign In"
                  icon={<Icons.Profile />}
                  active={false}
                />
              )}

              <p
                className="text-center text-[9px]
                text-gray-300 font-medium pb-1"
              >
                KOB Marketplace © {new Date().getFullYear()}
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
