import React, { useState, useEffect } from "react"; // Kara useState da useEffect anan
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/products";
import { useTranslation } from "../hooks/useTranslation";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { Button, Card } from "../components/ui";
import TestimonialsSection from "../components/TestimonialsSection";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const t = useTranslation();

  useEffect(() => {
    // fetch only a few items for the homepage
    getProducts({ pageSize: 6 })
      .then((items) => {
        setProducts(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-kob-light">
            {/* Hero Section */}     {" "}
      <section className="relative overflow-hidden bg-gradient-to-br from-kob-primary via-kob-primary-light to-kob-gold text-white py-20 md:py-32">
                {/* Decorative Background */}       {" "}
        <div className="absolute inset-0 opacity-10">
                   {" "}
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                   {" "}
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                 {" "}
        </div>
               {" "}
        <div className="container relative z-10 text-center">
                   {" "}
          <div className="mb-6 animate-fade-in">
                       {" "}
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                            Katsina Online Business            {" "}
            </h1>
                        {/* Container na rubutu mai tafiya */}
            <div className="relative flex overflow-hidden border-y border-white/20 py-3 bg-white/5 my-8">
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                whileHover={{ transition: { duration: 0 } }} // Wannan zai tsayar da shi idan an taba // Yana tafiya hagu
                transition={{
                  ease: "linear",
                  duration: 20, // Gudun tafiyar (idan ka rage lamba zai yi sauri)
                  repeat: Infinity, // Ba zai tsaya ba
                }}
                className="flex whitespace-nowrap gap-10 items-center"
              >
                {/* Muna ninka rubutun sau biyu domin kada ya yanke (Infinite Loop) */}
                {[1, 2].map((i) => (
                  <span
                    key={i}
                    className="text-lg md:text-xl font-light tracking-wider uppercase flex gap-10"
                  >
                    <span>
                      Discover authentic local products from verified sellers in
                      Katsina & Kano
                    </span>
                    <span className="text-kob-success">★</span>
                    <span>
                      Support your community while shopping quality goods
                    </span>
                    <span className="text-kob-success">★</span>
                    <span>
                      KOB Express Delivery is now Available at cheap-rates
                    </span>
                    <span className="text-kob-success">★</span>
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
                   {" "}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
                       {" "}
            <Button
              onClick={() => navigate("/marketplace")}
              size="lg"
              variant="primary"
              className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
                            Explore Marketplace            {" "}
            </Button>
                       {" "}
            <Button
              onClick={() => navigate("/contact")}
              size="lg"
              variant="ghost"
              className="border-2 border-white text-white hover:bg-white hover:text-kob-primary font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
                            Get in Touch            {" "}
            </Button>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </section>
            {/* Features Section */}     {" "}
      <section className="py-16 md:py-24 bg-white">
               {" "}
        <div className="container">
                   {" "}
          <div className="text-center mb-16">
                       {" "}
            <h2 className="text-4xl md:text-5xl font-bold text-kob-dark mb-4">
              Why Choose KOB?
            </h2>
                       {" "}
            <div className="w-20 h-1 bg-gradient-to-r from-kob-primary to-kob-gold rounded-full mx-auto"></div>
                     {" "}
          </div>
                   {" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {" "}
            {[
              {
                icon: "🏪",
                title: "Verified Sellers",
                desc: "Buy from trusted local merchants",
              },
              {
                icon: "✅",
                title: "Quality Products",
                desc: "Authentic goods with great value",
              },
              {
                icon: "💬",
                title: "Direct Contact",
                desc: "Message sellers via WhatsApp instantly",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                variant="elevated"
                className="text-center card-hover transform hover:scale-105 transition-all duration-300"
              >
                               {" "}
                <div className="text-6xl mb-4 inline-block">{feature.icon}</div>
                               {" "}
                <h3 className="font-bold text-xl text-kob-dark mb-3">
                  {feature.title}
                </h3>
                               {" "}
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p> 
                           {" "}
              </Card>
            ))}
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </section>
            {/* Featured Products Section */}     {" "}
      <section className="py-16 md:py-24 bg-kob-light">
               {" "}
        <div className="container">
                   {" "}
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
                       {" "}
            <div>
                           {" "}
              <h2 className="text-4xl md:text-5xl font-bold text-kob-dark">
                Featured Products
              </h2>
                           {" "}
              <div className="w-20 h-1 bg-gradient-to-r from-kob-primary to-kob-gold rounded-full mt-3"></div>
                         {" "}
            </div>
                       {" "}
            <Button
              onClick={() => navigate("/marketplace")}
              variant="ghost"
              className="text-kob-primary font-semibold hover:bg-kob-primary hover:text-white transition-all duration-300"
            >
                            View All →            {" "}
            </Button>
                     {" "}
          </div>
                   {" "}
          {loading ? (
            <Loading message="Loading featured products..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                           {" "}
              {products.length > 0 ? (
                products.map((p) => <ProductCard key={p.id} product={p} />)
              ) : (
                <div className="col-span-full text-center py-20">
                                    <div className="text-6xl mb-4">📭</div>     
                             {" "}
                  <p className="text-gray-600 text-lg font-medium">
                    No products available yet. Check back soon!
                  </p>
                                 {" "}
                </div>
              )}
                         {" "}
            </div>
          )}
                 {" "}
        </div>
             {" "}
      </section>
            {/* CTA Section */}     {" "}
      <section className="bg-gradient-to-r from-kob-light to-kob-primary text-white py-16 md:py-20">
               {" "}
        <div className="container text-center">
                   {" "}
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Want to Sell Your Products?
          </h2>
                   {" "}
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
                        Join our community of verified sellers and reach
            thousands of customers across Katsina.          {" "}
          </p>
                   {" "}
          <a
            href={t("seller.forms.seller_registration")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
                       {" "}
            <Button
              size="lg"
              variant="primary"
              className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
                            Become a Seller            {" "}
            </Button>
                     {" "}
          </a>
                 {" "}
        </div>
             {" "}
      </section>
            {/* Testimonials Section */}
            <TestimonialsSection />   {" "}
    </main>
  );
}
