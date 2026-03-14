import { db } from '../firebase/firebase'
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore'

/**
 * Fetch only sellers from users collection
 */
export const getAllSellers = async () => {
  try {

    const q = query(
      collection(db, 'users'),
      where('role', '==', 'seller')
    )

    const snapshot = await getDocs(q)

    return snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data()
    }))

  } catch (error) {
    console.error("Error fetching sellers:", error)
    throw error
  }
}


/**
 * Toggle seller verification
 */
export const toggleSellerVerification = async (userId, currentStatus) => {
  try {

    const userRef = doc(db, 'users', userId)

    await updateDoc(userRef, {
      isVerified: !currentStatus,
      updatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error("Error updating verification status:", error)
    throw error
  }
}
