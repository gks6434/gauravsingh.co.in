#!/usr/bin/env node
// Builds, then zips the contents of /public into dist/site.zip for Hostinger upload.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist');

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// -r recurse, -q quiet, -X strip macOS extras. Runs inside public/ so paths are relative.
execFileSync('zip', ['-rqX', path.join(OUT, 'site.zip'), '.'], { cwd: path.join(ROOT, 'public') });

console.log('Created dist/site.zip');
console.log('Upload it to Hostinger public_html and "Extract" it there.');
console.log('Remember: enable "Show hidden files" so .htaccess is visible after extracting.');
