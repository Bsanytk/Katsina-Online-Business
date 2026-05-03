import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  Search,
  MapPin,
  Verified,
  Share2,
  MessageCircle,
  ShoppingBag,
  ArrowLeft,
  Package,
  Star,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SellerRating from "../components/SellerRating";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { updatePageMeta } from "../services/seo";
import { createOrGetConversation } from "../services/chat";
import { useAuth } from "../firebase/auth";

// ================================
// Animation Variants
// ================================
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

// ================================
// Default Avatar
// ================================
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png";

// ================================
// Main Component
// ================================
export default function SellerShop() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startingChat, setStartingChat] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // ================================
  // Fetch shop data
  // ================================
  useEffect(() => {
    async function fetchShopData() {
      try {
        // 1. Fetch seller profile
        const sellerSnap = await getDoc(doc(db, "users", sellerId));

        if (!sellerSnap.exists()) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const sellerData = sellerSnap.data();
        setSeller(sellerData);

        // 2. SEO
        const name =
          sellerData.businessName || sellerData.displayName || "KOB Seller";

        updatePageMeta({
          title: `${name} | KOB Marketplace`,
          description: `Shop authentic products from ${name} on KOB Marketplace.`,
          keywords: `KOB, Katsina, ${name}, marketplace`,
          ogImage: sellerData.photoURL || DEFAULT_AVATAR,
          ogType: "website",
        });

        // 3. Fetch products — live only
        const q = query(
          collection(db, "products"),
          where("ownerUid", "==", sellerId),
          where("isDraft", "==", false)
        );
        const pSnap = await getDocs(q);
        setProducts(pSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Shop fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchShopData();
  }, [sellerId]);

  // ================================
  // Derived values
  // ================================
  const shopName =
    seller?.businessName ||
    seller?.displayName ||
    `KOB-${seller?.kobNumber || "Seller"}`;

  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================================
  // Handlers
  // ================================
  function handleBack() {
    // ✅ Go to dashboard if logged in, else go back
    if (user) {
      navigate("/dashboard");
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  async function handleMessageSeller() {
    if (!user) {
      if (
        window.confirm(
          "You must be logged in to message a seller.\nGo to login now?"
        )
      ) {
        window.location.href = "/login";
      }
      return;
    }

    if (user.uid === sellerId) {
      alert("This is your own shop!");
      return;
    }

    setStartingChat(true);
    try {
      await createOrGetConversation(
        user.uid,
        sellerId,
        sellerId,
        user.displayName || user.email,
        shopName,
        `Shop: ${shopName}`
      );
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to start conversation. Please try again.");
    } finally {
      setStartingChat(false);
    }
  }

  function handleShareShop() {
    const shopUrl = `${window.location.origin}/shop/${sellerId}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${shopName} | KOB Marketplace`,
          text: `Check out ${shopName} on KOB Marketplace!`,
          url: shopUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shopUrl);
      alert("Shop link copied to clipboard!");
    }
  }

  // ================================
  // Loading State
  // ================================
  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#FAFAF8] flex
        items-center justify-center"
      >
        <Loading size="md" message="Loading shop..." />
      </div>
    );
  }

  // ================================
  // Not Found State
  // ================================
  if (notFound || !seller) {
    return (
      <div
        className="min-h-screen bg-[#FAFAF8] flex
        flex-col items-center justify-center text-center p-8"
      >
        <ShoppingBag
          className="w-14 h-14 text-gray-200
          mb-4"
        />
        <h2
          className="text-lg font-semibold text-gray-600
          mb-2"
        >
          Shop not found
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          This seller may no longer be active on KOB.
        </p>
        <button
          onClick={() => navigate("/marketplace")}
          className="px-6 py-2.5 bg-[#4B3621] text-white
            rounded-xl text-sm font-semibold
            hover:bg-[#362818] transition-colors"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  // ================================
  // Render
  // ================================
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* ================================ */}
      {/* HERO BANNER                      */}
      {/* ================================ */}
      <div
        className="relative h-52 md:h-64 bg-[#4B3621]
        overflow-hidden"
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-20 -left-20 w-72 h-72
            bg-[#D4AF37]/10 rounded-full blur-3xl"
          />
          <div
            className="absolute -bottom-20 -right-20 w-96 h-96
            bg-white/5 rounded-full blur-3xl"
          />
        </div>

        {/* Back button */}
        <div className="container relative z-10 pt-5">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2
              bg-white/15 backdrop-blur-md rounded-full
              text-white text-sm font-medium
              hover:bg-white/25 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            {user ? "Dashboard" : "Back"}
          </button>
        </div>

        {/* KOB branding */}
        <div
          className="absolute bottom-5 right-6
          text-white/20 text-xs font-bold uppercase
          tracking-widest"
        >
          KOB Marketplace
        </div>
      </div>

      {/* ================================ */}
      {/* SELLER PROFILE CARD (Floating)   */}
      {/* ================================ */}
      <div className="container relative z-20 -mt-24 md:-mt-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-xl
            border border-gray-100 overflow-hidden"
        >
          <div
            className="p-6 md:p-8 flex flex-col
            md:flex-row items-center gap-6"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-24 h-24 md:w-32 md:h-32
                rounded-2xl border-4 border-white shadow-lg
                overflow-hidden bg-gray-100"
              >
                <img
                  src={seller?.photoURL || DEFAULT_AVATAR}
                  alt={shopName}
                  className="w-full h-full object-cover"
                />
              </div>
              {seller?.isVerified && (
                <div
                  className="absolute -bottom-1 -right-1
                  bg-blue-500 text-white p-1.5 rounded-xl
                  border-2 border-white shadow-sm"
                >
                  <Verified className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div
              className="flex-1 text-center md:text-left
              min-w-0"
            >
              {/* Name + Badge */}
              <div
                className="flex flex-col md:flex-row
                md:items-center gap-2 mb-2"
              >
                <h1
                  className="text-xl md:text-2xl font-bold
                  text-[#2C1F0E] truncate"
                >
                  {shopName}
                </h1>
                {seller?.isVerified && (
                  <span
                    className="inline-flex items-center
                    px-2.5 py-1 bg-[#D4AF37]/10 text-[#4B3621]
                    text-[10px] font-bold rounded-lg
                    border border-[#D4AF37]/20 uppercase
                    tracking-wider flex-shrink-0"
                  >
                    ✓ KOB Verified
                  </span>
                )}
              </div>

              {/* Meta info */}
              <div
                className="flex flex-wrap justify-center
                md:justify-start gap-4 text-xs text-gray-400
                mb-5 font-medium"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {seller?.location || "Katsina State"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {products.length} product{products.length !== 1 ? "s" : ""}
                </span>
                {seller?.kobNumber && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#D4AF37]">🆔</span>
                    {seller.kobNumber}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div
                className="flex flex-wrap justify-center
                md:justify-start gap-3"
              >
                {/* Message Seller */}
                <button
                  onClick={handleMessageSeller}
                  disabled={startingChat}
                  className="flex items-center gap-2 px-5 py-2.5
                    bg-[#4B3621] text-white rounded-xl
                    text-sm font-semibold
                    hover:bg-[#362818] transition-all
                    shadow-sm active:scale-[0.98]
                    disabled:opacity-60
                    disabled:cursor-not-allowed"
                >
                  <MessageCircle className="w-4 h-4" />
                  {startingChat ? "Starting..." : "Message Seller"}
                </button>

                {/* Share */}
                <button
                  onClick={handleShareShop}
                  className="flex items-center gap-2 px-4 py-2.5
                    border border-gray-200 text-gray-500
                    rounded-xl text-sm font-medium
                    hover:border-[#4B3621] hover:text-[#4B3621]
                    transition-all active:scale-[0.98]"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Desktop Rating */}
            <div
              className="hidden lg:flex flex-col items-center
              gap-2 pl-6 border-l border-gray-100 flex-shrink-0"
            >
              <p
                className="text-[10px] font-semibold uppercase
                tracking-widest text-gray-400"
              >
                Performance
              </p>
              <SellerRating sellerId={sellerId} />
            </div>
          </div>

          {/* Mobile Rating */}
          <div
            className="lg:hidden px-6 pb-5 border-t
            border-gray-50 pt-4"
          >
            <p
              className="text-[10px] font-semibold uppercase
              tracking-widest text-gray-400 mb-2 text-center"
            >
              Seller Performance
            </p>
            <div className="flex justify-center">
              <SellerRating sellerId={sellerId} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================================ */}
      {/* CATALOG SECTION                  */}
      {/* ================================ */}
      <div className="container py-10 pb-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col md:flex-row
            md:items-center justify-between gap-4 mb-7"
        >
          {/* Title */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 bg-[#4B3621]/5 rounded-xl
              flex items-center justify-center"
            >
              <LayoutGrid className="w-4 h-4 text-[#4B3621]" />
            </div>
            <div>
              <h2
                className="text-base font-semibold
                text-[#2C1F0E]"
              >
                Product Catalog
              </h2>
              <p className="text-xs text-gray-400">
                {filteredProducts.length} item
                {filteredProducts.length !== 1 ? "s" : ""}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-xs w-full">
            <Search
              className="absolute left-3 top-1/2
              -translate-y-1/2 w-4 h-4 text-gray-400
              pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white
                border border-gray-200 rounded-xl text-sm
                outline-none placeholder:text-gray-400
                focus:border-[#4B3621] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2
                  -translate-y-1/2 text-gray-400
                  hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center bg-white
                rounded-2xl border border-gray-100"
            >
              <ShoppingBag
                className="w-12 h-12 text-gray-200
                mx-auto mb-3"
              />
              <p className="text-sm font-medium text-gray-400">
                {searchTerm
                  ? `No products matching "${searchTerm}"`
                  : "No products available yet"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-3 text-xs font-semibold
                    text-[#4B3621] hover:underline"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3
                lg:grid-cols-4 gap-4"
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={fadeUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================================ */}
      {/* FLOATING WHATSAPP BUTTON         */}
      {/* ================================ */}
      {(seller?.whatsappNumber || seller?.phoneNumber) && (
        <motion.a
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          href={
            user
              ? `https://wa.me/${seller?.whatsappNumber || seller?.phoneNumber}`
              : "/login"
          }
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
              if (
                window.confirm(
                  "You must be logged in to contact seller.\nGo to login now?"
                )
              ) {
                window.location.href = "/login";
              }
            }
          }}
          target={user ? "_blank" : "_self"}
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-50
            bg-[#25D366] text-white p-4 rounded-full
            shadow-xl hover:scale-110 active:scale-95
            transition-transform flex items-center
            justify-center"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>

          {/* Ping animation */}
          <span
            className="absolute -top-1 -right-1
            flex h-4 w-4"
          >
            <span
              className="animate-ping absolute inline-flex
              h-full w-full rounded-full bg-green-400
              opacity-75"
            />
            <span
              className="relative inline-flex rounded-full
              h-4 w-4 bg-green-500 border-2 border-white"
            />
          </span>
        </motion.a>
      )}
    </div>
  );
}
