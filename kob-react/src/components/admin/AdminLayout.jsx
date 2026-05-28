import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../firebase/auth'
import {
  LayoutDashboard, Users, Package,
  Bell, ShoppingCart, BarChart2,
  Menu, X, LogOut, Shield,
  AlertTriangle,
} from 'lucide-react'

const KOB_LOGO =
  'https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1779908958/logo512_e9kaph.png'
const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',  icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'crm',       label: 'CRM',       icon: <Users className="w-4 h-4" /> },
  { id: 'inventory', label: 'Inventory', icon: <Package className="w-4 h-4" /> },
  { id: 'orders',    label: 'Orders',    icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'broadcast', label: 'Broadcast', icon: <Bell className="w-4 h-4" /> },
]

export default function AdminLayout({
  activeTab, onTabChange, stats, children
}) {
  const { user }      = useAuth()
  const navigate      = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#FAFAF8]">

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50
            backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================================ */}
      {/* SIDEBAR                          */}
      {/* ================================ */}
      <aside className={`
        fixed top-0 left-0 h-full z-50
        w-56 bg-[#2C1F0E] flex flex-col
        transform transition-transform duration-300
        lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Logo */}
        <div className="flex items-center gap-3
          px-5 py-4 border-b border-white/10">
          <img src={KOB_LOGO} alt="KOB"
            className="h-8 w-auto" />
          <div className="min-w-0">
            <p className="text-white font-bold text-sm
              truncate">
              KOB Admin
            </p>
            <p className="text-[#D4AF37] text-[9px]
              font-semibold uppercase tracking-widest">
              Control Panel
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="ml-auto lg:hidden text-white/40
              hover:text-white flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin badge */}
        <div className="mx-3 mt-3 mb-1 px-3 py-2.5
          bg-[#D4AF37]/10 rounded-xl border
          border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5
              text-[#D4AF37] flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] text-[#D4AF37]
                font-bold uppercase tracking-wider">
                Admin Access
              </p>
              <p className="text-[9px] text-white/40
                truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2
          space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id)
                setOpen(false)
              }}
              className={`
                w-full flex items-center gap-3
                px-3 py-2.5 rounded-xl text-xs
                font-semibold transition-all duration-150
                ${activeTab === item.id
                  ? 'bg-[#D4AF37] text-[#2C1F0E]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {item.icon}
              {item.label}

              {/* Alert badge */}
              {item.id === 'inventory' &&
               stats?.lowStockCount > 0 && (
                <span className="ml-auto bg-red-500
                  text-white text-[9px] font-bold
                  px-1.5 py-0.5 rounded-full
                  flex-shrink-0">
                  {stats.lowStockCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2
              px-3 py-2.5 rounded-xl text-xs font-semibold
              text-white/40 hover:text-white
              hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Exit Admin
          </button>
        </div>
      </aside>

      {/* ================================ */}
      {/* MAIN CONTENT                     */}
      {/* ================================ */}
      <div className="flex-1 lg:ml-56 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white
          border-b border-gray-100 px-5 py-3
          flex items-center gap-4">

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 rounded-xl
              border border-gray-200 text-gray-500
              hover:bg-gray-50"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h1 className="text-sm font-semibold
              text-[#2C1F0E] capitalize">
              {activeTab === 'overview'
                ? 'Dashboard Overview'
                : activeTab
              }
            </h1>
            <p className="text-[10px] text-gray-400">
              KOB Marketplace · Admin Panel
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {stats?.lowStockCount > 0 && (
              <div className="flex items-center gap-1.5
                px-3 py-1.5 bg-red-50 border border-red-100
                rounded-full">
                <AlertTriangle className="w-3 h-3
                  text-red-500" />
                <span className="text-[10px] font-semibold
                  text-red-600">
                  {stats.lowStockCount} low stock
                </span>
              </div>
            )}
            <span className="w-2 h-2 rounded-full
              bg-emerald-500 animate-pulse" />
            <span className="text-xs text-gray-400
              font-medium">
              Live
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 lg:p-7 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}