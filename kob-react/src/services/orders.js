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
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

const ORDERS_COL = 'orders'

// Create a new order
export async function createOrder(data) {
  // Expected fields: buyerId, sellerId, productId, productTitle, price, quantity, buyerEmail, status
  const payload = {
    ...data,
    status: 'pending', // pending, confirmed, shipped, delivered, cancelled
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const ref = await addDoc(collection(db, ORDERS_COL), payload)
  return { id: ref.id, ...payload }
}

// Get orders by buyer
export async function getBuyerOrders(buyerId) {
  const q = query(
    collection(db, ORDERS_COL),
    where('buyerId', '==', buyerId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  const orders = []
  snap.forEach((d) => orders.push({ id: d.id, ...d.data() }))
  return orders
}

// Get orders by seller
export async function getSellerOrders(sellerId) {
  const q = query(
    collection(db, ORDERS_COL),
    where('sellerId', '==', sellerId),
    orderBy('createdAt', 'desc')
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

// Update order status
export async function updateOrderStatus(orderId, newStatus) {
  const ref = doc(db, ORDERS_COL, orderId)
  await updateDoc(ref, {
    status: newStatus,
    updatedAt: new Date(),
  })
  return true
}

// Get order tracking history
export async function getOrderHistory(orderId) {
  const order = await getOrder(orderId)
  return {
    orderId,
    statuses: [
      { status: 'pending', timestamp: order.createdAt, label: 'Order Placed' },
      { status: 'confirmed', timestamp: order.confirmedAt || null, label: 'Confirmed' },
      { status: 'shipped', timestamp: order.shippedAt || null, label: 'Shipped' },
      { status: 'delivered', timestamp: order.deliveredAt || null, label: 'Delivered' },
    ].filter(s => s.timestamp || s.status === 'pending'),
  }
}
