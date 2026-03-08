// Product service: basic Firestore CRUD operations
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where, // Required for filtering by owner
  orderBy,
  getDoc,
  limit as fbLimit,
  startAfter as fbStartAfter,
  serverTimestamp, // Better for production consistency
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

const PRODUCTS_COL = 'products'
const DEFAULT_PAGE_SIZE = 20

/**
 * Public Marketplace Listing
 * Fetches products for the general store view.
 */
export async function getProducts({ pageSize = DEFAULT_PAGE_SIZE, startAfter } = {}) {
  let q = query(collection(db, PRODUCTS_COL), orderBy('createdAt', 'desc'), fbLimit(pageSize))
  if (startAfter) {
    q = query(collection(db, PRODUCTS_COL), orderBy('createdAt', 'desc'), fbStartAfter(startAfter), fbLimit(pageSize))
  }
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Seller-Specific Listing
 * CRITICAL: Used in the Seller Dashboard to show only THEIR items.
 */
export async function getSellerProducts(ownerUid) {
  if (!ownerUid) throw new Error('User ID is required to fetch inventory')
  
  const q = query(
    collection(db, PRODUCTS_COL),
    where('ownerUid', '==', ownerUid), // Matches the security rule
    orderBy('createdAt', 'desc')
  )
  
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addProduct(data) {
  // Ensure ownerUid is present before attempting to save
  if (!data.ownerUid) {
    throw new Error('Missing required field: ownerUid (user identifier)')
  }
  
  const payload = { 
    ...data, 
    price: Number(data.price),
    createdAt: serverTimestamp() 
  }
  
  const ref = await addDoc(collection(db, PRODUCTS_COL), payload)
  return { id: ref.id, ...payload }
}

export async function updateProduct(id, data) {
  const ref = doc(db, PRODUCTS_COL, id)
  // Use serverTimestamp for the updated field as well
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() })
  return true
}

export async function deleteProduct(id) {
  const ref = doc(db, PRODUCTS_COL, id)
  await deleteDoc(ref)
  return true
}
