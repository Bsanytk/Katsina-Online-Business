/**
 * products.js — KOB Marketplace
 * Firestore CRUD service for products collection
 * All functions return data or throw descriptive errors
 */

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
} from "firebase/firestore";
import { db } from "../firebase/firebase";

// ================================
// Constants
// ================================
const PRODUCTS_COL = "products";
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// ================================
// getProducts
// Paginated product listing
// ================================
/**
 * @param {number}  pageSize  - Items per page (default 20, max 100)
 * @param {object}  startAfter - Firestore cursor for pagination
 * @param {string}  ownerUid  - Filter by seller (dashboard use)
 * @param {boolean} includeDrafts - Include draft products (seller only)
 */
export async function getProducts({
  pageSize = DEFAULT_PAGE_SIZE,
  startAfter,
  ownerUid,
  includeDrafts = false,
} = {}) {
  try {
    // Enforce max page size — cost control
    const safePageSize = Math.min(pageSize, MAX_PAGE_SIZE);

    let q;

    if (ownerUid) {
      // ================================
      // Seller Dashboard — own products
      // ================================
      if (startAfter) {
        q = query(
          collection(db, PRODUCTS_COL),
          where("ownerUid", "==", ownerUid),
          orderBy("createdAt", "desc"),
          fbStartAfter(startAfter),
          fbLimit(safePageSize)
        );
      } else {
        q = query(
          collection(db, PRODUCTS_COL),
          where("ownerUid", "==", ownerUid),
          orderBy("createdAt", "desc"),
          fbLimit(safePageSize)
        );
      }
    } else {
      // ================================
      // Marketplace — live products only
      // ================================
      if (startAfter) {
        q = query(
          collection(db, PRODUCTS_COL),
          where("isDraft", "==", false),
          orderBy("createdAt", "desc"),
          fbStartAfter(startAfter),
          fbLimit(safePageSize)
        );
      } else {
        q = query(
          collection(db, PRODUCTS_COL),
          where("isDraft", "==", false),
          orderBy("createdAt", "desc"),
          fbLimit(safePageSize)
        );
      }
    }

    const snap = await getDocs(q);
    const items = [];
    snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
    return items;
  } catch (err) {
    // Firestore index errors — give clear message
    if (err.code === "failed-precondition") {
      throw new Error("Database index missing. Please contact support.");
    }
    throw new Error(`Failed to load products: ${err.message}`);
  }
}

// ================================
// getProductById
// ================================
/**
 * @param {string} id - Product Firestore document ID
 * @returns {object} Product data with id
 */
export async function getProductById(id) {
  if (!id) throw new Error("Product ID is required");

  try {
    const ref = doc(db, PRODUCTS_COL, id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      throw new Error("Product not found or has been removed");
    }

    return { id: snap.id, ...snap.data() };
  } catch (err) {
    if (err.message.includes("not found")) throw err;
    throw new Error(`Failed to load product: ${err.message}`);
  }
}

// ================================
// addProduct
// ================================
/**
 * @param {object} data - Product fields
 * Required: title, description, price, ownerUid, images
 * @returns {object} Created product with id
 */
export async function addProduct(data) {
  // Required field validation
  if (!data.ownerUid) {
    throw new Error("Missing required field: ownerUid");
  }
  if (!data.title?.trim()) {
    throw new Error("Missing required field: title");
  }
  if (!data.price || isNaN(Number(data.price))) {
    throw new Error("Missing required field: price");
  }

  try {
    const payload = {
      // Spread caller data
      ...data,

      // Normalize fields
      title: data.title.trim(),
      description: data.description?.trim() || "",
      price: Number(data.price),
      isDraft: data.isDraft ?? true,

      // Always use serverTimestamp for createdAt
      // Overrides any caller-provided createdAt
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // ✅ Remove console.log — not for production
    const ref = await addDoc(collection(db, PRODUCTS_COL), payload);

    return { id: ref.id, ...payload };
  } catch (err) {
    throw new Error(`Failed to create product: ${err.message}`);
  }
}

// ================================
// updateProduct
// ================================
/**
 * @param {string} id   - Product document ID
 * @param {object} data - Fields to update
 */
export async function updateProduct(id, data) {
  if (!id) throw new Error("Product ID is required");

  try {
    const ref = doc(db, PRODUCTS_COL, id);

    // Prevent overwriting critical fields
    const {
      ownerUid, // Cannot change ownership
      createdAt, // Cannot change creation time
      id: _id, // Strip id if accidentally passed
      ...safeData
    } = data;

    await updateDoc(ref, {
      ...safeData,
      updatedAt: serverTimestamp(),
    });

    return true;
  } catch (err) {
    if (err.code === "not-found") {
      throw new Error("Product not found — may have been deleted");
    }
    throw new Error(`Failed to update product: ${err.message}`);
  }
}

// ================================
// deleteProduct
// ================================
/**
 * @param {string} id - Product document ID
 */
export async function deleteProduct(id) {
  if (!id) throw new Error("Product ID is required");

  try {
    const ref = doc(db, PRODUCTS_COL, id);
    await deleteDoc(ref);
    return true;
  } catch (err) {
    throw new Error(`Failed to delete product: ${err.message}`);
  }
}
