import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every routable entry carries its own URL (`path`) and a `translationKey` that
// links the same page across languages (used for hreflang + language switcher).
const base = {
  lang: z.enum(['en', 'es', 'de']),
  path: z.string().regex(/^\/(.*\/)?$/, 'path must start and end with "/"'),
  translationKey: z.string(),
  title: z.string(), // <title> — primary keyword first, max ~60 chars
  h1: z.string().optional(), // defaults to title
  description: z.string().max(170), // meta description
  navLabel: z.string().optional(), // short label for nav/breadcrumbs
  updated: z.coerce.date(),
  draft: z.boolean().default(false),
  order: z.number().default(100),
  // `group` is optional; when present the FAQ renders under group headings.
  faq: z.array(z.object({ q: z.string(), a: z.string(), group: z.string().optional() })).default([]),
};

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    ...base,
    // Which listing (if any) the page renders under its body.
    summary: z.string().optional(), // optional lead paragraph shown under the h1
    template: z.enum(['home', 'experiences-hub', 'areas-hub', 'plan-hub', 'guides-hub', 'basic']).default('basic'),
    cta: z.boolean().default(true), // show the "climb with Rocatrips" block
    image: z.string().optional(), // photo name in src/assets/photos (see src/lib/images.ts)
    // Home-style visual sections. Also emitted in the Markdown twin, so keep the
    // wording self-contained (no links inside `text`; use `href`).
    stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    sections: z
      .array(
        z.object({
          id: z.string(), // where the template places it: 'tenerife' | 'why-us'
          heading: z.string(),
          intro: z.string().optional(),
          items: z.array(z.object({ title: z.string(), text: z.string(), image: z.string().optional(), href: z.string().optional() })),
          link: z.object({ label: z.string(), href: z.string() }).optional(),
        }),
      )
      .default([]),
  }),
});

const experiences = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experiences' }),
  schema: z.object({
    ...base,
    summary: z.string(), // 1–2 sentence direct answer, shown at top and in cards
    level: z.enum(['beginner', 'intermediate', 'advanced', 'all']),
    duration: z.string(), // e.g. "4 hours"
    durationISO: z.string().optional(), // e.g. "PT4H" for schema.org
    priceFrom: z.number().nullable().default(null), // EUR per person; null = on request
    groupSize: z.string().optional(),
    languages: z.array(z.string()).default(['English', 'Español']),
    meetingPoint: z.string().optional(),
    season: z.string().optional(),
    requirements: z.array(z.string()).default([]), // prerequisites ("Voraussetzungen")
    includes: z.array(z.string()).default([]),
    bring: z.array(z.string()).default([]),
    areas: z.array(z.string()).default([]), // area translationKeys
    related: z.array(z.string()).default([]), // experience translationKeys
    kinecallUrl: z.url().optional(), // deep link; falls back to site default
    image: z.string().optional(), // TODO: hero photo path once photos arrive
  }),
});

const areas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/areas' }),
  schema: z.object({
    ...base,
    summary: z.string(),
    region: z.string(),
    routes: z.string().optional(), // e.g. "250+ bolted routes"
    grades: z.string().optional(), // e.g. "4 to 8b"
    style: z.array(z.string()).default([]),
    approach: z.string().optional(),
    altitude: z.string().optional(),
    aspect: z.string().optional(),
    permit: z.boolean().default(false), // true → permit/reservation needed before climbing
    bestSeason: z.string().optional(),
    access: z.string().optional(), // permits / restrictions
    geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
    links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    experiences: z.array(z.string()).default([]),
    image: z.string().optional(),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    ...base,
    summary: z.string(),
    published: z.coerce.date(),
    author: z.string().default('Rocatrips'),
    related: z.array(z.string()).default([]),
    image: z.string().optional(),
  }),
});

export const collections = { pages, experiences, areas, guides };
