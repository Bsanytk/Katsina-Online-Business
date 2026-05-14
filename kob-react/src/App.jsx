<<<<<<< HEAD
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider, useAuth } from "./firebase/auth";
=======
import React, {
  Suspense,
  lazy,
  useEffect,
  useState,
} from "react";

import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./firebase/auth";

import { ProfileProvider } from "./contexts/ProfileContext";
import AlertProvider from "./components/ui/AlertProvider";


import "./i18n";

// ========================================
// Layouts
// ========================================
>>>>>>> kob-marketplace-update

import TopBar from "./layouts/TopBar";
import Footer from "./layouts/Footer";

<<<<<<< HEAD
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import SupportWidget from "./components/widgets/SupportWidget";

import { PageLoader } from "./components/ui";

import { initFCM, onForegroundMessage } from "./services/fcm";

import "./i18n";

import BottomNav from "./components/BottomNav";

/* ============================= */
/* PROFILE + ALERT PROVIDERS     */
/* ============================= */

import { ProfileProvider } from "./contexts/ProfileContext";
import { AlertProvider } from "./contexts/AlertContext";

/* ============================= */
/* Lazy Loaded Pages             */
/* ============================= */

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

/* ============================= */
/* Notification Toast            */
/* ============================= */

function NotificationToast({ notification, onClose }) {
=======
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

import {
  initFCM,
  onForegroundMessage,
} from "./services/fcm";

// ========================================
// Lazy Loaded Pages
// ========================================

const Home = lazy(() => import("./pages/Home"));

const Marketplace = lazy(() =>
  import("./pages/Marketplace")
);

const Dashboard = lazy(() =>
  import("./pages/Dashboard")
);

const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard")
);

const Login = lazy(() =>
  import("./pages/Login")
);

const Register = lazy(() =>
  import("./pages/Register")
);

const Contact = lazy(() =>
  import("./pages/Contact")
);

const FAQ = lazy(() =>
  import("./pages/FAQ")
);

const Help = lazy(() =>
  import("./pages/Help")
);

const Teams = lazy(() =>
  import("./pages/Teams")
);

const Testimonials = lazy(() =>
  import("./pages/Testimonials")
);

const Terms = lazy(() =>
  import("./pages/Terms")
);

const Privacy = lazy(() =>
  import("./pages/Privacy")
);

const CookiePolicy = lazy(() =>
  import("./pages/CookiePolicy")
);

const Alerts = lazy(() =>
  import("./pages/Alerts")
);

const Profile = lazy(() =>
  import("./pages/Profile")
);

const ProductDetail = lazy(() =>
  import("./pages/ProductDetail")
);

const SellerShop = lazy(() =>
  import("./pages/SellerShop")
);

const NotFound = lazy(() =>
  import("./pages/NotFound")
);
const Legal = lazy(() => import("./pages/Legal")); // Idan kana da wannan file din


// ========================================
// Notification Toast
// ========================================

function NotificationToast({
  notification,
  onClose,
}) {
>>>>>>> kob-marketplace-update
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
        bg-white rounded-2xl
        shadow-xl border border-gray-100
        p-4 animate-slide-down
      "
    >
      <div className="flex items-start gap-3">
        <img
          src="https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png"
          alt="KOB official logo"
          className="
            w-10 h-10 rounded-xl
            object-contain flex-shrink-0
          "
        />

        <div className="flex-1 min-w-0">
          <p
            className="
              text-sm font-semibold
              text-[#2C1F0E] mb-0.5
            "
          >
            {notification.title}
          </p>

<<<<<<< HEAD
          <p className="text-xs text-gray-500 leading-relaxed">
=======
          <p
            className="
              text-xs text-gray-500
              leading-relaxed
            "
          >
>>>>>>> kob-marketplace-update
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

<<<<<<< HEAD
/* ============================= */
/* Main App Content              */
/* ============================= */
=======
// ========================================
// Main App Content
// ========================================
>>>>>>> kob-marketplace-update

function AppContent() {
  const { user, loading } = useAuth();

<<<<<<< HEAD
  const [notification, setNotification] = useState(null);
=======
  const location = useLocation();

  const [notification, setNotification] =
    useState(null);

  const [showBottomNav, setShowBottomNav] =
    useState(true);

  const [lastScrollY, setLastScrollY] =
    useState(0);

  // ========================================
  // Firebase Cloud Messaging
  // ========================================
>>>>>>> kob-marketplace-update

  useEffect(() => {
    if (!user?.uid) return;

    initFCM(user.uid);

    let unsubscribe;

    const setupListener = async () => {
<<<<<<< HEAD
      unsubscribe = await onForegroundMessage((payload) => {
        const { title, body } = payload.notification || {};

        setNotification({
          title,
          body,
        });
      });
=======
      unsubscribe =
        await onForegroundMessage(
          (payload) => {
            const { title, body } =
              payload?.notification || {};

            setNotification({
              title,
              body,
            });
          }
        );
>>>>>>> kob-marketplace-update
    };

    setupListener();

    return () => {
<<<<<<< HEAD
      if (typeof unsubscribe === "function") {
=======
      if (
        typeof unsubscribe ===
        "function"
      ) {
>>>>>>> kob-marketplace-update
        unsubscribe();
      }
    };
  }, [user?.uid]);

  // ========================================
  // Smart Bottom Navigation
  // ========================================

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY =
        window.scrollY;

      // Show while scrolling upward

      if (currentScrollY < lastScrollY) {
        setShowBottomNav(true);
      }

      // Hide while scrolling downward

      else if (
        currentScrollY > lastScrollY &&
        currentScrollY > 80
      ) {
        setShowBottomNav(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [lastScrollY]);

  // ========================================
  // Bottom Navigation Visibility Rules
  // ========================================

  const hideBottomNavRoutes = [
    "/profile",
    "/login",
    "/register",
  ];

  const shouldHideBottomNav =
    hideBottomNavRoutes.includes(
      location.pathname
    );

  // ========================================
  // Initial Loader
  // ========================================

  if (loading) {
    return (
      <PageLoader
        message="Initializing KOB Infrastructure..."
        show={true}
      />
    );
  }

  // ========================================
  // Main Layout
  // ========================================

  return (
<<<<<<< HEAD
    <div className="flex flex-col min-h-screen bg-[#FAFAF8] text-[#2C1F0E]">
      {/* Notifications */}
=======
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

>>>>>>> kob-marketplace-update
      <NotificationToast
        notification={notification}
        onClose={() =>
          setNotification(null)
        }
      />

<<<<<<< HEAD
      {/* Top Navigation */}
      <TopBar />

      {/* Main Content */}
      <main className="flex-grow pb-[72px] lg:pb-0">
=======
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
          ${
            shouldHideBottomNav
              ? "pb-4"
              : "pb-[68px]"
          }
          lg:pb-0
        `}
      >
>>>>>>> kob-marketplace-update
        <Suspense
          fallback={
            <PageLoader
              message="Loading..."
              show={true}
            />
          }
        >
          <Routes>
<<<<<<< HEAD
            {/* Public Routes */}

            <Route path="/" element={<Home />} />
=======
            {/* ========================================
                Public Routes
            ======================================== */}

            <Route
              path="/"
              element={<Home />}
            />
>>>>>>> kob-marketplace-update

            <Route
              path="/marketplace"
              element={<Marketplace />}
            />

            <Route
              path="/product/:productId"
              element={<ProductDetail />}
            />

            <Route
              path="/shop/:sellerId"
              element={<SellerShop />}
            />

            <Route
              path="/contact"
              element={<Contact />}
            />

<<<<<<< HEAD
            <Route path="/faq" element={<FAQ />} />

            <Route path="/help" element={<Help />} />

            <Route path="/teams" element={<Teams />} />
=======
            <Route
              path="/faq"
              element={<FAQ />}
            />

            <Route
              path="/help"
              element={<Help />}
            />

            <Route
              path="/teams"
              element={<Teams />}
            />
>>>>>>> kob-marketplace-update

            <Route
              path="/testimonials"
              element={<Testimonials />}
            />

<<<<<<< HEAD
            <Route path="/terms" element={<Terms />} />
=======
            <Route
              path="/terms"
              element={<Terms />}
            />
>>>>>>> kob-marketplace-update

            <Route
              path="/privacy"
              element={<Privacy />}
            />

            <Route
              path="/cookies"
              element={<CookiePolicy />}
            />

            <Route
              path="/alerts"
              element={<Alerts />}
            />
<<<<<<< HEAD

            {/* Auth Routes */}
=======
            <Route
              path="/legal"
              element={<Legal />}
            />
            
            {/* ========================================
                Authentication
            ======================================== */}
>>>>>>> kob-marketplace-update

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

<<<<<<< HEAD
            {/* Protected Dashboard */}
=======
            {/* ========================================
                Profile
            ======================================== */}

            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* ========================================
                Protected Dashboard
            ======================================== */}
>>>>>>> kob-marketplace-update

            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

<<<<<<< HEAD
            {/* Admin */}
=======
            {/* ========================================
                Admin Dashboard
            ======================================== */}
>>>>>>> kob-marketplace-update

            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

<<<<<<< HEAD
            {/* 404 */}
=======
            {/* ========================================
                404
            ======================================== */}
>>>>>>> kob-marketplace-update

            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </Suspense>
      </main>

<<<<<<< HEAD
      {/* Footer */}
=======
      {/* ========================================
          Footer
      ======================================== */}
>>>>>>> kob-marketplace-update

      <footer
        className="
          block
          border-t border-gray-200/70
          bg-[#FAFAF8]
        "
      >
        <div
          className="
            lg:block
            pb-[90px]
            lg:pb-0
          "
        >
          <Footer />
        </div>
      </footer>

<<<<<<< HEAD
      {/* Support Widget Desktop */}
=======
      {/* ========================================
          Desktop Support Widget
      ======================================== */}
>>>>>>> kob-marketplace-update

      <div className="hidden lg:block">
        <SupportWidget />
      </div>

<<<<<<< HEAD
      {/* Mobile Bottom Navigation */}

      <div className="lg:hidden">
        <BottomNav />
=======
      {/* ========================================
          Mobile Bottom Navigation
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
>>>>>>> kob-marketplace-update
      </div>
    </div>
  );
}

<<<<<<< HEAD
/* ============================= */
/* ROOT APP                      */
/* ============================= */
=======
// ========================================
// Root App
// ========================================
>>>>>>> kob-marketplace-update

export default function App() {
  return (
    <AuthProvider>
<<<<<<< HEAD
      <AlertProvider>
        <ProfileProvider>
          <AppContent />
        </ProfileProvider>
      </AlertProvider>
=======
      <ProfileProvider>
        <AlertProvider> 
          <AppContent />
        </AlertProvider> 
      </ProfileProvider>
>>>>>>> kob-marketplace-update
    </AuthProvider>
  );
}


