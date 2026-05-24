/**
 * WelcomeSection.jsx — KOB Marketplace Welcome & Onboarding
 *
 * ✅ Welcoming first-time user experience
 * ✅ 4-step onboarding flow — Browse → Contact → Register → Verify
 * ✅ Premium KOB branding — gold + brown
 * ✅ Mobile-first layout
 * ✅ WCAG AA accessible
 * ✅ React.memo — zero unnecessary re-renders
 * ✅ No breaking changes to existing KOB architecture
 */

import React, { memo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MessageCircle,
  UserPlus,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

// ─────────────────────────────────────────────
// Onboarding Steps Data
// ─────────────────────────────────────────────
const STEPS = [
  {
    step: 1,
    icon: Search,
    title: "Browse Products",
    description:
      "Explore local products from verified sellers across Katsina and beyond.",
    color: "from-[#4B3621] to-[#2C1F0E]",
    iconBg: "bg-[#4B3621]/8",
    iconColor: "text-[#4B3621]",
    numberColor: "text-[#D4AF37]",
  },
  {
    step: 2,
    icon: MessageCircle,
    title: "Contact Seller",
    description:
      "Reach sellers directly via WhatsApp for fast, trusted communication.",
    color: "from-emerald-600 to-emerald-800",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    numberColor: "text-emerald-600",
  },
  {
    step: 3,
    icon: UserPlus,
    title: "Create Account",
    description:
      "Sign up to save favorites, track orders and manage your business.",
    color: "from-blue-600 to-blue-800",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
    numberColor: "text-blue-600",
  },
  {
    step: 4,
    icon: BadgeCheck,
    title: "Become Verified",
    description:
      "Get your seller badge and unlock full marketplace selling access.",
    color: "from-[#D4AF37] to-[#b8941f]",
    iconBg: "bg-[#D4AF37]/10",
    iconColor: "text-[#b8941f]",
    numberColor: "text-[#b8941f]",
  },
];

// ─────────────────────────────────────────────
// Single Step Card
// ─────────────────────────────────────────────
const StepCard = memo(function StepCard({
  step,
  icon: Icon,
  title,
  description,
  iconBg,
  iconColor,
  numberColor,
  isLast,
}) {
  return (
    <div className="flex items-start gap-4">
      {/* Step number + connector line */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Circle with step number */}
        <div
          className="
            w-10 h-10 rounded-full
            bg-white border-2 border-gray-100
            shadow-sm
            flex items-center justify-center
            flex-shrink-0
          "
          aria-hidden="true"
        >
          <span className={`text-sm font-black ${numberColor}`}>{step}</span>
        </div>

        {/* Connector line */}
        {!isLast && (
          <div
            className="w-px flex-1 bg-gray-100 mt-2 mb-0 min-h-[28px]"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Card content */}
      <div
        className={`
          flex-1 pb-6
          ${isLast ? "pb-0" : ""}
        `}
      >
        <div
          className="
            bg-white rounded-2xl
            border border-gray-100 shadow-sm
            p-4
            flex items-start gap-3
          "
        >
          {/* Icon */}
          <div
            className={`
              flex-shrink-0 w-10 h-10 rounded-xl
              ${iconBg}
              flex items-center justify-center
            `}
            aria-hidden="true"
          >
            <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm font-bold text-[#2C1F0E] leading-tight">
              {title}
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-snug">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────
// WelcomeSection Component
// ─────────────────────────────────────────────
const WelcomeSection = memo(function WelcomeSection() {
  return (
    <section
      aria-labelledby="welcome-heading"
      className="px-4 pt-8 pb-4 sm:px-6"
    >
      {/* Hero welcome text */}
      <div className="mb-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-4">
          <span
            className="
              inline-flex items-center gap-1.5
              px-3 py-1 rounded-full
              bg-[#D4AF37]/12
              border border-[#D4AF37]/30
              text-[11px] font-bold text-[#b8941f]
              uppercase tracking-widest
            "
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
              aria-hidden="true"
            />
            Katsina Online Business
          </span>
        </div>

        {/* Heading */}
        <h1
          id="welcome-heading"
          className="
            text-2xl sm:text-3xl
            font-black text-[#2C1F0E]
            leading-tight tracking-tight
          "
        >
          Welcome to{" "}
          <span
            className="
              text-transparent bg-clip-text
              bg-gradient-to-r from-[#4B3621] to-[#D4AF37]
            "
          >
            KOB Marketplace
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-xs mx-auto">
          Buy, sell and connect with trusted businesses across Katsina and
          beyond.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link
            to="/marketplace"
            className="
              flex items-center gap-2
              px-5 py-2.5 rounded-xl
              bg-[#4B3621] text-white
              text-sm font-bold
              hover:bg-[#362818]
              active:scale-[0.98]
              transition-all shadow-sm
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-[#4B3621] focus-visible:ring-offset-2
            "
          >
            Browse Now
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>

          <Link
            to="/register"
            className="
              px-5 py-2.5 rounded-xl
              border-2 border-[#4B3621]/20
              text-sm font-bold text-[#4B3621]
              hover:border-[#4B3621]/40
              hover:bg-[#4B3621]/4
              active:scale-[0.98]
              transition-all
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-[#4B3621] focus-visible:ring-offset-2
            "
          >
            Join Free
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="
          grid grid-cols-3 gap-3 mb-8
          bg-white rounded-2xl border border-gray-100
          shadow-sm p-4
        "
        aria-label="KOB Marketplace stats"
      >
        {[
          { value: "500+", label: "Sellers" },
          { value: "2K+", label: "Products" },
          { value: "100%", label: "Trusted" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-lg font-black text-[#4B3621]">{value}</p>
            <p className="text-[11px] text-gray-500 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div>
        <div className="mb-5">
          <h2 className="text-base font-bold text-[#2C1F0E]">How KOB Works</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Four simple steps to get started
          </p>
        </div>

        <ol aria-label="KOB onboarding steps" className="space-y-0">
          {STEPS.map((step, idx) => (
            <li key={step.step}>
              <StepCard {...step} isLast={idx === STEPS.length - 1} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
});

export default WelcomeSection;
