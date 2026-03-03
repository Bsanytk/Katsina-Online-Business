// Reviews service: CRUD operations for product reviews
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
  getDoc,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

const REVIEWS_COL = 'reviews'

// Get all reviews for a product
export async function getProductReviews(productId) {
  const q = query(
    collection(db, REVIEWS_COL),
    where('productId', '==', productId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  const reviews = []
  snap.forEach((d) => reviews.push({ id: d.id, ...d.data() }))
  return reviews
}

// Get all reviews by a seller (for seller rating)
export async function getSellerReviews(sellerId) {
  const q = query(
    collection(db, REVIEWS_COL),
    where('sellerId', '==', sellerId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  const reviews = []
  snap.forEach((d) => reviews.push({ id: d.id, ...d.data() }))
  return reviews
}

// Add a new review
export async function addReview(data) {
  // Expected fields: productId, sellerId, buyerId, rating, text, buyerName
  const payload = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const ref = await addDoc(collection(db, REVIEWS_COL), payload)
  return { id: ref.id, ...payload }
}

// Update a review
export async function updateReview(reviewId, data) {
  const ref = doc(db, REVIEWS_COL, reviewId)
  await updateDoc(ref, { ...data, updatedAt: new Date() })
  return true
}

// Delete a review
export async function deleteReview(reviewId) {
  const ref = doc(db, REVIEWS_COL, reviewId)
  await deleteDoc(ref)
  return true
}

// Calculate average rating for a product (0-5)
export function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0
  const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0)
  return parseFloat((total / reviews.length).toFixed(1))
}

// Calculate seller rating aggregate
export function calculateSellerRating(reviews) {
  if (!reviews || reviews.length === 0) return { average: 0, count: 0 }
  const average = calculateAverageRating(reviews)
  return { average, count: reviews.length }
}
