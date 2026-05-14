/**
 * Alert.jsx — KOB Standalone Alert Component
 *
 * BACKWARD COMPATIBLE:
 * ✅ Existing props preserved: type, title, children, autoDismiss, onDismiss
 * ✅ Works as drop-in replacement
 *
 * ADDED:
 * ✅ Framer Motion slide+fade animation
 * ✅ Progress bar auto-dismiss
 * ✅ Animated icon entrance
 * ✅ Glassmorphism effect
 * ✅ 5 variants + existing KOB types
 */

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence }     from 'framer-motion'

// ================================
// Extended type config
// Covers new + existing KOB types
// ================================
const VARIANTS = {
  // ✅ Existing types from KOB
  success: {
    bg:         'bg-white',
    border:     'border-emerald-200',
    iconBg:     'bg-emerald-500',
    titleColor: 'text-emerald-800',
    msgColor:   'text-emerald-700',
    barColor:   'bg-emerald-500',
    label:      'Success',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    bg:         'bg-white',
    border:     'border-red-200',
    iconBg:     'bg-red-500',
    titleColor: 'text-red-800',
    msgColor:   'text-red-700',
    barColor:   'bg-red-500',
    label:      'Error',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  warning: {
    bg:         'bg-white',
    border:     'border-amber-200',
    iconBg:     'bg-amber-500',
    titleColor: 'text-amber-800',
    msgColor:   'text-amber-700',
    barColor:   'bg-amber-400',
    label:      'Warning',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0
          001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0
          00-3.42 0z" />
      </svg>
    ),
  },
  info: {
    bg:         'bg-white',
    border:     'border-blue-200',
    iconBg:     'bg-blue-500',
    titleColor: 'text-blue-800',
    msgColor:   'text-blue-700',
    barColor:   'bg-blue-500',
    label:      'Info',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0
          11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  blocked: {
    bg:         'bg-white',
    border:     'border-[#4B3621]/30',
    iconBg:     'bg-[#4B3621]',
    titleColor: 'text-[#2C1F0E]',
    msgColor:   'text-[#4B3621]/80',
    barColor:   'bg-[#4B3621]',
    label:      'Blocked',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728
          12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
}

const DEFAULT_VARIANT = VARIANTS.info

// ================================
// Alert — backward compatible
// ================================
export default function Alert({
  // Existing props — preserved
  type,
  title,
  children,
  autoDismiss,
  onDismiss,
  className = '',

  // New optional props
  message,
  duration = 4500,
}) {
  const [visible, setVisible]   = useState(true)
  const [progress, setProgress] = useState(100)

  // Support both 'children' and 'message' prop
  const body = children || message || ''

  // Auto-dismiss — triggered by autoDismiss prop
  // or a numeric value (milliseconds) — backward compat
  const shouldDismiss  =
    autoDismiss === true  ||
    typeof autoDismiss === 'number'

  const dismissAfter =
    typeof autoDismiss === 'number'
      ? autoDismiss
      : duration

  useEffect(() => {
    if (!shouldDismiss) return

    const tick      = 50
    const decrement = (tick / dismissAfter) * 100

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p - decrement
        if (next <= 0) {
          clearInterval(interval)
          setVisible(false)
          setTimeout(() => onDismiss?.(), 250)
          return 0
        }
        return next
      })
    }, tick)

    return () => clearInterval(interval)
  }, [shouldDismiss, dismissAfter, onDismiss])

  function handleClose() {
    setVisible(false)
    setTimeout(() => onDismiss?.(), 250)
  }

  const cfg = VARIANTS[type] || DEFAULT_VARIANT

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,   scale: 1    }}
          exit={{    opacity: 0, y: -8,  scale: 0.97 }}
          transition={{
            type: 'spring', stiffness: 380, damping: 32,
          }}
          role="alert"
          aria-live="polite"
          className={`
            relative overflow-hidden rounded-2xl border
            shadow-md backdrop-blur-sm
            ${cfg.bg} ${cfg.border}
            ${className}
          `}
        >
          {/* Glass shimmer */}
          <div className="absolute inset-0 bg-gradient-to-br
            from-white/50 to-transparent pointer-events-none" />

          <div className="relative flex items-start gap-3 p-4">

            {/* Animated icon */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0   }}
              transition={{
                type: 'spring', stiffness: 300, damping: 18,
                delay: 0.05,
              }}
              className={`w-8 h-8 rounded-xl flex items-center
                justify-center text-white flex-shrink-0
                ${cfg.iconBg}`}
            >
              {cfg.icon}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              {title && (
                <p className={`text-sm font-bold leading-tight
                  mb-0.5 ${cfg.titleColor}`}>
                  {title}
                </p>
              )}
              {body && (
                <p className={`text-xs leading-relaxed
                  ${cfg.msgColor}`}>
                  {body}
                </p>
              )}
            </div>

            {/* Close button */}
            {onDismiss && (
              <button
                onClick={handleClose}
                className="flex-shrink-0 w-7 h-7 rounded-lg
                  flex items-center justify-center
                  text-gray-400 hover:text-gray-600
                  hover:bg-black/5 transition-colors
                  touch-manipulation"
                aria-label="Close"
              >
                <svg className="w-3.5 h-3.5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor"
                  strokeWidth={2.5}>
                  <path strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Progress bar */}
          {shouldDismiss && (
            <div className="h-0.5 bg-black/5">
              <div
                className={`h-full transition-none ${cfg.barColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
