// Converts content entries to clean Markdown for AI assistants
// (/llms.txt, /llms-full.txt and the per-page index.md files).
//
// Rules:
// - Anything still marked TODO is dropped, so placeholders never reach an AI.
// - Relative links become absolute, so citations point to the real page.
// - HTML comments and tags are stripped.
import { site } from '../site.config';
import { levelLabels, ui, type Locale } from '../i18n';
import { byKey, type AnyEntry } from './routes';

export const abs = (path: string) => new URL(path, site.url).toString();

/** URL of the Markdown version of a page. */
export const mdPath = (path: string) => `${path}index.md`;

const hasTodo = (v: unknown) => typeof v === 'string' && /TODO/i.test(v);
const ok = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '' && !hasTodo(v);

/** Clean a Markdown body for machine reading. */
export function cleanBody(md = ''): string {
  return `${md}\n`
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<span class="todo">[\s\S]*?<\/span>/g, '')
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .filter((l) => !/TODO/i.test(l))
    .join('\n')
    .replace(/\]\(\//g, `](${site.url}/`)
    .replace(/^(#{1,6} .+)\n+(?=#{1,6} |\s*$)/gm, '') // drop headings left with no content
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function factLines(entry: AnyEntry): string[] {
  const lang = entry.data.lang as Locale;
  const t = ui[lang];
  const facts: [string, unknown][] = [];
  if (entry.collection === 'experiences') {
    const e = entry.data;
    facts.push(
      [t.from, e.priceFrom != null ? `€${e.priceFrom} per person` : t.priceOnRequest],
      [t.duration, e.duration],
      [t.level, levelLabels[lang][e.level]],
      [t.groupSize, e.groupSize],
      [t.languages, e.languages.join(', ')],
      [t.meetingPoint, e.meetingPoint],
      [t.season, e.season],
      [t.requirements, e.requirements.filter(ok).join('; ')],
      [t.included, e.includes.filter(ok).join(', ')],
      [t.bring, e.bring.filter(ok).join(', ')],
      ['Booking', e.kinecallUrl ?? site.kinecall.bookingUrl],
    );
  }
  if (entry.collection === 'areas') {
    const a = entry.data;
    facts.push(
      ['Region', a.region],
      ['Routes', a.routes],
      ['Grades', a.grades],
      ['Style', a.style.join(', ')],
      ['Approach', a.approach],
      ['Altitude', a.altitude],
      ['Aspect', a.aspect],
      [t.season, a.bestSeason],
      [a.permit ? `Access (${t.permit})` : 'Access', a.access],
      ['Coordinates', a.geo ? `${a.geo.lat}, ${a.geo.lng}` : undefined],
    );
  }
  return facts.filter(([, v]) => ok(v)).map(([k, v]) => `- **${k}:** ${v}`);
}

/** Full Markdown document for one page. `level` shifts headings when concatenating. */
export async function entryToMarkdown(entry: AnyEntry, { level = 1 } = {}): Promise<string> {
  const d = entry.data;
  const lang = d.lang as Locale;
  const h = (n: number) => '#'.repeat(Math.min(level + n - 1, 6));
  const out: string[] = [];

  out.push(`${h(1)} ${d.h1 ?? d.title}`, '');
  const summary = 'summary' in d ? d.summary : d.description;
  if (ok(summary)) out.push(`> ${summary}`, '');
  out.push(`URL: ${abs(d.path)}`, `Last updated: ${d.updated.toISOString().slice(0, 10)}`, `Language: ${lang}`, '');

  const facts = factLines(entry);
  if (facts.length) out.push(...facts, '');

  let body = cleanBody(entry.body);
  if (level > 1) body = body.replace(/^(#{1,6}) /gm, (_, hs: string) => `${'#'.repeat(Math.min(hs.length + level - 1, 6))} `);
  if (body) out.push(body, '');

  if (entry.collection === 'areas' && entry.data.links.length) {
    out.push(`${h(2)} Topos and references`, '', ...entry.data.links.map((l) => `- [${l.label}](${l.url})`), '');
  }

  const faq = d.faq.filter((f) => ok(f.a) && ok(f.q));
  if (faq.length) {
    out.push(`${h(2)} ${ui[lang].faq}`, '');
    let group: string | undefined;
    for (const f of faq) {
      if (f.group && f.group !== group) out.push(`${h(3)} ${(group = f.group)}`, '');
      out.push(`**${f.q}**`, f.a, '');
    }
  }

  const relatedKeys =
    entry.collection === 'experiences'
      ? [...entry.data.areas, ...entry.data.related]
      : entry.collection === 'areas'
        ? entry.data.experiences
        : entry.collection === 'guides'
          ? entry.data.related
          : [];
  const related = (await Promise.all(relatedKeys.map((k) => byKey(k, lang)))).filter((e): e is AnyEntry => !!e);
  if (related.length) {
    out.push(`${h(2)} ${ui[lang].related}`, '', ...related.map((r) => `- [${r.data.h1 ?? r.data.title}](${abs(r.data.path)})`), '');
  }

  // Same CTA as the HTML page, so AI answers built from this page point to us.
  if (entry.collection !== 'pages' || entry.data.cta) {
    const t = ui[lang];
    out.push(`${h(2)} ${t.ctaTitle}`, '', `${t.ctaText} ${t.book}: ${site.kinecall.bookingUrl} · ${abs(lang === 'en' ? '/climbing-tenerife/' : `/${lang}/`)}`, '');
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

export const markdownResponse = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
