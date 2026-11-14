/**
 * App.jsx — KOB Marketplace
 *
 * SURGICAL REPAIR v4
 * ✅ Restored AppBanner visibility rules.
 * ✅ Implemented reliable, multi-trigger sync for background notifications.
 * ✅ Sync now runs on auth load AND when app returns to foreground.
 * ✅ Added listener for real-time "Mark as Read" actions from Service Worker.
 */

import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./firebase/auth";
import { ProfileProvider } from "./contexts/ProfileContext";
import { db } from "./firebase/firebase";
import { doc, setDoc, serverTimestamp, runTransaction } from "firebase/firestore";
import AlertProvider from "./components/ui/AlertProvider";
import AppBanner from "./components/pwa/AppBanner";
import "./i18n";

// ========================================
// Layouts & Components
// ========================================
import TopBar from "./layouts/TopBar";
import Footer from "./layouts/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import BottomNav from "./components/BottomNav";
import SupportWidget from "./components/widgets/SupportWidget";
import { PageLoader } from "./components/ui";
import ScrollToTop from "./components/ScrollToTop";

// ========================================
// Services
// ========================================
import { initFCM, onForegroundMessage } from "./services/fcm";
import { runSync } from "./services/fcmSync"; // ✅ USE THE NEW FULL SYNC

// ========================================
// Lazy Loaded Pages (Preserved)
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
const Alerts = lazy(() => import("./pages/Alerts"));
const Profile = lazy(() => import("./pages/Profile"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const SellerShop = lazy(() => import("./pages/SellerShop"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Legal = lazy(() => import("./pages/Legal"));
const EthicalCommerce = lazy(() => import("./pages/EthicalCommercePage"));

// ========================================
// Notification Toast (Preserved)
// ========================================
function NotificationToast({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] max-w-sm w-[calc(100%-2rem)] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-slide-down">
      <div className="flex items-start gap-3">
        <img src="https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1780655200/logo512_xomyvi.png" alt="KOB official logo" className="w-10 h-10 rounded-xl object-contain flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#2C1F0E] mb-0.5">{notification.title}</p>
          <p className="text-xs text-gray-500 leading-relaxed">{notification.body}</p>
        </div>
        <button onClick={onClose} aria-label="Close notification" className="text-gray-300 hover:text-gray-500 flex-shrink-0 text-lg leading-none transition-colors">×</button>
      </div>
    </div>
  );
}

// ========================================
// Main App Content
// ========================================
function AppContent() {
  const { user, loading } = useAuth();
  const uid = user?.uid ?? null;
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // ========================================
  // ✅ RELIABLE SYNC: Auth Load + Foreground
  // ========================================
  useEffect(() => {
    if (uid) {
      // 1. Initialize FCM for the user
      initFCM(uid);
      // 2. Run sync on initial load
      runSync(uid);

      // 3. Set up a listener to re-sync when app returns to foreground
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          console.log("[KOB App] App became visible. Running sync.");
          runSync(uid);
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // 4. Clean up listener
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [uid]);

  // ========================================
  // ✅ REAL-TIME ACTION HANDLER: from Service Worker
  // ========================================
  useEffect(() => {
    if (!uid) return;

    const handleMessage = async (event) => {
        if (event.data?.type === 'MARK_AS_READ' && event.data?.messageId) {
            console.log("[KOB App] Received mark-as-read from SW for:", event.data.messageId);
            const notificationRef = doc(db, `users/${uid}/notifications/${event.data.messageId}`);
            try {
                await setDoc(notificationRef, { read: true, readAt: serverTimestamp() }, { merge: true });
                console.log("[KOB App] Updated notification from SW action.");
            } catch (error) {
                console.error("[KOB App] Error handling SW action:", error);
            }
        }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => navigator.serviceWorker.removeEventListener('message', handleMessage);

  }, [uid]);

  // ========================================
  // ✅ FOREGROUND MESSAGES: Preserved logic
  // ========================================
  useEffect(() => {
    if (!uid) return;
    const setupListener = async () => {
      try {
        return await onForegroundMessage(async (payload) => {
          if (!payload?.messageId) return;
          const title = payload.notification?.title || payload.data?.title || "KOB Notification";
          const body = payload.notification?.body || "";
          setNotification({ title, body });

          const docRef = doc(db, `users/${uid}/notifications`, payload.messageId);
          try {
            await runTransaction(db, async (transaction) => {
              const docSnap = await transaction.get(docRef);
              if (!docSnap.exists()) {
                transaction.set(docRef, {
                  title, body,
                  url: payload.data?.url || "/alerts",
                  type: payload.data?.type || "direct",
                  source: "fcm-foreground",
                  read: false,
                  createdAt: serverTimestamp(),
                  messageId: payload.messageId,
                });
              }
            });
            console.log("[KOB Alerts] Foreground FCM notification saved transactionally.");
          } catch (error) {
            console.error("[KOB Alerts] Foreground transaction failed:", error);
          }
        });
      } catch (error) {
        console.error("[KOB FCM] Foreground listener failed:", error);
      }
    };
    const unsubscribePromise = setupListener();
    return () => { unsubscribePromise.then(unsubscribe => unsubscribe && unsubscribe()); };
  }, [uid]);


  // ========================================
  // SCROLL & UI LOGIC (Preserved)
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const hideBottomNavRoutes = ["/profile", "/login", "/register"];
  const shouldHideBottomNav = hideBottomNavRoutes.includes(location.pathname);

  // ✅ RESTORED: App Banner visibility rules
  const hideBannerRoutes = ["/profile", "/login", "/register", "/dashboard", "/admin"];
  const shouldShowAppBanner = !hideBannerRoutes.some(path => location.pathname.startsWith(path));

  if (loading) {
    return <PageLoader message="Initializing KOB Infrastructure..." show={true} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8] text-[#2C1F0E] text-[95%] overflow-x-hidden pb-[84px] lg:pb-0">
      <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      {shouldShowAppBanner && <AppBanner />}
      <TopBar />

      <main className={`flex-grow transition-all duration-300 ${shouldHideBottomNav ? "pb-6" : "pb-[88px]"} lg:pb-0`}>
        <Suspense fallback={<PageLoader message="Loading..." show={true} />}>
          <ScrollToTop />
          <Routes>
            {/* All routes preserved */}
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
            <Route path="/legal" element={<Legal />} />
            <Route path="/ethical-commerce" element={<EthicalCommerce />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="block border-t border-gray-200/70 bg-[#FAFAF8]">
        <div className="lg:block pb-[90px] lg:pb-0"><Footer /></div>
      </footer>

      <div className="hidden lg:block"><SupportWidget /></div>

      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${shouldHideBottomNav ? "translate-y-full opacity-0 pointer-events-none" : showBottomNav ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
        <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200/70 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}

// ========================================
// Root App (Preserved)
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
