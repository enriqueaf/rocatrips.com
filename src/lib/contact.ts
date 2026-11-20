// "Ask us anything" links: open a WhatsApp chat with a prefilled message when
// site.whatsapp is set; otherwise fall back to the contact page.
import { site } from '../site.config';
import type { Locale } from '../i18n';
import { byKey } from './routes';

const greeting: Record<Locale, string> = {
  en: "Hi Rocatrips! I'd like to ask about climbing in Tenerife.",
  es: '¡Hola Rocatrips! Quería preguntar sobre escalar en Tenerife.',
  de: 'Hallo Rocatrips! Ich habe eine Frage zum Klettern auf Teneriffa.',
  fr: "Bonjour Rocatrips ! J'ai une question sur l'escalade à Tenerife.",
};

export interface AskLink { href: string; external: boolean; }

export async function askUsLink(lang: Locale): Promise<AskLink | undefined> {
  const number = site.whatsapp.replace(/\D/g, '');
  if (number) return { href: `https://wa.me/${number}?text=${encodeURIComponent(greeting[lang])}`, external: true };
  const contact = await byKey('contact', lang);
  return contact ? { href: contact.data.path, external: false } : undefined;
}
