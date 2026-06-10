/**
 * TopBar.jsx — KOB Marketplace Navigation
 *
 * REFINED (not rewritten):
 * ✅ Fixed positioning — always visible while scrolling
 * ✅ Background: #432B1E brand brown + glassmorphism
 * ✅ Scroll-aware: subtle shadow deepens on scroll
 * ✅ All auth logic, routing, MobileSidebar preserved exactly
 * ✅ White text, #E8B04B gold subtitle — brand hierarchy
 * ✅ Premium hover states + active indicators
 * ✅ Mobile touch targets improved
 * ✅ Body offset via <body style="padding-top: 64px"> OR
 *    add pt-16 to your main layout wrapper
 */

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, logoutUser } from "../firebase/auth";
import MobileSidebar from "../components/MobileSidebar";
import { Menu, ShoppingBag, LayoutDashboard, LogOut } from "lucide-react";

const KOB_LOGO =
  "https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1780655200/logo512_xomyvi.png";

const NAV_LINKS = [
  { to: "/",           label: "Home"        },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/teams",      label: "Our Team"    },
  { to: "/contact",    label: "Contact"     },
];

export default function TopBar() {
  const { user }    = useAuth();
  const location    = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut]     = useState(false);
  // Scroll depth — deepens shadow as user scrolls
  const [scrolled, setScrolled]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  async function handleLogout() {
    setLoggingOut(true);
    try   { await logoutUser(); }
    catch (err) { console.error("Logout error:", err?.message); }
    finally     { setLoggingOut(false); }
  }

  return (
    <>
      {/* ─────────────────────────────────────────────
          HEADER — fixed, always visible
          Height: 64px (h-16) — compensate in layout
          ───────────────────────────────────────────── */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 h-16
          transition-all duration-300
          ${scrolled
            ? "shadow-[0_4px_32px_rgba(61,38,25,0.28)]"
            : "shadow-[0_1px_0_rgba(255,255,255,0.06)]"
          }
        `}
        style={{
          /* Brand brown base + glass layer */
          background: scrolled
            ? "rgba(61,38,25,0.97)"
            : "rgba(67,43,30,0.92)",
          backdropFilter:       "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(232,176,75,0.10)",
        }}
      >
        <div className="container h-full flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0
              group focus:outline-none focus-visible:ring-2
              focus-visible:ring-[#E8B04B] rounded-lg"
          >
            <img
              src={KOB_LOGO}
              alt="KOB"
              className="h-9 w-auto object-contain
                transition-transform duration-200
                group-hover:scale-105"
            />
            <div className="flex flex-col leading-none">
              <span
                className="text-base font-black tracking-tight"
                style={{ color: "#ded7cf" }}
              >
                KOB
              </span>
              <span
                className="text-[9px] font-bold tracking-widest uppercase"
                style={{ color: "#E8B04B" }}
              >
                Katsina Online Business
              </span>
            </div>
          </Link>

          {/* Hidden translate anchor — preserved */}
          <div id="translate-page" style={{ display: "none" }} />

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  relative px-4 py-2 rounded-xl
                  text-sm font-semibold tracking-wide
                  transition-all duration-200
                  focus:outline-none focus-visible:ring-2
                  focus-visible:ring-[#E8B04B]
                  ${isActive(link.to)
                    ? "text-[#E8B04B]"
                    : "text-white/60 hover:text-white"
                  }
                `}
              >
                {link.label}
                {/* Active underline indicator */}
                {isActive(link.to) && (
                  <span
                    className="absolute bottom-0 left-1/2
                      -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: "#E8B04B" }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Desktop Auth ── */}
          <div className="hidden lg:flex items-center gap-2.5">
            {user ? (
              <>
                {/* User pill */}
                <div
                  className="flex items-center gap-2 px-3 py-1.5
                    rounded-xl border"
                  style={{
                    background:   "rgba(255,255,255,0.06)",
                    borderColor:  "rgba(255,255,255,0.10)",
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center
                      justify-center flex-shrink-0 text-xs font-black"
                    style={{ background: "#E8B04B", color: "#3d2619" }}
                  >
                    {(user.displayName || user.email)
                      ?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="leading-none">
                    <p
                      className="text-xs font-bold"
                      style={{ color: "#ded7cf" }}
                    >
                      {user.displayName || user.email?.split("@")[0]}
                    </p>
                    <p
                      className="text-[9px] font-semibold
                        uppercase tracking-wider"
                      style={{ color: "#E8B04B" }}
                    >
                      {user.role === "seller" ? "🏪 Seller" : "🛒 Buyer"}
                    </p>
                  </div>
                </div>

                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  className={`
                    flex items-center gap-1.5 px-3.5 py-2
                    rounded-xl text-xs font-bold uppercase
                    tracking-wider transition-all duration-200
                    focus:outline-none focus-visible:ring-2
                    focus-visible:ring-[#E8B04B]
                    ${isActive("/dashboard")
                      ? "text-[#3d2619]"
                      : "text-white/80 hover:text-[#3d2619]"
                    }
                  `}
                  style={isActive("/dashboard") ? {
                    background: "#E8B04B",
                  } : {
                    background:  "rgba(232,176,75,0.12)",
                    border:      "1px solid rgba(232,176,75,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive("/dashboard")) {
                      e.currentTarget.style.background = "#E8B04B";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive("/dashboard")) {
                      e.currentTarget.style.background = "rgba(232,176,75,0.12)";
                    }
                  }}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-1.5 px-3.5 py-2
                    rounded-xl text-xs font-bold uppercase
                    tracking-wider transition-all duration-200
                    disabled:opacity-40 cursor-pointer
                    focus:outline-none focus-visible:ring-2
                    focus-visible:ring-red-400"
                  style={{
                    background:  "rgba(255,255,255,0.05)",
                    border:      "1px solid rgba(255,255,255,0.08)",
                    color:       "rgba(255,255,255,0.45)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background   = "rgba(239,68,68,0.12)";
                    e.currentTarget.style.borderColor  = "rgba(239,68,68,0.3)";
                    e.currentTarget.style.color        = "#f87171";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background   = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.borderColor  = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color        = "rgba(255,255,255,0.45)";
                  }}
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
                    font-semibold transition-all duration-200
                    focus:outline-none focus-visible:ring-2
                    focus-visible:ring-[#E8B04B]"
                  style={{
                    color:       "#ded7cf",
                    background:  "rgba(255,255,255,0.06)",
                    border:      "1px solid rgba(255,255,255,0.10)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background  = "rgba(255,255,255,0.10)";
                    e.currentTarget.style.borderColor = "rgba(232,176,75,0.3)";
                    e.currentTarget.style.color       = "#E8B04B";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background  = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                    e.currentTarget.style.color       = "#ded7cf";
                  }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm
                    font-bold transition-all duration-200
                    focus:outline-none focus-visible:ring-2
                    focus-visible:ring-[#3d2619]"
                  style={{
                    background: "#E8B04B",
                    color:      "#3d2619",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#d6a666";
                    e.currentTarget.style.transform  = "translateY(-1px)";
                    e.currentTarget.style.boxShadow  = "0 4px 16px rgba(232,176,75,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#E8B04B";
                    e.currentTarget.style.transform  = "translateY(0)";
                    e.currentTarget.style.boxShadow  = "none";
                  }}
                >
                  Join KOB
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile: Marketplace + Menu ── */}
          <div className="flex lg:hidden items-center gap-1.5">
            <Link
              to="/marketplace"
              className="p-2.5 rounded-xl transition-all duration-200
                focus:outline-none focus-visible:ring-2
                focus-visible:ring-[#E8B04B]"
              style={{ color: "rgba(222,215,207,0.7)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color      = "#E8B04B";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color      = "rgba(222,215,207,0.7)";
              }}
              aria-label="Marketplace"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl transition-all duration-200
                focus:outline-none focus-visible:ring-2
                focus-visible:ring-[#E8B04B]"
              style={{
                background:  "rgba(255,255,255,0.07)",
                border:      "1px solid rgba(255,255,255,0.10)",
                color:       "#ded7cf",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background   = "rgba(232,176,75,0.15)";
                e.currentTarget.style.borderColor  = "rgba(232,176,75,0.3)";
                e.currentTarget.style.color        = "#E8B04B";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background   = "rgba(255,255,255,0.07)";
                e.currentTarget.style.borderColor  = "rgba(255,255,255,0.10)";
                e.currentTarget.style.color        = "#ded7cf";
              }}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────
          SPACER — compensates for fixed header (h-16)
          This replaces the old sticky push.
          If your App.jsx already has pb-[84px] on main,
          add pt-16 to main instead of this div.
          ───────────────────────────────────────────── */}
      <div className="h-16" aria-hidden="true" />

      {/* Mobile Sidebar — preserved exactly */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
}
