/**
 * MobileSidebar.jsx — KOB Premium Redesign
 *
 * UI CHANGES:
 * ✅ Off-white bg-[#FAF7F2] — lighter, premium feel
 * ✅ Reusable MenuItem component
 * ✅ Logout always visible — mt-auto sticky bottom
 * ✅ Clean SVG icon system — consistent stroke
 * ✅ Safe area support
 * ✅ Scrollable middle nav
 *
 * LOGIC: 100% preserved
 */

import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence }        from 'framer-motion'
import { useAuth, logoutUser }            from '../firebase/auth'
import { useProfile }                     from '../contexts/ProfileContext'

const KOB_LOGO =
"'https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1779908958/logo512_e9kaph.png'"
// ================================
// SVG Icons — Heroicons style
// consistent strokeWidth={1.8}
// ================================
const SvgIcon = ({ children, className = "w-[18px] h-[18px]" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
)

const Icons = {
  Home: () => (
    <SvgIcon>
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0
        001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6
        0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1
        1 0 001 1m-6 0h6" />
    </SvgIcon>
  ),
  Catalogue: () => (
    <SvgIcon>
      <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0
        01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2
        0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2
        2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0
        01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2
        0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </SvgIcon>
  ),
  Alerts: () => (
    <SvgIcon>
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118
        14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4
        0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214
        1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </SvgIcon>
  ),
  Dashboard: () => (
    <SvgIcon>
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2
        2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2
        0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2
        2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0
        01-2-2z" />
    </SvgIcon>
  ),
  Profile: () => (
    <SvgIcon>
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7
        0 00-7 7h14a7 7 0 00-7-7z" />
    </SvgIcon>
  ),
  Shop: () => (
    <SvgIcon>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0
        002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
    </SvgIcon>
  ),
  Add: () => (
    <SvgIcon>
      <path d="M12 4v16m8-8H4" />
    </SvgIcon>
  ),
  Admin: () => (
    <SvgIcon>
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0
        0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02
        12.02 0 003 9c0 5.591 3.824 10.29 9 11.622
        5.176-1.332 9-6.03 9-11.622
        0-1.042-.133-2.052-.382-3.016z" />
    </SvgIcon>
  ),
  Team: () => (
    <SvgIcon>
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10
        0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0
        015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0
        0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0
        016 0z" />
    </SvgIcon>
  ),
  FAQ: () => (
    <SvgIcon>
      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0
        4 1.343 4 3 0 1.4-1.278 2.575-3.006
        2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9
        9 0 11-18 0 9 9 0 0118 0z" />
    </SvgIcon>
  ),
  Help: () => (
    <SvgIcon>
      <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536
        3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536
        3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4
        0 11-8 0 4 4 0 018 0z" />
    </SvgIcon>
  ),
  Logout: () => (
    <SvgIcon>
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0
        01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0
        013 3v1" />
    </SvgIcon>
  ),
  Close: () => (
    <SvgIcon className="w-5 h-5">
      <path d="M6 18L18 6M6 6l12 12" />
    </SvgIcon>
  ),
  ChevronRight: () => (
    <SvgIcon className="w-4 h-4">
      <path d="M9 5l7 7-7 7" />
    </SvgIcon>
  ),
}

// ================================
// Section Label — reusable
// ================================
function SectionLabel({ label }) {
  return (
    <p className="text-[10px] font-black uppercase
      tracking-[0.18em] text-gray-400 px-3 pt-5 pb-1.5">
      {label}
    </p>
  )
}

// ================================
// MenuItem — reusable, clean
// ================================
function MenuItem({
  to, label, icon, active, onClick,
  badge, danger = false,
}) {
  const baseClass = `
    flex items-center gap-3 w-full
    px-3 py-3 rounded-2xl text-sm font-semibold
    transition-all duration-150
    active:scale-[0.97] touch-manipulation
    select-none
  `

  const activeClass = `
    bg-[#4B3621] text-white
    shadow-sm shadow-[#4B3621]/15
  `

  const inactiveClass = danger
    ? `text-red-500 hover:bg-red-50`
    : `text-[#3D2B1A] hover:bg-[#4B3621]/8 hover:text-[#4B3621]`

  const content = (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {/* Icon wrapper */}
      <div className={`
        w-8 h-8 rounded-xl flex items-center justify-center
        flex-shrink-0 transition-colors
        ${active
          ? 'bg-white/20'
          : danger
            ? 'bg-red-50'
            : 'bg-[#4B3621]/8'
        }
      `}>
        <span className={
          active ? 'text-white'
          : danger ? 'text-red-500'
          : 'text-[#4B3621]'
        }>
          {icon}
        </span>
      </div>

      {/* Label */}
      <span className="truncate flex-1">{label}</span>

      {/* Badge */}
      {badge && badge > 0 && (
        <span className="flex-shrink-0 min-w-[20px] h-5
          px-1.5 bg-red-500 text-white text-[10px]
          font-bold rounded-full flex items-center
          justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}

      {/* Chevron — inactive items only */}
      {!active && !danger && (
        <span className="flex-shrink-0 text-gray-300">
          <Icons.ChevronRight />
        </span>
      )}
    </div>
  )

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClass} ${active
          ? activeClass : inactiveClass}`}
      >
        {content}
      </button>
    )
  }

  return (
    <Link
      to={to}
      className={`${baseClass} ${active
        ? activeClass : inactiveClass}`}
    >
      {content}
    </Link>
  )
}

// ================================
// Main MobileSidebar
// ================================
export default function MobileSidebar({ isOpen, onClose }) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const { profile, isSeller, isAdmin } = useProfile()

  const path = location.pathname

  // Close on route change
  useEffect(() => { onClose?.() }, [path])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  async function handleLogout() {
    onClose?.()
    try {
      await logoutUser()
      window.location.href = '/'
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const isActive = (route) =>
    route === '/' ? path === '/' : path.startsWith(route)

  // Profile display data
  const displayName =
    profile?.displayName ||
    profile?.fullName    ||
    user?.email?.split('@')[0] ||
    'KOB User'

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const roleConfig = {
    admin:  { label: 'Admin',  emoji: '👑',
      cls: 'bg-[#4B3621]/10 text-[#4B3621]' },
    seller: { label: 'Seller', emoji: '🏪',
      cls: 'bg-[#D4AF37]/15 text-[#7A5C1E]' },
    buyer:  { label: 'Buyer',  emoji: '🛒',
      cls: 'bg-blue-50 text-blue-600' },
  }[profile?.role || 'buyer'] ||
    { label: 'Member', emoji: '👤',
      cls: 'bg-gray-100 text-gray-600' }

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
            className="fixed inset-0 bg-black/40
              backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* ================================ */}
          {/* DRAWER                           */}
          {/* ✅ flex flex-col h-full          */}
          {/* ✅ bg-[#FAF7F2] off-white        */}
          {/* ================================ */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring', stiffness: 300, damping: 32,
            }}
            className="fixed top-0 right-0 bottom-0 z-50
              w-[min(280px,85vw)]
              bg-[#FAF7F2]
              flex flex-col
              shadow-2xl shadow-black/20"
          >

            {/* ============================== */}
            {/* TOP HEADER                     */}
            {/* flex-shrink-0 — never squishes */}
            {/* ============================== */}
            <div className="flex-shrink-0 px-4 pt-5 pb-4
              border-b border-[#EDE8E0]">

              {/* Logo row */}
              <div className="flex items-center
                justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img src={KOB_LOGO} alt="KOB"
                    className="h-7 w-auto" />
                  <div>
                    <p className="text-[#4B3621] font-black
                      text-sm leading-none">
                      KOB
                    </p>
                    <p className="text-[#D4AF37] text-[9px]
                      font-bold uppercase tracking-widest
                      leading-none mt-0.5">
                      Marketplace
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center
                    justify-center rounded-xl
                    bg-[#4B3621]/8 text-[#4B3621]
                    hover:bg-[#4B3621]/15 transition-colors
                    touch-manipulation"
                  aria-label="Close menu"
                >
                  <Icons.Close />
                </button>
              </div>

              {/* User card */}
              {user ? (
                <div className="flex items-center gap-2.5
                  p-2.5 bg-white rounded-2xl border
                  border-[#EDE8E0] shadow-sm">

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl
                    overflow-hidden flex-shrink-0
                    bg-[#4B3621] flex items-center
                    justify-center border-2
                    border-[#D4AF37]/30">
                    {profile?.photoURL ? (
                      <img
                        src={profile.photoURL}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm
                        font-black">
                        {initials}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#2C1F0E] text-sm
                      font-bold truncate leading-tight">
                      {displayName}
                    </p>
                    {profile?.businessName && (
                      <p className="text-[#D4AF37] text-xs
                        font-semibold truncate mt-0.5">
                        {profile.businessName}
                      </p>
                    )}
                    <div className="flex items-center
                      gap-1.5 mt-1.5 flex-wrap">
                      <span className={`inline-flex items-center
                        gap-1 px-2 py-0.5 rounded-lg text-[10px]
                        font-bold ${roleConfig.cls}`}>
                        {roleConfig.emoji} {roleConfig.label}
                      </span>
                      {profile?.kobNumber && (
                        <span className="text-[10px]
                          text-gray-400 font-mono
                          bg-gray-100 px-1.5 py-0.5
                          rounded-lg">
                          {profile.kobNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Guest — sign in / join */
                <div className="flex gap-2">
                  <Link to="/login" onClick={onClose}
                    className="flex-1 py-2.5 text-center
                      bg-[#4B3621] text-white rounded-xl
                      text-xs font-bold transition-colors
                      hover:bg-[#362818]">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={onClose}
                    className="flex-1 py-2.5 text-center
                      bg-[#D4AF37] text-[#2C1F0E] rounded-xl
                      text-xs font-bold transition-colors
                      hover:bg-[#c49e30]">
                    Join KOB
                  </Link>
                </div>
              )}
            </div>

            {/* ============================== */}
            {/* SCROLLABLE MIDDLE NAV         */}
            {/* flex-1 — takes remaining space */}
            {/* ============================== */}
            <nav className="flex-1 overflow-y-auto
              overscroll-contain px-3 py-2
              space-y-0.5">

              <SectionLabel label="Navigation" />

              <MenuItem to="/" label="Home"
                icon={<Icons.Home />}
                active={isActive('/')} />

              <MenuItem to="/marketplace" label="Catalogue"
                icon={<Icons.Catalogue />}
                active={isActive('/marketplace')} />

              <MenuItem to="/alerts" label="Alerts"
                icon={<Icons.Alerts />}
                active={isActive('/alerts')} />

              {user && (
                <>
                  <SectionLabel label="My Account" />

                  <MenuItem to="/dashboard" label="Dashboard"
                    icon={<Icons.Dashboard />}
                    active={isActive('/dashboard')} />

                  <MenuItem to="/profile" label="My Profile"
                    icon={<Icons.Profile />}
                    active={isActive('/profile')} />

                  {(isSeller || isAdmin) && (
                    <>
                      <MenuItem
                        to={`/shop/${user.uid}`}
                        label="My Shop"
                        icon={<Icons.Shop />}
                        active={isActive(`/shop/${user.uid}`)}
                      />
                      <MenuItem
                        to="/marketplace"
                        label="Add Product"
                        icon={<Icons.Add />}
                        active={false}
                      />
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <SectionLabel label="Admin" />
                      <MenuItem to="/admin" label="Admin Panel"
                        icon={<Icons.Admin />}
                        active={isActive('/admin')} />
                    </>
                  )}
                </>
              )}

              <SectionLabel label="Company" />

              <MenuItem to="/teams" label="Our Team"
                icon={<Icons.Team />}
                active={isActive('/teams')} />

              <MenuItem to="/faq" label="FAQ"
                icon={<Icons.FAQ />}
                active={isActive('/faq')} />

              <MenuItem to="/help" label="Help"
                icon={<Icons.Help />}
                active={isActive('/help')} />

            </nav>

            {/* ============================== */}
            {/* STICKY BOTTOM — LOGOUT        */}
            {/* ✅ flex-shrink-0 — never hides */}
            {/* ✅ mt-auto — pushed to bottom  */}
            {/* ✅ safe area padding           */}
            {/* ============================== */}
            <div className="flex-shrink-0 px-3 pt-2
              border-t border-[#EDE8E0] bg-[#FAF7F2]
              pb-[max(1rem,env(safe-area-inset-bottom))]">

              {user ? (
                <MenuItem
                  label="Sign Out"
                  icon={<Icons.Logout />}
                  active={false}
                  danger={true}
                  onClick={handleLogout}
                />
              ) : (
                <MenuItem
                  to="/login"
                  label="Sign In"
                  icon={<Icons.Profile />}
                  active={false}
                />
              )}

              <p className="text-center text-[9px]
                text-gray-400 font-medium mt-2 pb-1">
                KOB Marketplace © {new Date().getFullYear()}
              </p>
            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
