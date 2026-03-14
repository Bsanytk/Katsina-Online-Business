// Product service: basic Firestore CRUD operations
// Each function returns data or throws an error. Callers should handle loading/errors.

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDoc,
  limit as fbLimit,
  startAfter as fbStartAfter,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

const PRODUCTS_COL = 'products'
const DEFAULT_PAGE_SIZE = 20

// Paginated product listing. Pass { pageSize, startAfter } optionally.
// Paginated product listing.
// Pass { pageSize, startAfter, ownerUid } optionally.

export async function getProducts({ pageSize = DEFAULT_PAGE_SIZE, startAfter, ownerUid } = {}) {

  let q

  // Seller dashboard (only their products)
  if (ownerUid) {

    if (startAfter) {
      q = query(
        collection(db, PRODUCTS_COL),
        where('ownerUid', '==', ownerUid),
        orderBy('createdAt', 'desc'),
        fbStartAfter(startAfter),
        fbLimit(pageSize)
      )
    } else {
      q = query(
        collection(db, PRODUCTS_COL),
        where('ownerUid', '==', ownerUid),
        orderBy('createdAt', 'desc'),
        fbLimit(pageSize)
      )
    }

  } else {

    // Marketplace (all products)
    if (startAfter) {
      q = query(
        collection(db, PRODUCTS_COL),
        where('isDraft', '==', false),
        orderBy('createdAt', 'desc'),
        fbStartAfter(startAfter),
        fbLimit(pageSize)
      )
    } else {
      q = query(
        collection(db, PRODUCTS_COL),
        where('isDraft', '==', false),
        orderBy('createdAt', 'desc'),
        fbLimit(pageSize)
      )
    }

  }

  const snap = await getDocs(q)

  const items = []
  snap.forEach((d) => items.push({ id: d.id, ...d.data() }))

  return items
}


export async function getProductById(id) {
  const ref = doc(db, PRODUCTS_COL, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('Product not found')
  return { id: snap.id, ...snap.data() }
}

export async function addProduct(data) {
  // expected fields: title, description, price, ownerUid, images, etc
  if (!data.ownerUid) {
    throw new Error('Missing required field: ownerUid (user identifier)')
  }
  const payload = { ...data, createdAt: serverTimestamp() }
  console.log('addProduct - Firestore payload:', payload)
  const ref = await addDoc(collection(db, PRODUCTS_COL), payload)
  return { id: ref.id, ...payload }
}

export async function updateProduct(id, data) {
  const ref = doc(db, PRODUCTS_COL, id)
  await updateDoc(ref, { ...data, updatedAt: new Date() })
  return true
}

export async function deleteProduct(id) {
  const ref = doc(db, PRODUCTS_COL, id)
  await deleteDoc(ref)
  return true
}
