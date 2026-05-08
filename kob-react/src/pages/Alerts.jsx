import React, { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

// ================================
// SVG Icons
// ================================
const Icons = {
  Bell: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118
        14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0
        10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0
        .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0
        11-6 0v-1m6 0H9"
      />
    </svg>
  ),
  Info: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0
        11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Warning: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0
        2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464
        0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  Success: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Update: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582
        9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0
        01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
  Delivery: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4
        7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  ),
  Back: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  ),
  Empty: () => (
    <svg
      className="w-14 h-14"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118
        14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0
        10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0
        .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0
        11-6 0v-1m6 0H9"
      />
    </svg>
  ),
};

// ================================
// Alert type config
// ================================
const TYPE_CONFIG = {
  info: {
    icon: <Icons.Info />,
    bg: "bg-blue-50",
    iconBg: "bg-blue-500",
    border: "border-blue-100",
    label: "Info",
    labelColor: "text-blue-600 bg-blue-50",
  },
  warning: {
    icon: <Icons.Warning />,
    bg: "bg-amber-50",
    iconBg: "bg-amber-500",
    border: "border-amber-100",
    label: "Warning",
    labelColor: "text-amber-700 bg-amber-50",
  },
  success: {
    icon: <Icons.Success />,
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-500",
    border: "border-emerald-100",
    label: "Success",
    labelColor: "text-emerald-700 bg-emerald-50",
  },
  update: {
    icon: <Icons.Update />,
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
    border: "border-purple-100",
    label: "Update",
    labelColor: "text-purple-700 bg-purple-50",
  },
  delivery: {
    icon: <Icons.Delivery />,
    bg: "bg-[#4B3621]/5",
    iconBg: "bg-[#4B3621]",
    border: "border-[#4B3621]/10",
    label: "Delivery",
    labelColor: "text-[#4B3621] bg-[#4B3621]/8",
  },
  broadcast: {
    icon: <Icons.Bell />,
    bg: "bg-[#D4AF37]/5",
    iconBg: "bg-[#D4AF37]",
    border: "border-[#D4AF37]/20",
    label: "Broadcast",
    labelColor: "text-[#4B3621] bg-[#D4AF37]/15",
  },
};

const DEFAULT_TYPE = TYPE_CONFIG.broadcast;

// ================================
// Date formatter
// ================================
function formatDate(timestamp) {
  if (!timestamp) return "";

  const date = timestamp?.toDate?.() ? timestamp.toDate() : new Date(timestamp);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const alertDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (alertDay.getTime() === today.getTime()) {
    return `Today · ${date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  if (alertDay.getTime() === yesterday.getTime()) {
    return `Yesterday · ${date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// ================================
// Group alerts by date label
// ================================
function groupByDate(alerts) {
  const groups = {};
  alerts.forEach((alert) => {
    const date = alert.createdAt?.toDate?.()
      ? alert.createdAt.toDate()
      : new Date(alert.createdAt);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const alertDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    let key;
    if (alertDay.getTime() === today.getTime()) {
      key = "Today";
    } else if (alertDay.getTime() === yesterday.getTime()) {
      key = "Yesterday";
    } else {
      key = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(alert);
  });
  return groups;
}

// ================================
// Single Alert Card
// ================================
function AlertCard({ alert }) {
  const type = alert.type?.toLowerCase() || "broadcast";
  const config = TYPE_CONFIG[type] || DEFAULT_TYPE;

  return (
    <div
      className={`
      relative bg-white rounded-2xl border
      shadow-sm hover:shadow-md transition-all
      duration-200 overflow-hidden
      ${config.border}
    `}
    >
      {/* Left accent bar */}
      <div
        className={`
        absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl
        ${config.iconBg}
      `}
      />

      <div className="pl-5 pr-5 py-4">
        <div className="flex items-start gap-3.5">
          {/* Icon */}
          <div
            className={`
            w-9 h-9 rounded-xl flex items-center
            justify-center text-white flex-shrink-0
            ${config.iconBg}
          `}
          >
            {config.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div
              className="flex items-start
              justify-between gap-2 mb-1"
            >
              <h3
                className="text-sm font-semibold
                text-[#2D1E17] leading-snug"
              >
                {alert.title || "KOB Notification"}
              </h3>
              <span
                className={`
                flex-shrink-0 text-[9px] font-bold
                uppercase tracking-wider px-2 py-0.5
                rounded-full
                ${config.labelColor}
              `}
              >
                {config.label}
              </span>
            </div>

            {/* Body */}
            {alert.body && (
              <p
                className="text-xs text-gray-500
                leading-relaxed mb-2.5"
              >
                {alert.body}
              </p>
            )}

            {/* Footer */}
            <div
              className="flex items-center
              justify-between gap-3"
            >
              <span
                className="text-[10px] text-gray-400
                font-medium"
              >
                {formatDate(alert.createdAt)}
              </span>

              {/* Learn More */}
              {alert.url && (
                <a
                  href={alert.url}
                  target={alert.url.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="flex items-center gap-1
                    text-[10px] font-bold text-[#4B3621]
                    hover:text-[#D4AF37] transition-colors
                    flex-shrink-0"
                >
                  Learn More
                  <Icons.ArrowRight />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================
// Loading Skeleton
// ================================
function AlertSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl border
      border-gray-100 shadow-sm overflow-hidden"
    >
      <div
        className="absolute left-0 top-0 bottom-0
        w-1 bg-gray-200 rounded-l-2xl"
      />
      <div className="pl-5 pr-5 py-4">
        <div className="flex items-start gap-3.5">
          <div
            className="w-9 h-9 rounded-xl bg-gray-200
            animate-pulse flex-shrink-0"
          />
          <div className="flex-1 space-y-2">
            <div
              className="h-3.5 bg-gray-200 rounded-lg
              animate-pulse w-3/4"
            />
            <div
              className="h-3 bg-gray-100 rounded-lg
              animate-pulse w-full"
            />
            <div
              className="h-3 bg-gray-100 rounded-lg
              animate-pulse w-2/3"
            />
            <div
              className="h-2.5 bg-gray-100 rounded-lg
              animate-pulse w-1/4 mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================
// Empty State
// ================================
function EmptyState() {
  return (
    <div
      className="flex flex-col items-center
      justify-center py-20 text-center"
    >
      <div
        className="w-20 h-20 bg-[#4B3621]/5 rounded-3xl
        flex items-center justify-center mb-5 text-gray-300"
      >
        <Icons.Empty />
      </div>
      <h3
        className="text-base font-semibold
        text-[#2D1E17] mb-1.5"
      >
        No alerts yet
      </h3>
      <p
        className="text-xs text-gray-400 max-w-xs
        leading-relaxed"
      >
        You're all caught up! Important announcements, updates, and delivery
        alerts will appear here.
      </p>
    </div>
  );
}

// ================================
// Main Alerts Page
// ================================
export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ================================
  // Real-time Firestore listener
  // ================================
  useEffect(() => {
    const q = query(collection(db, "broadcasts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          // Normalize — sentAt or createdAt
          createdAt: d.data().sentAt || d.data().createdAt,
        }));
        setAlerts(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Alerts fetch error:", err);
        setError("Failed to load alerts.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const grouped = groupByDate(alerts);
  const dateKeys = Object.keys(grouped);

  return (
    <main className="min-h-screen bg-[#F9F9F7]">
      {/* ================================ */}
      {/* HEADER                           */}
      {/* ================================ */}
      <div
        className="sticky top-0 z-30 bg-[#F9F9F7]/95
        backdrop-blur-md border-b border-gray-100"
      >
        <div
          className="max-w-xl mx-auto px-4 py-4
          flex items-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center
              rounded-xl border border-gray-200 bg-white
              text-gray-500 hover:text-[#4B3621]
              hover:border-[#4B3621] transition-all
              flex-shrink-0"
          >
            <Icons.Back />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-[#2D1E17]">Alerts</h1>
            <p className="text-[10px] text-gray-400">
              {loading
                ? "Loading..."
                : alerts.length > 0
                ? `${alerts.length} notification${
                    alerts.length !== 1 ? "s" : ""
                  }`
                : "No notifications"}
            </p>
          </div>

          {/* Unread dot — shows when there are alerts */}
          {alerts.length > 0 && (
            <div
              className="w-9 h-9 flex items-center
              justify-center text-[#4B3621]"
            >
              <div className="relative">
                <Icons.Bell />
                <span
                  className="absolute -top-1 -right-1
                  w-2.5 h-2.5 bg-[#D4AF37] rounded-full
                  border-2 border-[#F9F9F7]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================ */}
      {/* CONTENT                          */}
      {/* ================================ */}
      <div
        className="max-w-xl mx-auto px-4 py-6
        pb-24 lg:pb-8"
      >
        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative">
                <AlertSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="py-12 text-center">
            <div
              className="w-14 h-14 bg-red-50 rounded-2xl
              flex items-center justify-center mx-auto mb-4"
            >
              <svg
                className="w-7 h-7 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0
                  2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464
                  0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Couldn't load alerts
            </p>
            <p className="text-xs text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-[#4B3621] text-white
                rounded-xl text-xs font-semibold
                hover:bg-[#362818] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && alerts.length === 0 && <EmptyState />}

        {/* Alerts grouped by date */}
        {!loading &&
          !error &&
          dateKeys.map((dateKey) => (
            <div key={dateKey} className="mb-6">
              {/* Date label */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-[10px] font-bold uppercase
                tracking-widest text-gray-400"
                >
                  {dateKey}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {grouped[dateKey].map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
