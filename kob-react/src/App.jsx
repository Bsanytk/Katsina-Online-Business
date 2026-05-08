import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./firebase/auth";
import TopBar from "./layouts/TopBar";
import Footer from "./layouts/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import SupportWidget from "./components/widgets/SupportWidget";
import { PageLoader } from "./components/ui";
import { initFCM, onForegroundMessage } from "./services/fcm";
import "./i18n";
import BottomNav from "./components/BottomNav";

// Lazy load pages
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

// ================================
// FCM Notification Toast Component
// ================================
function NotificationToast({ notification, onClose }) {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] max-w-sm w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-slide-down">
      <div className="flex items-start gap-3">
        <img
          src="https://res.cloudinary.com/dn5crslee/image/upload/v1768211566/20260108_135034_qj155b.png"
          className="w-10 h-10 rounded-xl object-contain flex-shrink-0"
          alt="KOB"
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
          className="text-gray-300 hover:text-gray-500 flex-shrink-0 text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// ================================
// Main App Content
// ================================
function AppContent() {
  const { user, loading } = useAuth();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    initFCM(user.uid);

    let unsubscribe;
    const setupListener = async () => {
      unsubscribe = await onForegroundMessage((payload) => {
        const { title, body } = payload.notification || {};
        setNotification({ title, body });
      });
    };

    setupListener();

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [user?.uid]);

  if (loading) {
    return (
      <PageLoader message="Initializing KOB Infrastructure..." show={true} />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8] text-[#2C1F0E]">
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />

      <TopBar />

      <main className="flex-grow pb-[72px] lg:pb-0">
        <Suspense fallback={<PageLoader message="Loading..." show={true} />}>
          <Routes>
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/alerts" element={<Alerts />} />

            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer — hidden on mobile */}
      <footer className="hidden lg:block">
        <Footer />
      </footer>

      {/* SupportWidget — hidden on mobile to avoid icon overlap */}
      <div className="hidden lg:block">
        <SupportWidget />
      </div>

      {/* BottomNav — mobile only, respects safe area */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
