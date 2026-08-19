import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';

/* ---------------------------------------------------------------------------
   Minimal front-matter parser.
   Supports: `key: value`, list-of-scalars, and list-of-objects (two levels).
   Deliberately small — this site does not need a YAML engine.
--------------------------------------------------------------------------- */
function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };

  const data = {};
  const lines = m[1].split(/\r?\n/);
  let key = null;

  const unquote = v => {
    v = v.trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      return v.slice(1, -1);
    }
    return v;
  };

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const objItem = line.match(/^\s{2,}-\s+(\w+):\s*(.*)$/);   // "  - value: x"
    const objCont = line.match(/^\s{4,}(\w+):\s*(.*)$/);        // "    label: y"
    const scalarItem = line.match(/^\s{2,}-\s+(.*)$/);          // "  - thing"
    const topLevel = line.match(/^(\w[\w-]*):\s*(.*)$/);        // "key: value"

    if (objItem && key) {
      if (!Array.isArray(data[key])) data[key] = [];
      data[key].push({ [objItem[1]]: unquote(objItem[2]) });
    } else if (objCont && key && Array.isArray(data[key]) && typeof data[key].at(-1) === 'object') {
      data[key].at(-1)[objCont[1]] = unquote(objCont[2]);
    } else if (scalarItem && key) {
      if (!Array.isArray(data[key])) data[key] = [];
      data[key].push(unquote(scalarItem[1]));
    } else if (topLevel) {
      key = topLevel[1];
      const val = topLevel[2].trim();
      data[key] = val === '' ? [] : unquote(val);
    }
  }

  // Type coercion for the few fields that need it.
  for (const k of ['order']) if (data[k] !== undefined) data[k] = Number(data[k]);
  for (const k of ['featured', 'draft']) if (data[k] !== undefined) data[k] = data[k] === 'true' || data[k] === true;

  return { data, body: m[2] };
}

marked.setOptions({ mangle: false, headerIds: true, gfm: true, breaks: false });

// Wrap tables so wide content scrolls inside itself rather than the page.
// Done as post-processing rather than a renderer override: overriding
// renderer.table detaches `this` from the parser and breaks on table cells.
export function md(body) {
  return marked
    .parse(body.trim())
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, '</table></div>');
}

export function readingTime(body) {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export async function loadCollection(dir) {
  let files;
  try {
    files = (await readdir(dir)).filter(f => f.endsWith('.md'));
  } catch {
    return [];
  }
  const items = [];
  for (const file of files.sort()) {
    const raw = await readFile(path.join(dir, file), 'utf8');
    const { data, body } = parseFrontMatter(raw);
    if (data.draft) continue;
    // Slug falls back to the filename with any leading date or order prefix stripped.
    const slug = data.slug || file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/^\d+-/, '');
    items.push({ ...data, slug, body, html: md(body), file, readingTime: readingTime(body) });
  }
  return items;
}
