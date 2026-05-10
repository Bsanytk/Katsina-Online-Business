/**
 * AuthModal.jsx — KOB Auth Gate for Protected Actions
 * Triggers when unauthenticated user tries to contact seller
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthModal({
  show,
  type = "message", // 'message' | 'whatsapp'
  shopUrl,
  onClose,
}) {
  function handleLogin() {
    sessionStorage.setItem("returnTo", shopUrl);
    // ✅ window.location forces full reload
    // ensures ProfileContext rehydrates correctly
    window.location.href = "/login";
  }

  function handleRegister() {
    sessionStorage.setItem("returnTo", shopUrl);
    window.location.href = "/register";
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center
            justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
            }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl
              max-w-sm w-full overflow-hidden"
          >
            {/* Header */}
            <div
              className="bg-[#4B3621] px-6 py-6
              text-center relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8
                  bg-white/15 rounded-full flex items-center
                  justify-center text-white/70
                  hover:bg-white/25 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Icon */}
              <div
                className="w-14 h-14 bg-white/15 rounded-2xl
                flex items-center justify-center mx-auto mb-3
                text-white"
              >
                {type === "whatsapp" ? (
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94
                    1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198
                    0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077
                    4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0
                      4.418-4.03 8-9 8a9.863 9.863 0
                      01-4.255-.949L3 20l1.395-3.72C3.512
                      15.042 3 13.574 3 12c0-4.418 4.03-8
                      9-8s9 3.582 9 8z"
                    />
                  </svg>
                )}
              </div>

              <h3 className="text-base font-bold text-white mb-1">
                {type === "whatsapp" ? "Contact on WhatsApp" : "Message Seller"}
              </h3>
              <p className="text-xs text-white/60">
                Sign in to contact this seller
              </p>
            </div>

            {/* Body */}
            <div className="p-6">
              <p
                className="text-sm text-gray-500 text-center
                mb-6 leading-relaxed"
              >
                Join KOB to connect directly with verified sellers across
                Katsina State.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleLogin}
                  className="w-full py-3.5 bg-[#4B3621]
                    text-white rounded-2xl text-sm font-bold
                    hover:bg-[#362818] transition-colors"
                >
                  Sign In to Continue
                </button>
                <button
                  onClick={handleRegister}
                  className="w-full py-3.5 border-2
                    border-[#4B3621] text-[#4B3621] rounded-2xl
                    text-sm font-bold hover:bg-[#4B3621]
                    hover:text-white transition-all"
                >
                  Create Free Account
                </button>
              </div>

              <p
                className="text-center text-[10px]
                text-gray-400 mt-4"
              >
                Free to join · No credit card required
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
