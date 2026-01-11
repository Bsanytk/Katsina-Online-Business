import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const addProductBtn = document.getElementById("addProductBtn");

// ka ɓoye button tun farko
if (addProductBtn) addProductBtn.style.display = "none";

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const uid = user.uid;

  // duba admin
  const adminRef = doc(db, "admins", uid);
  const adminSnap = await getDoc(adminRef);

  if (adminSnap.exists()) {
    addProductBtn.style.display = "block";
    return;
  }

  // duba verified seller
  const sellerRef = doc(db, "verifiedSellers", uid);
  const sellerSnap = await getDoc(sellerRef);

  if (sellerSnap.exists()) {
    addProductBtn.style.display = "block";
  }
});