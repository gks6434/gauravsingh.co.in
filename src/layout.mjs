import { site } from './site.mjs';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ICON_SUN = '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const ICON_MOON = '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

// Runs before first paint so a stored theme choice never flashes.
const THEME_BOOT = `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`;

function nav(current) {
  return site.nav
    .filter(i => i.href !== '/')
    .map(i => {
      const active = current === i.href ? ' aria-current="page"' : '';
      return `<a href="${i.href}"${active}>${esc(i.label)}</a>`;
    })
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
    email: 'mailto:' + site.email,
    jobTitle: site.jobTitle,
    description: site.description,
    image: site.url + site.ogImage,
    worksFor: { '@type': 'Organization', name: site.employer },
    alumniOf: site.alumniOf.map(n => ({ '@type': 'EducationalOrganization', name: n })),
    knowsAbout: site.knowsAbout,
    address: { '@type': 'PostalAddress', addressLocality: 'Greater Noida West', addressRegion: 'Uttar Pradesh', addressCountry: 'IN' },
    sameAs: [site.linkedin]
  };
}

function breadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.name, item: site.url + c.href
    }))
  };
}

/**
 * Render a complete HTML page.
 * @param {object} o
 * @param {string} o.title      Page <title> (site name is appended)
 * @param {string} o.description Meta description
 * @param {string} o.path       Absolute path with trailing slash, e.g. '/work/'
 * @param {string} o.body       Inner HTML for <main>
 * @param {string} [o.navPath]  Which nav item to mark current
 * @param {object[]} [o.schema] Extra JSON-LD objects
 * @param {object[]} [o.crumbs] Breadcrumb trail
 */
export function page(o) {
  const canonical = site.url + o.path;
  const fullTitle = o.path === '/' ? `${site.name} — ${site.tagline}` : `${o.title} — ${site.name}`;
  const desc = o.description || site.description;

  const graphs = [];
  if (o.path === '/' || o.path === '/about/') graphs.push(personSchema());
  if (o.crumbs && o.crumbs.length > 1) graphs.push(breadcrumbSchema(o.crumbs));
  if (o.schema) graphs.push(...o.schema);

  const jsonld = graphs
    .map(g => `<script type="application/ld+json">${JSON.stringify(g)}</script>`)
    .join('\n  ');

  const crumbNav = o.crumbs && o.crumbs.length > 1
    ? `<nav class="wrap small muted" aria-label="Breadcrumb" style="padding-top:1.5rem">
      ${o.crumbs.map((c, i) =>
        i === o.crumbs.length - 1
          ? `<span aria-current="page">${esc(c.name)}</span>`
          : `<a href="${c.href}" style="color:inherit">${esc(c.name)}</a> <span aria-hidden="true">/</span> `
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
  <meta property="og:locale" content="en_IN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(fullTitle)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${site.url}${site.ogImage}">

  <meta name="theme-color" content="#FAF8F5" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#141312" media="(prefers-color-scheme: dark)">

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap">
  <link rel="stylesheet" href="/assets/css/style.css">

  <script>${THEME_BOOT}</script>
  ${jsonld}
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>

  <header class="site-head">
    <div class="wrap site-head__inner">
      <a class="brand" href="/">Gaurav<span class="brand-mid"> Kumar</span> <span class="brand-last">Singh</span></a>
      <nav class="nav" aria-label="Primary">
          ${nav(o.navPath || o.path)}
      </nav>
      <button class="theme-toggle" type="button" aria-label="Switch colour theme">
        ${ICON_SUN}${ICON_MOON}
      </button>
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
          <p class="muted" style="max-width:34ch">${esc(site.role)}</p>
          <p class="muted" style="margin-top:.75rem">${esc(site.location)}</p>
        </div>
        <div>
          <h4>Site</h4>
          <ul>
            ${site.nav.map(i => `<li><a href="${i.href}">${esc(i.label)}</a></li>`).join('\n            ')}
          </ul>
        </div>
        <div>
          <h4>Elsewhere</h4>
          <ul>
            <li><a href="${site.linkedin}" rel="me noopener">LinkedIn</a></li>
            <li><a href="mailto:${site.email}">${esc(site.email)}</a></li>
            <li><a href="tel:${site.phone.replace(/[^+\d]/g, '')}">${esc(site.phone)}</a></li>
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
