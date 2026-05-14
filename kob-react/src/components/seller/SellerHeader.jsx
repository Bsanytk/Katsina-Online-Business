/**
 * SellerHeader.jsx — KOB Professional Storefront Header
 * Mobile-first, lightweight, marketplace-grade
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ================================
// SVG Icons
// ================================
const Icons = {
  Verified: () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M6.267 3.455a3.066 3.066 0
        001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0
        001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304
        1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0
        00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066
        0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0
        00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066
        0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0
        00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1
        1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0
        00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  MapPin: () => (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827
        0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  Package: () => (
    <svg
      className="w-3.5 h-3.5"
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
  Calendar: () => (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2
        0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  Share: () => (
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
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0
        2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0
        0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0
        105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  ),
  Message: () => (
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
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03
        8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512
        15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  ),
  Back: () => (
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
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  ),
  WhatsApp: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94
      1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198
      0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077
      4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"
      />
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438
      5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477
      10-10S17.523 2 12 2z"
      />
    </svg>
  ),
};

// ================================
// Format join date
// ================================
function formatJoinDate(val) {
  if (!val) return null;
  try {
    const d = val?.toDate?.() ? val.toDate() : new Date(val);
    return d.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

// ================================
// SellerHeader
// ================================
export default function SellerHeader({
  seller,
  products = [],
  shopUrl,
  isOwnShop,
  onMessage,
  onWhatsApp,
  onBack,
}) {
  const [copied, setCopied] = useState(false);

  const joinDate = formatJoinDate(seller?.createdAt);

  const shopName = seller?.businessName || seller?.displayName || "KOB Shop";

  // ================================
  // Share handler
  // ================================
  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${shopName} | KOB Marketplace`,
          text: `Check out ${shopName} on KOB!`,
          url: shopUrl,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(shopUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="bg-white border-b border-gray-100">
      {/* ============================== */}
      {/* HERO BANNER                    */}
      {/* ============================== */}
      <div
        className="relative h-36 md:h-48
        bg-gradient-to-br from-[#2C1F0E]
        via-[#4B3621] to-[#6B4C31] overflow-hidden"
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-16 -right-16 w-64 h-64
            bg-[#D4AF37]/10 rounded-full blur-3xl"
          />
          <div
            className="absolute -bottom-8 -left-8 w-40 h-40
            bg-white/5 rounded-full blur-2xl"
          />
        </div>

        {/* KOB watermark */}
        <div
          className="absolute bottom-3 right-4
          text-white/10 text-xs font-black uppercase
          tracking-[0.3em] select-none"
        >
          KOB Marketplace
        </div>

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2
              bg-black/30 backdrop-blur-sm rounded-full
              text-white text-xs font-semibold
              hover:bg-black/40 transition-all
              active:scale-[0.97]"
          >
            <Icons.Back />
            Back
          </button>
        </div>

        {/* Own shop indicator */}
        {isOwnShop && (
          <div
            className="absolute top-4 right-4
            px-3 py-1.5 bg-[#D4AF37] text-[#2C1F0E]
            rounded-full text-[10px] font-black
            uppercase tracking-wider shadow-lg"
          >
            Your Shop
          </div>
        )}
      </div>

      {/* ============================== */}
      {/* SELLER PROFILE CARD (floating) */}
      {/* ============================== */}
      <div className="px-4 md:px-6 pb-5">
        {/* Avatar + actions row */}
        <div
          className="flex items-end justify-between
          -mt-10 mb-4"
        >
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-20 h-20 md:w-24 md:h-24
              rounded-2xl border-4 border-white shadow-xl
              overflow-hidden bg-[#4B3621] flex items-center
              justify-center flex-shrink-0"
            >
              <img
                src={seller?.photoURL}
                alt={shopName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              {!seller?.photoURL && (
                <span className="text-white text-2xl font-black">
                  {shopName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Verified indicator on avatar */}
            {seller?.isVerified && (
              <div
                className="absolute -bottom-1 -right-1
                bg-[#D4AF37] text-white p-1.5 rounded-xl
                border-2 border-white shadow-sm"
              >
                <Icons.Verified />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pb-1">
            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2
                border border-gray-200 text-gray-500
                rounded-xl text-xs font-semibold
                hover:border-[#4B3621] hover:text-[#4B3621]
                transition-all active:scale-[0.97]"
            >
              <Icons.Share />
              {copied ? "Copied!" : "Share"}
            </button>

            {/* Message — triggers auth if needed */}
            {!isOwnShop && (
              <button
                onClick={onMessage}
                className="flex items-center gap-1.5 px-4 py-2
                  bg-[#4B3621] text-white rounded-xl text-xs
                  font-semibold hover:bg-[#362818]
                  transition-all shadow-sm active:scale-[0.97]"
              >
                <Icons.Message />
                Message
              </button>
            )}
          </div>
        </div>

        {/* Name + Badges */}
        <div className="mb-2">
          <div
            className="flex flex-wrap items-center
            gap-2 mb-1"
          >
            <h1
              className="text-xl md:text-2xl font-bold
              text-[#2C1F0E] leading-tight"
            >
              {shopName}
            </h1>
          </div>

          {/* Badge row */}
          <div className="flex flex-wrap gap-2 mb-3">
            {seller?.isVerified && (
              <span
                className="inline-flex items-center gap-1
                px-2.5 py-1 bg-[#D4AF37]/10 text-[#4B3621]
                border border-[#D4AF37]/25 rounded-lg
                text-[10px] font-bold"
              >
                <Icons.Verified />
                KOB Verified
              </span>
            )}
            {seller?.kobExpress && (
              <span
                className="px-2.5 py-1 bg-emerald-50
                text-emerald-700 border border-emerald-100
                rounded-lg text-[10px] font-bold"
              >
                🚚 KOB Express
              </span>
            )}
            {seller?.kobNumber && (
              <span
                className="px-2.5 py-1 bg-gray-100
                text-gray-500 rounded-lg text-[10px]
                font-bold font-mono"
              >
                {seller.kobNumber}
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        {seller?.bio && (
          <p
            className="text-sm text-gray-500
            leading-relaxed mb-3 line-clamp-2"
          >
            {seller.bio}
          </p>
        )}

        {/* Meta row */}
        <div
          className="flex flex-wrap gap-3 text-xs
          text-gray-400 font-medium"
        >
          {seller?.location && (
            <span className="flex items-center gap-1.5">
              <span className="text-[#D4AF37]">
                <Icons.MapPin />
              </span>
              {seller.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="text-[#D4AF37]">
              <Icons.Package />
            </span>
            {products.length} product{products.length !== 1 ? "s" : ""}
          </span>
          {joinDate && (
            <span className="flex items-center gap-1.5">
              <span className="text-[#D4AF37]">
                <Icons.Calendar />
              </span>
              Since {joinDate}
            </span>
          )}
        </div>
      </div>

      {/* WhatsApp floating strip */}
      {!isOwnShop && (seller?.whatsappNumber || seller?.phone) && (
        <div className="mx-4 mb-4 md:mx-6">
          <button
            onClick={onWhatsApp}
            className="w-full flex items-center justify-center
              gap-2 py-3 bg-[#25D366] text-white rounded-2xl
              text-sm font-bold shadow-sm shadow-green-500/20
              hover:bg-[#1ebc5c] transition-all
              active:scale-[0.98]"
          >
            <Icons.WhatsApp />
            Chat on WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
