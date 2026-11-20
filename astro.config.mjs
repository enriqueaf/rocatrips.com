// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: confirm final domain before launch.
const SITE = 'https://rocatrips.enriqueaf.workers.dev'; // move to https://rocatrips.com once the domain is on Cloudflare

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', es: 'es', de: 'de', fr: 'fr' },
      },
    }),
  ],
});
