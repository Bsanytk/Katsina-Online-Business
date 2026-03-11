import { db } from '../firebase/firebase'; 
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

/**
 * Fetches all users from the 'users' collection
 */
export const getAllSellers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching sellers:", error);
    throw error;
  }
};

/**
 * Toggles the isVerified status of a seller
 */
export const toggleSellerVerification = async (userId, currentStatus) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isVerified: !currentStatus
    });
  } catch (error) {
    console.error("Error updating verification status:", error);
    throw error;
  }
};