#!/usr/bin/env node
// Create a new writing post:  npm run new:post -- "Your title here"
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const title = process.argv.slice(2).join(' ').trim();

if (!title) {
  console.error('Usage: npm run new:post -- "Your title here"');
  process.exit(1);
}

const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 60);
const date = new Date().toISOString().slice(0, 10);
const file = path.join(ROOT, 'content/writing', `${date}-${slug}.md`);

await writeFile(file, `---
title: ${title}
description: One sentence that makes someone want to read this. Shows in search results and on the writing index.
date: ${date}
tags: Digital Transformation
---

Write here. Markdown works: **bold**, [links](/work/), lists, > quotes, and \`code\`.

## A subheading

Body text.

---

*I write about digital transformation, enterprise automation and applied AI.
[Get in touch](/contact/) if you are working on something similar.*
`, { flag: 'wx' });

console.log(`Created content/writing/${date}-${slug}.md`);
console.log(`Slug will be: /writing/${slug}/  (change the "slug" line if you want a different URL)`);
console.log(`Then run:  npm run build`);
