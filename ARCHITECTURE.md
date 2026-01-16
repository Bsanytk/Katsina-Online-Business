# KOB Architecture Documentation

Complete system architecture for Katsina Online Business marketplace platform.

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Diagram](#architecture-diagram)
4. [Component Hierarchy](#component-hierarchy)
5. [Data Flow](#data-flow)
6. [Service Layer](#service-layer)
7. [Authentication Flow](#authentication-flow)
8. [Payment Flow](#payment-flow)
9. [Deployment Architecture](#deployment-architecture)
10. [Security Layers](#security-layers)

---

## System Overview

KOB is a full-stack marketplace web application built with modern technologies. It uses:

- **Frontend**: React with client-side routing
- **Backend**: Firebase (no dedicated backend needed)
- **Database**: Firestore (NoSQL)
- **Storage**: Firebase Cloud Storage + Cloudinary
- **Payment**: Paystack
- **Analytics**: Google Analytics 4

The architecture follows a **3-tier model**:

```
┌─────────────────────────────────────┐
│  Presentation Layer (React)         │
│  - Components                       │
│  - Pages                            │
│  - Styles (Tailwind CSS)            │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Business Logic Layer (Services)    │
│  - Authentication                   │
│  - Products                         │
│  - Payment                          │
│  - Analytics                        │
│  - Email                            │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Data Layer (Firebase)              │
│  - Authentication                   │
│  - Firestore Database               │
│  - Cloud Storage                    │
└─────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 19.2.0 |
| Router | React Router | 6.17.0 |
| Build Tool | Vite | 7.2.4 |
| Styling | Tailwind CSS | 4.1.18 |
| Icons | React Icons | Latest |

### Backend Services
| Service | Provider | Purpose |
|---------|----------|---------|
| Authentication | Firebase Auth | User login/registration |
| Database | Firestore | Product, review, user data |
| Storage | Firebase Storage | Product images |
| Image CDN | Cloudinary | Image hosting & optimization |

### External Integrations
| Service | Provider | Purpose |
|---------|----------|---------|
| Payments | Paystack | Process Nigerian payments |
| Analytics | Google Analytics 4 | User behavior tracking |
| Email | SendGrid/Mailgun | Transactional emails |

### Developer Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code quality |
| PostCSS | CSS processing |
| Vite | Dev server & bundling |

---

## Architecture Diagram

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Application (SPA)                     │  │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────────────┐ │  │
│  │  │ Pages      │  │ Components │  │ Services Layer    │ │  │
│  │  ├────────────┤  ├────────────┤  ├───────────────────┤ │  │
│  │  │ Home       │  │ ProductCard│  │ auth.js           │ │  │
│  │  │ Marketplace│  │ ProductList│  │ products.js       │ │  │
│  │  │ Dashboard  │  │ CheckoutM. │  │ payment.js        │ │  │
│  │  │ Login      │  │ ErrorBound │  │ analytics.js      │ │  │
│  │  │ Register   │  │ ProductRev │  │ email.js          │ │  │
│  │  │ Contact    │  │ Sidebar    │  │ seo.js            │ │  │
│  │  │ etc.       │  │ etc.       │  │ performance.js    │ │  │
│  │  └────────────┘  └────────────┘  └───────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
           ↓              ↓              ↓           ↓
    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐
    │ Firebase │  │ Paystack │  │Cloudinary│  │   Google     │
    │ (Auth,   │  │ (Payment)│  │(Images)  │  │ Analytics    │
    │ Database,│  └──────────┘  └──────────┘  │              │
    │ Storage) │                              └──────────────┘
    └──────────┘
```

### Frontend Component Tree

```
App
├── TopBar
├── Sidebar
├── ErrorBoundary
│   └── Router
│       ├── Route: Home
│       ├── Route: Marketplace
│       │   ├── ProductFilter
│       │   ├── ProductList
│       │   │   └── ProductCard (x multiple)
│       │   │       └── CheckoutModal
│       │   └── ProductForm
│       ├── Route: Dashboard
│       │   ├── BuyerDashboard
│       │   ├── SellerDashboard
│       │   └── AdminDashboard
│       ├── Route: Login
│       ├── Route: Register
│       ├── Route: Contact
│       └── Route: ProductDetail
│           ├── ProductReviews
│           ├── SellerRating
│           └── CheckoutModal
└── SupportWidget (floating)
```

---

## Component Hierarchy

### Core Layout Components

```javascript
// App.jsx (Root)
<ErrorBoundary>
  <TopBar />           // Navigation
  <Sidebar />          // Menu
  <Outlet />          // Page content
  <SupportWidget />   // Floating help
</ErrorBoundary>
```

### Feature Component Groups

**Marketplace Components**
- `ProductCard` - Single product display with buy/contact buttons
- `ProductList` - Grid of products with pagination
- `ProductFilter` - Search, category, price filters
- `ProductForm` - Add/edit product listings

**Review Components**
- `ProductReviews` - Display and add reviews
- `SellerRating` - Aggregate seller rating display

**Checkout Components**
- `CheckoutModal` - 2-step payment flow
- Payment integration with Paystack

**Support Components**
- `SupportWidget` - Floating help panel
- FAQ accordion
- Contact form

**Page Components**
- Home, Marketplace, Dashboard, Login, Register, Contact, etc.

---

## Data Flow

### User Authentication Flow

```
1. User → Register Page
   ↓
2. Firebase Auth → Create account
   ↓
3. Firestore → Create user document
   ↓
4. Auth Service → Set user role (buyer/seller/admin)
   ↓
5. Local Storage → Store authentication token
   ↓
6. App → Redirect to Dashboard
```

### Product Listing Flow

```
1. Seller → Dashboard
   ↓
2. ProductForm → Collect data + image
   ↓
3. Cloudinary → Upload image
   ↓
4. Firestore → Save product with image URL
   ↓
5. Marketplace → Display product in grid
   ↓
6. Analytics → Track product_created event
```

### Purchase Flow

```
1. Buyer → Marketplace
   ↓
2. ProductCard → Click "Buy Now"
   ↓
3. CheckoutModal → Step 1: Enter delivery info
   ↓
4. CheckoutModal → Step 2: Select payment method
   ↓
5. Paystack → Process payment
   ↓
6. Firestore → Create order document
   ↓
7. Email Service → Send confirmation emails
   ↓
8. Analytics → Track purchase event
```

### Review Submission Flow

```
1. Buyer → Product page
   ↓
2. ProductReviews → Submit rating + comment
   ↓
3. Firestore → Save review document
   ↓
4. Products → Recalculate product rating
   ↓
5. SellerRating → Update seller aggregate rating
   ↓
6. Email Service → Notify seller of review
   ↓
7. Analytics → Track leave_review event
```

---

## Service Layer

### Authentication Service (`services/auth.js`)

**Exports:**
- `registerWithEmail(email, password, role)` - New user
- `loginWithEmail(email, password)` - Login
- `logout()` - Logout
- `getCurrentUser()` - Get auth user
- `updateUserProfile(updates)` - Update profile
- `getUserRole(uid)` - Get user role from Firestore
- `setUserRole(uid, role)` - Set user role

**Dependencies:**
- Firebase Authentication
- Firestore

### Products Service (`services/products.js`)

**Exports:**
- `getProducts(filters)` - Get all/filtered products
- `getProductById(id)` - Get single product
- `createProduct(data)` - Add new product
- `updateProduct(id, updates)` - Modify product
- `deleteProduct(id)` - Remove product
- `getProductsByUser(userId)` - Get seller's products
- `addReview(productId, data)` - Add review
- `getProductReviews(productId)` - Get reviews
- `getProductRating(productId)` - Get rating

**Dependencies:**
- Firestore
- Cloudinary (images)

### Payment Service (`services/payment.js`)

**Exports:**
- `initializePayment(data)` - Start Paystack checkout
- `calculatePaymentFee(amount)` - Calculate fees
- `verifyPayment(reference)` - Verify transaction

**Dependencies:**
- Paystack API
- Firestore (order storage)

### Analytics Service (`services/analytics.js`)

**Exports:**
- `trackEvent(name, data)` - Track custom event
- `setUserProperties(props)` - Set user attrs
- `useAnalytics()` - React hook

**Tracked Events:**
- page_view
- search
- add_to_cart
- purchase
- sign_up
- login
- contact_form_submit
- leave_review
- product_click
- seller_click

**Dependencies:**
- Google Analytics 4

### Email Service (`services/email.js`)

**Exports:**
- `sendEmail(data)` - Send email
- Templates: order_confirmation, seller_notification, welcome, etc.

**Development:** Logs to console  
**Production:** Calls backend API → SendGrid/Mailgun

**Dependencies:**
- SendGrid API (production)

### SEO Service (`services/seo.js`)

**Exports:**
- `usePageMeta(pathname)` - Auto-update meta tags
- `updatePageMeta(config)` - Manual meta update
- `addStructuredData(type, data)` - JSON-LD
- `generateSitemap()` - XML sitemap
- `generateRobotsTxt()` - Robots file

**Dependencies:**
- DOM APIs (document.head)
- React

### Performance Service (`services/performance.js`)

**Exports:**
- `webVitalsTracker.init()` - Start tracking
- `webVitalsTracker.generateReport()` - Get report
- `useWebVitals()` - React hook

**Metrics Tracked:**
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- FCP (First Contentful Paint)
- TTFB (Time to First Byte)
- TTI (Time to Interactive)

**Dependencies:**
- PerformanceObserver API
- Google Analytics

---

## Authentication Flow

### Registration Flow

```
User Input → Register Component
    ↓
Validation → Check email format, password strength
    ↓
Firebase Auth → createUserWithEmailAndPassword()
    ↓
Firestore → Create /users/{uid} document
    ↓
Set Role → Store role in Firestore (buyer/seller)
    ↓
Auth State → Update React context
    ↓
Redirect → Send to Dashboard
```

### Login Flow

```
User Input → Login Component
    ↓
Validation → Check email and password
    ↓
Firebase Auth → signInWithEmailAndPassword()
    ↓
Auth State → onAuthStateChanged() updates context
    ↓
Fetch User → Load /users/{uid} from Firestore
    ↓
Check Role → Determine buyer/seller/admin
    ↓
Redirect → Send to Dashboard (role-based)
```

### Protected Routes

```
ProtectedRoute Component
    ↓
Check Auth → Is user logged in?
    ├─ No → Redirect to /login
    ├─ Yes → Check role
    │   ├─ Buyer? → Allow on /marketplace, /dashboard/buyer
    │   ├─ Seller? → Allow on /dashboard/seller, /product/create
    │   ├─ Admin? → Allow on /dashboard/admin
    └─ Else → Redirect to appropriate dashboard
```

### Session Management

```
Firebase Auth → onAuthStateChanged()
    ↓
React Context → AuthContext stores user state
    ↓
App.jsx → useEffect listens for auth changes
    ↓
Redirect → Auto-redirect based on auth status
    ↓
Token → Automatically managed by Firebase SDK
```

---

## Payment Flow

### Paystack Integration

```
Buyer → Clicks "Buy Now"
    ↓
CheckoutModal → Opens (Step 1: Delivery Info)
    ↓
Step 2 → Payment Method Selection
    ↓
Calculate Fee → 1.5% + ₦100
    ↓
Initialize Payment → Call initializePayment()
    ↓
Paystack Dialog → Opens payment modal
    ↓
Payment Methods:
├─ Card (Visa/Mastercard/Verve)
├─ USSD (Bank transfers)
├─ Bank Account
└─ Mobile Money
    ↓
Payment Verification → Transaction confirmed
    ↓
Create Order → Save /orders/{id} in Firestore
    ↓
Send Emails:
├─ Order Confirmation → Buyer
└─ Seller Notification → Seller
    ↓
Track Analytics → purchase event
    ↓
Clear Cart → Reset checkout state
```

### Fee Calculation

```
Amount: ₦1,000 (100,000 kobo)

Fee = (Amount × 1.5%) + ₦100
    = (100,000 × 0.015) + 10,000
    = 1,500 + 10,000
    = ₦115 total fee

Total = Amount + Fee
      = ₦1,000 + ₦115
      = ₦1,115
```

---

## Deployment Architecture

### Development Environment

```
Local Machine
├── npm run dev
├── Vite Dev Server (port 5173)
├── Hot Module Replacement (HMR)
├── Firebase Emulator (optional)
└── Console logging for debugging
```

### Production Environment

```
┌─────────────────────────────────────┐
│      Browser (User)                 │
└─────────────────────────────────────┘
             ↓ HTTPS
┌─────────────────────────────────────┐
│  CDN (Vercel/Netlify/Firebase)     │
│  ├─ Static files (JS, CSS, HTML)   │
│  ├─ Image caching                  │
│  └─ DDoS protection                │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  External Services                  │
│  ├─ Firebase (Auth, DB, Storage)   │
│  ├─ Cloudinary (Image CDN)         │
│  ├─ Paystack (Payments)            │
│  ├─ Google Analytics               │
│  └─ SendGrid (Email)               │
└─────────────────────────────────────┘
```

### Build Process

```
Source Code
    ↓
npm run build
    ↓
Vite Bundling
├─ Code splitting per route
├─ CSS minification
├─ JavaScript minification
└─ Image optimization (optional)
    ↓
dist/ Folder
├─ index.html
├─ assets/js/*.js
├─ assets/css/*.css
└─ assets/img/*.jpg|png
    ↓
Deploy to Hosting
├─ Vercel: Auto-deploy on git push
├─ Firebase: firebase deploy --only hosting
└─ Netlify: netlify deploy --prod
```

---

## Security Layers

### Frontend Security

```
1. Input Validation
   └─ Validate all user input before submission
   └─ Email format, password strength, etc.

2. Authentication
   └─ Firebase Auth manages credentials
   └─ No passwords stored locally
   └─ JWT tokens auto-managed

3. HTTPS Only
   └─ All data encrypted in transit
   └─ SSL/TLS certificates

4. XSS Prevention
   └─ React escapes content by default
   └─ Sanitize HTML in reviews

5. CSRF Protection
   └─ Same-origin requests only
   └─ Firebase tokens validated
```

### Backend Security (Firebase)

```
1. Firestore Security Rules
   ├─ Users can only read public data
   ├─ Users can only modify their own documents
   ├─ Products owned by seller can only be edited by seller
   ├─ Reviews can only be edited by author
   └─ Admin-only operations protected

2. Firebase Authentication
   ├─ Email verification required
   ├─ Password reset functionality
   ├─ Session management
   └─ Rate limiting

3. Cloud Storage Rules
   ├─ Unsigned uploads for products
   ├─ Size limits enforced
   ├─ File type validation
   └─ Delete-after-1-day for unattached files

4. API Keys
   ├─ Public key (Firebase API) - restricted
   ├─ Secret key stored in backend only
   └─ Regular key rotation
```

### Data Protection

```
1. Sensitive Data
   ├─ Never store passwords (Firebase handles)
   ├─ Payment info → Paystack (not stored)
   ├─ Email encrypted at rest
   └─ Phone numbers optional

2. User Privacy
   ├─ GDPR compliant
   ├─ Data export on request
   ├─ Data deletion on request
   └─ Privacy policy required

3. Third-Party APIs
   ├─ Only necessary APIs called
   ├─ Rate limiting implemented
   ├─ Error messages don't leak info
   └─ Keys rotated regularly
```

### Error Handling Security

```
1. Development
   └─ Full stack traces in console

2. Production
   ├─ Generic error messages to users
   ├─ Error details logged server-side
   ├─ Sensitive data never in error messages
   └─ Error monitoring via Sentry (optional)
```

---

## Scaling Considerations

### Current Limits

```
Firebase (Free Tier)
├─ 50,000 reads/day
├─ 20,000 writes/day
├─ 1GB storage
└─ 100 simultaneous connections

Paystack
├─ No API call limits
├─ Transaction limits based on account tier
└─ Webhook delivery guaranteed

Cloudinary
├─ 25GB storage
├─ 25 uploads/hour
└─ Unlimited downloads
```

### Scaling Path

```
Phase 1 (Current)
├─ Firebase Spark (Free)
├─ ~100-1000 active users
└─ Cloudinary free tier

Phase 2 (Growth)
├─ Firebase Blaze (Pay-as-you-go)
├─ ~1000-10,000 users
├─ Database indexes
└─ Cloudinary paid plan

Phase 3 (Scale)
├─ Firebase with optimization
├─ Dedicated backend API
├─ Database sharding
├─ Multi-region deployment
└─ CDN optimization

Phase 4 (Enterprise)
├─ Managed database (PostgreSQL)
├─ Kubernetes deployment
├─ Load balancing
├─ Advanced caching
└─ Custom payment integration
```

### Performance Optimization

```
Frontend
├─ Code splitting (routes)
├─ Lazy loading (images)
├─ Minification (all assets)
├─ Caching (service worker)
└─ Web Vitals (< 2.5s LCP)

Database
├─ Indexes on common queries
├─ Document structure optimization
├─ Batch writes
└─ Cache frequently accessed data

Images
├─ Cloudinary optimization
├─ Responsive images
├─ WebP format
└─ CDN caching
```

---

## Monitoring & Observability

### Metrics Tracked

```
Application
├─ Page load times
├─ Component render times
├─ API response times
└─ Error rates

User Behavior
├─ Page views
├─ User actions
├─ Conversion funnel
└─ User properties

Performance
├─ Core Web Vitals
├─ Error Boundary catches
├─ Console errors
└─ Network requests
```

### Monitoring Tools

```
Development
├─ React DevTools
├─ Network Inspector (F12)
├─ Console logging
└─ Performance tab

Production
├─ Google Analytics 4
├─ Sentry (error tracking - optional)
├─ Firebase Console
└─ Paystack Dashboard
```

---

## Development Workflow

```
1. Feature Branch
   └─ git checkout -b feature/name

2. Development
   ├─ Code changes
   ├─ Test locally (npm run dev)
   ├─ Check lint (npm run lint)
   └─ Update components

3. Build Test
   ├─ npm run build
   └─ npm run preview

4. Commit & Push
   ├─ git add .
   ├─ git commit -m 'Description'
   └─ git push origin feature/name

5. Pull Request
   ├─ Review code
   ├─ Run CI tests
   └─ Merge to main

6. Deploy
   └─ Auto-deploy to production
```

---

## Conclusion

KOB is built with scalability, security, and maintainability in mind. The modular service layer allows easy updates, the Firebase backend reduces operational overhead, and the React frontend provides a smooth user experience.

For more detailed information:
- **Setup**: See [SETUP.md](../SETUP.md)
- **API**: See [API.md](../API.md)
- **Deployment**: See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
