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
  orderBy,
  getDoc,
  limit as fbLimit,
  startAfter as fbStartAfter,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

const PRODUCTS_COL = 'products'
const DEFAULT_PAGE_SIZE = 20

// Paginated product listing. Pass { pageSize, startAfter } optionally.
export async function getProducts({ pageSize = DEFAULT_PAGE_SIZE, startAfter } = {}) {
  let q = query(collection(db, PRODUCTS_COL), orderBy('createdAt', 'desc'), fbLimit(pageSize))
  if (startAfter) {
    q = query(collection(db, PRODUCTS_COL), orderBy('createdAt', 'desc'), fbStartAfter(startAfter), fbLimit(pageSize))
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
  // expected fields: title, description, price, ownerUid, ...
  const payload = { ...data, createdAt: new Date() }
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
