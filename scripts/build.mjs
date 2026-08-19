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
import { page, esc, icons } from '../src/layout.mjs';
import { loadCollection, formatDate } from '../src/content.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public');
const P = '/assets/img/photos';

async function write(relPath, html) {
  const full = path.join(OUT, relPath);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, html);
}

/* Email markup — the plain address never appears in the served HTML.
   data-user / data-domain are joined by main.js at runtime. */
const emailAttrs = `data-email data-user="${site.emailUser}" data-domain="${site.emailDomain}"`;

const statTiles = (metrics, reveal = true) =>
  !metrics || !metrics.length ? '' :
  `<div class="stats">
        ${metrics.map(m => `<div class="stat-tile${reveal ? ' reveal' : ''}">
          <div class="stat-tile__num">${esc(m.value)}</div>
          <div class="stat-tile__label">${esc(m.label)}</div>
        </div>`).join('\n        ')}
      </div>`;

const cardFor = w => `<article class="card reveal">
            <span class="card__tag">${esc(w.tag)}</span>
            <h3><a href="/work/${w.slug}/">${esc(w.title)}</a></h3>
            <p>${esc(w.summary)}</p>
            <div class="card__foot">
              <span>${esc(w.org)}</span><span class="card__dot" aria-hidden="true"></span><span>${esc(w.period)}</span>
            </div>
          </article>`;

const rowFor = p => `<article class="row reveal">
            <h3><a href="/writing/${p.slug}/">${esc(p.title)}</a></h3>
            <div class="row__date">${formatDate(p.date)} · ${p.readingTime} min</div>
            <p>${esc(p.description)}</p>
          </article>`;

const portrait = `<div class="portrait reveal">
          <div class="portrait__glow" aria-hidden="true"></div>
          <div class="portrait__frame">
            <img
              src="${P}/portrait-720.webp"
              srcset="${P}/portrait-480.webp 480w, ${P}/portrait-720.webp 720w, ${P}/portrait-1080.webp 1080w"
              sizes="(max-width: 900px) 72vw, 380px"
              width="720" height="720"
              fetchpriority="high" decoding="async"
              alt="Gaurav Kumar Singh">
          </div>
          <div class="portrait__chip">${icons.pin} ${esc(site.location.split(',')[0])}</div>
        </div>`;

/* ------------------------------------------------------------------ HOME */
function home(work, posts) {
  const featured = work.filter(w => w.featured).slice(0, 4);
  const latest = posts.slice(0, 2);

  const body = `
    <section class="wrap hero">
      <div class="hero__grid">
        <div>
          <span class="status">${esc(site.availability)}</span>
          <h1>I rebuild broken processes as <span class="grad">systems that work</span>.</h1>
          <p class="hero__lede">Ten years connecting business strategy, customer journeys, data and technology &mdash; web platforms, CRM and lead lifecycle architecture, workflow automation, and AI-enabled customer experiences for B2B businesses.</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="/work/">See the work ${icons.arrow}</a>
            <a class="btn btn--glass" href="/about/">About me</a>
          </div>
        </div>
        ${portrait}
      </div>
    </section>

    <section class="wrap" style="padding-bottom:clamp(3rem,8vw,5rem)">
      ${statTiles([
        { value: '400+ MINR', label: 'Digitally influenced sales pipeline' },
        { value: '15\u00D7', label: 'Organic traffic growth over ~2 years' },
        { value: '5K \u2192 15K', label: 'Monthly inspections scaled' },
        { value: '600+', label: 'Employees reached via an internal platform' }
      ])}
    </section>

    <section class="wrap section">
      <div class="sec-head reveal">
        <div>
          <h2>What I actually do</h2>
          <p>The same four moves, whether the problem is a website, a lead process, or an AI application.</p>
        </div>
      </div>
      <div class="panels">
        <div class="panel reveal">
          <div class="panel__icon">${icons.compass}</div>
          <h3>Translate</h3>
          <p>Take a business problem everyone can feel but nobody has specified, and turn it into requirements a technical team can build against.</p>
        </div>
        <div class="panel reveal">
          <div class="panel__icon">${icons.layers}</div>
          <h3>Design</h3>
          <p>Architect the solution &mdash; platform, workflow, data model, lifecycle &mdash; and choose technology on fit and total cost, not novelty.</p>
        </div>
        <div class="panel reveal">
          <div class="panel__icon">${icons.zap}</div>
          <h3>Deliver</h3>
          <p>Drive it through development, stakeholders and rollout, increasingly building and prototyping directly with AI-assisted development.</p>
        </div>
        <div class="panel reveal">
          <div class="panel__icon">${icons.gauge}</div>
          <h3>Measure</h3>
          <p>Instrument the outcome so the business can see what changed &mdash; analytics, attribution, dashboards, and honest numbers.</p>
        </div>
      </div>
    </section>

    <section class="wrap section">
      <div class="sec-head reveal">
        <div>
          <h2>Selected work</h2>
          <p>Problem, system, outcome &mdash; and an honest note on what I would do differently.</p>
        </div>
        <a class="sec-link" href="/work/">All case studies ${icons.arrow}</a>
      </div>
      <div class="cards">
        ${featured.map(cardFor).join('\n        ')}
      </div>
    </section>

    <section class="wrap section">
      <div class="sec-head reveal">
        <div><h2>Writing</h2></div>
        <a class="sec-link" href="/writing/">All posts ${icons.arrow}</a>
      </div>
      <div class="rows">
        ${latest.map(rowFor).join('\n        ')}
      </div>
    </section>

    <section class="wrap section">
      <div class="glass reveal" style="padding:clamp(2rem,5vw,3.25rem);text-align:center">
        <h2 style="max-width:18ch;margin-inline:auto">Let&rsquo;s talk</h2>
        <p class="lede" style="max-width:52ch;margin:1.15rem auto 0">If you are working through a transformation, an automation programme, or how to adopt AI without an unreviewable black box in the middle of it &mdash; I am always up for the conversation.</p>
        <div class="btn-row" style="justify-content:center;margin-top:2rem">
          <a class="btn btn--primary" href="${site.linkedin}" rel="me noopener" target="_blank">${icons.linkedin} Connect on LinkedIn</a>
          <a class="btn btn--glass" href="/contact/">Contact options ${icons.arrow}</a>
        </div>
      </div>
    </section>`;

  return page({
    title: 'Home', path: '/', description: site.description, body,
    preloadImage: `${P}/portrait-720.webp`
  });
}

/* ----------------------------------------------------------------- ABOUT */
function about() {
  const body = `
    <section class="wrap hero" style="padding-bottom:1.5rem">
      <span class="eyebrow">About</span>
      <h1 style="font-size:var(--step-3);max-width:17ch">Digital marketing taught me the business. Then I went and <span class="grad">built the systems</span>.</h1>
    </section>

    <section class="wrap section" style="padding-top:2rem">
      <div class="about-split">
        <div class="about-photo reveal">
          <img
            src="${P}/working-960.webp"
            srcset="${P}/working-640.webp 640w, ${P}/working-960.webp 960w, ${P}/working-1400.webp 1400w"
            sizes="(max-width: 860px) 92vw, 480px"
            width="960" height="720" loading="lazy" decoding="async"
            alt="Gaurav Kumar Singh working at a desk">
        </div>
        <div class="prose reveal">
          <p class="lede">My career started in digital acquisition &mdash; SEO, performance marketing, demand generation. Over ten years it moved steadily down the stack: into the analytics that measure it, the CRM that manages what it produces, the automation that removes the manual handling, the platforms it all runs on, and now the AI applications on top.</p>
          <p>That path was not a plan. It was the consequence of repeatedly hitting the same wall. You cannot fix lead quality if the attribution is wrong. You cannot fix attribution if the measurement layer was never designed. You cannot fix the measurement layer if the website was built as a brochure. Each problem sat one level below the last, and solving it meant learning that level properly.</p>
        </div>
      </div>

      <div class="prose mt-lg" style="margin-top:3.5rem">
        <p>Today I lead digital transformation initiatives across four B2B industrial businesses &mdash; Bio &amp; Healthcare, Materials &amp; Semiconductor, Energy &amp; Environment, and Mobility. In practice that means the corporate web platform, a centralised lead management workflow spanning Power Automate, SharePoint and Salesforce, the GA4 and Looker Studio measurement architecture, employee experience digitisation on Microsoft 365, and a first AI-enabled customer-facing application.</p>

        <h2>What I am, and what I am not</h2>
        <p>I am not a data scientist and I do not claim to be. I have not trained a model and I would not position myself against someone who has.</p>
        <p>What I do is sit between business leadership and technical teams. Define the problem precisely. Design the solution. Choose the technology on fit and total cost rather than novelty. Drive it through delivery and the stakeholders who have to adopt it. Then instrument it, so the business can see what actually changed.</p>
        <p>Increasingly that includes building directly &mdash; prototyping, specifying and shipping with AI coding agents under version control. Not because I am a software engineer, but because the distance between <em>&ldquo;we should try this&rdquo;</em> and <em>working, governed software</em> has become short enough that one person who understands the business problem can now cross it. Knowing where that line sits, and where it does not, is a large part of the job now.</p>
      </div>
    </section>

    <section class="wrap section" style="padding-top:0">
      <div class="sec-head reveal"><div><h2>How I work</h2></div></div>
      <div class="panels">
        <div class="panel reveal">
          <div class="panel__icon">${icons.layers}</div>
          <h3>Use what you own</h3>
          <p>The question is rarely &ldquo;what should we buy?&rdquo; It is &ldquo;what does the organisation already have a licence for, and what could it do if someone designed a proper experience on top of it?&rdquo;</p>
        </div>
        <div class="panel reveal">
          <div class="panel__icon">${icons.compass}</div>
          <h3>Vocabulary before automation</h3>
          <p>Automating an ambiguous process just produces ambiguity faster, with a dashboard on top lending it false precision. Agreement is harder than the technology and matters more.</p>
        </div>
        <div class="panel reveal">
          <div class="panel__icon">${icons.gauge}</div>
          <h3>Measure the before-state</h3>
          <p>The baseline is free exactly once, before you start. After that it is gone permanently &mdash; and &ldquo;it improved&rdquo; is a much weaker claim than a number.</p>
        </div>
        <div class="panel reveal">
          <div class="panel__icon">${icons.spark}</div>
          <h3>Design the failure mode first</h3>
          <p>Especially with AI. Decide what the system is structurally incapable of doing before deciding what it should do. That is what gets it approved.</p>
        </div>
      </div>
    </section>

    <section class="wrap section" style="padding-top:0">
      <div class="sec-head reveal"><div><h2>Career</h2></div></div>
      <ul class="timeline">
        <li class="reveal">
          <div class="t-when">Nov 2024 &mdash; present</div>
          <div><div class="t-role">Deputy Manager, Digital Marketing Lead</div><div class="t-org">HORIBA India Pvt. Ltd.</div></div>
          <div class="t-note">Digital transformation, MarTech, automation and digital products across four B2B industrial businesses.</div>
        </li>
        <li class="reveal">
          <div class="t-when">Jul 2022 &mdash; Sep 2024</div>
          <div><div class="t-role">Performance Marketing Manager</div><div class="t-org">DigiClap Technologies</div></div>
          <div class="t-note">Full-funnel acquisition for a travel marketplace. 15&times; organic growth; rebuilt the measurement and attribution layer.</div>
        </li>
        <li class="reveal">
          <div class="t-when">May 2021 &mdash; May 2022</div>
          <div><div class="t-role">Senior Associate, Digital Marketing</div><div class="t-org">CARS24 Services Pvt. Ltd.</div></div>
          <div class="t-note">Partner-driven acquisition. Monthly vehicle inspections scaled from ~5,000 to ~15,000.</div>
        </li>
        <li class="reveal">
          <div class="t-when">Dec 2020 &mdash; May 2021</div>
          <div><div class="t-role">Digital Marketing Specialist</div><div class="t-org">Investors Clinic Infra Pvt. Ltd.</div></div>
          <div class="t-note">High-volume email, SMS and landing-page lead generation.</div>
        </li>
        <li class="reveal">
          <div class="t-when">Jun 2016 &mdash; Nov 2020</div>
          <div><div class="t-role">Digital Marketing Executive</div><div class="t-org">HelloTravel Online Pvt. Ltd.</div></div>
          <div class="t-note">Where it started &mdash; SEO, email marketing and digital campaigns.</div>
        </li>
      </ul>
    </section>

    <section class="wrap section" style="padding-top:0">
      <div class="sec-head reveal"><div><h2>Education</h2></div></div>
      <ul class="timeline">
        <li class="reveal">
          <div class="t-when">2022 &mdash; 2023</div>
          <div><div class="t-role">eMDP in Data Science &mdash; Data Science for Managers</div><div class="t-org">Indian Institute of Management (IIM) Kozhikode</div></div>
        </li>
        <li class="reveal">
          <div class="t-when">2014 &mdash; 2016</div>
          <div><div class="t-role">PGDM &mdash; Marketing &amp; Operations</div><div class="t-org">IMS Ghaziabad</div></div>
        </li>
        <li class="reveal">
          <div class="t-when">2010 &mdash; 2013</div>
          <div><div class="t-role">B.E. &mdash; Mechanical Engineering</div><div class="t-org">Visvesvaraya Technological University</div></div>
        </li>
      </ul>
    </section>

    <section class="wrap section" style="padding-top:0">
      <div class="sec-head reveal"><div><h2>Tools I work with</h2></div></div>
      <div class="panels">
        <div class="panel reveal"><h3>Analytics</h3><p>Google Analytics 4 &middot; Google Tag Manager &middot; Looker Studio &middot; Search Console &middot; Conversions API &middot; Attribution modelling</p></div>
        <div class="panel reveal"><h3>CRM &amp; MarTech</h3><p>Salesforce &middot; HubSpot &middot; Mailchimp &middot; Lead lifecycle design &middot; Marketing automation</p></div>
        <div class="panel reveal"><h3>Automation</h3><p>Microsoft Power Automate &middot; Microsoft 365 &middot; SharePoint &middot; Microsoft Forms &middot; Workflow design</p></div>
        <div class="panel reveal"><h3>Web &amp; product</h3><p>React &middot; Next.js &middot; Tailwind &middot; HTML/CSS &middot; PHP platforms &middot; Headless CMS &middot; Git &middot; Technical SEO</p></div>
        <div class="panel reveal"><h3>AI</h3><p>Claude &middot; ChatGPT &middot; Codex &middot; AI coding agents &middot; Retrieval-augmented assistants &middot; Evaluation &amp; guardrail design</p></div>
      </div>
    </section>`;

  return page({
    title: 'About', path: '/about/',
    description: 'Gaurav Kumar Singh — ten years from digital acquisition to enterprise digital transformation, automation and applied AI. Career, approach and tooling.',
    crumbs: [{ name: 'Home', href: '/' }, { name: 'About', href: '/about/' }],
    body
  });
}

/* ------------------------------------------------------------ WORK INDEX */
function workIndex(work) {
  const body = `
    <section class="wrap hero" style="padding-bottom:1rem">
      <span class="eyebrow">Work</span>
      <h1 style="font-size:var(--step-3);max-width:16ch">Case <span class="grad">studies</span></h1>
      <p class="hero__lede" style="margin-top:1.25rem">Six pieces of work that show the pattern: a business problem nobody had specified, a system designed to fix it, and an honest account of what changed &mdash; including what I would do differently.</p>
    </section>
    <section class="wrap section" style="padding-top:2.5rem">
      <div class="cards">
        ${work.map(cardFor).join('\n        ')}
      </div>
    </section>`;

  return page({
    title: 'Work', path: '/work/',
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
      <span class="eyebrow">${esc(w.tag)}</span>
      <h1>${esc(w.title)}</h1>
      <p class="lede">${esc(w.summary)}</p>
      <dl class="cs-meta reveal">
        <div><dt>Context</dt><dd>${esc(w.org)}</dd></div>
        <div><dt>Period</dt><dd>${esc(w.period)}</dd></div>
        <div><dt>My role</dt><dd>${esc(w.role)}</dd></div>
        <div><dt>Status</dt><dd>${esc(w.status)}</dd></div>
      </dl>
      ${stackList.length ? `<ul class="pill-list">${stackList.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
    </section>

    ${w.metrics && w.metrics.length ? `<section class="wrap" style="padding-top:2.5rem">${statTiles(w.metrics)}</section>` : ''}

    <section class="wrap section">
      <div class="prose">${w.html}</div>
    </section>

    <section class="wrap section" style="padding-top:0">
      <div class="sec-head reveal">
        <div><h2>More work</h2></div>
        <a class="sec-link" href="/work/">All case studies ${icons.arrow}</a>
      </div>
      <div class="cards">${others.map(cardFor).join('\n        ')}</div>
    </section>`;

  return page({
    title: w.title, path: `/work/${w.slug}/`, description: w.summary,
    ogType: 'article', navPath: '/work/',
    crumbs: [{ name: 'Home', href: '/' }, { name: 'Work', href: '/work/' }, { name: w.tag, href: `/work/${w.slug}/` }],
    body
  });
}

/* --------------------------------------------------------- WRITING INDEX */
function writingIndex(posts) {
  const body = `
    <section class="wrap hero" style="padding-bottom:1rem">
      <span class="eyebrow">Writing</span>
      <h1 style="font-size:var(--step-3);max-width:17ch">Notes on transformation, automation and <span class="grad">applied AI</span></h1>
      <p class="hero__lede" style="margin-top:1.25rem">Things I have learned building this work, written down while they are still specific enough to be useful.</p>
    </section>
    <section class="wrap section" style="padding-top:2.5rem">
      <div class="rows">${posts.map(rowFor).join('\n        ')}</div>
    </section>`;

  return page({
    title: 'Writing', path: '/writing/',
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
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: p.title, description: p.description,
    datePublished: p.date, dateModified: p.date,
    author: { '@type': 'Person', name: site.name, url: site.url },
    publisher: { '@type': 'Person', name: site.name, url: site.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.url}/writing/${p.slug}/` },
    keywords: tags.join(', ')
  };

  const body = `
    <article>
      <header class="wrap cs-head">
        <span class="eyebrow">${formatDate(p.date)} &middot; ${p.readingTime} min read</span>
        <h1>${esc(p.title)}</h1>
        <p class="lede">${esc(p.description)}</p>
        ${tags.length ? `<ul class="pill-list">${tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      </header>
      <div class="wrap section"><div class="prose">${p.html}</div></div>
    </article>
    ${others.length ? `<section class="wrap section" style="padding-top:0">
      <div class="sec-head reveal"><div><h2>More writing</h2></div><a class="sec-link" href="/writing/">All posts ${icons.arrow}</a></div>
      <div class="rows">${others.map(rowFor).join('\n        ')}</div>
    </section>` : ''}`;

  return page({
    title: p.title, path: `/writing/${p.slug}/`, description: p.description,
    ogType: 'article', navPath: '/writing/', schema: [articleSchema],
    crumbs: [{ name: 'Home', href: '/' }, { name: 'Writing', href: '/writing/' }, { name: p.title, href: `/writing/${p.slug}/` }],
    body
  });
}

/* --------------------------------------------------------------- CONTACT */
function contact() {
  const body = `
    <section class="wrap hero" style="padding-bottom:1rem">
      <span class="eyebrow">Contact</span>
      <h1 style="font-size:var(--step-3);max-width:14ch">Let&rsquo;s <span class="grad">talk</span></h1>
      <p class="hero__lede" style="margin-top:1.25rem">${esc(site.availability)}. I also enjoy talking to people working through a transformation, an automation programme, or how to adopt AI without ending up with an unreviewable black box.</p>
    </section>

    <section class="wrap section" style="padding-top:2.5rem">
      <div class="contact-grid">
        <a class="contact-card reveal" href="${site.linkedin}" rel="me noopener" target="_blank">
          <div class="contact-card__icon">${icons.linkedin}</div>
          <strong>LinkedIn</strong>
          <span>The fastest way to reach me &mdash; connect and message</span>
        </a>
        <a class="contact-card reveal" ${emailAttrs} href="/contact/">
          <div class="contact-card__icon">${icons.mail}</div>
          <strong>Email</strong>
          <span>${esc(site.emailDisplay)}</span>
        </a>
      </div>

      <div class="glass reveal" style="padding:clamp(1.75rem,4vw,2.5rem);margin-top:2.5rem">
        <h3 style="font-size:var(--step-1);margin-bottom:1rem">Email address</h3>
        <p class="muted small" style="margin-bottom:1.15rem;max-width:56ch">Written this way on purpose &mdash; it keeps the address out of the page source, away from scrapers. Copy it, or use the button and your mail client will open.</p>
        <div class="email-reveal" ${emailAttrs}>
          <span>${esc(site.emailDisplay)}</span>
          <button class="email-copy" type="button">Copy</button>
        </div>
      </div>

      <div class="prose mt-lg" style="margin-top:3rem">
        <h2>What I am looking for</h2>
        <p>Roles where the mandate is genuinely to change how something works &mdash; Digital Transformation, MarTech &amp; Automation, AI adoption, or digital product ownership. I am most useful in organisations that have real process pain, own more technology than they currently use well, and want someone who can specify the fix as precisely as they can describe the problem.</p>
        <p class="muted small">Based in ${esc(site.location)}. Open to roles in the NCR region and to remote or hybrid arrangements.</p>
      </div>
    </section>`;

  return page({
    title: 'Contact', path: '/contact/',
    description: `Get in touch with Gaurav Kumar Singh — ${site.availability.toLowerCase()}. LinkedIn, email and CV.`,
    crumbs: [{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact/' }],
    body
  });
}

/* ------------------------------------------------------------------- 404 */
function notFound() {
  const body = `
    <section class="wrap hero" style="min-height:50vh">
      <span class="eyebrow">404</span>
      <h1 style="font-size:var(--step-3);max-width:16ch">That page does not <span class="grad">exist</span>.</h1>
      <p class="hero__lede" style="margin-top:1.25rem">Which is itself a small failure of information architecture. Try one of these instead.</p>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--primary" href="/">Home ${icons.arrow}</a>
        <a class="btn btn--glass" href="/work/">Case studies</a>
        <a class="btn btn--glass" href="/writing/">Writing</a>
      </div>
    </section>`;
  return page({
    title: 'Page not found', path: '/404.html',
    description: 'That page does not exist on gauravsingh.co.in. Try the case studies, the writing, or the home page instead.',
    body
  });
}

/* ------------------------------------------------------- SUPPORT FILES */
const sitemap = urls => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${site.url}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const robots = () => `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;

const favicon = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4F46E5"/><stop offset="1" stop-color="#7C3AED"/>
  </linearGradient></defs>
  <rect width="64" height="64" rx="16" fill="url(#g)"/>
  <text x="32" y="43" font-family="Georgia, serif" font-size="32" font-weight="500" fill="#fff" text-anchor="middle">G</text>
</svg>
`;

const htaccess = () => `# gauravsingh.co.in — Hostinger (Apache)

Options -Indexes
DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On

${site.forceHttps ? `  RewriteCond %{HTTPS} !=on
  RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
` : `  # HTTPS redirect disabled: set forceHttps: true in src/site.mjs once the
  # SSL certificate is live, then rebuild.
`}
  RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
  RewriteRule ^(.*)$ ${site.forceHttps ? 'https' : 'http'}://%1/$1 [R=301,L]

  RewriteCond %{THE_REQUEST} \\s/+(.*/)?index\\.html[\\s?] [NC]
  RewriteRule ^(.*/)?index\\.html$ /$1 [R=301,L]
</IfModule>

ErrorDocument 404 /404.html

# --- Block the source tree -------------------------------------------------
# The built site and its source share one repository, and Hostinger checks the
# repository root out into public_html. These paths therefore exist on the web
# server; none of them should be reachable over HTTP.
RedirectMatch 404 ^/(src|content|scripts|node_modules|dist|\\.github|\\.git)(/|$)

<FilesMatch "^(package(-lock)?\\.json|README\\.md|\\.gitignore|.*\\.mjs|.*\\.md)$">
  <IfModule mod_authz_core.c>
    Require all denied
  </IfModule>
  <IfModule !mod_authz_core.c>
    Order allow,deny
    Deny from all
  </IfModule>
</FilesMatch>

# Deployment metadata should never be readable either.
<FilesMatch "^\\.(ftp-deploy-sync-state\\.json|htaccess|env)$">
  <IfModule mod_authz_core.c>
    Require all denied
  </IfModule>
  <IfModule !mod_authz_core.c>
    Order allow,deny
    Deny from all
  </IfModule>
</FilesMatch>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
${site.forceHttps ? '  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"\n' : ''}</IfModule>
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

  // Copy assets, excluding the multi-megabyte photo originals.
  await cp(path.join(ROOT, 'src/assets'), path.join(OUT, 'assets'), {
    recursive: true,
    filter: src => !path.basename(src).startsWith('source-')
  });

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
}

build().catch(e => { console.error(e); process.exit(1); });
