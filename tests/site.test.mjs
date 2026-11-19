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
    assert.match(html, /<html[^>]* lang="(en|es|de)"/, `${where}: <html lang>`);
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

test('Iconoir icons render as inline SVG', () => {
  const html = read(join(DIST, 'climbing-tenerife/beginners/index.html'));
  const icons = html.match(/<svg class="icon[^"]*"[^>]*aria-hidden="true"/g) ?? [];
  assert.ok(icons.length >= 10, `expected icons on experience page, found ${icons.length}`);
  assert.doesNotMatch(html, /<svg class="icon[^>]*>\s*<\/svg>/, 'empty icon');
});

test('Markdown tables are styled content, not raw pipes', () => {
  const html = read(join(DIST, 'plan-your-trip/best-time-to-climb-tenerife/index.html'));
  assert.match(html, /<div class="prose"[^>]*>[\s\S]*<table>[\s\S]*<thead>/, 'table rendered inside .prose');
  assert.doesNotMatch(html, /\|---\|/, 'unrendered Markdown table');
});

test('page transitions are enabled', () => {
  const html = read(join(DIST, 'index.html'));
  assert.match(html, /<meta name="astro-view-transitions-enabled"/, 'ClientRouter in <head>');
  assert.match(html, /<html[^>]*data-astro-transition-scope=/, 'root page transition');
});

test('Book links go to Kinecall and FAQ accordions animate', () => {
  const html = read(join(DIST, 'index.html'));
  assert.match(html, /href="https:\/\/rocatrips-9-dtg\.kinecall\.com\/\?utm_source=rocatrips\.com/, 'Kinecall booking link');
  const js = files.filter((f) => f.endsWith('.js')).map(read).join('') + html;
  assert.match(js, /\.faq summary/, 'accordion animation script');
});

const mainNavLinks = (html) => {
  const menu = (html.match(/<nav class="menu"[^>]*aria-label="Main"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '').replace(/<div class="sub"[\s\S]*?<\/div>/g, '');
  return [...menu.matchAll(/<li[^>]*><a href="([^"]+)"([^>]*)>/g)].map(([, href, attrs]) => ({ href, current: /aria-current/.test(attrs) }));
};

test('main nav merges areas and guides into Plan your trip; contact is in the footer', () => {
  const html = read(join(DIST, 'index.html'));
  assert.deepEqual(mainNavLinks(html).map((l) => l.href), ['/climbing-tenerife/', '/plan-your-trip/', '/about/']);
  const footer = html.match(/<footer class="site-footer">([\s\S]*?)<\/footer>/)?.[1] ?? '';
  assert.match(footer, /href="\/contact\/"/, 'footer links to contact');
  assert.match(footer, /href="mailto:/, 'footer shows email');
});

test('Experiences has a submenu with "see all" and every experience', () => {
  const html = read(join(DIST, 'index.html'));
  const sub = html.match(/<div class="sub" id="sub-experiences"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';
  assert.match(sub, /class="sub-back"/, 'back button');
  assert.match(sub, /<a class="sub-all"[^>]*href="\/climbing-tenerife\/"/, 'see all link');
  const links = [...sub.matchAll(/<li><a href="([^"]+)"/g)].map(([, h]) => h);
  assert.ok(links.length >= 6, `expected 6+ experiences, found ${links.length}`);
  assert.ok(links.includes('/climbing-tenerife/beginners/'), 'beginners in submenu');
});

test('Plan your trip hub lists areas, planning topics and guides', () => {
  const html = read(join(DIST, 'plan-your-trip/index.html'));
  for (const id of ['areas', 'planning', 'guides'])
    assert.match(html, new RegExp(`<section[^>]*id="${id}"[^>]*>[\\s\\S]*?<ul class="cards"`), `#${id} section with cards`);
  assert.match(html, /href="\/climbing-areas\/"/, 'links to the crag table');
  assert.ok(!existsSync(join(DIST, 'guides/index.html')), '/guides/ hub removed');
  assert.match(read(new URL('../public/_redirects', import.meta.url).pathname), /^\/guides\/ \/plan-your-trip\/ 301$/m);
});

test('area and guide pages highlight Plan your trip in the nav', () => {
  for (const p of ['climbing-areas/index.html', 'climbing-areas/arico/index.html', 'guides/climbing-in-tenerife/index.html']) {
    const current = mainNavLinks(read(join(DIST, p))).filter((l) => l.current).map((l) => l.href);
    assert.deepEqual(current, ['/plan-your-trip/'], p);
  }
});
