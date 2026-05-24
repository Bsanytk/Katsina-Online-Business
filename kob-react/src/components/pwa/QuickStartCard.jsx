/**
 * QuickStartCard.jsx — KOB Marketplace Quick Start Section
 *
 * ✅ Helps first-time visitors understand KOB quickly
 * ✅ Clickable action cards with Lucide icons
 * ✅ Uses React Router Link — compatible with existing routing
 * ✅ WCAG AA accessible — keyboard navigable
 * ✅ Mobile-first, premium KOB branding
 * ✅ React.memo — avoids unnecessary re-renders
 * ✅ No breaking changes to existing architecture
 */

import React, { memo } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Store,
  UserPlus,
  BadgeCheck,
  HeadphonesIcon,
  BookOpen,
  ChevronRight,
} from "lucide-react";

// ─────────────────────────────────────────────
// Quick Action Data
// External link = { href } | Internal = { to }
// ─────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    id: "browse",
    icon: ShoppingBag,
    title: "Browse Marketplace",
    description: "Explore thousands of local products",
    to: "/marketplace",
    accent: "#4B3621",
    bg: "bg-[#4B3621]/6",
    iconColor: "text-[#4B3621]",
  },
  {
    id: "shops",
    icon: Store,
    title: "Open Seller Shops",
    description: "Visit verified business stores",
    to: "/marketplace",
    accent: "#D4AF37",
    bg: "bg-[#D4AF37]/10",
    iconColor: "text-[#b8941f]",
  },
  {
    id: "register",
    icon: UserPlus,
    title: "Create Account",
    description: "Join the KOB community today",
    to: "/register",
    accent: "#059669",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-700",
  },
  {
    id: "verify",
    icon: BadgeCheck,
    title: "Become Verified Seller",
    description: "Start selling on KOB Marketplace",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSfFfwnt78a-GnE7g8HTpY8MrcFz2K_WjPjLhPCQPAWoUi6muA/viewform",
    accent: "#2563eb",
    bg: "bg-blue-50",
    iconColor: "text-blue-700",
  },
  {
    id: "support",
    icon: HeadphonesIcon,
    title: "Contact Support",
    description: "We're here to help you",
    to: "/contact",
    accent: "#7c3aed",
    bg: "bg-violet-50",
    iconColor: "text-violet-700",
  },
  {
    id: "how",
    icon: BookOpen,
    title: "How KOB Works",
    description: "Learn about our marketplace",
    to: "/faq",
    accent: "#0891b2",
    bg: "bg-cyan-50",
    iconColor: "text-cyan-700",
  },
];

// ─────────────────────────────────────────────
// Single Card
// ─────────────────────────────────────────────
const ActionCard = memo(function ActionCard({
  icon: Icon,
  title,
  description,
  to,
  href,
  bg,
  iconColor,
}) {
  const content = (
    <div
      className="
        flex items-center gap-3
        p-4 rounded-2xl
        bg-white border border-gray-100
        shadow-sm
        hover:shadow-md hover:border-gray-200
        hover:-translate-y-0.5
        active:scale-[0.98]
        transition-all duration-200
        group cursor-pointer
        focus-within:ring-2 focus-within:ring-[#4B3621]
        focus-within:ring-offset-2
      "
    >
      {/* Icon container */}
      <div
        className={`
          flex-shrink-0 w-11 h-11 rounded-xl
          ${bg}
          flex items-center justify-center
          transition-transform duration-200
          group-hover:scale-110
        `}
        aria-hidden="true"
      >
        <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#2C1F0E] leading-tight">
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug truncate">
          {description}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight
        className="w-4 h-4 text-gray-300 flex-shrink-0
          group-hover:text-[#4B3621] group-hover:translate-x-0.5
          transition-all duration-200"
        aria-hidden="true"
      />
    </div>
  );

  // External link
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${title} — ${description} (opens in new tab)`}
        className="block focus:outline-none"
      >
        {content}
      </a>
    );
  }

  // Internal React Router link
  return (
    <Link
      to={to}
      aria-label={`${title} — ${description}`}
      className="block focus:outline-none"
    >
      {content}
    </Link>
  );
});

// ─────────────────────────────────────────────
// QuickStartCard Section
// ─────────────────────────────────────────────
const QuickStartCard = memo(function QuickStartCard() {
  return (
    <section aria-labelledby="quickstart-heading" className="px-4 py-6 sm:px-6">
      {/* Section header */}
      <div className="mb-5">
        <h2
          id="quickstart-heading"
          className="text-lg font-bold text-[#2C1F0E]"
        >
          Quick Start
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Everything you need to get started on KOB
        </p>
      </div>

      {/* Cards grid */}
      <div
        className="
          grid grid-cols-1 gap-3
          sm:grid-cols-2
        "
        role="list"
      >
        {QUICK_ACTIONS.map((action) => (
          <div key={action.id} role="listitem">
            <ActionCard {...action} />
          </div>
        ))}
      </div>
    </section>
  );
});

export default QuickStartCard;
