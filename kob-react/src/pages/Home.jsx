import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Sabon library
import { getProducts } from "../services/products";
import { useTranslation } from "../hooks/useTranslation";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { Button, Card } from "../components/ui";
import TestimonialsSection from "../components/TestimonialsSection";

// 1. Vercel-style Top Loader Component
const TopBarLoader = () => (
  <motion.div
    initial={{ width: "0%", opacity: 1 }}
    animate={{ width: "100%", opacity: 0 }}
    transition={{ duration: 1.5, ease: "easeInOut" }}
    className="fixed top-0 left-0 h-[3px] bg-kob-gold z-[9999] shadow-[0_0_10px_#FBBF24]"
  />
);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const t = useTranslation();

  useEffect(() => {
    // Show a welcome alert after 2 seconds
    const timer = setTimeout(() => setShowAlert(true), 2000);

    getProducts({ pageSize: 6 })
      .then((items) => {
        setProducts(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => clearTimeout(timer);
  }, []);

  // Variants for animations
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <main className="min-h-screen bg-kob-light overflow-x-hidden">
      {/* Vercel Loader */}
      {loading && <TopBarLoader />}

      {/* 2. Animated Global Alert */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4"
          >
            <div className="bg-white border-b-4 border-kob-primary shadow-2xl rounded-2xl p-4 max-w-md w-full flex items-center gap-4 relative">
              <span className="text-2xl">🔥</span>
              <div>
                <h4 className="font-black text-[#4B3621] text-sm uppercase">
                  KOB Marketplace News
                </h4>
                <p className="text-[12px] text-gray-500">
                  Discover verified sellers in Katsina & Kano today!
                </p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="absolute right-4 top-4 text-gray-300 hover:text-red-500"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-kob-primary via-kob-primary-light to-kob-gold text-white py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl"
          ></motion.div>
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"
          ></motion.div>
        </div>

        <div className="container relative z-10 text-center">
          <motion.div {...fadeInUp} className="mb-6">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight italic">
              Katsina Online <span className="text-kob-gold">Business</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-95 font-light mb-8 max-w-3xl mx-auto leading-relaxed">
              The verified bridge between local merchants and quality-seeking
              customers. Authenticity meets convenience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => navigate("/marketplace")}
              size="lg"
              variant="primary"
              className="group shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-10"
            >
              Explore Marketplace{" "}
              <span className="inline-block group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Button>
            <Button
              onClick={() => navigate("/contact")}
              size="lg"
              variant="ghost"
              className="border-2 border-white text-white hover:bg-white hover:text-kob-primary font-bold shadow-md transition-all duration-300"
            >
              Get in Touch
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-kob-dark mb-4">
              Why Choose KOB?
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-kob-primary to-kob-gold rounded-full mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏪",
                title: "Verified Sellers",
                desc: "Secure transactions with ID-verified local merchants",
              },
              {
                icon: "🚚",
                title: "KOB Express",
                desc: "Fast & affordable delivery across Katsina and Kano",
              },
              {
                icon: "💬",
                title: "Direct WhatsApp",
                desc: "Negotiate and close deals directly with sellers instantly",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Card
                  variant="elevated"
                  className="text-center p-10 rounded-[2rem] border-b-4 border-transparent hover:border-kob-primary transition-all duration-500 group"
                >
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-black text-xl text-kob-dark mb-3 uppercase">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-kob-light">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-kob-dark">
                Featured Products
              </h2>
              <div className="w-20 h-1 bg-kob-gold rounded-full mt-3"></div>
            </motion.div>
            <Button
              onClick={() => navigate("/marketplace")}
              variant="ghost"
              className="text-kob-primary font-black hover:bg-kob-primary hover:text-white transition-all duration-500"
            >
              VIEW MARKETPLACE →
            </Button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loading message="Fetching the best deals for you..." />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products.length > 0 ? (
                products.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-[3rem] shadow-inner">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-400 text-lg font-bold uppercase tracking-widest">
                    Marketplace is updating...
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <div className="bg-white py-10">
        <TestimonialsSection />
      </div>

      {/* CTA Section */}
      <section className="relative bg-kob-primary py-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container relative z-10 text-center">
          <motion.h2
            whileInView={{ scale: [0.9, 1] }}
            className="text-4xl md:text-6xl font-black text-white mb-6 uppercase italic"
          >
            Become a Verified Seller
          </motion.h2>
          <p className="text-lg md:text-xl text-kob-gold mb-10 max-w-2xl mx-auto font-bold uppercase tracking-widest">
            Join 75,000+ members in our digital ecosystem.
          </p>
          <a
            href={t("seller.forms.seller_registration")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              size="lg"
              className="bg-white text-kob-primary font-black px-12 py-6 rounded-full shadow-2xl hover:bg-kob-gold hover:text-white transition-all duration-300 transform hover:scale-110"
            >
              REGISTER MY BUSINESS
            </Button>
          </a>
        </div>
      </section>
    </main>
  );
}
