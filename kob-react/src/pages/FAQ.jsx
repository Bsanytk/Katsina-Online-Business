import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import BackButton from "../components/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail, MessageCircle, HelpCircle } from "lucide-react";

// ================================
// FAQ Data — Hardcoded (safe)
// ================================
const FAQ_ITEMS = [
  {
    category: "Buying",
    question: "How do I buy a product on KOB Marketplace?",
    answer:
      "Browse the marketplace, click on any product to view details, then contact the seller directly via WhatsApp using the contact button. You can also message sellers through our built-in chat system.",
  },
  {
    category: "Buying",
    question: "Do I need an account to browse products?",
    answer:
      "You can browse and view products without an account. However, you need to register and log in to contact sellers, leave reviews, or access your dashboard.",
  },
  {
    category: "Selling",
    question: "How do I become a verified seller on KOB?",
    answer:
      "Fill in the seller registration form and our admin team will review your application. Once approved, you will receive a unique KOB ID and your account will be marked as verified. Only verified sellers can list products.",
  },
  {
    category: "Selling",
    question: "How do I list a product for sale?",
    answer:
      'After your account is verified, go to the Marketplace page and click "New Listing." Fill in your product title, description, price, images, and delivery option. You can save as a draft or publish immediately.',
  },
  {
    category: "Selling",
    question: "Can I edit or delete my product after listing?",
    answer:
      "Yes. Go to your Dashboard, find the product in your Inventory tab, and click the Edit or Delete icon. Changes are reflected on the marketplace immediately.",
  },
  {
    category: "Delivery",
    question: "What is KOB Express Delivery?",
    answer:
      "KOB Express is our fast and affordable delivery service for orders within Katsina State. When a seller enables it, buyers can fill a delivery form to arrange pickup and drop-off. Rates are affordable and delivery is tracked.",
  },
  {
    category: "Delivery",
    question: "How long does delivery take?",
    answer:
      "Delivery times vary by location and seller arrangement. KOB Express typically delivers within 1–3 business days within Katsina State. Contact the seller for specific timelines.",
  },
  {
    category: "Account",
    question: "How do I update my WhatsApp number or shop address?",
    answer:
      "Log in and go to Dashboard → Profile tab → Brand Identity. Update your WhatsApp number and full shop address there. These details will automatically appear on all your product listings.",
  },
  {
    category: "Account",
    question: "I forgot my password. How do I reset it?",
    answer:
      'On the Login page, click "Forgot Password" and enter your email address. You will receive a reset link. Follow the instructions in the email to set a new password.',
  },
  {
    category: "Safety",
    question: "How does KOB ensure buyer and seller safety?",
    answer:
      "All sellers are manually verified by our admin team before they can list products. Buyers can leave reviews and ratings after a purchase. We also monitor listings for policy violations and remove any suspicious content.",
  },
  {
    category: "Safety",
    question: "What should I do if I encounter a suspicious seller?",
    answer:
      "If you encounter suspicious activity, please contact us immediately via WhatsApp or email. Provide the seller's KOB ID or shop link and a description of the issue. We will investigate and take action within 24 hours.",
  },
];

// ================================
// Categories for filter tabs
// ================================
const CATEGORIES = [
  "All",
  "Buying",
  "Selling",
  "Delivery",
  "Account",
  "Safety",
];

// ================================
// Single FAQ Item
// ================================
function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      }}
      className="bg-white rounded-2xl border border-gray-100
        shadow-sm overflow-hidden"
    >
      {/* Question */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between
          px-5 py-4 text-left hover:bg-gray-50/50
          transition-colors duration-150 group"
      >
        <span
          className={`
          text-sm font-medium leading-snug pr-4
          transition-colors duration-150
          ${
            isOpen
              ? "text-[#4B3621]"
              : "text-gray-700 group-hover:text-[#4B3621]"
          }
        `}
        >
          {faq.question}
        </span>
        <div
          className={`
          flex-shrink-0 w-7 h-7 rounded-full
          flex items-center justify-center
          transition-all duration-200
          ${
            isOpen
              ? "bg-[#4B3621] text-white rotate-180"
              : "bg-gray-100 text-gray-400 group-hover:bg-[#4B3621]/10"
          }
        `}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pb-5 pt-1 border-t
              border-gray-50"
            >
              <p
                className="text-sm text-gray-500
                leading-relaxed"
              >
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ================================
// Main Component
// ================================
export default function FAQ() {
  const t = useTranslation();

  const [expandedId, setExpandedId] = useState(null);
  const [activeCategory, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter by category + search
  const filtered = FAQ_ITEMS.filter((faq) => {
    const matchCategory =
      activeCategory === "All" || faq.category === activeCategory;

    const matchSearch =
      !searchQuery.trim() ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  function handleToggle(idx) {
    setExpandedId(expandedId === idx ? null : idx);
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="container pt-4">
        <BackButton />
      </div>

      {/* ================================ */}
      {/* HERO                             */}
      {/* ================================ */}
      <section className="relative overflow-hidden bg-[#4B3621]">
        {/* Decorative blobs */}
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
          className="container relative z-10 py-14
          text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p
              className="text-xs font-semibold uppercase
              tracking-widest text-[#D4AF37] mb-3"
            >
              Support
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold
              text-white mb-3"
            >
              Frequently Asked Questions
            </h1>
            <p
              className="text-sm text-white/60 mb-8
              max-w-sm mx-auto"
            >
              Quick answers to common questions about KOB Marketplace.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <HelpCircle
                className="absolute left-4 top-1/2
                -translate-y-1/2 w-4 h-4 text-gray-400
                pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search questions..."
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================ */}
      {/* CONTENT                          */}
      {/* ================================ */}
      <div className="container max-w-3xl py-10 pb-20">
        {/* Category Tabs */}
        <div
          className="flex gap-2 overflow-x-auto pb-1
          mb-8 scrollbar-hide"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setExpandedId(null);
              }}
              className={`
                flex-shrink-0 px-4 py-2 rounded-xl
                text-xs font-semibold transition-all duration-200
                ${
                  activeCategory === cat
                    ? "bg-[#4B3621] text-white shadow-sm"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-[#4B3621]/30"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        {(searchQuery || activeCategory !== "All") && (
          <p className="text-xs text-gray-400 mb-5">
            {filtered.length > 0 ? (
              <>
                Showing{" "}
                <span className="font-semibold text-[#4B3621]">
                  {filtered.length}
                </span>{" "}
                question{filtered.length !== 1 ? "s" : ""}
                {searchQuery && (
                  <>
                    {" "}
                    for "<span className="font-semibold">{searchQuery}</span>"
                  </>
                )}
              </>
            ) : (
              "No questions found"
            )}
          </p>
        )}

        {/* FAQ List */}
        {filtered.length > 0 ? (
          <motion.div
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filtered.map((faq, idx) => (
              <FAQItem
                key={`${activeCategory}-${idx}`}
                faq={faq}
                index={idx}
                isOpen={expandedId === idx}
                onToggle={() => handleToggle(idx)}
              />
            ))}
          </motion.div>
        ) : (
          /* Empty state */
          <div
            className="py-16 text-center bg-white
            rounded-2xl border border-gray-100"
          >
            <HelpCircle
              className="w-10 h-10 text-gray-200
              mx-auto mb-3"
            />
            <p className="text-sm font-medium text-gray-400">
              No questions found
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setCategory("All");
              }}
              className="mt-3 text-xs font-semibold
                text-[#4B3621] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* ================================ */}
        {/* CONTACT CTA                      */}
        {/* ================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-14 bg-[#4B3621] rounded-2xl p-8
            text-center relative overflow-hidden"
        >
          {/* Decorative */}
          <div
            className="absolute -top-10 -right-10 w-40 h-40
            bg-[#D4AF37]/10 rounded-full blur-2xl
            pointer-events-none"
          />

          <div className="relative z-10">
            <p
              className="text-xs font-semibold uppercase
              tracking-widest text-[#D4AF37] mb-2"
            >
              Still need help?
            </p>
            <h2 className="text-xl font-bold text-white mb-2">
              Can't find your answer?
            </h2>
            <p
              className="text-sm text-white/60 mb-7
              max-w-sm mx-auto"
            >
              Our support team is ready to help you with any question.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3
              justify-center"
            >
              <a
                href={`mailto:${t("common.contact_email")}`}
                className="flex items-center justify-center
                  gap-2 px-6 py-2.5 bg-white text-[#4B3621]
                  rounded-xl text-sm font-semibold
                  hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Mail className="w-4 h-4" />
                Email Us
              </a>
              <a
                href={t("common.contact_whatsapp_link")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center
                  gap-2 px-6 py-2.5 bg-[#D4AF37] text-[#2C1F0E]
                  rounded-xl text-sm font-semibold
                  hover:bg-[#c49e30] transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <Link
                to="/contact"
                className="flex items-center justify-center
                  gap-2 px-6 py-2.5 border border-white/20
                  text-white rounded-xl text-sm font-semibold
                  hover:bg-white/10 transition-colors"
              >
                Contact Form
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
