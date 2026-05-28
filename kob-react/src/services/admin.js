/**
 * admin.js — KOB Admin Service
 * All functions require admin privileges
 * Firestore rules enforce isAdmin check
 */

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  writeBatch,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const ADMIN_UID = "faAlHUtsZ2MVQRN4Apc3itIoeGf2";

// ================================
// Verify caller is admin
// ================================
function assertAdmin(uid) {
  if (uid !== ADMIN_UID) {
    throw new Error("Unauthorized: Admin access required");
  }
}

// ================================
// Get all sellers
// ================================
export async function getAllSellers() {
  const q = query(
    collection(db, "users"),
    where("role", "==", "seller"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ================================
// Get all buyers
// ================================
export async function getAllBuyers() {
  const q = query(
    collection(db, "users"),
    where("role", "==", "buyer"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ================================
// Toggle seller verification
// ================================
export async function toggleSellerVerification(userId, currentStatus) {
  const ref = doc(db, "users", userId);
  await updateDoc(ref, {
    isVerified: !currentStatus,
    verifiedAt: !currentStatus ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
  return !currentStatus;
}

// ================================
// Get all products (admin view)
// ================================
export async function getAllProducts({ pageSize = 50, filterDraft } = {}) {
  let q;
  if (filterDraft !== undefined) {
    q = query(
      collection(db, "products"),
      where("isDraft", "==", filterDraft),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );
  } else {
    q = query(
      collection(db, "products"),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ================================
// Bulk update products
// ================================
export async function bulkUpdateProducts(productIds, updateData) {
  const batch = writeBatch(db);
  productIds.forEach((id) => {
    const ref = doc(db, "products", id);
    batch.update(ref, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
  return true;
}

// ================================
// Bulk delete products
// ================================
export async function bulkDeleteProducts(productIds) {
  const batch = writeBatch(db);
  productIds.forEach((id) => {
    const ref = doc(db, "products", id);
    batch.delete(ref);
  });
  await batch.commit();
  return true;
}

// ================================
// Get all orders
// ================================
export async function getAllOrders({ status } = {}) {
  let q;
  if (status) {
    q = query(
      collection(db, "orders"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
  } else {
    q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(100)
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ================================
// Update order status
// ================================
export async function updateOrderStatus(orderId, status) {
  const ref = doc(db, "orders", orderId);
  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
  });
  return true;
}

// ================================
// Save FCM token
// ================================
export async function saveFCMToken(uid, token) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    fcmToken: arrayUnion(token),
    fcmUpdatedAt: serverTimestamp(),
  });
}

// ================================
// Send broadcast notification
// ================================
// Tabbatar saveBroadcast tana haka:
export async function saveBroadcast(data) {
  const ref = await addDoc(collection(db, "broadcasts"), {
    title: data.title || "",
    body: data.body || "",
    url: data.url || "/",
    type: data.type || "broadcast",
    status: "sent",
    sentAt: serverTimestamp(), // ✅ Primary timestamp
    createdAt: serverTimestamp(), // ✅ Backup timestamp
  });
  return ref.id;
}

// ================================
// Get dashboard stats
// ================================
export async function getDashboardStats() {
  const [sellersSnap, buyersSnap, productsSnap, ordersSnap] = await Promise.all(
    [
      getDocs(query(collection(db, "users"), where("role", "==", "seller"))),
      getDocs(query(collection(db, "users"), where("role", "==", "buyer"))),
      getDocs(collection(db, "products")),
      getDocs(collection(db, "orders")),
    ]
  );

  const products = productsSnap.docs.map((d) => d.data());
  const lowStock = products.filter(
    (p) => p.stockCount !== undefined && p.stockCount < 5
  );
  const expiringSoon = products.filter((p) => {
    if (!p.expiryDate) return false;
    const days = (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    return days > 0 && days <= 30;
  });

  return {
    totalSellers: sellersSnap.size,
    totalBuyers: buyersSnap.size,
    totalProducts: productsSnap.size,
    totalOrders: ordersSnap.size,
    lowStockCount: lowStock.length,
    expiringSoon: expiringSoon.length,
  };
}
