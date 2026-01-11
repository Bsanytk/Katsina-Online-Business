import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const productsContainer = document.getElementById("products");

async function loadProducts() {
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

    snapshot.forEach((doc) => {
      const p = doc.data();

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

loadProducts();