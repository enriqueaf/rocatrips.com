// Photo for every page. Each content entry may set `image: <photo-name>` in its
// frontmatter (a file name in src/assets/photos without extension); otherwise it
// gets the default below, by translationKey, then by collection.
//
// PLACEHOLDERS: the current photos are free Unsplash images (see
// src/assets/photos/CREDITS.md). Climbing shots are NOT from Tenerife — replace
// them with Rocatrips' own photos before launch. Landscapes of Teide are real.
import type { ImageMetadata } from 'astro';
import type { AnyEntry } from './routes';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true });
const photos: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(files).map(([p, m]) => [p.split('/').pop()!.replace(/\.\w+$/, ''), m.default]),
);

// Alt text describes what is actually in each photo (not the page topic).
const alts: Record<string, string> = {
  'climber-yellow': 'Climber in a yellow shirt on a steep limestone wall',
  'climber-overhang': 'Climber high on an overhanging orange rock face',
  'climber-helmet': 'Climber wearing a helmet on a vertical rock wall',
  'climber-boulder': 'Climber bouldering on a sandstone wall',
  'crag-forest': 'Granite crag above a pine forest under blue sky',
  'basalt-wall': 'Tall columnar volcanic rock wall above green slopes',
  'teide-summit': 'Mount Teide summit and its volcanic slopes, Tenerife',
  'teide-roques': 'Roque Cinchado with Mount Teide behind, Teide National Park',
  'teide-lava': 'Lava fields and mountains in Teide National Park',
  'teide-signpost': 'Roques de García signpost with Teide in the background',
  'coast-cliffs': 'Layered volcanic sea cliffs on the Tenerife coast',
};

const byKey: Record<string, string> = {
  home: 'climber-yellow',
  experiences: 'climber-overhang',
  'exp-beginners': 'climber-helmet',
  'exp-families': 'crag-forest',
  'exp-courses': 'climber-boulder',
  'exp-sport': 'climber-yellow',
  'exp-multipitch': 'climber-overhang',
  'exp-private': 'basalt-wall',
  areas: 'teide-roques',
  'area-capricho': 'teide-lava',
  'area-dws': 'coast-cliffs',
  'area-bouldering': 'climber-boulder',
  'area-guaria': 'basalt-wall',
  'area-arico': 'climber-yellow',
  guides: 'teide-summit',
  plan: 'teide-signpost',
  about: 'crag-forest',
  contact: 'teide-summit',
  book: 'climber-helmet',
};

const byCollection: Record<string, string[]> = {
  areas: ['basalt-wall', 'teide-roques', 'crag-forest', 'teide-lava'],
  guides: ['teide-summit', 'teide-lava', 'teide-roques'],
  experiences: ['climber-yellow', 'climber-helmet'],
  pages: ['teide-signpost', 'teide-roques', 'teide-summit', 'teide-lava'],
};

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export interface Photo { src: ImageMetadata; alt: string; }

export function photo(name: string): Photo {
  return { src: photos[name] ?? photos['teide-roques'], alt: alts[name] ?? '' };
}

export function photoFor(entry: AnyEntry): Photo {
  const d = entry.data as { image?: string; translationKey: string };
  if (d.image && photos[d.image]) return photo(d.image);
  const key = byKey[d.translationKey];
  if (key) return photo(key);
  const pool = byCollection[entry.collection] ?? byCollection.pages;
  return photo(pool[hash(d.translationKey) % pool.length]);
}
