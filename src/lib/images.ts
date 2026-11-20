// Photo for every page. Each content entry may set `image: <photo-name>` in its
// frontmatter (a file name in src/assets/photos without extension); otherwise it
// gets the default below, by translationKey, then by collection.
//
// Tenerife landscapes and the climbing shots named after a crag (arico-*, tamadaya-*,
// el-rio-*, gorge-*, taganana-*) and pablo-vicens were supplied by Rocatrips. The remaining
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
  'arico-gorge-climber': 'Climber on a long wall above a gorge in Arico, with the belayer below',
  'arico-belayer-pines': 'Belayer watching a climber on rounded volcanic rock below pine trees in Arico',
  'arico-climber-gorge-view': 'Climber in a blue helmet on a wall above a green gorge in Arico',
  'arico-scramble': 'Two climbers in helmets scrambling up volcanic rock in Arico',
  'tamadaya-gorge-group': 'Climbers and belayers on both walls of the narrow Tamadaya gorge on a sunny day',
  'tamadaya-guide-high-five': 'Guide high-fiving a young climber on the rope in the Tamadaya gorge',
  'tamadaya-parent-belaying-kids': 'Parent in an orange helmet belaying two children climbing side by side in Tamadaya',
  'tamadaya-family-group': 'Child on the rope looking at the camera while family members belay and watch in Tamadaya',
  'tamadaya-family-break': 'Families taking a snack break at the foot of the walls in the Tamadaya gorge',
  'tamadaya-girl-climbing': 'Girl in a blue helmet climbing brown volcanic rock in Tamadaya',
  'tamadaya-reach': 'Young climber in a yellow shirt reaching for a hold in Tamadaya',
  'tamadaya-teen-climber': 'Young climber in a teal helmet on a wall beside a tree in Tamadaya',
  'tamadaya-belay-glasses': 'Smiling young climber in belay glasses giving a thumbs up in Tamadaya',
  'tamadaya-families-crag': 'Parents and children roping up at the foot of a wall in Tamadaya',
  'gorge-lead-climber': 'Climber leading on grey basalt while the belayer watches from the gorge floor',
  'gorge-belayer-blue-sky': 'Belayer feeding rope to a climber high on a basalt wall under a blue sky',
  'gorge-climber-belayer': 'Climber on a dark basalt wall with the belayer below in a sunny gorge',
  'gorge-young-belayer': 'Young climber in an orange helmet belaying a climber on a basalt wall',
  'el-rio-climber-reservoir': 'Climber in a blue helmet at El Río, with the reservoir below',
  'el-rio-orange-wall': 'Climber on a huge orange rock wall seen from above, Tenerife',
  'taganana-multipitch-climber': 'Climber on a multi-pitch route high above Taganana, with the Anaga ridges and the Atlantic behind',
  'multipitch-hanging-belay': 'Climber smiling at a hanging belay on an orange wall above a pine-covered gorge in Tenerife',
  'beginner-lowering-off': 'Climber in a helmet being lowered from the top of a brown volcanic wall in a gorge with cacti',
  'family-kids-crag': 'Parent in an orange helmet handling the rope while children and adults get ready to climb at a volcanic crag',
  'sport-group-lead-climber': 'Climber in a pink top leading a bolted route in a sunny gorge while the group belays and watches',
  'sport-group-belayers': 'Smiling group of climbers belaying and giving thumbs up at the foot of a gorge wall',
  'sport-group-partner-check': 'Two climbers doing a partner check before climbing while another gives a double thumbs up',
  'sport-belayer-lead': 'Belayer paying out rope to a climber in a yellow helmet leading a bolted wall in a sunny gorge',
  'sport-gorge-cardones': 'Climber in a blue helmet starting a route beside cardón cactus in a deep volcanic gorge',
  'sport-lowering-off-smiles': 'Laughing climber being lowered off by a smiling belayer in a green volcanic gorge',
  'arico-lead-pockets': 'Climber in a blue helmet leading a pocketed orange wall in Arico, with pine trees behind',
  'tamadaya-gorge-pair': 'Two climbers waving from the floor of the narrow, high-walled Tamadaya gorge',
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
  home: 'arico-gorge-climber',
  experiences: 'arico-climber-gorge-view',
  'exp-beginners': 'arico-scramble',
  'exp-families': 'family-kids-crag',
  'exp-courses': 'gorge-lead-climber',
  'exp-sport': 'arico-climber-blue-sky',
  'exp-multipitch': 'taganana-multipitch-climber',
  'exp-private': 'arico-guide-orange-wall',
  areas: 'teide-roques-sunset',
  'area-capricho': 'teide-portrait',
  'area-dws': 'natural-pool',
  'area-bouldering': 'climber-boulder',
  'area-guaria': 'masca-road',
  'area-arico': 'arico-climber-pockets',
  'area-tamadaya': 'tamadaya-gorge-group',
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

// Photos shown on an area or experience page (in this order) and, all together, on /gallery/.
export const areaPhotos: Record<string, string[]> = {
  'area-arico': ['arico-climber-pockets', 'arico-climber-blue-sky', 'arico-climber-grey-wall', 'arico-guide-orange-wall', 'arico-gorge-climber', 'arico-belayer-pines', 'arico-climber-gorge-view', 'arico-scramble', 'arico-lead-pockets'],
  'area-tamadaya': [
    'tamadaya-gorge-group', 'tamadaya-guide-high-five', 'tamadaya-parent-belaying-kids', 'tamadaya-family-group',
    'tamadaya-family-break', 'tamadaya-girl-climbing', 'tamadaya-reach', 'tamadaya-teen-climber',
    'tamadaya-belay-glasses', 'tamadaya-families-crag', 'tamadaya-gorge-pair',
  ],
  'area-el-rio': ['el-rio-climber-reservoir', 'el-rio-orange-wall'],
  // Experience pages with their own photo grid (not added to /gallery/ again).
  'exp-sport': ['sport-group-lead-climber', 'sport-group-belayers', 'sport-group-partner-check',
    'sport-belayer-lead', 'sport-gorge-cardones', 'sport-lowering-off-smiles', 'arico-lead-pockets'],
  'exp-families': ['family-kids-crag', 'tamadaya-parent-belaying-kids', 'tamadaya-family-group', 'tamadaya-family-break', 'tamadaya-families-crag', 'tamadaya-belay-glasses'],
};
export const galleryPhotos = [
  ...areaPhotos['area-arico'],
  ...areaPhotos['area-tamadaya'],
  'gorge-lead-climber', 'gorge-belayer-blue-sky', 'gorge-climber-belayer', 'gorge-young-belayer',
  ...areaPhotos['area-el-rio'],
  'sport-group-lead-climber', 'sport-group-belayers', 'sport-group-partner-check',
  'sport-belayer-lead', 'sport-gorge-cardones', 'sport-lowering-off-smiles',
  'taganana-multipitch-climber',
  'multipitch-hanging-belay',
  'beginner-lowering-off',
  'pablo-vicens',
];

export interface Photo { src: ImageMetadata; alt: string; position?: string; }

// Where to anchor a photo when a wide hero crops it (CSS object-position).
// Portrait shots need this to keep the important part in frame.
const positions: Record<string, string> = {
  'taganana-multipitch-climber': 'center 35%',
};

// Unknown names fail the build, so a renamed or deleted photo can't slip through.
export function photo(name: string): Photo {
  const src = photos[name];
  if (!src) throw new Error(`Unknown photo "${name}": no file src/assets/photos/${name}.jpg`);
  if (!(name in alts)) throw new Error(`Photo "${name}" has no alt text in src/lib/images.ts`);
  return { src, alt: alts[name], position: positions[name] };
}

export function photoFor(entry: AnyEntry): Photo {
  const d = entry.data as { image?: string; translationKey: string };
  if (d.image) return photo(d.image);
  const key = byKey[d.translationKey];
  if (key) return photo(key);
  const pool = byCollection[entry.collection] ?? byCollection.pages;
  return photo(pool[hash(d.translationKey) % pool.length]);
}
