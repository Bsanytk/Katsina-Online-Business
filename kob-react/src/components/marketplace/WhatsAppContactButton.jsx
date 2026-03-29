import React, { useState, useEffect, useCallback } from "react";
import { getSellerWhatsApp, generateWhatsAppLink } from "../../services/users";

/**
 * WhatsAppContactButton Component
 *
 * Features:
 * - Fetches seller WhatsApp from Firestore
 * - Generates safe WhatsApp link with pre-filled message
 * - Loading state with spinner
 * - Fallback if seller has no WhatsApp
 * - Smooth hover animations
 * - Opens in new tab with security headers
 * - Shows loading spinner while fetching seller data
 */
export default function WhatsAppContactButton({ product, sellerUid, user }) {
  const [whatsappNumber, setWhatsappNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSellerWhatsApp = useCallback(async () => {
    if (!sellerUid) {
      setError("Seller not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const number = await getSellerWhatsApp(sellerUid);
      if (number) {
        setWhatsappNumber(number);
      } else {
        setError("Seller has not set up WhatsApp contact");
      }
    } catch (err) {
      setError("Failed to load seller contact information");
      if (import.meta.env.DEV)
        console.error("Error fetching seller WhatsApp:", err);
    } finally {
      setLoading(false);
    }
  }, [sellerUid]);

  // Fetch seller WhatsApp on mount
  useEffect(() => {
    loadSellerWhatsApp();
  }, [loadSellerWhatsApp]);

  // Handle click to open WhatsApp
  function handleContactClick() {
    // ✅ LOGIN CHECK
    if (!user) {
      alert("Please register or login to contact seller.");
      return;
    }

    // ✅ PREVENT OWNER CHAT
    if (user.uid === product?.ownerUid) {
      alert("This is your product.");
      return;
    }

    if (!whatsappNumber || !product?.name) return;

    try {
      const link = generateWhatsAppLink(whatsappNumber, product);
      window.open(link, "_blank", "noopener,noreferrer");
    } catch (err) {
      alert("Failed to open WhatsApp");
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 rounded-lg">
        <svg
          className="animate-spin h-5 w-5 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="text-gray-600 font-medium">
          Checking seller info...
        </span>
      </div>
    );
  }

  // Error state - seller has no WhatsApp
  if (error) {
    return (
      <div className="text-center p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
        <p className="text-sm text-amber-900 font-medium">⚠️ {error}</p>
        <p className="text-xs text-amber-700 mt-2">
          Try visiting the dashboard or contacting support.
        </p>
      </div>
    );
  }

  // Success state - show WhatsApp button
  return (
    <button
      onClick={handleContactClick}
      disabled={!whatsappNumber}
      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      aria-label="Contact seller on WhatsApp"
      title={
        whatsappNumber
          ? "Send WhatsApp message to seller"
          : "Seller has not set up WhatsApp"
      }
    >
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.797c0 2.719.738 5.38 2.137 7.697L2.57 23.971l8.15-2.539a9.854 9.854 0 004.783 1.222h.004c5.396 0 9.747-4.363 9.747-9.798 0-2.619-.758-5.076-2.197-7.15a9.82 9.82 0 00-7.487-3.108zM12.168 1.066C5.798 1.066.527 6.365.527 12.733c0 2.716.738 5.376 2.137 7.693l-2.142 8.149 8.15-2.539a9.868 9.868 0 004.783 1.222c6.37 0 11.641-5.299 11.641-11.667 0-3.112-.998-6.022-2.858-8.461a11.64 11.64 0 00-8.622-3.526z" />
      </svg>
      <span>💬 Contact Seller on WhatsApp</span>
    </button>
  );
}
