#!/usr/bin/env node
/**
 * Static site build for gauravsingh.co.in
 * Reads Markdown from /content, writes plain HTML to /public.
 * Upload the contents of /public to Hostinger's public_html.
 */
import { mkdir, writeFile, rm, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/site.mjs';
import { page, esc } from '../src/layout.mjs';
import { loadCollection, formatDate } from '../src/content.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public');

const ARROW = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const MAIL = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="M3 6.5l9 6 9-6"/></svg>';

async function write(relPath, html) {
  const full = path.join(OUT, relPath);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, html);
}

const statBlock = (metrics = []) =>
  !metrics.length ? '' :
  `<div class="stats">
        ${metrics.map(m => `<div class="stat"><div class="stat__num">${esc(m.value)}</div><div class="stat__label">${esc(m.label)}</div></div>`).join('\n        ')}
      </div>`;

/* ------------------------------------------------------------------ HOME */
function home(work, posts) {
  const featured = work.filter(w => w.featured).slice(0, 4);
  const latest = posts.slice(0, 2);

  const body = `
    <section class="wrap hero">
      <span class="status">${esc(site.availability)}</span>
      <h1>I find broken business processes and build the systems that <em>fix them</em>.</h1>
      <p class="hero__lede">Ten years connecting business strategy, customer journeys, data and technology &mdash; web platforms, CRM and lead lifecycle architecture, workflow automation, and AI-enabled customer experiences for B2B businesses.</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="/work/">See the work ${ARROW}</a>
        <a class="btn btn--ghost" href="/about/">About me</a>
      </div>
      <div class="hero__meta">
        <span>${esc(site.jobTitle)}, ${esc(site.employer)}</span>
        <span class="dot" aria-hidden="true"></span>
        <span>${esc(site.location)}</span>
      </div>
    </section>

    <section class="wrap" style="padding-bottom:clamp(3rem,8vw,5rem)">
      ${statBlock([
        { value: '400+ MINR', label: 'Digitally influenced sales pipeline, HORIBA India' },
        { value: '15\u00D7', label: 'Organic traffic growth over ~2 years, TripClap' },
        { value: '5K \u2192 15K', label: 'Monthly inspections scaled, CARS24' },
        { value: '600+', label: 'Employees reached via internal digital platform' }
      ])}
    </section>

    <section class="section section--sunk">
      <div class="wrap">
        <div class="sec-head">
          <h2>What I actually do</h2>
        </div>
        <div class="skill-grid">
          <section>
            <h3>Translate</h3>
            <p>Take a business or process problem that everyone can feel but nobody has specified, and turn it into requirements a technical team can build against.</p>
          </section>
          <section>
            <h3>Design</h3>
            <p>Architect the solution &mdash; platform, workflow, data model, lifecycle &mdash; and choose technology on fit and total cost, not novelty.</p>
          </section>
          <section>
            <h3>Deliver</h3>
            <p>Drive it through development, stakeholders and rollout, increasingly building and prototyping directly with AI-assisted development.</p>
          </section>
          <section>
            <h3>Measure</h3>
            <p>Instrument the outcome so the business can see what changed &mdash; analytics, attribution, dashboards, and honest numbers.</p>
          </section>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="sec-head">
          <h2>Selected work</h2>
          <a href="/work/">All case studies ${ARROW}</a>
        </div>
        <div class="cards">
          ${featured.map(cardFor).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="sec-head">
          <h2>Writing</h2>
          <a href="/writing/">All posts ${ARROW}</a>
        </div>
        <div class="rows">
          ${latest.map(rowFor).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="prose" style="max-width:52ch">
          <h2>Let's talk</h2>
          <p class="lede" style="margin-top:1rem">If you are working through a transformation, an automation programme, or how to adopt AI without an unreviewable black box in the middle of it &mdash; I am always up for the conversation.</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="mailto:${site.email}">${MAIL} ${esc(site.email)}</a>
            <a class="btn btn--ghost" href="/contact/">All contact options</a>
          </div>
        </div>
      </div>
    </section>`;

  return page({ title: 'Home', path: '/', description: site.description, body });
}

const cardFor = w => `<article class="card">
            <div class="card__tag">${esc(w.tag)}</div>
            <h3><a href="/work/${w.slug}/">${esc(w.title)}</a></h3>
            <p>${esc(w.summary)}</p>
            <div class="card__foot"><span>${esc(w.org)}</span><span>&middot;</span><span>${esc(w.period)}</span></div>
          </article>`;

const rowFor = p => `<article class="row">
            <h3><a href="/writing/${p.slug}/">${esc(p.title)}</a></h3>
            <div class="row__date">${formatDate(p.date)}</div>
            <p>${esc(p.description)}</p>
          </article>`;

/* ----------------------------------------------------------------- ABOUT */
function about() {
  const body = `
    <section class="wrap hero" style="padding-bottom:2rem">
      <div class="eyebrow">About</div>
      <h1 style="font-size:var(--step-3);max-width:16ch">Digital marketing taught me the business. Then I went and built the systems.</h1>
    </section>

    <section class="wrap section" style="padding-top:0">
      <div class="prose">
        <p class="lede">My career started in digital acquisition &mdash; SEO, performance marketing, demand generation. Over ten years it moved steadily down the stack: into the analytics that measure it, the CRM that manages what it produces, the automation that removes the manual handling, the platforms it all runs on, and now the AI applications on top.</p>

        <p>That path was not a plan. It was the consequence of repeatedly hitting the same wall. You cannot fix lead quality if the attribution is wrong. You cannot fix attribution if the measurement layer was never designed. You cannot fix the measurement layer if the website was built as a brochure. Each problem sat one level below the last, and solving it meant learning that level properly.</p>

        <p>Today I lead digital transformation initiatives at ${esc(site.employer)} across four B2B industrial businesses &mdash; Bio &amp; Healthcare, Materials &amp; Semiconductor, Energy &amp; Environment, and Mobility. In practice that means the corporate web platform, a centralised lead management workflow spanning Power Automate, SharePoint and Salesforce, the GA4 and Looker Studio measurement architecture, employee experience digitisation on Microsoft 365, and the company's first AI-enabled customer-facing application.</p>

        <h2>What I am, and what I am not</h2>

        <p>I am not a data scientist and I do not claim to be. I have not trained a model and I would not position myself against someone who has.</p>

        <p>What I do is sit between business leadership and technical teams. Define the problem precisely. Design the solution. Choose the technology on fit and total cost rather than novelty. Drive it through delivery and the stakeholders who have to adopt it. Then instrument it, so the business can see what actually changed.</p>

        <p>Increasingly that includes building directly &mdash; prototyping, specifying and shipping with AI coding agents under version control. Not because I am a software engineer, but because the distance between <em>"we should try this"</em> and <em>working, governed software</em> has become short enough that one person who understands the business problem can now cross it. Knowing where that line sits, and where it does not, is a large part of the job now.</p>

        <h2>How I work</h2>
      </div>

      <div class="skill-grid mt-lg">
        <section>
          <h3>Use what you own</h3>
          <p>The question is rarely "what should we buy?" It is "what does the organisation already have a licence for, and what could it do if someone designed a proper experience on top of it?"</p>
        </section>
        <section>
          <h3>Vocabulary before automation</h3>
          <p>Automating an ambiguous process just produces ambiguity faster, with a dashboard on top lending it false precision. Agreement is harder than the technology and matters more.</p>
        </section>
        <section>
          <h3>Measure the before-state</h3>
          <p>The baseline is free exactly once, before you start. After that it is gone permanently &mdash; and "it improved" is a much weaker claim than a number.</p>
        </section>
        <section>
          <h3>Design the failure mode first</h3>
          <p>Especially with AI. Decide what the system is structurally incapable of doing before deciding what it should do. That is what gets it approved.</p>
        </section>
      </div>
    </section>

    <section class="section section--sunk">
      <div class="wrap">
        <div class="sec-head"><h2>Career</h2></div>
        <ul class="timeline">
          <li>
            <div class="t-when">Nov 2024 &mdash; present</div>
            <div><div class="t-role">Deputy Manager, Digital Marketing Lead</div><div class="t-org">HORIBA India Pvt. Ltd.</div></div>
            <div class="t-note">Digital transformation, MarTech, automation and digital products across four B2B industrial businesses.</div>
          </li>
          <li>
            <div class="t-when">Jul 2022 &mdash; Sep 2024</div>
            <div><div class="t-role">Performance Marketing Manager</div><div class="t-org">DigiClap Technologies (TripClap.com)</div></div>
            <div class="t-note">Full-funnel acquisition for a travel marketplace. 15&times; organic growth; rebuilt the measurement and attribution layer.</div>
          </li>
          <li>
            <div class="t-when">May 2021 &mdash; May 2022</div>
            <div><div class="t-role">Senior Associate, Digital Marketing</div><div class="t-org">CARS24 Services Pvt. Ltd.</div></div>
            <div class="t-note">Partner-driven acquisition. Monthly vehicle inspections scaled from ~5,000 to ~15,000.</div>
          </li>
          <li>
            <div class="t-when">Dec 2020 &mdash; May 2021</div>
            <div><div class="t-role">Digital Marketing Specialist</div><div class="t-org">Investors Clinic Infra Pvt. Ltd.</div></div>
            <div class="t-note">High-volume email, SMS and landing-page lead generation.</div>
          </li>
          <li>
            <div class="t-when">Jun 2016 &mdash; Nov 2020</div>
            <div><div class="t-role">Digital Marketing Executive</div><div class="t-org">HelloTravel Online Pvt. Ltd.</div></div>
            <div class="t-note">Where it started &mdash; SEO, email marketing and digital campaigns.</div>
          </li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="sec-head"><h2>Education</h2></div>
        <ul class="timeline">
          <li>
            <div class="t-when">2022 &mdash; 2023</div>
            <div><div class="t-role">eMDP in Data Science &mdash; Data Science for Managers</div><div class="t-org">Indian Institute of Management (IIM) Kozhikode</div></div>
          </li>
          <li>
            <div class="t-when">2014 &mdash; 2016</div>
            <div><div class="t-role">PGDM &mdash; Marketing &amp; Operations</div><div class="t-org">IMS Ghaziabad</div></div>
          </li>
          <li>
            <div class="t-when">2010 &mdash; 2013</div>
            <div><div class="t-role">B.E. &mdash; Mechanical Engineering</div><div class="t-org">Visvesvaraya Technological University</div></div>
          </li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="sec-head"><h2>Tools I work with</h2></div>
        <div class="skill-grid">
          <section><h3>Analytics</h3><p>Google Analytics 4 &middot; Google Tag Manager &middot; Looker Studio &middot; Search Console &middot; Conversions API &middot; Attribution modelling</p></section>
          <section><h3>CRM &amp; MarTech</h3><p>Salesforce &middot; HubSpot &middot; Mailchimp &middot; Lead lifecycle design &middot; Marketing automation</p></section>
          <section><h3>Automation</h3><p>Microsoft Power Automate &middot; Microsoft 365 &middot; SharePoint &middot; Microsoft Forms &middot; Workflow design</p></section>
          <section><h3>Web &amp; product</h3><p>React &middot; Next.js &middot; Tailwind &middot; HTML/CSS &middot; PHP platforms &middot; Headless CMS &middot; Git &middot; Technical SEO</p></section>
          <section><h3>AI</h3><p>Claude &middot; ChatGPT &middot; Codex &middot; AI coding agents &middot; Retrieval-augmented assistants &middot; Evaluation &amp; guardrail design</p></section>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap prose" style="max-width:52ch">
        <h2>Get in touch</h2>
        <div class="btn-row">
          <a class="btn btn--primary" href="mailto:${site.email}">${MAIL} Email me</a>
          <a class="btn btn--ghost" href="${site.linkedin}" rel="me noopener">LinkedIn</a>
        </div>
      </div>
    </section>`;

  return page({
    title: 'About',
    path: '/about/',
    description: 'Gaurav Kumar Singh — ten years from digital acquisition to enterprise digital transformation, automation and applied AI. Career, approach and tooling.',
    crumbs: [{ name: 'Home', href: '/' }, { name: 'About', href: '/about/' }],
    body
  });
}

/* ------------------------------------------------------------ WORK INDEX */
function workIndex(work) {
  const body = `
    <section class="wrap hero" style="padding-bottom:2rem">
      <div class="eyebrow">Work</div>
      <h1 style="font-size:var(--step-3);max-width:18ch">Case studies</h1>
      <p class="hero__lede" style="margin-top:1.25rem">Six pieces of work that show the pattern: a business problem nobody had specified, a system designed to fix it, and an honest account of what changed &mdash; including what I would do differently.</p>
    </section>
    <section class="wrap section" style="padding-top:0">
      <div class="cards">
        ${work.map(cardFor).join('\n        ')}
      </div>
    </section>`;

  return page({
    title: 'Work',
    path: '/work/',
    description: 'Case studies in digital transformation, enterprise automation, CRM and lead lifecycle architecture, digital platforms and applied AI.',
    crumbs: [{ name: 'Home', href: '/' }, { name: 'Work', href: '/work/' }],
    body
  });
}

/* ------------------------------------------------------------- WORK ITEM */
function workItem(w, all) {
  const others = all.filter(x => x.slug !== w.slug).slice(0, 3);
  const stackList = (w.stack || '').split(',').map(s => s.trim()).filter(Boolean);

  const body = `
    <section class="wrap cs-head">
      <div class="eyebrow">${esc(w.tag)}</div>
      <h1>${esc(w.title)}</h1>
      <p class="lede">${esc(w.summary)}</p>
      <dl class="cs-meta">
        <div><dt>Organisation</dt><dd>${esc(w.org)}</dd></div>
        <div><dt>Period</dt><dd>${esc(w.period)}</dd></div>
        <div><dt>My role</dt><dd>${esc(w.role)}</dd></div>
        <div><dt>Status</dt><dd>${esc(w.status)}</dd></div>
      </dl>
      ${stackList.length ? `<ul class="pill-list">${stackList.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
    </section>

    ${w.metrics && w.metrics.length ? `<section class="wrap" style="padding-top:2.5rem">${statBlock(w.metrics)}</section>` : ''}

    <section class="wrap section">
      <div class="prose">
        ${w.html}
      </div>
    </section>

    <section class="section section--sunk">
      <div class="wrap">
        <div class="sec-head"><h2>More work</h2><a href="/work/">All case studies ${ARROW}</a></div>
        <div class="cards">${others.map(cardFor).join('\n          ')}</div>
      </div>
    </section>`;

  return page({
    title: w.title,
    path: `/work/${w.slug}/`,
    description: w.summary,
    ogType: 'article',
    navPath: '/work/',
    crumbs: [{ name: 'Home', href: '/' }, { name: 'Work', href: '/work/' }, { name: w.tag, href: `/work/${w.slug}/` }],
    body
  });
}

/* --------------------------------------------------------- WRITING INDEX */
function writingIndex(posts) {
  const body = `
    <section class="wrap hero" style="padding-bottom:2rem">
      <div class="eyebrow">Writing</div>
      <h1 style="font-size:var(--step-3);max-width:18ch">Notes on transformation, automation and applied AI</h1>
      <p class="hero__lede" style="margin-top:1.25rem">Things I have learned building this work, written down while they are still specific enough to be useful.</p>
    </section>
    <section class="wrap section" style="padding-top:0">
      <div class="rows">
        ${posts.map(rowFor).join('\n        ')}
      </div>
    </section>`;

  return page({
    title: 'Writing',
    path: '/writing/',
    description: 'Writing on digital transformation, enterprise automation, CRM and lead lifecycle design, and adopting AI in a way that survives internal review.',
    crumbs: [{ name: 'Home', href: '/' }, { name: 'Writing', href: '/writing/' }],
    body
  });
}

/* ---------------------------------------------------------- WRITING ITEM */
function writingItem(p, all) {
  const others = all.filter(x => x.slug !== p.slug).slice(0, 2);
  const tags = (p.tags || '').split(',').map(t => t.trim()).filter(Boolean);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.date,
    author: { '@type': 'Person', name: site.name, url: site.url },
    publisher: { '@type': 'Person', name: site.name, url: site.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.url}/writing/${p.slug}/` },
    keywords: tags.join(', ')
  };

  const body = `
    <article>
      <header class="wrap cs-head">
        <div class="eyebrow">${formatDate(p.date)} &middot; ${p.readingTime} min read</div>
        <h1>${esc(p.title)}</h1>
        <p class="lede">${esc(p.description)}</p>
        ${tags.length ? `<ul class="pill-list">${tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      </header>
      <div class="wrap section">
        <div class="prose">${p.html}</div>
      </div>
    </article>

    ${others.length ? `<section class="section section--sunk">
      <div class="wrap">
        <div class="sec-head"><h2>More writing</h2><a href="/writing/">All posts ${ARROW}</a></div>
        <div class="rows">${others.map(rowFor).join('\n          ')}</div>
      </div>
    </section>` : ''}`;

  return page({
    title: p.title,
    path: `/writing/${p.slug}/`,
    description: p.description,
    ogType: 'article',
    navPath: '/writing/',
    schema: [articleSchema],
    crumbs: [{ name: 'Home', href: '/' }, { name: 'Writing', href: '/writing/' }, { name: p.title, href: `/writing/${p.slug}/` }],
    body
  });
}

/* --------------------------------------------------------------- CONTACT */
function contact() {
  const body = `
    <section class="wrap hero" style="padding-bottom:2rem">
      <div class="eyebrow">Contact</div>
      <h1 style="font-size:var(--step-3);max-width:16ch">Let's talk</h1>
      <p class="hero__lede" style="margin-top:1.25rem">${esc(site.availability)}. I also enjoy talking to people working through a transformation, an automation programme, or how to adopt AI without ending up with an unreviewable black box.</p>
    </section>

    <section class="wrap section" style="padding-top:0">
      <div class="contact-grid">
        <a class="contact-card" href="mailto:${site.email}">
          <strong>Email</strong><span>${esc(site.email)}</span>
        </a>
        <a class="contact-card" href="${site.linkedin}" rel="me noopener">
          <strong>LinkedIn</strong><span>Connect and message</span>
        </a>
        <a class="contact-card" href="tel:${site.phone.replace(/[^+\d]/g, '')}">
          <strong>Phone</strong><span>${esc(site.phone)}</span>
        </a>
        <a class="contact-card" href="${site.cvPath}" download>
          <strong>Download CV</strong><span>PDF, one page down from this site</span>
        </a>
      </div>

      <div class="prose mt-lg" style="margin-top:3rem">
        <h2>What I am looking for</h2>
        <p>Roles where the mandate is genuinely to change how something works &mdash; Digital Transformation, MarTech &amp; Automation, AI adoption, or digital product ownership. I am most useful in organisations that have real process pain, own more technology than they currently use well, and want someone who can specify the fix as precisely as they can describe the problem.</p>
        <p class="muted small">Based in ${esc(site.location)}. Open to roles in the NCR region and to remote or hybrid arrangements.</p>
      </div>
    </section>`;

  return page({
    title: 'Contact',
    path: '/contact/',
    description: `Get in touch with Gaurav Kumar Singh — ${site.availability.toLowerCase()}. Email, LinkedIn and CV.`,
    crumbs: [{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact/' }],
    body
  });
}

/* ------------------------------------------------------------------- 404 */
function notFound() {
  const body = `
    <section class="wrap hero" style="min-height:52vh">
      <div class="eyebrow">404</div>
      <h1 style="font-size:var(--step-3);max-width:16ch">That page does not exist.</h1>
      <p class="hero__lede" style="margin-top:1.25rem">Which is itself a small failure of information architecture. Try one of these instead.</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="/">Home ${ARROW}</a>
        <a class="btn btn--ghost" href="/work/">Case studies</a>
        <a class="btn btn--ghost" href="/writing/">Writing</a>
      </div>
    </section>`;
  return page({ title: 'Page not found', path: '/404.html', description: 'That page does not exist on gauravsingh.co.in. Try the case studies, the writing, or the home page instead.', body });
}

/* ------------------------------------------------------- SUPPORT FILES */
function sitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${site.url}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
}

const robots = () => `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;

const favicon = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#191817"/>
  <text x="32" y="45" font-family="Georgia, serif" font-size="38" fill="#A8492A" text-anchor="middle">G</text>
</svg>
`;

const htaccess = () => `# gauravsingh.co.in — Hostinger (Apache)

Options -Indexes
DirectoryIndex index.html

# --- Force HTTPS and the canonical www-less host ---------------------------
<IfModule mod_rewrite.c>
  RewriteEngine On

  RewriteCond %{HTTPS} !=on
  RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

  RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
  RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

  # Strip index.html from URLs
  RewriteCond %{THE_REQUEST} \\s/+(.*/)?index\\.html[\\s?] [NC]
  RewriteRule ^(.*/)?index\\.html$ /$1 [R=301,L]
</IfModule>

ErrorDocument 404 /404.html

# --- Compression -----------------------------------------------------------
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json image/svg+xml
</IfModule>

# --- Caching ---------------------------------------------------------------
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# --- Security headers ------------------------------------------------------
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=(), interest-cohort=()"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>
`;

/* ------------------------------------------------------------------ MAIN */
async function build() {
  const t0 = Date.now();
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const work = (await loadCollection(path.join(ROOT, 'content/work')))
    .sort((a, b) => (a.order || 99) - (b.order || 99));
  const posts = (await loadCollection(path.join(ROOT, 'content/writing')))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  await cp(path.join(ROOT, 'src/assets'), path.join(OUT, 'assets'), { recursive: true });

  await write('index.html', home(work, posts));
  await write('about/index.html', about());
  await write('work/index.html', workIndex(work));
  await write('writing/index.html', writingIndex(posts));
  await write('contact/index.html', contact());
  await write('404.html', notFound());

  for (const w of work) await write(`work/${w.slug}/index.html`, workItem(w, work));
  for (const p of posts) await write(`writing/${p.slug}/index.html`, writingItem(p, posts));

  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: '/', lastmod: today, freq: 'weekly', priority: '1.0' },
    { loc: '/about/', lastmod: today, freq: 'monthly', priority: '0.9' },
    { loc: '/work/', lastmod: today, freq: 'monthly', priority: '0.9' },
    { loc: '/writing/', lastmod: today, freq: 'weekly', priority: '0.8' },
    { loc: '/contact/', lastmod: today, freq: 'yearly', priority: '0.7' },
    ...work.map(w => ({ loc: `/work/${w.slug}/`, lastmod: today, freq: 'monthly', priority: '0.8' })),
    ...posts.map(p => ({ loc: `/writing/${p.slug}/`, lastmod: p.date, freq: 'yearly', priority: '0.7' }))
  ];

  await write('sitemap.xml', sitemap(urls));
  await write('robots.txt', robots());
  await write('favicon.svg', favicon());
  await write('.htaccess', htaccess());

  console.log(`Built ${urls.length + 1} pages in ${Date.now() - t0}ms`);
  console.log(`  ${work.length} case studies, ${posts.length} posts`);
  console.log(`  Output: public/  →  upload contents to Hostinger public_html`);
}

build().catch(e => { console.error(e); process.exit(1); });
