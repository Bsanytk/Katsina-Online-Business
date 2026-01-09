// marketplace.js
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

const productList = document.getElementById("productList");
const productMessage = document.getElementById("productMessage");

// -----------------------------
// ADD PRODUCT
// -----------------------------
window.addProduct = async function () {
  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const user = auth.currentUser;

  if (!name || !price) {
    productMessage.textContent = "Cika dukkan filaye.";
    productMessage.style.color = "red";
    return;
  }

  if (!user) {
    productMessage.textContent = "Sai ka shiga account.";
    productMessage.style.color = "red";
    return;
  }

  try {
    await addDoc(collection(db, "products"), {
      name,
      price: Number(price),
      sellerId: user.uid,
      createdAt: serverTimestamp()
    });

    productMessage.textContent = "Product ya shiga marketplace.";
    productMessage.style.color = "green";

    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";

    loadProducts();
  } catch (error) {
    productMessage.textContent = error.message;
    productMessage.style.color = "red";
  }
};

// -----------------------------
// LOAD PRODUCTS
// -----------------------------
async function loadProducts() {
  productList.innerHTML = "";

  const q = query(
    collection(db, "products"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const data = doc.data();

    const card = document.createElement("div");
    card.className = "bg-white text-dark p-4 rounded shadow";

    card.innerHTML = `
      <h5 class="font-bold">${data.name}</h5>
      <p class="text-sm text-gray-600">₦${data.price}</p>
    `;

    productList.appendChild(card);
  });
}

// -----------------------------
// AUTH LISTENER → LOAD PRODUCTS
// -----------------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadProducts();
  } else {
    productList.innerHTML = "";
  }
});