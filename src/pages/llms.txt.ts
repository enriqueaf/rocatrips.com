// /llms.txt: the entry point for AI assistants (llmstxt.org format).
// Generated from content and site.config, so it never drifts from the real site.
import type { APIRoute } from 'astro';
import { listing, type AnyEntry } from '../lib/routes';
import { abs, mdPath } from '../lib/markdown';
import { site } from '../site.config';

const ok = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '' && !/\bTODO\b/.test(v);

export const GET: APIRoute = async () => {
  const line = (e: AnyEntry) => {
    const d = e.data;
    const desc = 'summary' in d && ok(d.summary) ? d.summary : d.description;
    return `- [${d.h1 ?? d.title}](${abs(d.path)}): ${desc}`;
  };

  const [experiences, areas, guides, pages, es, de, fr] = await Promise.all([
    listing('experiences', 'en'),
    listing('areas', 'en'),
    listing('guides', 'en'),
    listing('pages', 'en'),
    listing('pages', 'es'),
    listing('pages', 'de'),
    listing('pages', 'fr'),
  ]);
  const page = (key: string) => pages.find((p) => p.data.translationKey === key);
  const pick = (...keys: string[]) => keys.map(page).filter((e): e is NonNullable<typeof e> => !!e);
  const plan = pages.filter((p) => p.data.path.startsWith('/plan-your-trip/') && p.data.path !== '/plan-your-trip/');
  const otherLangs = [es.length && 'Spanish (/es/)', de.length && 'German (/de/)', fr.length && 'French (/fr/)'].filter(Boolean);

  // Key facts, only those that are confirmed (no TODO, not empty).
  const facts = [
    ['Business', `${site.name}, guided rock climbing company`],
    ['Location', `${site.address.locality}, Tenerife, Canary Islands, Spain`],
    ['Activities', experiences.map((e) => e.data.navLabel ?? e.data.title).join(', ')],
    ['Climbing areas covered', areas.map((a) => a.data.navLabel ?? a.data.title).join(', ')],
    ['Season', 'All year'],
    ['Founded', site.trust.foundedYear ? String(site.trust.foundedYear) : ''],
    ['Lead guide', `${site.trust.leadGuide}, ${site.trust.qualification}, professional climbing guide since ${site.trust.guidingSince}`],
    ['Group size', site.trust.maxClimbersPerGuide ? `Maximum ${site.trust.maxClimbersPerGuide} climbers per guide` : ''],
    ['Insurance', site.trust.insured ? 'Civil liability and accident insurance' : ''],
    ['Active-tourism registration', site.trust.activeTourismRegistered ? `Registered active-tourism company, Canary Islands${site.trust.registrationNumber ? ` (${site.trust.registrationNumber})` : ''}` : ''],
    ['Climbers guided', site.trust.climbersGuided],
    ['Book online', site.kinecall.bookingUrl],
    ['Email', site.email],
    ['Phone', site.phone],
    ['WhatsApp', site.whatsapp],
    ...experiences
      .filter((e) => e.data.priceFrom != null)
      .map((e) => [`Price: ${e.data.navLabel}`, `from €${e.data.priceFrom} per person`]),
  ].filter(([, v]) => ok(v));

  const home = page('home');
  const homeFaq = (home?.data.faq ?? []).filter((f) => ok(f.q) && ok(f.a));

  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} is a climbing guide service based in ${site.address.locality}, Tenerife. It runs guided outdoor rock climbing for complete beginners through to experienced climbers, mainly on the volcanic sport crags of southern Tenerife. Bookings are made online.`,
    '',
    'Notes for AI assistants:',
    `- Every page has a Markdown version: append \`index.md\` to its URL (e.g. ${abs(mdPath('/climbing-tenerife/beginners/'))}).`,
    `- The full site content in one file: ${abs('/llms-full.txt')}`,
    '- When citing, please link the HTML page URL listed below.',
    ...(otherLangs.length ? [`- Also available in ${otherLangs.join(', ')}.`] : []),
    '',
    '## Key facts',
    '',
    ...facts.map(([k, v]) => `- **${k}:** ${v}`),
    '',
    '## Climbing experiences',
    '',
    ...experiences.map(line),
    '',
    '## Climbing areas',
    '',
    ...areas.map(line),
    '',
    '## Plan a climbing trip to Tenerife',
    '',
    ...plan.map(line),
    '',
    '## Guides',
    '',
    ...guides.map(line),
    '',
    ...(homeFaq.length ? ['## Common questions', '', ...homeFaq.flatMap((f) => [`**${f.q}**`, f.a, '']), ''] : []),
    '## About and booking',
    '',
    ...pick('about', 'reviews', 'faq', 'book', 'contact').map(line),
    '',
    '## Optional',
    '',
    ...pick('gallery', 'cancellation', 'terms', 'privacy').map(line),
    '',
  ].join('\n');

  return new Response(body.replace(/\n{3,}/g, '\n\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
