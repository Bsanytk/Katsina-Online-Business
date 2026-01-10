// auth.js
// Phase 2 – Firebase Authentication Logic

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Use the already initialized Firebase App
const auth = getAuth();
 
// DOM Elements
const authMessage = document.getElementById("authMessage");
const logoutBtn = document.getElementById("logoutBtn");
const marketplaceSection = document.getElementById("marketplace");

// -----------------------------
// SIGN UP
// -----------------------------
window.signup = async function () {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) {
    authMessage.textContent = "Cika email da password.";
    authMessage.style.color = "red";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    authMessage.textContent = "Account ya samu nasara!";
    authMessage.style.color = "green";
  } catch (error) {
    authMessage.textContent = error.message;
    authMessage.style.color = "red";
  }
};

// -----------------------------
// LOGIN
// -----------------------------
window.login = async function () {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    authMessage.textContent = "Cika email da password.";
    authMessage.style.color = "red";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    authMessage.textContent = "Ka shiga account lafiya.";
    authMessage.style.color = "green";
  } catch (error) {
    authMessage.textContent = error.message;
    authMessage.style.color = "red";
  }
};

// -----------------------------
// LOGOUT
// -----------------------------
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// -----------------------------
// AUTH STATE OBSERVER
// -----------------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User logged in
    logoutBtn.classList.remove("hidden");
    marketplaceSection.classList.remove("hidden");
  } else {
    // User logged out
    logoutBtn.classList.add("hidden");
    marketplaceSection.classList.add("hidden");
  }
});