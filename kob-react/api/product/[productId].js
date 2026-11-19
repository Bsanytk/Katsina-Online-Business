import { db } from '../_lib/firebase.js';
import { injectMetaTags } from '../_lib/html.js';
import { readFile } from 'fs/promises';
import path from 'path';

const KOB_DOMAIN = 'https://katsinaonlinebusiness.com.ng';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dn5crslee/image/upload/v1700000000/kob-marketplace/desktop-screenshot.png';

async function getProduct(productId) {
  if (!db) {
    return { error: 'database-unavailable', status: 503 };
  }
  if (!productId || typeof productId !== 'string') {
    return { error: 'invalid-id', status: 400 };
  }

  const productRef = db.collection('products').doc(productId);
  const productSnap = await productRef.get();

  if (!productSnap.exists) {
    return { error: 'not-found', status: 404 };
  }

  const productData = productSnap.data();

  if (productData.isDraft === true || productData.isDeleted === true || productData.isSuspended === true || productData.published === false) {
    return { error: 'not-found', status: 404 };
  }

  return { data: productData, status: 200 };
}

function getProductImage(product) {
    if (product.imageUrl && typeof product.imageUrl === 'string') {
        return product.imageUrl;
    }
    if (Array.isArray(product.images) && product.images.length > 0) {
        const firstImage = product.images[0];
        if (typeof firstImage === 'string') return firstImage;
        if (firstImage && typeof firstImage.url === 'string') return firstImage.url;
        if (firstImage && typeof firstImage.secure_url === 'string') return firstImage.secure_url;
    }
    if (product.mainImage && typeof product.mainImage === 'string') {
        return product.mainImage;
    }
    return DEFAULT_IMAGE;
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

  if (!db) {
    return res.status(503).json({ error: 'The server is temporarily unavailable.' });
  }

  const { productId } = req.query;
  const { data: product, error, status } = await getProduct(productId);

  if (error) {
    return res.status(status).json({ error });
  }

  const canonicalUrl = `${KOB_DOMAIN}/product/${productId}`;
  const imageUrl = getProductImage(product);
  const productPrice = product.price && !isNaN(product.price) ? `₦${Number(product.price).toLocaleString()}` : '';
  const description = product.description || `Buy ${product.title} on KOB Marketplace.`;
  const title = product.title && productPrice ? `${product.title} - ${productPrice}` : product.title || 'KOB Marketplace';

  const tags = {
    'og:title': title,
    'og:description': description,
    'og:image': imageUrl,
    'og:image:alt': product.title,
    'og:type': 'product',
    'og:url': canonicalUrl,
    'og:site_name': 'KOB Marketplace',
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': imageUrl,
  };

  try {
    const htmlPath = path.resolve(process.cwd(), 'dist/index.html');
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
