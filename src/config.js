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
    // A Page shows its feed (after consent); a group can't be embedded and shows a "join" link.
    facebookUrl: 'https://www.facebook.com/groups/251477413001',
    instagramHandle: '', // without @
    beholdFeedId: '', // optional: Instagram feed widget from behold.so
  },

  // Google Sheet. See HOWTO.md, section 4.
  // Leave publishedId empty to run the site on the built-in example data.
  sheet: {
    // From File → Share → Publish to web: the part after /d/e/ in the published link.
    publishedId: '2PACX-1vSv3fk09GQNw3f3sSabP-17IRBIK5D_siGON8tu4oViVSzFlMYuS9whgvJjDWQPjQvRWuo9ckxnv-Ry',
    // The gid of each tab (the number after #gid= in the address bar when the tab is open).
    gids: {
      notices: '', // empty hides the banner until the Anslag tab exists
      seasons: '956987468',
      groups: '1580659590',
      schedule: '1346523284',
      coaches: '1513447874',
    },
  },
}
