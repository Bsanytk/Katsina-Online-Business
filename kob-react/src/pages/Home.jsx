import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/products";
import { useTranslation } from "../hooks/useTranslation";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import TestimonialsSection from "../components/TestimonialsSection";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowRight,
  Shield,
  Zap,
  MessageCircle,
  Star,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

// ================================
// Animation Variants
// ================================
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

// ================================
// TICKER ITEMS
// ================================
const TICKER_ITEMS = [
  "Verified sellers across Katsina State",
  "KOB Express Delivery — fast & affordable",
  "Authentic local products guaranteed",
  "Direct WhatsApp contact with sellers",
  "New listings added daily",
];

// ================================
// FEATURES
// ================================
const FEATURES = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Verified Sellers",
    desc: "Every seller is manually verified by KOB admin before listing.",
    color: "bg-[#4B3621]",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Quality Products",
    desc: "Authentic goods with honest descriptions and real photos.",
    color: "bg-[#D4AF37]",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Direct Contact",
    desc: "Message any seller directly via WhatsApp in one tap.",
    color: "bg-emerald-600",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "KOB Express",
    desc: "Fast and tracked delivery service across Katsina.",
    color: "bg-blue-600",
  },
];

// ================================
// STATS
// ================================
const STATS = [
  { label: "Verified Sellers", value: "50+" },
  { label: "Products Listed", value: "200+" },
  { label: "Happy Buyers", value: "1K+" },
  { label: "Cities Covered", value: "6+" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const t = useTranslation();

  useEffect(() => {
    getProducts({ pageSize: 6 })
      .then((items) => {
        setProducts(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* ================================ */}
      {/* HERO SECTION                     */}
      {/* ================================ */}
      <section className="relative overflow-hidden bg-[#4B3621]">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-96 h-96
            bg-[#D4AF37]/10 rounded-full blur-3xl"
          />
          <div
            className="absolute -bottom-32 -left-32 w-96 h-96
            bg-white/5 rounded-full blur-3xl"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2
            -translate-y-1/2 w-[600px] h-[600px]
            bg-[#D4AF37]/5 rounded-full blur-3xl"
          />
        </div>

        <div className="container relative z-10 py-20 md:py-28">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span
                className="inline-flex items-center gap-2
                px-4 py-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/30
                rounded-full text-[#D4AF37] text-xs font-semibold
                uppercase tracking-widest mb-6"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full
                  bg-[#D4AF37] animate-pulse"
                />
                Katsina's #1 Online Marketplace
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl font-bold
                text-white mb-5 leading-tight tracking-tight"
            >
              Buy & Sell with <span className="text-[#D4AF37]">Confidence</span>{" "}
              in Katsina
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-white/60
                mb-8 max-w-xl mx-auto leading-relaxed"
            >
              Connect with verified local sellers, discover authentic products,
              and enjoy fast delivery across Katsina State.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3
                justify-center"
            >
              <button
                onClick={() => navigate("/marketplace")}
                className="flex items-center justify-center gap-2
                  px-7 py-3.5 bg-[#D4AF37] text-[#2C1F0E]
                  rounded-xl font-semibold text-sm
                  hover:bg-[#c49e30] transition-all duration-200
                  shadow-lg shadow-[#D4AF37]/20 active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" />
                Explore Marketplace
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate("/register")}
                className="flex items-center justify-center gap-2
                  px-7 py-3.5 border border-white/20 text-white
                  rounded-xl font-semibold text-sm
                  hover:bg-white/10 transition-all duration-200
                  active:scale-[0.98]"
              >
                Start Selling
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center
                gap-4 mt-8 text-white/40 text-xs"
            >
              {[
                "Free to browse",
                "Verified sellers only",
                "WhatsApp support",
              ].map((item, i) => (
                <React.Fragment key={item}>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-[#D4AF37]" />
                    {item}
                  </span>
                  {i < 2 && <span className="w-px h-3 bg-white/20" />}
                </React.Fragment>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ---- Ticker ---- */}
        <div
          className="border-t border-white/10
          bg-white/5 py-3 overflow-hidden"
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 25,
              repeat: Infinity,
            }}
            className="flex whitespace-nowrap gap-12 items-center"
          >
            {[1, 2].map((i) => (
              <span
                key={i}
                className="flex items-center gap-12
                  text-xs font-medium text-white/50
                  uppercase tracking-widest"
              >
                {TICKER_ITEMS.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <span>{item}</span>
                    <span className="text-[#D4AF37]">★</span>
                  </React.Fragment>
                ))}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================ */}
      {/* STATS SECTION                    */}
      {/* ================================ */}
      <section className="bg-white border-b border-gray-100">
        <div className="container py-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center"
              >
                <p className="text-3xl font-bold text-[#4B3621]">
                  {stat.value}
                </p>
                <p
                  className="text-xs text-gray-400 mt-1
                  font-medium uppercase tracking-wider"
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================ */}
      {/* FEATURES SECTION                 */}
      {/* ================================ */}
      <section className="py-16 md:py-20 bg-[#FAFAF8]">
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase
                tracking-widest text-[#D4AF37] mb-3"
            >
              Why KOB
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-2xl md:text-3xl font-bold
                text-[#2C1F0E]"
            >
              Built for Katsina Businesses
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2
              lg:grid-cols-4 gap-5"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="bg-white rounded-2xl p-6
                  border border-gray-100 shadow-sm
                  hover:shadow-md transition-all duration-200
                  hover:-translate-y-0.5 group"
              >
                <div
                  className={`
                  w-12 h-12 rounded-xl flex items-center
                  justify-center text-white mb-4
                  ${feature.color}
                `}
                >
                  {feature.icon}
                </div>
                <h3
                  className="text-sm font-semibold
                  text-[#2C1F0E] mb-2"
                >
                  {feature.title}
                </h3>
                <p
                  className="text-xs text-gray-400
                  leading-relaxed"
                >
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================ */}
      {/* FEATURED PRODUCTS                */}
      {/* ================================ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {/* Section header */}
            <motion.div
              variants={fadeUp}
              className="flex items-end justify-between mb-8"
            >
              <div>
                <p
                  className="text-xs font-semibold uppercase
                  tracking-widest text-[#D4AF37] mb-2"
                >
                  Fresh Listings
                </p>
                <h2
                  className="text-2xl md:text-3xl font-bold
                  text-[#2C1F0E]"
                >
                  Featured Products
                </h2>
              </div>
              <button
                onClick={() => navigate("/marketplace")}
                className="flex items-center gap-1.5
                  text-sm font-semibold text-[#4B3621]
                  hover:text-[#D4AF37] transition-colors
                  group"
              >
                View all
                <ChevronRight
                  className="w-4 h-4
                  group-hover:translate-x-0.5 transition-transform"
                />
              </button>
            </motion.div>

            {/* Products */}
            {loading ? (
              <div className="py-16">
                <Loading size="md" message="Loading featured products..." />
              </div>
            ) : products.length > 0 ? (
              <motion.div
                variants={stagger}
                className="grid grid-cols-2 md:grid-cols-3
                  gap-4 md:gap-5"
              >
                {products.map((p) => (
                  <motion.div key={p.id} variants={fadeUp}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={fadeIn}
                className="py-20 text-center bg-[#FAFAF8]
                  rounded-2xl border border-gray-100"
              >
                <ShoppingBag
                  className="w-12 h-12 text-gray-200
                  mx-auto mb-3"
                />
                <p className="text-sm font-medium text-gray-400">
                  No products available yet
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  Check back soon for new listings
                </p>
              </motion.div>
            )}

            {/* View more CTA */}
            {products.length > 0 && (
              <motion.div variants={fadeUp} className="text-center mt-10">
                <button
                  onClick={() => navigate("/marketplace")}
                  className="inline-flex items-center gap-2
                    px-7 py-3 bg-[#4B3621] text-white
                    rounded-xl text-sm font-semibold
                    hover:bg-[#362818] transition-colors
                    shadow-sm active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Browse All Products
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ================================ */}
      {/* CTA SECTION                      */}
      {/* ================================ */}
      <section
        className="relative overflow-hidden
        bg-[#4B3621] py-16 md:py-20"
      >
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

        <div className="container relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase
                tracking-widest text-[#D4AF37] mb-3"
            >
              Join KOB Today
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-2xl md:text-4xl font-bold
                text-white mb-4"
            >
              Ready to Start Selling?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-sm text-white/60 mb-8
                leading-relaxed"
            >
              Join our growing community of verified sellers and reach thousands
              of buyers across Katsina State.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3
                justify-center"
            >
              <a
                href={t("seller.forms.seller_registration")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2
                  px-7 py-3.5 bg-[#D4AF37] text-[#2C1F0E]
                  rounded-xl font-semibold text-sm
                  hover:bg-[#c49e30] transition-all
                  shadow-lg shadow-[#D4AF37]/20
                  active:scale-[0.98]"
              >
                Become a Seller
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => navigate("/marketplace")}
                className="flex items-center justify-center gap-2
                  px-7 py-3.5 border border-white/20
                  text-white rounded-xl font-semibold text-sm
                  hover:bg-white/10 transition-all
                  active:scale-[0.98]"
              >
                Browse First
              </button>
            </motion.div>

            {/* WhatsApp support line */}
            <motion.p variants={fadeUp} className="mt-6 text-xs text-white/30">
              Need help?{" "}
              <a
                href="https://wa.me/2347089454544"
                target="_blank"
                rel="noreferrer"
                className="text-[#D4AF37] hover:underline"
              >
                Chat with us on WhatsApp
              </a>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ================================ */}
      {/* TESTIMONIALS                     */}
      {/* ================================ */}
      <TestimonialsSection />
    </main>
  );
}
