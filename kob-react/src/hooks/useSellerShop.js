/**
 * useSellerShop.js — KOB Seller Shop Custom Hook
 *
 * ARCHITECTURE:
 * ProfileContext → Primary (if viewing own shop)
 * Firestore      → Fallback (if viewing another seller)
 *
 * GOAL:
 * - Zero duplicate reads
 * - Public access preserved
 * - Memoized + stable
 */

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useProfile } from "../contexts/ProfileContext";
import { updatePageMeta } from "../services/seo";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png";

// ================================
// Build safe seller object
// Handles old + new Firestore docs
// ================================
function normalizeSeller(data = {}, uid = "") {
  return {
    uid: uid || "",
    displayName: data.displayName || "",
    businessName: data.businessName || "",
    bio: data.bio || "",
    photoURL: data.photoURL || DEFAULT_AVATAR,
    location: data.location || "Katsina",
    fullAddress: data.fullAddress || "",
    whatsappNumber: data.whatsappNumber || data.phoneNumber || "",
    phone: data.phoneNumber || data.phone || "",
    kobNumber: data.kobNumber || "",
    isVerified: data.isVerified ?? false,
    kobExpress: data.kobExpress ?? false,
    createdAt: data.createdAt || null,
    role: (data.role || "seller").trim(),
  };
}

// ================================
// Main Hook
// ================================
export function useSellerShop(sellerId) {
  const { profile: myProfile, loading: profileLoading } = useProfile();

  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Prevent stale fetches on unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ================================
  // Fetch products — memoized
  // ================================
  const fetchProducts = useCallback(async (uid) => {
    if (!uid) return [];
    try {
      const q = query(
        collection(db, "products"),
        where("ownerUid", "==", uid),
        where("isDraft", "==", false)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error("[useSellerShop] Products fetch:", err);
      return [];
    }
  }, []);

  // ================================
  // Fetch seller from Firestore
  // Used ONLY when not own profile
  // ================================
  const fetchSeller = useCallback(async (uid) => {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return normalizeSeller(snap.data(), uid);
  }, []);

  // ================================
  // Core fetch logic
  // ProfileContext first → Firestore fallback
  // ================================
  useEffect(() => {
    if (!sellerId) {
      setError("Invalid shop ID");
      setLoading(false);
      return;
    }

    // Wait for ProfileContext to resolve
    if (profileLoading) return;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        let resolvedSeller = null;

        // ✅ STRATEGY 1: Own shop — use ProfileContext (FREE)
        if (myProfile?.uid === sellerId && myProfile?.role === "seller") {
          resolvedSeller = normalizeSeller(myProfile, sellerId);
        }

        // ✅ STRATEGY 2: Other seller — one Firestore read
        if (!resolvedSeller) {
          resolvedSeller = await fetchSeller(sellerId);
        }

        if (!resolvedSeller) {
          if (mountedRef.current) {
            setError("not_found");
            setLoading(false);
          }
          return;
        }

        // Fetch products in parallel
        const items = await fetchProducts(sellerId);

        if (!mountedRef.current) return;

        setSeller(resolvedSeller);
        setProducts(items);

        // SEO — update page meta
        const name =
          resolvedSeller.businessName ||
          resolvedSeller.displayName ||
          "KOB Seller";

        updatePageMeta?.({
          title: `${name} | KOB Marketplace`,
          description: `Shop from ${name} — verified seller on KOB.`,
          ogImage: resolvedSeller.photoURL || DEFAULT_AVATAR,
          ogType: "website",
        });
      } catch (err) {
        console.error("[useSellerShop] Load error:", err);
        if (mountedRef.current) {
          setError("load_failed");
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }

    load();
  }, [sellerId, myProfile?.uid, profileLoading, fetchSeller, fetchProducts]);

  // ================================
  // Derived values — memoized
  // ================================
  const isOwnShop = useMemo(
    () => myProfile?.uid === sellerId,
    [myProfile?.uid, sellerId]
  );

  const shopName = useMemo(
    () =>
      seller?.businessName ||
      seller?.displayName ||
      `KOB-${seller?.kobNumber || "Seller"}`,
    [seller]
  );

  const shopUrl = useMemo(
    () =>
      typeof window !== "undefined"
        ? `${window.location.origin}/shop/${sellerId}`
        : `/shop/${sellerId}`,
    [sellerId]
  );

  return {
    seller,
    products,
    loading,
    error,
    isOwnShop,
    shopName,
    shopUrl,
  };
}
