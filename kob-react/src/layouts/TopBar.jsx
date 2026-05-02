import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, logoutUser } from "../firebase/auth";
import MobileSidebar from "../components/MobileSidebar";
import { Menu, ShoppingBag, LayoutDashboard, LogOut } from "lucide-react";

const KOB_LOGO =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/teams", label: "Our Team" },
  { to: "/contact", label: "Contact" },
];

export default function TopBar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err?.message);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      <header
        className="sticky top-0 z-40 bg-white
        border-b border-gray-100 shadow-sm"
      >
        <div
          className="container flex items-center
          justify-between py-3 gap-4"
        >
          {/* ---- Logo ---- */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src={KOB_LOGO}
              alt="KOB"
              className="h-9 w-auto object-contain"
            />
            <div className="flex flex-col leading-none">
              <span
                className="text-base font-black
                text-[#4B3621] tracking-tight"
              >
                KOB
              </span>
              <span
                className="text-[10px] text-[#D4AF37]
                font-bold tracking-widest uppercase"
              >
                Katsina Online Business
              </span>
            </div>
          </Link>

          {/* Hidden translate anchor */}
          <div id="translate-page" style={{ display: "none" }} />

          {/* ---- Desktop Nav ---- */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  px-4 py-2 rounded-xl text-sm font-bold
                  transition-all duration-200
                  ${
                    isActive(link.to)
                      ? "bg-[#4B3621] text-white"
                      : "text-gray-600 hover:text-[#4B3621] hover:bg-[#4B3621]/5"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ---- Desktop Auth ---- */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                {/* User info */}
                <div
                  className="flex items-center gap-2 px-3 py-1.5
                  bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div
                    className="w-7 h-7 rounded-full bg-[#4B3621]
                    flex items-center justify-center flex-shrink-0"
                  >
                    <span className="text-white text-xs font-black">
                      {(user.displayName || user.email)
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </span>
                  </div>
                  <div className="leading-none">
                    <p className="text-xs font-black text-[#4B3621]">
                      {user.displayName || user.email?.split("@")[0]}
                    </p>
                    <p
                      className="text-[9px] text-[#D4AF37]
                      font-bold uppercase tracking-wider"
                    >
                      {user.role === "seller" ? "🏪 Seller" : "🛒 Buyer"}
                    </p>
                  </div>
                </div>

                {/* Dashboard link */}
                <Link
                  to="/dashboard"
                  className={`
                    flex items-center gap-1.5 px-3 py-2
                    rounded-xl text-xs font-bold uppercase
                    tracking-wider transition-all duration-200
                    ${
                      isActive("/dashboard")
                        ? "bg-[#4B3621] text-white"
                        : "border border-[#4B3621] text-[#4B3621] hover:bg-[#4B3621] hover:text-white"
                    }
                  `}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-1.5 px-3 py-2
                    rounded-xl text-xs font-bold uppercase
                    tracking-wider border border-gray-200
                    text-gray-500 hover:bg-red-50
                    hover:text-red-600 hover:border-red-200
                    transition-all duration-200
                    disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {loggingOut ? "..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm
                    font-bold text-[#4B3621] border-2
                    border-[#4B3621] hover:bg-[#4B3621]
                    hover:text-white transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm
                    font-bold bg-[#4B3621] text-white
                    hover:bg-[#362818] shadow-md
                    transition-all duration-200"
                >
                  Join KOB
                </Link>
              </>
            )}
          </div>

          {/* ---- Mobile: Marketplace + Menu ---- */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/marketplace"
              className="p-2 rounded-xl text-[#4B3621]
                hover:bg-[#4B3621]/5 transition-colors"
              aria-label="Marketplace"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl border border-gray-200
                text-[#4B3621] hover:bg-[#4B3621]
                hover:text-white hover:border-[#4B3621]
                transition-all duration-200"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
}
