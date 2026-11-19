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
  return str.replace(/[&<>"']/g, (c) => ESCAPE_MAP[c] || c);
}

export function injectMetaTags(html, tags, canonicalUrl) {
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

  const canonicalTag = canonicalUrl
    ? `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
    : '';

  return html.replace('</head>', `\n${metaStrings}\n${canonicalTag}\n</head>`);
}
