import React, { Suspense, lazy, useEffect, useState } from "react";

import { Routes, Route, useLocation } from "react-router-dom";

import { AuthProvider, useAuth } from "./firebase/auth";

import TopBar from "./layouts/TopBar";
import Footer from "./layouts/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import SupportWidget from "./components/widgets/SupportWidget";

import { PageLoader } from "./components/ui";

import { initFCM, onForegroundMessage } from "./services/fcm";

import "./i18n";

import { ProfileProvider } from "./contexts/ProfileContext";

import BottomNav from "./components/BottomNav";

// ========================================
// Lazy Loaded Pages
// ========================================

const Home = lazy(() => import("./pages/Home"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Help = lazy(() => import("./pages/Help"));

const Teams = lazy(() => import("./pages/Teams"));
const Testimonials = lazy(() => import("./pages/Testimonials"));

const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));

const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));

const NotFound = lazy(() => import("./pages/NotFound"));

const ProductDetail = lazy(() => import("./pages/ProductDetail"));

const SellerShop = lazy(() => import("./pages/SellerShop"));

const Alerts = lazy(() => import("./pages/Alerts"));

const Profile = lazy(() => import("./pages/Profile"));

// ========================================
// Notification Toast
// ========================================

function NotificationToast({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div
      className="
        fixed top-4 right-4 z-[100]
        max-w-sm w-[calc(100%-2rem)]
        bg-white
        rounded-2xl
        shadow-xl
        border border-gray-100
        p-4
        animate-slide-down
      "
    >
      <div className="flex items-start gap-3">
        <img
          src="https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png"
          className="
            w-10 h-10 rounded-xl
            object-contain
            flex-shrink-0
          "
          alt="KOB official logo"
        />

        <div className="flex-1 min-w-0">
          <p
            className="
              text-sm font-semibold
              text-[#2C1F0E]
              mb-0.5
            "
          >
            {notification.title}
          </p>

          <p
            className="
              text-xs
              text-gray-500
              leading-relaxed
            "
          >
            {notification.body}
          </p>
        </div>

        <button
          onClick={onClose}
          className="
            text-gray-300
            hover:text-gray-500
            flex-shrink-0
            text-lg
            leading-none
            transition-colors
          "
          aria-label="Close notification"
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

  const location = useLocation();

  const [notification, setNotification] = useState(null);

  const [showBottomNav, setShowBottomNav] = useState(true);

  const [lastScrollY, setLastScrollY] = useState(0);

  // ========================================
  // Firebase Cloud Messaging
  // ========================================

  useEffect(() => {
    if (!user?.uid) return;

    initFCM(user.uid);

    let unsubscribe;

    const setupListener = async () => {
      unsubscribe = await onForegroundMessage((payload) => {
        const { title, body } = payload?.notification || {};

        setNotification({
          title,
          body,
        });
      });
    };

    setupListener();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [user?.uid]);

  // ========================================
  // Smart Bottom Navigation Visibility
  // ========================================

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show nav when scrolling upward
      if (currentScrollY < lastScrollY) {
        setShowBottomNav(true);
      }

      // Hide nav when scrolling downward
      else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowBottomNav(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // ========================================
  // Hide BottomNav On Important Pages
  // ========================================

  const hideBottomNavRoutes = ["/profile", "/login", "/register"];

  const shouldHideBottomNav = hideBottomNavRoutes.includes(location.pathname);

  // ========================================
  // Initial Loader
  // ========================================

  if (loading) {
    return (
      <PageLoader message="Initializing KOB Infrastructure..." show={true} />
    );
  }

  // ========================================
  // Main App Layout
  // ========================================

  return (
    <div
      className="
        flex flex-col min-h-screen
        bg-[#FAFAF8]
        text-[#2C1F0E]
        text-[95%]
        overflow-x-hidden
        pb-20 lg:pb-0
      "
    >
      {/* ========================================
          Notifications
      ======================================== */}

      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* ========================================
          Top Navigation
      ======================================== */}

      <TopBar />

      {/* ========================================
          Main Content
      ======================================== */}

      <main
        className={`
          flex-grow
          transition-all duration-300
          ${shouldHideBottomNav ? "pb-4" : "pb-[68px]"}
          lg:pb-0
        `}
      >
        <Suspense fallback={<PageLoader message="Loading..." show={true} />}>
          <Routes>
            {/* Public Routes */}

            <Route path="/" element={<Home />} />

            <Route path="/marketplace" element={<Marketplace />} />

            <Route path="/product/:productId" element={<ProductDetail />} />

            <Route path="/shop/:sellerId" element={<SellerShop />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="/faq" element={<FAQ />} />

            <Route path="/help" element={<Help />} />

            <Route path="/teams" element={<Teams />} />

            <Route path="/testimonials" element={<Testimonials />} />

            <Route path="/terms" element={<Terms />} />

            <Route path="/privacy" element={<Privacy />} />

            <Route path="/cookies" element={<CookiePolicy />} />

            <Route path="/alerts" element={<Alerts />} />

            {/* Auth Routes */}

            <Route path="/login" element={<Login />} />

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

            {/* Admin */}

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

      {/* ========================================
          Desktop Footer
      ======================================== */}

      <footer className="hidden lg:block">
        <Footer />
      </footer>

      {/* ========================================
          Desktop Support Widget
      ======================================== */}

      <div className="hidden lg:block">
        <SupportWidget />
      </div>

      {/* ========================================
          Adaptive Mobile Bottom Navigation
      ======================================== */}

      <div
        className={`
          lg:hidden
          fixed bottom-0 left-0 right-0
          z-40
          transition-all duration-300 ease-out
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
// Root App
// ========================================

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </AuthProvider>
  );
}
