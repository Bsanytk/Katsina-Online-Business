import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/auth";

// ================================
// SVG Icons
// ================================
const NavIcons = {
  Home: ({ active }) => (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.8}
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

  Shop: ({ active }) => (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3
        6h18M16 10a4 4 0 01-8 0"
      />
    </svg>
  ),

  AddProduct: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),

  Catalogue: ({ active }) => (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2
        2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0
        01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0
        012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0
        012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  ),

  Search: ({ active }) => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),

  Alert: ({ active, count }) => (
    <div className="relative">
      <svg
        className="w-5 h-5"
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002
          6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388
          6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0
          11-6 0v-1m6 0H9"
        />
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 w-4 h-4
          bg-red-500 text-white text-[9px] font-bold
          rounded-full flex items-center justify-center"
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </div>
  ),

  Profile: ({ active }) => (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7
        7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),

  Help: ({ active }) => (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.8}
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

  Dashboard: ({ active }) => (
    <svg
      className="w-5 h-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.8}
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
};

// ================================
// Nav Item Component
// ================================
function NavItem({ to, icon, label, active, isCenter, onClick }) {
  const content = (
    <div
      className={`
      flex flex-col items-center gap-1 relative
      transition-all duration-200
      ${isCenter ? "" : "px-1"}
    `}
    >
      {isCenter ? (
        // Center Add Button — special style
        <div
          className="w-14 h-14 -mt-6 bg-gradient-to-br
          from-[#4B3621] to-[#6B4C31] rounded-2xl
          flex items-center justify-center shadow-xl
          shadow-[#4B3621]/30 active:scale-95
          transition-transform border-4 border-white"
        >
          <span className="text-white">
            <NavIcons.AddProduct />
          </span>
        </div>
      ) : (
        <>
          <div
            className={`
            relative p-1.5 rounded-xl transition-all duration-200
            ${active ? "text-[#4B3621]" : "text-gray-400 hover:text-gray-600"}
          `}
          >
            {icon}
            {/* Active dot */}
            {active && (
              <span
                className="absolute -bottom-0.5 left-1/2
                -translate-x-1/2 w-1 h-1 rounded-full
                bg-[#4B3621]"
              />
            )}
          </div>
          <span
            className={`
            text-[10px] font-semibold tracking-wide
            transition-colors duration-200
            ${active ? "text-[#4B3621]" : "text-gray-400"}
          `}
          >
            {label}
          </span>
        </>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex-1 flex
        items-center justify-center"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className="flex-1 flex
      items-center justify-center"
    >
      {content}
    </Link>
  );
}

// ================================
// Main BottomNav Component
// ================================
export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname;

  const isActive = (route) =>
    route === "/" ? path === "/" : path.startsWith(route);

  // Hide on admin pages
  if (path.startsWith("/admin")) return null;

  // ================================
  // SELLER NAV
  // ================================
  if (user?.role === "seller") {
    return (
      <nav
        className="fixed bottom-0 left-0 right-0 z-50
        lg:hidden"
      >
        {/* Blur backdrop */}
        <div
          className="absolute inset-0 bg-white/90
          backdrop-blur-xl border-t border-gray-100
          shadow-2xl shadow-black/10"
        />

        <div
          className="relative flex items-end
          justify-around px-2 pb-safe pt-2
          max-w-lg mx-auto h-[72px]"
        >
          {/* Home */}
          <NavItem
            to="/"
            label="Home"
            active={isActive("/")}
            icon={<NavIcons.Home active={isActive("/")} />}
          />

          {/* My Shop */}
          <NavItem
            to={`/shop/${user.uid}`}
            label="My Shop"
            active={isActive(`/shop/${user.uid}`)}
            icon={<NavIcons.Shop active={isActive(`/shop/${user.uid}`)} />}
          />

          {/* Add Product — Center */}
          <NavItem to="/marketplace" label="" isCenter />

          {/* Dashboard */}
          <NavItem
            to="/dashboard"
            label="Dashboard"
            active={isActive("/dashboard")}
            icon={<NavIcons.Dashboard active={isActive("/dashboard")} />}
          />

          {/* Profile */}
          <NavItem
            to="/dashboard"
            label="Profile"
            active={false}
            onClick={() => {
              navigate("/dashboard");
              // Small delay then trigger profile tab
              setTimeout(() => {
                window.dispatchEvent(
                  new CustomEvent("kob:dashboard:tab", { detail: "profile" })
                );
              }, 100);
            }}
            icon={<NavIcons.Profile active={false} />}
          />
        </div>
        {/* iOS safe area padding */}
        <div className="h-safe-bottom bg-white/90" />
      </nav>
    );
  }

  // ================================
  // BUYER / VISITOR NAV
  // ================================
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50
      lg:hidden"
    >
      {/* Blur backdrop */}
      <div
        className="absolute inset-0 bg-white/90
        backdrop-blur-xl border-t border-gray-100
        shadow-2xl shadow-black/10"
      />

      <div
        className="relative flex items-end
        justify-around px-2 pb-safe pt-2
        max-w-lg mx-auto h-[72px]"
      >
        {/* Home */}
        <NavItem
          to="/"
          label="Home"
          active={isActive("/")}
          icon={<NavIcons.Home active={isActive("/")} />}
        />

        {/* Catalogue */}
        <NavItem
          to="/marketplace"
          label="Catalogue"
          active={isActive("/marketplace")}
          icon={<NavIcons.Catalogue active={isActive("/marketplace")} />}
        />

        {/* Search — Center */}
        <NavItem to="/marketplace" label="" isCenter />

        {/* Alerts */}
        <NavItem
          to={user ? "/dashboard" : "/login"}
          label="Alerts"
          active={false}
          icon={<NavIcons.Alert active={false} count={0} />}
        />

        {/* Help */}
        <NavItem
          to="/help"
          label="Help"
          active={isActive("/help")}
          icon={<NavIcons.Help active={isActive("/help")} />}
        />
      </div>

      {/* iOS safe area */}
      <div className="h-safe-bottom bg-white/90" />
    </nav>
  );
}
