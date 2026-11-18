// Checks the built site in dist/ (run `npm run build` first, or `npm run verify`).
// Uses only Node's built-in test runner: `node --test tests/`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
assert.ok(existsSync(join(DIST, 'index.html')), 'dist/ is missing: run `npm run build` first');

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const files = walk(DIST);
const pages = files.filter((f) => f.endsWith('.html'));
const contentPages = pages.filter((f) => !f.endsWith('404.html'));
const read = (f) => readFileSync(f, 'utf8');
const url = (f) => '/' + relative(DIST, f).replace(/index\.html$/, '');

/** Does a root-relative URL resolve to a file in dist/? */
function resolves(href) {
  const path = decodeURI(href.split(/[?#]/)[0]);
  if (path === '' || path === '/') return existsSync(join(DIST, 'index.html'));
  const p = join(DIST, path);
  if (path.endsWith('/')) return existsSync(join(p, 'index.html'));
  return existsSync(p) && statSync(p).isFile();
}

test('every page has the basic SEO tags', () => {
  for (const f of contentPages) {
    const html = read(f);
    const where = url(f);
    assert.match(html, /<html lang="(en|es|de)"/, `${where}: <html lang>`);
    assert.match(html, /<title>[^<]{10,}<\/title>/, `${where}: <title>`);
    assert.match(html, /<meta name="description" content="[^"]{30,}"/, `${where}: meta description`);
    assert.match(html, /<link rel="canonical" href="https:\/\/[^"]+\/"/, `${where}: canonical`);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${where}: exactly one <h1>`);
  }
});

test('JSON-LD blocks are valid JSON with a schema.org context', () => {
  for (const f of contentPages) {
    const blocks = [...read(f).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.ok(blocks.length > 0, `${url(f)}: no JSON-LD`);
    for (const [, json] of blocks) {
      const data = JSON.parse(json);
      assert.equal(data['@context'], 'https://schema.org', `${url(f)}: @context`);
    }
  }
});

test('every image has an alt attribute and a working src', () => {
  for (const f of pages) {
    for (const [tag] of read(f).matchAll(/<img\b[^>]*>/g)) {
      assert.match(tag, /\balt(="|[\s>])/, `${url(f)}: <img> without alt: ${tag.slice(0, 120)}`);
      const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
      assert.ok(src, `${url(f)}: <img> without src`);
      if (src.startsWith('/')) assert.ok(resolves(src), `${url(f)}: missing image ${src}`);
    }
    for (const [, set] of read(f).matchAll(/\bsrcset="([^"]+)"/g)) {
      for (const candidate of set.split(',')) {
        const src = candidate.trim().split(/\s+/)[0];
        if (src.startsWith('/')) assert.ok(resolves(src), `${url(f)}: missing srcset image ${src}`);
      }
    }
  }
});

test('internal links point to existing pages and files', () => {
  const broken = [];
  for (const f of pages) {
    for (const [, href] of read(f).matchAll(/\b(?:href|src)="(\/(?!\/)[^"]*)"/g)) {
      if (!resolves(href)) broken.push(`${url(f)} → ${href}`);
    }
  }
  assert.deepEqual(broken, [], `Broken internal links:\n${broken.join('\n')}`);
});

test('internal links in content use a trailing slash', () => {
  const bad = [];
  for (const f of contentPages) {
    for (const [, href] of read(f).matchAll(/<a\b[^>]*\bhref="(\/(?!\/)[^"#?]*)"/g)) {
      if (!href.endsWith('/') && !/\.\w+$/.test(href)) bad.push(`${url(f)} → ${href}`);
    }
  }
  assert.deepEqual(bad, [], `Links without trailing slash (cause redirects):\n${bad.join('\n')}`);
});

test('every page has a Markdown twin without placeholders', () => {
  for (const f of contentPages) {
    const md = f.replace(/index\.html$/, 'index.md');
    assert.ok(existsSync(md), `${url(f)}: missing index.md`);
    const text = read(md);
    assert.match(text, /^# .+/, `${url(f)}: index.md has no title`);
    assert.doesNotMatch(text, /TODO/i, `${url(f)}: index.md contains TODO`);
  }
});

test('llms.txt files exist and contain no placeholders', () => {
  for (const name of ['llms.txt', 'llms-full.txt']) {
    const text = read(join(DIST, name));
    assert.ok(text.length > 500, `${name} is too short`);
    assert.doesNotMatch(text, /TODO/i, `${name} contains TODO`);
  }
});

test('sitemap lists only pages that exist', () => {
  const xml = read(join(DIST, 'sitemap-0.xml'));
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  assert.ok(locs.length > 10, 'sitemap is nearly empty');
  for (const p of locs) assert.ok(resolves(p), `sitemap URL has no page: ${p}`);
  assert.equal(locs.length, contentPages.length, 'every built page should be in the sitemap');
});

test('redirect targets exist', () => {
  const lines = read(join(DIST, '_redirects')).split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  for (const line of lines) {
    const [from, to] = line.trim().split(/\s+/);
    if (to.startsWith('/')) assert.ok(resolves(to), `_redirects: ${from} → ${to} goes to a missing page`);
  }
});

test('home page renders its key sections', () => {
  const html = read(join(DIST, 'index.html'));
  assert.match(html, /class="hero hero--full/, 'hero');
  assert.match(html, /class="stats"/, 'stats band');
  assert.match(html, /id="experiences"/, 'experience cards');
  assert.match(html, /class="promo"/, 'promo tile');
  assert.match(html, /class="tiles"/, 'Tenerife photo tiles');
  assert.match(html, /class="reasons/, 'why-us section');
  assert.match(html, /aria-label="[^"]*" class="cta"|class="cta"/, 'closing CTA');
  const cards = (html.match(/<li class="card"/g) ?? []).length;
  const experiences = readdirSync(new URL('../src/content/experiences/en/', import.meta.url)).filter((f) => f.endsWith('.md')).length;
  assert.equal(cards, experiences, 'one card per English experience');
});

test('production build hides dev-only placeholders', () => {
  for (const f of contentPages) {
    const html = read(f);
    assert.doesNotMatch(html, /<body class="dev"/, `${url(f)}: built in dev mode`);
    // Trust-bar facts that aren't confirmed must be left out, not hidden.
    assert.doesNotMatch(html, /<li class="todo"/, `${url(f)}: trust-bar TODO leaked`);
  }
});
