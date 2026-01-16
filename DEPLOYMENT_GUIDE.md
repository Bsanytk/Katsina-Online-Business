# KOB Deployment Guide

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Firebase Setup](#firebase-setup)
4. [Third-Party Services](#third-party-services)
5. [Build & Deploy](#build--deploy)
6. [Post-Deployment](#post-deployment)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All environment variables are configured
- [ ] Firebase project is created and configured
- [ ] Paystack account is set up (live keys obtained)
- [ ] Google Analytics property is created
- [ ] Email service is configured (SendGrid/Mailgun)
- [ ] Domain is registered and DNS configured
- [ ] SSL certificate is installed
- [ ] Build passes without errors: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] All tests pass: `npm run test`
- [ ] Performance optimizations are in place
- [ ] Error tracking is configured (Sentry/LogRocket)

---

## Environment Setup

### Local Development

Create `.env.local` in `kob-react/` directory:

```bash
# Firebase
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://YOUR_PROJECT.firebaseio.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

# Cloudinary (Image Upload)
VITE_CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET=YOUR_UPLOAD_PRESET

# Payment (Paystack)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx (for testing)
# VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx (for production)

# Analytics (Google Analytics)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Email Service (Optional)
VITE_EMAIL_SERVICE_URL=https://api.sendgrid.com/v3/mail/send
# VITE_EMAIL_API_KEY=YOUR_SENDGRID_API_KEY
```

### Production Environment

1. Add environment variables to your hosting platform:
   - Vercel: Settings → Environment Variables
   - Netlify: Site Settings → Build & Deploy → Environment
   - Firebase Hosting: Configure in `.firebaserc` or console

2. Use production keys:
   - Firebase: Use production project
   - Paystack: Switch to live keys (`pk_live_`)
   - Google Analytics: Use production property

---

## Firebase Setup

### 1. Create Firebase Project

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init
```

### 2. Configure Firestore

Enable these collections:
- `users` - User profiles and roles
- `products` - Product listings
- `reviews` - Product reviews
- `orders` - Purchase orders (future)

### 3. Set Security Rules

Update `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId;
    }

    // Products collection
    match /products/{document=**} {
      allow read: if true;
      allow create: if request.auth.uid != null;
      allow update: if request.auth.uid == resource.data.ownerUid;
      allow delete: if request.auth.uid == resource.data.ownerUid || 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Reviews collection
    match /reviews/{document=**} {
      allow read: if true;
      allow create: if request.auth.uid != null;
      allow update: if request.auth.uid == resource.data.userId;
      allow delete: if request.auth.uid == resource.data.userId || 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Orders collection (future)
    match /orders/{document=**} {
      allow read: if request.auth.uid == resource.data.buyerId || 
                     request.auth.uid == resource.data.sellerId ||
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth.uid != null;
      allow update: if request.auth.uid == resource.data.sellerId;
    }
  }
}
```

### 4. Deploy Rules

```bash
firebase deploy --only firestore:rules
```

---

## Third-Party Services

### Paystack Setup

1. **Create Account**: https://dashboard.paystack.com
2. **Get API Keys**:
   - Test keys (for development)
   - Live keys (for production)
3. **Configure Webhook** (optional):
   - https://yourdomain.com/api/webhooks/paystack

### Google Analytics Setup

1. **Create Property**: https://analytics.google.com
2. **Get Measurement ID**: Format `G-XXXXXXXXXX`
3. **Enable Enhanced Ecommerce** (optional)
4. **Set Up Conversion Events**:
   - `purchase` - Product purchase
   - `sign_up` - New registration
   - `search` - Product search

### Cloudinary Setup

1. **Create Account**: https://cloudinary.com
2. **Create Unsigned Upload Preset**:
   - Settings → Upload → Upload presets
   - Mode: Unsigned
   - Copy preset name
3. **Get Cloud Name** from Dashboard

### SendGrid Setup (Email)

1. **Create Account**: https://sendgrid.com
2. **Get API Key**:
   - Settings → API Keys → Create New
3. **Create Email Templates** (optional)
4. **Configure Sender Email**:
   - Settings → Sender Authentication

---

## Build & Deploy

### Local Build Test

```bash
# Navigate to project
cd kob-react

# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm run preview
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Or connect GitHub for auto-deploy
# Then enable auto-deploy on push to main
```

### Deploy to Firebase Hosting

```bash
# Build
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

---

## Post-Deployment

### 1. Verify Deployment

- [ ] Site loads on production domain
- [ ] All pages are accessible
- [ ] Navigation works correctly
- [ ] Images and assets load
- [ ] Forms submit successfully
- [ ] Payments can be processed (test transaction)
- [ ] Analytics is tracking
- [ ] No console errors

### 2. Configure Domain

```bash
# Update DNS records
# A Record: your-domain.com -> hosting-ip
# CNAME: www -> your-domain.com
# TXT: Verification records (if needed)

# Setup SSL (automatic on Vercel/Netlify)
# For Firebase: Custom domain in Hosting settings
```

### 3. Setup Email (SendGrid Backend)

Create backend endpoint to handle email:

```javascript
// Backend example (Node.js + Express)
app.post('/api/send-email', async (req, res) => {
  const { to, templateId, data } = req.body
  
  try {
    await sgMail.send({
      to,
      from: 'noreply@katsina-online-business.com',
      templateId: SENDGRID_TEMPLATE_IDS[templateId],
      dynamicTemplateData: data,
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

### 4. Monitor Performance

- [ ] Check Core Web Vitals in Google Analytics
- [ ] Monitor error tracking (Sentry/LogRocket)
- [ ] Track payment success rate
- [ ] Monitor database usage
- [ ] Check CDN cache hit rates

---

## Monitoring

### Google Analytics Dashboard

Monitor:
- Daily active users
- Conversion rate
- Traffic sources
- Product popularity
- Search terms
- User device/browser
- Geographic distribution

### Firebase Console

Monitor:
- Database reads/writes
- Storage usage
- Authentication volume
- Error logs
- Real-time database activity

### Error Tracking (Sentry)

1. **Create Account**: https://sentry.io
2. **Create Project** for KOB
3. **Add to App**:

```javascript
// main.jsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
})
```

---

## Troubleshooting

### Common Issues

**Site not loading:**
- Check Firebase configuration
- Verify environment variables
- Check browser console for errors
- Clear browser cache: Ctrl+Shift+Delete

**Payment not working:**
- Verify Paystack keys are correct
- Check Paystack test/live mode
- Verify transaction fee calculation
- Check browser console for errors

**Analytics not tracking:**
- Verify Google Analytics ID
- Check browser console for gtag errors
- Allow ad blockers to see GA tracking
- Check GA property settings

**Images not loading:**
- Verify Cloudinary configuration
- Check image upload preset
- Verify CDN cache settings
- Check CORS configuration

**Database not responding:**
- Check Firebase connection
- Verify security rules aren't blocking access
- Check database quota limits
- Verify user authentication

**Email not sending:**
- Verify SendGrid API key
- Check email template configuration
- Verify sender email is authenticated
- Check spam folder

---

## Performance Checklist

- [ ] Minify CSS and JavaScript
- [ ] Optimize and compress images
- [ ] Enable gzip compression
- [ ] Setup CDN caching
- [ ] Implement code splitting
- [ ] Lazy load components
- [ ] Monitor Core Web Vitals
- [ ] Setup database indexes
- [ ] Enable Firestore caching
- [ ] Configure rate limiting

---

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set security headers
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Hash sensitive data
- [ ] Enable Firebase Auth rules
- [ ] Rotate API keys periodically
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated

---

## Rollback Procedure

If deployment breaks production:

```bash
# Revert to previous Firebase hosting version
firebase hosting:channel:delete live

# Or redeploy previous version
git revert <commit-hash>
npm run build
firebase deploy --only hosting

# Or use Vercel rollback
vercel --prod --target=production # select previous deployment
```

---

## Support & Help

- **Documentation**: [KOB Docs](https://docs.katsina-online-business.com)
- **Firebase Docs**: https://firebase.google.com/docs
- **Paystack Docs**: https://paystack.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Email Support**: support@katsina-online-business.com
