// Only what the site needs before it can read the Google Sheet. All content, including contact
// details and social links (the Klubbinfo tab), comes from the sheet, not this file.

export default {
  clubName: 'Ronneby Boxing Team',

  // Google Sheet. See HOWTO.md, section 4.
  // Leave publishedId empty to run the site on the built-in example data.
  sheet: {
    // From File → Share → Publish to web: the part after /d/e/ in the published link.
    publishedId: '2PACX-1vSv3fk09GQNw3f3sSabP-17IRBIK5D_siGON8tu4oViVSzFlMYuS9whgvJjDWQPjQvRWuo9ckxnv-Ry',
    // The gid of each tab (the number after #gid= in the address bar when the tab is open).
    gids: {
      notices: '1455255462', // empty hides the banner until the Anslag tab exists
      club: '678595018', // Klubbinfo; empty shows "coming soon" for contact details and social links
      trial: '573508208', // Prova på
      faq: '1972595536', // Frågor
      results: '', // Resultat; empty hides the nav link until the tab exists
      seasons: '956987468',
      groups: '1580659590',
      schedule: '1346523284',
      coaches: '1513447874',
    },
  },
}
