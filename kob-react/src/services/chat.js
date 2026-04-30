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
  increment,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const CONVERSATIONS_COL = "conversations";
const MESSAGES_COL = "messages";

// ✅ LIMITS — Don rage kuɗin Firebase
const MAX_CONVERSATIONS = 20; // 50 → 20
const MAX_MESSAGES_LISTEN = 50; // 500 → 50
const MAX_MARK_READ = 30; // 200 → 30

// ================================
// Create or Get Conversation
// ================================
export async function createOrGetConversation(
  buyerId,
  sellerId,
  productId,
  buyerName,
  sellerName,
  productName
) {
  const participantA = buyerId < sellerId ? buyerId : sellerId;
  const participantB = buyerId < sellerId ? sellerId : buyerId;
  const conversationId = `${participantA}_${participantB}_${productId}`;

  const ref = doc(db, CONVERSATIONS_COL, conversationId);
  const snap = await getDoc(ref); // 1 read kawai

  if (!snap.exists()) {
    await setDoc(ref, {
      buyerId,
      sellerId,
      productId,
      participants: [buyerId, sellerId],

      // ✅ Names — don ConversationList
      buyerName: buyerName || "Buyer",
      sellerName: sellerName || "Seller",
      productName: productName || "",

      // ✅ Unread counts object
      unreadCounts: {
        [buyerId]: 0,
        [sellerId]: 0,
      },

      lastMessage: null,
      lastMessageTime: new Date(),
      createdAt: new Date(),
    }); // 1 write kawai
  }

  return conversationId;
}

// ================================
// Send Message
// ================================
export async function sendMessage(conversationId, senderId, text) {
  if (!text || text.trim() === "") {
    throw new Error("Message cannot be empty");
  }

  // Limit message length — rage storage cost
  const trimmedText = text.trim().slice(0, 500);

  // 1 write — sabon message
  const messageRef = await addDoc(collection(db, MESSAGES_COL), {
    conversationId,
    senderId,
    text: trimmedText,
    createdAt: new Date(),
    readBy: [senderId],
  });

  // Dauko conversation — 1 read
  const convRef = doc(db, CONVERSATIONS_COL, conversationId);
  const convSnap = await getDoc(convRef);

  if (convSnap.exists()) {
    const convData = convSnap.data();

    // Receiver shine wanda ba senderId ba
    const receiverId =
      convData.buyerId === senderId ? convData.sellerId : convData.buyerId;

    // 1 write — update lastMessage + unreadCount
    await updateDoc(convRef, {
      lastMessage: trimmedText.slice(0, 100), // 100 chars kawai
      lastMessageTime: new Date(),
      [`unreadCounts.${receiverId}`]: increment(1),
    }).catch(() => {});
  }

  return {
    id: messageRef.id,
    conversationId,
    senderId,
    text: trimmedText,
  };
}

// ================================
// Get Conversations — Limited
// ================================
export async function getUserConversations(
  userId,
  { pageSize = MAX_CONVERSATIONS } = {}
) {
  // MAX 20 conversations — rage reads
  const q = query(
    collection(db, CONVERSATIONS_COL),
    where("participants", "array-contains", userId),
    orderBy("lastMessageTime", "desc"),
    fbLimit(pageSize) // 20 kawai
  );
  const snap = await getDocs(q); // 20 reads max

  const conversations = [];
  snap.forEach((d) => conversations.push({ id: d.id, ...d.data() }));
  return conversations;
}

// ================================
// Real-time Messages — Limited
// ================================
export function subscribeToMessages(
  conversationId,
  callback,
  { limit = MAX_MESSAGES_LISTEN } = {}
) {
  // MAX 50 messages — rage listener cost
  const q = query(
    collection(db, MESSAGES_COL),
    where("conversationId", "==", conversationId),
    orderBy("createdAt", "asc"),
    fbLimit(limit) // 50 kawai
  );

  return onSnapshot(q, (snap) => {
    const messages = [];
    snap.forEach((d) => messages.push({ id: d.id, ...d.data() }));
    callback(messages);
  });
}

// ================================
// Mark Messages as Read — Limited
// ================================
export async function markMessagesAsRead(
  conversationId,
  userId,
  { limit = MAX_MARK_READ } = {}
) {
  // MAX 30 messages — rage reads + writes
  const q = query(
    collection(db, MESSAGES_COL),
    where("conversationId", "==", conversationId),
    orderBy("createdAt", "desc"),
    fbLimit(limit) // 30 kawai
  );

  const snap = await getDocs(q); // 30 reads max

  // Batch updates — write kawai inda ya kamata
  snap.forEach((d) => {
    const data = d.data();
    if (!data.readBy?.includes(userId)) {
      updateDoc(d.ref, {
        readBy: [...(data.readBy || []), userId],
      }).catch(() => {});
      // Max 30 writes
    }
  });

  // 1 write — reset unread count
  const convRef = doc(db, CONVERSATIONS_COL, conversationId);
  await updateDoc(convRef, {
    [`unreadCounts.${userId}`]: 0,
  }).catch(() => {});
}
