# Vercel Deployment Guide for KOB

Quick start to deploy Katsina Online Business (KOB) to Vercel.

## Prerequisites

✅ Already configured:
- `vercel.json` with SPA rewrites
- `package.json` with build script
- `vite.config.js` ready for production builds
- Firebase & Cloudinary configs ready

## Deployment Steps

### 1. Connect GitHub to Vercel (One-time Setup)

```bash
# If not already connected:
# Visit: https://vercel.com/new/git
# Select: GitHub
# Connect your GitHub account
# Import: Bsanytk/Katsina-Online-Business repo
```

### 2. Set Environment Variables on Vercel

In **Vercel Dashboard** → **Settings** → **Environment Variables** for the KOB project:

Add these variables (Firebase & Cloudinary keys):

```
VITE_FIREBASE_API_KEY=<your_firebase_api_key>
VITE_FIREBASE_AUTH_DOMAIN=<your_firebase_project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<your_firebase_project_id>
VITE_FIREBASE_STORAGE_BUCKET=<your_firebase_project>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<your_firebase_messaging_id>
VITE_FIREBASE_APP_ID=<your_firebase_app_id>
VITE_FIREBASE_MEASUREMENT_ID=<your_ga_measurement_id>
VITE_CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
VITE_CLOUDINARY_UPLOAD_PRESET=<your_unsigned_preset>
```

**Note**: All variables must start with `VITE_` to be exposed to the frontend (Vite requirement).

### 3. Configure Build Settings

In **Vercel Dashboard** → **Settings** → **Build & Development Settings**:

- **Framework**: Vite
- **Build Command**: `cd kob-react && npm run build`
- **Output Directory**: `kob-react/dist`
- **Install Command**: `npm install`

Vercel should auto-detect these, but confirm they're correct.

### 4. Deploy

**Option A: Automatic (Recommended)**
- Push to `main` branch → Vercel auto-deploys
- Every commit to `main` triggers a new build

**Option B: Manual**
```bash
# Using Vercel CLI (optional)
npm i -g vercel
cd kob-react
vercel --prod
```

### 5. Verify Deployment

After deploy completes:

1. **Check Vercel Dashboard**: Look for green checkmark ✅ next to latest commit
2. **Visit deployed URL**: (provided by Vercel, e.g., `kob-xxxx.vercel.app`)
3. **Test Core Features**:
   - [ ] Browse marketplace (public read)
   - [ ] Login with Firebase account
   - [ ] Create product (only authenticated users)
   - [ ] Edit/delete own product
   - [ ] Cannot edit others' products
   - [ ] Chat with other users
   - [ ] Leave review on product
   - [ ] Images load from Cloudinary

### 6. Custom Domain (Optional)

In **Vercel Dashboard** → **Settings** → **Domains**:

Add your custom domain and configure DNS records. Vercel provides step-by-step guidance.

## Common Issues

### Build Fails: "VITE_* environment variables undefined"

❌ **Problem**: Env vars not set on Vercel  
✅ **Solution**:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add all `VITE_*` variables (must start with `VITE_`)
3. Redeploy (or click "Redeploy" on latest deployment)

### Blank Page on Live Site

❌ **Problem**: Built files not served correctly  
✅ **Solution**:
1. Check Vercel build logs (Deployments tab)
2. Verify Output Directory is `kob-react/dist`
3. Confirm `vercel.json` rewrites are present

### Firebase Auth Not Working

❌ **Problem**: OAuth redirects fail  
✅ **Solution**:
1. In Firebase Console → Authentication → Settings
2. Add Vercel domain to **Authorized Domains**:
   - `your-app.vercel.app`
   - Custom domain (if using one)

### Cloudinary Images Not Loading

❌ **Problem**: 403 errors on image URLs  
✅ **Solution**:
1. Verify `VITE_CLOUDINARY_CLOUD_NAME` is correct
2. Verify upload preset is unsigned (allows client-side uploads)
3. Check CORS settings in Cloudinary dashboard

## Monitoring

### Daily Checks

- **Vercel Dashboard**: Monitor deployment status & analytics
- **Firebase Console**: Check quota usage (Firestore reads/writes)
- **Vercel Analytics**: View traffic, performance, errors

### Firestore Quota (Free Tier)

- 50K reads/day
- 20K writes/day
- 20K deletes/day
- If exceeded, see [FIRESTORE_RULES.md](../FIRESTORE_RULES.md) for optimization

## Rollback

If deployment breaks:

```bash
# Via Vercel CLI
vercel rollback

# Or in Vercel Dashboard:
# Deployments tab → right-click on previous deploy → Promote to Production
```

## Environment Variables Reference

| Variable | Source | Required |
|----------|--------|----------|
| `VITE_FIREBASE_*` | Firebase Console → Project Settings | ✅ Yes |
| `VITE_CLOUDINARY_*` | Cloudinary Dashboard | ✅ Yes |

All `VITE_*` variables are exposed to the frontend bundle at build time.

## Deployment Checklist

- [ ] GitHub repo connected to Vercel
- [ ] All environment variables added to Vercel → Settings
- [ ] Build command: `cd kob-react && npm run build`
- [ ] Output directory: `kob-react/dist`
- [ ] First deployment triggered (automatic or manual)
- [ ] Deployment shows as "Ready" ✅
- [ ] Site loads at `*.vercel.app` URL
- [ ] Firebase Auth domain added to allowed list
- [ ] All features tested on live site
- [ ] Firestore rules deployed to Firebase
- [ ] Monitor quota in first 24 hours

## Support

For issues:
1. Check **Vercel Deployment Logs** (Deployments tab)
2. Check **Firebase Console** for errors
3. Check browser **Console** (F12 → Console tab)
4. See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for general troubleshooting

---

**Status**: ✅ Ready to Deploy  
**Branch**: `main` (with ownership-based Firestore rules)  
**Last Updated**: March 3, 2026
