/**
 * Terms.jsx — KOB Marketplace Terms of Service
 * Professional, trust-centered legal page
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";

// ================================
// Brand constants
// ================================
const BRAND = {
  brown: "#4B3621",
  gold: "#D4AF37",
  cream: "#F5EDD9",
  dark: "#2C1F0E",
};

const VERSION = {
  terms: "KOB-TV-1.0.0",
  updated: "May 13, 2026",
};

// ================================
// Terms sections data
// ================================
const SECTIONS = [
  {
    title: "Acceptance of Terms",
    icon: "📋",
    body: `By accessing or using KOB Marketplace, you confirm
      that you have read, understood, and agree to be bound by
      these Terms of Service. If you do not agree, you must
      discontinue use of the platform immediately. Use of KOB
      implies full acceptance of these terms and any future
      amendments.`,
  },
  {
    title: "User Accounts & Registration",
    icon: "👤",
    body: `You must register an account to buy or sell on KOB.
      You agree to provide accurate and complete information
      during registration and to keep your credentials secure.
      You are responsible for all activity that occurs under
      your account. KOB reserves the right to suspend accounts
      that provide false information.`,
  },
  {
    title: "Seller Responsibilities",
    icon: "🏪",
    body: `Sellers must provide honest and accurate product
      listings, including correct descriptions, images, and
      pricing. Sellers must respond to buyer inquiries
      promptly. Misrepresentation, fake products, or deceptive
      listings are strictly prohibited and may result in
      permanent account termination.`,
  },
  {
    title: "Buyer Responsibilities",
    icon: "🛍️",
    body: `Buyers agree to transact in good faith, inspect
      items before finalizing purchases where possible, and
      report suspicious activity to KOB Support. Buyers must
      not attempt to defraud sellers or misuse the platform's
      messaging or payment systems.`,
  },
  {
    title: "Prohibited Activities",
    icon: "🚫",
    body: `Users must not engage in: fraudulent transactions,
      spamming, harassment, sale of illegal goods, intellectual
      property infringement, or any activity that damages the
      KOB community. Violations will result in immediate
      account suspension or permanent removal.`,
  },
  {
    title: "Marketplace Safety",
    icon: "🛡️",
    body: `KOB encourages all users to verify sellers before
      transacting, inspect products carefully, avoid suspicious
      payment requests, and report fraudulent listings
      immediately to our Safety Team. Buyer protection is a
      core commitment of the KOB Marketplace.`,
  },
  {
    title: "Fraud Prevention",
    icon: "⚠️",
    body: `KOB maintains zero tolerance toward scams,
      impersonation, fake product listings, misleading
      descriptions, and fraudulent transactions. Our Safety
      Team actively monitors the platform. Accounts violating
      trust policies may be permanently removed without
      notice.`,
  },
  {
    title: "Account Suspension & Termination",
    icon: "🔒",
    body: `KOB reserves the right to suspend, restrict, or
      permanently terminate accounts that violate marketplace
      rules, safety policies, community standards, or
      applicable laws. Termination decisions are final and at
      KOB's sole discretion. Users may appeal by contacting
      our Compliance Team.`,
  },
  {
    title: "Intellectual Property",
    icon: "©️",
    body: `All content on KOB — including logos, design
      elements, and software — is protected by copyright and
      intellectual property law. Users may not reproduce,
      distribute, or create derivative works without written
      permission from KOB.`,
  },
  {
    title: "Limitation of Liability",
    icon: "⚖️",
    body: `KOB provides the marketplace platform as-is. We are
      not liable for transactions, disputes, or losses arising
      from user interactions. KOB does not guarantee the
      accuracy of listings or the conduct of individual users.
      Use of the platform is at your own risk.`,
  },
  {
    title: "Changes to Terms",
    icon: "📝",
    body: `KOB may update these Terms periodically. Continued
      use of the platform after changes constitutes acceptance
      of the updated Terms. We will notify users of significant
      changes via email or in-app notifications where
      possible.`,
  },
  {
    title: "Contact & Disputes",
    icon: "📞",
    body: `For legal inquiries, disputes, or compliance
      concerns, contact the KOB Legal & Compliance Team via
      WhatsApp or email. We aim to resolve disputes within 5–10
      business days. KOB encourages amicable resolution before
      formal proceedings.`,
  },
];

const TRUST_BADGES = [
  { icon: "✅", label: "Buyer Protection", desc: "Transactions monitored" },
  { icon: "🏅", label: "Verified Sellers", desc: "KOB ID authentication" },
  { icon: "🔒", label: "Privacy Protected", desc: "Data handled securely" },
  { icon: "🛡️", label: "Secure Marketplace", desc: "Fraud prevention active" },
];

// ================================
// Section Card
// ================================
function SectionCard({ section, idx }) {
  const [open, setOpen] = useState(true);

  return (
    <div
      id={`section-${idx}`}
      className="bg-white rounded-2xl border border-gray-100
        shadow-sm overflow-hidden
        hover:shadow-md transition-shadow duration-200"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between
          px-6 py-4 text-left touch-manipulation
          hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl flex-shrink-0">{section.icon}</span>
          <div>
            <span
              className="text-[10px] font-bold uppercase
              tracking-widest text-[#D4AF37]"
            >
              {String(idx + 1).padStart(2, "0")}
            </span>
            <h2
              className="text-sm font-bold text-[#2C1F0E]
              leading-tight"
            >
              {section.title}
            </h2>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0
            transition-transform duration-200
            ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="px-6 pb-5">
          <div className="border-t border-gray-100 pt-4">
            <p
              className="text-sm md:text-base leading-8
              text-gray-600"
            >
              {section.body}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ================================
// Table of Contents
// ================================
function TableOfContents({ sections }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100
      shadow-sm p-5 mb-8"
    >
      <h2
        className="text-xs font-black uppercase tracking-widest
        text-[#D4AF37] mb-4"
      >
        Quick Navigation
      </h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2
        lg:grid-cols-3 gap-2"
      >
        {sections.map((s, idx) => (
          <a
            key={idx}
            href={`#section-${idx}`}
            className="flex items-center gap-2 px-3 py-2.5
              rounded-xl bg-[#FAFAF8] hover:bg-[#4B3621]/5
              hover:text-[#4B3621] text-gray-500
              transition-all duration-150 group
              touch-manipulation"
          >
            <span
              className="text-[10px] font-black
              text-[#D4AF37] w-5 flex-shrink-0"
            >
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span
              className="text-xs font-semibold
              truncate group-hover:text-[#4B3621]
              transition-colors"
            >
              {s.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ================================
// Legal Notice Card
// ================================
function LegalNotice() {
  return (
    <div
      className="bg-amber-50 border-2 border-amber-200
      rounded-2xl p-5 mb-8"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 bg-amber-100 rounded-xl
          flex items-center justify-center flex-shrink-0"
        >
          <span className="text-xl">⚖️</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900 mb-2">
            Important Legal Notice
          </h3>
          <ul className="space-y-1.5">
            {[
              "Using KOB constitutes full acceptance of all marketplace policies.",
              "KOB may remove harmful, fraudulent, or policy-violating listings at any time.",
              "All users must adhere to KOB Community Standards.",
              "KOB prioritizes buyer and seller trust, safety, and fair commerce.",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2
                text-xs text-amber-800 leading-relaxed"
              >
                <span
                  className="text-amber-500 flex-shrink-0
                  mt-0.5"
                >
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ================================
// Trust Badges
// ================================
function TrustBadges() {
  return (
    <div className="mb-10">
      <h2
        className="text-xs font-black uppercase tracking-widest
        text-[#D4AF37] mb-4 text-center"
      >
        KOB Marketplace Commitments
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TRUST_BADGES.map((b) => (
          <div
            key={b.label}
            className="bg-white rounded-2xl border border-gray-100
              shadow-sm p-4 text-center hover:shadow-md
              hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="text-2xl mb-2">{b.icon}</div>
            <p className="text-xs font-bold text-[#2C1F0E] mb-1">{b.label}</p>
            <p className="text-[10px] text-gray-400">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================================
// Main Terms Page
// ================================
export default function Terms() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* ================================ */}
      {/* HERO                             */}
      {/* ================================ */}
      <section
        className="relative overflow-hidden
        bg-gradient-to-br from-[#2C1F0E] via-[#4B3621]
        to-[#6B4C31] py-16 text-white"
      >
        <div
          className="absolute -top-16 -right-16 w-64 h-64
          bg-[#D4AF37]/10 rounded-full blur-3xl
          pointer-events-none"
        />
        <div
          className="absolute -bottom-16 -left-16 w-64 h-64
          bg-white/5 rounded-full blur-3xl pointer-events-none"
        />

        <div
          className="container relative z-10 max-w-4xl
          mx-auto px-4 text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-4
            py-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/30
            rounded-full mb-4"
          >
            <span className="text-sm">📋</span>
            <span
              className="text-xs font-bold uppercase
              tracking-widest text-[#D4AF37]"
            >
              Legal Document
            </span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-black
            text-white mb-3 tracking-tight"
          >
            Terms of Service
          </h1>
          <p
            className="text-sm text-white/60 max-w-md
            mx-auto mb-6 leading-relaxed"
          >
            The rules and standards governing use of the KOB Marketplace
            platform.
          </p>

          {/* Version info */}
          <div
            className="flex flex-wrap items-center
            justify-center gap-4 text-xs text-white/50"
          >
            <span>📅 Last Updated: {VERSION.updated}</span>
            <span className="w-px h-3 bg-white/20" />
            <span>🏷️ {VERSION.terms}</span>
            <span className="w-px h-3 bg-white/20" />
            <span>✅ Reviewed by KOB Legal & Compliance Team</span>
          </div>
        </div>
      </section>

      <div
        className="container max-w-4xl mx-auto
        px-4 py-10 pb-20"
      >
        {/* Legal Notice */}
        <LegalNotice />

        {/* Table of Contents */}
        <TableOfContents sections={SECTIONS} />

        {/* Sections */}
        <div className="space-y-4 mb-12">
          {SECTIONS.map((section, idx) => (
            <SectionCard key={idx} section={section} idx={idx} />
          ))}
        </div>

        {/* Trust Badges */}
        <TrustBadges />

        {/* CTA Banner */}
        <div
          className="relative overflow-hidden rounded-3xl
          bg-gradient-to-br from-[#2C1F0E] via-[#4B3621]
          to-[#6B4C31] p-8 text-center text-white"
        >
          <div
            className="absolute -top-12 -right-12 w-48 h-48
            bg-[#D4AF37]/10 rounded-full blur-3xl
            pointer-events-none"
          />
          <div className="relative z-10">
            <p
              className="text-xs font-bold uppercase
              tracking-widest text-[#D4AF37] mb-3"
            >
              Need Help?
            </p>
            <h2 className="text-xl font-black text-white mb-2">
              Questions About Our Terms?
            </h2>
            <p
              className="text-sm text-white/60 mb-6
              max-w-sm mx-auto"
            >
              Our Legal & Compliance Team is here to help you understand your
              rights and responsibilities.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://wa.me/2347089454544"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-2.5
                  bg-[#D4AF37] text-[#2C1F0E] rounded-xl
                  text-sm font-bold hover:bg-[#c49e30]
                  transition-colors"
              >
                💬 Contact Legal Team
              </a>
              <Link
                to="/privacy"
                className="flex items-center gap-2 px-6 py-2.5
                  border-2 border-white/20 text-white rounded-xl
                  text-sm font-semibold hover:bg-white/10
                  transition-colors"
              >
                Privacy Policy →
              </Link>
            </div>
          </div>
        </div>

        {/* Legal footer */}
        <div
          className="mt-8 pt-6 border-t border-gray-200
          text-center"
        >
          <p className="text-xs text-gray-400 leading-relaxed">
            These Terms constitute the entire agreement between you and KOB
            Marketplace. By using KOB, you agree to these terms as amended from
            time to time.
          </p>
          <p className="text-[10px] text-gray-300 mt-2">
            KOB Marketplace · Katsina State, Nigeria · Legal Version:{" "}
            {VERSION.terms}
          </p>
        </div>
      </div>
    </main>
  );
}
