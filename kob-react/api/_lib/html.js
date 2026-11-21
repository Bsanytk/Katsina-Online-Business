const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(str) {
  if (typeof str !== 'string') {
    return '';
  }
  return str.replace(/[&<>"'/]/g, (c) => ESCAPE_MAP[c] || c);
}

export function injectMetaTags(html, tags, canonicalUrl) {
  let processedHtml = html;

  // Remove existing Open Graph and Twitter metadata tags to prevent duplicates.
  // This regex is robust against attribute order, quote style, and whitespace.
  processedHtml = processedHtml.replace(/<meta[^>]*?(?:name|property)\s*=\s*['"](?:og|twitter):[^'"]+['"][^>]*?>/gi, '');

  // If a new canonical URL is provided, remove any existing canonical link tag.
  if (canonicalUrl) {
    processedHtml = processedHtml.replace(/<link[^>]*?rel=['"]canonical['"][^>]*?>/gi, '');
  }

  // Build the new meta tags from the provided tags object.
  const metaStrings = Object.entries(tags)
    .map(([key, value]) => {
      if (!value) return '';
      const cleanValue = escapeHtml(String(value));
      if (key.startsWith('og:')) {
        return `<meta property="${key}" content="${cleanValue}">`;
      }
      return `<meta name="${key}" content="${cleanValue}">`;
    })
    .join('\n');

  // Build the new canonical link tag if a URL was provided.
  const canonicalTag = canonicalUrl
    ? `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
    : '';

  // Combine all new tags, filtering out any empty strings.
  const allNewTags = [metaStrings, canonicalTag].filter(Boolean).join('\n');
  
  // Gracefully handle cases where the <head> tag might be missing.
  if (processedHtml.includes('</head>')) {
    return processedHtml.replace('</head>', `\n${allNewTags}\n</head>`);
  } else {
    // If no </head>, prepend it to the document.
    return `
      <head>
        ${allNewTags}
      </head>
      ${processedHtml}
    `;
  }
}
