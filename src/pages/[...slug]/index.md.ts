// Markdown twin of every HTML page: /path/ → /path/index.md
// Linked from each page's <head> via <link rel="alternate" type="text/markdown">.
import type { APIRoute } from 'astro';
import { allEntries, type AnyEntry } from '../../lib/routes';
import { entryToMarkdown, markdownResponse } from '../../lib/markdown';

export async function getStaticPaths() {
  const entries = await allEntries();
  return entries.map((entry) => ({
    params: { slug: entry.data.path.replace(/^\/|\/$/g, '') || undefined },
    props: { entry },
  }));
}

export const GET: APIRoute = async ({ props }) => markdownResponse(await entryToMarkdown((props as { entry: AnyEntry }).entry));
