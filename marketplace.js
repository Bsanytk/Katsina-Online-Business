// marketplace.js
// Client-side logic for listing products and adding new products (UI-only role gating).

import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// DOM elements (existing in `index.html`)
const productsContainer = document.getElementById("products");
const addProductForm = document.getElementById("addProductForm");
const addProductBtn = document.getElementById("addProductBtn");

let currentUserRole = "basic";

// Form elements (present in `index.html`) — used for simple feedback
const formError = document.getElementById("formError");
const submitBtn = document.getElementById("submitBtn");

/*
  Client-side product creation handler (UI-only role check)
  - This is only a UI convenience. Firestore security rules are the final
    authority and will reject unauthorized writes.
  - Only `admin` and `verified` roles are allowed to see and submit the
    add-product form in the UI.
*/
if (addProductForm) {
  addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // UI-level role enforcement (does NOT replace server rules)
    if (!(currentUserRole === "admin" || currentUserRole === "verified")) {
      if (formError) {
        formError.textContent = "You don't have permission to add products.";
        formError.classList.remove("hidden");
        formError.classList.remove("text-green-600");
        formError.classList.add("text-red-600");
      }
      return;
    }

    // Read values from the existing form fields
    const name = document.getElementById("productName")?.value?.trim();
    const price = parseFloat(document.getElementById("productPrice")?.value || 0);
    const imageURL = document.getElementById("productImage")?.value?.trim();
    const description = document.getElementById("productDescription")?.value?.trim();

    if (!name || !price || !imageURL || !description) {
      if (formError) {
        formError.textContent = "Please fill all fields.";
        formError.classList.remove("hidden");
        formError.classList.remove("text-green-600");
        formError.classList.add("text-red-600");
      }
      return;
    }

    try {
      if (submitBtn) submitBtn.disabled = true;
      if (formError) formError.classList.add("hidden");

      const user = getAuth().currentUser;
      const payload = {
        name,
        price,
        imageURL,
        description,
        createdAt: serverTimestamp(),
        ownerUid: user ? user.uid : null
      };

      // Attempt to create product document (may be rejected by rules)
      await addDoc(collection(db, "products"), payload);

      // Clear form and reload products (frontend only)
      addProductForm.reset();
      loadProducts();

      if (formError) {
        formError.textContent = "Product added successfully.";
        formError.classList.remove("hidden");
        formError.classList.remove("text-red-600");
        formError.classList.add("text-green-600");
      }
    } catch (err) {
      console.error("Failed to add product:", err);
      if (formError) {
        formError.textContent = "Failed to add product.";
        formError.classList.remove("hidden");
        formError.classList.remove("text-green-600");
        formError.classList.add("text-red-600");
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// Load products from Firestore and render into the `products` container
async function loadProducts() {
  if (!productsContainer) return;
  productsContainer.innerHTML = "Loading products...";

  try {
    const q = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    productsContainer.innerHTML = "";

    if (snapshot.empty) {
      productsContainer.innerHTML = "No products yet.";
      return;
    }

    snapshot.forEach((docSnap) => {
      const p = docSnap.data();

      const div = document.createElement("div");
      div.className = "product-card";

      div.innerHTML = `
        <img src="${p.imageURL}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p><b>₦${p.price}</b></p>
        <p>${p.description}</p>
      `;

      productsContainer.appendChild(div);
    });

  } catch (err) {
    productsContainer.innerHTML = "Error loading products";
    console.error(err);
  }
}

/*
  Update UI visibility for add-product controls based on role.
  - Adds Tailwind-like classes to the `addProductBtn` when visible so it
    follows the KOB brand colors even if the original HTML didn't include them.
*/
function updateUIForRole() {
  const allowed = currentUserRole === "admin" || userData.isVerified === true;
  if (addProductForm) addProductForm.style.display = allowed ? "" : "none";
  if (addProductBtn) {
    addProductBtn.style.display = allowed ? "inline-block" : "none";
    if (allowed) {
      // Apply KOB brand colors if button exists but was not styled
      addProductBtn.classList.add("bg-[#C5A059]", "text-[#2D1E17]", "px-4", "py-2", "rounded");
    }
  }
}

// Fetch the user's role from /users/{uid} document
async function fetchUserRole(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.role || null;
    }
    return null;
  } catch (err) {
    console.error("Failed to fetch user role:", err);
    return null;
  }
}

// Observe auth changes and re-render UI accordingly
onAuthStateChanged(getAuth(), async (user) => {
  if (user) {
    const role = await fetchUserRole(user.uid);
    currentUserRole = role || "basic";
  } else {
    currentUserRole = "basic";
  }

  updateUIForRole();
  loadProducts();
});

// Initial load for anonymous/public view
loadProducts();
