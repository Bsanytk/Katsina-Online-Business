
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import path from 'path';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });
}

const db = admin.firestore();

const DEFAULT_TITLE = "KOB Marketplace - Buy and Sell in Katsina";
const DEFAULT_IMAGE = "https://res.cloudinary.com/dn5crslee/image/upload/v1700000000/kob-marketplace/desktop-screenshot.png";
const DEFAULT_DESCRIPTION = "A vibrant online marketplace for buyers and sellers in Katsina and beyond.";

function injectMetaTags(html, tags) {
    let cleanHtml = html
      .replace(/<meta property="og:title"[^>]*>/gi, '')
      .replace(/<meta property="og:description"[^>]*>/gi, '')
      .replace(/<meta property="og:image"[^>]*>/gi, '')
      .replace(/<meta name="twitter:title"[^>]*>/gi, '')
      .replace(/<meta name="twitter:description"[^>]*>/gi, '')
      .replace(/<meta name="twitter:image"[^>]*>/gi, '');

    const metaTags = `
    <meta property="og:title" content="${tags.title}">
    <meta property="og:description" content="${tags.description}">
    <meta property="og:image" content="${tags.image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:type" content="product">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${tags.title}">
    <meta name="twitter:description" content="${tags.description}">
    <meta name="twitter:image" content="${tags.image}">
  `;
    return cleanHtml.replace('</head>', `${metaTags}</head>`);
}

export default async function handler(req, res) {
  const { productId } = req.query;
  let productData = null;
  let sellerData = null;

  try {
    const productRef = db.collection('products').doc(productId);
    const productSnap = await productRef.get();

    if (productSnap.exists) {
      productData = productSnap.data();
      if(productData.ownerUid) {
        const sellerRef = db.collection('users').doc(productData.ownerUid);
        const sellerSnap = await sellerRef.get();
        if(sellerSnap.exists) {
            sellerData = sellerSnap.data();
        }
      }
    }
  } catch (error) {
    console.error(`Firestore Error for productId: ${productId}`, error);
  }

  const imageUrl = productData?.imageUrl || productData?.images?.[0]?.url || (typeof productData?.images?.[0] === "string" ? productData.images[0] : null) || DEFAULT_IMAGE;

  const tags = {
    title: productData?.title || DEFAULT_TITLE,
    image: imageUrl,
    description: productData?.description || DEFAULT_DESCRIPTION
  };
  
  Object.keys(tags).forEach(key => {
      tags[key] = String(tags[key]).replace(/"/g, '&quot;');
  });

  try {
    const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    const baseHtml = await readFile(htmlPath, 'utf-8');

    const finalHtml = injectMetaTags(baseHtml, tags);

    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=604800, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(finalHtml);

  } catch (error) {
    console.error('CRITICAL: Error reading production index.html file:', error);
    return res.redirect(307, '/');
  }
}
