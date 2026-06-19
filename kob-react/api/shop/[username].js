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
    // Cire tsofaffin meta tags kafin sanya sababbi domin guje wa rikici a jikin robobin sada zumunta
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
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${tags.title}">
    <meta name="twitter:description" content="${tags.description}">
    <meta name="twitter:image" content="${tags.image}">
  `;
    return cleanHtml.replace('</head>', `${metaTags}</head>`);
}

export default async function handler(req, res) {
  const { username } = req.query;
  let sellerData = null;

  try {
    const usersRef = db.collection('users');
    
    // 1. MATAKI NA FARCO (Kari na Wayo): Tunda link dinka yana zo da UID, 
    // za mu fara duba kai tsaye idan akwai Document mai wannan UID din a Firestore.
    const docRef = usersRef.doc(username);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      sellerData = docSnap.data();
    } else {
      // 2. MATAKI NA BIYU (Tsohon Tsarinka): Idan ba UID ba ne (misali sunan shago ne na asali),
      // sai mu binciki gurbin username ko businessName kamar yadda kake yi a da.
      let snapshot = await usersRef.where('username', '==', username).limit(1).get();
      
      if (snapshot.empty) {
        snapshot = await usersRef.where('businessName', '==', username).limit(1).get();
      }

      if (!snapshot.empty) {
        sellerData = snapshot.docs[0].data();
      }
    }
  } catch (error) {
    console.error(`Firestore Error for username/UID: ${username}`, error);
  }

  const tags = {
    title: sellerData?.businessName || sellerData?.displayName || DEFAULT_TITLE,
    image: sellerData?.photoURL || DEFAULT_IMAGE,
    description: sellerData?.bio || DEFAULT_DESCRIPTION
  };
  
  Object.keys(tags).forEach(key => {
      tags[key] = String(tags[key]).replace(/"/g, '&quot;');
  });

  try {
    // Vercel yana ajiye fayilolin build na Vite ne a cikin 'dist'
    const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    const baseHtml = await readFile(htmlPath, 'utf-8');

    const finalHtml = injectMetaTags(baseHtml, tags);

    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=604800, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(finalHtml);

  } catch (error) {
    console.error('CRITICAL: Error reading production index.html file:', error);
    // Madadin gaba daya idan an samu matsala wajen karanta fayil
    return res.redirect(307, '/');
  }
}
