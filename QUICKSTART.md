# KOB Quick Start Guide

Get Katsina Online Business running in 5 minutes.

## Prerequisites
- Node.js 16+ installed
- Firebase account (free) at https://firebase.google.com
- Code editor (VS Code recommended)

## Installation

### 1️⃣ Clone & Install (1 minute)

```bash
git clone https://github.com/YOUR_USERNAME/kob.git
cd kob/kob-react
npm install
```

### 2️⃣ Setup Firebase (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: `katsina-online-business`
3. Create web app and copy configuration

Add `.env.local` in `kob-react/`:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=katsina-online-business
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_CLOUDINARY_CLOUD_NAME=demo
VITE_CLOUDINARY_UPLOAD_PRESET=samplepreset
VITE_PAYSTACK_PUBLIC_KEY=pk_test_51234567890
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3️⃣ Start Development Server (1 minute)

```bash
npm run dev
```

Opens at `http://localhost:5173`

### 4️⃣ Create Test Account (1 minute)

Click "Sign Up" and create account:
- Email: test@example.com
- Password: test123456
- Role: Choose "Seller" or "Buyer"

### 5️⃣ Start Building! 🚀

- **Home**: Landing page at `/`
- **Marketplace**: Browse products at `/marketplace`
- **Dashboard**: View at `/dashboard`

---

## 📁 Key Files

```
src/
├── pages/          # Route pages
├── components/     # Reusable components
└── services/       # API functions
```

## 🔧 Common Commands

```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Test production build
npm run lint        # Check code quality
```

## 🔐 Features Included

✅ User authentication with Firebase  
✅ Product marketplace with search/filter  
✅ Product reviews & ratings  
✅ Paystack payment integration  
✅ Image uploads to Cloudinary  
✅ Email notifications  
✅ Analytics tracking  
✅ Error handling  
✅ Mobile responsive  
✅ SEO optimized  

## 📚 Full Documentation

- **Setup**: See [SETUP.md](../SETUP.md)
- **Deployment**: See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
- **API Reference**: See [API.md](../API.md)
- **Project**: See [README.md](./README.md)

## ❓ Troubleshooting

**Port 5173 already in use?**
```bash
npm run dev -- --port 3000
```

**Module not found error?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Firebase connection error?**
- Verify `.env.local` values match Firebase Console
- Restart dev server: `npm run dev`

**Still stuck?** Check [SETUP.md](../SETUP.md#troubleshooting)

---

**🎉 You're all set!** Start exploring and building amazing features.

For detailed configuration, see [SETUP.md](../SETUP.md)
