// Everything the club may need to change without touching the code lives here.
// Schedule, groups, prices and coaches come from the Google Sheet, not this file.

export default {
  clubName: 'Ronneby Boxing Team',

  contact: {
    email: '', // e.g. 'info@ronnebyboxingteam.se'
    phone: '', // e.g. '070-123 45 67'
    venue: '', // e.g. 'Brunnsskolans idrottshall'
    street: '',
    city: 'Ronneby',
  },

  social: {
    facebookUrl: '', // e.g. 'https://www.facebook.com/ronnebyboxingteam'
    instagramHandle: '', // without @
    beholdFeedId: '', // optional: Instagram feed widget from behold.so
  },

  // Google Sheet. See SETUP.md.
  // Leave publishedId empty to run the site on the built-in example data.
  sheet: {
    // From File → Share → Publish to web: the part after /d/e/ in the published link.
    publishedId: '2PACX-1vSv3fk09GQNw3f3sSabP-17IRBIK5D_siGON8tu4oViVSzFlMYuS9whgvJjDWQPjQvRWuo9ckxnv-Ry',
    // The gid of each tab (the number after #gid= in the address bar when the tab is open).
    gids: {
      seasons: '956987468',
      groups: '1580659590',
      schedule: '1346523284',
      coaches: '1513447874',
    },
  },
}
