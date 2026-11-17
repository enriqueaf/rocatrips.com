export const locales = ['en', 'es', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
};

export const ui = {
  en: {
    book: 'Book now',
    requirements: 'Requirements',
    ctaTitle: 'Want to climb in Tenerife?',
    ctaText: 'Climb with Rocatrips. Local guides, all the gear, and the right crag for your level and the day\'s weather.',
    ctaButton: 'See experiences & book',
    ctaContact: 'Ask us anything',
    permit: 'Permit required',
    from: 'From',
    duration: 'Duration',
    groupSize: 'Group size',
    level: 'Level',
    languages: 'Languages',
    meetingPoint: 'Meeting point',
    season: 'Season',
    included: "What's included",
    bring: 'What to bring',
    faq: 'Frequently asked questions',
    related: 'Related experiences',
    updated: 'Last updated',
    climbHere: 'Climb here with us',
    readMore: 'Read more',
    priceOnRequest: 'Price on request',
  },
  es: {
    book: 'Reservar',
    requirements: 'Requisitos',
    ctaTitle: '¿Quieres escalar en Tenerife?',
    ctaText: 'Escala con Rocatrips. Guías locales, todo el material y la zona adecuada para tu nivel y el tiempo del día.',
    ctaButton: 'Ver actividades y reservar',
    ctaContact: 'Pregúntanos',
    permit: 'Requiere permiso',
    from: 'Desde',
    duration: 'Duración',
    groupSize: 'Tamaño del grupo',
    level: 'Nivel',
    languages: 'Idiomas',
    meetingPoint: 'Punto de encuentro',
    season: 'Temporada',
    included: 'Qué incluye',
    bring: 'Qué llevar',
    faq: 'Preguntas frecuentes',
    related: 'Otras experiencias',
    updated: 'Última actualización',
    climbHere: 'Escala aquí con nosotros',
    readMore: 'Leer más',
    priceOnRequest: 'Precio a consultar',
  },
  de: {
    book: 'Jetzt buchen',
    requirements: 'Voraussetzungen',
    ctaTitle: 'Klettern auf Teneriffa?',
    ctaText: 'Klettere mit Rocatrips. Lokale Guides, komplette Ausrüstung und der richtige Fels für dein Niveau und das Wetter des Tages.',
    ctaButton: 'Angebote ansehen & buchen',
    ctaContact: 'Frag uns',
    permit: 'Genehmigung nötig',
    from: 'Ab',
    duration: 'Dauer',
    groupSize: 'Gruppengröße',
    level: 'Niveau',
    languages: 'Sprachen',
    meetingPoint: 'Treffpunkt',
    season: 'Saison',
    included: 'Inklusive',
    bring: 'Mitbringen',
    faq: 'Häufige Fragen',
    related: 'Weitere Erlebnisse',
    updated: 'Zuletzt aktualisiert',
    climbHere: 'Hier mit uns klettern',
    readMore: 'Mehr lesen',
    priceOnRequest: 'Preis auf Anfrage',
  },
} satisfies Record<Locale, Record<string, string>>;

export const levelLabels: Record<Locale, Record<string, string>> = {
  en: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', all: 'All levels' },
  es: { beginner: 'Iniciación', intermediate: 'Intermedio', advanced: 'Avanzado', all: 'Todos los niveles' },
  de: { beginner: 'Anfänger', intermediate: 'Fortgeschritten', advanced: 'Experten', all: 'Alle Niveaus' },
};

// Main navigation, by translationKey. Links resolve to the page with that key in
// the current language (falls back to English if it isn't translated yet).
export const mainNav = ['experiences', 'areas', 'plan', 'guides', 'about', 'contact'] as const;
export const footerNav = ['where-to-stay', 'shops', 'topos', 'access', 'costa-adeje', 'faq', 'reviews', 'gallery', 'book', 'privacy', 'terms', 'cancellation', 'cookies', 'legal-notice'] as const;
