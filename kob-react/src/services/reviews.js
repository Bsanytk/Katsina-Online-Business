import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  serverTimestamp,
  limit as fbLimit,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const REVIEWS_COL = "reviews";
const DEFAULT_PAGE_SIZE = 20;

// 1. Dauko Reviews na Kaya (Product Reviews)
export async function getProductReviews(
  productId,
  { pageSize = DEFAULT_PAGE_SIZE } = {}
) {
  try {
    const q = query(
      collection(db, REVIEWS_COL),
      where("productId", "==", productId),
      orderBy("createdAt", "desc"),
      fbLimit(pageSize)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }
}

// 2. Tura Sabon Review
export async function addReview(data) {
  if (!data.rating || data.rating < 1) {
    throw new Error("Please provide a rating");
  }

  const payload = {
    productId: data.productId,
    sellerId: data.sellerId,
    buyerId: data.buyerId || "anonymous",
    userEmail: data.userEmail || "",
    userName: data.userName || "KOB User",
    rating: Number(data.rating),
    text: data.text || "",
    verified: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    const ref = await addDoc(collection(db, REVIEWS_COL), payload);
    return { id: ref.id, ...payload };
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}

// 3. Dauko reviews na Seller (An sa limit don kiyaye Free Plan)
export async function getSellerReviews(sellerId) {
  try {
    const q = query(
      collection(db, REVIEWS_COL),
      where("sellerId", "==", sellerId),
      orderBy("createdAt", "desc"),
      fbLimit(10) // Firebase zai karanta guda 50 kacal ko da seller yana da reviews 1,000
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching seller reviews:", error);
    return [];
  }
}

// 4. Lissafin average rating
export function calculateSellerRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
  return total / reviews.length;
}
