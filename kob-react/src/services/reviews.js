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

// 1. Dauko Reviews na Kaya
export async function getProductReviews(
  productId,
  { pageSize = DEFAULT_PAGE_SIZE } = {}
) {
  try {
    const q = query(
      collection(db, REVIEWS_COL),
      where("productId", "==", productId),
      orderBy("createdAt", "desc"), // Ka tabbata ka halitta Index a Firebase!
      fbLimit(pageSize)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return []; // Return empty list don gudun crash
  }
}

// 2. Tura Sabon Review
export async function addReview(data) {
  // Tabbatar akwai rating kafin tura wa Firebase
  if (!data.rating || data.rating < 1) {
    throw new Error("Please provide a rating");
  }

  const payload = {
    productId: data.productId,
    sellerId: data.sellerId,
    buyerId: data.buyerId || "anonymous", // Don kariya idan ba a turo buyerId ba
    userEmail: data.userEmail || "",
    userName: data.userName || "KOB User", // Na kara wannan don sunan mai review ya fito
    rating: Number(data.rating), // Tabbatar lamba ce
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

// 3. Lissafin Average (Simple and Clean)
export function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
  return total / reviews.length; // Dawo da lamba kawai
}

// ... sauran functions din update da delete suna da kyau yadda suke

// Calculate seller rating aggregate
export function calculateSellerRating(reviews) {
  if (!reviews || reviews.length === 0) return { average: 0, count: 0 };
  const average = calculateAverageRating(reviews);
  return { average, count: reviews.length };
}

// 4. Dauko dukkan Reviews na Seller (don lissafin darajarsa gaba daya)
export async function getSellerReviews(sellerId) {
  try {
    const q = query(
      collection(db, REVIEWS_COL),
      where("sellerId", "==", sellerId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching seller reviews:", error);
    return [];
  }
}
