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



//---------------------------------
// DELLETE PRODUCT (Optional)
//---------------------------------
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const deleteProduct = async (id) => {
  if (!window.confirm("Tabbas kana son goge wannan kaya?")) return;
  await deleteDoc(doc(db, "products", id));
};

// Usage example (attach to a button click event)
<button onClick={() => deleteProduct(product.id)}>
  Delete
</button>

// EDIT PRODUCT (Optional)
import { updateDoc, doc } from "firebase/firestore";

const updateProduct = async (id, data) => {
  await updateDoc(doc(db, "products", id), data);
}; 

//ADMIN ONLY FEATURES (Optional)
import { isAdmin } from "./utils/isAdmin";

useEffect(() => {
  const check = async () => {
    const admin = await isAdmin();
    console.log("Is Admin:", admin);
  };
  check();
}, []);

//NON ADMIN USERS CANNOT ACCESS ADMIN FEATURES
useEffect(() => {
  const protect = async () => {
    const admin = await isAdmin();
    if (!admin) {
      alert("Ba ka da izinin shiga wannan shafi");
      window.location.href = "/";
    }
  };
  protect();
}, []);

