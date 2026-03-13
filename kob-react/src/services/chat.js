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
  setDoc,
  getDocs,
  limit as fbLimit,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

const CONVERSATIONS_COL = 'conversations'
const MESSAGES_COL = 'messages'
const MAX_CONVERSATIONS = 50
const MAX_MESSAGES_LISTEN = 500
const MAX_MARK_READ = 200

// Create or get conversation between buyer and seller

export async function createOrGetConversation(buyerId, sellerId, productId) {

  // Ensure consistent conversation ID
  const participantA = buyerId < sellerId ? buyerId : sellerId
  const participantB = buyerId < sellerId ? sellerId : buyerId
  const conversationId = `${participantA}_${participantB}_${productId}`

  const ref = doc(db, CONVERSATIONS_COL, conversationId)
  const snap = await getDoc(ref)

  if (!snap.exists()) {

    await setDoc(ref, {
      buyerId,
      sellerId,
      productId,
      participants: [buyerId, sellerId],
      lastMessage: null,
      lastMessageTime: new Date(),
      createdAt: new Date(),
    })

  }

  return conversationId
}
// Send a message
export async function sendMessage(conversationId, senderId, text) {
  if (!text || text.trim() === '') {
    throw new Error('Message cannot be empty')
  }
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

// Get recent conversations for a user (limited)
export async function getUserConversations(userId, { pageSize = MAX_CONVERSATIONS } = {}) {
  const q = query(
    collection(db, CONVERSATIONS_COL),
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc'),
    fbLimit(pageSize)
  )
  const snap = await getDocs(q)
  const conversations = []
  snap.forEach((d) => conversations.push({ id: d.id, ...d.data() }))
  return conversations
}

// Real-time listener for messages in a conversation (limited to recent N messages)
export function subscribeToMessages(conversationId, callback, { limit = MAX_MESSAGES_LISTEN } = {}) {
  const q = query(
    collection(db, MESSAGES_COL),
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'asc'),
    fbLimit(limit)
  )

  return onSnapshot(q, (snap) => {
    const messages = []
    snap.forEach((d) => messages.push({ id: d.id, ...d.data() }))
    callback(messages)
  })
}

// Mark recent messages as read (limited for cost control)
export async function markMessagesAsRead(conversationId, userId, { limit = MAX_MARK_READ } = {}) {
  const q = query(
    collection(db, MESSAGES_COL),
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'desc'),
    fbLimit(limit)
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
