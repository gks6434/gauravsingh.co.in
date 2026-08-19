# gauravsingh.co.in

Personal site for Gaurav Kumar Singh. Static HTML generated from Markdown — no database,
no CMS, no runtime dependencies on the server. Hostinger just serves files.

## Commands

| Command | What it does |
|---|---|
| `npm run build` | Generates `public/` from `content/` |
| `npm run dev` | Builds, then serves at http://localhost:4321 |
| `npm run new:post -- "Post title"` | Creates a new Markdown post in `content/writing/` |
| `npm run og` | Regenerates the social share image and touch icon |
| `npm run images` | Rebuilds responsive WebP variants from the source photos |
| `npm run validate` | Structure, links, privacy and confidentiality checks |
| `npm run verify` | `build` + `validate` — what CI runs before deploying |
| `npm run zip` | Builds and packages `dist/site.zip` for manual upload |

## Where things live

```
content/work/       One Markdown file per case study
content/writing/    One Markdown file per post
src/site.mjs        Name, email, LinkedIn, nav — edit here, rebuild
src/layout.mjs      The HTML shell: meta tags, schema, header, footer
src/assets/         CSS, JS, images, CV PDF (copied to public/ on build)
src/assets/img/photos/  source-*.png are the originals — NEVER shipped,
                    the build filters them out. Run `npm run images` after
                    replacing one to regenerate the .webp variants.
public/             GENERATED. Never edit by hand — it is wiped every build.
```

## Publishing a new post

```bash
npm run new:post -- "Agree the vocabulary before you automate"
# edit the file it creates in content/writing/
npm run build
npm run zip     # then upload, or just upload the changed folder
```

The URL comes from the filename with the date prefix stripped, unless you set
`slug:` in the front matter. Sitemap and the writing index update automatically.

## The CV download

There is currently **no CV on the site**. The previous PDF contained a phone
number and a plain email address, which contradicts the contact policy below.
When a redacted CV exists, drop it in `src/assets/files/`, add its public path
to `ALLOWED_PDFS` in `scripts/validate.mjs`, and restore the contact card in
`scripts/build.mjs` and the footer link in `src/layout.mjs`.

`npm run validate` fails if any PDF is shipped without being allowlisted, so
this cannot happen by accident again.

## Automatic deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the
site, runs the validation suite, and uploads only the changed files to
`public_html` over FTPS. A pull request runs build + validate but does not deploy.

Required repository **secrets** (Settings → Secrets and variables → Actions):

| Secret | Value |
|---|---|
| `FTP_SERVER` | Hostinger FTP hostname or IP, from hPanel → Files → FTP Accounts |
| `FTP_USERNAME` | FTP username from the same screen |
| `FTP_PASSWORD` | FTP password (set or reset it there) |

Optional repository **variables**, only if the defaults do not fit:

| Variable | Default | When to change |
|---|---|---|
| `FTP_SERVER_DIR` | `public_html/` | If your FTP user lands somewhere other than the account root |
| `FTP_PROTOCOL` | `ftps` | Set to `ftp` if FTPS negotiation fails |
| `FTP_PORT` | `21` | Rarely needed |

The first deploy uploads everything; later ones transfer only what changed,
tracked by a state file the action keeps on the server. `.htaccess` blocks that
file from public access.

## Deploying by hand (fallback)

**One time — connect the domain (bought at GoDaddy, hosted at Hostinger):**

1. In Hostinger hPanel, add `gauravsingh.co.in` as a website. hPanel will show you two
   nameservers (usually `ns1.dns-parking.com` and `ns2.dns-parking.com`).
2. In GoDaddy: *My Products → Domain → DNS → Nameservers → Change → I'll use my own*,
   and enter the two Hostinger nameservers.
3. Wait for propagation (usually 1–4 hours, occasionally up to 24).
4. Back in hPanel, enable the free SSL certificate for the domain.

**Every deploy:**

1. `npm run zip`
2. hPanel → File Manager → `public_html`
3. Delete the old contents, upload `dist/site.zip`, right-click → Extract
4. **Turn on "Show hidden files"** in File Manager and confirm `.htaccess` is present —
   it handles HTTPS redirects, the www redirect, caching, compression and security headers.

**After the first deploy:**

- Submit `https://gauravsingh.co.in/sitemap.xml` in Google Search Console
- Test the share card at the LinkedIn Post Inspector
- Run PageSpeed Insights on the home page

## Notes

- No analytics, no cookies, no consent banner. If you add GA4 later, put the tag in
  `src/layout.mjs` so every page picks it up on rebuild — and then you *will* need a
  cookie notice.
- The stylesheet is one file, `src/assets/css/style.css`. Colours are CSS variables at
  the top; change `--accent` to re-skin the whole site.


## Contact details — deliberate choices

The site carries **no phone number** and the email address never appears as
plain text in the served HTML. `/contact/` shows `gks.6434 [at] gmail.com`
visually, and `src/assets/js/main.js` joins `data-user` + `data-domain` at
runtime to build the `mailto:` link. Scrapers reading the HTML source find
nothing to harvest; a human gets a working link and a copy button.

The Person schema deliberately omits `email` and `telephone` for the same reason.
LinkedIn is the primary contact route.

## Confidentiality

Case studies describe **scope, architecture and outcome** — not employer project
names, event names or internal system names. The current employer appears only in
the career timeline on `/about/` (the same information already on the CV and
LinkedIn). If you ever want that removed too, edit the timeline in
`scripts/build.mjs`.

Before publishing a new case study, re-read it and ask: could a competitor learn
something specific from this that they could not learn from the job title alone?
If yes, generalise it.

## Design system

Glassmorphism on white, from the `ui-ux-pro-max` design database (Portfolio Grid
pattern, Glassmorphism style, stagger-reveal motion).

The palette rule that matters: **pastels carry the atmosphere, never the
information.** The aurora blobs and icon tiles are pastel; every piece of text
sits in near-black or indigo on high-opacity glass. All text pairs measured at
5.4:1 or better against WCAG AA's 4.5:1.

Colours are CSS custom properties at the top of `src/assets/css/style.css`.
Change `--accent` and the `--pastel-*` values to re-skin the whole site.
