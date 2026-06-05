/**
 * App.jsx — KOB Marketplace
 *
 * FIXED v2 — FCM infinite loop prevention:
 * ✅ uid extracted as primitive string (not user object)
 * ✅ FCM init useEffect depends on uid only — never re-fires on re-render
 * ✅ Foreground messages in separate isolated useEffect
 * ✅ All existing routes, layout, scroll logic preserved exactly
 * ✅ NotificationToast preserved exactly
 * ✅ AppBanner preserved exactly
 * ✅ BottomNav hide/show logic preserved exactly
 */

import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./firebase/auth";
import { ProfileProvider } from "./contexts/ProfileContext";
import AlertProvider from "./components/ui/AlertProvider";
import AppBanner from "./components/pwa/AppBanner";
import "./i18n";

// ========================================
// Layouts
// ========================================
import TopBar from "./layouts/TopBar";
import Footer from "./layouts/Footer";

// ========================================
// Components
// ========================================
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import BottomNav from "./components/BottomNav";
import SupportWidget from "./components/widgets/SupportWidget";
import { PageLoader } from "./components/ui";

// ========================================
// Services
// ========================================
import { initFCM, onForegroundMessage } from "./services/fcm";

// ========================================
// Lazy Loaded Pages — preserved exactly
// ========================================
const Home         = lazy(() => import("./pages/Home"));
const Marketplace  = lazy(() => import("./pages/Marketplace"));
const Dashboard    = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Login        = lazy(() => import("./pages/Login"));
const Register     = lazy(() => import("./pages/Register"));
const Contact      = lazy(() => import("./pages/Contact"));
const FAQ          = lazy(() => import("./pages/FAQ"));
const Help         = lazy(() => import("./pages/Help"));
const Teams        = lazy(() => import("./pages/Teams"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Terms        = lazy(() => import("./pages/Terms"));
const Privacy      = lazy(() => import("./pages/Privacy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Alerts       = lazy(() => import("./pages/Alerts"));
const Profile      = lazy(() => import("./pages/Profile"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const SellerShop   = lazy(() => import("./pages/SellerShop"));
const NotFound     = lazy(() => import("./pages/NotFound"));
const Legal        = lazy(() => import("./pages/Legal"));

// ========================================
// Notification Toast — preserved exactly
// ========================================
function NotificationToast({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => { onClose(); }, 5000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div
      className="
        fixed top-4 right-4 z-[100]
        max-w-sm w-[calc(100%-2rem)]
        bg-white rounded-2xl
        shadow-xl border border-gray-100
        p-4 animate-slide-down
      "
    >
      <div className="flex items-start gap-3">
        <img
          src="https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1780655200/logo512_xomyvi.png"
          alt="KOB official logo"
          className="w-10 h-10 rounded-xl object-contain flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#2C1F0E] mb-0.5">
            {notification.title}
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            {notification.body}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close notification"
          className="
            text-gray-300 hover:text-gray-500
            flex-shrink-0 text-lg leading-none
            transition-colors
          "
        >
          ×
        </button>
      </div>
    </div>
  );
}

// ========================================
// Main App Content
// ========================================
function AppContent() {
  const { user, loading } = useAuth();

  // ✅ LOOP FIX — Extract uid as primitive string
  //
  // user?.uid returns a STRING like "abc123" — not an object.
  // A string primitive is compared by VALUE in React's dependency
  // check, not by reference. This means:
  //   - Same user logged in → uid never changes → effects never re-run
  //   - User logs out → uid becomes null → effects clean up
  //   - Different user logs in → uid changes → effects re-run once
  //
  // If we used [user?.uid] directly in the dep array, optional
  // chaining evaluation can be inconsistent across re-renders.
  // Extracting to a variable first guarantees stability.
  const uid = user?.uid ?? null;

  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // ========================================
  // ✅ FCM INIT — loop-safe, isolated
  //
  // WHY THIS WORKS:
  // 1. uid is a primitive string — React compares by value
  //    so this effect NEVER re-runs unless uid actually changes
  // 2. initFCM() has localStorage guard inside —
  //    if token exists, returns in <1ms with zero API calls
  // 3. Even if getToken() runs, saveTokenToFirestore()
  //    skips the write if token hasn't changed
  // Result: zero Firestore writes on reload = zero re-renders = no loop
  // ========================================
  useEffect(() => {
    if (!uid) return;

    // fire-and-forget — never await in useEffect directly
    initFCM(uid).catch((err) =>
      console.warn("[KOB App] FCM init:", err?.message)
    );

    // No cleanup needed — initFCM has no persistent listeners
  }, [uid]); // ← uid STRING primitive only — never user object

  // ========================================
  // ✅ FOREGROUND MESSAGES — separate isolated effect
  //
  // Separated from FCM init intentionally:
  // - Init runs once, foreground listener persists
  // - Cleanup is handled correctly on logout
  // - Both depend on same stable uid primitive
  // ========================================
  useEffect(() => {
    if (!uid) return;

    let unsubscribe;

    const setupListener = async () => {
      unsubscribe = await onForegroundMessage((payload) => {
        const { title, body } = payload?.notification || {};
        setNotification({ title, body });
      });
    };

    setupListener();

    // ✅ Cleanup on uid change (logout/login) or unmount
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [uid]); // ← same stable primitive

  // ========================================
  // Smart Bottom Navigation — preserved exactly
  // ========================================
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        setShowBottomNav(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowBottomNav(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { window.removeEventListener("scroll", handleScroll); };
  }, [lastScrollY]);

  // ========================================
  // Route visibility rules — preserved exactly
  // ========================================
  const hideBottomNavRoutes = ["/profile", "/login", "/register"];

  const hideBannerRoutes = [
    "/profile",
    "/login",
    "/register",
    "/dashboard",
    "/admin",
  ];

  const shouldHideBottomNav = hideBottomNavRoutes.includes(location.pathname);

  // ========================================
  // Initial Loader — preserved exactly
  // ========================================
  if (loading) {
    return (
      <PageLoader message="Initializing KOB Infrastructure..." show={true} />
    );
  }

  // ========================================
  // Main Layout — preserved exactly
  // ========================================
  return (
    <div
      className="
        flex flex-col min-h-screen
        bg-[#FAFAF8]
        text-[#2C1F0E]
        text-[95%]
        overflow-x-hidden
        pb-[84px] lg:pb-0
      "
    >
      {/* Notifications */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* PWA Smart Banner */}
      <AppBanner />

      {/* Top Navigation */}
      <TopBar />

      {/* Main Content */}
      <main
        className={`
          flex-grow
          transition-all duration-300
          ${shouldHideBottomNav ? "pb-6" : "pb-[88px]"}
          lg:pb-0
        `}
      >
        <Suspense fallback={<PageLoader message="Loading..." show={true} />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/"                element={<Home />} />
            <Route path="/marketplace"     element={<Marketplace />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/shop/:sellerId"  element={<SellerShop />} />
            <Route path="/contact"         element={<Contact />} />
            <Route path="/faq"             element={<FAQ />} />
            <Route path="/help"            element={<Help />} />
            <Route path="/teams"           element={<Teams />} />
            <Route path="/testimonials"    element={<Testimonials />} />
            <Route path="/terms"           element={<Terms />} />
            <Route path="/privacy"         element={<Privacy />} />
            <Route path="/cookies"         element={<CookiePolicy />} />
            <Route path="/alerts"          element={<Alerts />} />
            <Route path="/legal"           element={<Legal />} />

            {/* Authentication */}
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Profile */}
            <Route path="/profile" element={<Profile />} />

            {/* Protected Dashboard */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      <footer
        className="
          block
          border-t border-gray-200/70
          bg-[#FAFAF8]
        "
      >
        <div className="lg:block pb-[90px] lg:pb-0">
          <Footer />
        </div>
      </footer>

      {/* Desktop Support Widget */}
      <div className="hidden lg:block">
        <SupportWidget />
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        className={`
          lg:hidden
          fixed bottom-0 left-0 right-0
          z-40
          transition-all duration-500 ease-out
          ${
            shouldHideBottomNav
              ? "translate-y-full opacity-0 pointer-events-none"
              : showBottomNav
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }
        `}
      >
        <div
          className="
            bg-white/90
            backdrop-blur-xl
            border-t border-gray-200/70
            shadow-[0_-4px_20px_rgba(0,0,0,0.06)]
            pb-[max(0.5rem,env(safe-area-inset-bottom))]
          "
        >
          <BottomNav />
        </div>
      </div>
    </div>
  );
}

// ========================================
// Root App — preserved exactly
// ========================================
export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AlertProvider>
          <AppContent />
        </AlertProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
