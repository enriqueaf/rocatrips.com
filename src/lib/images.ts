// Photo for every page. Each content entry may set `image: <photo-name>` in its
// frontmatter (a file name in src/assets/photos without extension); otherwise it
// gets the default below, by translationKey, then by collection.
//
// Tenerife landscapes and the climbing shots named after a crag (arico-*, tamadaya-*,
// el-rio-*, gorge-*) and pablo-vicens were supplied by Rocatrips. The remaining
// climber-*/crag-forest/basalt-wall shots are Unsplash PLACEHOLDERS, not from
// Tenerife (see src/assets/photos/CREDITS.md).
import type { ImageMetadata } from 'astro';
import type { AnyEntry } from './routes';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true });
const photos: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(files).map(([p, m]) => [p.split('/').pop()!.replace(/\.\w+$/, ''), m.default]),
);

// Alt text describes what is actually in each photo (not the page topic).
const alts: Record<string, string> = {
  // Placeholders (Unsplash, not Tenerife)
  'climber-yellow': 'Climber in a yellow shirt on a steep limestone wall',
  'climber-overhang': 'Climber high on an overhanging orange rock face',
  'climber-helmet': 'Climber wearing a helmet on a vertical rock wall',
  'climber-boulder': 'Climber bouldering on a sandstone wall',
  'crag-forest': 'Granite crag above a pine forest under blue sky',
  'basalt-wall': 'Tall columnar volcanic rock wall above green slopes',
  // Rocatrips climbing days (Tenerife)
  'arico-climber-pockets': 'Climber on pocketed volcanic rock in Arico, Tenerife',
  'arico-climber-blue-sky': 'Climber high on a sunlit volcanic wall in Arico under a blue sky',
  'arico-climber-grey-wall': 'Climber on a top-rope on a tall volcanic wall in Arico',
  'arico-guide-orange-wall': 'Guide pointing out a route on an orange volcanic wall among pines in Arico',
  'tamadaya-gorge-climber': 'Climber on a long wall above the Tamadaya gorge, with the belayer below',
  'tamadaya-belayer-pines': 'Belayer watching a climber on rounded volcanic rock below pine trees in Tamadaya',
  'tamadaya-climber-gorge-view': 'Climber in a blue helmet on a wall above the green Tamadaya gorge',
  'tamadaya-scramble': 'Two climbers in helmets scrambling up volcanic rock in the Tamadaya gorge',
  'gorge-lead-climber': 'Climber leading on grey basalt while the belayer watches from the gorge floor',
  'gorge-belayer-blue-sky': 'Belayer feeding rope to a climber high on a basalt wall under a blue sky',
  'gorge-climber-belayer': 'Climber on a dark basalt wall with the belayer below in a sunny gorge',
  'gorge-young-belayer': 'Young climber in an orange helmet belaying a climber on a basalt wall',
  'el-rio-climber-reservoir': 'Climber in a blue helmet at El Río, with the reservoir below',
  'el-rio-orange-wall': 'Climber on a huge orange rock wall seen from above, Tenerife',
  'pablo-vicens': 'Pablo Vicens, Rocatrips lead guide, on a big wall',
  // Tenerife landscapes
  'teide-roques-morning': 'Roques de García rock towers below Mount Teide in morning light',
  'teide-roques-sunset': 'Roques de García and Mount Teide at sunset, Teide National Park',
  'teide-portrait': 'Mount Teide rising above the Roques de García and the Ucanca plain',
  'anaga-coast-aerial': 'Aerial view of the Anaga coast at Almáciga and Roque de Benijo',
  'anaga-coast-road': 'Coastal road below the Anaga mountains near Taganana',
  'taganana-light': 'Taganana village on a ridge in the Anaga mountains at golden hour',
  'anaga-ridges': 'Green Anaga ridges dropping to the Atlantic, Tenerife',
  'anaga-valley': 'Misty green valley in the Anaga mountains',
  'masca-road': 'Winding road below the cliffs of the Teno massif near Masca',
  'mountain-road-mist': 'Mountain road through green volcanic slopes in the mist',
  'natural-pool': 'Aerial view of a swimmer in a natural rock pool on the volcanic coast',
};

const byKey: Record<string, string> = {
  home: 'tamadaya-gorge-climber',
  experiences: 'tamadaya-climber-gorge-view',
  'exp-beginners': 'tamadaya-scramble',
  'exp-families': 'gorge-young-belayer',
  'exp-courses': 'gorge-lead-climber',
  'exp-sport': 'arico-climber-blue-sky',
  'exp-multipitch': 'el-rio-orange-wall',
  'exp-private': 'arico-guide-orange-wall',
  areas: 'teide-roques-sunset',
  'area-capricho': 'teide-portrait',
  'area-dws': 'natural-pool',
  'area-bouldering': 'climber-boulder',
  'area-guaria': 'masca-road',
  'area-arico': 'arico-climber-pockets',
  'area-tamadaya': 'tamadaya-belayer-pines',
  'area-el-rio': 'el-rio-climber-reservoir',
  guides: 'teide-roques-morning',
  'guide-pillar': 'anaga-ridges',
  'guide-winter': 'teide-portrait',
  'guide-summer': 'anaga-coast-aerial',
  plan: 'anaga-coast-road',
  'best-time': 'teide-roques-morning',
  'getting-there': 'masca-road',
  'where-to-stay': 'taganana-light',
  'costa-adeje': 'anaga-coast-aerial',
  about: 'taganana-light',
  contact: 'anaga-coast-aerial',
  book: 'arico-climber-grey-wall',
  gallery: 'anaga-ridges',
  reviews: 'teide-roques-sunset',
};

const byCollection: Record<string, string[]> = {
  areas: ['teide-roques-morning', 'basalt-wall', 'anaga-valley', 'teide-portrait', 'masca-road'],
  guides: ['teide-roques-morning', 'anaga-ridges', 'teide-portrait'],
  experiences: ['arico-climber-blue-sky', 'gorge-climber-belayer'],
  pages: ['anaga-valley', 'mountain-road-mist', 'anaga-coast-road', 'anaga-ridges', 'taganana-light'],
};

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

// Photos shown on an area page (in this order) and, all together, on /gallery/.
export const areaPhotos: Record<string, string[]> = {
  'area-arico': ['arico-climber-pockets', 'arico-climber-blue-sky', 'arico-climber-grey-wall', 'arico-guide-orange-wall'],
  'area-tamadaya': ['tamadaya-gorge-climber', 'tamadaya-belayer-pines', 'tamadaya-climber-gorge-view', 'tamadaya-scramble'],
  'area-el-rio': ['el-rio-climber-reservoir', 'el-rio-orange-wall'],
};
export const galleryPhotos = [
  ...areaPhotos['area-arico'],
  ...areaPhotos['area-tamadaya'],
  'gorge-lead-climber', 'gorge-belayer-blue-sky', 'gorge-climber-belayer', 'gorge-young-belayer',
  ...areaPhotos['area-el-rio'],
  'pablo-vicens',
];

export interface Photo { src: ImageMetadata; alt: string; }

// Unknown names fail the build, so a renamed or deleted photo can't slip through.
export function photo(name: string): Photo {
  const src = photos[name];
  if (!src) throw new Error(`Unknown photo "${name}": no file src/assets/photos/${name}.jpg`);
  if (!(name in alts)) throw new Error(`Photo "${name}" has no alt text in src/lib/images.ts`);
  return { src, alt: alts[name] };
}

export function photoFor(entry: AnyEntry): Photo {
  const d = entry.data as { image?: string; translationKey: string };
  if (d.image) return photo(d.image);
  const key = byKey[d.translationKey];
  if (key) return photo(key);
  const pool = byCollection[entry.collection] ?? byCollection.pages;
  return photo(pool[hash(d.translationKey) % pool.length]);
}
