import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase/auth";
import {
  LayoutDashboard,
  Users,
  Package,
  Bell,
  ShoppingCart,
  BarChart2,
  Menu,
  X,
  LogOut,
  Shield,
} from "lucide-react";

const KOB_LOGO =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png";

const NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  { id: "crm", label: "CRM", icon: <Users className="w-4 h-4" /> },
  {
    id: "inventory",
    label: "Inventory",
    icon: <Package className="w-4 h-4" />,
  },
  { id: "orders", label: "Orders", icon: <ShoppingCart className="w-4 h-4" /> },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart2 className="w-4 h-4" />,
  },
  { id: "broadcast", label: "Broadcast", icon: <Bell className="w-4 h-4" /> },
];

export default function AdminLayout({
  activeTab,
  onTabChange,
  stats,
  children,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAFAF8]">
      {/* ================================ */}
      {/* SIDEBAR                          */}
      {/* ================================ */}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 h-full z-50
        w-60 bg-[#2C1F0E] flex flex-col
        transform transition-transform duration-300
        lg:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5
          border-b border-white/10"
        >
          <img src={KOB_LOGO} alt="KOB" className="h-8 w-auto" />
          <div>
            <p className="text-white font-bold text-sm">KOB Admin</p>
            <p
              className="text-[#D4AF37] text-[10px]
              font-semibold uppercase tracking-widest"
            >
              Control Panel
            </p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden text-white/50
              hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin badge */}
        <div
          className="mx-4 mt-4 mb-2 px-3 py-2
          bg-[#D4AF37]/10 rounded-xl border
          border-[#D4AF37]/20 flex items-center gap-2"
        >
          <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
          <div className="min-w-0">
            <p
              className="text-[10px] text-[#D4AF37]
              font-bold uppercase tracking-wider"
            >
              Admin Access
            </p>
            <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 px-3 py-3 space-y-1
          overflow-y-auto"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5
                rounded-xl text-xs font-semibold
                transition-all duration-150
                ${
                  activeTab === item.id
                    ? "bg-[#D4AF37] text-[#2C1F0E]"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {item.icon}
              {item.label}
              {/* Alert badges */}
              {item.id === "inventory" && stats?.lowStockCount > 0 && (
                <span
                  className="ml-auto bg-red-500 text-white
                  text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                >
                  {stats.lowStockCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => navigate("/")}
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
      <div className="flex-1 lg:ml-60 flex flex-col min-w-0">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 bg-white
          border-b border-gray-100 px-5 py-3
          flex items-center gap-4"
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl
              border border-gray-200 text-gray-500"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div>
            <h1
              className="text-sm font-semibold
              text-[#2C1F0E] capitalize"
            >
              {activeTab === "overview" ? "Dashboard Overview" : activeTab}
            </h1>
            <p className="text-xs text-gray-400">KOB Marketplace Admin Panel</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full
              bg-emerald-500 animate-pulse"
            />
            <span className="text-xs text-gray-400 font-medium">Live</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 lg:p-7 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
