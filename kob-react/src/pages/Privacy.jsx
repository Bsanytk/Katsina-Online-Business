/**
 * Privacy.jsx — KOB Marketplace Privacy Policy
 * Professional, trust-centered compliance page
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";

const VERSION = {
  policy: "KOB-PV-1.0.0",
  updated: "May 13, 2026",
};

// ================================
// Privacy sections
// ================================
const SECTIONS = [
  {
    title: "Information We Collect",
    icon: "📊",
    body: `When you register on KOB, we collect your name,
      email address, phone number, business information, and
      location. We also collect device information, IP
      addresses, and usage data to improve your experience
      and maintain platform security.`,
  },
  {
    title: "How We Use Your Data",
    icon: "🔍",
    body: `Your data is used to operate the marketplace,
      facilitate transactions, send important notifications,
      prevent fraud, improve platform features, and comply with
      legal obligations. We do not use your data for purposes
      beyond what is described in this policy without your
      consent.`,
  },
  {
    title: "Data Sharing & Third Parties",
    icon: "🤝",
    body: `KOB does not sell your personal data. We may share
      limited information with trusted service providers
      (such as Firebase, Cloudinary) who assist in platform
      operations under strict confidentiality agreements. We
      may disclose data when required by law or to protect
      platform safety.`,
  },
  {
    title: "Seller Data & Public Profiles",
    icon: "🏪",
    body: `Seller profiles, business names, product listings,
      WhatsApp numbers, and locations are publicly visible
      to enable buyer-seller communication. Sellers are
      responsible for the accuracy of their public profile
      information. Buyers' personal data is not disclosed
      to sellers beyond what is necessary for transactions.`,
  },
  {
    title: "Data Security",
    icon: "🔐",
    body: `KOB uses Firebase Authentication, Firestore
      security rules, HTTPS encryption, and industry-standard
      practices to protect your data. While we implement
      strong security measures, no platform can guarantee
      absolute security. Users should keep their credentials
      private and report suspicious activity immediately.`,
  },
  {
    title: "Cookies & Analytics",
    icon: "🍪",
    body: `KOB uses essential cookies to maintain user sessions
      and platform functionality. We may use anonymized
      analytics data to improve user experience. You may
      disable non-essential cookies through your browser
      settings without affecting core platform functionality.`,
  },
  {
    title: "Marketplace Safety",
    icon: "🛡️",
    body: `KOB encourages all users to verify sellers before
      transacting, inspect products carefully, avoid suspicious
      payment requests outside the platform, and report
      fraudulent behavior to our Safety Team immediately.
      Your safety is our highest priority.`,
  },
  {
    title: "Fraud Prevention & Data Use",
    icon: "⚠️",
    body: `KOB may use your account data, activity patterns,
      and device information to detect and prevent fraudulent
      activity. Accounts identified as engaging in scams,
      impersonation, or fraudulent listings may be suspended
      or permanently removed. KOB has zero tolerance for
      marketplace fraud.`,
  },
  {
    title: "Account Suspension & Data Retention",
    icon: "🔒",
    body: `Upon account suspension or termination, KOB may
      retain certain data for legal, safety, and compliance
      purposes. Users may request data deletion by contacting
      our Privacy Team. Deletion requests are processed within
      30 days subject to legal obligations and platform safety
      requirements.`,
  },
  {
    title: "Your Rights & Choices",
    icon: "⚖️",
    body: `You have the right to access, correct, or delete
      your personal data. You may update your profile
      information at any time through your account settings.
      To request data deletion or exercise other privacy
      rights, contact our Privacy Team via WhatsApp or
      email.`,
  },
  {
    title: "Children's Privacy",
    icon: "👶",
    body: `KOB is not intended for users under 18 years of
      age. We do not knowingly collect data from minors.
      If you believe a minor has created an account, please
      contact our Trust & Safety Team immediately for
      review and removal.`,
  },
  {
    title: "Policy Updates",
    icon: "📝",
    body: `KOB may update this Privacy Policy to reflect
      changes in platform features, legal requirements, or
      best practices. We will notify users of material
      changes via email or in-app notifications. Continued
      use after updates constitutes acceptance of the revised
      policy.`,
  },
  {
    title: "Contact Our Privacy Team",
    icon: "📞",
    body: `For privacy concerns, data requests, or compliance
      inquiries, contact the KOB Privacy & Compliance Team.
      We aim to respond to all privacy requests within 5
      business days. Your trust is fundamental to everything
      we do at KOB.`,
  },
];

const TRUST_BADGES = [
  { icon: "✅", label: "Buyer Protection", desc: "Transactions monitored" },
  { icon: "🏅", label: "Verified Sellers", desc: "KOB ID authentication" },
  { icon: "🔒", label: "Privacy Protected", desc: "Data handled with care" },
  { icon: "🛡️", label: "Secure Marketplace", desc: "Fraud prevention active" },
];

// ================================
// Section Card — expandable
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
// Legal Notice
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
          <span className="text-xl">🔏</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900 mb-2">
            Your Privacy Matters
          </h3>
          <ul className="space-y-1.5">
            {[
              "Using KOB constitutes acceptance of this Privacy Policy.",
              "KOB does not sell your personal data to third parties.",
              "All data is handled with care under industry-standard security practices.",
              "KOB is committed to transparency, trust, and user safety.",
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
        KOB Privacy Commitments
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
// Data Table — what KOB collects
// ================================
function DataTable() {
  const rows = [
    {
      type: "Identity",
      data: "Name, email, phone",
      purpose: "Account creation & communication",
    },
    {
      type: "Business",
      data: "Shop name, KOB ID, address",
      purpose: "Seller profile & listings",
    },
    {
      type: "Device",
      data: "IP address, device type",
      purpose: "Security & fraud prevention",
    },
    {
      type: "Marketplace",
      data: "Product views, messages",
      purpose: "Platform improvement",
    },
    {
      type: "Media",
      data: "Profile photo, product images",
      purpose: "Marketplace display",
    },
  ];

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100
      shadow-sm overflow-hidden mb-8"
    >
      <div className="px-5 py-4 border-b border-gray-100">
        <h3
          className="text-xs font-bold uppercase tracking-widest
          text-[#D4AF37]"
        >
          Data We Collect
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/60">
              <th
                className="text-left py-3 px-5 text-[10px]
                font-bold uppercase tracking-widest text-gray-400"
              >
                Type
              </th>
              <th
                className="text-left py-3 px-4 text-[10px]
                font-bold uppercase tracking-widest text-gray-400"
              >
                Data
              </th>
              <th
                className="text-left py-3 px-4 text-[10px]
                font-bold uppercase tracking-widest text-gray-400"
              >
                Purpose
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((r) => (
              <tr
                key={r.type}
                className="hover:bg-gray-50/30 transition-colors"
              >
                <td className="py-3.5 px-5">
                  <span
                    className="text-xs font-bold
                    text-[#4B3621]"
                  >
                    {r.type}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-xs text-gray-600">{r.data}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-xs text-gray-500">{r.purpose}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ================================
// Main Privacy Page
// ================================
export default function Privacy() {
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
            <span className="text-sm">🔏</span>
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
            Privacy Policy
          </h1>
          <p
            className="text-sm text-white/60 max-w-md
            mx-auto mb-6 leading-relaxed"
          >
            How KOB Marketplace collects, protects, and uses your personal
            information.
          </p>

          {/* Version info */}
          <div
            className="flex flex-wrap items-center
            justify-center gap-4 text-xs text-white/50"
          >
            <span>📅 Last Updated: {VERSION.updated}</span>
            <span className="w-px h-3 bg-white/20" />
            <span>🏷️ {VERSION.policy}</span>
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

        {/* Data table */}
        <DataTable />

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
              Privacy Questions?
            </p>
            <h2 className="text-xl font-black text-white mb-2">
              We Respect Your Privacy
            </h2>
            <p
              className="text-sm text-white/60 mb-6
              max-w-sm mx-auto"
            >
              For data requests, privacy concerns, or compliance inquiries — our
              team is here.
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
                💬 Contact Privacy Team
              </a>
              <Link
                to="/terms"
                className="flex items-center gap-2 px-6 py-2.5
                  border-2 border-white/20 text-white rounded-xl
                  text-sm font-semibold hover:bg-white/10
                  transition-colors"
              >
                Terms of Service →
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
            This Privacy Policy is effective as of the date above. By using KOB
            Marketplace, you agree to the collection and use of data as
            described herein.
          </p>
          <p className="text-[10px] text-gray-300 mt-2">
            KOB Marketplace · Katsina State, Nigeria · Policy Version:{" "}
            {VERSION.policy}
          </p>
        </div>
      </div>
    </main>
  );
}
