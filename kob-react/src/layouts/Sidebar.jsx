import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, logoutUser } from "../firebase/auth";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const linkClass = (path) => `
    flex items-center gap-3 px-3 py-2.5 rounded-xl
    text-xs font-semibold uppercase tracking-wider
    transition-all duration-150
    ${
      isActive(path)
        ? "bg-[#4B3621] text-white shadow-sm"
        : "text-gray-500 hover:text-[#4B3621] hover:bg-[#4B3621]/5"
    }
  `;

  async function handleLogout() {
    try {
      await logoutUser();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }

  if (!user) return null;

  return (
    <aside
      className="hidden lg:flex flex-col
      w-56 min-h-screen bg-white border-r
      border-gray-100 sticky top-16"
    >
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Overview */}
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0
              002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0
              012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2
              2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2
              0 01-2-2z"
            />
          </svg>
          Overview
        </Link>

        {/* Seller-only links */}
        {user.role === "seller" && (
          <>
            <Link to="/marketplace" className={linkClass("/marketplace")}>
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Product
            </Link>

            <Link
              to={`/shop/${user.uid}`}
              className={linkClass(`/shop/${user.uid}`)}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0
                  002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                />
              </svg>
              My Shop
            </Link>
          </>
        )}

        {/* Marketplace */}
        <Link to="/marketplace" className={linkClass("/marketplace")}>
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2
              2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012
              2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0
              012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0
              01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2
              0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          Catalogue
        </Link>

        {/* Help */}
        <Link to="/help" className={linkClass("/help")}>
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4
              1.343 4 3 0 1.4-1.278 2.575-3.006
              2.907-.542.104-.994.54-.994 1.093m0 3h.01M21
              12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Help
        </Link>

        {/* Admin */}
        {user.role === "admin" && (
          <Link to="/admin" className={linkClass("/admin")}>
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0
                0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02
                12.02 0 003 9c0 5.591 3.824 10.29 9 11.622
                5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Admin Panel
          </Link>
        )}
      </div>

      {/* Role Badge + Logout */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        <div
          className="px-3 py-2.5 bg-[#4B3621]/5
          rounded-xl"
        >
          <p
            className="text-[9px] font-bold uppercase
            tracking-widest text-gray-400 mb-0.5"
          >
            Your Role
          </p>
          <p
            className="text-xs font-bold text-[#4B3621]
            capitalize"
          >
            {user.role === "admin"
              ? "👑 Admin"
              : user.role === "seller"
              ? "🏪 Seller"
              : "🛒 Buyer"}
          </p>
          {user.kobNumber && (
            <p
              className="text-[9px] text-[#D4AF37]
              font-semibold mt-0.5"
            >
              {user.kobNumber}
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2
            px-3 py-2 rounded-xl text-xs font-semibold
            text-red-400 hover:bg-red-50
            hover:text-red-600 transition-all"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0
              01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0
              013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
