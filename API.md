# KOB API Reference

Complete API documentation for Katsina Online Business services and functions.

## Table of Contents

1. [Authentication](#authentication)
2. [Products](#products)
3. [Reviews](#reviews)
4. [Payment](#payment)
5. [Analytics](#analytics)
6. [Email](#email)
7. [SEO](#seo)
8. [Performance](#performance)
9. [Firebase Database](#firebase-database)

---

## Authentication

### `firebase/auth.js`

#### getCurrentUser()

Get the currently authenticated user.

```javascript
import { getCurrentUser } from '@/firebase/auth'

const user = getCurrentUser()
// Returns: { uid, email, displayName, ... } or null
```

#### registerWithEmail(email, password, role)

Create a new user account with email and password.

```javascript
import { registerWithEmail } from '@/services/auth'

try {
  const user = await registerWithEmail(
    'newuser@example.com',
    'password123',
    'buyer' // or 'seller'
  )
  console.log('Registration successful:', user.uid)
} catch (error) {
  console.error('Registration failed:', error.message)
}
```

**Parameters:**
- `email` (string): User email address
- `password` (string): Password (min 6 characters)
- `role` (string): 'buyer', 'seller', or 'admin'

**Returns:** Firebase User object with `uid` property

**Throws:** FirebaseAuthError if email exists or password weak

#### loginWithEmail(email, password)

Sign in an existing user.

```javascript
import { loginWithEmail } from '@/services/auth'

try {
  const user = await loginWithEmail('user@example.com', 'password123')
  console.log('Login successful:', user.uid)
} catch (error) {
  console.error('Login failed:', error.message)
}
```

**Parameters:**
- `email` (string): User email address
- `password` (string): User password

**Returns:** Firebase User object

**Throws:** FirebaseAuthError if credentials invalid

#### logout()

Sign out the current user.

```javascript
import { logout } from '@/services/auth'

try {
  await logout()
  console.log('Logged out successfully')
} catch (error) {
  console.error('Logout failed:', error)
}
```

#### updateUserProfile(updates)

Update user profile information.

```javascript
import { updateUserProfile } from '@/services/auth'

try {
  await updateUserProfile({
    name: 'John Doe',
    phone: '+234701234567',
    address: '123 Main St, Katsina',
    whatsappNumber: '+234701234567'
  })
  console.log('Profile updated')
} catch (error) {
  console.error('Update failed:', error)
}
```

**Parameters:**
- `updates` (object): Fields to update

---

## Products

### `services/products.js`

#### getProducts(filters)

Fetch products with optional filtering.

```javascript
import { getProducts } from '@/services/products'

// Get all products
const allProducts = await getProducts()

// Get with filters
const filtered = await getProducts({
  category: 'Agriculture',
  minPrice: 10000,
  maxPrice: 100000,
  location: 'Katsina',
  searchQuery: 'tomato'
})
```

**Parameters:**
- `filters` (object, optional):
  - `category` (string): Product category
  - `minPrice` (number): Minimum price in kobo
  - `maxPrice` (number): Maximum price in kobo
  - `location` (string): Seller location
  - `searchQuery` (string): Search term

**Returns:** Array of product objects

**Example response:**
```javascript
[
  {
    id: 'prod123',
    title: 'Tomato Seeds',
    description: 'High quality seeds...',
    price: 50000, // ₦500
    category: 'Agriculture',
    ownerUid: 'seller123',
    images: ['url1', 'url2'],
    inStock: true,
    rating: 4.5,
    reviewCount: 12,
    createdAt: Timestamp
  }
]
```

#### getProductById(productId)

Fetch a single product by ID.

```javascript
import { getProductById } from '@/services/products'

const product = await getProductById('prod123')
console.log(product.title) // 'Tomato Seeds'
```

**Parameters:**
- `productId` (string): Product document ID

**Returns:** Product object or null if not found

#### createProduct(productData)

Create a new product listing.

```javascript
import { createProduct } from '@/services/products'

const newProduct = await createProduct({
  title: 'Tomato Seeds',
  description: 'High quality organic tomato seeds',
  price: 50000, // in kobo (₦500)
  category: 'Agriculture',
  images: ['https://example.com/image1.jpg'],
  inStock: true,
  quantity: 100,
  location: 'Katsina',
  whatsappNumber: '+234701234567'
})

console.log('Product created:', newProduct.id)
```

**Parameters:**
- `productData` (object):
  - `title` (string): Product name
  - `description` (string): Product description
  - `price` (number): Price in kobo
  - `category` (string): Product category
  - `images` (array): Image URLs
  - `inStock` (boolean): Availability
  - `quantity` (number): Stock quantity
  - `location` (string): Seller location
  - `whatsappNumber` (string): Contact number

**Returns:** Product object with generated `id`

**Throws:** Error if user not authenticated or missing required fields

#### updateProduct(productId, updates)

Update an existing product.

```javascript
import { updateProduct } from '@/services/products'

await updateProduct('prod123', {
  price: 60000,
  quantity: 50,
  description: 'Updated description'
})
```

**Parameters:**
- `productId` (string): Product document ID
- `updates` (object): Fields to update

**Throws:** Error if not product owner

#### deleteProduct(productId)

Delete a product listing.

```javascript
import { deleteProduct } from '@/services/products'

await deleteProduct('prod123')
console.log('Product deleted')
```

**Parameters:**
- `productId` (string): Product document ID

**Throws:** Error if not product owner

#### getProductsByUser(userId)

Get all products listed by a user.

```javascript
import { getProductsByUser } from '@/services/products'

const sellerProducts = await getProductsByUser('seller123')
console.log(`Seller has ${sellerProducts.length} products`)
```

**Parameters:**
- `userId` (string): User ID (Firebase UID)

**Returns:** Array of product objects

---

## Reviews

### `services/products.js`

#### addReview(productId, reviewData)

Add a review to a product.

```javascript
import { addReview } from '@/services/products'

await addReview('prod123', {
  rating: 5,
  comment: 'Excellent product! Very satisfied.',
  authorName: 'John Buyer'
})
```

**Parameters:**
- `productId` (string): Product document ID
- `reviewData` (object):
  - `rating` (number): 1-5 star rating
  - `comment` (string): Review text
  - `authorName` (string): Reviewer name

**Returns:** Review object with `id`

#### getProductReviews(productId)

Fetch all reviews for a product.

```javascript
import { getProductReviews } from '@/services/products'

const reviews = await getProductReviews('prod123')
console.log(`Product has ${reviews.length} reviews`)

reviews.forEach(review => {
  console.log(`${review.rating}⭐ - ${review.comment}`)
})
```

**Parameters:**
- `productId` (string): Product document ID

**Returns:** Array of review objects

**Example review object:**
```javascript
{
  id: 'review123',
  productId: 'prod123',
  userId: 'user123',
  rating: 5,
  comment: 'Excellent product!',
  authorName: 'John Buyer',
  createdAt: Timestamp
}
```

#### getProductRating(productId)

Get average rating for a product.

```javascript
import { getProductRating } from '@/services/products'

const rating = await getProductRating('prod123')
console.log(`Average rating: ${rating.average}⭐ (${rating.count} reviews)`)
// Output: Average rating: 4.5⭐ (12 reviews)
```

**Parameters:**
- `productId` (string): Product document ID

**Returns:** Object with `average` and `count` properties

---

## Payment

### `services/payment.js`

#### initializePayment(paymentData)

Initialize a Paystack payment transaction.

```javascript
import { initializePayment } from '@/services/payment'

try {
  const response = await initializePayment({
    email: 'buyer@example.com',
    amount: 100000, // ₦1,000
    metadata: {
      orderId: 'order123',
      productId: 'prod123',
      quantity: 2,
      buyerName: 'John Doe'
    }
  })
  
  console.log('Payment initialized:', response.reference)
  // Paystack payment modal will appear
} catch (error) {
  console.error('Payment initialization failed:', error)
}
```

**Parameters:**
- `paymentData` (object):
  - `email` (string): Customer email
  - `amount` (number): Amount in kobo (₦500 = 50000)
  - `metadata` (object): Custom data to attach

**Returns:** Response object with transaction reference

**Paystack Modal:** Opens automatically after initialization

**Handler Function:**
```javascript
// In CheckoutModal or similar
const handlePaymentSuccess = (reference) => {
  console.log('Payment successful!', reference)
  // Create order in Firestore
  // Send confirmation email
  // Update seller notifications
}
```

#### calculatePaymentFee(amount)

Calculate Paystack transaction fee.

```javascript
import { calculatePaymentFee } from '@/services/payment'

const subtotal = 100000 // ₦1,000
const fee = calculatePaymentFee(subtotal)
console.log(`Fee: ₦${(fee / 100).toFixed(2)}`)
// Output: Fee: ₦1.50

const total = subtotal + fee
console.log(`Total: ₦${(total / 100).toFixed(2)}`)
// Output: Total: ₦1,001.50
```

**Formula:** 1.5% + ₦100  
**Example:** ₦100,000 = Fee of ₦1,600

---

## Analytics

### `services/analytics.js`

#### trackEvent(eventName, eventData)

Track a custom analytics event.

```javascript
import { trackEvent } from '@/services/analytics'

// Track product search
trackEvent('search', {
  search_term: 'tomato seeds',
  number_of_results: 45
})

// Track add to cart
trackEvent('add_to_cart', {
  product_id: 'prod123',
  product_name: 'Tomato Seeds',
  value: 50000,
  currency: 'NGN'
})

// Track purchase
trackEvent('purchase', {
  transaction_id: 'txn123',
  value: 100000,
  currency: 'NGN',
  items: [
    {
      item_id: 'prod123',
      item_name: 'Tomato Seeds',
      quantity: 2
    }
  ]
})
```

**Common Events:**
- `page_view` - Page viewed
- `search` - Search performed
- `add_to_cart` - Item added to cart
- `purchase` - Purchase completed
- `sign_up` - User registered
- `login` - User logged in
- `contact_form_submit` - Contact form submitted
- `leave_review` - Review posted

#### setUserProperties(properties)

Set user-level properties for analytics.

```javascript
import { setUserProperties } from '@/services/analytics'

setUserProperties({
  user_role: 'seller',
  account_type: 'premium',
  city: 'Katsina',
  products_listed: 12
})
```

**Parameters:**
- `properties` (object): Key-value pairs for user

#### useAnalytics()

React hook for using analytics in components.

```javascript
import { useAnalytics } from '@/services/analytics'

function ProductCard({ product }) {
  const { trackEvent } = useAnalytics()
  
  const handleClick = () => {
    trackEvent('product_click', {
      product_id: product.id,
      product_name: product.title,
      category: product.category
    })
    // Navigate to product details
  }
  
  return <button onClick={handleClick}>View Details</button>
}
```

---

## Email

### `services/email.js`

#### sendEmail(emailData)

Send an email notification.

```javascript
import { sendEmail } from '@/services/email'

try {
  await sendEmail({
    to: 'customer@example.com',
    templateId: 'order_confirmation',
    data: {
      orderNumber: 'ORD-123456',
      totalAmount: '₦1,000',
      productTitle: 'Tomato Seeds'
    }
  })
  console.log('Email sent successfully')
} catch (error) {
  console.error('Email sending failed:', error)
}
```

**Parameters:**
- `emailData` (object):
  - `to` (string): Recipient email address
  - `templateId` (string): Email template type
  - `data` (object): Template variables

**Available Templates:**

1. **order_confirmation**
   - `orderNumber` - Order reference number
   - `totalAmount` - Total payment amount
   - `productTitle` - Product name
   - `buyerName` - Buyer name

2. **seller_notification**
   - `productTitle` - Product name
   - `buyerName` - Buyer name
   - `quantity` - Items purchased
   - `totalAmount` - Payment amount

3. **support_confirmation**
   - `name` - Contact name
   - `message` - Original message
   - `ticketNumber` - Support ticket ID

4. **new_review**
   - `productTitle` - Product name
   - `rating` - Star rating
   - `comment` - Review text
   - `reviewerName` - Reviewer name

5. **password_reset**
   - `resetLink` - Password reset URL
   - `userName` - User name

6. **welcome**
   - `userName` - User name
   - `role` - User role (buyer/seller)

7. **product_listed**
   - `productTitle` - Product name
   - `productUrl` - Link to product

#### Note on Email in Development

In development mode, emails are logged to the browser console instead of being sent. This is configured in the email service to prevent sending test emails.

To enable real email sending:
1. Setup SendGrid or Mailgun account
2. Create backend endpoint for email sending
3. Update email service to call backend API

---

## SEO

### `services/seo.js`

#### usePageMeta(pathname)

React hook to update page meta tags automatically.

```javascript
import { usePageMeta } from '@/services/seo'

export default function ProductPage() {
  // Auto-updates title, description, OG tags, etc.
  usePageMeta('/marketplace')
  
  return (
    <div>
      {/* Page content */}
    </div>
  )
}
```

**Call location:** Each page component  
**Updates:** Meta title, description, OG tags, Twitter cards

#### addStructuredData(type, data)

Add JSON-LD structured data to page.

```javascript
import { addStructuredData } from '@/services/seo'

// Product structured data
addStructuredData('product', {
  name: 'Tomato Seeds',
  price: '500',
  priceCurrency: 'NGN',
  availability: 'InStock',
  description: 'High quality organic tomato seeds',
  image: 'https://example.com/image.jpg',
  rating: '4.5',
  reviewCount: '12'
})

// Organization structured data (add once on home page)
addStructuredData('organization', {
  name: 'Katsina Online Business',
  url: 'https://katsina-online-business.com',
  logo: 'https://example.com/logo.png',
  address: {
    streetAddress: 'Katsina',
    addressRegion: 'KT',
    postalCode: '820101',
    addressCountry: 'NG'
  }
})
```

**Supported Types:**
- `product` - Product information
- `organization` - Business information
- `breadcrumb` - Navigation breadcrumbs
- `searchAction` - Sitewide search

#### generateSitemap()

Generate XML sitemap for search engines.

```javascript
import { generateSitemap } from '@/services/seo'

const sitemap = generateSitemap()
// Returns XML string for sitemap.xml
// Contains all pages and products
```

#### updatePageMeta(pageConfig)

Manually update page meta tags.

```javascript
import { updatePageMeta } from '@/services/seo'

updatePageMeta({
  title: 'Buy Quality Products | Katsina Online Business',
  description: 'Browse and buy products from local sellers in Katsina',
  keywords: 'marketplace, Katsina, products, shopping',
  image: 'https://example.com/og-image.jpg'
})
```

---

## Performance

### `services/performance.js`

#### webVitalsTracker.init()

Initialize Core Web Vitals tracking.

```javascript
import { webVitalsTracker } from '@/services/performance'

// Call once in App useEffect
useEffect(() => {
  webVitalsTracker.init()
}, [])
```

**Tracks:**
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- FCP (First Contentful Paint)
- TTFB (Time to First Byte)
- TTI (Time to Interactive)

#### webVitalsTracker.generateReport()

Get performance report with metrics.

```javascript
import { webVitalsTracker } from '@/services/performance'

const report = webVitalsTracker.generateReport()
console.log(report)

// Output:
{
  lcp: 1850,          // milliseconds
  fid: 85,
  cls: 0.08,
  fcp: 950,
  ttfb: 400,
  tti: 3200,
  grade: 'A',         // A-F
  timestamp: Date
}
```

#### useWebVitals()

React hook to access web vitals in components.

```javascript
import { useWebVitals } from '@/services/performance'

function PerformanceMonitor() {
  const vitals = useWebVitals()
  
  return (
    <div>
      <p>LCP: {vitals.lcp}ms</p>
      <p>Grade: {vitals.grade}</p>
    </div>
  )
}
```

---

## Firebase Database

### Structure

```
Firestore Collections:

users/{uid}
  - email: string
  - name: string
  - role: 'buyer' | 'seller' | 'admin'
  - phone: string
  - address: string
  - createdAt: timestamp

products/{productId}
  - title: string
  - description: string
  - price: number (kobo)
  - category: string
  - ownerUid: string
  - images: array
  - inStock: boolean
  - quantity: number
  - location: string
  - whatsappNumber: string
  - rating: number
  - reviewCount: number
  - createdAt: timestamp

reviews/{reviewId}
  - productId: string
  - userId: string
  - rating: number (1-5)
  - comment: string
  - createdAt: timestamp

orders/{orderId}
  - buyerId: string
  - sellerId: string
  - productId: string
  - quantity: number
  - totalAmount: number (kobo)
  - status: string
  - paymentReference: string
  - shippingAddress: string
  - createdAt: timestamp
```

---

## Error Handling

### ErrorBoundary Component

```javascript
import ErrorBoundary from '@/components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  )
}
```

Catches React component errors and displays graceful error page.

---

## Usage Examples

### Complete Marketplace Flow

```javascript
// 1. Register as seller
const user = await registerWithEmail('seller@example.com', 'pass123', 'seller')

// 2. Create product
const product = await createProduct({
  title: 'Tomato Seeds',
  description: 'Organic seeds...',
  price: 50000,
  category: 'Agriculture',
  images: ['url'],
  inStock: true,
  quantity: 100,
  location: 'Katsina',
  whatsappNumber: '+234701234567'
})

// 3. Track analytics
trackEvent('product_created', {
  product_id: product.id,
  category: 'Agriculture'
})

// 4. Buyer searches for products
const products = await getProducts({
  category: 'Agriculture',
  searchQuery: 'tomato'
})

// 5. Buyer views product and sees reviews
const reviews = await getProductReviews(product.id)
const rating = await getProductRating(product.id)

// 6. Buyer makes purchase
const payment = await initializePayment({
  email: 'buyer@example.com',
  amount: 100000,
  metadata: {
    productId: product.id,
    quantity: 2
  }
})

// 7. On success, send confirmation emails
await sendEmail({
  to: 'buyer@example.com',
  templateId: 'order_confirmation',
  data: { orderNumber: 'ORD-123', totalAmount: '₦1,000', ... }
})

// 8. Track conversion
trackEvent('purchase', {
  value: 100000,
  currency: 'NGN'
})
```

---

## Rate Limits

- **Firebase Firestore**: 50,000 reads/day (free tier)
- **Paystack**: 25 requests/second
- **Google Analytics**: No limits
- **Cloudinary**: 25 uploads/hour (free tier)

---

## Support

For API issues:
- Check [SETUP.md](./SETUP.md) for configuration
- Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Check Firebase Console for errors
- Review browser console for JavaScript errors

