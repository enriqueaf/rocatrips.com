// Single source of truth for business facts. Keep these identical to the
// Google Business Profile, Tripadvisor and directory listings (entity consistency
// matters for both Google and AI assistants).
export const site = {
  name: 'Rocatrips',
  url: 'https://rocatrips.com', // TODO: confirm domain
  tagline: 'Guided rock climbing in Tenerife',
  description:
    'Small-group guided rock climbing days, courses and multi-pitch routes in Tenerife, Canary Islands. Gear included, all levels.',
  email: 'hello@rocatrips.com', // TODO
  phone: '', // TODO: E.164 format, e.g. +34600000000
  whatsapp: '', // TODO
  address: {
    locality: 'Arico', // TODO: confirm base location
    region: 'Santa Cruz de Tenerife',
    country: 'ES',
  },
  geo: { lat: 28.166, lng: -16.48 }, // TODO: approximate Arico, replace with meeting point
  kinecall: {
    // TODO: replace with the real Kinecall booking page. Experiences can override
    // this with their own `kinecallUrl` deep link.
    bookingUrl: 'https://kinecall.com/',
  },
  // Trust facts: the "why climb with us" proof shown in the trust bar (experience
  // pages, experiences hub, home, about), in LocalBusiness JSON-LD and in llms.txt.
  // Only fill in what you can prove. Empty values are hidden on the live site and
  // show as TODO in `npm run dev`.
  trust: {
    foundedYear: null as number | null, // TODO: year Rocatrips the company was founded (emitted as foundingDate)
    guidingSince: 2014, // Pablo Vicens: 12 years as a professional climbing guide (as of 2026)
    leadGuide: 'Pablo Vicens',
    qualification: 'Técnico Deportivo Superior en Escalada (TD3)',
    firstAid: true, // guide holds a current first-aid certificate
    maxClimbersPerGuide: 2,
    insured: true, // civil liability + accident insurance, up to date
    activeTourismRegistered: true, // registered active-tourism company, Canary Islands
    registrationNumber: '', // TODO: Canary Islands active-tourism registration number
    climbersGuided: '', // TODO: e.g. '3,000+' (people guided, all time)
  },
  social: {
    instagram: '', // TODO
    tripadvisor: '', // TODO
    googleBusiness: '', // TODO
  },
} as const;

// Legal identity for the Aviso Legal (required by Spanish LSSI law) and privacy policy.
export const legal = {
  holder: '', // registered owner (person or company name)
  taxId: '', // NIF / CIF
  address: '', // registered address
} as const;
