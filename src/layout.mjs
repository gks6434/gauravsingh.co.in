import { site } from './site.mjs';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Lucide-style stroke icons. No emoji anywhere. */
export const icons = {
  arrow:   '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  mail:    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M3 7l9 6 9-6"/></svg>',
  linkedin:'<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.46-2.2 2.97V21H9z"/></svg>',
  doc:     '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2.5H7A2 2 0 0 0 5 4.5v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5z"/><path d="M14 2.5v5h5M12 11v6M9.5 14.5 12 17l2.5-2.5"/></svg>',
  compass: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></svg>',
  layers:  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2.5 9 5-9 5-9-5z"/><path d="m3 12.5 9 5 9-5M3 17l9 5 9-5"/></svg>',
  zap:     '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  gauge:   '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21a9 9 0 1 1 9-9"/><path d="m12 12 4.5-3.5"/><circle cx="12" cy="12" r="1.6"/></svg>',
  spark:   '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
  pin:     '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.8"/></svg>'
};

function nav(current) {
  return site.nav
    .filter(i => i.href !== '/')
    .map(i => `<a href="${i.href}"${current === i.href ? ' aria-current="page"' : ''}>${esc(i.label)}</a>`)
    .join('\n          ');
}

function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': site.url + '/#person',
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    jobTitle: site.jobTitle,
    description: site.description,
    image: site.url + '/assets/img/photos/portrait-720.webp',
    worksFor: { '@type': 'Organization', name: site.employer },
    alumniOf: site.alumniOf.map(n => ({ '@type': 'EducationalOrganization', name: n })),
    knowsAbout: site.knowsAbout,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Greater Noida West',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN'
    },
    sameAs: [site.linkedin]
    // Deliberately no email or telephone property — contact runs through
    // LinkedIn or the obfuscated address on /contact/.
  };
}

const breadcrumbSchema = crumbs => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem', position: i + 1, name: c.name, item: site.url + c.href
  }))
});

export function page(o) {
  const canonical = site.url + o.path;
  const fullTitle = o.path === '/' ? `${site.name} — ${site.tagline}` : `${o.title} — ${site.name}`;
  const desc = o.description || site.description;

  const graphs = [];
  if (o.path === '/' || o.path === '/about/') graphs.push(personSchema());
  if (o.crumbs && o.crumbs.length > 1) graphs.push(breadcrumbSchema(o.crumbs));
  if (o.schema) graphs.push(...o.schema);
  const jsonld = graphs.map(g => `<script type="application/ld+json">${JSON.stringify(g)}</script>`).join('\n  ');

  const crumbNav = o.crumbs && o.crumbs.length > 1
    ? `<nav class="wrap small muted" aria-label="Breadcrumb" style="padding-top:1.4rem">
      ${o.crumbs.map((c, i) =>
        i === o.crumbs.length - 1
          ? `<span aria-current="page">${esc(c.name)}</span>`
          : `<a href="${c.href}" style="color:inherit;text-decoration:none">${esc(c.name)}</a> <span aria-hidden="true">/</span> `
      ).join('')}
    </nav>`
    : '';

  return `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${canonical}">
  <meta name="author" content="${esc(site.name)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">

  <meta property="og:type" content="${o.ogType || 'website'}">
  <meta property="og:site_name" content="${esc(site.name)}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${site.url}${site.ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="en_IN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(fullTitle)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${site.url}${site.ogImage}">

  <meta name="theme-color" content="#FFFFFF">
  <meta name="color-scheme" content="light">

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@350;400;450;500;600&display=swap">
  <link rel="stylesheet" href="/assets/css/style.css">
  ${o.preloadImage ? `<link rel="preload" as="image" href="${o.preloadImage}" fetchpriority="high">` : ''}
  ${jsonld}
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>

  <div class="aurora" aria-hidden="true"><span></span><span></span><span></span></div>

  <header class="site-head">
    <div class="wrap site-head__inner">
      <a class="brand" href="/">
        <span class="brand__mark" aria-hidden="true">GS</span>
        <span>Gaurav<span class="brand__mid"> Kumar</span> <span class="brand__last">Singh</span></span>
      </a>
      <nav class="nav" aria-label="Primary">
          ${nav(o.navPath || o.path)}
      </nav>
    </div>
  </header>
${crumbNav}
  <main id="main">
${o.body}
  </main>

  <footer class="site-foot">
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <div class="foot-name">${esc(site.name)}</div>
          <p class="muted" style="max-width:36ch">${esc(site.role)}</p>
          <p class="muted" style="margin-top:.85rem">${esc(site.location)}</p>
        </div>
        <div>
          <h4>Site</h4>
          <ul>
            ${site.nav.map(i => `<li><a href="${i.href}">${esc(i.label)}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div>
          <h4>Connect</h4>
          <ul>
            <li><a href="${site.linkedin}" rel="me noopener" target="_blank">LinkedIn</a></li>
            <li><a href="/contact/">Contact</a></li>
            <li><a href="${site.cvPath}" download>Download CV</a></li>
          </ul>
        </div>
      </div>
      <div class="foot-bottom">
        <span>&copy; ${new Date().getFullYear()} ${esc(site.name)}</span>
        <span>Hand-built static site. No trackers, no cookie banner.</span>
      </div>
    </div>
  </footer>

  <script src="/assets/js/main.js" defer></script>
</body>
</html>
`;
}

export { esc };
