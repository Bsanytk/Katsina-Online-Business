import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/auth";

// ================================
// SVG Icons
// ================================

const Icons = {
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
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2
        0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0
        01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0
        012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0
        012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0
        01-2-2v-2z"
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
  Alert: ({ active, count = 0 }) => (
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
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118
          14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4
          0v.341C7.67 6.165 6 8.388 6 11v3.159c0
          .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0
          11-6 0v-1m6 0H9"
        />
      </svg>
      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5
          min-w-[16px] h-4 bg-red-500 text-white
          text-[9px] font-bold rounded-full
          flex items-center justify-center px-0.5"
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
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0
        00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Plus: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
};

// ================================
// Single Nav Item
// ================================
function NavItem({ to, icon, label, active, onClick }) {
  const content = (
    <div
      className="flex flex-col items-center gap-0.5
      relative px-1 py-1 min-w-[52px]"
    >
      <div
        className={`
        relative flex items-center justify-center
        w-8 h-8 rounded-xl transition-all duration-200
        ${active ? "bg-[#4B3621]/10" : ""}
      `}
      >
        <span
          className={`
          transition-colors duration-200
          ${active ? "text-[#4B3621]" : "text-gray-400"}
        `}
        >
          {icon}
        </span>
        {/* Active indicator dot */}
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
        text-[9px] font-semibold tracking-wide
        leading-tight text-center transition-colors
        ${active ? "text-[#4B3621]" : "text-gray-400"}
      `}
      >
        {label}
      </span>
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex-1 flex items-center justify-center
          active:scale-95 transition-transform"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className="flex-1 flex items-center justify-center
        active:scale-95 transition-transform"
    >
      {content}
    </Link>
  );
}

// ================================
// Center Search Button
// ================================
function CenterSearchButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5
        flex-1 active:scale-95 transition-transform"
    >
      <div
        className="w-12 h-12 -mt-5 bg-[#4B3621]
        rounded-2xl flex items-center justify-center
        shadow-xl shadow-[#4B3621]/30
        border-4 border-white transition-all
        hover:bg-[#362818] active:scale-95"
      >
        <span className="text-white">
          <Icons.Search active={false} />
        </span>
      </div>
      <span
        className="text-[9px] font-semibold
        text-gray-400 mt-0.5"
      >
        Search
      </span>
    </button>
  );
}

// ================================
// Main BottomNav
// ================================
export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);
  const path = location.pathname;
  //Real-time notification listener
  useEffect(() => {
    const q = query(collection(db, "broadcasts"));
    const unsubscribe = onSnapshot(q, (onSnapshot) => {
      setAlertCount(Snapshot.docs.length);
    });
    return () => unsubscribe();
  }, []);

  // Hide on admin + login + register pages
  if (path.startsWith("/admin") || path === "/login" || path === "/register")
    return null;

  const isActive = (route) =>
    route === "/" ? path === "/" : path.startsWith(route);

  // Search handler
  function handleSearch() {
    navigate("/marketplace");
    // Small delay then focus search input if present
    setTimeout(() => {
      const input = document.querySelector(
        'input[placeholder*="Search"], input[placeholder*="search"]'
      );
      if (input) input.focus();
    }, 300);
  }

  // Profile handler — depends on user state
  function handleProfile() {
    if (!user) {
      navigate("/login");
    } else if (user.role === "seller") {
      navigate("/dashboard");
    } else if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  }

  // ================================
  // SELLER NAV
  // ================================
  if (user?.role === "seller") {
    return (
      <nav
        className="fixed bottom-0 left-0 right-0
        z-50 lg:hidden"
      >
        <div
          className="absolute inset-0 bg-white/95
          backdrop-blur-xl border-t border-gray-100
          shadow-2xl shadow-black/10"
        />

        <div
          className="relative flex items-end
          justify-around px-3 pt-2 pb-2 max-w-lg
          mx-auto h-[68px]"
        >
          {/* Home */}
          <NavItem
            to="/"
            label="Home"
            active={isActive("/")}
            icon={<Icons.Home active={isActive("/")} />}
          />

          {/* My Shop */}
          <NavItem
            to={`/shop/${user.uid}`}
            label="My Shop"
            active={isActive(`/shop/${user.uid}`)}
            icon={<Icons.Shop active={isActive(`/shop/${user.uid}`)} />}
          />

          {/* Search — Center */}
          <CenterSearchButton onClick={handleSearch} />

          {/* Alerts */}
          <NavItem
            to="/alerts"
            label="Alerts"
            active={isActive("/alerts")}
            icon={
              <Icons.Alert active={isActive("/alerts")} count={alertCount} />
            }
          />

          {/* Profile → Dashboard */}
          <NavItem
            label="Profile"
            active={isActive("/dashboard")}
            icon={<Icons.Profile active={isActive("/dashboard")} />}
            onClick={handleProfile}
          />
        </div>

        {/* iOS safe area */}
        <div
          className="h-[env(safe-area-inset-bottom)]
          bg-white/95"
        />
      </nav>
    );
  }

  // ================================
  // BUYER / VISITOR NAV
  // ================================
  return (
    <nav
      className="fixed bottom-0 left-0 right-0
      z-50 lg:hidden"
    >
      <div
        className="absolute inset-0 bg-white/95
        backdrop-blur-xl border-t border-gray-100
        shadow-2xl shadow-black/10"
      />

      <div
        className="relative flex items-end
        justify-around px-3 pt-2 pb-2 max-w-lg
        mx-auto h-[68px]"
      >
        {/* Home */}
        <NavItem
          to="/"
          label="Home"
          active={isActive("/")}
          icon={<Icons.Home active={isActive("/")} />}
        />

        {/* Catalogue */}
        <NavItem
          to="/marketplace"
          label="Catalogue"
          active={isActive("/marketplace")}
          icon={<Icons.Catalogue active={isActive("/marketplace")} />}
        />

        {/* Search — Center */}
        <CenterSearchButton onClick={handleSearch} />

        {/* Alerts */}
        <NavItem
          to={user ? "/dashboard" : "/login"}
          label="Alerts"
          active={false}
          icon={<Icons.Alert active={false} count={0} />}
        />

        {/* Profile */}
        <NavItem
          label="Profile"
          active={
            isActive("/dashboard") ||
            isActive("/login") ||
            isActive("/register")
          }
          icon={
            <Icons.Profile
              active={
                isActive("/dashboard") ||
                isActive("/login") ||
                isActive("/register")
              }
            />
          }
          onClick={handleProfile}
        />
      </div>

      {/* iOS safe area */}
      <div
        className="h-[env(safe-area-inset-bottom)]
        bg-white/95"
      />
    </nav>
  );
}
