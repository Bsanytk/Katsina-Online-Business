/**
 * SellerShop.jsx — KOB Public Seller Storefront
 *
 * ARCHITECTURE:
 * - Thin orchestrator — delegates to hooks + components
 * - useSellerShop() handles all data logic
 * - Public access — NO auth required to view
 * - Auth only required for contact actions
 * - ProfileContext → Primary, Firestore → Fallback
 *
 * BACKWARD COMPATIBLE: Preserves all existing behavior
 */

import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/auth";
import { useSellerShop } from "../hooks/useSellerShop";
import { createOrGetConversation } from "../services/chat";
import SellerHeader from "../components/seller/SellerHeader";
import SellerProducts from "../components/seller/SellerProducts";
import SellerRating from "../components/SellerRating";
import AuthModal from "../components/seller/AuthModal";
import Loading from "../components/Loading";

export default function SellerShop() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ All data logic centralized in hook
  const { seller, products, loading, error, isOwnShop, shopName, shopUrl } =
    useSellerShop(sellerId);

  // Auth modal state
  const [authModal, setAuthModal] = useState(null); // 'message' | 'whatsapp' | null
  const [chatLoading, setChatLoading] = useState(false);

  // ================================
  // Back handler
  // ================================
  function handleBack() {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/marketplace");
    }
  }

  // ================================
  // Message seller
  // ================================
  const handleMessage = useCallback(async () => {
    if (!user) {
      setAuthModal("message");
      return;
    }
    if (isOwnShop) return;

    setChatLoading(true);
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
    } catch {
      alert("Failed to start chat. Please try again.");
    } finally {
      setChatLoading(false);
    }
  }, [user, sellerId, isOwnShop, shopName, navigate]);

  // ================================
  // WhatsApp contact
  // ================================
  const handleWhatsApp = useCallback(
    (product) => {
      if (!user) {
        setAuthModal("whatsapp");
        return;
      }
      if (isOwnShop) return;

      const number = seller?.whatsappNumber || seller?.phone;

      if (!number) {
        alert("Seller has not set up WhatsApp contact.");
        return;
      }

      const text = product
        ? `Hello ${shopName}! I'm interested in "${product.title}" — ₦${Number(
            product.price
          ).toLocaleString()}.`
        : `Hello ${shopName}! I found your shop on KOB Marketplace and I'm interested in your products.`;

      window.open(
        `https://wa.me/${number}?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer"
      );
    },
    [user, isOwnShop, seller, shopName]
  );

  // ================================
  // Loading
  // ================================
  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#FAFAF8]
        flex items-center justify-center"
      >
        <Loading size="md" message="Loading shop..." />
      </div>
    );
  }

  // ================================
  // Not Found
  // ================================
  if (error === "not_found" || !seller) {
    return (
      <div
        className="min-h-screen bg-[#FAFAF8] flex
        flex-col items-center justify-center text-center p-8"
      >
        <div
          className="w-20 h-20 bg-gray-100 rounded-3xl
          flex items-center justify-center mx-auto mb-4"
        >
          <svg
            className="w-10 h-10 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3
              6h18M16 10a4 4 0 01-8 0"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-600 mb-2">Shop Not Found</h2>
        <p className="text-sm text-gray-400 mb-6 max-w-xs">
          This seller may no longer be active on KOB Marketplace.
        </p>
        <button
          onClick={() => navigate("/marketplace")}
          className="px-7 py-3 bg-[#4B3621] text-white
            rounded-xl text-sm font-semibold
            hover:bg-[#362818] transition-colors"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  // ================================
  // Load failed
  // ================================
  if (error === "load_failed") {
    return (
      <div
        className="min-h-screen bg-[#FAFAF8] flex
        flex-col items-center justify-center text-center p-8"
      >
        <p className="text-sm text-gray-500 mb-4">Failed to load this shop.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-[#4B3621] text-white
            rounded-xl text-sm font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }
  // ================================
  // MAIN RENDER
  // ================================
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Auth Modal */}
      {authModal && (
        <AuthModal
          show={Boolean(authModal)}
          type={authModal}
          shopUrl={shopUrl}
          onClose={() => setAuthModal(null)}
        />
      )}

      {/* Storefront Header */}
      <SellerHeader
        seller={seller}
        products={products}
        shopUrl={shopUrl}
        isOwnShop={isOwnShop}
        onMessage={handleMessage}
        onWhatsApp={() => handleWhatsApp(null)}
        onBack={handleBack}
      />

      {/* Seller Rating — public */}
      <div
        className="bg-white border-b border-gray-100
        px-4 md:px-6 py-4"
      >
        <p
          className="text-[9px] font-bold uppercase
          tracking-widest text-gray-400 mb-2"
        >
          Seller Performance
        </p>
        <SellerRating sellerId={sellerId} />
      </div>

      {/* Product Catalogue */}
      <SellerProducts
        products={products}
        loading={false}
        shopName={shopName}
        onWhatsApp={
          seller?.whatsappNumber || seller?.phone ? handleWhatsApp : null
        }
      />

      {/* Bottom padding for mobile nav */}
      <div className="h-24 lg:h-8" />
    </div>
  );
}
