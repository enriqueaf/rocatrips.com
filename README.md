# Rocatrips

Static website for Rocatrips, guided rock climbing in Tenerife. Built with [Astro](https://astro.build), hosted on Cloudflare Pages, with bookings through Kinecall.

The full information architecture and SEO strategy are in [docs/information-architecture.md](docs/information-architecture.md).

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321 (shows draft pages) |
| `npm run build` | Build the static site to `dist/` (drafts excluded) |
| `npm run preview` | Preview the production build |
| `npm run todos` | List every content gap still marked TODO |

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

## Deploying to Cloudflare Pages (free)

1. Push this repo to GitHub.
2. In Cloudflare: Workers & Pages → Create → Pages → Connect to Git.
3. Framework preset **Astro**, build command `npm run build`, output directory `dist`.
4. Add the custom domain (rocatrips.com).
5. **Important:** check Cloudflare's *AI Crawl Control* settings. Cloudflare can block AI crawlers by default, which would undo the `robots.txt` above.

`public/_headers` and `public/_redirects` hold Cloudflare's header and redirect rules.
