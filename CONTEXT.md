# KOB Context & Development Standards

**Last Updated:** January 15, 2026  
**Status:** Production Environment

---

## 🔷 Project Identity

**Official Project Name:**  
`Katsina Online Business (KOB)`

⚠️ **CRITICAL**: Do NOT use temporary names like "KOB-react", "kob-react", "KOB React" in:
- UI labels & headings
- Meta tags & SEO
- Documentation
- Comments
- Brand messaging

---

## 📧 Official Contact Information

These details must be consistently used across all customer-facing areas:

| Channel | Value |
|---------|-------|
| **Email** | `bsanidatatech@gmail.com` |
| **Phone/WhatsApp** | `07089454544` |
| **WhatsApp Link** | `https://wa.me/2347089454544` |
| **Support Priority** | WhatsApp → Email → Help Center |

**Locations where contact info must appear:**
- Footer (all pages)
- Contact page
- Help Center
- Support widget
- Error pages
- Onboarding flow

---

## 🌍 Localization Requirements (MANDATORY)

### Supported Languages
- 🇬🇧 **English (en)** - Default
- 🇳🇬 **Hausa (ha)** - Regional
- 🇸🇦 **Arabic (ar)** - Regional

### Rules
✅ **DO:**
- Use translation keys: `t('home.hero.title')`
- Store all UI text in `/locales/{lang}.json`
- Wrap dynamic text in `useTranslation()` hook
- Test all three languages before merging

❌ **DON'T:**
- Hardcode strings in JSX
- Mix English with other languages in files
- Bypass the i18n system for "quick updates"
- Leave placeholder text in production

### File Structure
```
kob-react/src/locales/
  ├── en.json         # English (primary)
  ├── ha.json         # Hausa (translated)
  └── ar.json         # Arabic (translated)
```

### Example Usage
```jsx
import { useTranslation } from '../hooks/useTranslation'

export default function MyComponent() {
  const t = useTranslation()
  return <h1>{t('home.hero.title')}</h1>
}
```

---

## 🔗 External Google Forms (DO NOT REBUILD)

These forms already exist and should be linked, NOT recreated:

### 1. KOB Verified Seller Registration
- **URL:** https://docs.google.com/forms/d/e/1FAIpQLSfFfwnt78a-GnE7g8HTpY8MrcFz2K_WjPjLhPCQPAWoUi6muA/viewform?usp=header
- **Purpose:** Seller trust onboarding
- **Link locations:**
  - Home page → "Become a Seller" CTA
  - Seller Dashboard → Resources section
  - Help Center → Selling FAQ

### 2. KOB Express Delivery Sign-Up
- **URL:** https://docs.google.com/forms/d/e/1FAIpQLSc5Ml7GWZNeNzKhbiqwfULxtFiQUQ0Cgt9eAM2is4JKou3F1Q/viewform?usp=header
- **Purpose:** Logistics partner registration
- **Link locations:**
  - Home page → Logistics section
  - Help Center → Shipping FAQ
  - Footer → Support links

### 3. KOB Rider & Field Agent Application
- **URL:** https://docs.google.com/forms/d/e/1FAIpQLSdM7A__EUQPG0N-W_NNFEMQrZHLjqo7UjZ3JJItr1qnc1h8Iw/viewform?usp=header
- **Purpose:** Operations growth/recruitment
- **Link locations:**
  - Teams page → Recruitment section
  - Help Center → Careers/Jobs
  - Footer → Company links

---

## 🏗️ Architecture Overview

The current system is COMPLETE. Do NOT re-architect. Extend only.

### Tech Stack
- **Frontend:** React 19 + Vite 7 + Tailwind CSS 4
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Analytics:** Google Analytics 4
- **Images:** Cloudinary
- **Email:** SendGrid/Mailgun
- **Payments:** Paystack (DISABLED for now)

### Core Modules (8 Services)
```
src/services/
  ├── auth.js           # Firebase authentication
  ├── products.js       # Product CRUD
  ├── users.js          # User management
  ├── notifications.js  # Email & alerts
  ├── analytics.js      # GA4 integration
  ├── cloudinary.js     # Image hosting
  ├── roles.js          # Access control
  └── settings.js       # App configuration
```

### Key Collections (Firestore)
- `products` - Marketplace listings
- `reviews` - Product ratings & feedback
- `users` - Customer & seller profiles
- `orders` - Purchase history

### Components (25+)
All properly organized in:
```
src/components/
  ├── ui/              # Reusable UI primitives
  ├── marketplace/     # Product-related
  ├── widgets/         # Floating widgets
  └── [other pages]
```

### Routes (12)
- `/` - Home
- `/marketplace` - Browsing
- `/dashboard` - User dashboard
- `/login` & `/register` - Auth
- `/contact`, `/help`, `/faq` - Support
- `/teams`, `/privacy`, `/terms` - Info pages

---

## 🚫 Critical Constraints

### DO NOT Implement Yet
❌ Payment processing / Escrow logic  
❌ Subscription billing  
❌ Advanced fraud detection  
❌ Multi-warehouse logistics  
❌ AI-powered recommendations (without approval)

### NEVER Break These Rules
❌ Expose secrets in code (use `.env.local`)  
❌ Hardcode region/language (make it dynamic)  
❌ Remove i18n for "simplicity"  
❌ Rename "KOB" to anything else  
❌ Add hardcoded contact info (use translation keys)

### Stability Priority
✅ Fix bugs > Add features  
✅ Test before deploying  
✅ Document breaking changes  
✅ Maintain backward compatibility  

---

## 📋 Developer Checklist

Use this before EVERY pull request:

### Pre-Commit Checklist
- [ ] No console.log() statements left in code
- [ ] All UI text uses translation keys (no hardcoded strings)
- [ ] Contact info uses `t('common.contact_*')` not hardcoded
- [ ] Brand name is "Katsina Online Business (KOB)" only
- [ ] All new components have proper error handling
- [ ] Firebase keys not exposed (env-only)

### Pre-PR Checklist
- [ ] Code passes `npm run lint` without errors
- [ ] Code passes `npm run build` successfully
- [ ] Tested in all 3 languages (en, ha, ar)
- [ ] No breaking changes to existing APIs
- [ ] New features documented in code comments
- [ ] External forms linked, not rebuilt
- [ ] SEO metadata updated if needed

### Testing Checklist
- [ ] Tested on mobile (375px width)
- [ ] Tested on desktop (1920px width)
- [ ] Tested authentication flows
- [ ] Tested error states
- [ ] Tested in Firefox, Chrome, Safari

### Deployment Checklist
- [ ] All env vars set in production
- [ ] Database rules reviewed (Firestore)
- [ ] API rate limits configured
- [ ] Analytics tracking verified
- [ ] Error logging configured
- [ ] Backup procedures documented

---

## 🔐 Environment Variables

Must be set in `.env.local` (never commit):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_GA4_MEASUREMENT_ID=...
```

---

## 🚀 Development Workflow

### Branch Strategy
```
main (production-ready)
  ├── feature/seller-verification
  ├── feature/payment-gateway
  ├── bugfix/checkout-issue
  └── docs/api-reference
```

### Commit Message Format
```
type(scope): description

[optional body]
[optional footer]
```

Examples:
```
feat(contact): add localized contact info
fix(footer): correct WhatsApp link format
docs(context): update developer guidelines
refactor(i18n): centralize all UI text
```

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `CONTEXT.md` | This file - development standards |
| `README.md` | Feature overview & quick start |
| `SETUP.md` | Installation & configuration |
| `DEPLOYMENT_GUIDE.md` | Production deployment steps |
| `.env.example` | Template for env variables |
| `kob-react/src/i18n.js` | i18n configuration |
| `kob-react/src/locales/` | Translation files |

---

## 🎯 Next Phase Tasks

After this phase completes:

1. **Phase 8:** Integrate Google Forms properly
2. **Phase 9:** Enhanced seller verification workflow
3. **Phase 10:** Improved payment recovery (Paystack)
4. **Phase 11:** Advanced analytics & reporting
5. **Phase 12:** Multi-language support for support tickets

---

## ❓ FAQ

**Q: Can I add a new language?**  
A: Update CONTEXT.md Phase roadmap, add locale file, and notify team. Get approval first.

**Q: Should I hardcode the email?**  
A: NO. Use `t('common.contact_email')` everywhere.

**Q: Can I rebuild the Google Forms?**  
A: NO. Link to existing forms, not rebuild them. Changes require stakeholder approval.

**Q: What if I need a payment feature?**  
A: Create a detailed spec, get approval, then implement separately. Payment logic is currently disabled.

**Q: How do I test all languages?**  
A: Use the LanguageSwitcher component. Switch to each language and verify all text displays correctly.

---

## 📞 Questions?

Contact: `bsanidatatech@gmail.com` or WhatsApp `07089454544`

---

**This document is authoritative. All development must align with it.**
