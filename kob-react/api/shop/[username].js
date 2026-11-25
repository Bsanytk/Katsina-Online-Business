import { db } from '../_lib/firebase.js';
import { injectMetaTags } from '../_lib/html.js';
import { readFile } from 'fs/promises';


const PROD_DOMAIN = 'https://katsinaonlinebusiness.com.ng';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dn5crslee/image/upload/v1700000000/kob-marketplace/desktop-screenshot.png';

// Use Vercel system variables to determine the base URL.
const getBaseUrl = () => {
  if (process.env.VERCEL_ENV === 'production') {
    return PROD_DOMAIN;
  }
  // For preview and development, use the dynamic Vercel URL.
  return `https://${process.env.VERCEL_URL}`;
};

async function getVendor(identifier) {
    if (!db) {
        return { error: 'database-unavailable', status: 503 };
    }
    if (!identifier || typeof identifier !== 'string') {
        return { error: 'invalid-id', status: 400 };
    }

    const usersRef = db.collection('users');
    let userQuery;

    // Try to find user by UID, username, or business name
    userQuery = usersRef.doc(identifier);
    let userSnap = await userQuery.get();
    let strategy = 'uid';

    if (!userSnap.exists) {
        userQuery = usersRef.where('username', '==', identifier).limit(1);
        userSnap = await userQuery.get();
        strategy = 'username';

        if (userSnap.empty) {
            userQuery = usersRef.where('businessName', '==', identifier).limit(1);
            userSnap = await userQuery.get();
            strategy = 'businessName';

            if (userSnap.empty) {
                return { error: 'not-found', status: 404 };
            }
        }
    }
    
    const vendorData = userSnap.docs ? userSnap.docs[0].data() : userSnap.data();

    // Eligibility checks
    if (vendorData.role !== 'seller' || vendorData.isSuspended === true || vendorData.isPublic === false) {
        return { error: 'not-found', status: 404 };
    }

    return { data: vendorData, strategy, status: 200 };
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    if (!db) {
        return res.status(503).json({ error: 'The server is temporarily unavailable.' });
    }

    const { username: identifier } = req.query;
    const { data: vendor, error, strategy, status } = await getVendor(identifier);

    if (error) {
        return res.status(status).json({ error });
    }

    const baseUrl = getBaseUrl();
    const canonicalSlug = strategy === 'uid' ? vendor.uid : identifier;
    const canonicalUrl = `${baseUrl}/shop/${canonicalSlug}`;
    const title = vendor.businessName || vendor.displayName || 'KOB Marketplace Vendor';
    const description = vendor.bio || `Explore products from ${title} on KOB Marketplace.`;
    const imageUrl = vendor.photoURL || DEFAULT_IMAGE;

    const tags = {
        'og:title': title,
        'og:description': description,
        'og:image': imageUrl,
        'og:image:alt': `${title}'s shop photo`,
        'og:type': 'profile',
        'og:url': canonicalUrl,
        'og:site_name': 'KOB Marketplace',
        'twitter:card': 'summary_large_image',
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': imageUrl,
    };

    try {
        const htmlPath = new URL('../../dist/index.html', import.meta.url);
        const baseHtml = await readFile(htmlPath, 'utf-8');
        const finalHtml = injectMetaTags(baseHtml, tags, canonicalUrl);

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=259200');
        return res.status(200).send(finalHtml);
    } catch (e) {
        console.error('Error reading index.html or injecting meta tags:', e);
        return res.status(500).send('Internal Server Error');
    }
}
