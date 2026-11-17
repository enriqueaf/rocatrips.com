import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, type Locale } from '../i18n';

export type Kind = 'pages' | 'experiences' | 'areas' | 'guides';
export type AnyEntry =
  | CollectionEntry<'pages'>
  | CollectionEntry<'experiences'>
  | CollectionEntry<'areas'>
  | CollectionEntry<'guides'>;

let cache: AnyEntry[] | null = null;

/** All published entries across collections. */
export async function allEntries(): Promise<AnyEntry[]> {
  if (cache) return cache;
  const published = ({ data }: { data: { draft: boolean } }) => import.meta.env.DEV || !data.draft;
  const lists = await Promise.all([
    getCollection('pages', published),
    getCollection('experiences', published),
    getCollection('areas', published),
    getCollection('guides', published),
  ]);
  const entries = lists.flat() as AnyEntry[];

  // Fail the build on duplicate URLs or duplicate lang+key pairs.
  const seenPath = new Map<string, string>();
  const seenKey = new Map<string, string>();
  for (const e of entries) {
    const id = `${e.collection}/${e.id}`;
    const k = `${e.data.lang}:${e.data.translationKey}`;
    if (seenPath.has(e.data.path)) throw new Error(`Duplicate path ${e.data.path}: ${id} and ${seenPath.get(e.data.path)}`);
    if (seenKey.has(k)) throw new Error(`Duplicate translationKey ${k}: ${id} and ${seenKey.get(k)}`);
    seenPath.set(e.data.path, id);
    seenKey.set(k, id);
    if (e.data.lang !== defaultLocale && !e.data.path.startsWith(`/${e.data.lang}/`))
      throw new Error(`${id}: ${e.data.lang} paths must start with /${e.data.lang}/`);
  }
  cache = entries;
  return entries;
}

export async function byKey(key: string, lang: Locale): Promise<AnyEntry | undefined> {
  const entries = await allEntries();
  return (
    entries.find((e) => e.data.translationKey === key && e.data.lang === lang) ??
    entries.find((e) => e.data.translationKey === key && e.data.lang === defaultLocale)
  );
}

/** Same page in every available language (for hreflang + language switcher). */
export async function translations(entry: AnyEntry): Promise<AnyEntry[]> {
  const entries = await allEntries();
  return entries.filter((e) => e.data.translationKey === entry.data.translationKey);
}

export async function listing<K extends Kind>(kind: K, lang: Locale) {
  const entries = await allEntries();
  return entries
    .filter((e) => e.collection === kind && e.data.lang === lang)
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title)) as Extract<
    AnyEntry,
    { collection: K }
  >[];
}

/** Breadcrumb trail built from URL segments that exist as pages. */
export async function breadcrumbs(entry: AnyEntry): Promise<{ name: string; path: string }[]> {
  const entries = await allEntries();
  const segs = entry.data.path.split('/').filter(Boolean);
  const trail: { name: string; path: string }[] = [];
  const homePath = entry.data.lang === defaultLocale ? '/' : `/${entry.data.lang}/`;
  const home = entries.find((e) => e.data.path === homePath);
  if (home) trail.push({ name: home.data.navLabel ?? 'Home', path: homePath });
  let acc = '/';
  for (const s of segs) {
    acc += `${s}/`;
    if (acc === homePath) continue;
    const hit = entries.find((e) => e.data.path === acc);
    if (hit) trail.push({ name: hit.data.navLabel ?? hit.data.title, path: acc });
  }
  return trail;
}

export function bookingUrl(entry: AnyEntry, fallback: string): string {
  const url = entry.collection === 'experiences' && entry.data.kinecallUrl ? entry.data.kinecallUrl : fallback;
  // UTM tags so bookings can be attributed to pages in Kinecall / analytics.
  const u = new URL(url);
  u.searchParams.set('utm_source', 'rocatrips.com');
  u.searchParams.set('utm_medium', 'website');
  u.searchParams.set('utm_campaign', entry.data.translationKey);
  return u.toString();
}
