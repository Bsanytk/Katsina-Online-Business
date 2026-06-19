/**
 * EthicalCommercePage.jsx — KOB Marketplace
 * Ethical Commerce & Business Standards
 *
 * Design system:
 *   #3d2619 — deep espresso (primary)
 *   #60412f — mid brown (secondary)
 *   #9c642d — rich amber (accent)
 *   #f8b85d — brand gold (highlight)
 *   #f5e6d3 — warm cream (surface)
 *   #fffaf5 — near-white (background)
 *   #ded7cf — muted cream (borders)
 */

import React, { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, Eye, Scale, Heart, Users, Star,
  CheckCircle, XCircle, AlertTriangle, Truck,
  Lock, Search, MessageSquare, Flag, ShieldCheck,
  ArrowRight, BadgeCheck,
} from "lucide-react";

// ─────────────────────────────────────────────
// Animation presets
// ─────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const CORE_VALUES = [
  {
    icon: Shield,
    title: "Integrity",
    desc: "Every transaction, listing, and interaction on KOB must reflect honesty and moral uprightness.",
    color: "#3d2619",
    bg: "rgba(61,38,25,0.06)",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    desc: "We build confidence between buyers and sellers through verified identities and transparent records.",
    color: "#9c642d",
    bg: "rgba(156,100,45,0.08)",
  },
  {
    icon: Eye,
    title: "Transparency",
    desc: "Pricing, policies, and platform decisions are communicated openly and without hidden conditions.",
    color: "#60412f",
    bg: "rgba(96,65,47,0.07)",
  },
  {
    icon: Scale,
    title: "Fairness",
    desc: "All users are treated equally. No seller gains unfair advantage, no buyer is left unprotected.",
    color: "#3d2619",
    bg: "rgba(61,38,25,0.06)",
  },
  {
    icon: BadgeCheck,
    title: "Accountability",
    desc: "Violations of platform standards are addressed swiftly and consistently without exception.",
    color: "#9c642d",
    bg: "rgba(156,100,45,0.08)",
  },
  {
    icon: Heart,
    title: "Customer First",
    desc: "The safety, satisfaction, and dignity of every customer guides every platform decision we make.",
    color: "#60412f",
    bg: "rgba(96,65,47,0.07)",
  },
];

const MARKETPLACE_STANDARDS = [
  {
    title: "Honest Listings",
    desc: "Products must be accurately described with real images, correct pricing, and truthful conditions.",
    icon: CheckCircle,
  },
  {
    title: "Authentic Products",
    desc: "No counterfeit, imitation, or deceptive items. Every product sold must be genuine.",
    icon: BadgeCheck,
  },
  {
    title: "Fair Transactions",
    desc: "Buyers and sellers must engage with mutual respect and full transparency in every deal.",
    icon: Scale,
  },
  {
    title: "Professional Communication",
    desc: "All platform interactions must remain respectful, clear, and professional at all times.",
    icon: MessageSquare,
  },
  {
    title: "Customer Protection",
    desc: "Robust complaint and dispute systems ensure every customer concern is heard and resolved.",
    icon: Shield,
  },
  {
    title: "Community Growth",
    desc: "KOB actively supports local entrepreneurs and small businesses across Katsina State.",
    icon: Users,
  },
];

const PROHIBITED = [
  "Fraud and financial deception of any kind",
  "Sale of counterfeit or fake branded items",
  "Misleading product descriptions or images",
  "Stolen goods or items of unknown origin",
  "Scam activities targeting buyers or sellers",
  "Fake reviews or manipulation of ratings",
  "Harmful, illegal, or prohibited products",
  "Harassment or abusive conduct toward users",
];

const SELLER_DUTIES = [
  "Provide accurate product titles, descriptions, and images",
  "Maintain honest and up-to-date pricing at all times",
  "Fulfill orders promptly and communicate any delays",
  "Treat every buyer with respect and professionalism",
  "Respond to inquiries and complaints within 24 hours",
  "Comply fully with all KOB Marketplace policies",
];

const BUYER_DUTIES = [
  "Engage respectfully with all sellers and platform staff",
  "Provide honest, fair, and constructive feedback",
  "Complete payments promptly on confirmed orders",
  "Report suspicious activity or policy violations",
  "Use the platform responsibly and in good faith",
];

const DELIVERY_STANDARDS = [
  "Deliver all packages on time and in agreed condition",
  "Handle products with care and prevent damage in transit",
  "Communicate proactively with buyers about delivery status",
  "Maintain professional conduct at all customer touchpoints",
  "Be accountable for all packages accepted for delivery",
];

const PROTECTION_PILLARS = [
  {
    icon: BadgeCheck,
    title: "Account Verification",
    desc: "Every seller undergoes identity and business verification before listing products.",
  },
  {
    icon: Search,
    title: "Fraud Monitoring",
    desc: "Continuous automated and human review detects and removes suspicious activity.",
  },
  {
    icon: Scale,
    title: "Dispute Resolution",
    desc: "A structured process ensures fair outcomes for both buyers and sellers in all disputes.",
  },
  {
    icon: Flag,
    title: "Community Reporting",
    desc: "Users can report violations directly. All reports are reviewed within 48 hours.",
  },
  {
    icon: Lock,
    title: "Privacy Protection",
    desc: "Personal and financial data is stored securely and never shared without consent.",
  },
];

// ─────────────────────────────────────────────
// Reusable: Section header
// ─────────────────────────────────────────────
function SectionHeader({ eyebrow, title, subtitle, center = false }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`mb-10 ${center ? "text-center max-w-2xl mx-auto" : "max-w-xl"}`}
    >
      {eyebrow && (
        <p
          className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2"
          style={{ color: "#9c642d", fontFamily: "'Montserrat', sans-serif" }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className="text-2xl md:text-3xl font-black leading-tight"
        style={{ color: "#3d2619", fontFamily: "'Montserrat', sans-serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "#7c6250" }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Reusable: Checklist item
// ─────────────────────────────────────────────
function CheckItem({ text, color = "#3d2619", icon: Icon = CheckCircle }) {
  return (
    <motion.li
      variants={fadeUp}
      className="flex items-start gap-3 py-3 border-b border-[#ded7cf]/60 last:border-0"
    >
      <Icon
        className="w-4 h-4 flex-shrink-0 mt-0.5"
        style={{ color }}
      />
      <span className="text-sm leading-relaxed" style={{ color: "#60412f" }}>
        {text}
      </span>
    </motion.li>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function EthicalCommercePage() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "#fffaf5", fontFamily: "'Inter', sans-serif" }}
    >

      {/* ============================================
          HERO
      ============================================ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #3d2619 0%, #60412f 55%, #9c642d 100%)" }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(248,184,93,0.10) 0%, transparent 65%)",
          }}
        />

        <div className="container relative z-10 py-16 md:py-24">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto text-center"
          >
            {/* Trust badge */}
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mb-7">
              {[
                { icon: ShieldCheck, label: "Verified Marketplace" },
                { icon: Users,       label: "Community Standards" },
                { icon: Star,        label: "Trusted Platform"    },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                    text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: "rgba(248,184,93,0.12)",
                    border: "1px solid rgba(248,184,93,0.22)",
                    color: "#f8b85d",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  <Icon className="w-3 h-3" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(1.875rem, 6vw, 3.25rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#ded7cf",
                margin: "0 0 1.25rem 0",
              }}
            >
              Building Trust Through{" "}
              <span style={{ color: "#f8b85d" }}>Ethical Commerce</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{
                fontSize: "1rem",
                color: "#ceb99e",
                lineHeight: 1.75,
                maxWidth: "34rem",
                margin: "0 auto 2.5rem",
              }}
            >
              KOB Marketplace is committed to creating a safe, transparent, and
              trustworthy environment where buyers and sellers can connect with
              confidence.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2
                  px-7 py-3 rounded-xl text-sm font-bold
                  transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: "#f8b85d",
                  color: "#3d2619",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Explore Marketplace
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#standards"
                className="inline-flex items-center justify-center gap-2
                  px-7 py-3 rounded-xl text-sm font-semibold
                  transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: "rgba(222,215,207,0.08)",
                  color: "#ded7cf",
                  border: "1.5px solid rgba(222,215,207,0.18)",
                }}
              >
                Read Community Standards
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, #fffaf5 0%, transparent 100%)" }}
        />
      </section>

      {/* ============================================
          VISION
      ============================================ */}
      <section className="py-16 md:py-20" style={{ background: "#fffaf5" }}>
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.p
              variants={fadeUp}
              className="text-[10px] font-bold uppercase tracking-[0.22em] mb-3"
              style={{ color: "#9c642d", fontFamily: "'Montserrat', sans-serif" }}
            >
              Our Vision
            </motion.p>
            <motion.blockquote
              variants={fadeUp}
              className="text-xl md:text-2xl font-bold leading-snug"
              style={{
                color: "#3d2619",
                fontFamily: "'Montserrat', sans-serif",
                lineHeight: 1.45,
              }}
            >
              "To build one of Africa's most trusted digital marketplaces where
              ethical business practices drive growth, innovation, and community
              prosperity."
            </motion.blockquote>
            <motion.div
              variants={fadeUp}
              className="mt-6 h-px max-w-xs mx-auto"
              style={{ background: "linear-gradient(to right, transparent, #f8b85d, transparent)" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ============================================
          CORE VALUES
      ============================================ */}
      <section className="py-14 md:py-18" style={{ background: "#f5e6d3" }}>
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionHeader
              eyebrow="Core Values"
              title="What We Stand For"
              subtitle="These principles govern every decision made on the KOB Marketplace platform."
              center
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CORE_VALUES.map((v) => (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group p-6 rounded-2xl border transition-all duration-200 cursor-default"
                  style={{
                    background: "#fffaf5",
                    borderColor: "#ded7cf",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#f8b85d";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(248,184,93,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#ded7cf";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center
                      justify-center mb-4 transition-transform duration-200
                      group-hover:scale-110"
                    style={{ background: v.bg }}
                  >
                    <v.icon className="w-5 h-5" style={{ color: v.color }} />
                  </div>
                  <h3
                    className="text-sm font-bold mb-2"
                    style={{ color: "#3d2619", fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#7c6250" }}>
                    {v.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          MARKETPLACE STANDARDS
      ============================================ */}
      <section id="standards" className="py-14 md:py-18" style={{ background: "#fffaf5" }}>
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionHeader
              eyebrow="Marketplace Standards"
              title="How KOB Operates"
              subtitle="These standards define the baseline of conduct expected from every participant on the platform."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MARKETPLACE_STANDARDS.map((s, i) => (
                <motion.div
                  key={s.title}
                  variants={fadeUp}
                  className="flex items-start gap-4 p-5 rounded-2xl border"
                  style={{ background: "#f5e6d3", borderColor: "#ded7cf" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0
                      flex items-center justify-center"
                    style={{ background: "rgba(248,184,93,0.15)" }}
                  >
                    <s.icon className="w-5 h-5" style={{ color: "#9c642d" }} />
                  </div>
                  <div>
                    <h3
                      className="text-sm font-bold mb-1"
                      style={{ color: "#3d2619", fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: "#7c6250" }}>
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          WHAT IS NOT ALLOWED
      ============================================ */}
      <section
        className="py-14 md:py-18"
        style={{ background: "linear-gradient(135deg, #3d2619 0%, #60412f 100%)" }}
      >
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="mb-10">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2"
                style={{ color: "#f8b85d", fontFamily: "'Montserrat', sans-serif" }}
              >
                Prohibited Conduct
              </p>
              <h2
                className="text-2xl md:text-3xl font-black"
                style={{ color: "#ded7cf", fontFamily: "'Montserrat', sans-serif" }}
              >
                What Is Not Allowed
              </h2>
              <p className="mt-3 text-sm" style={{ color: "#ceb99e" }}>
                Violations result in immediate suspension and reporting to relevant authorities.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROHIBITED.map((item) => (
                <motion.div
                  key={item}
                  variants={fadeUp}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(248,100,80,0.18)",
                  }}
                >
                  <XCircle
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: "#f87171" }}
                  />
                  <span className="text-sm" style={{ color: "#ceb99e" }}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeUp}
              className="mt-8 p-5 rounded-2xl flex items-start gap-3"
              style={{
                background: "rgba(248,100,80,0.08)",
                border: "1px solid rgba(248,100,80,0.2)",
              }}
            >
              <AlertTriangle
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: "#f87171" }}
              />
              <p className="text-sm leading-relaxed" style={{ color: "#ceb99e" }}>
                <strong style={{ color: "#f8b85d" }}>Zero Tolerance Policy.</strong>{" "}
                KOB Marketplace enforces a strict zero-tolerance approach to fraud,
                deception, and harmful conduct. All violations are logged, investigated,
                and acted upon without exception.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          SELLER + BUYER RESPONSIBILITIES (side by side)
      ============================================ */}
      <section className="py-14 md:py-18" style={{ background: "#fffaf5" }}>
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionHeader
              eyebrow="Responsibilities"
              title="Roles & Expectations"
              subtitle="A healthy marketplace depends on every participant playing their part with integrity."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sellers */}
              <motion.div
                variants={fadeUp}
                className="p-6 rounded-2xl border"
                style={{ background: "#f5e6d3", borderColor: "#ded7cf" }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(61,38,25,0.10)" }}
                  >
                    <Star className="w-5 h-5" style={{ color: "#9c642d" }} />
                  </div>
                  <h3
                    className="text-base font-black"
                    style={{ color: "#3d2619", fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Seller Responsibilities
                  </h3>
                </div>
                <motion.ul variants={stagger} className="space-y-0">
                  {SELLER_DUTIES.map((d) => (
                    <CheckItem key={d} text={d} color="#9c642d" />
                  ))}
                </motion.ul>
              </motion.div>

              {/* Buyers */}
              <motion.div
                variants={fadeUp}
                className="p-6 rounded-2xl border"
                style={{ background: "#f5e6d3", borderColor: "#ded7cf" }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(61,38,25,0.10)" }}
                  >
                    <Heart className="w-5 h-5" style={{ color: "#9c642d" }} />
                  </div>
                  <h3
                    className="text-base font-black"
                    style={{ color: "#3d2619", fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Buyer Responsibilities
                  </h3>
                </div>
                <motion.ul variants={stagger} className="space-y-0">
                  {BUYER_DUTIES.map((d) => (
                    <CheckItem key={d} text={d} color="#9c642d" />
                  ))}
                </motion.ul>
              </motion.div>
            </div>

            {/* Delivery Partners */}
            <motion.div
              variants={fadeUp}
              className="mt-6 p-6 rounded-2xl border"
              style={{ background: "#f5e6d3", borderColor: "#ded7cf" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(61,38,25,0.10)" }}
                >
                  <Truck className="w-5 h-5" style={{ color: "#9c642d" }} />
                </div>
                <h3
                  className="text-base font-black"
                  style={{ color: "#3d2619", fontFamily: "'Montserrat', sans-serif" }}
                >
                  Delivery Partner Standards
                </h3>
              </div>
              <motion.ul
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-8"
              >
                {DELIVERY_STANDARDS.map((d) => (
                  <CheckItem key={d} text={d} color="#9c642d" icon={Truck} />
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          PROTECTION SYSTEM
      ============================================ */}
      <section className="py-14 md:py-18" style={{ background: "#f5e6d3" }}>
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionHeader
              eyebrow="Protection System"
              title="How We Keep You Safe"
              subtitle="KOB Marketplace operates a multi-layered protection system to safeguard every user."
              center
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROTECTION_PILLARS.map((p, i) => (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  className="p-6 rounded-2xl text-center"
                  style={{
                    background: "#fffaf5",
                    border: "1px solid #ded7cf",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center
                      justify-center mx-auto mb-4"
                    style={{ background: "rgba(248,184,93,0.12)" }}
                  >
                    <p.icon className="w-6 h-6" style={{ color: "#9c642d" }} />
                  </div>
                  <h3
                    className="text-sm font-bold mb-2"
                    style={{ color: "#3d2619", fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#7c6250" }}>
                    {p.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          COMMUNITY COMMITMENT
      ============================================ */}
      <section className="py-14 md:py-20" style={{ background: "#fffaf5" }}>
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <motion.div
              variants={fadeUp}
              className="p-8 md:p-10 rounded-3xl text-center"
              style={{
                background: "linear-gradient(145deg, #3d2619 0%, #60412f 100%)",
                border: "1px solid rgba(248,184,93,0.15)",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center
                  justify-center mx-auto mb-5"
                style={{ background: "rgba(248,184,93,0.12)" }}
              >
                <Users className="w-7 h-7" style={{ color: "#f8b85d" }} />
              </div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.22em] mb-3"
                style={{ color: "#f8b85d", fontFamily: "'Montserrat', sans-serif" }}
              >
                Our Commitment to the Community
              </p>
              <h2
                className="text-xl md:text-2xl font-black mb-4"
                style={{ color: "#ded7cf", fontFamily: "'Montserrat', sans-serif" }}
              >
                More Than a Marketplace
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#ceb99e", maxWidth: "30rem", margin: "0 auto" }}
              >
                KOB Marketplace exists to empower entrepreneurs, support local
                businesses, create sustainable opportunities, and promote responsible
                economic growth across Katsina State and beyond.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          KOB PLEDGE
      ============================================ */}
      <section
        className="py-12"
        style={{ background: "#f5e6d3", borderTop: "1px solid #ded7cf" }}
      >
        <div className="container">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1
                rounded-full mb-5"
              style={{
                background: "rgba(248,184,93,0.12)",
                border: "1px solid rgba(248,184,93,0.22)",
              }}
            >
              <Shield className="w-3 h-3" style={{ color: "#f8b85d" }} />
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#9c642d", fontFamily: "'Montserrat', sans-serif" }}
              >
                KOB Marketplace Pledge
              </span>
            </div>
            <blockquote
              className="text-lg md:text-xl font-bold leading-snug"
              style={{
                color: "#3d2619",
                fontFamily: "'Montserrat', sans-serif",
                lineHeight: 1.5,
              }}
            >
              "We choose trust over deception, transparency over confusion, and
              long-term community value over short-term gains."
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          FOOTER CTA
      ============================================ */}
      <section
        className="py-16 md:py-20"
        style={{ background: "linear-gradient(160deg, #3d2619 0%, #60412f 100%)" }}
      >
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <motion.p
              variants={fadeUp}
              className="text-[10px] font-bold uppercase tracking-[0.22em] mb-3"
              style={{ color: "#f8b85d", fontFamily: "'Montserrat', sans-serif" }}
            >
              Ready to Join?
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-2xl md:text-3xl font-black mb-4"
              style={{ color: "#ded7cf", fontFamily: "'Montserrat', sans-serif" }}
            >
              Join a Marketplace Built on Trust
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-sm mb-8"
              style={{ color: "#ceb99e", lineHeight: 1.75 }}
            >
              Thousands of buyers and verified sellers are already trading
              with confidence on KOB Marketplace.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2
                  px-7 py-3 rounded-xl text-sm font-bold
                  transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: "#f8b85d",
                  color: "#3d2619",
                  fontFamily: "'Montserrat', sans-serif",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#d6a666"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f8b85d"; }}
              >
                Start Selling
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2
                  px-7 py-3 rounded-xl text-sm font-semibold
                  transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: "rgba(222,215,207,0.08)",
                  color: "#ded7cf",
                  border: "1.5px solid rgba(222,215,207,0.18)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(222,215,207,0.14)";
                  e.currentTarget.style.borderColor = "rgba(248,184,93,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(222,215,207,0.08)";
                  e.currentTarget.style.borderColor = "rgba(222,215,207,0.18)";
                }}
              >
                Explore Opportunities
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
