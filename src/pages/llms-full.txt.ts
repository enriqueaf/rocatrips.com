// /llms-full.txt: every English page as Markdown in one file, so an assistant
// can load the whole site in a single request. Order: experiences → areas →
// planning → guides → other pages (most useful first, in case of truncation).
import type { APIRoute } from 'astro';
import { listing } from '../lib/routes';
import { entryToMarkdown } from '../lib/markdown';
import { site } from '../site.config';

export const GET: APIRoute = async () => {
  const [experiences, areas, guides, pages] = await Promise.all([
    listing('experiences', 'en'),
    listing('areas', 'en'),
    listing('guides', 'en'),
    listing('pages', 'en'),
  ]);
  const legal = (p: (typeof pages)[number]) => p.data.path.startsWith('/legal/');
  const plan = pages.filter((p) => p.data.path.startsWith('/plan-your-trip/'));
  const rest = pages.filter((p) => !plan.includes(p) && !legal(p));
  const ordered = [...rest.filter((p) => p.data.path === '/'), ...experiences, ...areas, ...plan, ...guides, ...rest.filter((p) => p.data.path !== '/')];

  const docs = await Promise.all(ordered.map((e) => entryToMarkdown(e, { level: 2 })));
  const body = [
    `# ${site.name}: full site content`,
    '',
    `> ${site.description}`,
    '',
    `Source: ${site.url}. Generated ${new Date().toISOString().slice(0, 10)}. Each section below is one page; cite the URL given in each section.`,
    '',
    ...docs.flatMap((d) => [d, '---', '']),
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
