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
| `npm run zip` | Builds and packages `dist/site.zip` for upload |

## Where things live

```
content/work/       One Markdown file per case study
content/writing/    One Markdown file per post
src/site.mjs        Name, email, LinkedIn, nav — edit here, rebuild
src/layout.mjs      The HTML shell: meta tags, schema, header, footer
src/assets/         CSS, JS, images, CV PDF (copied to public/ on build)
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

## Deploying to Hostinger

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
