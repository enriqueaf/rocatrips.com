# Rocatrips

Static website for Rocatrips, guided rock climbing in Tenerife. Built with [Astro](https://astro.build), hosted on Cloudflare Workers (static assets), with bookings through Kinecall.

The full information architecture and SEO strategy are in [docs/information-architecture.md](docs/information-architecture.md).

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321 (shows draft pages) |
| `npm run build` | Build the static site to `dist/` (drafts excluded) |
| `npm run preview` | Preview the production build |
| `npm run todos` | List every content gap still marked TODO |
| `npm run verify` | Type-check, build and test. Run before pushing |
| `npm test` | Test the built site in `dist/` ([tests/site.test.mjs](tests/site.test.mjs)): links, images and alt text, SEO tags, JSON-LD, sitemap, redirects, Markdown twins, home sections |

## How the site is organised

Every page is a Markdown file in `src/content/`. A single route, `src/pages/[...slug].astro`, renders each file at the URL in its `path` field, so adding a page needs no code.

```
src/content/
  pages/{en,es,de}/        Home, hubs, plan-your-trip, about, faq, legal…
  experiences/{en,es,de}/  Bookable offerings (one page each, linked to Kinecall)
  areas/{en,es,de}/        Crag guides
  guides/{en,es,de}/       Long-form articles
src/site.config.ts         Business facts (name, contact, location, Kinecall URL)
src/i18n.ts                Languages, UI strings, navigation
src/content.config.ts      Fields each content type requires
```

Key frontmatter fields:
- `path`: the URL. English pages are at the root; others start with `/es/` or `/de/`. Translated slugs are encouraged (`/es/escalada-tenerife/`).
- `translationKey`: the same value across languages links translations. It drives hreflang, the language switcher and navigation.
- `title` / `description`: the SEO title (primary keyword first, ~60 chars) and meta description (≤170 chars).
- `faq`: question and answer pairs, rendered on the page and emitted as FAQPage structured data.
- `draft: true`: visible in `npm run dev`, excluded from the build and sitemap.

The build fails on duplicate URLs, or when two pages share a language and translationKey.

## SEO and AI-visibility built in

- Canonical, hreflang and x-default on every page
- JSON-LD: LocalBusiness (sitewide), BreadcrumbList, TouristTrip + Offer (experiences; Offer only when a price is set), TouristAttraction (areas), Article (guides), FAQPage
- `sitemap-index.xml` generated automatically
- `robots.txt` that explicitly allows search engines and AI crawlers

### Files for AI assistants (generated at build time from content, never edited by hand)

| URL | What it is |
|---|---|
| `/llms.txt` | Entry point for AIs ([llmstxt.org](https://llmstxt.org) format): summary, key facts, all pages with descriptions, common questions |
| `/llms-full.txt` | All English pages as Markdown in one file (`noindex` for Google, to avoid duplicate content) |
| `/<any-page>/index.md` | Markdown version of each page, advertised with `<link rel="alternate" type="text/markdown">`; its canonical header points to the HTML page |

Anything containing `TODO` is left out of these files automatically, so placeholders never reach an AI. Business facts in `llms.txt` come from `src/site.config.ts`. Fill those in and they appear.
- Zero client-side JavaScript: all content is in the HTML, which matters for AI crawlers that don't run JS
- Booking links carry UTM tags (`utm_campaign` = the page's translationKey)

## Deploying to Cloudflare Workers (free)

Every push or merge to `main` deploys the site to production through GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)): `npm ci`, `astro check`, `npm run build`, `npm test`, then `wrangler deploy`. If any check fails, nothing is deployed. Pull requests run the same checks without deploying. You can also start a deploy by hand from the Actions tab.

The site is a static-assets-only Worker ([wrangler.jsonc](wrangler.jsonc)) with no Worker script, so it runs on the **Workers Free plan**: requests for static assets are free and unlimited.

One-time setup:

1. In Cloudflare, create an API token from the **Edit Cloudflare Workers** template.
2. In GitHub: Settings → Secrets and variables → Actions, add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (shown on the Workers & Pages overview).
3. After the first deploy, add the custom domain: Workers & Pages → rocatrips → Settings → Domains & Routes → add `rocatrips.com`.
4. **Important:** check Cloudflare's *AI Crawl Control* settings. Cloudflare can block AI crawlers by default, which would undo the `robots.txt` above.

To deploy from your machine instead, run `npm run deploy` (asks you to log in with `npx wrangler login` the first time).

`public/_headers` and `public/_redirects` hold the header and redirect rules; Workers static assets applies them the same way Pages did.
