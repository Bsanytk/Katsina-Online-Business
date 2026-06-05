import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getProducts } from "../services/products";
import { useTranslation } from "../hooks/useTranslation";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import TestimonialsSection from "../components/TestimonialsSection";
import QuickStartCard from "../components/pwa/QuickStartCard";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../firebase/auth";

// ================================
// Animation Variants
// ================================
const heroVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ================================
// Constants
// ================================
const CATEGORIES = [
  { label: "Fashion", emoji: "👗", q: "Fashion" },
  { label: "Electronics", emoji: "📱", q: "Electronics" },
  { label: "Footwear", emoji: "👟", q: "Footwear" },
  { label: "Beauty", emoji: "💄", q: "Beauty" },
  { label: "Jewellery", emoji: "💍", q: "Jewellery" },
  { label: "Food", emoji: "🍱", q: "Food" },
  { label: "Gadgets", emoji: "💻", q: "Gadgets" },
  { label: "Home", emoji: "🛋️", q: "Home" },
  { label: "Kids", emoji: "🧸", q: "Kids" },
  { label: "Books", emoji: "📚", q: "Books" },
];

const TICKER = [
  "Verified Sellers Only",
  "KOB Express Delivery",
  "Authentic Local Products",
  "Direct WhatsApp Contact",
  "New Listings Daily",
];

const WHY_KOB = [
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112
          2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0
          003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332
          9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "Verified Sellers",
    desc: "Every seller is manually verified before listing.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03
          8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512
          15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    title: "Direct Contact",
    desc: "Message any seller instantly via WhatsApp.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
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
    title: "Quality Products",
    desc: "Authentic goods with real photos and honest pricing.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "KOB Express",
    desc: "Fast tracked delivery across Katsina State.",
  },
];

// ================================
// Toast Notification
// ================================
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -60, scale: 0.95 }}
      className="fixed top-4 left-1/2 -translate-x-1/2
        z-[100] max-w-sm w-full mx-4"
    >
      <div
        className="flex items-center gap-3 px-4 py-3.5
        bg-[#4B3621] text-white rounded-2xl shadow-2xl
        shadow-[#4B3621]/30"
      >
        <div
          className="w-8 h-8 bg-white/15 rounded-xl
          flex items-center justify-center flex-shrink-0
          text-sm"
        >
          🏪
        </div>
        <p
          className="text-xs font-semibold leading-snug
          flex-1"
        >
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white
            flex-shrink-0"
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
      </div>
    </motion.div>
  );
}

// ================================
// Main Home
// ================================
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const t = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    getProducts({ pageSize: 6 })
      .then((items) => {
        setProducts(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ✅ Smart "Start Selling" handler
  function handleStartSelling() {
    if (!user) {
      navigate("/register");
      return;
    }
    if (user.role === "seller") {
      setToast(
        "You are already a registered seller! Redirecting to your dashboard..."
      );
      setTimeout(() => navigate("/dashboard"), 2000);
      return;
    }
    if (user.role === "admin") {
      navigate("/admin");
      return;
    }
    // Buyer — redirect to register as seller
    navigate("/register");
  }

  return (
    <main
      className="min-h-screen bg-[#FAFAF8]
      pb-20 lg:pb-0"
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>


      {/* ================================ */}
      {/* HERO                             */}
      {/* ================================ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(155deg, #3d2619 0%, #60412f 45%, #a68b70 80%, #ded7cf 100%)",
        }}
      >
        {/* Gyararre: Warm gold bloom — Now moved to Left Middle with low transparency */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-32 h-[500px] w-[500px] rounded-full blur-[120px] pointer-events-none"
          style={{
            // An cire farin gaba daya, sannan transparent din yana da matukar santsi (0.08) don kar ya turnuke rubutu
            background: "radial-gradient(circle at left, rgba(248,184,93,0.08) 0%, transparent 65%)",
          }}
        />
        

        <div
          className="container relative z-10"
          style={{ paddingTop: "2.5rem", paddingBottom: "3rem" }}
        >
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} style={{ marginBottom: "1.5rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.375rem 1.125rem",
                  background: "rgba(248,184,93,0.12)",
                  border: "1px solid rgba(248,184,93,0.22)",
                  borderRadius: "9999px",
                  color: "#f8b85d",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#f8b85d",
                    boxShadow: "0 0 8px rgba(248,184,93,0.8)",
                    flexShrink: 0,
                  }}
                />
                Katsina's #1 Online Marketplace
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div variants={fadeUp} style={{ marginBottom: "0.5rem" }}>

              {/* KOB — brand cream, Montserrat Black */}
              <h1
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(3.25rem, 12vw, 6rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.025em",
                  color: "#ded7cf",
                  margin: 0,
                  padding: 0,
                }}
              >
                KOB
              </h1>

              {/* Marketplace — brand amber solid, NO webkit gradient bug */}
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.6rem, 5.5vw, 2.9rem)",
                  lineHeight: 1.15,
                  letterSpacing: "0.05em",
                  color: "#f8b85d",
                  margin: "0.3rem 0 0 0",
                  padding: 0,
                }}
              >
                Marketplace
              </h2>

              {/* Gold swoosh — brand amber to sand gold */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1.1rem",
                }}
              >
                <svg
                  viewBox="0 0 240 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    width: "clamp(150px, 38vw, 230px)",
                    height: "auto",
                  }}
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="swooshBrand"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%"   stopColor="#f8b85d" stopOpacity="0.05" />
                      <stop offset="35%"  stopColor="#f8b85d" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#d6a666" stopOpacity="0.65" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M8 18 Q90 4 218 8"
                    stroke="url(#swooshBrand)"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M207 3 L220 8 L208 14"
                    stroke="url(#swooshBrand)"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 500,
                fontSize: "0.875rem",
                color: "#ceb99e",
                lineHeight: 1.75,
                maxWidth: "28rem",
                margin: "1.5rem auto 2.25rem",
                letterSpacing: "0.01em",
              }}
            >
              Discover authentic products from verified local sellers.
              Buy, sell, and connect — all in one place.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => navigate("/marketplace")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.9rem 2.25rem",
                  background: "#f8b85d",
                  color: "#3d2619",
                  borderRadius: "14px",
                  border: "none",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  letterSpacing: "0.03em",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(248,184,93,0.28)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d6a666";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(248,184,93,0.38)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f8b85d";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(248,184,93,0.28)";
                }}
              >
                <svg
                  style={{ width: "16px", height: "16px", flexShrink: 0 }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Explore Marketplace
              </button>

              <button
                onClick={handleStartSelling}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.9rem 2.25rem",
                  background: "rgba(222,215,207,0.07)",
                  color: "#ded7cf",
                  borderRadius: "14px",
                  border: "1px solid rgba(222,215,207,0.18)",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  letterSpacing: "0.03em",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(222,215,207,0.13)";
                  e.currentTarget.style.borderColor = "rgba(248,184,93,0.35)";
                  e.currentTarget.style.color = "#f8b85d";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(222,215,207,0.07)";
                  e.currentTarget.style.borderColor = "rgba(222,215,207,0.18)";
                  e.currentTarget.style.color = "#ded7cf";
                }}
              >
                Start Selling Free
              </button>
            </motion.div>

            {/* Trust row */}
            <motion.div
              variants={fadeUp}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.25rem",
                marginTop: "2rem",
              }}
            >
              {["Free to browse", "Verified sellers", "WhatsApp support"].map(
                (item, i) => (
                  <React.Fragment key={item}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        color: "#7c6250",
                        fontSize: "0.7rem",
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 600,
                        letterSpacing: "0.03em",
                      }}
                    >
                      <svg
                        style={{ width: "11px", height: "11px", color: "#f8b85d" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0
                          01-1.414 0l-4-4a1 1 0 011.414-1.414L8
                          12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item}
                    </span>
                    {i < 2 && (
                      <span
                        aria-hidden="true"
                        style={{
                          width: "1px",
                          height: "11px",
                          background: "#7c6250",
                          opacity: 0.4,
                        }}
                      />
                    )}
                  </React.Fragment>
                )
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Ticker */}
        <div
          style={{
            borderTop: "1px solid rgba(124,98,80,0.2)",
            background: "rgba(61,38,25,0.5)",
            padding: "0.75rem 0",
            overflow: "hidden",
          }}
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 32, repeat: Infinity }}
            style={{
              display: "flex",
              whiteSpace: "nowrap",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            {[1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4rem",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  fontFamily: "'Montserrat', sans-serif",
                  color: "#7c6250",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                {TICKER.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <span>{item}</span>
                    <span style={{ color: "#f8b85d", opacity: 0.6 }}>★</span>
                  </React.Fragment>
                ))}
              </span>
            ))}
          </motion.div>
        </div>
      </section>
      
                    

      <QuickStartCard />

      {/* ================================ */}
      {/* STATS BAR                        */}
      {/* ================================ */}
      <section className="bg-[#4B3621]">
        <div className="container py-5">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: "50+", label: "Verified Sellers" },
              { value: "200+", label: "Products Listed" },
              { value: "1K+", label: "Happy Buyers" },
              { value: "6+", label: "Cities Covered" },
            ].map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="text-center"
              >
                <p className="text-2xl font-black text-[#D4AF37]">{s.value}</p>
                <p
                  className="text-[10px] text-white/40 mt-0.5
                  font-medium uppercase tracking-wider"
                >
                  {s.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================ */}
      {/* CATEGORIES                       */}
      {/* ================================ */}
      <section className="py-10 bg-white">
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <p
                  className="text-[10px] font-bold uppercase
                  tracking-widest text-[#D4AF37] mb-1"
                >
                  Categories
                </p>
                <h2 className="text-xl font-bold text-[#2C1F0E]">
                  Browse by Category
                </h2>
              </div>
              <Link
                to="/marketplace"
                className="text-xs font-semibold
                  text-[#4B3621] hover:text-[#D4AF37]
                  transition-colors flex items-center gap-1"
              >
                View all
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </motion.div>

            <div
              className="grid grid-cols-5 md:grid-cols-10
              gap-3"
            >
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.label}
                  variants={fadeUp}
                  onClick={() => navigate(`/marketplace?category=${cat.q}`)}
                  className="flex flex-col items-center gap-2
                    p-3 rounded-2xl bg-white border border-gray-100
                    shadow-sm hover:shadow-md
                    hover:-translate-y-0.5 transition-all
                    group"
                >
                  <div
                    className="w-11 h-11 rounded-2xl
                    bg-[#4B3621]/5 flex items-center
                    justify-center text-xl
                    group-hover:bg-[#4B3621]/10
                    transition-colors"
                  >
                    {cat.emoji}
                  </div>
                  <p
                    className="text-[9px] font-semibold
                    text-gray-500 text-center leading-tight
                    group-hover:text-[#4B3621]
                    transition-colors"
                  >
                    {cat.label}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================ */}
      {/* FEATURED PRODUCTS                */}
      {/* ================================ */}
      <section className="py-10 bg-[#FAFAF8]">
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeUp}
              className="flex items-end justify-between mb-7"
            >
              <div>
                <p
                  className="text-[10px] font-bold uppercase
                  tracking-widest text-[#D4AF37] mb-1"
                >
                  Fresh Listings
                </p>
                <h2 className="text-xl font-bold text-[#2C1F0E]">
                  Featured Products
                </h2>
              </div>
              <button
                onClick={() => navigate("/marketplace")}
                className="text-xs font-semibold text-[#4B3621]
                  hover:text-[#D4AF37] transition-colors
                  flex items-center gap-1 group"
              >
                View all
                <svg
                  className="w-3.5 h-3.5
                  group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </motion.div>

            {loading ? (
              <div className="py-16">
                <Loading size="md" message="Loading products..." />
              </div>
            ) : products.length > 0 ? (
              <motion.div
                variants={stagger}
                className="grid grid-cols-2 md:grid-cols-3
                  gap-4 md:gap-5"
              >
                {products.map((p) => (
                  <motion.div key={p.id} variants={fadeUp} className="group">
                    {/* Blur-up image placeholder */}
                    <div
                      className="relative overflow-hidden
                      rounded-2xl bg-gray-100"
                    >
                      <ProductCard product={p} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={fadeUp}
                className="py-20 text-center bg-white
                  rounded-2xl border border-gray-100"
              >
                <svg
                  className="w-12 h-12 text-gray-200
                  mx-auto mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-sm text-gray-400">
                  No products available yet
                </p>
              </motion.div>
            )}

            {products.length > 0 && (
              <motion.div variants={fadeUp} className="text-center mt-8">
                <button
                  onClick={() => navigate("/marketplace")}
                  className="inline-flex items-center gap-2
                    px-8 py-3.5 bg-[#4B3621] text-white
                    rounded-xl text-sm font-semibold
                    hover:bg-[#362818] transition-colors
                    shadow-sm active:scale-[0.98]"
                >
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Browse All Products
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ================================ */}
      {/* WHY KOB                          */}
      {/* ================================ */}
      <section className="py-12 bg-white">
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="text-center mb-10">
              <div
                className="flex items-center gap-4
                justify-center mb-3"
              >
                <div
                  className="h-px flex-1 max-w-16
                  bg-[#D4AF37]/30"
                />
                <span
                  className="text-[10px] font-bold uppercase
                  tracking-widest text-[#D4AF37]"
                >
                  Why KOB?
                </span>
                <div
                  className="h-px flex-1 max-w-16
                  bg-[#D4AF37]/30"
                />
              </div>
              <h2 className="text-2xl font-bold text-[#2C1F0E]">
                Built for Katsina Businesses
              </h2>
            </motion.div>

            <div
              className="grid grid-cols-2 md:grid-cols-4
              gap-4"
            >
              {WHY_KOB.map((item, idx) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-5
                    border border-gray-100 shadow-sm
                    hover:shadow-md hover:-translate-y-0.5
                    transition-all group"
                >
                  <div
                    className="w-11 h-11 rounded-2xl
                    bg-[#4B3621] flex items-center
                    justify-center text-white mb-4 flex-shrink-0"
                  >
                    {item.icon}
                  </div>
                  <h3
                    className="text-xs font-bold
                    text-[#2C1F0E] mb-1.5
                    group-hover:text-[#4B3621]
                    transition-colors"
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[10px] text-gray-400
                    leading-relaxed"
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================ */}
      {/* SELLER CTA                       */}
      {/* ================================ */}
      <section
        className="relative overflow-hidden py-14
        bg-gradient-to-br from-[#2C1F0E] via-[#4B3621]
        to-[#6B4C31]"
      >
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

        <div className="container relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl md:text-4xl font-black
                text-white mb-3 leading-tight"
            >
              Ready to Start Selling?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm text-white/60 mb-8">
              Join verified sellers reaching thousands of buyers across Katsina
              State.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3
                justify-center"
            >
              <button
                onClick={handleStartSelling}
                className="flex items-center justify-center
                  gap-2 px-7 py-3.5 bg-[#D4AF37]
                  text-[#2C1F0E] rounded-xl font-bold text-sm
                  hover:bg-[#c49e30] transition-all
                  shadow-lg shadow-[#D4AF37]/20
                  active:scale-[0.98]"
              >
                Become a Seller
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>

              <button
                onClick={() => navigate("/marketplace")}
                className="flex items-center justify-center
                  gap-2 px-7 py-3.5 border-2 border-white/20
                  text-white rounded-xl font-semibold text-sm
                  hover:bg-white/10 transition-all
                  active:scale-[0.98]"
              >
                Browse First
              </button>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-5 text-xs text-white/30">
              Need help?{" "}
              <a
                href="https://wa.me/2347089454544"
                target="_blank"
                rel="noreferrer"
                className="text-[#D4AF37] hover:underline"
              >
                Chat on WhatsApp
              </a>
            </motion.p>
          </motion.div>
        </div>
      </section>

      <TestimonialsSection />
    </main>
  );
}
