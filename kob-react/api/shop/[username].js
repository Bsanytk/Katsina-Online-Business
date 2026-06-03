import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import path from 'path';

// --- Firebase Admin Initialization (Secure) ---
// This uses Vercel Environment Variables.
// Ensure FIREBASE_SERVICE_ACCOUNT_JSON is set in your Vercel project settings.
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
}

const db = admin.firestore();

// --- Default Meta Values ---
// Fallback values for cases where the seller is not found.
const DEFAULT_TITLE = "KOB Marketplace - Buy and Sell in Katsina";
const DEFAULT_IMAGE = "https://res.cloudinary.com/dn5crslee/image/upload/v1700000000/kob-marketplace/desktop-screenshot.png";
const DEFAULT_DESCRIPTION = "A vibrant online marketplace for buyers and sellers in Katsina and beyond.";

/**
 * Injects dynamic meta tags into an HTML template string.
 * This approach is fast and avoids parsing the full HTML DOM.
 * @param {string} html - The base HTML content from index.html.
 * @param {object} tags - The meta tags to inject.
 * @returns {string} The modified HTML with injected tags.
 */
function injectMetaTags(html, tags) {
    const metaTags = `
    <meta property="og:title" content="${tags.title}">
    <meta property="og:description" content="${tags.description}">
    <meta property="og:image" content="${tags.image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${tags.title}">
    <meta name="twitter:description" content="${tags.description}">
    <meta name="twitter:image" content="${tags.image}">
  `;
    // Injects the meta tags just before the closing </head> tag.
    return html.replace('</head>', `${metaTags}</head>`);
}

/**
 * Vercel Serverless Function to generate dynamic OG tags for seller shops.
 * This function is triggered by a rewrite rule for social media crawlers.
 */
export default async function handler(req, res) {
  // Extract username from the dynamic route (e.g., /api/shop/some-seller)
  const { username } = req.query;

  let sellerData = null;

  try {
    // Query Firestore for a user with the matching businessName.
    // Ensure you have a Firestore index on 'businessName' for this query to be efficient.
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('businessName', '==', username).limit(1).get();

    if (!snapshot.empty) {
      sellerData = snapshot.docs[0].data();
    }
  } catch (error) {
    console.error(`Firestore Error for username: ${username}`, error);
    // On database error, we'll proceed with default tags to ensure the link preview still works.
  }

  // Define the tags, using seller data if available, otherwise falling back to defaults.
  const tags = {
    title: sellerData?.businessName || sellerData?.displayName || DEFAULT_TITLE,
    image: sellerData?.photoURL || DEFAULT_IMAGE,
    description: sellerData?.bio || DEFAULT_DESCRIPTION
  };
  
  // Sanitize tags to prevent issues with quotes in the HTML attributes.
  Object.keys(tags).forEach(key => {
      tags[key] = tags[key].replace(/"/g, '&quot;');
  });

  try {
    // **PATH CORRECTION**: In a Vercel deployment of a Vite app, the build output is
    // placed in the 'dist' directory at the root of the project. `process.cwd()`
    // gives us the root, so we can reliably locate the file.
    const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    const baseHtml = await readFile(htmlPath, 'utf-8');

    // Inject the dynamic tags into the static HTML file.
    const finalHtml = injectMetaTags(baseHtml, tags);

    // **CACHE HEADERS**: Instruct Vercel's Edge CDN to cache this response.
    // - `s-maxage=604800`: Caches on the CDN for 1 week.
    // - `stale-while-revalidate=86400`: If a request comes after 1 week, serve the stale
    //   (cached) content while re-fetching in the background for the next request.
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=604800, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(finalHtml);

  } catch (error) {
    console.error('CRITICAL: Error reading production index.html file:', error);
    // If we can't read the HTML file, it's a critical build-time error.
    // A temporary redirect to the homepage is a safe fallback for crawlers.
    res.redirect(307, '/');
  }
}
