import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  collection, query, where,
  getDocs, doc, getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
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
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};

// ================================
// Constants
// ================================
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png";

// ================================
// SVG Icons
// ================================
const Icons = {
  ArrowLeft: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0
          01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Package: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4
          7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2
          2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Badge: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0
          001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0
          001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0
          00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0
          00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0
          01-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0
          01-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0
          01-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0
          00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  Verified: () => (
    <svg className="w-3.5 h-3.5" fill="currentColor"
      viewBox="0 0 24 24">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0
        0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0
        003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332
        9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  X: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Share: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0
          2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0
          0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0
          105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  Message: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03
          8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512
          15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  ShoppingBag: () => (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  Store: () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293
          2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0
          100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  WhatsApp: () => (
    <svg className="w-5 h-5" fill="currentColor"
      viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94
        1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198
        0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077
        4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421
        7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0
        01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0
        012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495
        0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0
        005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
}

// ================================
// Auth Required Modal
// ================================
function AuthModal({ type, shopUrl, onClose }) {
  const navigate = useNavigate()

  function handleLogin() {
    // Save seller shop URL to return after login
    sessionStorage.setItem('returnTo', shopUrl)
    navigate('/login')
  }

  function handleRegister() {
    sessionStorage.setItem('returnTo', shopUrl)
    navigate('/register')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm
          z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl
            max-w-sm w-full overflow-hidden"
        >
          {/* Modal Header */}
          <div className="bg-[#4B3621] px-6 py-6 text-center
            relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8
                bg-white/10 rounded-full flex items-center
                justify-center text-white/70
                hover:bg-white/20 transition-colors"
            >
              <Icons.X />
            </button>
            <div className="w-14 h-14 bg-white/10 rounded-2xl
              flex items-center justify-center mx-auto mb-3">
              {type === 'whatsapp' ? (
                <div className="text-white">
                  <Icons.WhatsApp />
                </div>
              ) : (
                <div className="text-white">
                  <Icons.Message />
                </div>
              )}
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {type === 'whatsapp'
                ? 'Contact Seller on WhatsApp'
                : 'Message Seller'
              }
            </h3>
            <p className="text-xs text-white/60">
              Please sign in to continue
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <p className="text-sm text-gray-500 text-center
              mb-6 leading-relaxed">
              You need an account to contact sellers.
              Join KOB to connect with verified merchants
              across Katsina.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full py-3 bg-[#4B3621] text-white
                  rounded-2xl text-sm font-semibold
                  hover:bg-[#362818] transition-colors
                  flex items-center justify-center gap-2"
              >
                Sign In to Continue
              </button>
              <button
                onClick={handleRegister}
                className="w-full py-3 border-2 border-[#4B3621]
                  text-[#4B3621] rounded-2xl text-sm font-semibold
                  hover:bg-[#4B3621] hover:text-white
                  transition-all flex items-center
                  justify-center gap-2"
              >
                Create Free Account
              </button>
            </div>

            <p className="text-center text-[10px] text-gray-400
              mt-4">
              Free to join · No credit card required
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ================================
// Main Component
// ================================
export default function SellerShop() {
  const { sellerId }  = useParams()
  const navigate      = useNavigate()
  const location      = useLocation()
  const { user }      = useAuth()

  const [seller, setSeller]           = useState(null)
  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [searchTerm, setSearchTerm]   = useState("")
  const [startingChat, setStartingChat] = useState(false)
  const [notFound, setNotFound]       = useState(false)
  const [authModal, setAuthModal]     = useState(null) // 'whatsapp' | 'message' | null
  const [copied, setCopied]           = useState(false)

  // Shop URL for sharing + return after login
  const shopUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/shop/${sellerId}`
    : `/shop/${sellerId}`

  // ================================
  // Return to shop after login
  // ================================
  useEffect(() => {
    const returnTo = sessionStorage.getItem('returnTo')
    if (returnTo && user) {
      sessionStorage.removeItem('returnTo')
      // Already on the right page — no redirect needed
    }
  }, [user])

  // ================================
  // Fetch shop data
  // ================================
  useEffect(() => {
    async function fetchShopData() {
      try {
        const sellerSnap = await getDoc(
          doc(db, "users", sellerId)
        )

        if (!sellerSnap.exists()) {
          setNotFound(true)
          setLoading(false)
          return
        }

        const sellerData = sellerSnap.data()
        setSeller(sellerData)

        const name =
          sellerData.businessName ||
          sellerData.displayName  ||
          "KOB Seller"

        updatePageMeta({
          title:       `${name} | KOB Marketplace`,
          description: `Shop authentic products from ${name} on KOB Marketplace.`,
          keywords:    `KOB, Katsina, ${name}, marketplace`,
          ogImage:     sellerData.photoURL || DEFAULT_AVATAR,
          ogType:      "website",
        })

        // Fetch live products only
        const q = query(
          collection(db, "products"),
          where("ownerUid", "==", sellerId),
          where("isDraft",  "==", false)
        )
        const pSnap = await getDocs(q)
        setProducts(
          pSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        )
      } catch (err) {
        console.error("Shop fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchShopData()
  }, [sellerId])

  // ================================
  // Derived values
  // ================================
  const shopName =
    seller?.businessName ||
    seller?.displayName  ||
    `KOB-${seller?.kobNumber || "Seller"}`

  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Format join date
  const joinDate = seller?.createdAt
    ? new Date(seller.createdAt).toLocaleDateString("en-GB", {
        day:   "2-digit",
        month: "2-digit",
        year:  "numeric",
      })
    : null

  // ================================
  // Back Button Handler
  // ================================
  function handleBack() {
    // Reset search — show full catalogue
    setSearchTerm("")

    if (user) {
      navigate("/dashboard")
    } else if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate("/marketplace")
    }
  }

  // ================================
  // Message Seller Handler
  // ================================
  async function handleMessageSeller() {
    if (!user) {
      setAuthModal('message')
      return
    }
    if (user.uid === sellerId) {
      alert("This is your own shop!")
      return
    }

    setStartingChat(true)
    try {
      await createOrGetConversation(
        user.uid,
        sellerId,
        sellerId,
        user.displayName || user.email,
        shopName,
        `Shop: ${shopName}`
      )
      navigate("/dashboard")
    } catch (err) {
      alert("Failed to start conversation. Please try again.")
    } finally {
      setStartingChat(false)
    }
  }

  // ================================
  // WhatsApp Handler
  // ================================
  function handleWhatsApp() {
    if (!user) {
      setAuthModal('whatsapp')
      return
    }
    if (user.uid === sellerId) {
      alert("This is your own shop!")
      return
    }

    const number = seller?.whatsappNumber || seller?.phoneNumber
    if (!number) {
      alert("Seller has not set up WhatsApp contact yet.")
      return
    }

    const message = encodeURIComponent(
      `Hello ${shopName}! I found your shop on KOB Marketplace and I'm interested in your products.`
    )
    window.open(
      `https://wa.me/${number}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  // ================================
  // Share Handler
  // ================================
  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: `${shopName} | KOB Marketplace`,
        text:  `Check out ${shopName} on KOB Marketplace!`,
        url:   shopUrl,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(shopUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // ================================
  // Loading State
  // ================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]
        flex items-center justify-center">
        <Loading size="md" message="Loading shop..." />
      </div>
    )
  }

  // ================================
  // Not Found State
  // ================================
  if (notFound || !seller) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]
        flex flex-col items-center justify-center
        text-center p-8">
        <div className="text-gray-200 mb-4">
          <Icons.Store />
        </div>
        <h2 className="text-lg font-semibold text-gray-600 mb-2">
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
    )
  }

  // ================================
  // Render
  // ================================
  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* Auth Modal */}
      {authModal && (
        <AuthModal
          type={authModal}
          shopUrl={shopUrl}
          onClose={() => setAuthModal(null)}
        />
      )}

      {/* ================================ */}
      {/* HERO BANNER                      */}
      {/* ================================ */}
      <div className="relative h-48 md:h-60 bg-[#4B3621]
        overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72
            bg-[#D4AF37]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96
            bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Back Button */}
        <div className="container relative z-10 pt-5">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2
              bg-white/15 backdrop-blur-md rounded-full
              text-white text-sm font-medium
              hover:bg-white/25 transition-all duration-200"
          >
            <Icons.ArrowLeft />
            {user ? "Dashboard" : "Back"}
          </button>
        </div>

        {/* KOB branding watermark */}
        <div className="absolute bottom-4 right-5
          text-white/15 text-xs font-bold uppercase
          tracking-widest select-none">
          KOB Marketplace
        </div>
      </div>

      {/* ================================ */}
      {/* SELLER PROFILE CARD (Floating)   */}
      {/* ================================ */}
      <div className="container relative z-20 -mt-20 md:-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-xl
            border border-gray-100 overflow-hidden"
        >
          <div className="p-6 md:p-8 flex flex-col
            md:flex-row items-center gap-6">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28
                rounded-2xl border-4 border-white shadow-lg
                overflow-hidden bg-gray-100">
                <img
                  src={seller?.photoURL || DEFAULT_AVATAR}
                  alt={shopName}
                  className="w-full h-full object-cover"
                />
              </div>
              {seller?.isVerified && (
                <div className="absolute -bottom-1 -right-1
                  bg-blue-500 text-white p-1.5 rounded-xl
                  border-2 border-white shadow-sm">
                  <Icons.Verified />
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div className="flex-1 text-center md:text-left
              min-w-0">

              {/* Name + Verified Badge */}
              <div className="flex flex-col md:flex-row
                md:items-center gap-2 mb-2">
                <h1 className="text-xl md:text-2xl font-bold
                  text-[#2C1F0E] truncate">
                  {shopName}
                </h1>
                {seller?.isVerified && (
                  <span className="inline-flex items-center gap-1
                    px-2.5 py-1 bg-[#D4AF37]/10 text-[#4B3621]
                    text-[10px] font-bold rounded-lg
                    border border-[#D4AF37]/20 uppercase
                    tracking-wider flex-shrink-0">
                    <Icons.Badge />
                    KOB Verified
                  </span>
                )}
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap justify-center
                md:justify-start gap-3 text-xs text-gray-400
                mb-5 font-medium">

                <span className="flex items-center gap-1.5">
                  <span className="text-[#D4AF37]">
                    <Icons.MapPin />
                  </span>
                  {seller?.location || "Katsina State"}
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="text-[#D4AF37]">
                    <Icons.Package />
                  </span>
                  {products.length} product{products.length !== 1 ? 's' : ''}
                </span>

                {seller?.kobNumber && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#D4AF37]">🆔</span>
                    {seller.kobNumber}
                  </span>
                )}

                {/* ✅ Join Date */}
                {joinDate && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#D4AF37]">
                      <Icons.Calendar />
                    </span>
                    KOB since {joinDate}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center
                md:justify-start gap-3">

                {/* Message Seller */}
                <button
                  onClick={handleMessageSeller}
                  disabled={startingChat}
                  className="flex items-center gap-2 px-5 py-2.5
                    bg-[#4B3621] text-white rounded-xl
                    text-sm font-semibold hover:bg-[#362818]
                    transition-all shadow-sm active:scale-[0.98]
                    disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Icons.Message />
                  {startingChat ? "Starting..." : "Message Seller"}
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2.5
                    border border-gray-200 text-gray-500
                    rounded-xl text-sm font-medium
                    hover:border-[#4B3621] hover:text-[#4B3621]
                    transition-all active:scale-[0.98]"
                >
                  <Icons.Share />
                  {copied ? "Copied!" : "Share"}
                </button>

              </div>
            </div>

            {/* Desktop Rating */}
            <div className="hidden lg:flex flex-col
              items-center gap-2 pl-6 border-l
              border-gray-100 flex-shrink-0">
              <p className="text-[10px] font-semibold
                uppercase tracking-widest text-gray-400">
                Performance
              </p>
              <SellerRating sellerId={sellerId} />
            </div>

          </div>

          {/* Mobile Rating */}
          <div className="lg:hidden px-6 pb-5 border-t
            border-gray-50 pt-4">
            <p className="text-[10px] font-semibold uppercase
              tracking-widest text-gray-400 mb-2 text-center">
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
      <div className="container py-8 pb-24">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col md:flex-row
            md:items-center justify-between gap-4 mb-6"
        >
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#4B3621]/5 rounded-xl
              flex items-center justify-center">
              <svg className="w-4 h-4 text-[#4B3621]"
                fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0
                    01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0
                    012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2
                    2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0
                    012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14
                    16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0
                    01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold
                text-[#2C1F0E]">
                Product Catalog
              </h2>
              <p className="text-xs text-gray-400">
                {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-xs w-full">
            <span className="absolute left-3 top-1/2
              -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icons.Search />
            </span>
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
                  hover:text-gray-600 transition-colors"
              >
                <Icons.X />
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
              <div className="text-gray-200 mx-auto mb-3
                w-fit">
                <Icons.ShoppingBag />
              </div>
              <p className="text-sm font-medium text-gray-400">
                {searchTerm
                  ? `No products matching "${searchTerm}"`
                  : "No products available yet"
                }
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
                <motion.div
                  key={product.id}
                  variants={fadeUp}
                >
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
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          onClick={handleWhatsApp}
          className="fixed bottom-6 right-6 z-40
            bg-[#25D366] text-white p-4 rounded-full
            shadow-xl hover:scale-110 active:scale-95
            transition-transform flex items-center
            justify-center"
          aria-label="Contact on WhatsApp"
        >
          <Icons.WhatsApp />

          {/* Ping animation */}
          <span className="absolute -top-1 -right-1
            flex h-4 w-4">
            <span className="animate-ping absolute inline-flex
              h-full w-full rounded-full bg-green-400
              opacity-75" />
            <span className="relative inline-flex rounded-full
              h-4 w-4 bg-green-500 border-2 border-white" />
          </span>
        </motion.button>
      )}

    </div>
  )
}
