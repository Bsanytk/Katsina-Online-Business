// Orders service: track orders placed by buyers
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  getDoc,
  limit as fbLimit,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

const ORDERS_COL = 'orders'
const DEFAULT_PAGE_SIZE = 20

// Create a simplified "request" (lightweight order) to reduce complexity.
export async function createOrder(data) {
  // Expected fields: buyerId, sellerId, productId, productTitle, price, quantity, buyerEmail
  const payload = {
    ...data,
    status: 'requested', // simplified statuses: requested, confirmed, closed, cancelled
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const ref = await addDoc(collection(db, ORDERS_COL), payload)
  return { id: ref.id, ...payload }
}

// Get orders by buyer (paginated)
export async function getBuyerOrders(buyerId, { pageSize = DEFAULT_PAGE_SIZE } = {}) {
  const q = query(
    collection(db, ORDERS_COL),
    where('buyerId', '==', buyerId),
    orderBy('createdAt', 'desc'),
    fbLimit(pageSize)
  )
  const snap = await getDocs(q)
  const orders = []
  snap.forEach((d) => orders.push({ id: d.id, ...d.data() }))
  return orders
}

// Get orders by seller (paginated)
export async function getSellerOrders(sellerId, { pageSize = DEFAULT_PAGE_SIZE } = {}) {
  const q = query(
    collection(db, ORDERS_COL),
    where('sellerId', '==', sellerId),
    orderBy('createdAt', 'desc'),
    fbLimit(pageSize)
  )
  const snap = await getDocs(q)
  const orders = []
  snap.forEach((d) => orders.push({ id: d.id, ...d.data() }))
  return orders
}

// Get single order
export async function getOrder(orderId) {
  const ref = doc(db, ORDERS_COL, orderId)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('Order not found')
  return { id: snap.id, ...snap.data() }
}

// Update order status (seller-only should be enforced in security rules)
export async function updateOrderStatus(orderId, newStatus) {
  const ref = doc(db, ORDERS_COL, orderId)
  await updateDoc(ref, {
    status: newStatus,
    updatedAt: new Date(),
  })
  return true
}

// Get basic order history (reflects simplified status model)
export async function getOrderHistory(orderId) {
  const order = await getOrder(orderId)
  return {
    orderId,
    statuses: [
      { status: 'requested', timestamp: order.createdAt, label: 'Request Sent' },
      { status: 'confirmed', timestamp: order.confirmedAt || null, label: 'Confirmed' },
      { status: 'closed', timestamp: order.closedAt || null, label: 'Closed' },
    ].filter(s => s.timestamp || s.status === 'requested'),
  }
}
