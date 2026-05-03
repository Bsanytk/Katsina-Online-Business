import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import BackButton from "../components/BackButton";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Package,
  Shield,
  CreditCard,
  Truck,
  Settings,
  Search,
  ChevronRight,
  Mail,
  MessageCircle,
  Phone,
  ExternalLink,
} from "lucide-react";

// ================================
// Animation Variants
// ================================
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// ================================
// Help Categories Data
// ================================
const getCategories = (t) => [
  {
    icon: <ShoppingBag className="w-5 h-5" />,
    color: "bg-[#4B3621]",
    title: "Buying Guide",
    desc: "Learn how to browse, search, and purchase products safely.",
    links: [
      { text: "Browse Marketplace", href: "/marketplace", external: false },
      { text: "Search Tips", href: "#", external: false },
      { text: "Payment Methods", href: "#", external: false },
      { text: "Shipping Info", href: "#", external: false },
    ],
  },
  {
    icon: <Package className="w-5 h-5" />,
    color: "bg-[#D4AF37]",
    title: "Selling Guide",
    desc: "Start selling on KOB with our step-by-step seller resources.",
    links: [
      {
        text: "Register as Seller",
        href: t("seller.forms.seller_registration"),
        external: true,
      },
      { text: "List a Product", href: "/marketplace", external: false },
      { text: "Verified Sellers Program", href: "#", external: false },
      { text: "Seller Dashboard", href: "/dashboard", external: false },
    ],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    color: "bg-blue-600",
    title: "Account & Security",
    desc: "Secure your account and manage your personal information.",
    links: [
      { text: "Password Security", href: "#", external: false },
      { text: "Account Settings", href: "#", external: false },
      { text: "Privacy Control", href: "/privacy", external: false },
      { text: "Cookie Policy", href: "/cookies", external: false },
    ],
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    color: "bg-emerald-600",
    title: "Payments & Billing",
    desc: "Understand our payment systems and manage your transactions.",
    links: [
      { text: "Payment Methods", href: "#", external: false },
      { text: "Invoices", href: "#", external: false },
      { text: "Refunds", href: "#", external: false },
      { text: "Disputes", href: "#", external: false },
    ],
  },
  {
    icon: <Truck className="w-5 h-5" />,
    color: "bg-purple-600",
    title: "Shipping & Delivery",
    desc: "Get help with orders, tracking, and delivery issues.",
    links: [
      { text: "Track Order", href: "#", external: false },
      { text: "Shipping Rates", href: "#", external: false },
      {
        text: "KOB Express Delivery",
        href: t("seller.forms.express_delivery"),
        external: true,
      },
      { text: "Return Policy", href: "#", external: false },
    ],
  },
  {
    icon: <Settings className="w-5 h-5" />,
    color: "bg-gray-600",
    title: "Technical Support",
    desc: "Troubleshooting guides and technical issue resolution.",
    links: [
      { text: "App Issues", href: "#", external: false },
      { text: "Browser Compatibility", href: "#", external: false },
      { text: "Performance Tips", href: "#", external: false },
      { text: "Report a Bug", href: "/contact", external: false },
    ],
  },
];

// ================================
// Contact Options
// ================================
const getContactOptions = (t) => [
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email Support",
    desc: "Get a response within 24 hours",
    href: `mailto:${t("common.contact_email")}`,
    external: false,
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    label: "WhatsApp Chat",
    desc: "Chat with us directly",
    href: t("common.contact_whatsapp_link"),
    external: true,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: "Contact Form",
    desc: "Send us a detailed message",
    href: "/contact",
    external: false,
    color: "bg-[#4B3621]/5 text-[#4B3621] border-[#4B3621]/10",
  },
];

// ================================
// HelpCard Component
// ================================
function HelpCard({ category }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white rounded-2xl border border-gray-100
        shadow-sm hover:shadow-md transition-all duration-200
        hover:-translate-y-0.5 overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`
            w-10 h-10 rounded-xl flex items-center
            justify-center text-white flex-shrink-0
            ${category.color}
          `}
          >
            {category.icon}
          </div>
          <h3 className="text-sm font-semibold text-[#2C1F0E]">
            {category.title}
          </h3>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">{category.desc}</p>
      </div>

      {/* Links */}
      <ul className="p-3 space-y-0.5">
        {category.links.map((link, i) => {
          const linkObj =
            typeof link === "string"
              ? { text: link, href: "#", external: false }
              : link;

          const commonClass = `
            flex items-center justify-between
            px-3 py-2.5 rounded-xl text-xs font-medium
            text-gray-500 hover:text-[#4B3621]
            hover:bg-[#4B3621]/5
            transition-all duration-150 group
          `;

          if (linkObj.external) {
            return (
              <li key={i}>
                <a
                  href={linkObj.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={commonClass}
                >
                  <span>{linkObj.text}</span>
                  <ExternalLink
                    className="w-3 h-3 opacity-0
                    group-hover:opacity-100 transition-opacity"
                  />
                </a>
              </li>
            );
          }

          return (
            <li key={i}>
              <Link to={linkObj.href} className={commonClass}>
                <span>{linkObj.text}</span>
                <ChevronRight
                  className="w-3 h-3 opacity-0
                  group-hover:opacity-100 transition-opacity"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

// ================================
// Main Component
// ================================
export default function Help() {
  const t = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = getCategories(t);
  const contactOptions = getContactOptions(t);

  // Simple search filter
  const filtered = searchQuery.trim()
    ? categories.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.links.some((l) => {
            const text = typeof l === "string" ? l : l.text;
            return text.toLowerCase().includes(searchQuery.toLowerCase());
          })
      )
    : categories;

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="container pt-4">
        <BackButton />
      </div>

      {/* ================================ */}
      {/* HERO                             */}
      {/* ================================ */}
      <section className="relative overflow-hidden bg-[#4B3621]">
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-72 h-72
            bg-[#D4AF37]/10 rounded-full blur-3xl"
          />
          <div
            className="absolute -bottom-20 -left-20 w-72 h-72
            bg-white/5 rounded-full blur-3xl"
          />
        </div>

        <div
          className="container relative z-10 py-14 md:py-20
          text-center"
        >
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase
                tracking-widest text-[#D4AF37] mb-3"
            >
              Support
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold
                text-white mb-3"
            >
              Help Center
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-sm text-white/60 mb-8
                max-w-md mx-auto"
            >
              Browse our guides or get in touch with our support team anytime.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={fadeUp} className="max-w-md mx-auto relative">
              <Search
                className="absolute left-4 top-1/2
                -translate-y-1/2 w-4 h-4 text-gray-400
                pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white
                  rounded-xl text-sm outline-none
                  placeholder:text-gray-400 text-gray-700
                  shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2
                    -translate-y-1/2 text-gray-400
                    hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================================ */}
      {/* CATEGORIES GRID                  */}
      {/* ================================ */}
      <div className="container py-12">
        {/* Search result info */}
        {searchQuery && (
          <p className="text-sm text-gray-400 mb-6">
            {filtered.length > 0 ? (
              <>
                Found{" "}
                <span className="font-semibold text-[#4B3621]">
                  {filtered.length}
                </span>{" "}
                result{filtered.length !== 1 ? "s" : ""} for{" "}
                <span className="font-semibold">"{searchQuery}"</span>
              </>
            ) : (
              <>No results for "{searchQuery}"</>
            )}
          </p>
        )}

        {filtered.length > 0 ? (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2
              lg:grid-cols-3 gap-5"
          >
            {filtered.map((category, idx) => (
              <HelpCard key={idx} category={category} />
            ))}
          </motion.div>
        ) : (
          /* No results */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center bg-white
              rounded-2xl border border-gray-100"
          >
            <Search
              className="w-10 h-10 text-gray-200
              mx-auto mb-3"
            />
            <p className="text-sm font-medium text-gray-400">
              No help topics found
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Try different keywords or browse all categories
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-xs font-semibold
                text-[#4B3621] hover:underline"
            >
              Clear search
            </button>
          </motion.div>
        )}

        {/* ================================ */}
        {/* CONTACT SECTION                  */}
        {/* ================================ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mt-14"
        >
          {/* Section header */}
          <motion.div variants={fadeUp} className="text-center mb-8">
            <p
              className="text-xs font-semibold uppercase
              tracking-widest text-[#D4AF37] mb-2"
            >
              Get in Touch
            </p>
            <h2
              className="text-xl md:text-2xl font-bold
              text-[#2C1F0E]"
            >
              Still need help?
            </h2>
            <p
              className="text-sm text-gray-400 mt-1.5
              max-w-sm mx-auto"
            >
              Our support team is ready to assist you with any questions or
              issues.
            </p>
          </motion.div>

          {/* Contact Cards */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-4
              max-w-2xl mx-auto"
          >
            {contactOptions.map((opt) => {
              const content = (
                <motion.div
                  variants={fadeUp}
                  className={`
                    flex items-center gap-4 p-5
                    rounded-2xl border-2 transition-all
                    duration-200 hover:-translate-y-0.5
                    hover:shadow-md cursor-pointer
                    ${opt.color}
                  `}
                >
                  <div className="flex-shrink-0">{opt.icon}</div>
                  <div>
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className="text-xs opacity-60 mt-0.5">{opt.desc}</p>
                  </div>
                </motion.div>
              );

              if (opt.external) {
                return (
                  <a
                    key={opt.label}
                    href={opt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link key={opt.label} to={opt.href}>
                  {content}
                </Link>
              );
            })}
          </motion.div>

          {/* Bottom note */}
          <motion.p
            variants={fadeUp}
            className="text-center text-xs text-gray-400
              mt-8"
          >
            Average response time:{" "}
            <span className="font-semibold text-[#4B3621]">under 2 hours</span>{" "}
            during business hours
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}
