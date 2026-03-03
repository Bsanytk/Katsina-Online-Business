# Firestore Security Rules - Ownership-Based Model

## Overview

KOB implements a **community-first, slow-growth marketplace** with a simplified ownership-based Firestore security model. This document explains the security architecture and how it supports safe, simple user interactions.

### Principles

- **Ownership enforced**: Users can only modify their own data.
- **Public reads**: Marketplace listings are readable by anyone (authenticated or not).
- **No admin logic**: Removed role-based restrictions for now; all users have equal rights to create and manage their own products.
- **Participant-based access**: Chat and order features limit access to involved parties only.

---

## Collections & Rules

### Users Collection

**Security Model**: Ownership-based  
**Location**: `/users/{uid}`

| Operation | Rule | Notes |
|-----------|------|-------|
| **Read** | Authenticated user can read only **their own** profile | `request.auth.uid == uid` |
| **Create** | Authenticated user can create **their own** profile | `request.auth.uid == uid` |
| **Update** | Authenticated user can update **their own** profile | `request.auth.uid == uid` |
| **Delete** | **Not allowed** | `allow delete: if false` |

**Frontend requirement**: User profiles are created by Firebase Auth; no custom role or admin fields can be set from the client.

---

### Products Collection

**Security Model**: Public read, ownership-based write  
**Location**: `/products/{productId}`

| Operation | Rule | Notes |
|-----------|------|-------|
| **Read** | **Anyone** can read (public marketplace) | `allow read: if true` |
| **Create** | Authenticated users only; **`ownerUid` must match `request.auth.uid`** | Required fields: `title`, `price`, `ownerUid` |
| **Update** | **Only the product owner** can update | `request.auth.uid == resource.data.ownerUid` |
| **Delete** | **Only the product owner** can delete | `request.auth.uid == resource.data.ownerUid` |

**Frontend requirement**: Every product created via the Marketplace must include `ownerUid: user.uid` in the payload.

**Example**:
```javascript
const payload = {
  title: "Vintage Bicycle",
  description: "...",
  price: 50000,
  category: "Sports",
  ownerUid: currentUser.uid,  // ← Required by rules
  imageURL: "...",
  createdAt: new Date()
}
await addProduct(payload)
```

---

### Reviews Collection

**Security Model**: Public read, buyer-only write  
**Location**: `/reviews/{reviewId}`

| Operation | Rule | Notes |
|-----------|------|-------|
| **Read** | **Anyone** can read reviews | `allow read: if true` |
| **Create** | Authenticated users only; **`buyerId` must match `request.auth.uid`** | Required fields: `productId`, `sellerId`, `buyerId`, `rating`, `text` |
| **Update** | **Only the review author (buyer)** can update | `buyerId == request.auth.uid` |
| **Delete** | **Only the review author (buyer)** can delete | `buyerId == request.auth.uid` |

---

### Orders Collection (Simplified Requests)

**Security Model**: Participant-based access, ownership-based creation  
**Location**: `/orders/{orderId}`

| Operation | Rule | Notes |
|-----------|------|-------|
| **Read** | **Only buyer or seller** can read their order | Participant check: `buyerId == uid` or `sellerId == uid` |
| **Create** | **Only the buyer** can create an order; `buyerId` must match `request.auth.uid` | Required fields: `buyerId`, `sellerId`, `productId` |
| **Update** | **Buyer or seller** can update (status, notes, etc.) | Both parties can modify the order |
| **Delete** | **Only the buyer** can delete their own order request | `buyerId == request.auth.uid` |

---

### Conversations Collection

**Security Model**: Participant-based access  
**Location**: `/conversations/{conversationId}`

| Operation | Rule | Notes |
|-----------|------|-------|
| **Read** | **Only participants** can read conversation metadata | Check: `request.auth.uid in participants` |
| **Create** | **Participants only**; `participants` array must include `request.auth.uid` | Required fields: `participants`, `productId` |
| **Update** | **Participants can update** (but cannot change participants list) | Prevents tampering with participant list |
| **Delete** | **Not allowed** | Conversations are immutable once created |

#### Messages Subcollection

**Location**: `/conversations/{conversationId}/messages/{messageId}`

| Operation | Rule | Notes |
|-----------|------|-------|
| **Read** | **Only conversation participants** can read messages | Inherits participant check from parent |
| **Create** | **Participants only**; `senderId` must match `request.auth.uid` | Required fields: `conversationId`, `senderId`, `text`, `createdAt` |
| **Update** | **Only the sender** can update their own message | `senderId == request.auth.uid` |
| **Delete** | **Not allowed** | Messages are immutable |

---

## Frontend Integration Checklist

Use this checklist when adding or modifying product-related code:

- [ ] **Product Creation**
  - [ ] Marketplace form includes `ownerUid: user.uid` in payload
  - [ ] Cloudinary upload completes before submission
  - [ ] Form validation checks required fields: `title`, `price`, `ownerUid`
  - [ ] `createdAt` timestamp is added server-side (via service)

- [ ] **Product Update**
  - [ ] Only the product owner can see the edit button
  - [ ] `ownerUid` is preserved and not modified during update
  - [ ] `updatedAt` timestamp is added during update

- [ ] **Product Deletion**
  - [ ] Only the product owner can see the delete button
  - [ ] Confirmation dialog shows before deletion
  - [ ] Frontend removes product from UI after deletion

- [ ] **Reviews**
  - [ ] Review form pre-fills `buyerId` with current user's UID
  - [ ] Review form includes `sellerId` (product seller's UID)
  - [ ] Review form includes `productId` for reference
  - [ ] Only non-sellers (buyers) can leave reviews on products they don't own

- [ ] **Conversations**
  - [ ] Conversation `participants` array is created with both user IDs
  - [ ] Only participants can view or send messages
  - [ ] New messages include `senderId: user.uid` and `createdAt`

- [ ] **Orders**
  - [ ] Buyer sets `buyerId: user.uid` when creating an order
  - [ ] Both buyer and seller can update order status
  - [ ] Deletion is only available to the buyer

---

## Deployment & Testing

### Local Testing

1. **Start dev server**:
   ```bash
   cd kob-react && npm run dev -- --host
   ```

2. **Create test users**:
   - Register User A (seller)
   - Register User B (buyer)

3. **Test product ownership**:
   - User A creates a product → ✅ Should succeed
   - User B views User A's product → ✅ Should see it
   - User B attempts to edit User A's product → ❌ Should fail (Firestore permission error)
   - User B attempts to delete User A's product → ❌ Should fail

4. **Test reviews**:
   - User B leaves a review on User A's product → ✅ Should succeed
   - User A attempts to modify User B's review → ❌ Should fail

5. **Test conversations**:
   - User A and User B start a conversation → ✅ Should succeed
   - User C (third party) attempts to view the conversation → ❌ Should fail

6. **Build for production**:
   ```bash
   npm run build
   ```
   Should complete without errors.

### Firestore Console Checks

After deploying rules to Firebase:

1. Go to **Firestore Database** → **Rules** tab
2. Click **Publish** (after testing locally)
3. Monitor **Firestore Usage** dashboard for:
   - Permission denied errors (indicate rule violations)
   - Read/write quota consumption (should be low on free tier)

---

## Backward Compatibility

**Old products without `ownerUid`**:
- Can be read by anyone (public-read rule allows this)
- Cannot be updated or deleted (rules require `ownerUid` field to exist)
- Consider a migration script to backfill `ownerUid` for existing products if needed

**Old role-based access**:
- Admin role logic has been removed from rules
- Users with a `role` field can still log in, but their role is not enforced
- All users have equal rights to create, edit, and delete their own products

---

## FAQ

**Q: Can I add role-based admin functionality later?**  
A: Yes. Simply add admin checks back to the rules (e.g., `|| get(...).data.role == 'admin'`) without changing the ownership model for regular users.

**Q: What if a user's `ownerUid` doesn't match their `request.auth.uid`?**  
A: Firestore will reject the write operation with a permission error. This is intentional—users cannot impersonate others.

**Q: Can unauthenticated users create products?**  
A: No. The `allow create` rule requires `request.auth != null`.

**Q: Who can delete a product?**  
A: Only the owner. There's no admin override in the current rules.

**Q: Can the seller see partial order information without being in the `participants` array?**  
A: No. Orders are participant-only. Sellers must be explicitly added to the order to see it.

---

## Summary

This ownership-based model ensures:
- ✅ **Security**: Users can only modify their own resources
- ✅ **Simplicity**: No role management complexity
- ✅ **Scalability**: Rules are straightforward and performant
- ✅ **Community-first**: Everyone can create and sell; no gating

For questions or issues, refer to the [Architecture Documentation](./ARCHITECTURE.md) or the [Deployment Guide](./DEPLOYMENT_GUIDE.md).
