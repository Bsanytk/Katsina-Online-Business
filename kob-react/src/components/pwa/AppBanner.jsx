/**
 * AppBanner.jsx — KOB Marketplace PWA Smart Install Banner
 *
 * ✅ Captures beforeinstallprompt safely
 * ✅ Detects already-installed state (standalone / navigator.standalone)
 * ✅ Persists dismiss via localStorage
 * ✅ Cleans up all event listeners on unmount
 * ✅ Premium KOB brand UI — mobile-first
 * ✅ WCAG AA accessible
 * ✅ Zero breaking changes to existing KOB architecture
 *
 * NEW v2:
 * ✅ isMarkedInstalled() — checks kob_pwa_manually_installed key
 * ✅ Triple guard: isAppInstalled() || wasDismissed() || isMarkedInstalled()
 * ✅ handleMarkAsInstalled — sets key + hides banner
 * ✅ "Already Installed" button replaces "Not Now"
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
} from "react";
import { Download, X, Zap, Bell, ShoppingBag } from "lucide-react";

// ─────────────────────────────────────────────
// Storage Keys
// ─────────────────────────────────────────────
const DISMISS_KEY   = "kob_banner_dismissed";
const INSTALLED_KEY = "kob_pwa_manually_installed"; // NEW

// ─────────────────────────────────────────────
// Helper: Detect installed PWA via browser API
// Covers Chrome/Android (display-mode: standalone)
// and Safari iOS (navigator.standalone)
// ─────────────────────────────────────────────
function isAppInstalled() {
  const standaloneMedia = window.matchMedia?.(
    "(display-mode: standalone)"
  )?.matches;
  const iosStandalone = navigator?.standalone === true;
  return standaloneMedia || iosStandalone;
}

// ─────────────────────────────────────────────
// Helper: Check if user previously dismissed banner
// ─────────────────────────────────────────────
function wasDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === "true";
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────
// NEW Helper: Check if user manually marked as installed
// Covers: app installed via another browser/path,
// or site data cleared but app still on device.
// ─────────────────────────────────────────────
function isMarkedInstalled() {
  try {
    return localStorage.getItem(INSTALLED_KEY) === "true";
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────
// Feature Pills
// ─────────────────────────────────────────────
const FEATURES = [
  { icon: Zap,         label: "Faster Access"  },
  { icon: Bell,        label: "Notifications"  },
  { icon: ShoppingBag, label: "Offline Ready"  },
];

// ─────────────────────────────────────────────
// AppBanner Component
// ─────────────────────────────────────────────
const AppBanner = memo(function AppBanner() {
  const deferredPromptRef = useRef(null);
  const [visible,    setVisible]    = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installed,  setInstalled]  = useState(false);

  // ─────────────────────────────────────────
  // Effect: Listen for beforeinstallprompt
  //
  // UPDATED guard — triple check:
  //   1. isAppInstalled()    — browser API detection
  //   2. wasDismissed()      — user dismissed before
  //   3. isMarkedInstalled() — user manually flagged
  // Any one true → banner never shows
  // ─────────────────────────────────────────
  useEffect(() => {
    if (isAppInstalled() || wasDismissed() || isMarkedInstalled()) return;

    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      deferredPromptRef.current = e;
      setVisible(true);
    }

    function handleAppInstalled() {
      setVisible(false);
      deferredPromptRef.current = null;
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled",        handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled",        handleAppInstalled);
    };
  }, []);

  // ─────────────────────────────────────────
  // Handler: Install button — unchanged
  // ─────────────────────────────────────────
  const handleInstall = useCallback(async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;

    setInstalling(true);
    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") {
        console.log("PWA Install Accepted");
        setInstalled(true);
        setTimeout(() => setVisible(false), 1800);
      }
    } catch (err) {
      console.warn("PWA install prompt error:", err);
    } finally {
      deferredPromptRef.current = null;
      setInstalling(false);
    }
  }, []);

  // ─────────────────────────────────────────
  // Handler: Dismiss — unchanged
  // ─────────────────────────────────────────
  const handleDismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // localStorage may be unavailable
    }
    setVisible(false);
    deferredPromptRef.current = null;
  }, []);

  // ─────────────────────────────────────────
  // NEW Handler: Mark as already installed
  //
  // For users who have the app installed via
  // another browser/path, or cleared site data.
  // Sets kob_pwa_manually_installed → hides banner
  // permanently until key is cleared.
  // ─────────────────────────────────────────
  const handleMarkAsInstalled = useCallback(() => {
    try {
      localStorage.setItem(INSTALLED_KEY, "true");
    } catch {
      // localStorage may be unavailable
    }
    setVisible(false);
    deferredPromptRef.current = null;
  }, []);

  if (!visible) return null;

  return (
    <div
      role="banner"
      aria-label="Install KOB Marketplace app"
      className="
        fixed bottom-[72px] left-0 right-0 z-30
        px-3 pb-3
        lg:bottom-auto lg:top-4 lg:right-4 lg:left-auto
        lg:max-w-sm lg:px-0 lg:pb-0
      "
    >
      <div
        className="
          relative overflow-hidden
          bg-white/95 backdrop-blur-xl
          border border-[#D4AF37]/30
          rounded-2xl shadow-2xl shadow-black/10
          p-4 sm:p-5
        "
      >
        {/* Gold accent top bar */}
        <div
          className="
            absolute top-0 left-0 right-0 h-[3px]
            bg-gradient-to-r from-[#D4AF37] via-[#f0cc5a] to-[#D4AF37]
          "
          aria-hidden="true"
        />

        {/* Dismiss button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install banner"
          className="
            absolute top-3 right-3
            w-7 h-7 rounded-full
            flex items-center justify-center
            text-gray-400 hover:text-gray-600
            hover:bg-gray-100
            transition-colors
            focus:outline-none focus-visible:ring-2
            focus-visible:ring-[#4B3621]
          "
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Main content */}
        <div className="flex items-start gap-4 pr-6">
          {/* KOB Logo mark */}
          <div
            aria-hidden="true"
            className="
              flex-shrink-0
              w-12 h-12 rounded-xl
              bg-gradient-to-br from-[#4B3621] to-[#2C1F0E]
              flex items-center justify-center
              shadow-md
            "
          >
            <img
              src="https://res.cloudinary.com/dn5crslee/image/upload/r_max/v1780655200/logo512_xomyvi.png"
              alt="KOB Marketplace"
              className="w-10 h-10 object-contain"
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#2C1F0E] leading-tight">
              KOB Marketplace
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">
              Install for faster access, notifications and a better marketplace
              experience.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {FEATURES.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="
                    inline-flex items-center gap-1
                    px-2 py-0.5
                    bg-[#4B3621]/6 rounded-full
                    text-[10px] font-semibold text-[#4B3621]
                  "
                >
                  <Icon className="w-2.5 h-2.5" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-4">

          {/* Primary — Install */}
          <button
            type="button"
            onClick={handleInstall}
            disabled={installing || installed}
            aria-label={installed ? "App installed" : "Install KOB app"}
            className="
              flex-1 flex items-center justify-center gap-2
              px-4 py-2.5 rounded-xl
              bg-[#4B3621] text-white
              text-xs font-bold
              hover:bg-[#362818]
              active:scale-[0.98]
              transition-all
              disabled:opacity-70 disabled:cursor-not-allowed
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-[#4B3621] focus-visible:ring-offset-2
            "
          >
            {installed ? (
              <>
                <span
                  className="w-3.5 h-3.5 rounded-full bg-[#D4AF37]
                    flex items-center justify-center"
                  aria-hidden="true"
                >
                  ✓
                </span>
                Installed!
              </>
            ) : installing ? (
              <>
                <div
                  className="w-3.5 h-3.5 border-2
                    border-white/40 border-t-white
                    rounded-full animate-spin"
                  aria-hidden="true"
                />
                Installing...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                Install App
              </>
            )}
          </button>

          {/* Secondary — Already Installed (was "Not Now") */}
          <button
            type="button"
            onClick={handleMarkAsInstalled}
            aria-label="I already have the app installed"
            className="
              px-3 py-2.5 rounded-xl
              border-2 border-gray-200
              text-[11px] font-semibold text-gray-500
              hover:border-gray-300 hover:text-gray-700
              active:scale-[0.98]
              transition-all
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-gray-400 focus-visible:ring-offset-2
            "
          >
            Already Installed
          </button>

        </div>
      </div>
    </div>
  );
});

export default AppBanner;
              
