/**
 * SuccessModal.jsx — KOB Premium Success Feedback
 * Stripe / Paystack / Apple-style
 * Reusable for any success action in the app
 */

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SuccessModal({
  show,
  title = "Saved!",
  subtitle = "Your changes have been saved successfully.",
  onClose,
  autoClose = 3000,
}) {
  // Auto-dismiss
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, autoClose);
    return () => clearTimeout(t);
  }, [show, onClose, autoClose]);

  return (
    <AnimatePresence>
      {show && (
        // Backdrop
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center
            justify-center p-4
            bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 24 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
            }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl
              max-w-[320px] w-full p-8 text-center
              border border-gray-100"
          >
            {/* Animated success ring + icon */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Outer pulse ring */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="absolute inset-0 bg-emerald-100
                  rounded-full"
              />
              {/* Inner ring */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="absolute inset-3 bg-emerald-200
                  rounded-full"
              />
              {/* Icon circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 400,
                  damping: 18,
                }}
                className="absolute inset-5 bg-emerald-500
                  rounded-full flex items-center justify-center
                  shadow-lg shadow-emerald-500/40"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Text */}
            <motion.h3
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg font-bold text-[#2C1F0E] mb-2"
            >
              {title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-gray-400 mb-7
                leading-relaxed max-w-[220px] mx-auto"
            >
              {subtitle}
            </motion.p>

            {/* Auto-dismiss progress bar */}
            <div
              className="h-1 bg-gray-100 rounded-full
              overflow-hidden mb-5"
            >
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{
                  duration: autoClose / 1000,
                  ease: "linear",
                  delay: 0.3,
                }}
                className="h-full bg-emerald-400 rounded-full"
              />
            </div>

            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              onClick={onClose}
              className="w-full py-3.5 bg-emerald-500 text-white
                rounded-2xl text-sm font-bold tracking-wide
                hover:bg-emerald-600 transition-colors
                active:scale-[0.98]"
            >
              Done ✓
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
