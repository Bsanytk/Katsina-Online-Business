import { db } from '../_lib/firebase.js';
import { injectMetaTags } from '../_lib/html.js';
import { readFile } from 'fs/promises';
import path from 'path';

const KOB_DOMAIN = 'https://kob-market.jcew.org';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dn5crslee/image/upload/v1700000000/kob-marketplace/desktop-screenshot.png';

async function getVendor(identifier) {
  if (!db) {
    return { error: 'database-unavailable' };
  }
  if (!identifier || typeof identifier !== 'string') {
    return { error: 'invalid-id' };
  }

  // 1. Check if the identifier is a UID
  const userRefByUid = db.collection('users').doc(identifier);
  const userSnapByUid = await userRefByUid.get();
  if (userSnapByUid.exists) {
    return { data: userSnapByUid.data(), strategy: 'uid' };
  }

  // 2. Check if the identifier is a username
  const usersRef = db.collection('users');
  const userSnapByUsername = await usersRef.where('username', '==', identifier).limit(1).get();
  if (!userSnapByUsername.empty) {
    return { data: userSnapByUsername.docs[0].data(), strategy: 'username' };
  }

  // 3. Check if the identifier is a business name
  const userSnapByBusinessName = await usersRef.where('businessName', '==', identifier).limit(1).get();
  if (!userSnapByBusinessName.empty) {
    return { data: userSnapByBusinessName.docs[0].data(), strategy: 'businessName' };
  }

  return { error: 'not-found' };
}

export default async function handler(req, res) {
  if (!db) {
    return res.status(503).json({ error: 'The server is temporarily unavailable.' });
  }

  const { username: identifier } = req.query;
  const { data: vendor, error, strategy } = await getVendor(identifier);

  if (error) {
    if (error === 'database-unavailable') {
      return res.status(503).json({ error: 'The server is temporarily unavailable.' });
    }
    return res.status(404).send('Not Found');
  }

  const canonicalSlug = strategy === 'uid' ? vendor.uid : identifier;
  const title = vendor.businessName || vendor.displayName || 'KOB Marketplace Vendor';
  const description = vendor.bio || `Explore products from ${title} on KOB Marketplace.`;
  const imageUrl = vendor.photoURL || DEFAULT_IMAGE;

  const tags = {
    'og:title': title,
    'og:description': description,
    'og:image': imageUrl,
    'og:image:alt': `${title}'s shop photo`,
    'og:type': 'profile',
    'og:url': `${KOB_DOMAIN}/shop/${canonicalSlug}`,
    'og:site_name': 'KOB Marketplace',
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': imageUrl,
    'canonical': `${KOB_DOMAIN}/shop/${canonicalSlug}`
  };

  try {
    const htmlPath = path.resolve(process.cwd(), 'dist/index.html');
    const baseHtml = await readFile(htmlPath, 'utf-8');
    const finalHtml = injectMetaTags(baseHtml, tags);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=259200');
    return res.status(200).send(finalHtml);
  } catch (e) {
    console.error('Error reading index.html or injecting meta tags:', e);
    return res.status(500).send('Internal Server Error');
  }
}
