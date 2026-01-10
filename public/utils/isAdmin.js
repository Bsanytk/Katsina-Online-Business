import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const isAdmin = async () => {
  const user = auth.currentUser;
  if (!user) return false;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return false;

  return snap.data().role === "admin";
};