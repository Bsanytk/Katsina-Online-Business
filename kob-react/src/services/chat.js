// Chat service: real-time messaging between buyers and sellers
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  getDocs,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

const CONVERSATIONS_COL = 'conversations'
const MESSAGES_COL = 'messages'

// Create or get conversation between buyer and seller
export async function createOrGetConversation(buyerId, sellerId, productId) {
  // Unique conversation ID (sorted IDs to ensure single conversation)
  const participantA = buyerId < sellerId ? buyerId : sellerId
  const participantB = buyerId < sellerId ? sellerId : buyerId
  const conversationId = `${participantA}_${participantB}_${productId}`

  const ref = doc(db, CONVERSATIONS_COL, conversationId)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    // Create new conversation
    await updateDoc(ref, {
      buyerId,
      sellerId,
      productId,
      participants: [buyerId, sellerId],
      lastMessage: null,
      lastMessageTime: new Date(),
      createdAt: new Date(),
    }).catch(() => {
      // Document doesn't exist, create it
      return addDoc(collection(db, CONVERSATIONS_COL), {
        id: conversationId,
        buyerId,
        sellerId,
        productId,
        participants: [buyerId, sellerId],
        lastMessage: null,
        lastMessageTime: new Date(),
        createdAt: new Date(),
      })
    })
  }

  return conversationId
}

// Send a message
export async function sendMessage(conversationId, senderId, text) {
  const messageRef = await addDoc(collection(db, MESSAGES_COL), {
    conversationId,
    senderId,
    text,
    createdAt: new Date(),
    readBy: [senderId],
  })

  // Update conversation last message
  const convRef = doc(db, CONVERSATIONS_COL, conversationId)
  await updateDoc(convRef, {
    lastMessage: text,
    lastMessageTime: new Date(),
  }).catch(() => {}) // Ignore error if document doesn't exist yet

  return { id: messageRef.id, conversationId, senderId, text }
}

// Get all conversations for a user
export async function getUserConversations(userId) {
  const q = query(
    collection(db, CONVERSATIONS_COL),
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  )
  const snap = await getDocs(q)
  const conversations = []
  snap.forEach((d) => conversations.push({ id: d.id, ...d.data() }))
  return conversations
}

// Real-time listener for messages in a conversation
export function subscribeToMessages(conversationId, callback) {
  const q = query(
    collection(db, MESSAGES_COL),
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'asc')
  )

  return onSnapshot(q, (snap) => {
    const messages = []
    snap.forEach((d) => messages.push({ id: d.id, ...d.data() }))
    callback(messages)
  })
}

// Mark messages as read
export async function markMessagesAsRead(conversationId, userId) {
  const q = query(
    collection(db, MESSAGES_COL),
    where('conversationId', '==', conversationId)
  )
  const snap = await getDocs(q)
  snap.forEach((d) => {
    const data = d.data()
    if (!data.readBy?.includes(userId)) {
      updateDoc(d.ref, {
        readBy: [...(data.readBy || []), userId],
      }).catch(() => {}) // Ignore errors
    }
  })
}
