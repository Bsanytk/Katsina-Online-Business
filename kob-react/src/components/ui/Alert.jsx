import React, { useEffect, useState } from "react";

/**
 * Professional Alert Component - KOB Design System
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 * @param {string} title - Optional heading
 * @param {boolean} dismissible - Show close button (default: true)
 * @param {function} onDismiss - Callback when dismissed
 * @param {number} autoDismiss - Auto dismiss after N milliseconds (optional)
 * @param {string} className - Extra classes
 */
export default function Alert({
  children,
  type = "info",
  dismissible = true,
  onDismiss,
  autoDismiss,
  className = "",
  title,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  // Auto dismiss timer
  useEffect(() => {
    if (!autoDismiss) return;
    const timer = setTimeout(() => handleDismiss(), autoDismiss);
    return () => clearTimeout(timer);
  }, [autoDismiss]);

  function handleDismiss() {
    // Animate out before removing
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
  }

  if (!isVisible) return null;

  // Design tokens per type
  const config = {
    success: {
      container: "bg-emerald-50 border-emerald-500",
      icon_bg: "bg-emerald-500",
      title: "text-emerald-800",
      body: "text-emerald-700",
      dismiss: "text-emerald-500 hover:bg-emerald-100",
      icon: (
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    error: {
      container: "bg-red-50 border-red-500",
      icon_bg: "bg-red-500",
      title: "text-red-800",
      body: "text-red-700",
      dismiss: "text-red-400 hover:bg-red-100",
      icon: (
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
    },
    warning: {
      container: "bg-amber-50 border-amber-500",
      icon_bg: "bg-amber-500",
      title: "text-amber-800",
      body: "text-amber-700",
      dismiss: "text-amber-400 hover:bg-amber-100",
      icon: (
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 
              18a2 2 0 001.71 3h16.94a2 2 0 
              001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
      ),
    },
    info: {
      container: "bg-blue-50 border-blue-500",
      icon_bg: "bg-blue-500",
      title: "text-blue-800",
      body: "text-blue-700",
      dismiss: "text-blue-400 hover:bg-blue-100",
      icon: (
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 
              12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const c = config[type] || config.info;

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-4 p-4 rounded-xl border-l-4 shadow-sm
        transition-all duration-300
        ${
          isLeaving
            ? "opacity-0 -translate-y-2 scale-95"
            : "opacity-100 translate-y-0 scale-100"
        }
        ${c.container}
        ${className}
      `}
    >
      {/* Icon Circle */}
      <div
        className={`
        flex-shrink-0 w-8 h-8 rounded-full 
        flex items-center justify-center shadow-sm
        ${c.icon_bg}
      `}
      >
        {c.icon}
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        {title && (
          <p className={`font-bold text-sm mb-0.5 ${c.title}`}>{title}</p>
        )}
        <div className={`text-sm leading-relaxed ${c.body}`}>{children}</div>
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className={`
            flex-shrink-0 p-1.5 rounded-lg 
            transition-colors duration-150
            ${c.dismiss}
          `}
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
      )}
    </div>
  );
}
