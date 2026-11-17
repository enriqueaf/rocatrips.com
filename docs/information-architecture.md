# Rocatrips — Information Architecture v0.1

Static site, hosted on Cloudflare Pages (free), bookings handled by Kinecall. Goals: rank on Google for "climbing Tenerife" intent searches and be cited by AI assistants (ChatGPT, Perplexity, Gemini, Google AI Overviews).

## 1. Research findings

### Ocho Escalada (ocho-escalada.com) — the main reference
Note: climbingintenerife.com serves the same site, so "Ocho Climbing" and "Climbing in Tenerife" are one competitor with two domains. WordPress + WooCommerce-style shop, ES/EN.

Their nav tree:
- About us
- Climbing → Sport (Initiation / Intermediate / Advanced), Traditional (Initiation / Intermediate / Advanced), Boulder (sessions, camps), Deep water soloing
- Canyoning → levels 1–3 plus workshops
- Activities → guided sport trips, guided multi-pitch trad, tailored trips, schools and clubs, birthday climbing
- Climbing trips (all-inclusive packages)
- Climbing topos → Association, re-bolting, new areas
- Hostel (Tenerife Climbing House)
- Contact

What they do well:
- Skill-level taxonomy (initiation / intermediate / advanced) makes it easy for visitors to self-select.
- Each offering has its own page (`/item/...`), so each can rank for its own keyword.
- Combine services (school, hostel, trips, topos) into a single local authority.
- Third-party presence: listed on Yumping, GetYourGuide-style marketplaces, and UKClimbing.

Weaknesses we can beat:
- Dated site, little structured content for answers ("how hard is Arico?", "best time to climb").
- Many near-duplicate product pages (several "performance coaching" and "multi-pitch" URLs).
- Marketplace listings are outdated (e.g. 2018 prices on Yumping), which leaves a gap for an accurate source.
- No crag/location guide content on the school pages. Most topo info lives on theCrag, 27crags and guidebooks.

### Other players and info sources
- Marketplaces (GetYourGuide/Clicatour-type listings, Manawa, Yumping): "Guided rock climbing Tenerife" tours, about 4 h, from roughly €75–100, meeting points in Arico Viejo or Adeje. They own the generic search terms today.
- theCrag, 27crags, TheTopo: crag databases that dominate informational queries ("Arico climbing topo"). We link to them and do not compete on route data.
- Guidebooks: *Tenerife Sport Climbing* (Desnivel, 2023; about 1,300 routes) and *Escalada en Tenerife*. Useful as authority citations.
- Turismo de Tenerife (webtenerife) has an official climbing page.

### Facts to use in content (verify before publishing)
- Arico is the island's main sport-climbing hub. Sources cite 250+ bolted routes there, with short walk-ins.
- Los Gigantes: climbing restricted or banned in the protected area. Do not promote it.
- Some crags (e.g. Guaria) need a permit or registration.
- Public transport to crags is poor, so transfers are a selling point.

## 2. Positioning

Rocatrips = small-group guided climbing and climbing experiences in Tenerife, with a strong photo identity. Competing on "guided climbing day in Tenerife" and "learn to climb in Tenerife", not on the school/hostel/canyoning breadth that Ocho offers. Start narrow, then expand.

Assumption to confirm: offering is "similar" to Ocho, so I'm assuming guided sport climbing days, intro/beginner days, multi-pitch, private guiding, and courses. Canyoning, hostel and bouldering are marked "later" below.

## 3. Sitemap

Languages: EN (default, `/`), ES (`/es/`), DE (`/de/`). Add FR/NL/SV later based on booking data. Each language has full translations and `hreflang`, with no machine-translated duplicates.

```
/                                   Home
/climbing-tenerife/                 Hub: all experiences (listing, filter by level)
  /climbing-tenerife/beginners/            "Learn to climb in Tenerife" (First Contact day)
  /climbing-tenerife/guided-sport-climbing/  Guided day, intermediate+
  /climbing-tenerife/multi-pitch/          Multi-pitch guided routes
  /climbing-tenerife/private-guiding/      Private / tailored day
  /climbing-tenerife/courses/              Lead, safety, technique courses
  /climbing-tenerife/families-kids/        Families and groups (kids climbing)
  (later) /bouldering/ /deep-water-soloing/ /canyoning/ /climbing-week/
/climbing-areas/                    Hub: crag guide (our own editorial)
  /climbing-areas/arico/
  /climbing-areas/<other-area>/     one page per area we actually guide in
/plan-your-trip/
  /plan-your-trip/best-time-to-climb-tenerife/
  /plan-your-trip/grades-and-levels/        What 5c/6a means, which experience fits
  /plan-your-trip/what-to-bring/
  /plan-your-trip/getting-there-and-transfers/
  /plan-your-trip/safety-and-guides/        Certifications, insurance, group size, ratios
  /plan-your-trip/climbing-rules-and-access/ Permits, restricted areas, ethics
  /plan-your-trip/where-to-stay/
/guides/                            Blog / long-form (see §6)
/about/                             Team, guide qualifications, story
/gallery/                           Photos (reuses the same image set)
/reviews/                           Testimonials (+ Tripadvisor/Google links)
/faq/                               Global FAQ
/contact/
/book/                              Entry to Kinecall (per-experience deep links preferred)
/legal/ (privacy, terms, cancellation, cookies)
```

Depth rule: no page is more than 3 clicks from home, and every experience has exactly one canonical URL (avoid Ocho's duplicate-page problem).

## 4. Page templates

**Experience page** (core money page, one per offering)
1. H1 with primary keyword, e.g. "Guided Rock Climbing in Tenerife — Half Day"
2. Key facts block: duration, price from, group size, level, languages, meeting point, season, what's included
3. Hero photo + gallery
4. Book button → Kinecall for this experience
5. What you'll do (itinerary)
6. Who it's for / not for
7. What's included / what to bring
8. Where (link to area page)
9. Safety and guide info
10. FAQ (5–8 real questions, FAQPage schema)
11. Reviews
12. Related experiences

**Area page**: overview, access and parking, grades distribution, best season, aspect and sun, nearest services, rules, "climb here with us" CTA, link to theCrag/guidebook.

**Guide/blog page**: direct answer in the first 2–3 sentences, then detail, then CTA to a relevant experience.

**Home**: value proposition, 3–4 experience cards, trust signals (certified guides, reviews, group size), areas, FAQ snippet, strong photography.

## 5. Booking flow (Kinecall)

- Each experience page links straight to its own Kinecall booking page (deep link, new tab or embedded widget if Kinecall supports it). Confirm what Kinecall offers: iframe/widget, per-product URLs, availability feed, languages, UTM passthrough.
- Sitewide sticky "Book" CTA. `/book/` is a chooser page listing experiences, so it isn't a dead end.
- Cancellation, weather and refund policy shown on the site, not only in Kinecall.
- Tracking: Cloudflare Web Analytics (free, no cookies) plus UTM tags on Kinecall links. Booking conversion can't be fully measured if the checkout is on another domain, so check whether Kinecall supports a conversion callback or GA.

## 6. SEO strategy

**Keyword map** (validate volumes with Search Console or Ahrefs/Semrush before locking in):

| Intent | Target page | Example queries |
|---|---|---|
| Commercial | Hub / guided sport | rock climbing Tenerife, guided climbing Tenerife, climbing tour Tenerife |
| Beginner | Beginners | learn to climb Tenerife, climbing for beginners Tenerife, climbing lesson Tenerife |
| Advanced | Multi-pitch | multi-pitch Tenerife, trad climbing Tenerife |
| Informational | Area pages | Arico climbing, best crags Tenerife, climbing Tenerife grades |
| Planning | Plan pages | best time to climb Tenerife, climbing Tenerife in winter, is climbing safe in Tenerife |
| Localised | ES/DE versions | escalada Tenerife, Klettern Teneriffa, Klettern für Anfänger Teneriffa |

Tenerife's winter season (Oct–Apr) is the climbing peak for Northern Europeans, so seasonal content ("climbing Tenerife in December/January") is a strong opportunity.

**Technical (all free on Cloudflare Pages)**
- Static generator: Astro (recommended; content collections, i18n routing, image optimisation, zero JS by default) or Eleventy.
- Core Web Vitals: serve AVIF/WebP, responsive `srcset`, lazy loading except hero. The photos are the main performance risk.
- Clean URLs, canonical tags, `hreflang`, auto-generated `sitemap.xml`, `robots.txt`.
- Structured data (JSON-LD): `LocalBusiness`/`TouristInformationCenter`-style org with address and geo, `TouristTrip` or `Product` + `Offer` per experience, `FAQPage`, `BreadcrumbList`, `Review`/`AggregateRating` (only with real reviews), `Person` for guides, `ImageObject`.
- Open Graph and Twitter cards with the best photos.
- Google Business Profile (the most important off-site asset for local pack results), plus Tripadvisor, Google Maps and UKClimbing/theCrag listings with the same NAP (name, address, phone) data.

**AI visibility (GEO)**
- Write for extraction: concise, factual answers at the top of each page, key facts in tables or lists, explicit numbers (price, duration, group size, grade ranges), dated "last updated".
- Allow AI crawlers in `robots.txt` (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended). Cloudflare's "AI Crawl Control" / managed robots can block them by default, so check this setting in the dashboard.
- Add `/llms.txt` with a short summary of the site and links to key pages. Support is not confirmed across vendors, so treat it as low-cost and optional.
- Make sure all content is in the static HTML (no JS-rendered content), since many AI crawlers don't run JavaScript.
- Build entity consistency: the same name, description and facts across the site, Google Business Profile, Tripadvisor, social, and directories. LLMs cite what multiple sources agree on.
- Earn citations: guest posts and listings on climbing sites, Tenerife tourism sites, Reddit/forum answers (honestly disclosed), UKClimbing, and local press. AI answers lean on third-party mentions, not only the brand's own site.
- Publish reference content others will cite: a grade-conversion table, a month-by-month conditions guide, an access-rules page.

## 7. Content plan (first 90 days)

Launch (minimum viable, EN + ES):
1. Home, 3–4 experience pages, Arico area page, About, FAQ, Contact, Book
2. Plan pages: best time, what to bring, safety, getting there

Then, in order of expected value: grades guide, "climbing in Tenerife: complete guide" pillar page (links to everything), seasonal pages, per-area pages, DE translations, family page, reviews page, one trip-report/photo-story per month.

## 8. Cloudflare hosting notes

- Cloudflare Pages: free, unlimited bandwidth, global CDN, custom domain and automatic HTTPS. Deploy from a Git repo (GitHub) or via `wrangler pages deploy`.
- `_redirects` and `_headers` files handle redirects and caching, so no server code is needed.
- A contact form needs a third-party service or a Pages Function (still free within limits). Alternatively use Kinecall or WhatsApp/email links and avoid a form.
- Buy the domain (e.g. rocatrips.com) before launch and check that it, and the Instagram/Google Business names, are available.

## 9. Open questions for you

1. Exact offerings, prices, durations, group sizes, languages and meeting points (the IA assumes the list in §2).
2. Which crags do you guide at, and do you have permits where needed?
3. Guide qualifications (IFMGA, Spanish TD2/TD3, etc.) and insurance, which are key trust and SEO content.
4. Languages to launch with (suggested EN + ES, then DE).
5. Kinecall details: embed or link, one page per experience, or one global page?
6. Domain name, and whether a Google Business Profile exists.
7. Photos: how many, and do they come with location and subject info (useful for alt text and area pages)?

## Sources
- [Ocho Escalada](https://ocho-escalada.com/en/) (site navigation read directly; climbingintenerife.com serves the same content)
- [Yumping: EL Ocho Escalada](https://www.yumping.com/en/multiadventure/el-ocho-escalada--e19692254)
- [theCrag: Tenerife](https://www.thecrag.com/en/climbing/spain/tenerife)
- [27crags: Arico](https://27crags.com/crags/arico/description)
- [Clicatour: Tenerife guided rock climbing](https://www.clicatour.com/en/excursion/spain/tenerife/tenerife-guided-rock-climbing-1779148826)
- [Manawa: guided climbing in Adeje](https://manawa.com/en/book/13423)
- [ClimbingAway: Escalada en Tenerife](https://climbingaway.fr/en/travel/climbing-guide-books/escalada-en-tenerife)
- [Turismo de Tenerife: Climbing](https://www.webtenerife.co.uk/tenerifecb/activities/amongst-nature/escalada)
