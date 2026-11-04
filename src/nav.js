// The header menu and the in-app links in sheet text share this list, so the two can't drift.
export const navLinks = [
  { to: '/', key: 'nav.home' },
  { to: '/schema', key: 'nav.schedule' },
  { to: '/grupper', key: 'nav.groups' },
  { to: '/tranare', key: 'nav.coaches' },
  { to: '/prova-pa', key: 'nav.trial' },
  { to: '/fragor', key: 'nav.faq' },
  { to: '/evenemang', key: 'nav.events' },
  { to: '/bilder', key: 'nav.albums' },
  { to: '/kontakt', key: 'nav.contact' },
]

// In-app link targets: the header pages plus footer-only pages like /dokument and /integritet,
// so sheet text can link to them without the header changing.
export const linkTargets = [
  ...navLinks,
  // The old results route redirects to /evenemang, but sheet text may still link to it.
  { to: '/resultat', key: 'nav.events' },
  { to: '/dokument', key: 'nav.documents' },
  { to: '/integritet', key: 'privacy.title' },
]
