import { db } from '../firebase/config'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'

// Wannan function din zai dauko duk masu siyarwa
export const getAllSellers = async () => {
  try {
    const usersRef = collection(db, 'users')
    const snapshot = await getDocs(usersRef)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching sellers:", error)
    throw error
  }
}

// Wannan zai canza status din mutum ya koma Verified
export const toggleSellerVerification = async (userId, currentStatus) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      isVerified: !currentStatus
    })
  } catch (error) {
    console.error("Error updating status:", error)
    throw error
  }
}