// JSON-LD builders (schema.org). Only emit facts that are true and visible on the page.
import { site } from '../site.config';
import type { AnyEntry } from './routes';

const abs = (path: string) => new URL(path, site.url).toString();

export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'SportsActivityLocation'],
    '@id': `${site.url}/#org`,
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email || undefined,
    telephone: site.phone || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: { '@type': 'Place', name: 'Tenerife, Canary Islands, Spain' },
    ...(site.trust.foundedYear ? { foundingDate: String(site.trust.foundedYear) } : {}),
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function breadcrumbList(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: abs(t.path) })),
  };
}

export function faqPage(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function forEntry(entry: AnyEntry, bookUrl: string): object[] {
  const d = entry.data;
  const out: object[] = [];
  if (entry.collection === 'experiences') {
    const e = entry.data as Extract<AnyEntry, { collection: 'experiences' }>['data'];
    out.push({
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: d.h1 ?? d.title,
      description: e.summary,
      url: abs(d.path),
      inLanguage: d.lang,
      touristType: e.level,
      provider: { '@id': `${site.url}/#org` },
      ...(e.durationISO ? { duration: e.durationISO } : {}),
      ...(e.priceFrom != null
        ? {
            offers: {
              '@type': 'Offer',
              price: e.priceFrom,
              priceCurrency: 'EUR',
              url: bookUrl,
              availability: 'https://schema.org/InStock',
            },
          }
        : {}),
    });
  }
  if (entry.collection === 'areas') {
    const a = entry.data as Extract<AnyEntry, { collection: 'areas' }>['data'];
    out.push({
      '@context': 'https://schema.org',
      '@type': 'TouristAttraction',
      name: d.h1 ?? d.title,
      description: a.summary,
      url: abs(d.path),
      ...(a.geo ? { geo: { '@type': 'GeoCoordinates', latitude: a.geo.lat, longitude: a.geo.lng } } : {}),
      containedInPlace: { '@type': 'Place', name: 'Tenerife' },
    });
  }
  if (entry.collection === 'guides') {
    const g = entry.data as Extract<AnyEntry, { collection: 'guides' }>['data'];
    out.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: d.h1 ?? d.title,
      description: g.summary,
      datePublished: g.published.toISOString(),
      dateModified: d.updated.toISOString(),
      inLanguage: d.lang,
      author: { '@type': 'Organization', name: g.author },
      publisher: { '@id': `${site.url}/#org` },
      mainEntityOfPage: abs(d.path),
    });
  }
  if (d.faq.length) out.push(faqPage(d.faq));
  return out;
}
