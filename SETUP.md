# KOB Setup Guide

Complete setup instructions for developing and deploying Katsina Online Business.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Firebase Configuration](#firebase-configuration)
3. [Environment Variables](#environment-variables)
4. [Third-Party Services](#third-party-services)
5. [Database Setup](#database-setup)
6. [Verification Checklist](#verification-checklist)

---

## Local Development Setup

### Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher
- **Git**: For version control
- **A text editor**: VS Code recommended

### Step 1: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/kob.git
cd kob
```

### Step 2: Install Dependencies

```bash
cd kob-react
npm install
```

This installs all required packages:
- React & React Router
- Vite & build tools
- Tailwind CSS
- Firebase SDK
- ESLint

### Step 3: Create Environment File

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your credentials
nano .env.local
# or open in your editor
```

### Step 4: Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Step 5: Open in Browser

Visit http://localhost:5173 and you should see:
- KOB landing page
- Navigation menu
- Sign up option

---

## Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `katsina-online-business`
4. Choose region: `Africa (South Africa) - southafrika`
5. Click "Create project"
6. Wait for project creation (2-3 minutes)

### 2. Register Web App

1. In Firebase project, click **</>** (Web icon)
2. App nickname: `KOB Web App`
3. Click "Register app"
4. Copy the Firebase configuration (you'll need this)

### 3. Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**:
   - Click "Email/Password"
   - Toggle on "Enable"
   - Click "Save"

### 4. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose region: `South Africa (southafrika)` (closest to Katsina)
4. Start in **Production mode** (we'll set rules)
5. Click "Create"

### 5. Set Security Rules

In Firestore, go to **Rules** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read any user profile
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId;
    }

    // Products - everyone can read, authenticated can create
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth.uid != null;
      allow update: if request.auth.uid == resource.data.ownerUid;
      allow delete: if request.auth.uid == resource.data.ownerUid;
    }

    // Reviews - everyone can read
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth.uid != null;
      allow update: if request.auth.uid == resource.data.userId;
      allow delete: if request.auth.uid == resource.data.userId;
    }

    // Orders
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.buyerId || 
                     request.auth.uid == resource.data.sellerId;
      allow create: if request.auth.uid != null;
    }
  }
}
```

Click "Publish"

### 6. Enable Cloud Storage

1. Go to **Storage**
2. Click "Get started"
3. Start in **Production mode**
4. Choose region: `South Africa (southafrika)`
5. Click "Done"

Update Storage Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid != null;
      allow delete: if request.auth.uid != null;
    }
  }
}
```

---

## Environment Variables

### Create .env.local File

In `/kob-react/` create `.env.local`:

```bash
# ==========================================
# FIREBASE CONFIGURATION
# ==========================================
# Get these from Firebase Console → Project Settings

VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=katsina-online-business.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://katsina-online-business.firebaseio.com
VITE_FIREBASE_PROJECT_ID=katsina-online-business
VITE_FIREBASE_STORAGE_BUCKET=katsina-online-business.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789...
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...

# ==========================================
# CLOUDINARY CONFIGURATION
# ==========================================
# Get these from Cloudinary Dashboard

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=kob_upload_preset

# ==========================================
# PAYSTACK CONFIGURATION (removed)
# ==========================================
# Payment integration has been removed in Phase 9. No Paystack keys are
# required; buyers and sellers coordinate transactions offline.
# VITE_PAYSTACK_PUBLIC_KEY can be omitted.


# ==========================================
# GOOGLE ANALYTICS
# ==========================================
# Get from Google Analytics → Admin → Property Settings

VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ==========================================
# EMAIL SERVICE (Optional)
# ==========================================
# For development, emails are logged to console
# For production, integrate with SendGrid or Mailgun

VITE_EMAIL_SERVICE_URL=https://api.sendgrid.com/v3/mail/send
# VITE_EMAIL_API_KEY=your_sendgrid_key
```

### Important Notes

- **Never commit `.env.local`** to version control
- Each developer should have their own `.env.local`
- For production, set variables in your hosting platform
- Keep API keys secure - they are access credentials

---

## Third-Party Services

### Cloudinary (Image Upload)

#### Create Account

1. Go to [Cloudinary](https://cloudinary.com)
2. Click "Sign up for free"
3. Create account (free tier: 25GB storage)
4. Confirm email

#### Create Upload Preset

1. Go to **Settings** → **Upload**
2. Under "Upload presets", click "Add upload preset"
3. Preset name: `kob_upload_preset`
4. Mode: **Unsigned** (important for browser uploads)
5. Click "Save"

#### Get Cloud Name

1. Go to **Dashboard**
2. Copy your **Cloud Name**
3. Paste into `.env.local`: `VITE_CLOUDINARY_CLOUD_NAME=`
### Paystack (Payments) *(removed)*

Payment integration has been removed in Phase 9; no configuration is required.


### Google Analytics

#### Create Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Click "Start measuring"
3. Property name: `Katsina Online Business`
4. Timezone: `Africa/Lagos` (Katsina is in Lagos timezone)
5. Currency: `NGN` (Nigerian Naira)
6. Platform: **Web**
7. Website URL: `http://localhost:5173` (for development)
8. Click "Create"

#### Get Measurement ID

1. Go to **Admin** → **Data Streams**
2. Click your web stream
3. Copy **Measurement ID** (format: `G-XXXXXXXXXX`)
4. Paste into `.env.local`: `VITE_GA_MEASUREMENT_ID=`

#### Setup Events

Analytics automatically tracks:
- `page_view` - Page visits
- `scroll` - Scroll depth
- `click` - Button clicks

Plus custom events:
- `search` - Product searches
- `add_to_cart` - Add to cart
- `purchase` - Successful payment
- `sign_up` - Registration
- `contact_form_submit` - Contact form

### SendGrid (Email - Optional)

For production email delivery:

1. Create [SendGrid Account](https://sendgrid.com)
2. Verify sender email
3. Create API key
4. Install backend to call SendGrid API
5. Update email service with backend URL

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for backend setup.

---

## Database Setup

### Collections

After launching the app, these Firestore collections will be auto-created:

#### Users Collection
```javascript
{
  uid: "user123",
  email: "user@example.com",
  name: "John Doe",
  role: "buyer", // or "seller" or "admin"
  phone: "+234701234567",
  address: "123 Main St, Katsina",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### Products Collection
```javascript
{
  id: "product123",
  title: "Tomato Seeds",
  description: "High quality tomato seeds...",
  price: 50000, // in kobo (₦500)
  category: "Agriculture",
  ownerUid: "seller123",
  images: ["url1", "url2"],
  inStock: true,
  quantity: 100,
  rating: 4.5,
  reviewCount: 24,
  location: "Katsina",
  whatsappNumber: "+234701234567",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### Reviews Collection
```javascript
{
  id: "review123",
  productId: "product123",
  userId: "buyer123",
  rating: 5,
  comment: "Great product!",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### Orders Collection
```javascript
{
  id: "order123",
  buyerId: "buyer123",
  sellerId: "seller123",
  productId: "product123",
  quantity: 2,
  totalAmount: 100000, // in kobo
  status: "pending", // pending, confirmed, shipped, delivered, cancelled
  paymentReference: "paystack_ref",
  shippingAddress: "...",
  createdAt: Timestamp
}
```

---

## Verification Checklist

After setup, verify everything works:

### Development Server
- [ ] `npm run dev` starts without errors
- [ ] Website loads at http://localhost:5173
- [ ] No console errors (F12 → Console)
- [ ] Navigation works
- [ ] Pages load correctly

### Firebase
- [ ] Can create account (Register page)
- [ ] Can log in (Login page)
- [ ] User appears in Firebase Authentication
- [ ] User document created in Firestore
- [ ] Can create product (Dashboard)
- [ ] Product appears in Firestore
- [ ] Product appears on Marketplace

### Cloudinary
- [ ] Can upload product image
- [ ] Image URL generated correctly
- [ ] Image displays in product card

### Paystack
- [ ] "Buy Now" button appears for test products
- [ ] Paystack modal opens
- [ ] Test payment works with test card `4084084084084081`
- [ ] Payment successful message appears
- [ ] Order created in Firestore

### Google Analytics
- [ ] Open DevTools (F12)
- [ ] Go to Network tab
- [ ] Look for requests to `google-analytics.com` or `analytics.google.com`
- [ ] Reload page - should see GA request
- [ ] Wait 24 hours, check Google Analytics Dashboard
- [ ] Should see page views and events

### Email
- [ ] Check browser console (F12)
- [ ] Should see `Email would be sent:` messages (development mode)
- [ ] Verify email content is correct

---

## Troubleshooting

### Build Errors

**Error**: `Cannot find module 'react'`
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error**: `Firebase configuration invalid`
- Check `.env.local` has all Firebase variables
- Verify values match Firebase Console
- No typos or extra spaces

### Firebase Errors

**Error**: `Permission denied` in Firestore
- Check security rules are published
- User must be authenticated to write
- Check rule matches data structure

**Error**: `Missing or insufficient permissions`
- Ensure user role is set in Firestore
- Check security rules for your operation
- Verify user is logged in



### Analytics Errors

**Error**: `gtag is not defined`
- Add `VITE_GA_MEASUREMENT_ID` to `.env.local`
- Wait for next page load
- Check Network tab for GA requests

---

## Next Steps

1. Complete all verification items above
2. Read [README.md](./kob-react/README.md) for project overview
3. Review [services/](./kob-react/src/services/) to understand APIs
4. Explore [pages/](./kob-react/src/pages/) to see page structure
5. Check [components/](./kob-react/src/components/) for UI components
6. When ready to deploy, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## Support

- **Firebase Help**: https://firebase.google.com/support
<!-- Paystack support link removed; payment feature deprecated -->
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

---

**Setup complete!** 🎉 Your KOB development environment is ready.
